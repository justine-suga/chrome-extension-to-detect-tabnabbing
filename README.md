# Tabnabbing Detector

Tabnabbing Detector is a Chrome extension that monitors browser tabs for visual changes and alerts the user if a significant change is detected on a revisited tab. The extension uses screenshots, a Node.js server for image comparison (via odiff), and displays the comparison results directly in the popup.

---

## Features

- Captures and stores screenshots for each tab when visited.
- Compares the saved screenshot with the latest screenshot upon revisiting a tab.
- Alerts the user with a red exclamation icon (`alert_icon.png`) if changes are detected.
- Displays the saved screenshot, the initial screenshot, and the difference image in the extension popup.
- Uses a Node.js backend with `odiff` for precise image comparison.

---

## Installation

### Prerequisites
1. Install [Node.js](https://nodejs.org/) (v18 or later recommended).
2. Ensure you have the following npm packages installed:
   - `odiff-bin`
   - `body-parser`
   - `express`
   - `canvas`

### Setting Up
1. Clone the repository to your local machine.
2. Install Node.js dependencies by running:
   ```bash
   npm install
