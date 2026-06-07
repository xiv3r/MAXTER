import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTerminal, FaGithub, FaCheck, FaCopy, 
  FaShieldAlt, FaPaintBrush, FaSync, FaSun, FaMoon,
  FaArrowRight, FaCode
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

  // Terminal Animation Sequence
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
      <nav className="fixed top-0 w-full z-50 h-14 bg-[var(--bg)] shadow-sm flex items-center border-b border-[var(--border)]">
        <div className="container-max w-full flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold tracking-tight text-lg">
            <VscTerminal className="text-[var(--accent)] text-xl" aria-hidden="true" />
            <span>MAXTER</span>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href="https://github.com/mahendraplus/MAXTER" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              aria-label="GitHub Repository"
            >
              <FaGithub className="text-xl" />
            </a>
            <button 
              onClick={toggleTheme}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              aria-label="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        {/* Hero Section */}
        <section className="container-max grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
              Open Source v26.0
            </div>
            
            <h1 className="text-hero mb-6">
              MAXTER — Ultimate <br />
              <span className="font-bold text-[var(--accent)]">Zsh & Termux Setup.</span>
            </h1>
            
            <p className="text-[var(--text-muted)] text-lg mb-10 max-w-xl leading-relaxed">
              The fastest <strong>termux setup</strong> and <strong>zsh configuration</strong> tool. Optimize your terminal for speed, aesthetics, and modern development workflows in <strong>one command</strong>.
            </p>

            {/* Redesigned Install Box */}
            <div className="install-box mb-8 group">
              <FaTerminal className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" aria-hidden="true" />
              <code className="scrollbar-hide" title="One command install for MAXTER">{installCmd}</code>
              <button 
                onClick={copyToClipboard}
                className="copy-btn"
                aria-label="Copy installation command"
              >
                {copied ? <FaCheck className="text-[var(--accent)]" /> : <FaCopy />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="https://github.com/mahendraplus/MAXTER" target="_blank" rel="noreferrer" className="px-6 py-3 border border-[var(--border)] rounded-lg font-bold text-sm hover:border-[var(--text)] transition-all flex items-center gap-2">
                <FaGithub /> View on GitHub
              </a>
              <a href="#features" className="px-6 py-3 border border-[var(--border)] rounded-lg font-bold text-sm hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center gap-2">
                Explore Features <FaArrowRight className="text-xs" />
              </a>
            </div>
          </div>

          {/* Realistic Terminal Mockup */}
          <div className="lg:col-span-5">
            <div className="terminal-window" role="img" aria-label="Mockup of MAXTER terminal installation on Android">
              <div className="terminal-header">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
                <div className="flex-1 text-center text-[10px] text-zinc-500 font-mono underline underline-offset-2 decoration-[var(--accent)]/50">maxter — setup.sh</div>
              </div>
              <div className="terminal-body min-h-[320px]">
                <div className="mb-2">
                  <span className="text-[var(--accent)] font-bold mr-2">➜</span>
                  <span className="text-white">install maxter</span>
                </div>
                
                <AnimatePresence>
                  {terminalStep >= 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400">
                      Detecting system... <span className="text-white">Termux (Android)</span>
                    </motion.div>
                  )}
                  {terminalStep >= 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span className="text-white mr-4">[OK]</span> zsh already installed
                    </motion.div>
                  )}
                  {terminalStep >= 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span className="text-yellow-500 mr-4">[GET]</span> <strong>powerlevel10k</strong> installing...
                    </motion.div>
                  )}
                  {terminalStep >= 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span className="text-[var(--accent)] mr-2">[DONE]</span> <strong>oh-my-zsh</strong> configured
                    </motion.div>
                  )}
                  {terminalStep >= 5 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span className="text-[var(--accent)] mr-2">[DONE]</span> <strong>syntax-highlighting</strong> applied
                    </motion.div>
                  )}
                  {terminalStep >= 6 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 border-t border-zinc-800 pt-4">
                      <div className="text-[var(--accent)] font-bold uppercase tracking-wider text-xs mb-1">Status: Ready</div>
                      <div className="text-zinc-500">MAXTER setup complete. Type 'maxter' to start.</div>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-[var(--accent)] font-bold">➜</span>
                        <div className="w-2 h-4 bg-white animate-pulse"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container-max py-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4 tracking-tight">One Command Install for Termux, Kali & More</h2>
              <p className="text-[var(--text-muted)] max-w-md">Everything you need for a professional <strong>termux setup</strong> in one lightweight package.</p>
            </div>
            <div className="h-px flex-1 bg-[var(--border)] hidden md:block mb-4 mx-12"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <FaTerminal />, title: "Powerlevel10k Theme", desc: "Automated installation of the fastest Zsh theme for developers." },
              { icon: <FaCode />, title: "Zsh Syntax Highlighting", desc: "Real-time visual feedback for terminal commands as you type." },
              { icon: <FaSync />, title: "Zsh Autosuggestions", desc: "Fish-style command completions based on your shell history." },
              { icon: <VscTerminal />, title: "Termux Extra Keys", desc: "A perfectly organized keys layout for mobile terminal productivity." },
              { icon: <FaShieldAlt />, title: "Smart OS Detection", desc: "Automatic optimization for Debian, Ubuntu, Kali, Arch, and Fedora." },
              { icon: <FaPaintBrush />, title: "Nerd Fonts Support", desc: "High-fidelity iconography with automated Meslo Nerd Font patching." }
            ].map((f, i) => (
              <div key={i} className="feature-card shadow-sm">
                <div className="text-[var(--accent)] text-2xl mb-6" aria-hidden="true">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-24 bg-[var(--surface-2)]/30 border-y border-[var(--border)]">
          <div className="container-max">
             <div className="text-center mb-12">
               <h2 className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest">Supported <strong>Terminal</strong> Environments</h2>
             </div>
             <div className="flex flex-wrap justify-center gap-4">
               {[
                 { icon: <VscTerminal />, name: "Termux" },
                 { icon: <SiDebian />, name: "Debian" },
                 { icon: <SiUbuntu />, name: "Ubuntu" },
                 { icon: <SiArchlinux />, name: "Arch" },
                 { icon: <SiKalilinux />, name: "Kali" },
                 { icon: <SiFedora />, name: "Fedora" }
               ].map((p, i) => (
                 <div key={i} className="platform-chip hover:border-[var(--accent)] transition-colors cursor-default" title={`MAXTER supports ${p.name}`}>
                   <span className="text-lg" aria-hidden="true">{p.icon}</span>
                   <span>{p.name}</span>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* Documentation / Info Section */}
        <section className="container-max py-24 text-center">
          <h2 className="text-3xl font-bold mb-6 tracking-tight">Best <strong>Termux Setup</strong> for Professionals.</h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto mb-12 leading-relaxed">
            MAXTER is an expertly tuned <strong>zsh configuration</strong> suite. It brings industrial-grade productivity to your terminal with zero manual effort.
          </p>
          <div className="max-w-xl mx-auto bg-black border border-[var(--border)] rounded-xl p-8 font-mono text-xs text-left text-zinc-500 shadow-inner">
            <div className="text-[var(--accent)] mb-2 font-bold"># Optimized extra-keys for Termux</div>
            extra-keys = [['ESC','DRAWER','SHIFT','HOME','UP','END','PGUP'], \<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;['TAB','CTRL','ALT','LEFT','DOWN','RIGHT','PGDN']]
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="container-max flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            <span>MAXTER</span>
            <span className="w-1 h-1 rounded-full bg-[var(--border)]"></span>
            <span>MIT License</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
             <a href="https://github.com/mahendraplus" className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors" title="Mahendra Mali on GitHub">
               Created by <span className="font-bold text-[var(--text)]">Mahendra Mali</span>
             </a>
             <a href="https://github.com/mahendraplus/MAXTER" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" aria-label="GitHub Repository">
               <FaGithub className="text-lg" />
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
