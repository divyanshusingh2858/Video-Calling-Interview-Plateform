export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    console.log("==== JOIN SESSION START ====");

    // ❗ SAFE user (no crash)
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

    // ✅ allow join even without login
    session.participant = userId || null;

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

    res.status(200).json({ session });

  } catch (error) {
    console.log("❌ JOIN ERROR:", error);
    res.status(500).json({ message: "Join failed", error: error.message });
  }
}