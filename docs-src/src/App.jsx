import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub, FaCheck, FaCopy, 
  FaShieldAlt, FaPaintBrush, FaSync, FaSun, FaMoon,
  FaArrowRight, FaTerminal
} from 'react-icons/fa';
import { SiDebian, SiUbuntu, SiKalilinux, SiArchlinux, SiFedora } from 'react-icons/si';
import { VscTerminal } from 'react-icons/vsc';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [copied, setCopied] = useState(false);
  const [terminalStep, setTerminalStep] = useState(0);
  
  const installCmd = "bash <(curl -fsSL https://raw.githubusercontent.com/mahendraplus/MAXTER/Max/install.sh)";

  // Theme Management
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
    const timer = setInterval(() => {
      setTerminalStep(prev => (prev < 6 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 h-14 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] flex items-center">
        <div className="container-max w-full flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold tracking-tight text-base text-[var(--text)]">
            <VscTerminal className="text-[var(--accent)] text-lg" aria-hidden="true" />
            <span>MAXTER</span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <a 
              href="https://github.com/mahendraplus/MAXTER" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="text-xl" />
            </a>
            <button 
              onClick={toggleTheme}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              aria-label="Theme"
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-16 px-4 sm:px-0">
        {/* Hero Section */}
        <section className="container-max grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-20 lg:mb-32 text-[var(--text)]">
          <div className="lg:col-span-7 pt-4 text-left">
            <div className="inline-flex items-center gap-2 text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
              Open Source v26.0
            </div>
            
            <h1 className="text-hero mb-6">
              Terminal, <br />
              <span className="font-bold text-[var(--accent)]">Re-Engineered.</span>
            </h1>
            
            <p className="text-[var(--text-muted)] text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
              The ultimate <strong>zsh setup</strong> and <strong>termux</strong> tool for developers. Silent. Fast. Professional.
            </p>

            {/* Compact Install Box */}
            <div className="install-box mb-8 max-w-2xl bg-[var(--code-bg)]">
              <FaTerminal className="text-[var(--text-muted)] text-xs flex-shrink-0" aria-hidden="true" />
              <code>{installCmd}</code>
              <button 
                onClick={copyToClipboard}
                className="copy-btn"
                aria-label="Copy"
              >
                {copied ? <FaCheck className="text-[var(--accent)]" /> : <FaCopy />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="https://github.com/mahendraplus/MAXTER" target="_blank" rel="noreferrer" className="flex-1 sm:flex-none px-5 py-2.5 border border-[var(--border)] rounded-md font-bold text-xs uppercase tracking-wider hover:border-[var(--text)] transition-all flex items-center justify-center gap-2">
                <FaGithub /> GitHub
              </a>
              <a href="#features" className="flex-1 sm:flex-none px-5 py-2.5 border border-[var(--border)] rounded-md font-bold text-xs uppercase tracking-wider hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center justify-center gap-2">
                Features <FaArrowRight className="text-[10px]" />
              </a>
            </div>
          </div>

          {/* Minimal Terminal */}
          <div className="lg:col-span-5 w-full mt-8 lg:mt-0">
            <div className="terminal-window border border-[var(--border)]">
              <div className="terminal-header bg-[var(--bg)]">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
                <div className="flex-1 text-center text-[9px] text-zinc-500 font-mono opacity-50 uppercase tracking-widest">maxter.log</div>
              </div>
              <div className="terminal-body min-h-[240px] sm:min-h-[280px] bg-black">
                <div className="mb-3">
                  <span className="text-[var(--accent)] font-bold mr-2">➜</span>
                  <span className="text-white">install maxter</span>
                </div>
                
                <AnimatePresence>
                  {terminalStep >= 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-500 mb-1">
                      [*] Detecting system... <span className="text-white">Ready</span>
                    </motion.div>
                  )}
                  {terminalStep >= 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-1">
                      [SKIP] oh-my-zsh detected
                    </motion.div>
                  )}
                  {terminalStep >= 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-1 text-yellow-500">
                      [INFO] applying theme...
                    </motion.div>
                  )}
                  {terminalStep >= 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-1">
                      <span className="text-[var(--accent)] mr-2">[DONE]</span> powerlevel10k
                    </motion.div>
                  )}
                  {terminalStep >= 5 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span className="text-[var(--accent)] mr-2">[DONE]</span> configs applied
                    </motion.div>
                  )}
                  {terminalStep >= 6 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 border-t border-zinc-900 pt-4">
                      <div className="text-[var(--accent)] font-bold text-xs uppercase mb-1">Complete</div>
                      <div className="text-zinc-500 text-[11px]">Type 'maxter' to start dashboard.</div>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-[var(--accent)] font-bold">➜</span>
                        <div className="w-1.5 h-3 bg-white animate-pulse"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container-max py-12 lg:py-16">
          <div className="flex items-center gap-4 mb-10 text-[var(--text)]">
            <h2 className="text-2xl font-bold tracking-tight uppercase">Core Engine</h2>
            <div className="h-px flex-1 bg-[var(--border)]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <FaTerminal />, title: "Powerlevel10k", desc: "Optimized Zsh theme for developer productivity." },
              { icon: <FaShieldAlt />, title: "Silent Install", desc: "Zero-prompt setup for all supported systems." },
              { icon: <FaSync />, title: "Autosuggestions", desc: "Smart completions based on shell history." },
              { icon: <VscTerminal />, title: "Termux Layout", desc: "Optimized extra-keys for mobile terminal." },
              { icon: <FaTerminal />, title: "Dashboard", desc: "Integrated TUI to manage configs easily." },
              { icon: <FaPaintBrush />, title: "Nerd Fonts", desc: "Automated font patching and icons." }
            ].map((f, i) => (
              <div key={i} className="feature-card bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-6 rounded-lg">
                <div className="text-[var(--accent)] text-xl mb-4" aria-hidden="true">{f.icon}</div>
                <h3 className="text-base font-bold mb-2 uppercase tracking-wide text-[var(--text)]">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platforms */}
        <section className="py-12 bg-[var(--surface-2)]/30 border-y border-[var(--border)]">
          <div className="container-max flex flex-wrap justify-center gap-3 sm:gap-4">
             {[
               { icon: <VscTerminal />, name: "Termux" },
               { icon: <SiDebian />, name: "Debian" },
               { icon: <SiUbuntu />, name: "Ubuntu" },
               { icon: <SiArchlinux />, name: "Arch" },
               { icon: <SiKalilinux />, name: "Kali" },
               { icon: <SiFedora />, name: "Fedora" }
             ].map((p, i) => (
               <div key={i} className="platform-chip border border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] px-4 py-2 rounded-md flex items-center gap-2 transition-all">
                 <span className="text-base text-[var(--accent)]" aria-hidden="true">{p.icon}</span>
                 <span className="text-[11px] font-bold uppercase text-[var(--text)]">{p.name}</span>
               </div>
             ))}
          </div>
        </section>

        {/* Simplified Config Snippet */}
        <section className="container-max py-12 text-center text-[var(--text)]">
          <div className="max-w-xl mx-auto bg-black border border-[var(--border)] rounded-lg p-6 font-mono text-[11px] text-left text-zinc-500 overflow-x-auto shadow-sm whitespace-pre">
            <div className="text-[var(--accent)] mb-2 font-bold opacity-80"># termux.properties excerpt</div>
            extra-keys = [['ESC','DRAWER','SHIFT','HOME','UP','END','PGUP'], \
            <br />              ['TAB','CTRL','ALT','LEFT','DOWN','RIGHT','PGDN']]
          </div>
          <p className="mt-8 text-[var(--text-muted)] text-xs font-bold uppercase tracking-[0.2em]">
            Built for professional efficiency.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="container-max flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            <span>MAXTER</span>
            <span className="w-1 h-1 rounded-full bg-[var(--border)]"></span>
            <span>MIT License</span>
          </div>
          
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider">
             <div className="text-[var(--text-muted)] flex items-center gap-2">
               Author: <span className="text-[var(--text)]">Mahendra Mali</span>
             </div>
             <a href="https://github.com/mahendraplus/MAXTER" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" aria-label="GitHub">
               <FaGithub className="text-base" />
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
