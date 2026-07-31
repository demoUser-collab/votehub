import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, writeBatch, getDocs } from "firebase/firestore";
import { Trash2, Plus, RefreshCw, Power } from "lucide-react";
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
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex gap-4">
          <button onClick={toggleVoting} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${votingActive ? 'bg-red-500' : 'bg-green-500'}`}>
            <Power size={18} /> {votingActive ? 'Stop Voting' : 'Start Voting'}
          </button>
          <button onClick={resetVotes} className="bg-orange-500 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <RefreshCw size={18} /> Reset All
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={addCandidate} className="glass p-6 rounded-2xl flex flex-col gap-4 h-fit">
          <h2 className="text-xl font-bold mb-2">Add Candidate</h2>
          <input className="bg-white/5 border border-white/10 p-3 rounded-lg" placeholder="Name" value={newCand.name} onChange={e => setNewCand({...newCand, name: e.target.value})} required />
          <input className="bg-white/5 border border-white/10 p-3 rounded-lg" placeholder="Party" value={newCand.party} onChange={e => setNewCand({...newCand, party: e.target.value})} required />
          <input className="bg-white/5 border border-white/10 p-3 rounded-lg" placeholder="Image URL" value={newCand.imageUrl} onChange={e => setNewCand({...newCand, imageUrl: e.target.value})} required />
          <button className="btn-primary flex items-center justify-center gap-2"><Plus size={18}/> Add</button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Manage Candidates</h2>
          {candidates.map(c => (
            <div key={c.id} className="glass p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-bold">{c.name}</p>
                <p className="text-sm text-gray-400">{c.party}</p>
              </div>
              <button onClick={() => deleteDoc(doc(db, "candidates", c.id))} className="text-red-400 p-2 hover:bg-red-500/20 rounded-lg">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}