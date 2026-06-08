import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  FaTerminal, FaGithub, FaCheck, FaCopy, FaShieldAlt, 
  FaPaintBrush, FaSync, FaSun, FaMoon, 
  FaGlobe, FaLifeRing, FaMicrochip, FaExternalLinkAlt
} from 'react-icons/fa';
import { 
  SiDebian, SiUbuntu, SiKalilinux, SiArchlinux, 
  SiFedora, SiApple, SiAndroid 
} from 'react-icons/si';
import { VscTerminal, VscCloudDownload, VscGraph } from 'react-icons/vsc';

// --- Optimized Ambient Background (60fps guaranteed) ---
const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ transform: 'translateZ(0)' }}>
      {/* 
        Using purely radial-gradients instead of CSS blur() prevents layout thrashing, 
        repaints, and GPU lag, ensuring a buttery smooth experience on all devices.
      */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] animate-pulse" 
        style={{ 
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          animationDuration: '8s'
        }} 
      />
      <div 
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] animate-pulse" 
        style={{ 
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
          animationDuration: '12s'
        }} 
      />
    </div>
  );
};

// --- Copy Component ---
const CommandCopy = ({ label, command }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-2 px-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">{label}</span>
      </div>
      <div className="relative group">
        <div className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 sm:p-5 flex flex-col gap-4 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--surface-2)]/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide flex items-center">
            <code className="whitespace-nowrap font-mono text-xs sm:text-sm text-[var(--text)] pr-4">
              <span className="text-[var(--accent)] opacity-60 mr-2">$</span>
              {command}
            </code>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-[var(--border)] to-transparent" />
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Global Production Stream</span>
            <button 
              onClick={copy}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                copied 
                ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:text-[var(--accent)] hover:border-[var(--accent)]/40 shadow-sm'
              }`}
            >
              {copied ? <><FaCheck className="animate-bounce" /> Copied</> : <><FaCopy /> Copy Command</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [theme, setTheme] = useState('dark');
  const installCmd = "bash <(curl -fsSL https://raw.githubusercontent.com/mahendraplus/MAXTER/Max/install.sh)";
  const npmInstallCmd = "npm install -g github:mahendraplus/MAXTER#Max";
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const features = useMemo(() => [
    { icon: <VscCloudDownload />, title: "Silent Sync", desc: "Automated, non-interactive setup for any POSIX shell environment." },
    { icon: <FaPaintBrush />, title: "20+ Themes", desc: "Premium, industrial color schemes with live real-time TUI preview." },
    { icon: <FaSync />, title: "Auto-Healing", desc: "Self-correcting deployment engine that repairs broken configurations." },
    { icon: <FaTerminal />, title: "Nerd Icons", desc: "Complete glyph integration for a high-fidelity visual experience." },
    { icon: <VscGraph />, title: "Diagnostics", desc: "Deep system monitoring and performance analytics built-in." },
    { icon: <FaShieldAlt />, title: "Universal", desc: "One core engine supporting Termux, Ubuntu, Arch, Kali, and macOS." }
  ], []);

  const platforms = useMemo(() => [
    { icon: <SiAndroid />, name: "Termux" },
    { icon: <SiDebian />, name: "Debian" },
    { icon: <SiUbuntu />, name: "Ubuntu" },
    { icon: <SiArchlinux />, name: "Arch" },
    { icon: <SiKalilinux />, name: "Kali" },
    { icon: <SiFedora />, name: "Fedora" },
    { icon: <SiApple />, name: "macOS" }
  ], []);

  return (
    <div className="min-h-screen transition-colors duration-300 select-none bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <AmbientBackground />
      <div className="fixed inset-0 industrial-grid z-0 opacity-10 pointer-events-none"></div>

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[var(--accent)] z-[100] origin-left" style={{ scaleX }} />

      {/* Modern Navbar */}
      <nav className="fixed top-0 w-full z-50 h-14 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl flex items-center">
        <div className="container-max w-full flex justify-between items-center px-6 lg:px-12">
          <div className="flex items-center gap-3 font-black tracking-tighter text-xl uppercase">
            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/20 rotate-3 transition-transform hover:rotate-0">
              <VscTerminal size={18} />
            </div>
            <span>MAXTER<span className="text-[var(--accent)]">_</span></span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="https://github.com/mahendraplus/MAXTER" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] transition-all">
              <FaGithub size={18} /> <span className="hidden sm:inline">Source Code</span>
            </a>
            <button onClick={toggleTheme} className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Refined Hero Section */}
        <section className="container-max min-h-[80vh] flex flex-col justify-center pt-32 pb-20 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
              The Terminal,<br />
              <span className="text-[var(--accent)]">Re-Engineered.</span>
            </h1>
            
            <p className="text-[var(--text-muted)] font-medium text-sm sm:text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the fastest way to deploy a professional shell environment. 
              Silent, smart, and built for high-performance engineers.
            </p>
          </div>

          <div className="max-w-3xl mx-auto w-full">
            <CommandCopy label="Direct Installation (Curl)" command={installCmd} />
            <CommandCopy label="Global NPM Deployment" command={npmInstallCmd} />
          </div>
        </section>

        {/* CORE ENGINE SECTION - FIXED SPACING */}
        <section id="features" className="container-max py-24 px-6 lg:px-12">
          <div className="relative mb-20">
             <div className="flex items-center gap-6">
                <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
                  <span className="w-12 h-1 bg-[var(--accent)] rounded-full"></span>
                  Core Engine
                </h2>
             </div>
             <p className="mt-4 text-[var(--text-muted)] text-sm sm:text-base font-medium max-w-lg">Advanced architecture designed for maximum stability and speed across all unix environments.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: i * 0.1 }}
                className="bg-[var(--surface)] border border-[var(--border)] p-10 rounded-2xl transition-all hover:border-[var(--accent)]/40 hover:shadow-2xl hover:shadow-[var(--accent)]/5 group"
              >
                <div className="w-14 h-14 bg-[var(--surface-2)] rounded-2xl flex items-center justify-center text-[var(--accent)] text-3xl mb-8 group-hover:scale-110 group-hover:bg-[var(--accent)]/10 transition-all duration-300">{f.icon}</div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-wide text-[var(--text)]">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* COMPATIBILITY SECTION - BALANCED GRID */}
        <section className="py-32 bg-[var(--surface-2)]/30 border-y border-[var(--border)] px-6 lg:px-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="container-max text-center relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black uppercase mb-16 tracking-tight flex flex-col items-center gap-4">
              <span className="text-[var(--accent)] text-sm font-mono tracking-[0.5em] mb-2 uppercase">Platform Architecture</span>
              Universal Compatibility
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
               {platforms.map((p, i) => (
                 <motion.div 
                   key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                   className="border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm px-6 py-8 rounded-2xl flex flex-col items-center gap-4 transition-all hover:border-[var(--accent)] hover:shadow-lg shadow-sm group"
                 >
                   <span className="text-4xl text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:scale-110 transition-all duration-300" aria-hidden="true">{p.icon}</span>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">{p.name}</span>
                 </motion.div>
               ))}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                 className="border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm px-6 py-8 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:border-[var(--accent)] hover:shadow-lg shadow-sm group border-dashed"
               >
                 <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--accent)]">+ MORE</span>
                 <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] text-center px-4">POSIX Standard Ready</span>
               </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Improved Footer */}
      <footer className="py-24 bg-[var(--bg)] border-t border-[var(--border)] px-6 lg:px-12 relative overflow-hidden">
        <div className="container-max relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 pb-16 border-b border-[var(--border)]">
            <div className="text-center md:text-left">
              <div className="text-3xl font-black tracking-tighter mb-4 text-[var(--text)] uppercase">MAXTER<span className="text-[var(--accent)]">_</span></div>
              <p className="text-[var(--text-muted)] text-sm max-w-xs font-medium leading-relaxed">
                Empowering developers with the ultimate command-line experience. Designed for productivity, built for speed.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6">
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-2">Developed By</div>
               <a href="https://mahendraplus.github.io" target="_blank" rel="noreferrer" className="group flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] px-6 py-3 rounded-2xl hover:border-[var(--accent)] transition-all">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-black text-sm">M</div>
                  <span className="text-xs font-black uppercase tracking-widest group-hover:text-[var(--accent)] transition-colors">Mahendra Mali</span>
                  <FaExternalLinkAlt size={10} className="text-[var(--text-muted)]" />
               </a>
            </div>
          </div>

          <div className="pt-12 flex flex-col sm:flex-row justify-between items-center gap-8">
             <div className="flex gap-10">
               <a href="https://github.com/mahendraplus/MAXTER" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"><FaGithub size={22} /></a>
               <a href="https://mahendraplus.github.io/maxlab/support/" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"><FaLifeRing size={22} /></a>
               <a href="https://mahendraplus.github.io" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"><FaGlobe size={22} /></a>
             </div>
             
             <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 text-[9px] font-black uppercase tracking-[0.15em]">
                <div className="flex items-center gap-2 opacity-80">
                  <span className="bg-[var(--surface-2)] border border-[var(--border)] px-3 py-1.5 rounded-lg text-[var(--text)] hover:border-[var(--accent)]/50 transition-colors">MIT LICENSE</span>
                  <span className="bg-[var(--surface-2)] border border-[var(--border)] px-3 py-1.5 rounded-lg text-[var(--text)] hover:border-[var(--accent)]/50 transition-colors">REBUILD_SYSTEM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1.5 rounded-lg text-[var(--accent)] font-mono tracking-widest hover:bg-[var(--accent)]/20 transition-colors">Version 27.3.B6</span>
                  <span className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 px-3 py-1.5 rounded-lg text-[var(--accent)] font-mono tracking-widest hover:bg-[var(--accent)]/20 transition-colors">MXTR273B608062026</span>
                </div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;



