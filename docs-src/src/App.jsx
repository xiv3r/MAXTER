import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  FaTerminal, FaGithub, FaCheck, FaCopy, FaShieldAlt, 
  FaPaintBrush, FaSync, FaSun, FaMoon, FaArrowRight, 
  FaGlobe, FaLifeRing, FaBoxOpen, FaMicrochip, FaCogs
} from 'react-icons/fa';
import { 
  SiDebian, SiUbuntu, SiKalilinux, SiArchlinux, 
  SiFedora, SiApple, SiAndroid 
} from 'react-icons/si';
import { VscTerminal, VscGear, VscCloudDownload, VscGraph } from 'react-icons/vsc';

// --- Particle Background Component ---
const Particles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = `rgba(57, 255, 20, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 80; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

// --- Animated Counter/Typing Hook ---
const useTypingEffect = (text, speed = 50, startDelay = 500) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return displayedText;
};

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [copied, setCopied] = useState(false);
  const [terminalStep, setTerminalStep] = useState(0);
  const installCmd = "bash <(curl -fsSL https://raw.githubusercontent.com/mahendraplus/MAXTER/Max/install.sh)";
  
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
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typingTagline = useTypingEffect("Silent installation, premium themes, and industrial performance.", 40, 1000);

  return (
    <div className="min-h-screen transition-colors duration-500 selection:bg-[var(--accent)] selection:text-black">
      <Particles />
      <div className="fixed inset-0 industrial-grid z-0 opacity-20 pointer-events-none"></div>

      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[var(--accent)] z-[100] origin-left" style={{ scaleX }} />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 h-16 border-b border-[var(--border)] bg-[var(--bg)]/60 backdrop-blur-xl flex items-center transition-all">
        <div className="container-max w-full flex justify-between items-center px-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 font-bold tracking-tighter text-xl text-[var(--text)] group cursor-pointer"
          >
            <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center text-black group-hover:rotate-12 transition-transform">
              <VscTerminal size={24} />
            </div>
            <span>MAXTER<span className="text-[var(--accent)] animate-pulse">_</span></span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <motion.a 
              whileHover={{ scale: 1.1 }}
              href="https://github.com/mahendraplus/MAXTER" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <FaGithub size={24} />
            </motion.a>
            <motion.button 
              whileTap={{ rotate: 180 }}
              onClick={toggleTheme}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              {theme === 'dark' ? <FaSun size={24} /> : <FaMoon size={24} />}
            </motion.button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container-max min-h-screen flex flex-col justify-center pt-32 pb-20 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-4 py-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 text-[var(--accent)] font-mono text-xs mb-8"
              >
                <FaMicrochip className="animate-spin-slow" />
                SYSTEM_OPTIMIZED // v27.0
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-hero mb-8"
              >
                Terminal,<br />
                <span className="text-[var(--accent)] neon-text">Re-Engineered.</span>
              </motion.h1>
              
              <motion.p 
                className="text-[var(--text-muted)] font-mono h-12 text-lg mb-12 max-w-xl"
              >
                {typingTagline}<span className="w-2 h-5 bg-[var(--accent)] inline-block align-middle ml-1 animate-pulse"></span>
              </motion.p>

              {/* Futuristic Command Input */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl bg-black border border-[var(--accent)]/20 rounded-xl p-1 flex items-center gap-4 mb-10 shadow-[0_0_30px_rgba(57,255,20,0.05)]"
              >
                <div className="flex-1 px-5 py-4 font-mono text-[var(--accent)] text-sm overflow-hidden whitespace-nowrap">
                  <span className="opacity-50 mr-2">$</span> {installCmd}
                </div>
                <motion.button 
                  whileHover={{ backgroundColor: 'var(--accent)', color: '#000' }}
                  onClick={copyToClipboard}
                  className="px-6 py-4 border-l border-[var(--accent)]/20 text-[var(--accent)] font-bold text-xs uppercase tracking-widest transition-all rounded-r-lg"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </motion.button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <a href="#features" className="px-8 py-4 bg-[var(--accent)] text-black font-black text-sm uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all flex items-center gap-3 rounded-sm shadow-lg shadow-[var(--accent-glow)]">
                  Initialize <FaArrowRight />
                </a>
                <a href="https://mahendraplus.github.io" target="_blank" className="px-8 py-4 border border-[var(--border)] text-[var(--text)] font-bold text-sm uppercase tracking-tighter hover:bg-[var(--surface-2)] transition-all rounded-sm flex items-center gap-3">
                  <FaGlobe /> Explorer
                </a>
              </motion.div>
            </div>

            {/* Terminal Live Demo */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-5"
            >
              <div className="terminal-card border-[var(--accent)]/30 overflow-hidden relative group">
                <div className="absolute inset-0 bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="terminal-header bg-zinc-900/50 px-5 py-3 flex gap-2 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  <div className="flex-1 text-center font-mono text-[10px] text-zinc-500 tracking-[3px] uppercase ml-[-20px]">maxter_core</div>
                </div>
                <div className="terminal-body p-8 font-mono text-xs sm:text-sm leading-relaxed min-h-[350px]">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[var(--accent)] font-bold">➜</span>
                    <span className="text-white">maxter init</span>
                  </div>
                  
                  <AnimatePresence>
                    {terminalStep >= 1 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-500 mb-2">
                        [*] Booting kernel module... <span className="text-[var(--accent)]">SUCCESS</span>
                      </motion.div>
                    )}
                    {terminalStep >= 2 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-300 mb-2">
                        [SYS] Detecting environment: <span className="bg-[var(--accent)] text-black px-1">Universal/Linux</span>
                      </motion.div>
                    )}
                    {terminalStep >= 3 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-yellow-500 mb-2 italic">
                        [!] Injecting Powerlevel10k firmware...
                      </motion.div>
                    )}
                    {terminalStep >= 4 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2">
                        <span className="text-[var(--accent)]">●</span> theme.service loaded
                      </motion.div>
                    )}
                    {terminalStep >= 5 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2 text-zinc-300">
                        <span className="text-[var(--accent)]">●</span> nerd-icons.p10k deployed
                      </motion.div>
                    )}
                    {terminalStep >= 6 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 border border-[var(--accent)]/50 p-4 bg-[var(--accent)]/5">
                        <div className="text-[var(--accent)] font-black text-sm uppercase mb-2">MAXTER INTERFACE READY</div>
                        <div className="text-white text-[11px]">Control via command: <span className="font-bold underline cursor-pointer">'maxter'</span></div>
                        <div className="flex items-center gap-2 mt-4">
                          <span className="text-[var(--accent)]">➜</span>
                          <div className="w-2 h-4 bg-[var(--accent)] animate-pulse shadow-[0_0_10px_var(--accent)]"></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Engine Section */}
        <section id="features" className="container-max py-32 px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center gap-8 mb-20"
          >
            <div className="text-center lg:text-left">
              <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter">Core Engine</h2>
              <p className="text-[var(--accent)] font-mono text-sm tracking-widest animate-glow">HIGH_PERFORMANCE_LAYER_ACTIVE</p>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent)]/50 to-transparent hidden lg:block"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <VscCloudDownload />, title: "Silent Sync", desc: "Automated, non-interactive setup for any POSIX shell environment." },
              { icon: <FaPaintBrush />, title: "20+ Themes", desc: "Premium, industrial color schemes with live real-time TUI preview." },
              { icon: <FaSync />, title: "Auto-Healing", desc: "Self-correcting deployment engine that repairs broken shell configurations." },
              { icon: <FaTerminal />, title: "Nerd Icons", desc: "Complete glyph integration for a high-fidelity visual workstation." },
              { icon: <VscGraph />, title: "Diagnostics", desc: "Deep system monitoring and performance analytics built into the dashboard." },
              { icon: <FaShieldAlt />, title: "Universal", desc: "One core engine supporting Termux, Ubuntu, Arch, Kali, and macOS." }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, borderColor: 'var(--accent)' }}
                className="bg-[var(--surface)] border border-[var(--border)] p-10 rounded-2xl transition-all relative group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl transition-opacity group-hover:opacity-10 pointer-events-none">{f.icon}</div>
                <div className="text-[var(--accent)] text-4xl mb-8 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-white">{f.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* System Compatibility - Visual Grid */}
        <section className="py-40 bg-[var(--surface-2)]/20 border-y border-[var(--border)] overflow-hidden relative">
          <div className="container-max relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-black uppercase mb-16 tracking-tight">Unified Compatibility</h2>
            </motion.div>
            
            <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
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
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   whileHover={{ y: -10, color: 'var(--accent)', borderColor: 'var(--accent)' }}
                   className="min-w-[140px] border border-[var(--border)] bg-black/40 px-8 py-8 rounded-2xl flex flex-col items-center gap-4 transition-all cursor-default"
                 >
                   <span className="text-4xl" aria-hidden="true">{p.icon}</span>
                   <span className="text-xs font-black uppercase tracking-widest opacity-60">{p.name}</span>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-24 bg-black border-t border-[var(--border)] relative overflow-hidden">
        <div className="container-max relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="text-center md:text-left">
              <div className="text-3xl font-black tracking-tighter mb-4">MAXTER<span className="text-[var(--accent)]">_</span></div>
              <p className="text-[var(--text-muted)] text-sm max-w-sm mb-8 font-medium">The definitive shell customization engine for professional developers and hackers.</p>
              <div className="flex justify-center md:justify-start gap-6">
                <motion.a whileHover={{ color: 'var(--accent)' }} href="https://github.com/mahendraplus" className="text-white text-xl transition-colors"><FaGithub /></motion.a>
                <motion.a whileHover={{ color: 'var(--accent)' }} href="https://mahendraplus.github.io/maxlab/support/" className="text-white text-xl transition-colors"><FaLifeRing /></motion.a>
                <motion.a whileHover={{ color: 'var(--accent)' }} href="https://mahendraplus.github.io" className="text-white text-xl transition-colors"><FaGlobe /></motion.a>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6 text-[10px] font-bold uppercase tracking-[0.3em]">
               <div className="text-[var(--text-muted)] flex items-center gap-3">
                 BY: <a href="https://mahendraplus.github.io" target="_blank" rel="noreferrer" className="text-white hover:text-[var(--accent)] transition-colors underline decoration-1 underline-offset-4">MAHENDRA MALI</a>
               </div>
               <div className="flex items-center gap-4 text-[var(--text-muted)]">
                 <span>MIT LICENSE</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-glow"></span>
                 <span>STABLE_REBUILD_v27.0</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
