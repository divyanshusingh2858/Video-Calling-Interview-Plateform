import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

/* =========================
   CREATE SESSION
========================= */
export async function createSession(req, res) {
  try {
    const { problem, difficulty, invitedEmail } = req.body;

    const userId = req.user?._id;
    const clerkId = req.user?.clerkId;

    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ message: "Problem and difficulty are required" });
    }

    if (!invitedEmail) {
      return res
        .status(400)
        .json({ message: "Invited participant email is required" });
    }

    const callId = `session-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;

    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
      invitedParticipantEmail: invitedEmail.trim(),
    });

    // create Stream video call
    const call = streamClient.video.call("default", callId);

    await call.getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: {
          problem,
          difficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    // create chat channel
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    return res.status(201).json({ session });
  } catch (error) {
    console.log("❌ Error in createSession:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/* =========================
   GET ACTIVE SESSIONS
========================= */
export async function getActiveSessions(req, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/* =========================
   GET MY RECENT SESSIONS
========================= */
export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user?._id;

    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/* =========================
   GET SESSION BY ID
========================= */
export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/* =========================
   JOIN SESSION (FIXED)
========================= */
export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    const userId = req.user?._id || null;
    const clerkId = req.user?.clerkId || null;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "active") {
      return res.status(400).json({ message: "Session not active" });
    }

    // ❗ prevent host joining again
    if (userId && session.host.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Host cannot join as participant",
      });
    }

    // ❗ already filled
    if (session.participant) {
      return res.status(409).json({ message: "Session is full" });
    }

    // ✅ NO EMAIL RESTRICTION (MAIN FIX)
    session.participant = userId;
    await session.save();

    // add to chat
    if (clerkId) {
      try {
        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);
      } catch (err) {
        console.log("Chat error:", err.message);
      }
    }

    return res.status(200).json({ session });
  } catch (error) {
    console.log("❌ Error in joinSession:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/* =========================
   END SESSION
========================= */
export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.host.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Only host can end session" });
    }

    if (session.status === "completed") {
      return res
        .status(400)
        .json({ message: "Session already completed" });
    }

    // delete Stream call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete chat
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    await session.save();

    return res.status(200).json({
      session,
      message: "Session ended successfully",
    });
  } catch (error) {
    console.log("Error in endSession:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}