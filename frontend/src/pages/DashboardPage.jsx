import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import toast from "react-hot-toast"; // 🔴 Add this import

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  // 🔴 FIXED: Add invitedEmail to roomConfig
  const [roomConfig, setRoomConfig] = useState({ 
    problem: "", 
    difficulty: "",
    invitedEmail: "" 
  });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  // 🔴 FIXED: Update handleCreateRoom to include invitedEmail
  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty || !roomConfig.invitedEmail) {
      toast.error("Please fill all fields including invited email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(roomConfig.invitedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
        invitedEmail: roomConfig.invitedEmail, // 🔴 Send invited email
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          // Reset form
          setRoomConfig({ problem: "", difficulty: "", invitedEmail: "" });
          // Copy session link to clipboard
          const sessionLink = `${window.location.origin}/session/${data.session._id}`;
          navigator.clipboard.writeText(sessionLink);
          toast.success("Session created! Link copied to clipboard");
          navigate(`/session/${data.session._id}`);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to create session");
        }
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user?.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        {/* Grid layout */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setRoomConfig({ problem: "", difficulty: "", invitedEmail: "" }); // Reset on close
        }}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;