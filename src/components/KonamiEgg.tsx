import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

/* ─── Konami sequence ─── */
const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'b','a',
];

/* ─── Matrix canvas rain ─── */
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const FONT_SIZE = 14;
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ01';
    const cols = Math.floor(canvas.width / FONT_SIZE);
    const drops = new Array(cols).fill(1).map(() => Math.random() * -50);

    // Use accent colors from the portfolio palette
    const colors = ['#818cf8', '#38bdf8', '#e879f9', '#34d399', '#a5b4fc'];

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px "Geist Mono", monospace`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6 + Math.random() * 0.4;
        ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE);
        ctx.globalAlpha = 1;
        if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.5;
      });
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.18 }} />;
}

/* ─── Typing text hook ─── */
function useTypewriter(text: string, speed = 40, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(start);
  }, [text, speed, delay]);
  return displayed;
}

/* ─── The easter egg card ─── */
function EggCard({ onClose }: { onClose: () => void }) {
  const line1 = useTypewriter('> KONAMI CODE DETECTED', 35, 200);
  const line2 = useTypewriter('> INITIALIZING DEV MODE...', 35, 1100);
  const line3 = useTypewriter('> ACCESS GRANTED', 35, 2000);

  const stats = [
    { label: 'caffeine_level', value: 'CRITICAL' },
    { label: 'bugs_created', value: '∞' },
    { label: 'bugs_fixed', value: '∞ - 1' },
    { label: 'npm_installs', value: 'too_many' },
    { label: 'stackoverflow_tabs', value: '47' },
    { label: 'vibe_coefficient', value: '0.99' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-md mx-4"
    >
      {/* Glow behind card */}
      <div
        className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #818cf8, #38bdf8, #e879f9)' }}
      />

      <div className="relative rounded-2xl border border-accents-2 bg-black/90 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-accents-2/50 px-4 py-3 bg-accents-1/20">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="font-mono text-xs text-accents-4">dev_mode.sh</span>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md text-accents-5 hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Terminal content */}
        <div className="p-6 font-mono text-sm space-y-1">
          <p className="text-green-400">{line1}<span className="cursor-blink" /></p>
          {line1.length > 0 && <p className="text-blue-400 mt-1">{line2}</p>}
          {line2.length > 0 && (
            <p className="text-purple-400 mt-1">{line3}</p>
          )}

          {line3.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 space-y-3"
            >
              {/* ASCII art / badge */}
              <div className="rounded-xl border border-accents-2/40 bg-white/5 p-4 text-center">
                <div className="text-2xl mb-2">🎮</div>
                <p className="text-xs font-semibold text-accents-8 uppercase tracking-[0.15em]">
                  Easter egg found
                </p>
                <p className="text-[10px] text-accents-5 mt-1">
                  you are now a certified power user
                </p>
              </div>

              {/* System stats */}
              <div className="space-y-1.5">
                <p className="text-[10px] text-accents-4 uppercase tracking-wider mb-2">// system stats</p>
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-accents-5 text-xs">{s.label}</span>
                    <span className="text-xs font-semibold text-gradient-animated">{s.value}</span>
                  </motion.div>
                ))}
              </div>

              {/* Dismiss */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                className="mt-3 w-full rounded-lg border border-accents-2/50 bg-white/5 px-4 py-2 text-xs font-medium text-accents-5 transition-all hover:bg-white/10 hover:text-foreground"
              >
                [esc] return to normal mode
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main KonamiEgg component ─── */
export function KonamiEgg() {
  const [active, setActive] = useState(false);
  const progress = useRef<string[]>([]);

  const close = useCallback(() => setActive(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (active) {
        if (e.key === 'Escape') close();
        return;
      }
      progress.current = [...progress.current, e.key].slice(-KONAMI.length);
      if (progress.current.join(',') === KONAMI.join(',')) {
        setActive(true);
        progress.current = [];
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, close]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}
        >
          {/* Matrix rain background */}
          <MatrixRain />

          {/* Card — stop propagation so clicking it doesn't close */}
          <div onClick={(e) => e.stopPropagation()}>
            <EggCard onClose={close} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
