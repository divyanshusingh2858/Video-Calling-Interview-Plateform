// import { chatClient, streamClient } from "../lib/stream.js";
// import Session from "../models/Session.js";

// export async function createSession(req, res) {
//   try {
//     const { problem, difficulty, invitedEmail } = req.body;
//     const userId = req.user._id;
//     const clerkId = req.user.clerkId;

//     // 🔴 STEP 1 DEBUG LOGS - ADD THESE
//     console.log("========== CREATING SESSION ==========");
//     console.log("1. Invited email received from frontend:", invitedEmail);
//     console.log("2. Trimmed email:", invitedEmail?.trim());
//     console.log("3. User ID:", userId);
//     console.log("4. Clerk ID:", clerkId);

//     if (!problem || !difficulty) {
//       console.log("❌ Missing problem or difficulty");
//       return res
//         .status(400)
//         .json({ message: "Problem and difficulty are required" });
//     }

//     if (!invitedEmail) {
//       console.log("❌ Missing invited email");
//       return res
//         .status(400)
//         .json({ message: "Invited participant email is required" });
//     }

//     // generate call id
//     const callId = `session-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
//     console.log("5. Generated callId:", callId);

//     // create session in DB with invited email (trim it to remove spaces)
//     const trimmedEmail = invitedEmail.trim();
//     console.log("6. Trimmed email being saved:", trimmedEmail);

//     const session = await Session.create({
//       problem,
//       difficulty,
//       host: userId,
//       callId,
//       invitedParticipantEmail: trimmedEmail, // Use trimmed version
//     });

//     console.log("7. Session created in DB with ID:", session._id);
//     console.log("8. Invited email saved in DB:", session.invitedParticipantEmail);
//     console.log("========== SESSION CREATED SUCCESSFULLY ==========");

//     // create Stream video call
//     const call = streamClient.video.call("default", callId);

//     await call.getOrCreate({
//       data: {
//         created_by_id: clerkId,
//         custom: {
//           problem,
//           difficulty,
//           sessionId: session._id.toString(),
//         },
//       },
//     });

//     // create chat channel
//     const channel = chatClient.channel("messaging", callId, {
//       name: `${problem} Session`,
//       created_by_id: clerkId,
//       members: [clerkId],
//     });

//     await channel.create();

//     res.status(201).json({ session });
//   } catch (error) {
//     console.log("❌ Error in createSession controller:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// export async function getActiveSessions(_, res) {
//   try {
//     const sessions = await Session.find({ status: "active" })
//       .populate("host", "name profileImage email clerkId")
//       .populate("participant", "name profileImage email clerkId")
//       .sort({ createdAt: -1 })
//       .limit(20);

//     res.status(200).json({ sessions });
//   } catch (error) {
//     console.log("Error in getActiveSessions:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// export async function getMyRecentSessions(req, res) {
//   try {
//     console.log("📊 getMyRecentSessions FUNCTION CALLED");
//     console.log("req.user:", req.user ? req.user._id : "No user");
    
//     const userId = req.user._id;
//     console.log("User ID from req.user:", userId);

//     const sessions = await Session.find({
//       status: "completed",
//       $or: [{ host: userId }, { participant: userId }],
//     })
//       .sort({ createdAt: -1 })
//       .limit(20);

//     console.log(`Found ${sessions.length} sessions`);
//     res.status(200).json({ sessions });
//   } catch (error) {
//     console.log("Error in getMyRecentSessions:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// export async function getSessionById(req, res) {
//   try {
//     const { id } = req.params;

//     const session = await Session.findById(id)
//       .populate("host", "name email profileImage clerkId")
//       .populate("participant", "name email profileImage clerkId");

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     res.status(200).json({ session });
//   } catch (error) {
//     console.log("Error in getSessionById:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// export async function joinSession(req, res) {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;
//     const clerkId = req.user.clerkId;
//     const userEmail = req.user.email;

//     console.log("========== JOINING SESSION ==========");
//     console.log("User email from DB:", userEmail);

//     const session = await Session.findById(id);

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     if (session.status !== "active") {
//       return res.status(400).json({ message: "Cannot join a completed session" });
//     }

//     if (session.host.toString() === userId.toString()) {
//       return res.status(400).json({
//         message: "Host cannot join their own session as participant",
//       });
//     }

//     if (session.participant) {
//       return res.status(409).json({ message: "Session is full" });
//     }

//     // 🔴 IMPROVED: Case-insensitive comparison with trimming
//     const invitedEmail = session.invitedParticipantEmail?.trim().toLowerCase();
//     const joiningEmail = userEmail?.trim().toLowerCase();

//     console.log("Invited email:", invitedEmail);
//     console.log("Joining email:", joiningEmail);

//     if (invitedEmail && invitedEmail !== joiningEmail) {
//       return res.status(403).json({ 
//         message: `This session was created for ${session.invitedParticipantEmail}. Your email (${userEmail}) is not invited.` 
//       });
//     }

//     session.participant = userId;
//     await session.save();

//     const channel = chatClient.channel("messaging", session.callId);
//     await channel.addMembers([clerkId]);

//     console.log("✅ Join successful!");
//     res.status(200).json({ session });
//   } catch (error) {
//     console.log("❌ Error in joinSession:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

// export async function endSession(req, res) {
//   try {
//     const { id } = req.params;
//     const userId = req.user._id;

//     const session = await Session.findById(id);

//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     if (session.host.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({ message: "Only the host can end the session" });
//     }

//     if (session.status === "completed") {
//       return res
//         .status(400)
//         .json({ message: "Session is already completed" });
//     }

//     // delete Stream video call
//     const call = streamClient.video.call("default", session.callId);
//     await call.delete({ hard: true });

//     // delete chat channel
//     const channel = chatClient.channel("messaging", session.callId);
//     await channel.delete();

//     session.status = "completed";
//     await session.save();

//     res.status(200).json({
//       session,
//       message: "Session ended successfully",
//     });
//   } catch (error) {
//     console.log("Error in endSession:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    console.log("==== JOIN SESSION START ====");

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // ❗ REMOVE ALL RESTRICTIONS TEMPORARILY

    session.participant = session.participant || "guest";

    await session.save();

    return res.status(200).json({ session });

  } catch (error) {
    console.log("❌ ERROR:", error);
    return res.status(500).json({ message: "Join failed" });
  }
}










