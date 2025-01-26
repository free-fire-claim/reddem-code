const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(express.json({ limit: "10mb" })); // Allow large base64 images
app.use(cors()); // Allow requests from the frontend
// Serve uploaded frames as static files
const framesDir = path.join(__dirname, "frames");
if (!fs.existsSync(framesDir)) fs.mkdirSync(framesDir);
app.post("/upload", (req, res) => {
    const frameData = req.body.frame;
    const base64Data = frameData.replace(/^data:image\/jpeg;base64,/, "");
    const filePath = path.join(framesDir, `frame-${Date.now()}.jpg`);
    fs.writeFileSync(filePath, base64Data, "base64");
    console.log(`Frame saved to: ${filePath}`);
    res.sendStatus(200);
});
app.get("/frames", (req, res) => {
    const files = fs.readdirSync(framesDir).map(file => `https://reddem-code.onrender.com/frames/${file}`);
    res.json(files);
});
app.use("/frames", express.static(framesDir));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
