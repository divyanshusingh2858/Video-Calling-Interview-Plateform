import Session from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";

// ✅ CREATE SESSION
export async function createSession(req, res) {
  try {
    const { problem, difficulty, invitedEmail } = req.body;

    if (!problem || !difficulty) {
      return res.status(400).json({
        message: "Problem and difficulty are required",
      });
    }

    const callId = `session-${Date.now()}`;

    const session = await Session.create({
      problem,
      difficulty,
      host: req.user?._id || null,
      callId,
      invitedParticipantEmail: invitedEmail?.trim() || null,
    });

    res.status(201).json({ session });
  } catch (error) {
    console.log("❌ Create session error:", error);
    res.status(500).json({ message: "Failed to create session" });
  }
}

// ✅ GET ACTIVE SESSIONS
export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" }).sort({
      createdAt: -1,
    });

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("❌ Active sessions error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ GET MY RECENT SESSIONS
export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user?._id;

    const sessions = await Session.find({
      $or: [{ host: userId }, { participant: userId }],
    }).sort({ createdAt: -1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("❌ Recent sessions error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ GET SESSION BY ID
export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.log("❌ Get session error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ✅ JOIN SESSION (FIXED)
export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    console.log("==== JOIN SESSION START ====");

    const userId = req.user?._id || null;
    const clerkId = req.user?.clerkId || null;

    console.log("userId:", userId);
    console.log("clerkId:", clerkId);

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "active") {
      return res.status(400).json({ message: "Session not active" });
    }

    if (session.participant) {
      return res.status(409).json({ message: "Session is full" });
    }

    // ✅ allow join without login
    session.participant = userId || null;

    await session.save();

    // optional chat join
    if (clerkId) {
      try {
        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);
      } catch (err) {
        console.log("Chat error:", err.message);
      }
    }

    console.log("✅ JOIN SUCCESS");

    res.status(200).json({ session });
  } catch (error) {
    console.log("❌ Join error:", error);
    res.status(500).json({
      message: "Join failed",
      error: error.message,
    });
  }
}

// ✅ END SESSION
export async function endSession(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.status = "completed";
    await session.save();

    res.status(200).json({
      message: "Session ended",
      session,
    });
  } catch (error) {
    console.log("❌ End session error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}