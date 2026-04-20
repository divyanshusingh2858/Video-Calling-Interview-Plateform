export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    const userId = req.user?._id;
    const clerkId = req.user?.clerkId;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId?.toString()) {
      return res.status(400).json({
        message: "Host cannot join their own session as participant",
      });
    }

    if (session.participant) {
      return res.status(409).json({ message: "Session is full" });
    }

    // ✅ FIX: no email restriction
    console.log("Allowing join without email restriction");

    session.participant = userId;
    await session.save();

    if (clerkId) {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.addMembers([clerkId]);
    }

    res.status(200).json({ session });

  } catch (error) {
    console.log("❌ Error in joinSession:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}