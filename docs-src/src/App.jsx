import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  FaTerminal, FaGithub, FaCheck, FaCopy, FaShieldAlt, 
  FaPaintBrush, FaSync, FaSun, FaMoon, FaArrowRight, 
  FaGlobe, FaLifeRing, FaMicrochip
} from 'react-icons/fa';
import { 
  SiDebian, SiUbuntu, SiKalilinux, SiArchlinux, 
  SiFedora, SiApple, SiAndroid 
} from 'react-icons/si';
import { VscTerminal, VscCloudDownload, VscGraph } from 'react-icons/vsc';

// --- Optimized Particle Background ---
const Particles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
           this.reset();
        }
      }
      draw(color) {
        ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = Array.from({ length: 45 }, () => new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim();
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(color);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

// --- typing tagline ---
const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [text]);
  return <>{displayedText}</>;
};

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [copied, setCopied] = useState(false);
  const [terminalStep, setTerminalStep] = useState(0);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalStep(prev => (prev < 6 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div className="min-h-screen transition-colors duration-300 selection:bg-[var(--accent)] selection:text-white">
      <Particles />
      <div className="fixed inset-0 industrial-grid z-0 opacity-20 pointer-events-none"></div>

      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[var(--accent)] z-[100] origin-left" style={{ scaleX }} />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 h-16 border-b border-[var(--border)] bg-[var(--bg)]/70 backdrop-blur-md flex items-center">
        <div className="container-max w-full flex justify-between items-center px-6">
          <div className="flex items-center gap-3 font-bold tracking-tighter text-xl text-[var(--text)]">
            <div className="w-9 h-9 bg-[var(--accent)] rounded flex items-center justify-center text-white">
              <VscTerminal size={22} />
            </div>
            <span>MAXTER<span className="text-[var(--accent)]">_</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="https://github.com/mahendraplus/MAXTER" target="_blank" rel="noreferrer" className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <FaGithub size={22} />
            </a>
            <button onClick={toggleTheme} className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              {theme === 'dark' ? <FaSun size={22} /> : <FaMoon size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container-max min-h-[90vh] flex flex-col justify-center pt-24 pb-12 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] font-mono text-[10px] uppercase tracking-widest mb-6"
              >
                <FaMicrochip /> Version 27.2.B4
              </motion.div>
              
              <h1 className="text-hero mb-6">
                Terminal,<br />
                <span className="text-[var(--accent)] neon-text">Re-Engineered.</span>
              </h1>
              
              <p className="text-[var(--text-muted)] font-mono text-sm sm:text-base mb-10 max-w-xl min-h-[3rem]">
                <Typewriter text="Silent installation, premium themes, and industrial performance." />
                <span className="w-2 h-4 bg-[var(--accent)] inline-block align-middle ml-1 animate-pulse"></span>
              </p>

              <div className="max-w-2xl bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-1 flex items-center mb-4 group shadow-lg">
                <div className="flex-1 px-4 py-3 font-mono text-[var(--accent)] text-xs sm:text-sm overflow-hidden whitespace-nowrap">
                  <span className="opacity-40 mr-2">$</span> {installCmd}
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(installCmd);
                    setCopied("bash");
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-5 py-3 bg-[var(--surface)] border-l border-[var(--border)] text-[var(--text)] hover:text-[var(--accent)] transition-colors rounded-r-lg font-bold text-[10px] uppercase tracking-widest"
                >
                  {copied === "bash" ? <FaCheck /> : <FaCopy />}
                </button>
              </div>

              <div className="max-w-2xl bg-[var(--surface-2)] border border-[var(--border)] rounded-lg p-1 flex items-center mb-10 group shadow-lg">
                <div className="flex-1 px-4 py-3 font-mono text-[var(--accent)] text-xs sm:text-sm overflow-hidden whitespace-nowrap">
                  <span className="opacity-40 mr-2">$</span> {npmInstallCmd}
                </div>
                <div className="hidden sm:block text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)] mr-4">
                  (Linux/macOS only)
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(npmInstallCmd);
                    setCopied("npm");
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-5 py-3 bg-[var(--surface)] border-l border-[var(--border)] text-[var(--text)] hover:text-[var(--accent)] transition-colors rounded-r-lg font-bold text-[10px] uppercase tracking-widest"
                >
                  {copied === "npm" ? <FaCheck /> : <FaCopy />}
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#features" className="px-7 py-3 bg-[var(--accent)] text-white font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all rounded shadow-md">
                  Initialize
                </a>
                <a href="https://mahendraplus.github.io" target="_blank" className="px-7 py-3 border border-[var(--border)] text-[var(--text)] font-bold text-xs uppercase tracking-widest hover:bg-[var(--surface-2)] transition-all rounded">
                  Explorer
                </a>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="terminal-card overflow-hidden">
                <div className="bg-white/5 px-4 py-2 flex gap-2 border-b border-white/10">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
                  <div className="flex-1 text-center font-mono text-[9px] text-zinc-500 uppercase tracking-widest">maxter_core</div>
                </div>
                <div className="p-6 font-mono text-[11px] sm:text-xs leading-relaxed min-h-[300px] text-zinc-300 bg-black">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[var(--accent)]">➜</span>
                    <span className="text-white">maxter init</span>
                  </div>
                  
                  <AnimatePresence>
                    {terminalStep >= 1 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-500 mb-1">
                        [*] Booting kernel... <span className="text-[var(--accent)] font-bold">OK</span>
                      </motion.div>
                    )}
                    {terminalStep >= 2 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-400 mb-1">
                        [SYS] Env: <span className="text-white">Linux_Universal</span>
                      </motion.div>
                    )}
                    {terminalStep >= 3 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-yellow-500/80 mb-1 italic">
                        [!] Injecting P10K firmware...
                      </motion.div>
                    )}
                    {terminalStep >= 4 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-1">
                        <span className="text-[var(--accent)]">●</span> theme.engine active
                      </motion.div>
                    )}
                    {terminalStep >= 5 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-1 text-zinc-400">
                        <span className="text-[var(--accent)]">●</span> nerd-icons deployed
                      </motion.div>
                    )}
                    {terminalStep >= 6 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 border border-[var(--accent)]/30 p-3 bg-[var(--accent)]/5 rounded">
                        <div className="text-[var(--accent)] font-bold text-[10px] uppercase mb-1">Interface Ready</div>
                        <div className="text-zinc-500 text-[10px]">Type 'maxter' for dashboard.</div>
                        <div className="flex items-center gap-1 mt-3">
                          <span className="text-[var(--accent)]">➜</span>
                          <div className="w-1.5 h-3 bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]"></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container-max py-24 px-6">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Core Engine</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div 
                key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded-xl transition-all hover:border-[var(--accent)]/50 group"
              >
                <div className="text-[var(--accent)] text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="text-lg font-bold mb-3 uppercase tracking-wide text-[var(--text)]">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Compatibility Section */}
        <section className="py-24 bg-[var(--surface-2)]/40 border-y border-[var(--border)] px-6">
          <div className="container-max text-center">
            <h2 className="text-2xl font-black uppercase mb-12 tracking-tight opacity-90 text-[var(--text)]">Universal Compatibility</h2>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-4xl mx-auto">
               {platforms.map((p, i) => (
                 <motion.div 
                   key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                   className="min-w-[120px] border border-[var(--border)] bg-[var(--surface)] px-5 py-5 rounded-lg flex flex-col items-center gap-3 transition-all hover:border-[var(--accent)] cursor-default shadow-sm"
                 >
                   <span className="text-3xl text-[var(--accent)]" aria-hidden="true">{p.icon}</span>
                   <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--text-muted)]">{p.name}</span>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 bg-[var(--bg)] border-t border-[var(--border)] px-6">
        <div className="container-max flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-2xl font-black tracking-tighter mb-2 text-[var(--text)]">MAXTER<span className="text-[var(--accent)]">_</span></div>
            <p className="text-[var(--text-muted)] text-xs max-w-xs font-medium">Professional shell engine for developers.</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-[9px] font-bold uppercase tracking-[0.2em]">
             <div className="text-[var(--text-muted)]">
               AUTHOR: <a href="https://mahendraplus.github.io" target="_blank" rel="noreferrer" className="text-[var(--text)] hover:text-[var(--accent)] transition-colors border-b border-transparent hover:border-[var(--accent)] pb-0.5">MAHENDRA MALI</a>
             </div>
             <div className="flex gap-6">
               <a href="https://github.com/mahendraplus" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"><FaGithub size={18} /></a>
               <a href="https://mahendraplus.github.io/maxlab/support/" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"><FaLifeRing size={18} /></a>
               <a href="https://mahendraplus.github.io" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"><FaGlobe size={18} /></a>
             </div>
          </div>
        </div>
        <div className="mt-12 text-center opacity-20 text-[8px] font-mono tracking-[0.4em] uppercase text-[var(--text-muted)]">
           MIT LICENSE // Version 27.2.B4 // REBUILD_SYSTEM // MXTR272B408062026
        </div>
      </footer>
    </div>
  );
};

export default App;



