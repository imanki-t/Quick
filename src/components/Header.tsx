import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Menu } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-accents-2 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="group flex items-center gap-2 text-xl font-semibold tracking-tight transition-all hover:opacity-80">
            <div className="relative flex items-center justify-center">
              <Logo className="h-6 w-6" />
            </div>
            <span className="font-bold tracking-tight">Quick Witty</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-accents-5 ml-4">
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link to="/projects" className="transition-colors hover:text-foreground">
              Projects
            </Link>
            <Link to="/contacts" className="transition-colors hover:text-foreground">
              Contacts
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center justify-center rounded-full border border-accents-2 bg-transparent px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accents-1">
            Ask AI
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-accents-2 bg-transparent text-foreground transition-colors hover:bg-accents-1">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
