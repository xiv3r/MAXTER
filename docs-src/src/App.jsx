import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub, FaCheck, FaCopy, FaShieldAlt, FaPaintBrush, FaSync, FaSun, FaMoon,
  FaArrowRight, FaTerminal, FaCode, FaGlobe, FaLifeRing
} from 'react-icons/fa';
import { 
  SiDebian, SiUbuntu, SiKalilinux, SiArchlinux, SiFedora, SiApple, SiAndroid 
} from 'react-icons/si';
import { VscTerminal, VscGear, VscCloudDownload, VscGraph } from 'react-icons/vsc';

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
    <div className="min-h-screen transition-colors duration-200 selection:bg-[var(--accent)] selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 h-14 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] flex items-center">
        <div className="container-max w-full flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold tracking-tight text-base text-[var(--text)]">
            <VscTerminal className="text-[var(--accent)] text-lg" aria-hidden="true" />
            <span>MAXTER</span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <a 
              href="https://mahendraplus.github.io" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              aria-label="Author Website"
            >
              <FaGlobe className="text-lg" />
            </a>
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
              Universal Terminal Suite v27.0
            </div>
            
            <h1 className="text-hero mb-6 font-bold leading-none">
              Terminal, <br />
              <span className="text-[var(--accent)] underline decoration-2 underline-offset-8 decoration-[var(--accent)]/30">Re-Engineered.</span>
            </h1>
            
            <p className="text-[var(--text-muted)] text-base sm:text-lg mb-8 max-w-lg leading-relaxed font-medium">
              The ultimate <strong>zsh setup</strong> and <strong>universal customization</strong> tool. Silent installation, premium themes, and industrial performance.
            </p>

            {/* Compact Install Box */}
            <div className="install-box mb-8 max-w-2xl bg-[var(--code-bg)] border border-[var(--border)] group">
              <FaTerminal className="text-[var(--text-muted)] text-xs flex-shrink-0 group-hover:text-[var(--accent)] transition-colors" aria-hidden="true" />
              <code className="font-mono text-[var(--accent)]">{installCmd}</code>
              <button 
                onClick={copyToClipboard}
                className="copy-btn bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:border-[var(--accent)] transition-all flex items-center gap-2"
                aria-label="Copy"
              >
                {copied ? <FaCheck className="text-[var(--accent)]" /> : <FaCopy />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="https://github.com/mahendraplus/MAXTER" target="_blank" rel="noreferrer" className="flex-1 sm:flex-none px-6 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-md font-bold text-xs uppercase tracking-wider text-[var(--text)] hover:border-[var(--accent)] transition-all flex items-center justify-center gap-2">
                <FaGithub /> View Repository
              </a>
              <a href="https://mahendraplus.github.io/maxlab/support/" target="_blank" rel="noreferrer" className="flex-1 sm:flex-none px-6 py-2.5 border border-[var(--border)] rounded-md font-bold text-xs uppercase tracking-wider text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center justify-center gap-2">
                Get Support <FaLifeRing className="text-[10px]" />
              </a>
            </div>
          </div>

          {/* Minimal Terminal Mockup */}
          <div className="lg:col-span-5 w-full mt-8 lg:mt-0">
            <div className="terminal-window border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl">
              <div className="terminal-header bg-[var(--surface-2)] px-4 py-2 flex gap-2 border-b border-[var(--border)]">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
                <div className="flex-1 text-center text-[9px] text-[var(--text-muted)] font-mono opacity-50 uppercase tracking-widest">maxter_session.log</div>
              </div>
              <div className="terminal-body min-h-[260px] sm:min-h-[300px] bg-black p-6 font-mono text-xs leading-relaxed">
                <div className="mb-3">
                  <span className="text-[var(--accent)] font-bold mr-2">➜</span>
                  <span className="text-white">install maxter</span>
                </div>
                
                <AnimatePresence>
                  {terminalStep >= 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-500 mb-1">
                      [*] Detecting system... <span className="text-white font-bold">Linux x64</span>
                    </motion.div>
                  )}
                  {terminalStep >= 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-1 text-zinc-300">
                      [SKIP] dependencies satisfied
                    </motion.div>
                  )}
                  {terminalStep >= 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-1 text-yellow-500">
                      [INFO] sync maxter dashboard...
                    </motion.div>
                  )}
                  {terminalStep >= 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-1 text-zinc-300">
                      <span className="text-[var(--accent)] mr-2 font-bold">[DONE]</span> nerd fonts ready
                    </motion.div>
                  )}
                  {terminalStep >= 5 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-300">
                      <span className="text-[var(--accent)] mr-2 font-bold">[DONE]</span> tui initialized
                    </motion.div>
                  )}
                  {terminalStep >= 6 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 border-t border-zinc-900 pt-4">
                      <div className="text-[var(--accent)] font-bold text-[10px] uppercase mb-1 flex items-center gap-2">
                        <FaCheck className="text-xs" /> System Optimized
                      </div>
                      <div className="text-zinc-500 text-[11px]">Type 'maxter' to access settings.</div>
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
          <div className="flex items-center gap-4 mb-12 text-[var(--text)]">
            <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-3">
               <VscGear className="text-[var(--accent)]" /> Core Engine
            </h2>
            <div className="h-px flex-1 bg-[var(--border)] opacity-30"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <VscCloudDownload />, title: "Silent Sync", desc: "Automated, non-interactive setup for any Linux environment." },
              { icon: <FaPaintBrush />, title: "20+ Themes", desc: "Premium color schemes with live TUI preview and saved states." },
              { icon: <FaSync />, title: "Auto-Healing", desc: "Self-correcting installer that repairs broken shell configs." },
              { icon: <VscTerminal />, title: "Nerd Icons", desc: "Deep integration with Nerd Fonts for a high-end visual UI." },
              { icon: <VscGraph />, title: "Diagnostics", desc: "Built-in system info and performance monitoring dashboard." },
              { icon: <FaShieldAlt />, title: "Universal", desc: "One core engine supporting Termux, Debian, Arch, and macOS." }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4, borderColor: 'var(--accent)' }}
                className="feature-card bg-[var(--surface)] border border-[var(--border)] p-8 rounded-xl transition-all shadow-sm"
              >
                <div className="text-[var(--accent)] text-2xl mb-5" aria-hidden="true">{f.icon}</div>
                <h3 className="text-base font-bold mb-3 uppercase tracking-wide text-[var(--text)]">{f.title}</h3>
                <p className="text-[var(--text)] opacity-70 text-xs leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Improved Platforms Section - NO OVERLAP */}
        <section className="py-20 lg:py-24 bg-[var(--surface-2)]/30 border-y border-[var(--border)] overflow-hidden relative">
          <div className="container-max">
            <div className="text-center mb-16 relative z-10">
              <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">Unified Compatibility</span>
              <h2 className="text-2xl font-bold text-[var(--text)] uppercase tracking-tight">Any System. One Command.</h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
               {[
                 { icon: <SiAndroid />, name: "Termux" },
                 { icon: <SiDebian />, name: "Debian" },
                 { icon: <SiUbuntu />, name: "Ubuntu" },
                 { icon: <SiArchlinux />, name: "Arch" },
                 { icon: <SiKalilinux />, name: "Kali" },
                 { icon: <SiFedora />, name: "Fedora" },
                 { icon: <SiApple />, name: "macOS" }
               ].map((p, i) => (
                 <motion.div 
                   key={i}
                   whileHover={{ scale: 1.05, borderColor: 'var(--accent)' }}
                   className="platform-chip border border-[var(--border)] bg-[var(--surface)] px-6 py-3 rounded-lg flex items-center gap-3 transition-all cursor-default shadow-sm"
                 >
                   <span className="text-xl text-[var(--accent)]" aria-hidden="true">{p.icon}</span>
                   <span className="text-xs font-bold uppercase text-[var(--text)] tracking-wider">{p.name}</span>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="container-max flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">
            <VscTerminal className="text-[var(--accent)] text-lg" />
            <span>MAXTER</span>
            <span className="w-1 h-1 rounded-full bg-[var(--border)]"></span>
            <span>MIT</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[10px] font-bold uppercase tracking-wider">
             <div className="text-[var(--text-muted)] flex items-center gap-2">
               AUTHOR: <a href="https://mahendraplus.github.io" target="_blank" rel="noreferrer" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors border-b border-transparent hover:border-[var(--accent)] pb-0.5">MAHENDRA MALI</a>
             </div>
             <a href="https://mahendraplus.github.io/maxlab/support/" target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1.5 group">
                <FaLifeRing className="group-hover:text-[var(--accent)]" /> SUPPORT
             </a>
             <a href="https://github.com/mahendraplus/MAXTER" className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1.5 group" aria-label="GitHub">
               <FaGithub className="text-base group-hover:text-[var(--accent)]" /> <span>GITHUB</span>
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
