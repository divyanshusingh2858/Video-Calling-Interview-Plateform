import { useState } from "react";
import toast from "react-hot-toast";
import { useCreateSession } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({ isOpen, onClose }) {
  const [problem, setProblem] = useState("");
  const [invitedEmail, setInvitedEmail] = useState("");

  const createSessionMutation = useCreateSession();

  if (!isOpen) return null;

  const handleCreateSession = () => {
    // 🔥 VALIDATION FIX
    if (!problem || !invitedEmail?.trim()) {
      toast.error("Please fill all fields including invited email");
      return;
    }

    createSessionMutation.mutate(
      {
        problem,
        difficulty: "easy", // 🔥 FIX (no empty difficulty)
        invitedEmail: invitedEmail.trim(),
      },
      {
        onSuccess: (res) => {
          toast.success("Session created successfully!");

          // optional: copy invite link
          if (res?.session?._id) {
            const link = `${window.location.origin}/session/${res.session._id}`;
            navigator.clipboard.writeText(link);
          }

          onClose();
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to create session");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">Create New Session</h2>

        {/* 🔹 Problem Select */}
        <select
          className="select select-bordered w-full"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        >
          <option value="">Select Problem</option>
          {Object.values(PROBLEMS).map((p) => (
            <option key={p.title} value={p.title}>
              {p.title}
            </option>
          ))}
        </select>

        {/* 🔹 Email Input */}
        <input
          type="email"
          placeholder="Enter invited email"
          className="input input-bordered w-full"
          value={invitedEmail}
          onChange={(e) => setInvitedEmail(e.target.value)}
        />

        {/* 🔹 Info */}
        <p className="text-sm text-blue-400">
          Only this email address will be allowed to join the session
        </p>

        {/* 🔹 Buttons */}
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={handleCreateSession}
            disabled={createSessionMutation.isPending}
          >
            {createSessionMutation.isPending ? "Creating..." : "Create Session"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSessionModal;