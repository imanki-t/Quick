import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layout,
  Server,
  Terminal,
  Star,
  GitFork,
  Github,
  Zap,
  Package,
  Layers,
  ChevronUp,
  Activity,
  BookOpen,
  Coffee,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  GitMerge,
  Plus,
  Clipboard,
  Check,
  ChevronDown,
  ExternalLink,
  Users,
  Flame,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getRepos, getEvents, getUserProfile, getLanguageStats, estimateLinesOfCode,
  getCodingStreak, getContributionCount, formatEventMessage, formatTimeAgo,
  getLangColor, Repo, GitHubUser, LanguageStat, StreakData,
} from '../services/github';
import { motion, useInView } from 'motion/react';
import { RepoLogo } from '../components/RepoLogo';
import { useCountUp } from '../hooks/useCountUp';
import { Tooltip } from '../components/Tooltip';
import { useToast } from '../components/ToastProvider';

/* ─── SVG Icons for Rust & WASM ─── */
const RustIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M23.634 11.584l-1.072-.662a12.078 12.078 0 00-.01-.145l.93-.83a.328.328 0 00-.098-.543l-1.19-.445a11.945 11.945 0 00-.045-.14l.777-.97a.328.328 0 00-.2-.518l-1.254-.21a12.148 12.148 0 00-.08-.13l.605-1.085a.328.328 0 00-.294-.488l-1.27.027a12.2 12.2 0 00-.112-.113l.42-1.173a.328.328 0 00-.376-.432l-1.243.258a12.3 12.3 0 00-.139-.093l.224-1.228a.328.328 0 00-.449-.366l-1.176.483a12.4 12.4 0 00-.162-.07l.022-1.243a.328.328 0 00-.512-.287l-1.072.696a12.5 12.5 0 00-.18-.046L15.7.647a.328.328 0 00-.561-.198l-.934.895a12.55 12.55 0 00-.19-.02l-.58-1.133a.328.328 0 00-.585 0l-.58 1.133a12.55 12.55 0 00-.19.02L11.145.45a.328.328 0 00-.56.198l-.18.947a12.5 12.5 0 00-.18.046L9.152.944a.328.328 0 00-.512.287l.022 1.243a12.4 12.4 0 00-.163.07L7.325 2.06a.328.328 0 00-.449.366l.224 1.228a12.3 12.3 0 00-.139.093L5.718 3.49a.328.328 0 00-.376.432l.42 1.173a12.2 12.2 0 00-.112.113L4.38 5.18a.328.328 0 00-.294.488l.605 1.085a12.148 12.148 0 00-.08.13l-1.254.21a.328.328 0 00-.2.518l.777.97a11.945 11.945 0 00-.045.14l-1.19.445a.328.328 0 00-.098.543l.93.83c-.004.048-.007.097-.01.145L.366 11.584a.328.328 0 000 .56l1.072.663c.003.048.006.097.01.145l-.93.83a.328.328 0 00.098.543l1.19.445c.014.047.03.093.045.14l-.777.97a.328.328 0 00.2.518l1.254.21c.026.044.052.087.08.13l-.605 1.085a.328.328 0 00.294.487l1.27-.027c.036.039.073.077.112.113l-.42 1.173a.328.328 0 00.376.432l1.243-.258c.046.032.092.063.139.093l-.224 1.228a.328.328 0 00.449.366l1.176-.483c.053.024.107.047.162.07l-.022 1.243a.328.328 0 00.512.287l1.072-.696c.06.016.12.032.18.046l.18.947a.328.328 0 00.56.198l.934-.895c.063.007.127.014.19.02l.58 1.133a.328.328 0 00.585 0l.58-1.133c.063-.006.127-.013.19-.02l.934.895a.328.328 0 00.56-.198l.181-.947c.06-.014.12-.03.18-.046l1.072.696a.328.328 0 00.512-.287l-.022-1.243c.055-.023.109-.046.162-.07l1.176.483a.328.328 0 00.449-.366l-.224-1.228c.047-.03.093-.061.139-.093l1.243.258a.328.328 0 00.376-.432l-.42-1.173c.039-.036.076-.074.112-.113l1.27.027a.328.328 0 00.294-.487l-.605-1.085c.028-.043.054-.086.08-.13l1.254-.21a.328.328 0 00.2-.518l-.777-.97c.015-.047.031-.093.045-.14l1.19-.445a.328.328 0 00.098-.543l-.93-.83c.004-.048.007-.097.01-.145l1.072-.663a.328.328 0 000-.56zM12 17.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm0-9.5a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);

const WasmIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
  </svg>
);

/* ─── Typing animation hook ─── */
function useTypingEffect(phrases: string[], typingSpeed = 70, pauseMs = 1600) {
  const [display, setDisplay] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pauseMs);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), typingSpeed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }

    setDisplay(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex, phrases, typingSpeed, pauseMs]);

  return display;
}

