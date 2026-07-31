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

  const colors = ["#9333ea", "#ec4899", "#f43f5e", "#f59e0b", "#10b981"];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="glass p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400"><TrendingUp /></div>
          <div>
            <p className="text-sm text-gray-400">Total Votes</p>
            <p className="text-2xl font-black">{totalVotes}</p>
          </div>
        </div>
        
        {winner?.votes > 0 && (
          <div className="glass p-6 rounded-2xl flex items-center gap-4 border-yellow-500/30 md:col-span-2">
            <div className="bg-yellow-500/20 p-3 rounded-xl text-yellow-400"><Trophy /></div>
            <div>
              <p className="text-sm text-gray-400">Current Leader</p>
              <p className="text-2xl font-black">{winner.name} <span className="text-sm font-normal text-gray-500">({winner.votes} votes)</span></p>
            </div>
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-8 overflow-hidden">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-2">
          Live Standings
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
        </h2>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#ffffff05'}} 
                contentStyle={{backgroundColor: '#1e1b4b', border: '1px solid #ffffff20', borderRadius: '12px'}}
                itemStyle={{color: '#fff'}}
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