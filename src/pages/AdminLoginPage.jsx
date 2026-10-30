import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, writeBatch, getDocs } from "firebase/firestore";
import { Trash2, Plus, RefreshCw, Power, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPage() {
  const [candidates, setCandidates] = useState([]);
  const [votingActive, setVotingActive] = useState(true);
  const [newCand, setNewCand] = useState({ name: "", party: "", imageUrl: "" });

  useEffect(() => {
    const unsubC = onSnapshot(collection(db, "candidates"), (s) =>
      setCandidates(s.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    const unsubS = onSnapshot(doc(db, "settings", "global"), (s) =>
      setVotingActive(s.data()?.votingActive ?? true)
    );
    return () => { unsubC(); unsubS(); };
  }, []);

  const addCandidate = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "candidates"), { ...newCand, voteCount: 0 });
    setNewCand({ name: "", party: "", imageUrl: "" });
    toast.success("Candidate Added!");
  };

  const toggleVoting = async () => {
    await updateDoc(doc(db, "settings", "global"), { votingActive: !votingActive });
    toast.success(`Voting ${!votingActive ? 'Enabled' : 'Disabled'}`);
  };

  const resetVotes = async () => {
    if (!confirm("Are you sure? This resets EVERYTHING.")) return;
    const batch = writeBatch(db);

    // Reset Candidates
    candidates.forEach(c => batch.update(doc(db, "candidates", c.id), { voteCount: 0 }));

    // Reset Users
    const usersSnap = await getDocs(collection(db, "users"));
    usersSnap.forEach(u => batch.update(doc(db, "users", u.id), { hasVoted: false, votedFor: null }));

    await batch.commit();
    toast.success("All votes reset!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-10 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">Election Management & Control Center</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/results"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition shadow-md shadow-amber-500/20"
          >
            <BarChart3 size={18} /> View Results
          </Link>
          <button onClick={toggleVoting} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition ${votingActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
            <Power size={18} /> {votingActive ? 'Stop Voting' : 'Start Voting'}
          </button>
          <button onClick={resetVotes} className="bg-slate-800 hover:bg-red-900/50 border border-slate-700 hover:border-red-500/50 text-slate-200 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition">
            <RefreshCw size={18} /> Reset All
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={addCandidate} className="glass p-6 rounded-2xl flex flex-col gap-4 h-fit border border-slate-800">
          <h2 className="text-xl font-bold mb-2 text-white">Add Candidate</h2>
          <input
            className="bg-white/5 border border-white/10 p-3 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white outline-none transition"
            placeholder="Candidate Name"
            value={newCand.name}
            onChange={e => setNewCand({ ...newCand, name: e.target.value })}
            required
          />
          <input
            className="bg-white/5 border border-white/10 p-3 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white outline-none transition"
            placeholder="Party / Affiliation"
            value={newCand.party}
            onChange={e => setNewCand({ ...newCand, party: e.target.value })}
            required
          />
          <input
            className="bg-white/5 border border-white/10 p-3 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white outline-none transition"
            placeholder="Image URL"
            value={newCand.imageUrl}
            onChange={e => setNewCand({ ...newCand, imageUrl: e.target.value })}
            required
          />
          <button className="btn-primary flex items-center justify-center gap-2 mt-2">
            <Plus size={18} /> Add Candidate
          </button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Manage Candidates</h2>
          {candidates.length === 0 && (
            <p className="text-slate-400 text-sm">No candidates found in database.</p>
          )}
          {candidates.map(c => (
            <div key={c.id} className="glass p-4 rounded-xl flex justify-between items-center border border-slate-800">
              <div>
                <p className="font-bold text-white">{c.name}</p>
                <p className="text-sm text-amber-400/90">{c.party}</p>
              </div>
              <button onClick={() => deleteDoc(doc(db, "candidates", c.id))} className="text-slate-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}