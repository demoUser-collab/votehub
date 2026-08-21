import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, BarChart3, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 text-center">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-widest text-stone-50 mb-6 leading-relaxed">
  THE FUTURE OF <br />
          


          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            SECURE VOTING
          </span>
        </h1>
        <p className="text-stone-300 text-xl max-w-2xl mx-auto mb-10">
          A decentralized, real-time voting ecosystem built for transparency and
          speed. Join the digital revolution.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {/* Primary Action Button (Warm Gold CTA) */}
          <Link
            to="/vote"
            className="bg-amber-600 hover:bg-amber-400 text-stone-950 px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition shadow-lg shadow-orange-950/40"
          >
            Get Started <ChevronRight size={20} />
          </Link>

          {/* Secondary Action Button (Smoky Warm Glassmorphism) */}
          <Link
            to="/results"
            className="bg-stone-900/40 hover:bg-stone-800/60 border border-stone-700/50 px-8 py-3 rounded-xl font-bold text-stone-200 transition backdrop-blur-sm"
          >
            View Live Results
          </Link>
        </div>
      </Motion.div>

      <div className="grid md:grid-cols-3 gap-8 mt-32">
        {[
          {
            icon: <Shield className="text-green-400" />,
            title: "Secure",
            desc: "Firebase protected authentication",
          },
          {
            icon: <Zap className="text-yellow-400" />,
            title: "Instant",
            desc: "Real-time Firestore updates",
          },
          {
            icon: <BarChart3 className="text-blue-400" />,
            title: "Visual",
            desc: "Dynamic Recharts data viz",
          },
        ].map((feat, i) => (
          <Motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i }}
            className="glass p-8 rounded-3xl text-left"
          >
            <div className="mb-4">{feat.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
            <p className="text-gray-400">{feat.desc}</p>
          </Motion.div>
        ))}
      </div>
    </div>
  );
}
