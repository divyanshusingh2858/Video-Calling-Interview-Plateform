export async function joinSession(req, res) {
  try {
    const { id } = req.params;

    // ❗ handle user optional
    const userId = req.user?._id;
    const clerkId = req.user?.clerkId;
    const userEmail = req.user?.email;

    console.log("========== JOINING SESSION ==========");
    console.log("User email from DB:", userEmail);

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    // ❗ only check host if user exists
    if (userId && session.host.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Host cannot join their own session as participant",
      });
    }

    if (session.participant) {
      return res.status(409).json({ message: "Session is full" });
    }

    const invitedEmail = session.invitedParticipantEmail?.trim().toLowerCase();
    const joiningEmail = userEmail?.trim().toLowerCase();

    console.log("Invited email:", invitedEmail);
    console.log("Joining email:", joiningEmail);

    // ❗ only check email if user logged in
    // if (userEmail && invitedEmail && invitedEmail !== joiningEmail) {
    //   return res.status(403).json({
    //     message: "You are not invited",
    //   });
    // }

    // ❗ allow join even without login
    session.participant = userId || null;
    await session.save();

    if (clerkId) {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.addMembers([clerkId]);
    }

    console.log("✅ Join successful!");
    res.status(200).json({ session });

  } catch (error) {
    console.log("❌ Error in joinSession:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}