/* ─── Stats counter card ─── */
function StatCard({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(value, 1600, 0, inView);

  return (
    <div
      ref={ref}
      className="group flex flex-col gap-1 rounded-xl border border-accents-2 bg-background p-5 card-top-border spotlight-card transition-all hover:border-accents-4 scale-on-hover"
    >
      <span className="text-2xl font-bold tracking-tight tabular-nums font-mono">
        {count}{suffix}
      </span>
      <span className="text-xs text-accents-5">{label}</span>
    </div>
  );
}

/* ─── Section heading with number prefix ─── */
function SectionHeading({ number, title, subtitle }: { number: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs font-semibold text-accents-4 select-none">{number}</span>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      {subtitle && <p className="mt-1 text-sm text-accents-5 ml-7">{subtitle}</p>}
    </div>
  );
}

/* ─── Animated section divider ─── */
function SectionDivider({ label }: { label?: string }) {
  if (!label) return <hr className="my-16 border-accents-2/50" />;
  return (
    <div className="my-16 flex items-center gap-4">
      <div className="h-px flex-1 bg-accents-2/60" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accents-4 px-2">{label}</span>
      <div className="h-px flex-1 bg-accents-2/60" />
    </div>
  );
}

/* ─── Skill item ─── */
const SKILLS = [
  { name: 'TypeScript', icon: <Code2 className="h-4 w-4" />, color: '#3178c6', level: 'Advanced' },
  { name: 'React', icon: <Layout className="h-4 w-4" />, color: '#61dafb', level: 'Advanced' },
  { name: 'Node.js', icon: <Server className="h-4 w-4" />, color: '#68a063', level: 'Intermediate' },
  { name: 'Next.js', icon: <Globe className="h-4 w-4" />, color: '#888', level: 'Intermediate' },
  { name: 'PostgreSQL', icon: <Database className="h-4 w-4" />, color: '#336791', level: 'Intermediate' },
  { name: 'GraphQL', icon: <GitBranch className="h-4 w-4" />, color: '#e535ab', level: 'Learning' },
  { name: 'Docker', icon: <Cpu className="h-4 w-4" />, color: '#2496ed', level: 'Intermediate' },
  { name: 'Linux', icon: <Terminal className="h-4 w-4" />, color: '#ffcc00', level: 'Advanced' },
  { name: 'Vite', icon: <Zap className="h-4 w-4" />, color: '#bd34fe', level: 'Advanced' },
  { name: 'Tailwind', icon: <Layers className="h-4 w-4" />, color: '#38bdf8', level: 'Advanced' },
  { name: 'npm', icon: <Package className="h-4 w-4" />, color: '#cc3534', level: 'Advanced' },
  { name: 'Rust', icon: <Activity className="h-4 w-4" />, color: '#dea584', level: 'Learning' },
];

const levelColors: Record<string, string> = {
  Advanced: 'text-green-400',
  Intermediate: 'text-blue-400',
  Learning: 'text-purple-400',
};

/* ─── Journey timeline ─── */
const JOURNEY = [
  {
    period: 'Oct 2024 – Present',
    role: 'Vibe Coder & Open Source Explorer',
    tags: ['AI Tools', 'Open Source', 'Vibe Coding'],
    description:
      'Diving deep into AI-assisted development — building tools, experimenting with LLMs, and shipping projects that combine creativity with code. Every project starts with a vibe and ends with something real.',
    icon: <Coffee className="h-4 w-4" />,
    color: 'text-purple-400',
    accentColor: 'border-purple-500/30',
  },
  {
    period: 'Apr 2024 – Oct 2024',
    role: 'Full Stack Tinkerer',
    tags: ['React', 'Node.js', 'APIs'],
    description:
      'Started building full-stack applications from scratch — React frontends, Express backends, integrating third-party APIs. Shipped my first few tools that actual people started using.',
    icon: <Code2 className="h-4 w-4" />,
    color: 'text-blue-400',
    accentColor: 'border-blue-500/30',
  },
  {
    period: 'Jan 2024 – Apr 2024',
    role: 'Frontend Developer (Self-taught)',
    tags: ['TypeScript', 'Tailwind', 'Vite'],
    description:
      'Went from vanilla JS to TypeScript and modern tooling. Fell in love with Tailwind CSS and component-based architecture. Built increasingly complex UIs and learned to think in systems.',
    icon: <Layout className="h-4 w-4" />,
    color: 'text-cyan-400',
    accentColor: 'border-cyan-500/30',
  },
  {
    period: 'Aug 2023 – Jan 2024',
    role: 'The Beginning — Hello, World!',
    tags: ['HTML', 'CSS', 'JavaScript'],
    description:
      'Started coding with zero experience — just curiosity and YouTube tutorials. Wrote my first lines of HTML, struggled with CSS centering, and had my first "it works!" moment. That feeling never gets old.',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'text-green-400',
    accentColor: 'border-green-500/30',
  },
];

/* ─── Activity type icon ─── */
function ActivityIcon({ type }: { type: string }) {
  const cls = 'h-3.5 w-3.5';
  const iconMap: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    commit: { icon: <GitCommit className={cls} />, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    star:   { icon: <Star className={cls} />, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    fork:   { icon: <GitFork className={cls} />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    pr:     { icon: <GitPullRequest className={cls} />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    issue:  { icon: <AlertCircle className={cls} />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    create: { icon: <Plus className={cls} />, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    merge:  { icon: <GitMerge className={cls} />, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    other:  { icon: <Activity className={cls} />, color: 'text-accents-5', bg: 'bg-accents-1 border-accents-2' },
  };
  const def = iconMap[type] || iconMap.other;
  return (
    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${def.bg} ${def.color}`}>
      {def.icon}
    </div>
  );
}

/* ─── Contribution heatmap
     Performance fix: replaced 182 individual <Tooltip> component instances
     (each with their own state + event listeners) with a single shared tooltip
     rendered at the container level. This eliminates ~364 useState/useRef calls
     and drastically reduces the React reconciliation cost on scroll/hover.
   ─── */
function ContributionHeatmap() {
  const weeks = 26;
  const days = 7;
  const cells = React.useMemo(
    () =>
      Array.from({ length: weeks * days }, (_, i) => {
        const seed = (i * 31 + 17) % 100;
        return seed < 40 ? 0 : seed < 60 ? 1 : seed < 80 ? 2 : seed < 92 ? 3 : 4;
      }),
    []
  );

  const bgMap = [
    'bg-accents-2 opacity-40',
    'bg-green-900/60',
    'bg-green-700/70',
    'bg-green-500/80',
    'bg-green-400',
  ];

  // Single shared tooltip state
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent, level: number) => {
    const text = level === 0 ? 'No contributions' : `${level} contribution${level !== 1 ? 's' : ''}`;
    setTooltip({ x: e.clientX, y: e.clientY, text });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
  }, []);

  return (
    <div
      className="overflow-x-auto scrollbar-hide"
      onMouseLeave={() => setTooltip(null)}
    >
      {/* Fixed-position tooltip rendered once for ALL cells */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none rounded-md border border-accents-2 bg-accents-8 px-2.5 py-1 text-xs font-medium text-background shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 32 }}
        >
          {tooltip.text}
        </div>
      )}

      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${weeks}, 12px)`,
          gridTemplateRows: `repeat(${days}, 12px)`,
          gridAutoFlow: 'column',
        }}
      >
        {cells.map((level, i) => (
          <div
            key={i}
            className={`heat-cell ${bgMap[level]}`}
            onMouseEnter={(e) => handleMouseEnter(e, level)}
            onMouseMove={handleMouseMove}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Copy email button ─── */
function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = useCallback(() => {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      toast('Email copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    });
  }, [email, toast]);

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-accents-2 bg-accents-1/50 px-3 py-1.5 text-xs font-medium text-accents-5 transition-all hover:border-accents-4 hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Clipboard className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : email}
    </button>
  );
}

/* ─── BackToTop with scroll ring ─── */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollTop > 400);
      setProgress(docH > 0 ? (scrollTop / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const circumference = 2 * Math.PI * 14;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-accents-2 bg-background/90 text-accents-5 shadow-lg backdrop-blur-md transition-all hover:border-accents-5 hover:text-foreground hover:shadow-xl animate-fade-in-up"
      title="Back to top"
    >
      <svg className="absolute h-10 w-10 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
        <circle
          cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <ChevronUp className="h-4 w-4 relative z-10" />
    </button>
  );
}

/* ─── Spotlight mouse tracker for cards ─── */
function useSpotlight(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, [ref]);
}

/* ─── Hero dotted background ─── */
function HeroDottedBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-3xl"
      style={{
        backgroundImage: 'radial-gradient(circle, var(--accents-3) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.35,
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }}
    />
  );
}

/* ─── Floating decorative code snippet ─── */
function CodeDecoration() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-0 top-4 hidden lg:block opacity-30 select-none"
    >
      <div className="rounded-xl border border-accents-2 bg-accents-1/60 backdrop-blur-sm p-4 font-mono text-[11px] text-accents-5 space-y-1 w-52">
        <div><span className="text-purple-400">const</span> <span className="text-blue-400">dev</span> <span className="text-accents-5">= {'{'}</span></div>
        <div className="pl-4"><span className="text-green-400">name</span><span className="text-accents-5">: </span><span className="text-yellow-400">"unmuted"</span><span className="text-accents-5">,</span></div>
        <div className="pl-4"><span className="text-green-400">status</span><span className="text-accents-5">: </span><span className="text-yellow-400">"building"</span><span className="text-accents-5">,</span></div>
        <div className="pl-4"><span className="text-green-400">coffee</span><span className="text-accents-5">: </span><span className="text-orange-400">Infinity</span></div>
        <div><span className="text-accents-5">{'}'}</span></div>
      </div>
    </div>
  );
}

/* ─── Inline code tag ─── */
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-accents-2 bg-accents-1 px-1.5 py-0.5 font-mono text-[11px] text-foreground">
      {children}
    </code>
  );
}

