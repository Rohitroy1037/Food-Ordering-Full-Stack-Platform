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

// Pre-defined delivery riders pool for realistic assignments
const RIDERS_POOL = [
  {
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    vehicle: "Honda Activa (PB 08 AB 1234)",
    rating: "4.9 ⭐",
    trips: "1,420+ deliveries",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    vaccinated: true,
  },
  {
    name: "Vikram Singh",
    phone: "+91 98123 76540",
    vehicle: "TVS Jupiter (PB 08 XY 8890)",
    rating: "4.85 ⭐",
    trips: "980+ deliveries",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    vaccinated: true,
  },
  {
    name: "Amit Sharma",
    phone: "+91 97654 32190",
    vehicle: "Bajaj Pulsar (PB 08 CD 4567)",
    rating: "4.92 ⭐",
    trips: "2,150+ deliveries",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    vaccinated: true,
  },
];

// Helper to compute live tracking progression based on elapsed time or manual stage override
const computeTrackingState = (order) => {
  const createdMs = new Date(order.createdAt).getTime();
  const nowMs = Date.now();
  const elapsedMinutes = Math.max(0, (nowMs - createdMs) / (1000 * 60));

  // Default stages:
  // 0 - 1 min: Order Confirmed
  // 1 - 4 min: Chef Preparing in Kitchen
  // 4 - 12 min: Out for Delivery (Rider en route)
  // 12+ min: Delivered
  let stage = 1; // 1: Confirmed, 2: Preparing, 3: Out for Delivery, 4: Delivered
  let statusText = "Order Confirmed & Received";
  let statusDetail = "The restaurant has accepted your order and sent it to the kitchen.";
  let progressPercent = 15;
  let remainingMins = 25;
  let riderLocation = { lat: 28.6139, lng: 77.2090, label: "At Restaurant" };

  if (order.manualStage) {
    stage = order.manualStage;
  } else {
    if (elapsedMinutes < 1) {
      stage = 1;
    } else if (elapsedMinutes < 4) {
      stage = 2;
    } else if (elapsedMinutes < 12) {
      stage = 3;
    } else {
      stage = 4;
    }
  }

  if (stage === 1) {
    statusText = "Order Confirmed & Received";
    statusDetail = "The restaurant has accepted your order and is verifying kitchen ingredients.";
    progressPercent = 20;
    remainingMins = 25;
    riderLocation = { progress: 0.05, label: "Assigned & heading to restaurant" };
  } else if (stage === 2) {
    statusText = "Chef is Preparing Your Food 🍳";
    statusDetail = "Your dishes are being cooked fresh with authentic spices.";
    progressPercent = 45;
    remainingMins = 18;
    riderLocation = { progress: 0.15, label: "Waiting at restaurant for pickup" };
  } else if (stage === 3) {
    // Rider on the way: calculate interpolation
    const transitProgress = order.manualStage
      ? 0.65
      : Math.min(0.95, 0.2 + ((elapsedMinutes - 4) / 8) * 0.75);
    statusText = "Out for Delivery & On The Way 🛵";
    statusDetail = `${order.rider?.name || "Delivery Partner"} has picked up your food and is riding to your address.`;
    progressPercent = Math.round(transitProgress * 100);
    remainingMins = Math.max(2, Math.round(14 * (1 - transitProgress)));
    riderLocation = {
      progress: transitProgress,
      label: "Riding to your doorstep",
    };
  } else if (stage === 4) {
    statusText = "Order Delivered! 🎉";
    statusDetail = "Your food has reached your doorstep. Bon appétit!";
    progressPercent = 100;
    remainingMins = 0;
    riderLocation = { progress: 1.0, label: "Arrived at destination" };
  }

  return {
    ...order,
    tracking: {
      stage,
      statusText,
      statusDetail,
      progressPercent,
      remainingMins,
      riderLocation,
      lastUpdated: new Date().toISOString(),
    },
  };
};

// GET /api/orders
router.get("/", (req, res) => {
  const orders = getOrders().map(computeTrackingState);
  res.json({ success: true, data: orders });
});

// GET /api/orders/latest
router.get("/latest", (req, res) => {
  const orders = getOrders();
  if (!orders || orders.length === 0) {
    return res.status(404).json({ success: false, message: "No orders found" });
  }
  res.json({ success: true, data: computeTrackingState(orders[0]) });
});

// GET /api/orders/:orderId
router.get("/:orderId", (req, res) => {
  const orders = getOrders();
  const order = orders.find(
    (o) => o.orderId.toLowerCase() === req.params.orderId.toLowerCase()
  );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: `Order #${req.params.orderId} not found`,
    });
  }

  res.json({ success: true, data: computeTrackingState(order) });
});

// PATCH /api/orders/:orderId/status (Simulation stage toggle for testing)
router.patch("/:orderId/status", (req, res) => {
  const { stage } = req.body;
  if (!stage || stage < 1 || stage > 4) {
    return res.status(400).json({ success: false, message: "Stage must be between 1 and 4" });
  }

  const orders = getOrders();
  const index = orders.findIndex(
    (o) => o.orderId.toLowerCase() === req.params.orderId.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  orders[index].manualStage = Number(stage);
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

  res.json({
    success: true,
    message: `Order stage updated to ${stage}`,
    data: computeTrackingState(orders[index]),
  });
});

// POST /api/orders
router.post("/", (req, res) => {
  try {
    const { items, totalAmount, customerInfo, paymentMethod, paymentDetails, deliveryAddress } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Cannot place an empty order.",
      });
    }

    const orders = getOrders();
    const isCOD = paymentMethod === "Cash on Delivery";
    const assignedRider = RIDERS_POOL[Math.floor(Math.random() * RIDERS_POOL.length)];

    const newOrder = {
      orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      items,
      totalAmount: totalAmount || items.reduce((s, i) => s + (i.price || i.defaultPrice || 0) * (i.quantity || 1), 0),
      customerInfo: customerInfo || { name: "Guest User", phone: "9876543210" },
      deliveryAddress: deliveryAddress || "Standard Delivery Address",
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentDetails: paymentDetails || {},
      paymentStatus: isCOD ? "Pending (Cash on Delivery)" : "Paid Online",
      orderStatus: "Order Confirmed & Preparing",
      estimatedDelivery: "25 - 35 mins",
      rider: assignedRider,
      restaurant: {
        name: items[0]?.restaurantName || "Rasoi Mitra Partner Kitchen",
        address: "Block C, Metro Junction, Central Market",
      },
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));

    const responseOrder = computeTrackingState(newOrder);

    res.status(201).json({
      success: true,
      message: isCOD
        ? "Order placed with Cash on Delivery! Keep cash ready at arrival."
        : `Payment successful via ${paymentMethod}! Order confirmed.`,
      data: responseOrder,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
