import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { 
  Github, Copy, Check, Terminal, Palette, RefreshCw, 
  ShieldCheck, Globe, LifeBuoy, ExternalLink, 
  ChevronRight, Sun, Moon, Command, Users
} from 'lucide-react';
import { 
  SiDebian, SiUbuntu, SiArchlinux, SiKalilinux, 
  SiFedora, SiApple 
} from '@icons-pack/react-simple-icons';

// --- Custom Termux Icon ---
const SiTermux = ({ size = 24, color = "currentColor", ...props }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}
  >
    <path d="M4 4h16v16H4z" fill={color} fillOpacity="0.1" />
    <path d="M4 4h16v16H4z" />
    <path d="M9 9l3 3-3 3" />
    <path d="M15 15h-3" />
  </svg>
);

// --- Scroll Progress Bar (Sine Wave) ---
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Use width instead of pathLength so the wave never distorts and perfectly ends at the screen edge
  const width = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  const path = useMemo(() => {
    let d = "M 0 10 ";
    for (let i = 0; i < 150; i++) {
      d += `Q ${i * 40 + 10} 0, ${i * 40 + 20} 10 T ${i * 40 + 40} 10 `;
    }
    return d;
  }, []);

  // Precise alignment to start exactly from the golden dot "." in "MAXTER."
  // Base padding px-6 (24px) + logo w-10 (40px) + gap-3 (12px) + MAXTER text approx width (100px)
  // Total offset roughly 176px on mobile. Scaled for lg screens.
  return (
    <div className="absolute top-[28px] left-[176px] lg:left-[216px] w-[calc(100%-176px)] lg:w-[calc(100%-216px)] h-[20px] z-0 pointer-events-none opacity-40">
      <motion.div 
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width }}
      >
        <svg width="6000" height="20" className="absolute top-0 left-0">
          <path 
            d={path}
            fill="transparent"
            stroke="#F5A800"
            strokeWidth="1.5"
            style={{ 
              filter: 'drop-shadow(0 0 3px #F5A800)' 
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

// --- Touch Bubble Effect ---
const TouchEffect = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const handleTouch = (e) => {
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      if(!x || !y) return;

      const id = Date.now();
      setBubbles(prev => [...prev, { x, y, id }]);
      setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== id)), 600);
    };

    window.addEventListener('click', handleTouch);
    window.addEventListener('touchstart', handleTouch);
    return () => {
      window.removeEventListener('click', handleTouch);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  return (
    <>
      {bubbles.map(b => (
        <div 
          key={b.id} 
          className="glowing-bubble"
          style={{ left: b.x, top: b.y, width: '100px', height: '100px', opacity: 0 }}
          ref={(el) => {
            if (el) {
              requestAnimationFrame(() => {
                el.style.width = '0px';
                el.style.height = '0px';
                el.style.opacity = '1';
              });
            }
          }}
        />
      ))}
    </>
  );
};

