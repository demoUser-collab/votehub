import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { Trophy, TrendingUp } from "lucide-react";

export default function ResultsPage() {
  const [data, setData] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "candidates"), (s) => {
      const results = s.docs.map(d => ({ 
        name: d.data().name, 
        votes: d.data().voteCount || 0 
      }));
      setData(results);
      setTotalVotes(results.reduce((acc, curr) => acc + curr.votes, 0));
    });
    return () => unsub();
  }, []);

  // Sort candidates by votes to find the winner
  const sortedData = [...data].sort((a, b) => b.votes - a.votes);
  const winner = sortedData[0];

  const colors = ["#f59e0b", "#fbbf24", "#d97706", "#3b82f6", "#10b981"];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="glass p-6 rounded-2xl flex items-center gap-4 border border-slate-800">
          <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400 border border-amber-500/20"><TrendingUp /></div>
          <div>
            <p className="text-sm text-slate-400">Total Votes</p>
            <p className="text-2xl font-black text-white">{totalVotes}</p>
          </div>
        </div>
        
        {winner?.votes > 0 && (
          <div className="glass p-6 rounded-2xl flex items-center gap-4 border-amber-500/30 md:col-span-2">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400 border border-amber-500/20"><Trophy /></div>
            <div>
              <p className="text-sm text-slate-400">Current Leader</p>
              <p className="text-2xl font-black text-white">{winner.name} <span className="text-sm font-normal text-slate-400">({winner.votes} votes)</span></p>
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-8 overflow-hidden border border-slate-800">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-2 text-white">
          Live Standings
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
        </h2>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#ffffff05'}} 
                contentStyle={{backgroundColor: '#0f172a', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: '#fff'}}
                itemStyle={{color: '#f59e0b'}}
              />
              <Bar dataKey="votes" radius={[10, 10, 0, 0]} barSize={60}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}