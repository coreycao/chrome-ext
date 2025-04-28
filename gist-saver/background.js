// background.js

// Function to get the GitHub token from storage
function getToken(callback) {
  chrome.storage.sync.get(['githubToken'], (result) => {
    callback(result.githubToken);
  });
}

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToGist",
    title: "Save to Gist",
    contexts: ["selection"]
  });
  console.log('Context menu created.');
  // Open options page on first install
  chrome.runtime.openOptionsPage();
});

// Listener for context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToGist" && info.selectionText) {
    console.log('Save to Gist clicked. Selection:', info.selectionText);
    // Send message to content script to show the input layer
    chrome.tabs.sendMessage(tab.id, {
      action: "showGistInput",
      selectedText: info.selectionText
    });
  }
});

// Listener for messages from content script or options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createGist") {
    console.log('Received createGist request:', request);
    getToken(token => {
      if (!token) {
        console.error('GitHub token not found.');
        sendResponse({ success: false, error: 'GitHub token not configured. Please set it in the options page.' });
        // Optionally open options page again
        // chrome.runtime.openOptionsPage();
        return;
      }

      const { gistName, selectedText } = request;
      const fileName = gistName.endsWith('.txt') ? gistName : `${gistName}.txt`; // Ensure a file extension

      fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: `Gist created by GistSaver: ${gistName}`,
          public: false, // Or true, depending on preference
          files: {
            [fileName]: {
              content: selectedText
            }
          }
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.html_url) {
          console.log('Gist created successfully:', data.html_url);
          sendResponse({ success: true, url: data.html_url });
        } else {
          console.error('Error creating Gist:', data.message || 'Unknown error');
          sendResponse({ success: false, error: data.message || 'Failed to create Gist.' });
        }
      })
      .catch(error => {
        console.error('Network error creating Gist:', error);
        sendResponse({ success: false, error: `Network error: ${error.message}` });
      });
    });
    return true; // Indicates that the response is sent asynchronously
  }
});