import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Vote, LogOut, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.email === "admin@voting.com";

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center m-4 rounded-2xl">
      <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white">
        <div className="bg-gradient-to-br from-yellow-600 to-red-600 p-2 rounded-lg">
          <Vote size={24} />
        </div>
        VOTE<span className="text-amber-500">HUB</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/results" className="text-gray-300 hover:text-white transition font-medium">Results</Link>
        {isAdmin && <Link to="/admin" className="text-yellow-400 hover:text-yellow-300"><ShieldCheck size={20}/></Link>}
        
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/vote" className="btn-primary py-2 px-4 text-sm">Vote Now</Link>
            <button onClick={logout} className="text-gray-400 hover:text-red-400 transition">
              <LogOut size={20} />
            </button>
            <img src={user.photoURL} className="w-9 h-9 rounded-full border-2 border-amber-500 shadow-lg shadow-amber-500/20" alt="avatar" />
          </div>
        ) : (
          <Link to="/login" className="btn-primary py-2 px-6">Login</Link>
        )}
      </div>
    </nav>
  );
}
