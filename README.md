# Tabnabbing Detector

Tabnabbing Detector is a Chrome extension that monitors browser tabs for visual changes and alerts the user if a change is detected on a revisited tab. The extension uses screenshots, a Node.js server for image comparison (via odiff), and displays the comparison results directly in the popup.

---

## Features

- Captures and stores screenshots for each tab when visited.
- Compares the saved screenshot with the latest screenshot upon revisiting a tab.
- Alerts the user with a red exclamation icon (`alert_icon.png`) if changes are detected.
- Displays the saved screenshot, the initial screenshot, and the difference image in the extension popup.
- Uses a Node.js backend with `odiff` for image comparison.

---

## Installation

### Prerequisites
1. Install [Node.js](https://nodejs.org/) (v18 or later recommended).
2. Ensure you have the following npm packages installed:
   - `odiff-bin`
   - `body-parser`
   - `express`
   - `fs`
   - `path`


### Setting Up
1. Clone or download the repository to your local machine. 
2. Install Node.js dependencies by running:
   ```bash
   npm install
3. After installing the prerequisites, navigate to `chrome://extensions/`.
4. Enable **Developer mode** (top right corner).
5.  Click **Load unpacked** and select the folder containing the extension files.

### Starting the Node.js Server

1.  Navigate to the directory containing `server.js`.
2.  Run the following command:
`node server.js`
3.  The server will start running on `http://localhost:3000`.

### Usage
-----

1.  Open a new tab in Chrome.
2.  Activate the extension by visiting any webpage.
3.  The extension will take an **initial screenshot** of the tab upon activation and periodically save screenshots (10 seconds).
4.  If you revisit a tab, the extension will compare the new screenshot with the saved screenshot.
5.  If changes are detected:
    -   The extension's toolbar icon will change to a red alert (`alert_icon.png`).
    -   You can open the extension's popup to view:
        -   The **initial screenshot**.
        -   The **saved screenshot** (taken every 10 seconds).
        -   The **comparison image** showing visual differences.

### Testing the Extension
---------------------

1. Open and activate a tab to allow the extension to take the initial and second screenshot, browse for at least 10 seconds on that page (don't go in developer mode yet). After browsing for a little bit, open developer mode. 
2. Visit a new tab, go back to developer mode and simulate a change in the previous tab. 
3. Revisit the tab after modifying the content.
4. Check for changes in the toolbar icon and popup.

### Note!
- A folder called 'temp' will manifest for the image comparison; you can delete this after.
-  Extension will not take screenshots of any "Chrome" website, like settings. 

