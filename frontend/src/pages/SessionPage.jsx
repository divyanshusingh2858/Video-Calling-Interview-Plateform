import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import CodeEditorPanel from "../components/CodeEditorPanel";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();

  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const { data: sessionData, isLoading: loadingSession } = useSessionById(id);
  const joinSessionMutation = useJoinSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  // ✅ FIXED JOIN (NO LOOP + NO EMAIL CHECK)
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;
    if (hasJoined) return;

    joinSessionMutation.mutate(id, {
      onSuccess: () => {
        setHasJoined(true);
        toast.success("Joined session successfully!");
      },
      onError: () => {
        toast.error("Join failed");
      }
    });

  }, [session, user, loadingSession, isHost, isParticipant, id, hasJoined]);

  // 🔥 TEST RUNNER
  const runTestCases = async (cases) => {
    const results = [];

    for (const test of cases) {
      const wrappedCode = `
${code}

try {
  const result = ${problemData.title === "Two Sum" ? "twoSum" : "isPalindrome"}(${test.input});
  console.log(JSON.stringify(result));
} catch(e) {
  console.log("ERROR");
}
`;

      const res = await executeCode(selectedLanguage, wrappedCode);

      const actual = res?.output?.trim();
      const expected = test.output;

      results.push({
        input: test.input,
        expected,
        actual,
        passed: actual === expected
      });
    }

    return results;
  };

  // ✅ RUN
  const handleRunCode = async () => {
    setIsRunning(true);
    const results = await runTestCases(problemData.testCases);
    setOutput(results);
    setIsRunning(false);
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    setIsRunning(true);

    const results = await runTestCases(problemData.hiddenTestCases);

    const allPassed = results.every(r => r.passed);

    if (allPassed) {
      toast.success("🎉 All test cases passed!");
    } else {
      toast.error("❌ Some test cases failed");
    }

    setOutput(results);
    setIsRunning(false);
  };

  if (loadingSession) return <div>Loading...</div>;
  if (!session) return <div>Session not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{session.problem}</h1>

      {/* 🔥 BUTTONS */}
      <div className="flex gap-2 mt-4">
        <button onClick={handleRunCode} className="btn btn-primary">
          Run
        </button>

        <button onClick={handleSubmit} className="btn btn-success">
          Submit
        </button>
      </div>

      {/* 🔥 OUTPUT */}
      <div className="mt-4 space-y-2">
        {output?.map((test, i) => (
          <div key={i} className="border p-2 rounded">
            <p>Input: {test.input}</p>
            <p>Expected: {test.expected}</p>
            <p>Output: {test.actual}</p>
            <p>{test.passed ? "✅ Passed" : "❌ Failed"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionPage;