import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Home, FolderOpen, Mail, Github, ArrowRight, X } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: Command[] = [
    {
      id: 'home',
      label: 'Go to Home',
      description: 'Navigate to the home page',
      icon: <Home className="h-4 w-4" />,
      action: () => { navigate('/'); onClose(); },
      shortcut: 'H',
    },
    {
      id: 'projects',
      label: 'View Projects',
      description: 'Browse all open-source work',
      icon: <FolderOpen className="h-4 w-4" />,
      action: () => { navigate('/projects'); onClose(); },
      shortcut: 'P',
    },
    {
      id: 'contacts',
      label: 'Contact Me',
      description: 'Find ways to get in touch',
      icon: <Mail className="h-4 w-4" />,
      action: () => { navigate('/contacts'); onClose(); },
      shortcut: 'C',
    },
    {
      id: 'github',
      label: 'Open GitHub Profile',
      description: '@imanki-t on GitHub',
      icon: <Github className="h-4 w-4" />,
      action: () => { window.open('https://github.com/imanki-t', '_blank'); onClose(); },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center pt-[20vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-lg mx-4 rounded-2xl border border-accents-2 bg-background shadow-2xl shadow-black/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-accents-2 px-4 py-3">
          <Search className="h-4 w-4 text-accents-5 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-accents-4 outline-none"
          />
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-md border border-accents-2 text-accents-5 hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Results */}
        <div className="py-2">
          {filtered.length > 0 ? (
            <>
              <div className="px-3 pb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-accents-4">
                  Navigation
                </span>
              </div>
              {filtered.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accents-1 group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accents-2 bg-background text-accents-5 group-hover:text-foreground group-hover:border-accents-5 transition-all">
                    {cmd.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{cmd.label}</p>
                    {cmd.description && (
                      <p className="text-xs text-accents-5 truncate">{cmd.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {cmd.shortcut && (
                      <kbd className="rounded border border-accents-2 bg-accents-1 px-1.5 py-0.5 text-[10px] font-mono text-accents-5">
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className="h-3.5 w-3.5 text-accents-5" />
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div className="py-8 text-center text-sm text-accents-5">
              No results for "<span className="text-foreground">{query}</span>"
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-accents-2 px-4 py-2.5 flex items-center gap-4 text-[11px] text-accents-4">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-accents-2 bg-accents-1 px-1 py-0.5 font-mono">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-accents-2 bg-accents-1 px-1 py-0.5 font-mono">↵</kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-accents-2 bg-accents-1 px-1 py-0.5 font-mono">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
