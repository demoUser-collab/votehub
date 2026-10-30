import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminLoginPage";
import ResultsPage from "./pages/ResultsPage";
import VotingPage from "./pages/VotingPage";
import LandingPage from "./pages/LandingPage";


// src/App.jsx (Excerpt - ProtectedRoute)

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, voter, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-amber-400 font-mono text-sm bg-[#070a11]">
        Validating Ledger Session...
      </div>
    );
  }

  // Fallback check against localStorage in case of race condition during redirect
  const savedVoter = localStorage.getItem("votehub_voter");
  const isAuthenticated = !!user || !!voter || !!savedVoter;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const activeVoter = voter || (savedVoter ? JSON.parse(savedVoter) : null);
  const isAdmin =
    user?.email === "admin@voting.com" ||
    activeVoter?.role === "admin" ||
    activeVoter?.voterId?.startsWith("ADM-");

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen text-slate-100 bg-[#070a11]">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<div className="pt-20"><LoginPage /></div>} />
            <Route path="/admin/login" element={<div className="pt-20"><AdminLoginPage /></div>} />
            <Route path="/results" element={<div className="pt-20"><ResultsPage /></div>} />
            <Route path="/vote" element={<div className="pt-20"><ProtectedRoute><VotingPage /></ProtectedRoute></div>} />
            <Route path="/admin" element={<div className="pt-20"><ProtectedRoute adminOnly><AdminPage /></ProtectedRoute></div>} />
          </Routes>
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
}