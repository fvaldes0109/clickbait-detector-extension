// Extract all h1 elements from the page
const h1Elements = document.querySelectorAll('h1');
let h1Texts = Array.from(h1Elements).map(h1 => h1.textContent);

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'getH1s') {
    sendResponse({ h1Texts: h1Texts });
  }
});
