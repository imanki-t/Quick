import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Search,
  Star,
  GitFork,
  ArrowUpRight,
  ArrowLeft,
  SlidersHorizontal,
  X,
  Github,
  Code2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRepos, Repo } from '../services/github';
import { motion, AnimatePresence } from 'motion/react';
import { RepoLogo } from '../components/RepoLogo';
import { Tooltip } from '../components/Tooltip';
import { useToast } from '../components/ToastProvider';

/* ─── Language color map ─── */
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Rust: '#dea584',
  Go: '#00ADD8',
  Python: '#3572A5',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  Dockerfile: '#384d54',
};

function getLangColor(lang: string | null | undefined) {
  if (!lang) return '#888';
  return LANG_COLORS[lang] || '#888';
}

/* ─── Stat card ─── */
function StatPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-xl border border-accents-2 bg-background px-5 py-4 transition-colors hover:bg-accents-1/50 card-top-border">
      <span className="text-xl font-bold tabular-nums">{value}</span>
      <span className="text-xs text-accents-5">{label}</span>
    </div>
  );
}

/* ─── Sort options ─── */
type SortKey = 'updated' | 'stars' | 'forks' | 'name';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'updated', label: 'Recently updated' },
  { key: 'stars', label: 'Most starred' },
  { key: 'forks', label: 'Most forked' },
  { key: 'name', label: 'Name A–Z' },
];

