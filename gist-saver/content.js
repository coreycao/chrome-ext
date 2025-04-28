// content.js

let gistInputLayer = null;
let selectedTextForGist = '';

// Function to create and show the Gist input layer
function showGistInputLayer(text) {
  selectedTextForGist = text;

  // Remove existing layer if any
  if (gistInputLayer) {
    gistInputLayer.remove();
  }

  // Create the layer elements
  gistInputLayer = document.createElement('div');
  gistInputLayer.id = 'gistSaverInputLayer';

  const title = document.createElement('h3');
  title.textContent = 'Enter Gist Name';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'gistNameInput';
  input.placeholder = 'Gist name (e.g., my-snippet.js)';

  const saveButton = document.createElement('button');
  saveButton.id = 'saveGistButton';
  saveButton.textContent = 'Save Gist';

  const cancelButton = document.createElement('button');
  cancelButton.id = 'cancelGistButton';
  cancelButton.textContent = 'Cancel';

  const statusDiv = document.createElement('div');
  statusDiv.id = 'gistStatus';

  // Append elements
  gistInputLayer.appendChild(title);
  gistInputLayer.appendChild(input);
  gistInputLayer.appendChild(saveButton);
  gistInputLayer.appendChild(cancelButton);
  gistInputLayer.appendChild(statusDiv);

  // Add event listeners
  saveButton.addEventListener('click', handleSaveGist);
  cancelButton.addEventListener('click', closeGistInputLayer);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSaveGist();
    }
    if (e.key === 'Escape') {
        closeGistInputLayer();
    }
  });

  // Append layer to body and focus input
  document.body.appendChild(gistInputLayer);
  input.focus();
}

// Function to handle saving the Gist
function handleSaveGist() {
  const gistNameInput = document.getElementById('gistNameInput');
  const statusDiv = document.getElementById('gistStatus');
  const gistName = gistNameInput.value.trim();

  if (!gistName) {
    statusDiv.textContent = 'Please enter a name for the Gist.';
    statusDiv.className = 'error';
    return;
  }

  statusDiv.textContent = 'Saving...';
  statusDiv.className = 'loading'; // Add loading class for styling
  document.getElementById('saveGistButton').disabled = true;
  document.getElementById('cancelGistButton').disabled = true;

  // Send message to background script to create the Gist
  chrome.runtime.sendMessage(
    { action: 'createGist', gistName: gistName, selectedText: selectedTextForGist },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message to background:', chrome.runtime.lastError.message);
        statusDiv.textContent = `Error: ${chrome.runtime.lastError.message}`;
        statusDiv.className = 'error';
      } else if (response && response.success) {
        statusDiv.innerHTML = `Gist created successfully!\n <a href="${response.url}" target="_blank">View Gist</a>`;
        statusDiv.className = 'success';
        // Close the layer after a short delay
        setTimeout(closeGistInputLayer, 3000);
      } else {
        statusDiv.textContent = `Error: ${response ? response.error : 'Unknown error'}`;
        statusDiv.className = 'error';
      }
      // Re-enable buttons unless closing
      if (!(response && response.success)) {
          document.getElementById('saveGistButton').disabled = false;
          document.getElementById('cancelGistButton').disabled = false;
      }
    }
  );
}

// Function to close the input layer
function closeGistInputLayer() {
  if (gistInputLayer) {
    gistInputLayer.remove();
    gistInputLayer = null;
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showGistInput") {
    console.log('Received showGistInput message. Text:', request.selectedText);
    showGistInputLayer(request.selectedText);
    // sendResponse can be omitted if not sending anything back synchronously
  }
});

console.log("GistSaver content script loaded.");