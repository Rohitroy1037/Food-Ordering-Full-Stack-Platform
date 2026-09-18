import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const aboutFilePath = path.join(__dirname, "../data/about.json");

// GET /api/about
router.get("/", (req, res) => {
  try {
    const raw = fs.readFileSync(aboutFilePath, "utf8");
    const data = JSON.parse(raw);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/about - update profile
router.put("/", (req, res) => {
  try {
    const current = JSON.parse(fs.readFileSync(aboutFilePath, "utf8"));
    const updated = { ...current, ...req.body };
    fs.writeFileSync(aboutFilePath, JSON.stringify(updated, null, 2));
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
