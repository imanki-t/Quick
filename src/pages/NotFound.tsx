import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ArrowLeft, Terminal } from 'lucide-react';

/* ─── Glitch text effect ─── */
function GlitchText({ children }: { children: string }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const trigger = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    };
    trigger();
    const interval = setInterval(trigger, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="relative inline-block font-mono font-black"
      style={glitching ? {
        textShadow: '-3px 0 #e879f9, 3px 0 #38bdf8',
        animation: 'none',
        transform: 'skewX(-1deg)',
      } : {
        textShadow: '-1px 0 rgba(232,121,249,0.3), 1px 0 rgba(56,189,248,0.3)',
      }}
    >
      {children}
    </span>
  );
}

/* ─── Terminal output lines ─── */
const TERMINAL_LINES = [
  { delay: 0,   text: '$ cd /page/requested',           color: 'text-accents-5' },
  { delay: 400, text: 'bash: cd: /page/requested: No such file or directory', color: 'text-red-400' },
  { delay: 900, text: '$ ls /',                          color: 'text-accents-5' },
  { delay: 1300,text: 'home/  projects/  contacts/  now/', color: 'text-green-400' },
  { delay: 1800,text: '$ echo "maybe try one of those?"', color: 'text-accents-5' },
  { delay: 2200,text: 'maybe try one of those?',          color: 'text-blue-400' },
];

function TerminalBlock() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => setVisible(i + 1), line.delay);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-md rounded-xl border border-accents-2 bg-accents-1/50 backdrop-blur-sm overflow-hidden"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-accents-2 px-4 py-2.5 bg-accents-1/60">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 font-mono text-[10px] text-accents-4">not_found.sh</span>
      </div>

      {/* Terminal lines */}
      <div className="p-4 space-y-1 min-h-[140px]">
        {TERMINAL_LINES.slice(0, visible).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-mono text-xs leading-relaxed ${line.color}`}
          >
            {line.text}
            {i === visible - 1 && visible < TERMINAL_LINES.length && (
              <span className="cursor-blink ml-0.5" />
            )}
          </motion.p>
        ))}
        {visible >= TERMINAL_LINES.length && (
          <p className="font-mono text-xs text-accents-5">
            $ <span className="cursor-blink" />
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Floating particles ─── */
function Particles() {
  const count = 12;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 8.5) % 100;
        const dur = 4 + (i % 5);
        const del = (i * 0.4) % 3;
        const size = 2 + (i % 4);
        return (
          <div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              left: `${x}%`,
              bottom: '-10px',
              width: `${size}px`,
              height: `${size}px`,
              background: i % 3 === 0 ? '#818cf8' : i % 3 === 1 ? '#38bdf8' : '#e879f9',
              animation: `floatUp ${dur}s ease-in ${del}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── Main 404 page ─── */
export function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-16 overflow-hidden">
      <Particles />

      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full blur-3xl opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #818cf8 0%, #38bdf8 50%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center gap-6 relative z-10 max-w-lg w-full"
      >
        {/* 404 giant number */}
        <div className="relative select-none">
          <span
            className="text-[120px] sm:text-[160px] font-black leading-none text-accents-2/30"
            style={{ letterSpacing: '-0.05em' }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <GlitchText>404</GlitchText>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
          <span className="font-mono text-xs text-red-400">ROUTE_NOT_FOUND</span>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Page doesn't exist</h1>
          <p className="mt-2 text-sm text-accents-5 leading-relaxed">
            The route you're looking for has either been moved, deleted, or never existed.
            Sounds like a 404 mystery.
          </p>
        </div>

        {/* Terminal block */}
        <TerminalBlock />

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="group deploy-btn inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-[1.02]"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-accents-2 px-6 text-sm font-medium text-accents-5 transition-all hover:text-foreground hover:border-accents-4 hover:bg-accents-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Navigation grid */}
        <div className="grid grid-cols-3 gap-2 w-full mt-2">
          {[
            { to: '/', label: 'Home' },
            { to: '/projects', label: 'Projects' },
            { to: '/contacts', label: 'Contacts' },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center justify-center rounded-xl border border-accents-2 bg-background px-3 py-2.5 text-xs font-medium text-accents-5 transition-all hover:border-accents-4 hover:text-foreground hover:bg-accents-1 card-top-border"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
