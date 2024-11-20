let screenshotsByTab = {};

function takeScreenshot(tabId, type) {
  chrome.tabs.captureVisibleTab(null, { format: "png" }, (screenshot) => {
    if (chrome.runtime.lastError) {
      console.error("Error capturing screenshot:", chrome.runtime.lastError);
      return;
    }

    if (!screenshotsByTab[tabId]) screenshotsByTab[tabId] = {};
    screenshotsByTab[tabId][type] = screenshot;

    console.log(`${type} screenshot captured for Tab ID: ${tabId}`);

    // Trigger comparison only when taking an initial screenshot and a saved screenshot exists
    if (type === "initialScreenshot" && screenshotsByTab[tabId].savedScreenshot) {
      compareScreenshots(tabId);
    }
  });
}

function compareScreenshots(tabId) {
  const { initialScreenshot, savedScreenshot } = screenshotsByTab[tabId];

  fetch("http://localhost:3000/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initialScreenshot, savedScreenshot }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.differenceImage) {
        screenshotsByTab[tabId].differenceImage = data.differenceImage;
        
        chrome.action.setIcon({path: "images/alert_icon.png"});

        console.log(`Comparison complete for Tab ID: ${tabId}. Differences found.`);
      } else {
        console.log(`Comparison complete for Tab ID: ${tabId}. No differences found.`);
        screenshotsByTab[tabId].differenceImage = null; // Clear if no differences
      }
    })
    .catch((error) => console.error("Error during comparison:", error));
}

// Tab activation handler
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log(`Tab activated: Tab ID ${activeInfo.tabId}`);

  setTimeout(() => {
    takeScreenshot(activeInfo.tabId, "initialScreenshot");
  }, 1000); // Delay for tab loading
});

// Interval screenshot handler
setInterval(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;

    const activeTab = tabs[0];
    takeScreenshot(activeTab.id, "savedScreenshot");
  });
}, 10000); // Every 10 seconds

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getScreenshots") {
    const tabId = message.tabId;
    const screenshots = screenshotsByTab[tabId] || {};
    sendResponse({
      initialScreenshot: screenshots.initialScreenshot || null,
      savedScreenshot: screenshots.savedScreenshot || null,
      differenceImage: screenshots.differenceImage || null,
    });
  }
});

