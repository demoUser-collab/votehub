import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Accessing VoteHub...");
    
    try {
      // Step 1: Attempt Login
      await loginWithEmail(email, password);
      toast.dismiss(loadingToast);
      toast.success("Welcome back!");
      navigate("/vote");
    } catch (error) {
      // Step 2: If user not found, Auto-Register
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
        try {
          const tempName = email.split('@')[0];
          await registerWithEmail(email, password, tempName);
          toast.dismiss(loadingToast);
          toast.success("Account created and logged in!");
          navigate("/vote");
        } catch (regError) {
          toast.dismiss(loadingToast);
          toast.error("Registration failed: " + regError.message);
        }
      } else {
        toast.dismiss(loadingToast);
        toast.error("Auth Error: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="glass max-w-md w-full p-10 rounded-3xl"
      >
        <h2 className="text-3xl font-black text-center mb-6 tracking-tight text-white">VOTER ACCESS</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-500" size={18} />
            <input 
              type="email" 
              placeholder="Email (e.g. aditya@test.com)" 
              required 
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:border-pink-500 text-white outline-none transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-500" size={18} />
            <input 
              type="password" 
              placeholder="Password (min 6 chars)" 
              required 
              className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:border-pink-500 text-white outline-none transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full btn-primary py-4 text-lg shadow-xl shadow-pink-500/20 flex items-center justify-center gap-2"
          >
            Enter Portal <ArrowRight size={20} />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
          New users will be <br/> automatically registered.
        </p>
      </motion.div>
    </div>
  );
}