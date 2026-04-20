export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    console.log("========== JOINING SESSION ==========");

    // ✅ SAFE USER (no crash if not logged in)
    const userId = req.user?._id || null;
    const clerkId = req.user?.clerkId || null;

    console.log("User ID:", userId);

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "active") {
      return res.status(400).json({ message: "Session is not active" });
    }

    // ❗ prevent host joining again as participant
    if (userId && session.host.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Host cannot join their own session as participant",
      });
    }

    // ❗ already joined
    if (session.participant) {
      return res.status(409).json({ message: "Session is full" });
    }

    // ✅ NO EMAIL RESTRICTION (main fix)
    console.log("Skipping email check - allowing join");

    if (userId) {
      session.participant = userId;
    }

    await session.save();

    // optional chat join
    if (clerkId) {
      try {
        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);
      } catch (err) {
        console.log("Chat join error:", err.message);
      }
    }

    console.log("✅ JOIN SUCCESS");

    return res.status(200).json({ session });

  } catch (error) {
    console.log("❌ JOIN ERROR:", error);
    return res.status(500).json({
      message: "Join failed",
      error: error.message,
    });
  }
}