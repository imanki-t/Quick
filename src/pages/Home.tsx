import React, { useEffect, useRef, useState } from 'react';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRepos, Repo } from '../services/github';
import { motion, useInView } from 'motion/react';
import { RepoLogo } from '../components/RepoLogo';
import { useCountUp } from '../hooks/useCountUp';
import { Tooltip } from '../components/Tooltip';
import { useToast } from '../components/ToastProvider';

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
function StatCard({
  value,
  label,
  suffix = '',
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(value, 1600, 0, inView);

  return (
    <div
      ref={ref}
      className="group flex flex-col gap-1 rounded-xl border border-accents-2 bg-background p-5 card-top-border spotlight-card transition-all hover:border-accents-4 scale-on-hover"
    >
      <span className="text-2xl font-bold tracking-tight tabular-nums">
        {count}
        {suffix}
      </span>
      <span className="text-xs text-accents-5">{label}</span>
    </div>
  );
}

/* ─── Skill item ─── */
const SKILLS = [
  { name: 'TypeScript', icon: <Code2 className="h-4 w-4" />, color: '#3178c6' },
  { name: 'React', icon: <Layout className="h-4 w-4" />, color: '#61dafb' },
  { name: 'Node.js', icon: <Server className="h-4 w-4" />, color: '#68a063' },
  { name: 'Next.js', icon: <Globe className="h-4 w-4" />, color: '#888' },
  { name: 'PostgreSQL', icon: <Database className="h-4 w-4" />, color: '#336791' },
  { name: 'GraphQL', icon: <GitBranch className="h-4 w-4" />, color: '#e535ab' },
  { name: 'Docker', icon: <Cpu className="h-4 w-4" />, color: '#2496ed' },
  { name: 'Linux', icon: <Terminal className="h-4 w-4" />, color: '#ffcc00' },
  { name: 'Vite', icon: <Zap className="h-4 w-4" />, color: '#bd34fe' },
  { name: 'Tailwind', icon: <Layers className="h-4 w-4" />, color: '#38bdf8' },
  { name: 'npm', icon: <Package className="h-4 w-4" />, color: '#cc3534' },
  { name: 'Rust', icon: <Activity className="h-4 w-4" />, color: '#dea584' },
];

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
  },
  {
    period: 'Apr 2024 – Oct 2024',
    role: 'Full Stack Tinkerer',
    tags: ['React', 'Node.js', 'APIs'],
    description:
      'Started building full-stack applications from scratch — React frontends, Express backends, integrating third-party APIs. Shipped my first few tools that actual people started using.',
    icon: <Code2 className="h-4 w-4" />,
    color: 'text-blue-400',
  },
  {
    period: 'Jan 2024 – Apr 2024',
    role: 'Frontend Developer (Self-taught)',
    tags: ['TypeScript', 'Tailwind', 'Vite'],
    description:
      'Went from vanilla JS to TypeScript and modern tooling. Fell in love with Tailwind CSS and component-based architecture. Built increasingly complex UIs and learned to think in systems.',
    icon: <Layout className="h-4 w-4" />,
    color: 'text-cyan-400',
  },
  {
    period: 'Aug 2023 – Jan 2024',
    role: 'The Beginning — Hello, World!',
    tags: ['HTML', 'CSS', 'JavaScript'],
    description:
      'Started coding with zero experience — just curiosity and YouTube tutorials. Wrote my first lines of HTML, struggled with CSS centering, and had my first "it works!" moment. That feeling never gets old.',
    icon: <BookOpen className="h-4 w-4" />,
    color: 'text-green-400',
  },
];

/* ─── Recent activity items ─── */
const ACTIVITY = [
  { type: 'commit', message: 'feat: add RGB gradient hero section', time: '2h ago', repo: 'portfolio' },
  { type: 'star', message: 'Starred vercel/next.js', time: '5h ago', repo: 'next.js' },
  { type: 'commit', message: 'fix: resolve mobile nav overflow issue', time: '1d ago', repo: 'portfolio' },
  { type: 'open', message: 'Opened issue: Improve README docs', time: '2d ago', repo: 'qw-tools' },
  { type: 'commit', message: 'chore: update dependencies to latest', time: '3d ago', repo: 'portfolio' },
];