export function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('updated');
  const [showSort, setShowSort] = useState(false);
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  /* keyboard shortcut: press / to focus search */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    async function fetchAll() {
      try {
        const repos = await getRepos();
        setProjects(repos.filter((r) => !r.fork));
      } catch {
        toast('Failed to load repositories', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const languages = useMemo(() => {
    const langs = new Set<string>();
    projects.forEach((p) => {
      if (p.language) langs.add(p.language);
    });
    return ['All', ...Array.from(langs).sort()];
  }, [projects]);

  const filteredAndSorted = useMemo(() => {
    const filtered = projects.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q));
      const matchLang = selectedLanguage === 'All' || p.language === selectedLanguage;
      return matchSearch && matchLang;
    });

    return [...filtered].sort((a, b) => {
      if (sortKey === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortKey === 'forks') return b.forks_count - a.forks_count;
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [projects, searchQuery, selectedLanguage, sortKey]);

  const totalStars = projects.reduce((acc, p) => acc + p.stargazers_count, 0);
  const totalForks = projects.reduce((acc, p) => acc + p.forks_count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl px-6 py-12 md:py-20"
    >
      {/* ── Page header ── */}
      <div className="mb-10 flex flex-col gap-4">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Projects
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="max-w-[42rem] text-base text-accents-5"
        >
          Open-source experiments, utilities, and full-stack apps — built for fun and to
          solve real problems.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-[42rem] border-l-2 border-accents-3 pl-4 text-sm text-accents-5 space-y-0.5"
        >
          <p>Everything here is open source and available on GitHub.</p>
          <p>Feel free to explore, star, fork, or contribute.</p>
        </motion.div>
      </div>

      {/* ── Stats ── */}
      {!loading && projects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <StatPill label="Repositories" value={projects.length} />
          <StatPill label="Total Stars" value={totalStars} />
          <StatPill label="Total Forks" value={totalForks} />
          <StatPill label="Languages" value={languages.length - 1} />
        </motion.div>
      )}

      <hr className="my-8 border-accents-2" />

      {/* ── Search + Filter — properly aligned ── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative w-full sm:max-w-xs group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-3.5 w-3.5 text-accents-4 transition-colors group-focus-within:text-foreground" />
          </div>
          <input
            ref={searchRef}
            type="text"
            className="block w-full rounded-xl border border-accents-2 bg-background py-2 pl-9 pr-10 text-sm placeholder:text-accents-4 focus:border-accents-5 focus:outline-none focus:ring-1 focus:ring-accents-5 transition-all hover:border-accents-4"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Keyboard shortcut hint */}
          {!searchQuery && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <kbd className="rounded border border-accents-2 bg-accents-1 px-1.5 py-0.5 text-[10px] font-mono text-accents-4">
                /
              </kbd>
            </div>
          )}
          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-accents-4 hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right side: language filters + sort */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {/* Funnel icon — properly aligned */}
          <div className="flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5 text-accents-4 shrink-0" />
          </div>

          {/* Language pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedLanguage === lang
                    ? 'bg-foreground text-background shadow-sm'
                    : 'bg-background text-accents-5 hover:bg-accents-1 hover:text-foreground border border-accents-2'
                }`}
              >
                {lang !== 'All' && (
                  <span
                    className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: getLangColor(lang) }}
                  />
                )}
                {lang}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSort((v) => !v)}
              className={`whitespace-nowrap rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                showSort
                  ? 'border-accents-5 bg-accents-1 text-foreground'
                  : 'border-accents-2 bg-background text-accents-5 hover:bg-accents-1 hover:text-foreground'
              }`}
            >
              Sort
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 z-30 w-44 rounded-xl border border-accents-2 bg-background py-1 shadow-xl shadow-black/10"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSortKey(opt.key);
                        setShowSort(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-accents-1 ${
                        sortKey === opt.key
                          ? 'text-foreground font-semibold'
                          : 'text-accents-5'
                      }`}
                    >
                      {sortKey === opt.key && (
                        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                      )}
                      {sortKey !== opt.key && <span className="h-1.5 w-1.5" />}
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Active filters summary ── */}
      {(searchQuery || selectedLanguage !== 'All') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 flex flex-wrap items-center gap-2"
        >
          <span className="text-xs text-accents-4">Active filters:</span>
          {searchQuery && (
            <span className="flex items-center gap-1 rounded-full border border-accents-2 bg-accents-1 px-2.5 py-1 text-xs font-medium">
              "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="ml-0.5 text-accents-4 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedLanguage !== 'All' && (
            <span className="flex items-center gap-1.5 rounded-full border border-accents-2 bg-accents-1 px-2.5 py-1 text-xs font-medium">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: getLangColor(selectedLanguage) }}
              />
              {selectedLanguage}
              <button onClick={() => setSelectedLanguage('All')} className="ml-0.5 text-accents-4 hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <span className="text-xs text-accents-4 ml-1">
            — {filteredAndSorted.length} result{filteredAndSorted.length !== 1 ? 's' : ''}
          </span>
        </motion.div>
      )}

      {/* ── Project grid ── */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl border border-accents-2 skeleton-shimmer"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredAndSorted.map((project, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  key={project.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-accents-2 bg-background transition-all hover:border-accents-4 hover:shadow-sm spotlight-card gradient-border scale-on-hover"
                >
                  <Link
                    to={`/project/${project.name}`}
                    className="absolute inset-0 z-20 rounded-xl"
                  >
                    <span className="sr-only">View {project.name}</span>
                  </Link>

                  {/* Card body */}
                  <div className="p-5 relative z-10 pointer-events-none">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="relative overflow-hidden rounded-lg border border-accents-2 bg-background p-1.5">
                        <RepoLogo name={project.name} className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold tracking-tight text-sm leading-tight line-clamp-1">
                        {project.name}
                      </h3>
                    </div>
                    <p className="text-xs text-accents-5 line-clamp-3 leading-relaxed">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="mt-auto border-t border-accents-2 px-5 py-3 relative z-10 pointer-events-none">
                    <div className="flex items-center justify-between text-xs font-medium text-accents-5">
                      <span className="flex items-center gap-1.5">
                        {project.language && (
                          <>
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: getLangColor(project.language) }}
                            />
                            {project.language}
                          </>
                        )}
                      </span>
                      <div className="flex items-center gap-3">
                        <Tooltip content="Stars" side="top" delay={400}>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {project.stargazers_count}
                          </span>
                        </Tooltip>
                        <Tooltip content="Forks" side="top" delay={400}>
                          <span className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            {project.forks_count}
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  {/* Hover actions — properly on top */}
                  <div className="absolute right-3 top-3 z-30 flex gap-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                    {project.homepage && (
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-background border border-accents-2 text-accents-5 transition-all hover:text-foreground hover:border-accents-4 shadow-sm"
                        title="Live Demo"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <a
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-background border border-accents-2 text-accents-5 transition-all hover:text-foreground hover:border-accents-4 shadow-sm"
                      title="Source Code"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Empty state ── */}
          {filteredAndSorted.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center py-24 text-center rounded-xl border border-dashed border-accents-2"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-accents-2 bg-accents-1/50 text-accents-5">
                <Code2 className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold mb-1">No projects found</h3>
              <p className="text-sm text-accents-5 mb-4">
                Try adjusting your search or filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLanguage('All');
                }}
                className="text-xs text-foreground underline underline-offset-2 hover:no-underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </>
      )}

      <hr className="my-16 border-accents-2" />

      <div className="flex justify-center">
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-md border border-accents-2 bg-background px-8 text-sm font-medium text-foreground transition-colors hover:bg-accents-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
