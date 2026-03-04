import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-accents-2 bg-background py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5" />
            <p className="text-sm font-semibold text-foreground">imanki-t</p>
          </div>
          <p className="text-sm text-accents-5">
            Building open-source tools and digital experiences.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-accents-5">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/projects" className="transition-colors hover:text-foreground">
            Projects
          </Link>
          <Link to="/contacts" className="transition-colors hover:text-foreground">
            Contacts
          </Link>
          <a
            href="https://github.com/imanki-t"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
