import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFilePath = path.join(__dirname, "../data/orders.json");

const getOrders = () => {
  try {
    if (!fs.existsSync(ordersFilePath)) {
      fs.writeFileSync(ordersFilePath, JSON.stringify([]));
    }
    const raw = fs.readFileSync(ordersFilePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

// GET /api/orders
router.get("/", (req, res) => {
  res.json({ success: true, data: getOrders() });
});

// POST /api/orders
router.post("/", (req, res) => {
  try {
    const { items, totalAmount, customerInfo } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Cannot place an empty order.",
      });
    }

    const orders = getOrders();
    const newOrder = {
      orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      items,
      totalAmount: totalAmount || items.reduce((s, i) => s + (i.price || i.defaultPrice || 0), 0),
      customerInfo: customerInfo || { name: "Guest User" },
      status: "Placed",
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: newOrder,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
