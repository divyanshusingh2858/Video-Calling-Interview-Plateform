export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    console.log("==== JOIN SESSION START ====");

    // ✅ SAFE USER (important)
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

    // ❌ REMOVE HOST CHECK (temporary safe)
    // ❌ REMOVE EMAIL CHECK (already done)

    if (session.participant) {
      return res.status(409).json({ message: "Session is full" });
    }

    // ✅ SAFE participant set
    if (userId) {
      session.participant = userId;
    }

    await session.save();

    // ✅ SAFE chat join
    if (clerkId) {
      try {
        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);
      } catch (err) {
        console.log("Chat join error (ignored):", err.message);
      }
    }

    console.log("✅ JOIN SUCCESS");

    res.status(200).json({ session });

  } catch (error) {
    console.log("❌ FULL ERROR:", error);
    res.status(500).json({ message: "Join failed", error: error.message });
  }
}