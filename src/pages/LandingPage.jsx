import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Lock, ShieldCheck, Zap, BarChart3, CheckCircle2, Cpu } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#070a11] text-slate-100 overflow-x-hidden">
      
      {/* ================================================
         DUAL SPLIT HERO SECTION
      ================================================ */}
      <div className="relative min-h-screen flex items-center pt-20 lg:pt-0">
        {/* RIGHT SIDE: Clockwork Artwork (Dual Split) */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 h-full pointer-events-none z-0 overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-right-top bg-no-repeat opacity-95"
            style={{ 
              backgroundImage: `url('/hero-bg.jpg')`,
              imageRendering: "-webkit-optimize-contrast",
              filter: "contrast(105%) brightness(95%)"
            }}
          />
          {/* Seamless Left-to-Right Dissolve */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070a11] via-[#070a11]/90 via-25% sm:via-[#070a11]/70 md:via-35% to-transparent" />
          {/* Subtle Bottom-only Dissolve into Next Section */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070a11] to-transparent" />
        </div>

        {/* LEFT SIDE: Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase mb-8 backdrop-blur-md">
              <Lock size={13} /> Clockwork Auditability
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-wider text-slate-100 mb-6 leading-tight">
              Precision In <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(245,158,11,0.2)]">
                Decentralized Votes
              </span>
            </h1>

            <p className="text-slate-300 text-lg md:text-xl mb-10 font-normal leading-relaxed">
              Engineered with absolute transparency. Experience instant cryptographic verification with high-speed performance.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/vote" className="btn-primary text-lg flex items-center gap-2">
                Cast Your Vote <ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================================================
         1. SCROLL SECTION: LIVE METRICS BAR
      ================================================ */}
      <section className="relative z-10 border-y border-slate-800/80 bg-[#070a11] py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "100%", label: "Tamper-Proof Integrity" },
            { value: "< 12ms", label: "Verification Latency" },
            { value: "256-Bit", label: "AES Encryption Standard" },
            { value: "24/7", label: "Real-Time Audit Availability" },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 mb-1">{stat.value}</div>
              <div className="text-slate-400 text-xs sm:text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================================================
         2. SCROLL SECTION: FEATURE CARDS
      ================================================ */}
      <section className="relative z-10 bg-[#070a11] py-28 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
              Institutional Governance Engine
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Designed to handle complex multi-tier elections without compromising speed, accuracy, or privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="text-amber-400" size={28} />,
                title: "Tamper-Proof Ballots",
                desc: "Immutable cryptographic ledger prevents vote modification or double-submission attempts.",
              },
              {
                icon: <Zap className="text-amber-400" size={28} />,
                title: "Instant Verification",
                desc: "Ballots are verified and logged in milliseconds with automated receipt tokens generated for each voter.",
              },
              {
                icon: <BarChart3 className="text-amber-400" size={28} />,
                title: "Live Audit Analytics",
                desc: "Dynamic charts deliver election visibility while preserving complete user anonymity.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="glass p-8 rounded-2xl relative group border border-slate-800 hover:border-amber-500/40 transition-colors"
              >
                <div className="p-3 w-fit rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
         3. SCROLL SECTION: WORKFLOW
      ================================================ */}
      <section className="relative z-10 bg-[#070a11] py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
              How VoteHub Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Three seamless steps from authorization to immutable verification.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { step: "01", icon: <Lock size={22} />, title: "Authenticate", desc: "Log in securely using multi-factor identity credentials." },
              { step: "02", icon: <Cpu size={22} />, title: "Cast Ballot", desc: "Select candidates with real-time end-to-end encryption." },
              { step: "03", icon: <CheckCircle2 size={22} />, title: "Verify Result", desc: "Receive your unique receipt hash to audit your vote anytime." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center"
              >
                <span className="text-amber-500 font-mono text-sm mb-2">{item.step}</span>
                <div className="p-3 rounded-full bg-amber-500/10 text-amber-400 mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}