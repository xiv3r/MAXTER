import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Copy, Check, Terminal, Palette, RefreshCw, 
  ShieldCheck, Globe, LifeBuoy, ExternalLink, 
  ChevronRight, Sun, Moon, Command
} from 'lucide-react';
import { 
  SiDebian, SiUbuntu, SiArchlinux, SiKalilinux, 
  SiFedora, SiApple 
} from '@icons-pack/react-simple-icons';

// --- Custom Termux Icon (Official Path) ---
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

// --- Navbar ---
const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
      scrolled 
      ? 'dark:bg-bg-surface/80 bg-white/80 backdrop-blur-xl py-3 dark:border-border-subtle border-gray-200' 
      : 'bg-transparent py-5 border-transparent'
    }`}>
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-blue rounded-xl flex items-center justify-center text-white shadow-xl shadow-accent-blue/30">
            <Terminal size={22} strokeWidth={2.5} />
          </div>
          <span className="font-mono font-black text-2xl tracking-tighter uppercase dark:text-white text-bg-primary">
            MAXTER<span className="text-accent-blue">.</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-8">
          <a href="https://github.com/mahendraplus/MAXTER" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest dark:text-text-secondary text-gray-500 hover:text-accent-blue transition-all">
            <Github size={18} />
            <span className="hidden sm:inline">Code</span>
          </a>
          <motion.button 
            whileTap={{ scale: 0.85 }}
            onClick={toggleTheme}
            className="w-11 h-11 flex items-center justify-center rounded-2xl dark:bg-bg-elevated bg-gray-100 border dark:border-border-subtle border-gray-200 dark:text-text-secondary text-gray-600 hover:text-accent-blue transition-all"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

// --- Hero Section ---
const Hero = ({ installCmd }) => {
  const [copied, setCopied] = useState(false);
  
  const copy = () => {
    navigator.clipboard.writeText(installCmd);
    if (navigator.vibrate) navigator.vibrate(10);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-48 pb-20 px-6 lg:px-12 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-black mb-10 leading-tight tracking-tighter dark:text-white text-bg-primary">
            Terminal Setup<br />Made Easy<span className="text-accent-blue">.</span>
          </h1>
          <p className="dark:text-text-secondary text-gray-500 font-medium text-lg sm:text-xl mb-16 max-w-2xl mx-auto leading-relaxed">
            One command to install Zsh, beautiful themes, and essential tools. 
            Works on Termux and all major Linux systems.
          </p>
        </motion.div>

        {/* Terminal Component */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute -inset-2 bg-accent-blue/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative dark:bg-bg-surface bg-white border dark:border-border-subtle border-gray-200 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
              {/* Window Controls */}
              <div className="dark:bg-bg-elevated bg-gray-50 px-8 py-5 border-b dark:border-border-subtle border-gray-200 flex items-center justify-between">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/30 border border-red-500/20" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/30 border border-yellow-500/20" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500/30 border border-green-500/20" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.3em] dark:text-text-muted text-gray-400">Install Command</span>
              </div>
              
              <div className="p-5 sm:p-14 text-left">
                <div className="dark:bg-black/40 bg-gray-50 rounded-2xl sm:rounded-[1.5rem] p-5 sm:p-8 mb-8 sm:mb-12 border dark:border-border-subtle border-gray-200">
                  <div className="flex items-center gap-3 sm:gap-5 font-mono text-[11px] sm:text-xl overflow-x-auto scrollbar-hide whitespace-nowrap">
                    <span className="text-accent-blue font-black select-none">›</span>
                    <code className="dark:text-white/90 text-bg-primary font-bold">{installCmd}</code>
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={copy}
                  className={`w-full relative h-14 sm:h-24 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-base uppercase tracking-[0.15em] sm:tracking-[0.3em] transition-all duration-500 overflow-hidden ${
                    copied 
                    ? 'bg-green-500 text-white shadow-green-500/20' 
                    : 'bg-accent-blue text-white hover:bg-accent-blue-light shadow-lg sm:shadow-2xl shadow-accent-blue/30'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 sm:gap-4 px-2">
                    {copied ? <Check className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={4} /> : <Copy className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={4} />}
                    <span className="truncate">{copied ? 'Copied' : 'Copy and Run'}</span>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Feature Section ---
const Features = () => {
  const items = useMemo(() => [
    { icon: <Palette size={32} />, title: "Themes", desc: "Includes 20+ professional themes with real-time preview.", color: "#8B5CF6" },
    { icon: <RefreshCw size={32} />, title: "Repair", desc: "Instantly fix broken shell configs and missing dependencies.", color: "#10B981" },
    { icon: <ShieldCheck size={32} />, title: "Safety", desc: "Clean uninstallation and automated system backups.", color: "#3B82F6" }
  ], []);

  return (
    <section className="container mx-auto py-32 px-6 lg:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {items.map((f, i) => (
          <motion.div 
            key={i} whileHover={{ y: -10 }} whileTap={{ scale: 0.95 }}
            className="group dark:bg-bg-surface bg-white border dark:border-border-subtle border-gray-200 p-12 rounded-[3rem] transition-all duration-300 shadow-2xl hover:border-accent-blue/30"
          >
            <div 
              className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-xl"
              style={{ backgroundColor: f.color + '10', color: f.color, border: '1px solid ' + f.color + '20' }}
            >
              {f.icon}
            </div>
            <h3 className="text-2xl font-black mb-5 dark:text-white text-bg-primary uppercase tracking-tight">{f.title}</h3>
            <p className="dark:text-text-secondary text-gray-500 font-medium leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// --- Platform Grid ---
const Platforms = () => {
  const list = [
    { name: "Termux", icon: SiTermux, color: "#4ade80" },
    { name: "Debian", icon: SiDebian, color: "#D70A53" },
    { name: "Ubuntu", icon: SiUbuntu, color: "#E95420" },
    { name: "Arch", icon: SiArchlinux, color: "#1793D1" },
    { name: "Kali", icon: SiKalilinux, color: "#2683E2" },
    { name: "Fedora", icon: SiFedora, color: "#51A2DA" },
    { name: "macOS", icon: SiApple, color: "#A2AAAD" }
  ];
  
  return (
    <section className="py-40 dark:bg-bg-surface/30 bg-gray-50/50 border-y dark:border-border-subtle border-gray-200 px-6 lg:px-12">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-black mb-20 dark:text-white text-bg-primary uppercase tracking-tighter">Universal Support</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-8">
          {list.map((p, i) => (
            <motion.div 
              key={i} whileHover={{ y: -5 }} whileTap={{ scale: 0.9 }}
              className="dark:bg-bg-surface bg-white border dark:border-border-subtle border-gray-200 p-10 rounded-[2.5rem] flex flex-col items-center gap-6 group hover:border-accent-blue/50 transition-all cursor-default shadow-xl"
            >
              <div className="relative flex items-center justify-center">
                <div 
                  className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity rounded-full duration-500" 
                  style={{ backgroundColor: p.color }}
                />
                <p.icon 
                  size={56} 
                  color={p.color} 
                  className="relative z-10 transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] dark:text-text-muted text-gray-400 group-hover:text-accent-blue transition-colors">{p.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Footer ---
const Footer = () => {
  return (
    <footer className="py-24 px-6 lg:px-12 border-t dark:border-border-subtle border-gray-200 dark:bg-bg-primary bg-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
        <div className="text-center md:text-left">
          <div className="text-3xl font-black tracking-tighter mb-5 dark:text-white text-bg-primary uppercase">MAXTER<span className="text-accent-blue">.</span></div>
          <p className="dark:text-text-secondary text-gray-500 font-medium text-base max-w-xs mx-auto md:mx-0">
            Professional shell environment for every platform.
          </p>
        </div>
        
        <div className="flex gap-12">
          <a href="https://github.com/mahendraplus/MAXTER" className="dark:text-text-secondary text-gray-400 hover:text-accent-blue transition-colors"><Github size={24} /></a>
          <a href="#" className="dark:text-text-secondary text-gray-400 hover:text-accent-blue transition-colors"><LifeBuoy size={24} /></a>
          <a href="#" className="dark:text-text-secondary text-gray-400 hover:text-accent-blue transition-colors"><Globe size={24} /></a>
        </div>

        <div className="text-center md:text-right">
          <a href="https://mahendraplus.github.io" target="_blank" rel="noreferrer" className="inline-flex items-center gap-4 dark:bg-bg-surface bg-gray-50 border dark:border-border-subtle border-gray-200 px-8 py-4 rounded-[1.5rem] hover:border-accent-blue transition-all group shadow-lg">
            <div className="w-10 h-10 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue font-black text-sm">M</div>
            <span className="text-xs font-black uppercase tracking-widest dark:text-text-secondary text-gray-500 group-hover:text-bg-primary dark:group-hover:text-white">Mahendra Mali</span>
            <ExternalLink size={14} className="text-text-muted" />
          </a>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  const [theme, setTheme] = useState('dark');
  const installCmd = "bash <(curl -fsSL https://raw.githubusercontent.com/mahendraplus/MAXTER/Max/install.sh)";

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
    <div className={`min-h-screen relative overflow-x-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-bg-primary text-white' : 'bg-white text-bg-primary'}`}>
      <div className="industrial-grid fixed inset-0 dark:opacity-20 opacity-40 pointer-events-none" />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero installCmd={installCmd} />
      <Features />
      <Platforms />
      <Footer />
    </div>
  );
};

export default App;
