import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  runTransaction,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
// removed framer-motion motion import (not used)
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { CheckCircle, Lock, Users } from "lucide-react";

export default function VotingPage() {
  const { user, userData } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [votingActive, setVotingActive] = useState(true);

  useEffect(() => {
    // Listen to Candidates
    const unsubC = onSnapshot(collection(db, "candidates"), (s) =>
      setCandidates(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    // Listen to Global Settings
    const unsubS = onSnapshot(doc(db, "settings", "global"), (s) =>
      setVotingActive(s.data()?.votingActive ?? true),
    );
    return () => {
      unsubC();
      unsubS();
    };
  }, []);

  const handleVote = async (candidateId) => {
    if (!votingActive) return toast.error("Voting is currently closed.");
    if (userData?.hasVoted) return toast.error("You have already voted!");

    const loadingToast = toast.loading("Processing your vote...");

    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, "users", user.uid);
        const candRef = doc(db, "candidates", candidateId);

        const candSnap = await transaction.get(candRef);
        if (!candSnap.exists()) throw "Candidate does not exist!";

        transaction.update(candRef, {
          voteCount: (candSnap.data().voteCount || 0) + 1,
        });
        transaction.set(
          userRef,
          {
            hasVoted: true,
            votedFor: candidateId,
          },
          { merge: true },
        );
      });

      toast.dismiss(loadingToast);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#9333ea", "#db2777", "#ef4444"],
      });
      toast.success("Vote recorded! Thank you for participating.");
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Vote transaction failed:", error);
      toast.error("Voting failed. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-4">
          Cast Your Digital Vote
        </h1>
        <p className="text-gray-400">
          Select your preferred candidate. This action cannot be undone.
        </p>
      </header>

      {!votingActive && (
        <div className="glass border-red-500/50 bg-red-500/10 p-4 rounded-2xl mb-8 flex items-center justify-center gap-3 text-red-200">
          <Lock size={20} /> <span className="font-bold">Notice:</span> Voting
          is currently paused by the administrator.
        </div>
      )}

      {userData?.hasVoted && (
        <div className="glass border-green-500/50 bg-green-500/10 p-4 rounded-2xl mb-8 flex items-center justify-center gap-3 text-green-200">
          <CheckCircle size={20} /> You have successfully cast your vote.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {candidates.map((c) => (
          <motion.div
            whileHover={{ y: -8 }}
            key={c.id}
            className="glass p-6 rounded-3xl relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users size={80} />
            </div>

            <img
              src={
                c.imageUrl ||
                `https://ui-avatars.com/api/?name=${c.name}&background=random`
              }
              alt={c.name}
              className="w-24 h-24 rounded-2xl mb-4 object-cover border-2 border-purple-500/50 p-1"
            />

            <h3 className="text-2xl font-bold text-white mb-1">{c.name}</h3>
            <p className="text-pink-500 font-semibold mb-6 tracking-wide uppercase text-sm">
              {c.party}
            </p>

            <button
              disabled={userData?.hasVoted || !votingActive}
              onClick={() => handleVote(c.id)}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                userData?.hasVoted
                  ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95"
              }`}
            >
              {userData?.votedFor === c.id
                ? "Voted"
                : userData?.hasVoted
                  ? "Locked"
                  : "Vote Now"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
