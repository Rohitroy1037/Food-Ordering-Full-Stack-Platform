import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactFilePath = path.join(__dirname, "../data/messages.json");

const getMessages = () => {
  try {
    if (!fs.existsSync(contactFilePath)) {
      fs.writeFileSync(contactFilePath, JSON.stringify([]));
    }
    const raw = fs.readFileSync(contactFilePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

// GET /api/contact
router.get("/", (req, res) => {
  res.json({ success: true, data: getMessages() });
});

// POST /api/contact
router.post("/", (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and message.",
      });
    }

    const messages = getMessages();
    const newMsg = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };

    messages.unshift(newMsg);
    fs.writeFileSync(contactFilePath, JSON.stringify(messages, null, 2));

    res.status(201).json({
      success: true,
      message: "Message received successfully! We will get back to you soon.",
      data: newMsg,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
