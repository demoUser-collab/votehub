import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import ResultsPage from "./pages/ResultsPage";
import VotingPage from "./pages/VotingPage";
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.email !== "admin@voting.com") return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        
        <div className="min-h-screen bg-gradient-to-br from-stone-900 via-orange-900 to-zinc-900">

          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/vote" element={<ProtectedRoute><VotingPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>} />
          </Routes>
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
}