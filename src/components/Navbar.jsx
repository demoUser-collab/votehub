import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Vote, LogOut, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, voter, logout } = useAuth();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);

  const activeUser = user || voter;
  const isAdmin = user?.email === "admin@voting.com" || voter?.role === "admin" || voter?.voterId?.startsWith("ADM-");

  // Secret 5-click activation trigger
  const handleSecretAdminClick = (e) => {
    e.preventDefault();
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 5) {
        toast.success("🔐 Vault Access Triggered", { icon: "🛡️" });
        navigate("/admin/login");
        return 0;
      }
      return newCount;
    });

    if (clickTimer) clearTimeout(clickTimer);
    setClickTimer(
      setTimeout(() => {
        setClickCount(0);
      }, 2000)
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-8 pt-4 pb-2 pointer-events-none">
      <nav className="glass max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center rounded-2xl border border-white/10 shadow-2xl shadow-black/40 backdrop-blur-xl pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSecretAdminClick}
            className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-xl text-slate-950 shadow-md shadow-amber-500/20 active:scale-90 transition-transform cursor-pointer"
            title="VoteHub Security Portal"
          >
            <Vote size={22} className="stroke-[2.5]" />
          </button>

          <Link to="/" className="text-2xl font-black tracking-tight text-white">
            <span>VOTE<span className="text-amber-400">HUB</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {isAdmin && (
            <>
              <Link to="/results" className="text-amber-400 hover:text-amber-300 transition font-medium text-sm flex items-center gap-1.5">
                Results
              </Link>
              <Link to="/admin" className="text-amber-400 hover:text-amber-300 transition" title="Admin Panel">
                <ShieldCheck size={20} />
              </Link>
            </>
          )}

          {activeUser ? (
            <div className="flex items-center gap-4">
              <Link to="/vote" className="btn-primary py-2 px-4 text-sm">
                Vote Now
              </Link>
              <button onClick={logout} className="text-gray-400 hover:text-red-400 transition cursor-pointer">
                <LogOut size={20} />
              </button>
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || voter?.voterId || "Voter")}&background=1e293b&color=f59e0b`}
                className="w-9 h-9 rounded-full border-2 border-amber-500 shadow-lg shadow-amber-500/20 object-cover"
                alt="avatar"
              />
            </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-6">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}