import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTerminal, 
  FaRocket, 
  FaBolt, 
  FaGithub, 
  FaCheck, 
  FaCopy,
  FaShieldAlt,
  FaPaintBrush,
  FaSync
} from 'react-icons/fa';

const App = () => {
  const [copied, setCopied] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = "➜  ~ install maxter";
  const installCmd = "bash <(curl -fsSL https://raw.githubusercontent.com/mahendraplus/MAXTER/Max/install.sh)";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 font-sans">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-50"></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter">
            MAXTER<span className="text-indigo-500">_</span>
          </div>
          <a href="https://github.com/mahendraplus/MAXTER" target="_blank" rel="noreferrer" className="p-2 bg-zinc-900 rounded-full border border-white/10 hover:border-indigo-500/50 transition-all">
            <FaGithub className="text-xl" />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8 uppercase tracking-widest"
          >
            v26.0 Premium Release
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-none"
          >
            The Terminal,<br />
            <span className="bg-gradient-to-r from-white to-indigo-500 bg-clip-text text-transparent">Re-Engineered.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-zinc-400 mb-12"
          >
            The ultimate Zsh & Termux setup for professionals. Fast, intelligent, and beautifully pre-configured for your daily workflow.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto bg-zinc-900/50 border border-white/10 rounded-2xl p-2 flex flex-col md:flex-row items-center gap-4 mb-24"
          >
            <code className="flex-1 p-4 font-mono text-emerald-400 text-sm md:text-base overflow-x-auto whitespace-nowrap scrollbar-hide">
              {installCmd}
            </code>
            <button 
              onClick={copyToClipboard}
              className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied!" : "Copy Command"}
            </button>
          </motion.div>

          {/* Terminal */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-left"
          >
            <div className="bg-zinc-900/80 px-4 py-3 border-b border-white/5 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="p-8 font-mono text-sm md:text-base min-h-[250px]">
              <div>{typedText}<span className="w-2 h-5 bg-white inline-block align-middle ml-1 animate-pulse"></span></div>
              <AnimatePresence>
                {typedText === fullText && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 space-y-1"
                  >
                    <div className="text-emerald-500">✔ MAXTER Environment Loaded.</div>
                    <div className="text-indigo-400">ℹ Powerlevel10k: Active</div>
                    <div className="text-indigo-400">ℹ Plugins: Loaded (git, zsh-syntax, autosuggestions)</div>
                    <br />
                    <div className="font-bold text-white uppercase">[ Welcome to MAXTER v26.0 ]</div>
                    <div>Type <span className="text-indigo-500">'maxter'</span> to open your dashboard.</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FaTerminal />, title: "Interactive TUI", desc: "Manage all your settings through a beautiful Terminal UI. Type `maxter` to edit configs and switch themes." },
              { icon: <FaRocket />, title: "Dev Workflows", desc: "One-click project setup for React and Vue using Vite. Optimized for performance on both mobile and desktop." },
              { icon: <FaBolt />, title: "Zero Latency", desc: "Highly optimized shell startup. We've removed the bloat to ensure your terminal opens in milliseconds." },
              { icon: <FaShieldAlt />, title: "Cross-Platform", desc: "Works flawlessly on Termux, Debian, Ubuntu, Kali, Arch, and Fedora. One script for all your machines." },
              { icon: <FaPaintBrush />, title: "Nerd Fonts", desc: "Automated installation of Meslo Nerd Fonts. Perfect iconography for your Powerlevel10k experience." },
              { icon: <FaSync />, title: "Auto-Update", desc: "Keep your environment fresh with built-in update commands. Never miss a feature or a bug fix." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-10 bg-zinc-900/30 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all"
              >
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 text-2xl mb-8">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-zinc-500">
          &lt;/&gt; with passion by <a href="https://github.com/mahendraplus" className="text-white hover:underline font-bold">Mahendra Mali</a>
        </p>
        <p className="mt-4 text-xs text-zinc-600 uppercase tracking-widest">Released under the MIT License</p>
      </footer>
    </div>
  );
};

export default App;
