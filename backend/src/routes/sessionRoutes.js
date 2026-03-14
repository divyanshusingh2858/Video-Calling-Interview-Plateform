import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createSession,
  endSession,
  getActiveSessions,
  getMyRecentSessions,
  getSessionById,
  joinSession,
} from "../controllers/sessionController.js";

const router = express.Router();

// 🔴 ADD THIS SIMPLE TEST ROUTE
router.get("/test-log", (req, res) => {
  console.log("✅ TEST LOG: This should appear in terminal!");
  console.log("✅ If you see this, logs are working!");
  res.json({ message: "Log test successful" });
});

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "session route working" });
});

// Create session
router.post("/", protectRoute, createSession);

// Public route
router.get("/active", getActiveSessions);

// 🔴 ADD DEBUG FOR MY-RECENT ROUTE - add these console.log lines
router.get("/my-recent", (req, res, next) => {
  console.log("📋 My recent sessions route hit - before protectRoute");
  next();
}, protectRoute, (req, res, next) => {
  console.log("📋 My recent sessions route hit - after protectRoute");
  next();
}, getMyRecentSessions);

// Join session
router.post("/:id/join", protectRoute, joinSession);

// End session
router.post("/:id/end", protectRoute, endSession);

// Get session
router.get("/:id", protectRoute, getSessionById);

export default router;