// options.js

document.addEventListener('DOMContentLoaded', () => {
  const tokenInput = document.getElementById('githubToken');
  const saveButton = document.getElementById('saveToken');
  const statusMessage = document.getElementById('status');

  // Load saved token on page load
  chrome.storage.sync.get(['githubToken'], (result) => {
    if (result.githubToken) {
      tokenInput.value = result.githubToken;
      statusMessage.textContent = 'Token loaded.';
      statusMessage.className = 'success';
    } else {
      statusMessage.textContent = 'Token not set.';
      statusMessage.className = 'info';
    }
  });

  // Save token when button is clicked
  saveButton.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    if (token) {
      chrome.storage.sync.set({ githubToken: token }, () => {
        statusMessage.textContent = 'Token saved successfully!';
        statusMessage.className = 'success';
        console.log('GitHub token saved.');
        // Optionally close the options page after saving
        // window.close();
      });
    } else {
      statusMessage.textContent = 'Please enter a valid token.';
      statusMessage.className = 'error';
    }
  });
});