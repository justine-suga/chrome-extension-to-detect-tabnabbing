const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");
const { compare } = require("odiff-bin");

const app = express();
app.use(bodyParser.json({ limit: "10mb" }));

const tempDir = path.join(__dirname, "temp"); // Temporary directory for images

// Ensure temp directory exists
fs.mkdir(tempDir, { recursive: true });

app.post("/compare", async (req, res) => {
  const { initialScreenshot, savedScreenshot } = req.body;

  if (!initialScreenshot || !savedScreenshot) {
    return res.status(400).json({ error: "Both screenshots are required." });
  }

  try {
    // Write screenshots to temporary files
    const initialPath = path.join(tempDir, "initial.png");
    const savedPath = path.join(tempDir, "saved.png");
    const diffPath = path.join(tempDir, "diff.png");

    await fs.writeFile(initialPath, Buffer.from(initialScreenshot.split(",")[1], "base64"));
    await fs.writeFile(savedPath, Buffer.from(savedScreenshot.split(",")[1], "base64"));

    // Use Odiff to compare the images
    const { match, reason } = await compare(initialPath, savedPath, diffPath);

    if (match) {
      console.log("Images are identical.");
      return res.json({ match: true, reason: "No differences found.", differenceImage: null });
    } else {
      console.log(`Images differ. Reason: ${reason}`);
      const diffImageBase64 = await fs.readFile(diffPath, { encoding: "base64" });
      return res.json({
        match: false,
        reason,
        differenceImage: `data:image/png;base64,${diffImageBase64}`,
      });
    }
  } catch (error) {
    console.error("Error during comparison:", error);
    return res.status(500).json({ error: "Error processing images." });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