/* ─── Language Donut Chart ─── */
function LanguageDonut({ data }: { data: LanguageStat[] }) {
  const r = 60, C = 2 * Math.PI * r, strokeWidth = 18;
  const [hovered, setHovered] = useState<string | null>(null);
  let cumulative = 0;
  const segments = data.map((d) => {
    const fraction = d.percentage / 100, start = cumulative;
    cumulative += fraction;
    return { ...d, fraction, start };
  });
  const hoveredItem = hovered ? data.find((d) => d.name === hovered) : null;
  const size = 180;
  return (
    <div className="flex items-center gap-8 flex-wrap justify-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
          <circle cx={0} cy={0} r={r} fill="none" stroke="var(--accents-2)" strokeWidth={strokeWidth} />
          {segments.map((seg) => {
            const dashLen = seg.fraction * C, gapLen = C - dashLen;
            const isHov = hovered === seg.name;
            return (
              <motion.circle key={seg.name} cx={0} cy={0} r={r} fill="none" stroke={seg.color}
                strokeWidth={isHov ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${dashLen} ${gapLen}`} strokeDashoffset={0}
                transform={`rotate(${seg.start * 360 - 90})`}
                initial={{ strokeDasharray: `0 ${C}` }}
                animate={{ strokeDasharray: `${dashLen} ${gapLen}` }}
                transition={{ duration: 1.2, delay: segments.indexOf(seg) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
                onMouseEnter={() => setHovered(seg.name)} onMouseLeave={() => setHovered(null)} />
            );
          })}
          <text x={0} y={-8} textAnchor="middle" style={{ fontSize: 11, fill: 'var(--accents-5)', fontFamily: 'monospace' }}>
            {hoveredItem ? hoveredItem.name : 'languages'}
          </text>
          <text x={0} y={10} textAnchor="middle" style={{ fontSize: 16, fontWeight: 700, fill: 'var(--fg)', fontFamily: 'monospace' }}>
            {hoveredItem ? `${hoveredItem.percentage}%` : data.length}
          </text>
        </svg>
      </div>
      <div className="flex flex-col gap-2 min-w-[160px]">
        {data.map((lang, i) => (
          <motion.div key={lang.name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }} className="flex items-center gap-2.5 cursor-pointer group"
            onMouseEnter={() => setHovered(lang.name)} onMouseLeave={() => setHovered(null)}>
            <span className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
              style={{ backgroundColor: lang.color }} />
            <span className={`text-xs font-medium transition-colors ${hovered === lang.name ? 'text-foreground' : 'text-accents-5'}`}>{lang.name}</span>
            <span className="ml-auto font-mono text-[10px] text-accents-4">{lang.percentage}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Most starred repo spotlight ─── */
function MostStarredCard({ repo }: { repo: Repo }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="relative rounded-2xl border border-yellow-500/25 bg-background overflow-hidden mb-6">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, #fbbf24 0%, transparent 70%)' }} />
      <Link to={`/project/${repo.name}`} className="block p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="relative overflow-hidden rounded-lg border border-yellow-500/20 bg-background p-1.5">
              <RepoLogo name={repo.name} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{repo.name}</h3>
                <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold text-yellow-400 flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-current" /> Top repo
                </span>
              </div>
              <p className="text-xs text-accents-5 mt-0.5 line-clamp-1">{repo.description || 'No description.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
            <span className="flex items-center gap-1 text-yellow-400 font-semibold">
              <Star className="h-3.5 w-3.5 fill-current" />{repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1 text-accents-5"><GitFork className="h-3.5 w-3.5" />{repo.forks_count}</span>
          </div>
        </div>
        {repo.language && (
          <div className="flex items-center gap-1.5 text-xs text-accents-5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getLangColor(repo.language) }} />
            {repo.language}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

/* ─── GitHub profile card ─── */
function GitHubProfileCard({ user }: { user: GitHubUser }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const followers = useCountUp(user.followers, 1200, 0, inView);
  const following  = useCountUp(user.following, 1000, 0, inView);
  const repos      = useCountUp(user.public_repos, 1000, 0, inView);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="rounded-xl border border-accents-2 bg-background p-5">
      <div className="flex items-center gap-3 mb-4">
        {user.avatar_url && (
          <img
            src={user.avatar_url}
            alt={user.login}
            loading="lazy"
            decoding="async"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border-2 border-accents-2"
          />
        )}
        <div>
          <p className="text-sm font-semibold">{user.name || user.login}</p>
          <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-xs text-accents-5 hover:text-foreground transition-colors">@{user.login}</a>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-accents-2 pt-4">
        {[
          { icon: <Users className="h-3.5 w-3.5" />, value: followers, label: 'followers' },
          { icon: <Users className="h-3.5 w-3.5" />, value: following, label: 'following' },
          { icon: <Code2 className="h-3.5 w-3.5" />, value: repos, label: 'repos' },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-accents-5">{s.icon}</span>
            <span className="font-mono text-lg font-bold">{s.value}</span>
            <span className="text-[10px] text-accents-4">{s.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Streak card ─── */
function StreakCard({ streak }: { streak: StreakData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const current = useCountUp(streak.currentStreak, 800, 0, inView);
  const longest  = useCountUp(streak.longestStreak, 1000, 0, inView);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="rounded-xl border border-accents-2 bg-background p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="h-4 w-4 text-orange-400" />
        <span className="text-sm font-semibold">Coding Streak</span>
        <span className="ml-auto text-[10px] text-accents-4 font-mono">last ~90 events</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3 text-center">
          <div className="font-mono text-3xl font-black text-orange-400">{current}</div>
          <div className="text-[10px] text-accents-4 mt-1">current streak</div>
        </div>
        <div className="rounded-lg border border-accents-2 bg-accents-1/50 p-3 text-center">
          <div className="font-mono text-3xl font-black">{longest}</div>
          <div className="text-[10px] text-accents-4 mt-1">longest streak</div>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-accents-4 text-center">{streak.totalActiveDays} active days tracked</p>
    </motion.div>
  );
}

/* ─── OSS card ─── */
function OSSCard({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const c = useCountUp(count, 1200, 0, inView);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="rounded-xl border border-accents-2 bg-background p-5">
      <div className="flex items-center gap-2 mb-3">
        <GitMerge className="h-4 w-4 text-purple-400" />
        <span className="text-sm font-semibold">OSS Contributions</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-4xl font-black text-gradient-animated">{c}</span>
        <span className="text-sm text-accents-5">PRs merged</span>
      </div>
      <p className="mt-2 text-xs text-accents-5 leading-relaxed">Pull requests merged into other people's open source projects on GitHub.</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN HOME COMPONENT
   ═══════════════════════════════════════════════════ */
export function Home() {
  const [featuredRepos, setFeaturedRepos] = useState<Repo[]>([]);
  const [mostStarred, setMostStarred] = useState<Repo | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Array<{ type: string; message: string; repo: string; time: string }>>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [languageStats, setLanguageStats] = useState<LanguageStat[]>([]);
  const [langsLoading, setLangsLoading] = useState(true);
  const [locEstimate, setLocEstimate] = useState(0);
  const [gitHubUser, setGitHubUser] = useState<GitHubUser | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [ossCount, setOssCount] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const typedText = useTypingEffect([
    'open-source tools.',
    'full-stack apps.',
    'cool side projects.',
    'useful developer tools.',
    'things on the web.',
  ]);

  useSpotlight(gridRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    async function fetchAll() {
      try {
        const repos = await getRepos();
        const own = repos.filter((r) => !r.fork);
        const topRepos = [...own]
          .sort((a, b) => b.stargazers_count + b.size - (a.stargazers_count + a.size))
          .slice(0, 4);
        setFeaturedRepos(topRepos);
        const starred = [...own].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
        setMostStarred(starred || null);
        setLocEstimate(estimateLinesOfCode(repos));
        getLanguageStats(repos).then(setLanguageStats).finally(() => setLangsLoading(false));
      } catch { /* silent */ }
      finally { setLoading(false); }
    }
    fetchAll();
  }, []);

  useEffect(() => {
    getEvents()
      .then((data) => setEvents(data.slice(0, 10).map((ev) => ({ ...formatEventMessage(ev), time: formatTimeAgo(ev.created_at) }))))
      .catch(() => {}).finally(() => setEventsLoading(false));
  }, []);

  useEffect(() => { getUserProfile().then(setGitHubUser).catch(() => {}); }, []);
  useEffect(() => { getCodingStreak().then(setStreak).catch(() => {}); }, []);
  useEffect(() => { getContributionCount().then(setOssCount).catch(() => {}); }, []);

  const visibleEvents = showAllActivity ? events : events.slice(0, 5);

  return (
    <>
      <BackToTop />

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">

        {/* 01 · HERO */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 pt-8 relative"
        >
          <div className="absolute inset-0 -inset-x-6 rounded-3xl overflow-hidden pointer-events-none">
            <HeroDottedBg />
          </div>

          <div aria-hidden className="pointer-events-none absolute -top-24 -left-12 h-72 w-72 rounded-full blur-3xl opacity-[0.12]"
            style={{ background: 'radial-gradient(circle, #818cf8 0%, #38bdf8 50%, transparent 70%)' }} />
          <div aria-hidden className="pointer-events-none absolute top-16 -right-8 h-48 w-48 rounded-full blur-3xl opacity-[0.08]"
            style={{ background: 'radial-gradient(circle, #e879f9 0%, transparent 70%)' }} />

          <CodeDecoration />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-5 text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl leading-[1.05]"
          >
            hii, I'm{' '}
            <span className="text-gradient-animated whitespace-nowrap">unmuted</span>
            <span className="text-gradient-animated">.</span>
            <br />
            <span className="text-3xl sm:text-5xl md:text-6xl">I build{' '}</span>
            <span className="relative text-3xl sm:text-5xl md:text-6xl">
              <span className="text-foreground">{typedText}</span>
              <span className="cursor-blink" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-8 max-w-[38rem] text-base text-accents-5 leading-relaxed"
          >
            Self-taught developer from 2023 — started with zero and shipped real things.
            I love vibe coding, open source, and turning ideas into working software.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/projects"
              className="group deploy-btn inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://github.com/imanki-t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-accents-2 bg-transparent px-6 text-sm font-medium text-foreground transition-all hover:bg-accents-1 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <Link
              to="/contacts"
              className="inline-flex h-11 items-center justify-center rounded-full border border-accents-2 bg-transparent px-6 text-sm font-medium text-accents-5 transition-all hover:text-foreground hover:border-accents-4 hover:bg-accents-1"
            >
              Contact Me
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-5 flex items-center gap-2"
          >
            <span className="text-xs text-accents-4 font-mono">quick reach:</span>
            <CopyEmailButton email="imitsankit@gmail.com" />
          </motion.div>
        </motion.section>

        <SectionDivider label="stats" />

        {/* 02 · STATS */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="mb-24">
          <SectionHeading number="02" title="By the numbers" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard value={18} label="Months coding" suffix="+" />
            <StatCard value={15} label="Projects shipped" suffix="+" />
            <StatCard value={locEstimate > 0 ? Math.round(locEstimate / 1000) : 200} label="Est. lines of code" suffix="k~" />
            <StatCard value={4} label="Languages used" />
          </div>
        </motion.section>

        <SectionDivider label="github" />

        {/* 03 · GITHUB OVERVIEW */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }} className="mb-24">
          <SectionHeading number="03" title="GitHub Overview" subtitle="Live data fetched from the GitHub API." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gitHubUser ? <GitHubProfileCard user={gitHubUser} /> : <div className="rounded-xl border border-accents-2 bg-background h-40 skeleton-shimmer" />}
            {streak ? <StreakCard streak={streak} /> : <div className="rounded-xl border border-accents-2 bg-background h-40 skeleton-shimmer" />}
            {ossCount !== null ? <OSSCard count={ossCount} /> : <div className="rounded-xl border border-accents-2 bg-background h-40 skeleton-shimmer" />}
          </div>
        </motion.section>

        <SectionDivider label="languages" />

        {/* 04 · LANGUAGE BREAKDOWN */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }} className="mb-24">
          <SectionHeading number="04" title="Language Breakdown" subtitle="Real byte counts from my top 20 repositories." />
          <div className="rounded-xl border border-accents-2 bg-background p-6 md:p-8">
            {langsLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="h-8 w-8 rounded-full border-2 border-accents-2 border-t-foreground animate-spin" />
              </div>
            ) : languageStats.length > 0 ? (
              <LanguageDonut data={languageStats} />
            ) : (
              <p className="text-center text-sm text-accents-5 py-12">
                Language data unavailable — add a <code className="text-xs bg-accents-1 px-1 py-0.5 rounded border border-accents-2">VITE_GITHUB_TOKEN</code> to bypass rate limits.
              </p>
            )}
          </div>
        </motion.section>

        <SectionDivider label="about" />

        {/* 05 · PHILOSOPHY */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <SectionHeading number="05" title="Philosophy" />
          <div className="grid md:grid-cols-2 border border-accents-2 rounded-xl overflow-hidden">
            <div className="flex flex-col justify-center p-8 md:p-10 border-b md:border-b-0 md:border-r border-accents-2 bg-background transition-colors hover:bg-accents-1/50 noise-overlay">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accents-4">
                <span className="h-px w-6 bg-accents-3" />
                Design Philosophy
              </div>
              <h2 className="mb-4 text-xl font-bold tracking-tight leading-snug">
                Code is craft.
                <br />
                <span className="text-gradient-animated">Vibes are the blueprint.</span>
              </h2>
              <p className="text-sm text-accents-5 leading-relaxed">
                I believe software should feel good to use. My approach: start with a vibe,
                iterate fast, ship often. Minimalism wins over complexity. I reach for{' '}
                <Code>TypeScript</Code>, <Code>React</Code>, and <Code>Node</Code> for most
                things — and <Code>Rust</Code> when performance demands it.
              </p>
            </div>
            <div className="grid grid-cols-2">
              <div className="group flex flex-col justify-center p-7 border-b border-r border-accents-2 bg-background transition-colors hover:bg-accents-1/50 card-top-border">
                <h3 className="mb-1 text-3xl font-bold tracking-tight tabular-nums font-mono">18</h3>
                <p className="text-xs text-accents-5">months of coding</p>
              </div>
              <div className="group flex flex-col justify-center p-7 border-b border-accents-2 bg-background transition-colors hover:bg-accents-1/50 card-top-border">
                <h3 className="mb-1 text-3xl font-bold tracking-tight font-mono">∞</h3>
                <p className="text-xs text-accents-5">things left to learn</p>
              </div>
              <div className="group col-span-2 flex flex-col justify-center p-7 bg-background transition-colors hover:bg-accents-1/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold tracking-tight">Currently exploring</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 text-[11px] font-medium text-orange-400">
                    <RustIcon className="w-3 h-3" />
                    Rust
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-[11px] font-medium text-blue-400">
                    <WasmIcon className="w-3 h-3" />
                    WASM
                  </span>
                </div>
                <p className="mt-2 text-xs text-accents-5">Performance-first systems programming.</p>
              </div>
            </div>
          </div>
        </motion.section>

        <SectionDivider label="skills" />

        {/* 06 · SKILLS */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="mb-8 flex items-center justify-between">
            <SectionHeading number="06" title="Core Technologies" />
            <span className="text-xs text-accents-4 font-mono mb-8">{SKILLS.length} skills</span>
          </div>

          <div className="mb-4 flex items-center gap-4 text-[10px] font-medium">
            {Object.entries(levelColors).map(([level, color]) => (
              <span key={level} className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${color.replace('text-', 'bg-')}`} />
                <span className="text-accents-4">{level}</span>
              </span>
            ))}
          </div>

          <div
            ref={gridRef}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 border-t border-l border-accents-2 spotlight-card"
          >
            {SKILLS.map((skill, idx) => (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                key={skill.name}
                className="group flex flex-col items-center justify-center gap-3 border-b border-r border-accents-2 bg-background p-6 transition-all hover:bg-accents-1 grid-highlight-cell relative z-10"
              >
                <Tooltip content={`${skill.name} · ${skill.level}`} side="top" delay={200}>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-accents-2 bg-background transition-all group-hover:scale-110 group-hover:border-accents-4"
                    style={{ color: skill.color }}
                  >
                    {skill.icon}
                  </div>
                </Tooltip>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-accents-5 group-hover:text-foreground transition-colors">
                    {skill.name}
                  </span>
                  <span className={`h-1 w-1 rounded-full ${levelColors[skill.level].replace('text-', 'bg-')}`} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 overflow-hidden border border-accents-2 rounded-xl bg-accents-1/30 py-3">
            <div className="marquee-track">
              {[...SKILLS, ...SKILLS].map((skill, i) => (
                <span key={i} className="mx-5 inline-flex items-center gap-2 text-xs font-medium text-accents-5 whitespace-nowrap">
                  <span style={{ color: skill.color }}>{skill.icon}</span>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        <SectionDivider label="journey" />

        {/* 07 · JOURNEY */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <SectionHeading number="07" title="My Journey" subtitle="From zero lines of code to shipping real things." />

          <div className="relative">
            <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-accents-2 via-accents-3 to-transparent hidden sm:block" />

            <div className="flex flex-col gap-0">
              {JOURNEY.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group relative flex gap-5 pb-8"
                >
                  <div
                    className={`relative z-10 mt-1 hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${item.accentColor} bg-background transition-all group-hover:border-accents-5 ${item.color}`}
                  >
                    {item.icon}
                    {idx === 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background status-dot-available" />
                    )}
                  </div>

                  <div className={`flex-1 rounded-xl border bg-background p-5 transition-all hover:border-accents-4 hover:bg-accents-1/50 card-top-border ${item.accentColor}`}>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-accents-4">{item.period}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-accents-2 bg-accents-1 px-2 py-0.5 text-[10px] font-medium text-accents-5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-foreground">{item.role}</h3>
                    <p className="text-sm text-accents-5 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <SectionDivider label="activity" />

        {/* 08 · CONTRIBUTION HEATMAP */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="mb-5 flex items-center justify-between">
            <SectionHeading number="08" title="Contribution Activity" />
            <span className="flex items-center gap-1.5 text-xs text-accents-5 mb-8">
              <span className="h-2 w-2 rounded-sm bg-green-500" />
              200+ contributions in 6 months
            </span>
          </div>
          <div className="rounded-xl border border-accents-2 bg-background p-5 overflow-hidden">
            <ContributionHeatmap />
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-accents-4">
              <span>Less</span>
              {['bg-accents-2 opacity-40', 'bg-green-900/60', 'bg-green-700/70', 'bg-green-500/80', 'bg-green-400'].map((c, i) => (
                <span key={i} className={`heat-cell ${c}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </motion.section>

        {/* 09 · REAL ACTIVITY FEED */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-semibold tracking-tight text-accents-5 ml-7">Recent Activity</h3>
            <a
              href="https://github.com/imanki-t"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center text-xs font-medium text-accents-5 transition-colors hover:text-foreground"
            >
              View on GitHub
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
          <div className="rounded-xl border border-accents-2 bg-background overflow-hidden divide-y divide-accents-2">
            {eventsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="h-7 w-7 rounded-lg skeleton-shimmer shrink-0" />
                  <div className="h-3 flex-1 rounded skeleton-shimmer" />
                  <div className="h-3 w-16 rounded skeleton-shimmer" />
                </div>
              ))
            ) : events.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-accents-5">
                <Github className="mr-2 h-4 w-4" /> No recent public activity found.
              </div>
            ) : (
              <>
                {visibleEvents.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accents-1/50 group"
                  >
                    <ActivityIcon type={item.type} />
                    <span className="flex-1 text-sm text-foreground truncate">{item.message}</span>
                    <span className="hidden sm:block shrink-0 rounded-full border border-accents-2 bg-accents-1 px-2.5 py-0.5 text-[10px] font-mono text-accents-5">
                      {item.repo}
                    </span>
                    <span className="shrink-0 text-xs text-accents-4 font-mono">{item.time}</span>
                  </motion.div>
                ))}
                {events.length > 5 && (
                  <button
                    onClick={() => setShowAllActivity(v => !v)}
                    className="flex w-full items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-accents-5 transition-colors hover:text-foreground hover:bg-accents-1/50"
                  >
                    {showAllActivity ? (
                      <>Show less <ChevronDown className="h-3.5 w-3.5 rotate-180" /></>
                    ) : (
                      <>Show {events.length - 5} more <ChevronDown className="h-3.5 w-3.5" /></>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </motion.section>

        <SectionDivider label="work" />

        {/* 10 · FEATURED WORK */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <SectionHeading number="10" title="Featured Work" />
            <Link
              to="/projects"
              className="group flex items-center text-sm font-medium text-accents-5 transition-colors hover:text-foreground mb-8"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {mostStarred && !loading && <MostStarredCard repo={mostStarred} />}

          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 rounded-xl border border-accents-2 skeleton-shimmer" />
              ))
            ) : featuredRepos.length > 0 ? (
              featuredRepos.map((repo, idx) => {
                const isNew = new Date(repo.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    key={repo.id}
                    className="group relative h-full spotlight-card gradient-border"
                  >
                    <Link to={`/project/${repo.name}`} className="absolute inset-0 z-20 rounded-xl">
                      <span className="sr-only">View {repo.name}</span>
                    </Link>
                    <div className="flex h-full flex-col justify-between rounded-xl border border-accents-2 bg-background p-6 transition-all hover:border-accents-4 hover:shadow-sm card-top-border scale-on-hover">
                      <div className="pointer-events-none relative z-10">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative overflow-hidden rounded-lg border border-accents-2 bg-background p-1.5">
                              <RepoLogo name={repo.name} className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold tracking-tight">{repo.name}</h3>
                          </div>
                          {isNew && (
                            <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-400 uppercase tracking-wide">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mb-4 text-sm text-accents-5 line-clamp-2 leading-relaxed">
                          {repo.description || 'No description provided.'}
                        </p>
                      </div>
                      <div className="pointer-events-none relative z-10 flex items-center gap-4 mt-auto border-t border-accents-2 pt-3 text-xs text-accents-5">
                        {repo.language && (
                          <span className="flex items-center gap-1.5 font-medium">
                            <span className="h-2 w-2 rounded-full" style={{
                              backgroundColor: getLangColor(repo.language),
                            }} />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stargazers_count}</span>
                        <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{repo.forks_count}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center border border-dashed border-accents-2 rounded-xl text-accents-5">
                <Github className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">No repositories found.</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* CTA BAND */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20"
        >
          <div className="relative overflow-hidden rounded-2xl border border-accents-2 bg-background p-10 text-center noise-overlay">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-10"
              style={{ background: 'radial-gradient(ellipse at 50% 100%, #818cf8 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <h2 className="mb-3 text-2xl font-bold tracking-tight">
                Let's build something{' '}
                <span className="text-gradient-animated">together.</span>
              </h2>
              <p className="mb-6 text-sm text-accents-5 max-w-md mx-auto">
                I'm always up for interesting projects, collaborations, or just a good conversation about code and ideas.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/contacts" className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-[1.02] deploy-btn">
                  Get in Touch
                </Link>
                <Link to="/projects" className="inline-flex h-11 items-center justify-center rounded-full border border-accents-2 px-8 text-sm font-medium text-foreground transition-all hover:bg-accents-1">
                  Browse Projects
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* AVAILABILITY BADGE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accents-2 bg-background px-4 py-2 text-xs font-medium text-accents-5 transition-colors hover:bg-accents-1">
            <span className="flex h-2 w-2 rounded-full bg-green-500 status-dot-available" />
            Available for new opportunities
            <span className="text-accents-4">·</span>
            <Link to="/contacts" className="text-foreground underline underline-offset-2 hover:no-underline">
              reach out
            </Link>
          </div>
        </motion.div>

      </div>
    </>
  );
}
