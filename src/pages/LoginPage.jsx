import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Lock, ArrowRight, ShieldCheck, UserCheck, KeyRound, Building2, Fingerprint, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [idType, setIdType] = useState("voter_id");
  const [voterId, setVoterId] = useState("");
  const [organization, setOrganization] = useState("national_2026");
  const [password, setPassword] = useState("");
  const [authMethod, setAuthMethod] = useState("passkey");
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithVoterId } = useAuth();
  const navigate = useNavigate();

  const handleVerifyEligibility = async (e) => {
    e.preventDefault();
    if (!voterId.trim()) return toast.error("Please enter a valid Registration ID");

    setIsLoading(true);
    const toastId = toast.loading("Verifying ID against voter registry...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.dismiss(toastId);
      toast.success("Voter ID verified & eligible");
      setStep(2);
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(error.message || "Invalid Voter ID or already voted");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalAuthorization = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading(
      authMethod === "passkey" ? "Prompting Biometric Passkey..." : "Authenticating secret key..."
    );

    try {
      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // 1. Establish session in context
      loginWithVoterId({ voterId, idType, organization, password });

      toast.dismiss(toastId);
      toast.success("Identity verified. Entering booth...");

      // 2. Small delay ensures React Context updates before Router checks ProtectedRoute
      setTimeout(() => {
        navigate("/vote", { replace: true });
      }, 50);

    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Authorization failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass max-w-md w-full p-8 sm:p-10 rounded-3xl border border-slate-800 bg-[#070a11]/90 shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold uppercase tracking-widest">
            <ShieldCheck size={16} /> Step {step} of 2
          </div>
          <span className="text-slate-500 text-xs font-mono">256-BIT SECURE</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-center mb-2 tracking-tight text-slate-100 uppercase">
          VOTER ACCESS
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm text-center mb-6">
          {step === 1
            ? "Select your ID classification and enter your official credentials."
            : "Complete biometric or passcode authorization to receive your voting token."}
        </p>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleVerifyEligibility}
              className="space-y-4"
            >
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-medium text-slate-400">
                {[
                  { id: "voter_id", label: "Voter ID" },
                  { id: "student_id", label: "Student ID" },
                  { id: "employee_id", label: "Emp ID" },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setIdType(type.id)}
                    className={`py-2 rounded-lg transition ${idType === type.id
                        ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold"
                        : "hover:text-slate-200"
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Building2 className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <select
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 p-3.5 pl-12 rounded-xl text-slate-200 text-xs outline-none focus:border-amber-500 transition appearance-none cursor-pointer"
                >
                  <option value="national_2026">National General Election 2026</option>
                  <option value="university_council">University Student Council</option>
                  <option value="corporate_board">Corporate Board Ballot</option>
                </select>
              </div>

              <div className="relative">
                <UserCheck className="absolute left-4 top-4 text-slate-500" size={18} />
                <input
                  type="text"
                  value={voterId}
                  placeholder={
                    idType === "voter_id" ? "Voter ID (e.g. VOTE-8821-X)" :
                      idType === "student_id" ? "Student ID (e.g. STU-2026-09)" : "Employee ID (e.g. EMP-4011)"
                  }
                  required
                  className="w-full bg-slate-900/60 border border-slate-800 p-4 pl-12 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-slate-100 font-mono text-xs sm:text-sm outline-none transition uppercase"
                  onChange={(e) => setVoterId(e.target.value.toUpperCase())}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-4 text-base font-bold shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                Verify Eligibility <ArrowRight size={18} />
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleFinalAuthorization}
              className="space-y-4"
            >
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs font-mono text-amber-400">
                <span className="capitalize">{idType.replace("_", " ")}:</span>
                <span className="font-bold">{voterId}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMethod("passkey")}
                  className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${authMethod === "passkey"
                      ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <Fingerprint size={15} /> Passkey / TouchID
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod("secret_key")}
                  className={`py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition ${authMethod === "secret_key"
                      ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <KeyRound size={15} /> Passcode / Key
                </button>
              </div>

              {authMethod === "secret_key" ? (
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-slate-500" size={18} />
                  <input
                    type="password"
                    value={password}
                    placeholder="Enter security key or passcode"
                    required
                    className="w-full bg-slate-900/60 border border-slate-800 p-4 pl-12 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-slate-100 text-sm outline-none transition"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 text-center flex flex-col items-center justify-center gap-2">
                  <Fingerprint className="text-amber-400 animate-pulse" size={36} />
                  <p className="text-xs text-slate-300 font-medium">Biometric Access Ready</p>
                  <p className="text-[10px] text-slate-500">Submit to trigger local passkey verification.</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-4 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary py-4 text-base font-bold shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  Issue Token & Enter <Lock size={18} />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}