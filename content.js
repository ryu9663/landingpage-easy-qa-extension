// Content Script for Landing Font QA Extension
// Detects visible text elements and renders font spec badges

(function() {
  'use strict';

  // Prevent duplicate execution
  if (window.__LFQA_INITIALIZED__) {
    return;
  }
  window.__LFQA_INITIALIZED__ = true;

  // Constants
  const MAX_BADGES = 800;
  const DEBOUNCE_DELAY = 1000;
  const CONTAINER_ID = 'landing-font-qa-container';

  // State
  let container = null;
  let scrollHandler = null;
  let resizeHandler = null;
  let mutationObserver = null;
  let debounceTimeoutId = null;
  let elementBadgeMap = new Map(); // Maps text elements to their badges
  let hoverCleanupFns = []; // Stores hover listener cleanup functions
  let currentlyHoveredElement = null; // Track currently hovered element
  let pendingRafId = null; // Track pending requestAnimationFrame

  // Debounce utility (uses module-level timeoutId for cleanup)
  function debounce(fn, delay) {
    return function(...args) {
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Check if element is in viewport
  function isInViewport(rect) {
    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < window.innerHeight &&
      rect.left < window.innerWidth
    );
  }

  // Check if element is visible (not hidden)
  function isVisible(element) {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      parseFloat(style.opacity) !== 0
    );
  }

  // Check if element has actual text content
  function hasText(element) {
    // Get direct text content (not from children)
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        return true;
      }
    }
    return false;
  }

  // Check if rect has valid size
  function hasValidSize(rect) {
    return rect.width > 0 && rect.height > 0;
  }

  // Convert rgb/rgba color to hex format
  function rgbToHex(color) {
    // Handle already hex format
    if (color.startsWith('#')) {
      return color.toUpperCase();
    }

    // Parse rgb/rgba
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) {
      return color; // Return as-is if can't parse
    }

    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);

    const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Parse pixel value, returns 0 if not a valid pixel value
  function parsePxValue(value) {
    if (!value || value === 'auto' || value === 'none') return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : Math.round(num);
  }

  // Format box model values (margin/padding), returns empty string if all zeros
  function formatBoxModel(prefix, top, right, bottom, left) {
    const t = parsePxValue(top);
    const r = parsePxValue(right);
    const b = parsePxValue(bottom);
    const l = parsePxValue(left);

    // Skip if all zeros
    if (t === 0 && r === 0 && b === 0 && l === 0) return '';

    const parts = [];
    if (t !== 0) parts.push(`${prefix}t:${t}`);
    if (r !== 0) parts.push(`${prefix}r:${r}`);
    if (b !== 0) parts.push(`${prefix}b:${b}`);
    if (l !== 0) parts.push(`${prefix}l:${l}`);

    return parts.join(' ');
  }

  // Format size info, skips auto values
  function formatSize(width, height) {
    const parts = [];

    // Skip auto, inherit, and percentage values
    if (width && width !== 'auto' && !width.includes('%')) {
      const w = parsePxValue(width);
      if (w > 0) parts.push(`w:${w}px`);
    }

    if (height && height !== 'auto' && !height.includes('%')) {
      const h = parsePxValue(height);
      if (h > 0) parts.push(`h:${h}px`);
    }

    return parts.join(' ');
  }

  // Format layout info - returns object with separate margin, padding, size
  function formatLayoutInfo(style) {
    // Margin
    const margin = formatBoxModel('m', style.marginTop, style.marginRight, style.marginBottom, style.marginLeft);

    // Padding
    const padding = formatBoxModel('p', style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft);

    // Size
    const size = formatSize(style.width, style.height);

    return { margin, padding, size };
  }

  // Format position info (only for positioned elements)
  function formatPositionInfo(style) {
    const pos = style.position;
    // Skip static positioning
    if (!pos || pos === 'static') return '';

    const parts = [`pos:${pos}`];

    // Only add offset values if they're not auto
    const top = style.top;
    const right = style.right;
    const bottom = style.bottom;
    const left = style.left;

    if (top && top !== 'auto') {
      const t = parsePxValue(top);
      if (t !== 0) parts.push(`top:${t}`);
    }
    if (right && right !== 'auto') {
      const r = parsePxValue(right);
      if (r !== 0) parts.push(`right:${r}`);
    }
    if (bottom && bottom !== 'auto') {
      const b = parsePxValue(bottom);
      if (b !== 0) parts.push(`bottom:${b}`);
    }
    if (left && left !== 'auto') {
      const l = parsePxValue(left);
      if (l !== 0) parts.push(`left:${l}`);
    }

    // Only return if we have more than just the position type
    return parts.length > 1 ? parts.join(' ') : '';
  }

  // Find all visible text elements
  function findTextElements() {
    const elements = [];
    const processedElements = new Set();

    // Walk through all elements
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: function(node) {
          // Skip our own container
          if (node.id === CONTAINER_ID || node.closest('#' + CONTAINER_ID)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode()) && elements.length < MAX_BADGES) {
      // Skip if already processed (for deduplication)
      if (processedElements.has(node)) continue;

      // Check visibility
      if (!isVisible(node)) continue;

      // Check if has direct text content
      if (!hasText(node)) continue;

      // Check rect
      const rect = node.getBoundingClientRect();
      if (!hasValidSize(rect)) continue;
      if (!isInViewport(rect)) continue;

      // Add to results
      elements.push({ element: node, rect });
      processedElements.add(node);
    }

    return elements;
  }

  // Create badge element
  function createBadge(element, rect) {
    const style = window.getComputedStyle(element);
    const fontSize = Math.round(parseFloat(style.fontSize));
    const fontWeight = style.fontWeight;
    const color = rgbToHex(style.color);

    const badge = document.createElement('div');
    badge.className = 'lfqa-badge';

    // Create font info row
    const fontRow = document.createElement('div');
    fontRow.className = 'lfqa-badge-font';

    const textSpan = document.createElement('span');
    textSpan.textContent = `${fontSize}px / ${fontWeight} / ${color}`;

    const colorBox = document.createElement('span');
    colorBox.className = 'lfqa-color-box';
    colorBox.style.backgroundColor = color;

    fontRow.appendChild(textSpan);
    fontRow.appendChild(colorBox);
    badge.appendChild(fontRow);

    // Create layout info rows (separate rows for margin, padding, size)
    const layoutInfo = formatLayoutInfo(style);

    if (layoutInfo.margin) {
      const marginRow = document.createElement('div');
      marginRow.className = 'lfqa-badge-margin';
      marginRow.textContent = layoutInfo.margin;
      badge.appendChild(marginRow);
    }

    if (layoutInfo.padding) {
      const paddingRow = document.createElement('div');
      paddingRow.className = 'lfqa-badge-padding';
      paddingRow.textContent = layoutInfo.padding;
      badge.appendChild(paddingRow);
    }

    if (layoutInfo.size) {
      const sizeRow = document.createElement('div');
      sizeRow.className = 'lfqa-badge-size';
      sizeRow.textContent = layoutInfo.size;
      badge.appendChild(sizeRow);
    }

    // Create position info row (only for positioned elements)
    const positionInfo = formatPositionInfo(style);
    if (positionInfo) {
      const positionRow = document.createElement('div');
      positionRow.className = 'lfqa-badge-position';
      positionRow.textContent = positionInfo;
      badge.appendChild(positionRow);
    }

    // Position at top-left of element
    badge.style.left = `${rect.left + window.scrollX}px`;
    badge.style.top = `${rect.top + window.scrollY}px`;

    return badge;
  }

  // Setup hover listener for a text element to highlight its badge
  function setupHoverListener(element, badge) {
    const handleMouseEnter = () => {
      currentlyHoveredElement = element;
      badge.classList.add('lfqa-badge-highlight');
    };

    const handleMouseLeave = () => {
      currentlyHoveredElement = null;
      badge.classList.remove('lfqa-badge-highlight');
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Store cleanup function
    hoverCleanupFns.push(() => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    });
  }

  // Cleanup all hover listeners
  function cleanupHoverListeners() {
    for (const cleanupFn of hoverCleanupFns) {
      cleanupFn();
    }
    hoverCleanupFns = [];
    elementBadgeMap.clear();
    // Note: currentlyHoveredElement is preserved for re-render restoration
  }

  // Create overlay container
  function createContainer() {
    const existing = document.getElementById(CONTAINER_ID);
    if (existing) {
      existing.remove();
    }

    container = document.createElement('div');
    container.id = CONTAINER_ID;
    document.body.appendChild(container);
    return container;
  }

  // Render all badges
  function render() {
    if (!container) {
      container = createContainer();
    }

    // Cancel any pending RAF to prevent duplicate listener registration
    if (pendingRafId) {
      cancelAnimationFrame(pendingRafId);
      pendingRafId = null;
    }

    // Save currently hovered element before cleanup
    const previouslyHoveredElement = currentlyHoveredElement;

    // Cleanup previous hover listeners before re-rendering
    cleanupHoverListeners();

    // Clear existing badges
    container.innerHTML = '';

    // Find text elements and create badges
    const textElements = findTextElements();

    pendingRafId = requestAnimationFrame(() => {
      pendingRafId = null;
      const fragment = document.createDocumentFragment();
      const elementsAndBadges = [];

      for (const { element, rect } of textElements) {
        const badge = createBadge(element, rect);
        fragment.appendChild(badge);
        elementsAndBadges.push({ element, badge });
      }

      container.appendChild(fragment);

      // Setup hover listeners after badges are in DOM
      for (const { element, badge } of elementsAndBadges) {
        elementBadgeMap.set(element, badge);
        setupHoverListener(element, badge);

        // Restore hover highlight if this element was being hovered
        if (element === previouslyHoveredElement) {
          currentlyHoveredElement = element;
          badge.classList.add('lfqa-badge-highlight');
        }
      }
    });
  }

  // Setup event listeners
  function setupListeners() {
    const debouncedRender = debounce(render, DEBOUNCE_DELAY);

    scrollHandler = debouncedRender;
    resizeHandler = debouncedRender;

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', resizeHandler, { passive: true });

    // MutationObserver for DOM changes
    mutationObserver = new MutationObserver(debouncedRender);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // Cleanup function
  function cleanup() {
    // Cancel any pending debounced render calls FIRST
    if (debounceTimeoutId) {
      clearTimeout(debounceTimeoutId);
      debounceTimeoutId = null;
    }

    // Cancel any pending RAF
    if (pendingRafId) {
      cancelAnimationFrame(pendingRafId);
      pendingRafId = null;
    }

    // Disconnect observer BEFORE removing container to prevent mutation events
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }

    // Remove event listeners
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
      scrollHandler = null;
    }
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler);
      resizeHandler = null;
    }

    // Cleanup hover listeners and reset hover state
    cleanupHoverListeners();
    currentlyHoveredElement = null;

    // Remove container
    if (container) {
      container.remove();
      container = null;
    }

    // Reset initialization flag to allow re-initialization
    window.__LFQA_INITIALIZED__ = false;
  }

  // Listen for cleanup message from background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'cleanup') {
      cleanup();
      sendResponse({ success: true });
    }
  });

  // Initialize
  render();
  setupListeners();

})();
