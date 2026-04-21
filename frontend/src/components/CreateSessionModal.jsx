import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  ...roomConfig,
                  difficulty: selectedProblem?.difficulty || "",
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* INVITED PARTICIPANT EMAIL - NEW */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Invite Participant Email</span>
              <span className="label-text-alt text-error">*</span>
            </label>
            <input
              type="email"
              placeholder="colleague@example.com"
              className="input input-bordered w-full"
              value={roomConfig.invitedEmail || ''}
              onChange={(e) => setRoomConfig({
                ...roomConfig,
                invitedEmail: e.target.value
              })}
              required
            />
            <label className="label">
              <span className="label-text-alt text-info">
                Only this email address will be allowed to join the session
              </span>
            </label>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && roomConfig.invitedEmail && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div className="flex-1">
                <p className="font-semibold">Session Summary:</p>
                <p className="text-sm">Problem: <span className="font-medium">{roomConfig.problem}</span></p>
                <p className="text-sm">Difficulty: <span className="font-medium">{roomConfig.difficulty}</span></p>
                <p className="text-sm">Invited: <span className="font-medium">{roomConfig.invitedEmail}</span></p>
                <p className="text-xs mt-2 opacity-75">Link will be copied to clipboard after creation</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            onClick={onClose}
            disabled={isCreating}
          >
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem || !roomConfig.invitedEmail}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create Session"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default CreateSessionModal;