import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Search, Command } from 'lucide-react';

interface HeaderProps {
  onCommandOpen?: () => void;
}

export function Header({ onCommandOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'Projects' },
    { to: '/contacts', label: 'Contacts' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-accents-2 bg-background/95 backdrop-blur-xl shadow-[0_1px_0_0_var(--accents-2)]'
          : 'border-transparent bg-background/70 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="group flex items-center gap-2 text-sm font-bold tracking-tight transition-opacity hover:opacity-75"
          >
            <Logo className="h-5 w-5" />
            <span>imanki-t</span>
          </Link>

          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
                      isActive
                        ? 'text-foreground font-medium'
                        : 'text-accents-5 hover:text-foreground'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 rounded-md bg-accents-1 border border-accents-2" />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Search command */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCommandOpen}
            className="group hidden sm:flex items-center gap-2 rounded-lg border border-accents-2 bg-accents-1/50 px-3 py-1.5 text-xs font-medium text-accents-5 transition-all hover:border-accents-4 hover:bg-accents-1 hover:text-foreground"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs">Search...</span>
            <span className="ml-1 flex items-center gap-0.5 rounded border border-accents-2 bg-background px-1.5 py-0.5 text-[10px] font-mono text-accents-4 group-hover:border-accents-4">
              <Command className="h-2.5 w-2.5" />K
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
