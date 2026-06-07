'use client';

import { useState, useEffect } from 'react';
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
  FaCode
} from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const fullText = "install maxter";
  const installCmd = "bash <(curl -fsSL https://raw.githubusercontent.com/mahendraplus/MAXTER/main/install.sh)";

  useEffect(() => {
    setMounted(true);
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen grid-bg selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black tracking-tighter"
          >
            MAXTER<span className="text-indigo-500">_</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Installation', 'TUI', 'Docs'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                {item}
              </a>
            ))}
            <a 
              href="https://github.com/mahendraplus/MAXTER" 
              target="_blank" 
              className="p-2 bg-zinc-900 rounded-full border border-white/10 hover:border-indigo-500/50 transition-all"
            >
              <FaGithub className="text-xl" />
            </a>
          </div>

          <button className="md:hidden text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            V26.0 STABLE RELEASE
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black gradient-text mb-8 tracking-tight"
          >
            The Terminal,<br />Re-Engineered.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-12"
          >
            Transform your Termux, Debian, or Ubuntu shell into a high-performance development powerhouse with intelligent workflows and a premium interface.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20"
          >
            <a href="#installation" className="w-full md:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform">
              Install Now
            </a>
            <a href="https://github.com/mahendraplus/MAXTER" className="w-full md:w-auto px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl border border-white/10 hover:bg-zinc-800 transition-colors">
              View Source
            </a>
          </motion.div>

          {/* Terminal Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto bg-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden text-left"
          >
            <div className="bg-zinc-900/50 px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <div className="text-xs font-mono text-zinc-500 ml-2">maxter — zsh</div>
            </div>
            <div className="p-8 font-mono text-sm md:text-base min-h-[300px]">
              <div className="flex gap-2">
                <span className="text-emerald-500 font-bold">➜</span>
                <span className="text-indigo-400 font-bold">~</span>
                <span>{typedText}</span>
                <span className="w-2 h-5 bg-white animate-pulse"></span>
              </div>
              <AnimatePresence>
                {typedText === fullText && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-zinc-400"
                  >
                    <div className="text-emerald-500 mb-2">✔ MAXTER System Detected: Linux (Debian)</div>
                    <div className="text-indigo-400 mb-2">ℹ Downloading high-performance configs...</div>
                    <div className="text-white font-bold mt-6">
                      Welcome to MAXTER v26.0<br />
                      Type &apos;maxter&apos; to launch the Settings Dashboard.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Why Choose Maxter?</h2>
            <p className="text-zinc-500">Engineered for the modern developer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FaTerminal />, title: "Maxter TUI", desc: "A premium Terminal UI to manage your configs, switch themes, and bootstrap projects instantly." },
              { icon: <FaRocket />, title: "Dev Ready", desc: "Pre-configured workflows for React, Vue, and Node.js. Start coding without the setup headache." },
              { icon: <FaBolt />, title: "Zero Lag", desc: "Highly optimized Zsh startup. No bloat, just pure speed for your terminal experience." },
              { icon: <FaShieldAlt />, title: "Self Healing", desc: "Intelligent installer that repairs broken configs and automates system-specific patches." },
              { icon: <FaPaintBrush />, title: "Premium Style", desc: "Powered by P10K with custom color schemes and high-fidelity Nerd Fonts included." },
              { icon: <FaCode />, title: "Open Core", desc: "Fully open-source and community-driven. Built for developers, by developers." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all"
              >
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 text-xl mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="py-32 px-6 bg-indigo-500/5">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-12">Install Instantly.</h2>
          <div className="max-w-3xl mx-auto bg-black rounded-2xl border border-white/10 p-2 flex flex-col md:flex-row items-center gap-4">
            <code className="flex-1 p-4 text-emerald-400 text-sm md:text-base overflow-x-auto whitespace-nowrap scrollbar-hide">
              {installCmd}
            </code>
            <button 
              onClick={copyToClipboard}
              className="w-full md:w-auto px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? "Copied!" : "Copy Command"}
            </button>
          </div>
          <p className="mt-8 text-zinc-500 text-sm flex items-center justify-center gap-2">
            <FaCheck className="text-emerald-500" /> Supports Termux, Debian, Ubuntu, Fedora, and Arch.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 text-center px-6">
        <div className="container mx-auto">
          <div className="text-2xl font-black mb-8">MAXTER_</div>
          <div className="flex justify-center gap-8 mb-12">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Documentation</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Community</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors">Github</a>
          </div>
          <p className="text-zinc-600 text-sm">
            Created with ❤️ by <a href="https://github.com/mahendraplus" className="text-white hover:underline">Mahendra Mali</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