// --- Navbar ---
const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({ stars: 0, forks: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    fetch('https://api.github.com/repos/mahendraplus/MAXTER')
      .then(res => res.json())
      .then(data => {
        setStats({ 
          stars: data.stargazers_count || 0, 
          forks: data.forks_count || 0 
        });
      })
      .catch(() => {});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled 
      ? 'dark:bg-[#0A0A0A]/90 bg-white/90 backdrop-blur-xl py-3' 
      : 'bg-transparent py-5'
    }`}>
      {/* Flame Bottom Border */}
      <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F5A800]/60 to-transparent transition-opacity duration-500 shadow-[0_-4px_15px_rgba(245,168,0,0.5)] ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
      
      <ScrollProgress />
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center mt-1 relative z-10">
        <div className="flex items-center gap-3">
          <img src="assets/maxter-logo.png" alt="MAXTER Logo" className="w-10 h-10 object-contain logo-shadow" />
          <div className="flex flex-col">
            <span className="font-mono font-black text-2xl tracking-tighter uppercase dark:text-white text-[var(--light-text)] leading-none">
              MAXTER<span className="text-[#F5A800]">.</span>
            </span>
            <span className="text-[10px] font-bold text-[#F5A800] tracking-[0.2em] uppercase mt-1 opacity-80">
              Version 27.4.B6
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-8">
          <div className="hidden sm:flex items-center gap-5 mr-2 border-r dark:border-border-subtle border-gray-200 pr-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5A800]/5 border border-[#F5A800]/10">
              <Github size={14} className="text-[#F5A800]" />
              <span className="text-[11px] font-black dark:text-white text-[var(--light-text)]">{stats.stars}</span>
            </div>
          </div>

          <a 
            href="https://github.com/mahendraplus/MAXTER" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center justify-center w-11 h-11 rounded-2xl dark:bg-[#1A1A1A] bg-gray-100 dark:border-[#333333] border border-gray-200 dark:text-white text-[var(--light-text)] hover:text-[#F5A800] dark:hover:text-[#F5A800] transition-all shadow-sm"
            title="GitHub Repository"
          >
            <Github size={20} />
          </a>

          <motion.button 
            whileTap={{ scale: 0.85 }}
            onClick={toggleTheme}
            className="w-11 h-11 flex items-center justify-center rounded-2xl dark:bg-[#1A1A1A] bg-gray-100 dark:border-[#333333] border border-gray-200 dark:text-white text-[var(--light-text)] hover:text-[#F5A800] dark:hover:text-[#F5A800] transition-all shadow-sm"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

// --- Animated Text ---
const AnimatedHeadline = ({ text }) => {
  return (
    <h1 className="stardos-stencil-bold text-[2.8rem] sm:text-7xl lg:text-[6.5rem] font-black mb-6 leading-[1] tracking-tighter dark:text-white text-[var(--light-text)] uppercase text-center px-2 w-full">
      {text.split("").map((char, i) => {
        const totalDuration = 4;
        const delay = (i / text.length) * totalDuration;
        return (
          <span 
            key={i} 
            className="char-anim" 
            style={{ 
              animationDelay: `${delay}s`, 
              whiteSpace: char === " " ? "pre" : "normal" 
            }}
          >
            {char}
          </span>
        );
      })}
    </h1>
  );
};

// --- Hero Section ---
const Hero = ({ installCmd }) => {
  const [copied, setCopied] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { title: "Terminal", slogan: "Professional workspace.", src: "assets/maxter-terminal.png" },
    { title: "Settings", slogan: "Instant customization.", src: "assets/maxter-settings.png" },
    { title: "Install", slogan: "One-click deployment.", src: "assets/maxter-install.png" },
    { title: "Preview", slogan: "Real-time theme switching.", src: "assets/maxter-settings-theme.gif" },
    { title: "Info", slogan: "Hardware & System overview.", src: "assets/maxter-system-info.png" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);
  
  const copy = () => {
    navigator.clipboard.writeText(installCmd);
    if (navigator.vibrate) navigator.vibrate(10);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden w-full">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F5A800]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto text-center relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: false, amount: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center w-full"
        >
          <AnimatedHeadline text="Terminal Setup Made Easy" />
          <p className="dark:text-[#CCCCCC] text-gray-600 font-medium text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            One command to install Zsh, beautiful themes, and essential tools. 
            Works on Termux and all major Linux systems.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: false, amount: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#F5A800]/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
              <div className="relative dark:bg-[#111111] bg-white border dark:border-border-subtle border-gray-200 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="aspect-video relative overflow-hidden bg-black">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSlide}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <img 
                        src={slides[activeSlide].src} 
                        alt={slides[activeSlide].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 sm:p-12 text-left">
                        <motion.h3 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="text-white text-3xl font-black uppercase tracking-tighter mb-2"
                        >
                          {slides[activeSlide].title}
                        </motion.h3>
                        <motion.p 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-[#CCCCCC] text-lg font-medium"
                        >
                          {slides[activeSlide].slogan}
                        </motion.p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <div className="absolute top-6 right-8 flex gap-2">
                  {slides.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${activeSlide === i ? 'w-8 bg-[#F5A800]' : 'w-2 bg-white/30'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-5 text-left"
          >
            <div className="dark:bg-[#111111] bg-white border dark:border-border-subtle border-gray-200 rounded-[2.5rem] p-8 sm:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-[#F5A800] animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] dark:text-text-muted text-gray-500">Ready to Install</span>
              </div>
              
              <div className="dark:bg-black/40 bg-gray-50 rounded-2xl p-6 mb-8 border dark:border-border-subtle border-gray-200">
                <div className="flex items-center gap-4 font-mono text-sm overflow-x-auto scrollbar-hide whitespace-nowrap">
                  <span className="text-[#F5A800] font-black select-none">›</span>
                  <code className="dark:text-white/90 text-[var(--light-text)] font-bold">{installCmd}</code>
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={copy}
                className={`w-full relative h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden ${
                  copied 
                  ? 'bg-green-500 text-white shadow-green-500/20' 
                  : 'bg-[#F5A800] text-[#111111] hover:bg-[#FFD000] shadow-xl shadow-[#F5A800]/20'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  {copied ? <Check className="w-5 h-5" strokeWidth={4} /> : <Copy className="w-5 h-5" strokeWidth={3} />}
                  <span>{copied ? 'Copied' : 'Copy Command'}</span>
                </div>
              </motion.button>
              
              <p className="mt-8 text-[11px] font-medium text-gray-600 dark:text-text-muted text-center leading-relaxed">
                Works on Android (Termux), Ubuntu, Debian, Arch, Kali, and Fedora.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Social Stats ---
const SocialStats = () => {
  const [stats, setStats] = useState([
    { label: "Stars", value: "0", desc: "GitHub Stargazers" },
    { label: "Forks", value: "0", desc: "Project Forks" },
    { label: "Watchers", value: "0", desc: "Active Watchers" },
    { label: "Issues", value: "0", desc: "Community Support" }
  ]);

  useEffect(() => {
    fetch('https://api.github.com/repos/mahendraplus/MAXTER')
      .then(res => res.json())
      .then(data => {
        setStats([
          { label: "Stars", value: data.stargazers_count || 0, desc: "GitHub Stargazers" },
          { label: "Forks", value: data.forks_count || 0, desc: "Project Forks" },
          { label: "Watchers", value: data.subscribers_count || 0, desc: "Active Watchers" },
          { label: "Issues", value: data.open_issues_count || 0, desc: "Community Support" }
        ]);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="container mx-auto py-24 px-6 lg:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            className="group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F5A800] mb-4 group-hover:translate-x-1 transition-transform">{s.label}</div>
            <div className="text-5xl lg:text-7xl font-black dark:text-white text-[var(--light-text)] tracking-tighter mb-2">{s.value}</div>
            <div className="text-xs font-bold text-gray-500 dark:text-text-muted uppercase tracking-[0.2em]">{s.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- Feature Section ---
const Features = () => {
  const items = useMemo(() => [
    { icon: <Palette size={32} />, title: "Themes", desc: "Includes 20+ professional themes with real-time preview.", color: "#F5A800" },
    { icon: <RefreshCw size={32} />, title: "Repair", desc: "Instantly fix broken shell configs and missing dependencies.", color: "#F5A800" },
    { icon: <ShieldCheck size={32} />, title: "Safety", desc: "Clean uninstallation and automated system backups.", color: "#F5A800" }
  ], []);

  return (
    <section className="container mx-auto py-16 px-6 lg:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((f, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }} 
            whileTap={{ scale: 0.95 }}
            viewport={{ once: false, amount: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative p-[1.5px] rounded-[2rem] overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0%,transparent_85%,#F5A800_100%)] animate-rotate-flame -translate-x-1/2 -translate-y-1/2 z-0" />
            <div className="relative z-10 w-full h-full dark:bg-[#111111] bg-white rounded-[calc(2rem-1.5px)] p-6 flex flex-row sm:flex-col items-center sm:items-start gap-5 sm:gap-6 sm:p-8 transition-all duration-300">
              <div 
                className="w-16 h-16 shrink-0 rounded-[1.2rem] flex items-center justify-center shadow-xl"
                style={{ backgroundColor: f.color + '10', color: f.color, border: '1px solid ' + f.color + '20' }}
              >
                {f.icon}
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black mb-1 sm:mb-3 dark:text-white text-[var(--light-text)] uppercase tracking-tight">{f.title}</h3>
                <p className="dark:text-[#CCCCCC] text-gray-600 font-medium text-sm sm:text-base leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- Contributors ---
const Contributors = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/repos/mahendraplus/MAXTER/contributors')
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data.slice(0, 12) : []))
      .catch(() => {});
  }, []);

  return (
    <section className="py-32 px-6 lg:px-12 dark:bg-[#111111]/20 bg-gray-50/50">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-black mb-6 dark:text-white text-[var(--light-text)] uppercase tracking-tighter">Community Driven</h2>
        <p className="dark:text-[#CCCCCC] text-gray-600 font-medium mb-16 max-w-xl mx-auto">
          Thanks to all the amazing people who have contributed to making MAXTER better every day.
        </p>
        
        <div className="flex flex-wrap justify-center gap-10">
          {users.map((u, i) => (
            <motion.a 
              key={i} href={u.html_url} target="_blank" rel="noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: false, amount: 0 }}
              transition={{ duration: 0.4, delay: (i % 12) * 0.05 }}
              className="flex flex-col items-center gap-4 group"
            >
              <div className="relative">
                <img 
                  src={u.avatar_url} 
                  alt={u.login}
                  className="w-24 h-24 rounded-[2rem] border-2 dark:border-border-subtle border-white shadow-2xl group-hover:border-[#F5A800] transition-all"
                />
                <div className="absolute -inset-2 bg-[#F5A800]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest dark:text-white text-[var(--light-text)] group-hover:text-[#F5A800] transition-colors">
                {u.login}
              </span>
            </motion.a>
          ))}
          <motion.a 
            href="https://github.com/mahendraplus/MAXTER/graphs/contributors"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex flex-col items-center gap-4 group"
          >
            <div className="w-24 h-24 rounded-[2rem] border-2 border-dashed dark:border-border-subtle border-gray-300 flex items-center justify-center text-gray-500 group-hover:text-[#F5A800] group-hover:border-[#F5A800] transition-all">
              <Github size={32} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-[#F5A800]">
              View All
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

// --- Platform Grid ---
const Platforms = () => {
  const list = [
    { name: "Termux", icon: SiTermux, color: "#F5A800" },
    { name: "Debian", icon: SiDebian, color: "#D70A53" },
    { name: "Ubuntu", icon: SiUbuntu, color: "#E95420" },
    { name: "Arch", icon: SiArchlinux, color: "#1793D1" },
    { name: "Kali", icon: SiKalilinux, color: "#2683E2" },
    { name: "Fedora", icon: SiFedora, color: "#51A2DA" },
    { name: "macOS", icon: SiApple, color: "#A2AAAD" },
    { 
      name: "And many more", 
      icon: ({ size, color, className }) => <RefreshCw size={size} color={color} className={className} />, 
      color: "#F5A800" 
    }
  ];
  
  return (
    <section className="py-16 px-6 lg:px-12">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-black mb-10 dark:text-white text-[var(--light-text)] uppercase tracking-tighter">Universal Support</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {list.map((p, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }} 
              whileTap={{ scale: 0.9 }}
              viewport={{ once: false, amount: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="dark:bg-[#111111] bg-white border dark:border-border-subtle border-gray-200 p-6 sm:p-8 rounded-[2rem] flex flex-col items-center gap-4 group hover:border-[#F5A800]/50 transition-all cursor-default shadow-xl"
            >
              <div className="relative flex items-center justify-center">
                <div 
                  className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full duration-500" 
                  style={{ backgroundColor: p.color }}
                />
                <p.icon 
                  size={42} 
                  color={p.color} 
                  className="relative z-10 transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] dark:text-gray-300 text-[var(--light-text)] group-hover:text-[#F5A800] dark:group-hover:text-[#F5A800] transition-colors">{p.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Footer ---
const Footer = () => (
  <footer className="py-12 px-6 lg:px-12 dark:bg-[#0A0A0A] bg-white">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-center md:text-left">
        <div className="text-2xl sm:text-3xl font-black tracking-tighter mb-2 dark:text-white text-[var(--light-text)] uppercase">MAXTER<span className="text-[#F5A800]">.</span></div>
        <p className="dark:text-[#CCCCCC] text-gray-500 font-medium text-sm sm:text-base max-w-xs mx-auto md:mx-0">
          Professional shell environment for every platform.
        </p>
      </div>
      
      <div className="flex gap-12">
        <a href="https://github.com/mahendraplus/MAXTER" target="_blank" rel="noreferrer" className="dark:text-[#CCCCCC] text-gray-500 hover:text-[#F5A800] transition-colors" title="GitHub"><Github size={24} /></a>
        <a href="https://mahendraplus.github.io/maxlab/support/" target="_blank" rel="noreferrer" className="dark:text-[#CCCCCC] text-gray-500 hover:text-[#F5A800] transition-colors" title="Support"><LifeBuoy size={24} /></a>
        <a href="https://mahendraplus.github.io/?utm_source=maxter&utm_medium=web&utm_campaign=referral" target="_blank" rel="noreferrer" className="dark:text-[#CCCCCC] text-gray-500 hover:text-[#F5A800] transition-colors" title="Portfolio"><Globe size={24} /></a>
      </div>

      <div className="text-center md:text-right">
        <a href="https://mahendraplus.github.io/?utm_source=maxter&utm_medium=web&utm_campaign=referral" target="_blank" rel="noreferrer" className="inline-flex items-center gap-4 dark:bg-[#111111] bg-gray-50 border dark:border-border-subtle border-gray-200 px-8 py-4 rounded-[1.5rem] hover:border-[#F5A800] transition-all group shadow-lg">
          <div className="w-10 h-10 rounded-full bg-[#F5A800]/10 flex items-center justify-center text-[#F5A800] font-black text-sm">M</div>
          <span className="text-xs font-black uppercase tracking-widest dark:text-[#CCCCCC] text-gray-600 group-hover:text-[var(--light-text)] dark:group-hover:text-white">Mahendra Mali</span>
          <ExternalLink size={14} className="text-text-muted" />
        </a>
      </div>
    </div>
  </footer>
);

// --- Hacker Background ---
const HackerBackground = ({ theme }) => {
  const canvasRef = React.useRef(null);
  const themeRef = React.useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(0);
    const chars = "maxterMAXTER";

    const draw = () => {
      const isDark = themeRef.current === 'dark';
      
      ctx.fillStyle = isDark ? 'rgba(10, 10, 10, 0.1)' : 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = isDark ? '#F5A800' : 'rgba(245, 168, 0, 0.5)';
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const interval = setInterval(draw, 100);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${theme === 'dark' ? 'opacity-[0.3]' : 'opacity-[0.35]'}`} 
    />
  );
};

const App = () => {
  const [theme, setTheme] = useState('dark');
  const installCmd = "curl -fsSL https://raw.githubusercontent.com/mahendraplus/MAXTER/Max/install.sh | bash";

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('theme');
    const initial = saved || (isDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.className = initial;
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.className = next;
    localStorage.setItem('theme', next);
    if (navigator.vibrate) navigator.vibrate(5);
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0A0A0A] text-white dark' : 'bg-white text-[var(--light-text)] light'}`}>
      <HackerBackground theme={theme} />
      <TouchEffect />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero installCmd={installCmd} />
      <SocialStats />
      <Features />
      <Contributors />
      <Platforms />
      <Footer />
    </div>
  );
};

export default App;
