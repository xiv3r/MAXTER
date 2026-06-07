import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTerminal, FaRocket, FaBolt, FaGithub, FaCheck, FaCopy, 
  FaShieldAlt, FaPaintBrush, FaSync, FaSun, FaMoon, FaGlobe,
  FaLinux, FaAndroid
} from 'react-icons/fa';
import { SiDebian, SiUbuntu, SiKalilinux, SiArchlinux, SiFedora } from 'react-icons/si';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [copied, setCopied] = useState(false);
  const [typedText, setTypedText] = useState('');
  const fullText = "➜  ~ install maxter";
  const installCmd = "bash <(curl -fsSL https://raw.githubusercontent.com/mahendraplus/MAXTER/Max/install.sh)";

  // Theme Detection & Management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Terminal Animation
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
    <div className="min-h-screen transition-colors duration-300">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-40"></div>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-black">
              <FaTerminal />
            </span>
            MAXTER<span className="text-[var(--primary)]">_</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)] transition-all text-lg"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-indigo-600" />}
            </button>
            <a 
              href="https://github.com/mahendraplus/MAXTER" 
              target="_blank" 
              rel="noreferrer" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-full text-sm font-bold hover:border-[var(--primary)] transition-all"
            >
              <FaGithub /> GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold mb-8 tracking-widest uppercase"
          >
            v26.0 Premium Release
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-black mb-8 tracking-tighter leading-none"
          >
            The Terminal,<br />
            <span className="bg-gradient-to-r from-[var(--text)] to-[var(--primary)] bg-clip-text text-transparent">Re-Engineered.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-hero text-[var(--muted)] mb-12"
          >
            The ultimate Zsh & Termux setup for professionals. Fast, intelligent, and beautifully pre-configured for your daily workflow.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-2 flex flex-col md:flex-row items-center gap-4 mb-24 shadow-2xl"
          >
            <code className="flex-1 p-4 font-mono text-[var(--accent-green)] text-sm md:text-base overflow-x-auto whitespace-nowrap scrollbar-hide">
              {installCmd}
            </code>
            <button 
              onClick={copyToClipboard}
              className="w-full md:w-auto px-8 py-4 bg-[var(--primary)] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied!" : "Copy Script"}
            </button>
          </motion.div>

          {/* Terminal Demo */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto bg-black border border-white/10 rounded-2xl shadow-3xl overflow-hidden text-left"
          >
            <div className="bg-zinc-900/80 px-4 py-3 border-b border-white/5 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="p-8 font-mono text-sm md:text-base min-h-[250px] text-zinc-300">
              <div className="flex gap-2">
                <span>{typedText}</span>
                <span className="w-2 h-5 bg-white inline-block animate-pulse"></span>
              </div>
              <AnimatePresence>
                {typedText === fullText && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 space-y-1"
                  >
                    <div className="text-emerald-500">✔ MAXTER System Detected: Linux (Kali)</div>
                    <div className="text-emerald-500">✔ Zsh, P10K, and Plugins ready.</div>
                    <br />
                    <div className="font-bold text-white uppercase">[ Welcome to MAXTER v26.0 ]</div>
                    <div>Type <span className="text-[var(--primary)] font-bold">'maxter'</span> to open your dashboard.</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20 border-y border-[var(--border)] bg-[var(--surface)]/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-3 font-bold"><FaAndroid className="text-2xl" /> Termux</div>
             <div className="flex items-center gap-3 font-bold"><SiDebian className="text-2xl" /> Debian</div>
             <div className="flex items-center gap-3 font-bold"><SiUbuntu className="text-2xl" /> Ubuntu</div>
             <div className="flex items-center gap-3 font-bold"><SiKalilinux className="text-2xl" /> Kali</div>
             <div className="flex items-center gap-3 font-bold"><SiArchlinux className="text-2xl" /> Arch</div>
             <div className="flex items-center gap-3 font-bold"><SiFedora className="text-2xl" /> Fedora</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-black mb-4">Built for Power.</h2>
            <p className="text-[var(--muted)]">Engineered to make your terminal work for you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <FaTerminal />, title: "Interactive TUI", desc: "A premium Terminal UI to manage your configs, switch themes, and bootstrap projects instantly." },
              { icon: <FaRocket />, title: "Dev Workflows", desc: "One-click setup for React and Vue projects using Vite. Pre-configured for maximum performance." },
              { icon: <FaBolt />, title: "Zero Latency", desc: "Highly optimized startup scripts. No bloat, just the fastest terminal experience possible." },
              { icon: <FaShieldAlt />, title: "Cross-Platform", desc: "Consistent experience across Termux and all major Linux distros. Sync your workflow everywhere." },
              { icon: <FaPaintBrush />, title: "Premium Theme", desc: "Professional P10K setup with custom color schemes and high-fidelity Nerd Fonts included." },
              { icon: <FaSync />, title: "One-Line Install", desc: "Zero manual configuration. Our smart installer handles updates and system-specific patches." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-10 bg-[var(--surface)] rounded-3xl border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all"
              >
                <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center text-[var(--primary)] text-2xl mb-8">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Configuration Section */}
      <section className="py-32 px-6 bg-[var(--surface)]/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1">
              <h2 className="font-black mb-6">Expertly Configured.</h2>
              <p className="text-[var(--muted)] mb-8">
                Every detail is tuned for productivity. From optimized shell history to a custom extra-keys layout for Termux users.
              </p>
              <div className="space-y-4">
                {[
                  "Smart Auto-Suggestions",
                  "Real-time Syntax Highlighting",
                  "Git Integration (P10K)",
                  "Custom Extra-Keys for Termux",
                  "Auto-healing Package Management"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-bold text-sm">
                    <FaCheck className="text-[var(--primary)]" /> {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full bg-black/40 rounded-3xl border border-[var(--border)] p-8 font-mono text-sm shadow-inner">
               <div className="text-[var(--primary)] mb-4"># Extra Keys Preview</div>
               <div className="text-zinc-500">
                 [ ESC, DRAWER, SHIFT, HOME, UP, END, PGUP ]<br />
                 [ TAB, CTRL, ALT, LEFT, DOWN, RIGHT, PGDN ]
               </div>
               <div className="mt-8 text-zinc-600"># Optimized for one-hand use</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-[var(--border)] text-center px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-2xl font-black mb-8 tracking-tighter">MAXTER<span className="text-[var(--primary)]">_</span></div>
          <div className="flex justify-center gap-8 mb-12 text-sm font-bold text-[var(--muted)]">
            <a href="https://github.com/mahendraplus/MAXTER" className="hover:text-[var(--primary)] transition-colors">Documentation</a>
            <a href="https://github.com/mahendraplus/MAXTER/issues" className="hover:text-[var(--primary)] transition-colors">Issues</a>
            <a href="https://github.com/mahendraplus/MAXTER" className="hover:text-[var(--primary)] transition-colors">Github</a>
          </div>
          <p className="text-[var(--muted)] text-sm">
            Created with passion by <a href="https://github.com/mahendraplus" className="text-[var(--text)] hover:underline font-black">Mahendra Mali</a>
          </p>
          <p className="mt-4 text-[10px] text-[var(--muted)] uppercase tracking-[0.2em] font-bold">Released under the MIT License</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
