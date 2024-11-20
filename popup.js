const initialScreenshotBox = document.getElementById("initialScreenshot");
const savedScreenshotBox = document.getElementById("savedScreenshot");
const comparisonImageBox = document.getElementById("differenceImage");

// Helper function to display images
function displayImage(box, imageUrl, placeholderText) {
  if (imageUrl) {
    box.innerHTML = `<img src="${imageUrl}" alt="${placeholderText}" style="width: 100%; height: 100%; object-fit: cover;">`;
  } else {
    box.textContent = placeholderText;
  }
}

// Load screenshots for the current tab
function loadScreenshots() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;

    const tabId = tabs[0].id;
    chrome.runtime.sendMessage({ action: "getScreenshots", tabId }, (response) => {
      if (response) {
        displayImage(initialScreenshotBox, response.initialScreenshot, "Initial Screenshot Missing");
        displayImage(savedScreenshotBox, response.savedScreenshot, "Saved Screenshot Missing");
        displayImage(comparisonImageBox, response.differenceImage, "Comparison Missing");
      } else {
        console.error("Failed to fetch screenshots.");
      }
    });
  });
}

// Initial load
document.addEventListener("DOMContentLoaded", loadScreenshots);