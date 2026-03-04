import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, BookOpen, Code2, Music, Coffee, MapPin } from 'lucide-react';

/* ─── Last updated date — edit this whenever you update the page ─── */
const LAST_UPDATED = 'March 2026';

/* ─── Now data — update these whenever your situation changes ─── */
const NOW_DATA = {
  location: 'India',
  building: [
    {
      title: 'This portfolio',
      description: 'Constantly iterating on the design, adding new sections, and making it more personal. It\'s less a portfolio and more a living document at this point.',
      tag: 'active',
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
    },
    {
      title: 'CLI tooling in Rust',
      description: 'Learning Rust by building something real — a small developer utility for managing project scaffolding. Painful but rewarding.',
      tag: 'learning',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20',
    },
    {
      title: 'Open source contributions',
      description: 'Exploring codebases I use daily, finding good first issues, and getting my PRs merged into projects I actually care about.',
      tag: 'ongoing',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
  ],
  learning: [
    { topic: 'Rust ownership & borrowing', progress: 60 },
    { topic: 'WebAssembly fundamentals', progress: 30 },
    { topic: 'Systems-level thinking', progress: 45 },
    { topic: 'Open source workflow', progress: 75 },
  ],
  reading: [
    { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', status: 'reading' },
    { title: 'Rust Programming Language', author: 'Steve Klabnik', status: 'reading' },
    { title: 'You Don\'t Know JS', author: 'Kyle Simpson', status: 'done' },
  ],
  listening: 'lo-fi hip hop, ambient electronic, occasionally metal when debugging.',
  obsession: 'Making things that feel fast and simple from the outside but are thoughtfully engineered on the inside.',
};

/* ─── Progress bar ─── */
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-accents-2 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="h-full rounded-full"
        style={{ background: 'linear-gradient(90deg, #818cf8, #38bdf8)' }}
      />
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accents-2 bg-background text-accents-5">
          {icon}
        </div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

/* ─── Main Now page ─── */
export function Now() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl px-6 py-12 md:py-20"
    >
      {/* Header */}
      <div className="mb-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-accents-5 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>

        <div className="mt-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Now</h1>
            <p className="mt-2 text-sm text-accents-5">
              A snapshot of what I'm up to right now.{' '}
              <a
                href="https://nownownow.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:no-underline"
              >
                What's a now page?
              </a>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5 rounded-full border border-accents-2 bg-accents-1 px-3 py-1 text-xs font-medium text-accents-5">
              <Clock className="h-3 w-3" />
              Updated {LAST_UPDATED}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-accents-4">
              <MapPin className="h-3 w-3" />
              {NOW_DATA.location}
            </div>
          </div>
        </div>
      </div>

      {/* One-liner obsession */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mb-12 rounded-xl border border-accents-2 bg-accents-1/30 p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-accents-4 mb-2">Current obsession</p>
        <p className="text-base leading-relaxed text-foreground font-medium">
          "{NOW_DATA.obsession}"
        </p>
      </motion.div>

      <div className="space-y-12">
        {/* ── Building ── */}
        <Section icon={<Code2 className="h-4 w-4" />} title="What I'm building">
          <div className="space-y-3">
            {NOW_DATA.building.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-accents-2 bg-background p-4 transition-colors hover:bg-accents-1/50 card-top-border"
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <span className={`rounded-full border ${item.bg} px-2 py-0.5 text-[10px] font-medium ${item.color}`}>
                    {item.tag}
                  </span>
                </div>
                <p className="text-sm text-accents-5 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <hr className="border-accents-2/50" />

        {/* ── Learning ── */}
        <Section icon={<BookOpen className="h-4 w-4" />} title="What I'm learning">
          <div className="space-y-4 rounded-xl border border-accents-2 bg-background p-5">
            {NOW_DATA.learning.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{item.topic}</span>
                  <span className="font-mono text-xs text-accents-4">{item.progress}%</span>
                </div>
                <ProgressBar value={item.progress} />
              </motion.div>
            ))}
          </div>
        </Section>

        <hr className="border-accents-2/50" />

        {/* ── Reading ── */}
        <Section icon={<BookOpen className="h-4 w-4" />} title="What I'm reading">
          <div className="space-y-2">
            {NOW_DATA.reading.map((book, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between rounded-xl border border-accents-2 bg-background px-4 py-3 transition-colors hover:bg-accents-1/50"
              >
                <div>
                  <p className="text-sm font-medium">{book.title}</p>
                  <p className="text-xs text-accents-5">by {book.author}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                  book.status === 'reading'
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    : 'bg-green-500/10 border-green-500/20 text-green-400'
                }`}>
                  {book.status === 'reading' ? 'reading' : '✓ done'}
                </span>
              </motion.div>
            ))}
          </div>
        </Section>

        <hr className="border-accents-2/50" />

        {/* ── Listening & coffee ── */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Section icon={<Music className="h-4 w-4" />} title="Listening to">
            <div className="rounded-xl border border-accents-2 bg-background p-4">
              <p className="text-sm text-accents-5 leading-relaxed italic">"{NOW_DATA.listening}"</p>
            </div>
          </Section>
          <Section icon={<Coffee className="h-4 w-4" />} title="Fuel">
            <div className="rounded-xl border border-accents-2 bg-background p-4 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-accents-5">coffees today</span>
                <span className="font-mono text-sm font-bold">3+</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-accents-5">energy level</span>
                <span className="font-mono text-sm font-bold text-green-400">HIGH</span>
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 text-xs text-accents-4 text-center"
      >
        This page is inspired by{' '}
        <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="text-accents-5 hover:text-foreground underline underline-offset-2">
          nownownow.com
        </a>
        {' '}— a movement started by Derek Sivers.
      </motion.p>
    </motion.div>
  );
}
