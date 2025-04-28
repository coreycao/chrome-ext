// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const optionsLink = document.getElementById('optionsLink');

  optionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    // Open the options page
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
    // Close the popup
    window.close();
  });
});