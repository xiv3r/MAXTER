import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
      scrolled 
      ? 'dark:bg-bg-surface/90 bg-white/90 backdrop-blur-xl py-3 dark:border-border-subtle border-gray-200 shadow-2xl' 
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
        
        <div className="flex items-center gap-3 sm:gap-8">
          <div className="hidden sm:flex items-center gap-5 mr-2 border-r dark:border-border-subtle border-gray-200 pr-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-blue/5 border border-accent-blue/10">
              <Github size={14} className="text-accent-blue" />
              <span className="text-[11px] font-black dark:text-white text-bg-primary">{stats.stars}</span>
            </div>
          </div>

          <a 
            href="https://github.com/mahendraplus/MAXTER" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center justify-center w-11 h-11 rounded-2xl dark:bg-bg-elevated bg-gray-100 border dark:border-border-subtle border-gray-200 dark:text-text-secondary text-gray-600 hover:text-accent-blue transition-all"
            title="GitHub Repository"
          >
            <Github size={20} />
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
    <section className="relative pt-48 pb-20 px-6 lg:px-12 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-7xl lg:text-9xl font-black mb-10 leading-[0.9] tracking-tighter dark:text-white text-bg-primary">
            Terminal Setup<br />Made Easy<span className="text-accent-blue">.</span>
          </h1>
          <p className="dark:text-text-secondary text-gray-500 font-medium text-lg sm:text-xl mb-16 max-w-2xl mx-auto leading-relaxed">
            One command to install Zsh, beautiful themes, and essential tools. 
            Works on Termux and all major Linux systems.
          </p>
        </motion.div>

        {/* Hero Slider & Install Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Slider Column */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-accent-blue/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
              <div className="relative dark:bg-bg-surface bg-white border dark:border-border-subtle border-gray-200 rounded-[3rem] overflow-hidden shadow-2xl">
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
                          className="text-gray-300 text-lg font-medium"
                        >
                          {slides[activeSlide].slogan}
                        </motion.p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Progress Indicators */}
                <div className="absolute top-6 right-8 flex gap-2">
                  {slides.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${activeSlide === i ? 'w-8 bg-accent-blue' : 'w-2 bg-white/30'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Install Column */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-5 text-left"
          >
            <div className="dark:bg-bg-surface bg-white border dark:border-border-subtle border-gray-200 rounded-[2.5rem] p-8 sm:p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] dark:text-text-muted text-gray-400">Ready to Install</span>
              </div>
              
              <div className="dark:bg-black/40 bg-gray-50 rounded-2xl p-6 mb-8 border dark:border-border-subtle border-gray-200">
                <div className="flex items-center gap-4 font-mono text-sm overflow-x-auto scrollbar-hide whitespace-nowrap">
                  <span className="text-accent-blue font-black select-none">›</span>
                  <code className="dark:text-white/90 text-bg-primary font-bold">{installCmd}</code>
                </div>
              </div>

              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={copy}
                className={`w-full relative h-20 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden ${
                  copied 
                  ? 'bg-green-500 text-white shadow-green-500/20' 
                  : 'bg-accent-blue text-white hover:bg-accent-blue-light shadow-2xl shadow-accent-blue/30'
                }`}
              >
                <div className="flex items-center justify-center gap-4">
                  {copied ? <Check className="w-6 h-6" strokeWidth={4} /> : <Copy className="w-6 h-6" strokeWidth={4} />}
                  <span>{copied ? 'Copied' : 'Copy Command'}</span>
                </div>
              </motion.button>
              
              <p className="mt-8 text-[11px] font-medium text-gray-500 dark:text-text-muted text-center leading-relaxed">
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
    { label: "Issues", value: "0", desc: "Open Issues" }
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
    <section className="container mx-auto py-24 px-6 lg:px-12 border-y dark:border-border-subtle border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
        {stats.map((s, i) => (
          <div key={i} className="group">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-blue mb-4 group-hover:translate-x-1 transition-transform">{s.label}</div>
            <div className="text-5xl lg:text-7xl font-black dark:text-white text-bg-primary tracking-tighter mb-2">{s.value}</div>
            <div className="text-xs font-bold text-gray-400 dark:text-text-muted uppercase tracking-[0.2em]">{s.desc}</div>
          </div>
        ))}
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
    <section className="py-32 px-6 lg:px-12 dark:bg-bg-surface/20 bg-gray-50/50">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-black mb-6 dark:text-white text-bg-primary uppercase tracking-tighter">Community Driven</h2>
        <p className="dark:text-text-secondary text-gray-500 font-medium mb-16 max-w-xl mx-auto">
          Thanks to all the amazing people who have contributed to making MAXTER better every day.
        </p>
        
        <div className="flex flex-wrap justify-center gap-10">
          {users.map((u, i) => (
            <motion.a 
              key={i} href={u.html_url} target="_blank" rel="noreferrer"
              whileHover={{ y: -5 }}
              className="flex flex-col items-center gap-4 group"
            >
              <div className="relative">
                <img 
                  src={u.avatar_url} 
                  alt={u.login}
                  className="w-24 h-24 rounded-[2rem] border-2 dark:border-border-subtle border-white shadow-2xl group-hover:border-accent-blue transition-all"
                />
                <div className="absolute -inset-2 bg-accent-blue/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest dark:text-white text-bg-primary group-hover:text-accent-blue transition-colors">
                {u.login}
              </span>
            </motion.a>
          ))}
          <motion.a 
            href="https://github.com/mahendraplus/MAXTER/graphs/contributors"
            whileHover={{ y: -5 }}
            className="flex flex-col items-center gap-4 group"
          >
            <div className="w-24 h-24 rounded-[2rem] border-2 border-dashed dark:border-border-subtle border-gray-300 flex items-center justify-center text-gray-400 group-hover:text-accent-blue group-hover:border-accent-blue transition-all">
              <Github size={32} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-accent-blue">
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
    { name: "Termux", icon: SiTermux, color: "#4ade80" },
    { name: "Debian", icon: SiDebian, color: "#D70A53" },
    { name: "Ubuntu", icon: SiUbuntu, color: "#E95420" },
    { name: "Arch", icon: SiArchlinux, color: "#1793D1" },
    { name: "Kali", icon: SiKalilinux, color: "#2683E2" },
    { name: "Fedora", icon: SiFedora, color: "#51A2DA" },
    { name: "macOS", icon: SiApple, color: "#A2AAAD" }
  ];
  
  return (
    <section className="py-40 border-y dark:border-border-subtle border-gray-100 px-6 lg:px-12">
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
const Footer = () => (
  <footer className="py-24 px-6 lg:px-12 dark:bg-bg-primary bg-white">
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
      <SocialStats />
      <Features />
      <Contributors />
      <Platforms />
      <Footer />
    </div>
  );
};

export default App;
