import express from "express";
import cors from "cors";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes (support both /api/* and direct routes for Vercel)
app.use("/api/restaurants", restaurantRoutes);
app.use("/restaurants", restaurantRoutes);

app.use("/api/menu", menuRoutes);
app.use("/menu", menuRoutes);

app.use("/api/about", aboutRoutes);
app.use("/about", aboutRoutes);

app.use("/api/contact", contactRoutes);
app.use("/contact", contactRoutes);

app.use("/api/orders", orderRoutes);
app.use("/orders", orderRoutes);

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "RasoiMitra backend service is up and running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "RasoiMitra backend service is up and running!",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Only listen on port when not running as a Vercel serverless function
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 RasoiMitra Backend Server running on http://localhost:${PORT}`);
  });
}

export default app;