const activityDot: Record<string, string> = {
  commit: 'bg-green-500',
  star: 'bg-yellow-400',
  open: 'bg-blue-400',
};

/* ─── Contribution heatmap (fake but realistic) ─── */
function ContributionHeatmap() {
  const weeks = 26;
  const days = 7;
  const cells = Array.from({ length: weeks * days }, (_, i) => {
    const seed = (i * 31 + 17) % 100;
    const level = seed < 40 ? 0 : seed < 60 ? 1 : seed < 80 ? 2 : seed < 92 ? 3 : 4;
    return level;
  });

  const bgMap = [
    'bg-accents-2',
    'bg-green-900/60 dark:bg-green-900',
    'bg-green-700/70 dark:bg-green-700',
    'bg-green-500/80 dark:bg-green-500',
    'bg-green-400 dark:bg-green-400',
  ];

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${weeks}, 12px)`,
          gridTemplateRows: `repeat(${days}, 12px)`,
          gridAutoFlow: 'column',
        }}
      >
        {cells.map((level, i) => (
          <Tooltip
            key={i}
            content={`${level === 0 ? 'No' : level} contribution${level !== 1 ? 's' : ''}`}
            side="top"
            delay={0}
          >
            <div
              className={`heat-cell ${bgMap[level]} opacity-${level === 0 ? '40' : '100'}`}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

/* ─── BackToTop button ─── */
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-accents-2 bg-background/90 text-accents-5 shadow-lg backdrop-blur-md transition-all hover:border-accents-5 hover:text-foreground hover:shadow-xl animate-fade-in-up"
      title="Back to top"
    >
      <ChevronUp className="h-4 w-4" />
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

/* ─── Announcement banner ─── */
function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative border-b border-accents-2 bg-accents-1/80 py-2 px-4 text-center text-xs font-medium text-accents-5 backdrop-blur-sm">
      <span className="mr-2">🚀</span>
      Currently open to freelance projects and collaboration —{' '}
      <Link to="/contacts" className="text-foreground underline underline-offset-2 hover:no-underline">
        get in touch
      </Link>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-accents-4 hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN HOME COMPONENT
   ═══════════════════════════════════════════════════ */
export function Home() {
  const [featuredRepos, setFeaturedRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const typedText = useTypingEffect([
    'open-source tools.',
    'full-stack apps.',
    'cool side projects.',
    'useful developer tools.',
    'things on the web.',
  ]);

  useSpotlight(gridRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const repos = await getRepos();
        const topRepos = repos
          .filter((r) => !r.fork)
          .sort((a, b) => b.stargazers_count + b.size - (a.stargazers_count + a.size))
          .slice(0, 4);
        setFeaturedRepos(topRepos);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <>
      <AnnouncementBanner />
      <BackToTop />

      <div className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        {/* ──────────────────────────────────────────
            HERO — left-aligned, personal, RGB effect
           ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 pt-8 relative"
        >
          {/* Glow blob behind hero text */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-12 h-72 w-72 rounded-full blur-3xl opacity-20"
            style={{
              background:
                'radial-gradient(circle, #818cf8 0%, #38bdf8 50%, transparent 70%)',
            }}
          />

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-accents-2 bg-background px-3 py-1 text-xs font-medium text-accents-5 transition-colors hover:bg-accents-1"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 status-dot-available" />
            Available for new opportunities
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-5 text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl leading-[1.05]"
          >
            Hey, I'm{' '}
            <span className="text-gradient-animated">imanki-t</span>.
            <br />
            I build{' '}
            <span className="relative">
              <span className="text-foreground">{typedText}</span>
              <span className="cursor-blink" />
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 max-w-[38rem] text-lg text-accents-5 leading-relaxed"
          >
            Self-taught developer from 2023 — started with zero and shipped real things.
            I love vibe coding, open source, and turning ideas into working software.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
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
        </motion.section>

        <hr className="my-16 border-accents-2/50" />

        {/* ──────────────────────────────────────────
            STATS — animated count-up
           ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight">By the numbers</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard value={18} label="Months coding" suffix="+" />
            <StatCard value={15} label="Projects shipped" suffix="+" />
            <StatCard value={200} label="GitHub commits" suffix="+" />
            <StatCard value={4} label="Languages used" />
          </div>
        </motion.section>

        <hr className="my-16 border-accents-2/50" />

        {/* ──────────────────────────────────────────
            ABOUT / PHILOSOPHY — two-column Vercel grid
           ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
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
                iterate fast, ship often. Minimalism wins over complexity. Every project
                teaches me something new, and that's the whole point.
              </p>
            </div>
            <div className="grid grid-cols-2">
              <div className="group flex flex-col justify-center p-7 border-b border-r border-accents-2 bg-background transition-colors hover:bg-accents-1/50 card-top-border">
                <h3 className="mb-1 text-3xl font-bold tracking-tight tabular-nums">18</h3>
                <p className="text-xs text-accents-5">months of coding</p>
              </div>
              <div className="group flex flex-col justify-center p-7 border-b border-accents-2 bg-background transition-colors hover:bg-accents-1/50 card-top-border">
                <h3 className="mb-1 text-3xl font-bold tracking-tight">∞</h3>
                <p className="text-xs text-accents-5">things left to learn</p>
              </div>
              <div className="group col-span-2 flex flex-col justify-center p-7 bg-background transition-colors hover:bg-accents-1/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-bold tracking-tight">Currently exploring</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[11px] font-medium text-purple-400">
                    🦀 Rust
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-medium text-blue-400">
                    ⚡ WASM
                  </span>
                </div>
                <p className="text-xs text-accents-5">Performance-first systems programming.</p>
              </div>
            </div>
          </div>
        </motion.section>

        <hr className="my-16 border-accents-2/50" />

        {/* ──────────────────────────────────────────
            SKILLS — marquee ticker
           ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Core Technologies</h2>
            <span className="text-xs text-accents-4 font-mono">{SKILLS.length} skills</span>
          </div>

          {/* Grid view */}
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
                <Tooltip content={skill.name} side="top" delay={200}>
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-accents-2 bg-background transition-all group-hover:scale-110 group-hover:border-accents-4"
                    style={{ color: skill.color }}
                  >
                    {skill.icon}
                  </div>
                </Tooltip>
                <span className="text-xs font-medium text-accents-5 group-hover:text-foreground transition-colors">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Marquee ticker below grid */}
          <div className="mt-6 overflow-hidden border border-accents-2 rounded-xl bg-accents-1/30 py-3">
            <div className="marquee-track">
              {[...SKILLS, ...SKILLS].map((skill, i) => (
                <span
                  key={i}
                  className="mx-5 inline-flex items-center gap-2 text-xs font-medium text-accents-5 whitespace-nowrap"
                >
                  <span style={{ color: skill.color }}>{skill.icon}</span>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        <hr className="my-16 border-accents-2/50" />

        {/* ──────────────────────────────────────────
            JOURNEY — proper 2023-present timeline
           ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="mb-8">
            <h2 className="text-xl font-semibold tracking-tight">My Journey</h2>
            <p className="mt-1 text-sm text-accents-5">
              From zero lines of code to shipping real things.
            </p>
          </div>

          <div className="relative">
            {/* Vertical connector line */}
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
                  {/* Icon dot */}
                  <div
                    className={`relative z-10 mt-1 hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accents-2 bg-background transition-all group-hover:border-accents-5 ${item.color}`}
                  >
                    {item.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-xl border border-accents-2 bg-background p-5 transition-all hover:border-accents-4 hover:bg-accents-1/50 card-top-border">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono text-accents-4">{item.period}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-accents-2 bg-accents-1 px-2 py-0.5 text-[10px] font-medium text-accents-5"
                          >
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

        <hr className="my-16 border-accents-2/50" />

        {/* ──────────────────────────────────────────
            CONTRIBUTION HEATMAP
           ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Contribution Activity</h2>
            <span className="flex items-center gap-1.5 text-xs text-accents-5">
              <span className="h-2 w-2 rounded-sm bg-green-500" />
              200+ contributions in the last 6 months
            </span>
          </div>
          <div className="rounded-xl border border-accents-2 bg-background p-5 overflow-hidden">
            <ContributionHeatmap />
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-accents-4">
              <span>Less</span>
              {['bg-accents-2', 'bg-green-900/60', 'bg-green-700/70', 'bg-green-500/80', 'bg-green-400'].map(
                (c, i) => (
                  <span key={i} className={`heat-cell ${c}`} />
                )
              )}
              <span>More</span>
            </div>
          </div>
        </motion.section>

        <hr className="my-16 border-accents-2/50" />

        {/* ──────────────────────────────────────────
            RECENT ACTIVITY FEED
           ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
            <a
              href="https://github.com/imanki-t"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center text-xs font-medium text-accents-5 transition-colors hover:text-foreground"
            >
              View on GitHub
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          <div className="rounded-xl border border-accents-2 bg-background overflow-hidden divide-y divide-accents-2">
            {ACTIVITY.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.07 }}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accents-1/50 group"
              >
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${activityDot[item.type] || 'bg-accents-4'}`}
                />
                <span className="flex-1 text-sm text-foreground truncate">{item.message}</span>
                <span className="hidden sm:block shrink-0 rounded-full border border-accents-2 bg-accents-1 px-2.5 py-0.5 text-[10px] font-mono text-accents-5">
                  {item.repo}
                </span>
                <span className="shrink-0 text-xs text-accents-4 font-mono">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <hr className="my-16 border-accents-2/50" />

        {/* ──────────────────────────────────────────
            FEATURED WORK
           ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Featured Work</h2>
            <Link
              to="/projects"
              className="group flex items-center text-sm font-medium text-accents-5 transition-colors hover:text-foreground"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-xl border border-accents-2 skeleton-shimmer"
                />
              ))
            ) : featuredRepos.length > 0 ? (
              featuredRepos.map((repo, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  key={repo.id}
                  className="group relative h-full spotlight-card gradient-border"
                >
                  <Link
                    to={`/project/${repo.name}`}
                    className="absolute inset-0 z-20 rounded-xl"
                  >
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
                      </div>
                      <p className="mb-4 text-sm text-accents-5 line-clamp-2 leading-relaxed">
                        {repo.description || 'No description provided.'}
                      </p>
                    </div>
                    <div className="pointer-events-none relative z-10 flex items-center gap-4 mt-auto border-t border-accents-2 pt-3 text-xs text-accents-5">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                repo.language === 'TypeScript'
                                  ? '#3178c6'
                                  : repo.language === 'JavaScript'
                                  ? '#f1e05a'
                                  : repo.language === 'Rust'
                                  ? '#dea584'
                                  : '#888',
                            }}
                          />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {repo.forks_count}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center border border-dashed border-accents-2 rounded-xl text-accents-5">
                <Github className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">No repositories found.</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* ──────────────────────────────────────────
            CALL TO ACTION BAND
           ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20"
        >
          <div className="relative overflow-hidden rounded-2xl border border-accents-2 bg-background p-10 text-center noise-overlay">
            {/* Subtle background glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 100%, #818cf8 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10">
              <h2 className="mb-3 text-2xl font-bold tracking-tight">
                Let's build something{' '}
                <span className="text-gradient-animated">together.</span>
              </h2>
              <p className="mb-6 text-sm text-accents-5 max-w-md mx-auto">
                I'm always up for interesting projects, collaborations, or just a good
                conversation about code and ideas.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/contacts"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-[1.02] deploy-btn"
                >
                  Get in Touch
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-accents-2 px-8 text-sm font-medium text-foreground transition-all hover:bg-accents-1"
                >
                  Browse Projects
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
