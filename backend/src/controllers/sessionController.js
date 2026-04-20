export async function joinSession(req, res) {
  try {
    console.log("🔵 JOIN SESSION STARTED");
    console.log("Session ID:", req.params.id);
    console.log("User:", req.user?._id);
    
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;
    const userEmail = req.user.email;

    console.log("Looking for session...");
    const session = await Session.findById(id);

    if (!session) {
      console.log("❌ Session not found");
      return res.status(404).json({ message: "Session not found" });
    }

    console.log("Session found:", session._id);
    console.log("Session status:", session.status);

    if (session.status !== "active") {
      console.log("❌ Session not active");
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      console.log("❌ Host trying to join");
      return res.status(400).json({
        message: "Host cannot join their own session as participant",
      });
    }

    if (session.participant) {
      console.log("❌ Session full");
      return res.status(409).json({ message: "Session is full" });
    }

    // Email check
    const invitedEmail = session.invitedParticipantEmail?.trim().toLowerCase();
    const joiningEmail = userEmail?.trim().toLowerCase();

    console.log("Invited email:", invitedEmail);
    console.log("Joining email:", joiningEmail);

    if (invitedEmail && invitedEmail !== joiningEmail) {
      console.log("❌ Email mismatch");
      return res.status(403).json({ 
        message: `This session was created for ${session.invitedParticipantEmail}. Your email (${userEmail}) is not invited.` 
      });
    }

    console.log("✅ Adding participant...");
    session.participant = userId;
    await session.save();

    console.log("✅ Adding to chat channel...");
    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    console.log("✅ Join successful!");
    res.status(200).json({ session });
    
  } catch (error) {
    console.log("❌ ERROR in joinSession:", error.message);
    console.log("❌ Error stack:", error.stack);
    res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
}