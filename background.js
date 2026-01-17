// Service Worker for Landing Font QA Extension
// Handles toggle functionality via extension icon click

// Track ON/OFF state per tab
const tabStates = new Map();

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  const tabId = tab.id;
  const isActive = tabStates.get(tabId) || false;

  if (isActive) {
    // Turn OFF - send message to content script to cleanup
    try {
      await chrome.tabs.sendMessage(tabId, { action: 'cleanup' });
    } catch (e) {
      // Content script might not be injected yet
    }
    tabStates.set(tabId, false);
  } else {
    // Turn ON - inject content script and styles
    try {
      await chrome.scripting.insertCSS({
        target: { tabId },
        files: ['styles.css']
      });
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['content.js']
      });
      tabStates.set(tabId, true);
    } catch (e) {
      console.error('Failed to inject scripts:', e);
    }
  }
});

// Clean up state when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  tabStates.delete(tabId);
});

// Reset state when tab navigates to new page
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    tabStates.set(tabId, false);
  }
});
