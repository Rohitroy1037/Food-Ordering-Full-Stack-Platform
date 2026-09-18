import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, "../data/users.json");

let inMemoryUsers = null;

// Helper to read users
const getUsers = () => {
  if (inMemoryUsers) return inMemoryUsers;
  try {
    if (!fs.existsSync(usersFilePath)) {
      try {
        fs.writeFileSync(usersFilePath, JSON.stringify([]));
      } catch (err) {}
    }
    const raw = fs.readFileSync(usersFilePath, "utf8");
    inMemoryUsers = JSON.parse(raw);
    return inMemoryUsers;
  } catch (err) {
    inMemoryUsers = inMemoryUsers || [];
    return inMemoryUsers;
  }
};

// Helper to save users
const saveUsers = (users) => {
  inMemoryUsers = users;
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (err) {
    console.warn("Storage notice: Running in serverless read-only filesystem. Updated in-memory.");
  }
};

// Remove password before sending to client
const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

// GET /api/auth/users (for development / list)
router.get("/users", (req, res) => {
  const users = getUsers().map(sanitizeUser);
  res.json({ success: true, data: users });
});

// POST /api/auth/signup
router.post("/signup", (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Full Name is required" });
    }
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid Email is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const users = getUsers();
    const existingUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please sign in.",
      });
    }

    const newUser = {
      id: "usr_" + Math.floor(1000 + Math.random() * 9000),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : "9876543210",
      password: password,
      address: address ? address.trim() : "Model Town, City Center",
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name.trim())}`,
      role: "customer",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({
      success: true,
      message: `Welcome to RasoiMitra, ${newUser.name}! Your account has been created.`,
      data: sanitizeUser(newUser),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/signin
router.post("/signin", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with this email. Please sign up.",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      data: sanitizeUser(user),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email query param required" });
  }

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, data: sanitizeUser(user) });
});

export default router;
