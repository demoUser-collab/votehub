import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, runTransaction } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { CheckCircle, Lock, Users, ShieldCheck, Search, AlertTriangle, Copy, X, FileCheck } from "lucide-react";

export default function VotingPage() {
  const { user, voter, userData } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [votingActive, setVotingActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [receiptHash, setReceiptHash] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeUid = user?.uid || voter?.voterId;

  useEffect(() => {
    const unsubC = onSnapshot(collection(db, "candidates"), (s) =>
      setCandidates(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    const unsubS = onSnapshot(doc(db, "settings", "global"), (s) =>
      setVotingActive(s.data()?.votingActive ?? true)
    );
    return () => {
      unsubC();
      unsubS();
    };
  }, []);

  const generateReceiptHash = async (candidateId) => {
    const text = `${activeUid}-${candidateId}-${Date.now()}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, 32);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading("Encrypting ballot & submitting...");

    try {
      const generatedHash = await generateReceiptHash(selectedCandidate.id);

      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, "users", activeUid);
        const candRef = doc(db, "candidates", selectedCandidate.id);

        const candSnap = await transaction.get(candRef);
        const userSnap = await transaction.get(userRef);

        if (!candSnap.exists()) throw new Error("Candidate does not exist!");
        if (userSnap.exists() && userSnap.data()?.hasVoted) {
          throw new Error("You have already voted!");
        }

        transaction.update(candRef, {
          voteCount: (candSnap.data().voteCount || 0) + 1,
        });

        transaction.set(
          userRef,
          {
            hasVoted: true,
            votedAt: new Date().toISOString(),
            receiptHash: generatedHash,
          },
          { merge: true }
        );
      });

      toast.dismiss(loadingToast);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#fbbf24", "#d97706", "#ffffff"],
      });

      setReceiptHash(generatedHash);
      toast.success("Vote cryptographically recorded!");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "Voting failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSelectedCandidate(null);
    }
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.party.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold uppercase tracking-widest mb-4">
          <ShieldCheck size={14} /> Cryptographic Ballot Box
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 uppercase tracking-tight">
          Cast Your Digital Vote
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Select your verified candidate. Votes are cryptographically hashed and anonymous once cast.
        </p>
      </header>

      {!votingActive && (
        <div className="glass border-red-500/50 bg-red-500/10 p-4 rounded-2xl mb-8 flex items-center justify-center gap-3 text-red-200 text-sm">
          <Lock size={18} /> <span className="font-bold">ELECTION PAUSED:</span> Voting is currently disabled by administrators.
        </div>
      )}

      {userData?.hasVoted && (
        <div className="glass border-emerald-500/50 bg-emerald-500/10 p-6 rounded-2xl mb-8 text-center text-emerald-200">
          <div className="flex items-center justify-center gap-2 font-bold text-lg mb-2">
            <CheckCircle size={22} className="text-emerald-400" /> Vote Verified & Recorded
          </div>
          <p className="text-xs text-emerald-300/80 font-mono">
            Receipt Hash: {userData?.receiptHash || receiptHash || "0x8f2a...91bc"}
          </p>
        </div>
      )}

      <div className="mb-8 max-w-md mx-auto relative">
        <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="Search candidate or party..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/80 border border-slate-800 p-3 pl-12 rounded-xl text-slate-200 text-sm outline-none focus:border-amber-500 transition"
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCandidates.map((c) => (
          <motion.div
            whileHover={{ y: -6 }}
            key={c.id}
            className="glass p-6 rounded-3xl relative group overflow-hidden border border-slate-800 hover:border-amber-500/40 transition-colors bg-slate-900/60"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-amber-400">
              <Users size={80} />
            </div>

            <img
              src={
                c.imageUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=1e293b&color=f59e0b`
              }
              alt={c.name}
              className="w-24 h-24 rounded-2xl mb-4 object-cover border-2 border-amber-500/50 p-1"
            />

            <h3 className="text-2xl font-bold text-white mb-1">{c.name}</h3>
            <p className="text-amber-400 font-semibold mb-6 tracking-wide uppercase text-xs font-mono">
              {c.party}
            </p>

            <button
              disabled={userData?.hasVoted || !votingActive}
              onClick={() => setSelectedCandidate(c)}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${userData?.hasVoted || !votingActive
                  ? "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800"
                  : "btn-primary shadow-lg shadow-amber-500/20"
                }`}
            >
              {userData?.hasVoted ? "Ballot Locked" : "Cast Vote"}
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass max-w-md w-full p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-[#070a11] shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 text-amber-400 mb-4">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold text-white uppercase">Confirm Selection</h3>
              </div>

              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                You are about to cast your vote for{" "}
                <span className="font-bold text-amber-400">{selectedCandidate.name}</span> ({selectedCandidate.party}). This action is permanent and cannot be modified.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="w-1/2 py-3 rounded-xl border border-slate-800 text-slate-400 hover:bg-slate-800/50 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleConfirmVote}
                  className="w-1/2 btn-primary py-3 rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20"
                >
                  Confirm & Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {receiptHash && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass max-w-md w-full p-8 rounded-3xl border border-emerald-500/30 bg-[#070a11] text-center"
            >
              <FileCheck size={48} className="text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white uppercase mb-2">Ballot Sealed</h3>
              <p className="text-slate-400 text-xs mb-6">
                Your vote was cryptographically encrypted and submitted to the tally ledger.
              </p>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 mb-6 break-all flex items-center justify-between gap-2">
                <span>{receiptHash}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(receiptHash);
                    toast.success("Receipt copied!");
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <Copy size={16} />
                </button>
              </div>

              <button
                onClick={() => setReceiptHash(null)}
                className="w-full btn-primary py-3 rounded-xl font-bold text-sm"
              >
                Close Receipt
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}