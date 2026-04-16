import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { sessionApi } from "../api/sessions";

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [hasJoined, setHasJoined] = useState(false);

  // 🔹 Get session data
  const {
    data,
    isLoading: loadingSession,
    refetch,
  } = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionApi.getSessionById(id),
  });

  const session = data?.session;

  // 🔹 Join session mutation
  const joinSessionMutation = useMutation({
    mutationFn: (id) => sessionApi.joinSession(id),
  });

  // 🔹 Check roles
  const isHost = session?.host?._id === user?.id;
  const isParticipant = session?.participant?._id === user?.id;

  // 🔥 FINAL FIXED JOIN LOGIC
  useEffect(() => {
    if (!session || !user || loadingSession) return;

    // already joined / host → skip
    if (isHost || isParticipant) return;

    // already tried joining → stop loop
    if (hasJoined) return;

    const userEmail = user?.primaryEmailAddress?.emailAddress;

    // optional email validation
    if (
      session.invitedParticipantEmail &&
      session.invitedParticipantEmail.toLowerCase() !== userEmail?.toLowerCase()
    ) {
      toast.error("You are not invited to this session");
      setTimeout(() => navigate("/dashboard"), 3000);
      return;
    }

    console.log("🚀 Joining session...");

    joinSessionMutation.mutate(id, {
      onSuccess: () => {
        setHasJoined(true); // ✅ STOP LOOP
        toast.success("Joined session successfully!");
        refetch(); // optional (only once)
      },
      onError: (error) => {
        console.error("Join error:", error);
        toast.error(error?.message || "Failed to join session");
        setTimeout(() => navigate("/dashboard"), 3000);
      },
    });

  }, [session, user, loadingSession, isHost, isParticipant, id, hasJoined]);

  // 🔹 Loading UI
  if (loadingSession) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Session not found
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
          {session.problem}
        </h1>

        <p className="mb-2">Difficulty: {session.difficulty}</p>
        <p className="mb-2">
          Host: {session.host?.email}
        </p>

        <p className="text-green-400 mt-4">
          Connecting to video call...
        </p>
      </div>
    </div>
  );
}