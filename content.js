// Content Script for Landing Font QA Extension
// Detects visible text elements and renders font spec badges

(function() {
  'use strict';

  // Constants
  const MAX_BADGES = 800;
  const DEBOUNCE_DELAY = 1000;
  const CONTAINER_ID = 'landing-font-qa-container';

  // State
  let container = null;
  let scrollHandler = null;
  let resizeHandler = null;
  let mutationObserver = null;

  // Debounce utility
  function debounce(fn, delay) {
    let timeoutId = null;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
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

    const badge = document.createElement('div');
    badge.className = 'lfqa-badge';
    badge.textContent = `${fontSize}px / ${fontWeight}`;

    // Position at top-left of element
    badge.style.left = `${rect.left + window.scrollX}px`;
    badge.style.top = `${rect.top + window.scrollY}px`;

    return badge;
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

    // Clear existing badges
    container.innerHTML = '';

    // Find text elements and create badges
    const textElements = findTextElements();

    requestAnimationFrame(() => {
      const fragment = document.createDocumentFragment();
      for (const { element, rect } of textElements) {
        const badge = createBadge(element, rect);
        fragment.appendChild(badge);
      }
      container.appendChild(fragment);
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
    // Remove container
    if (container) {
      container.remove();
      container = null;
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

    // Disconnect observer
    if (mutationObserver) {
      mutationObserver.disconnect();
      mutationObserver = null;
    }
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
