import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Contacts } from './pages/Contacts';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { ScrollProgress } from './components/ScrollProgress';
import { CommandPalette } from './components/CommandPalette';
import { ToastProvider } from './components/ToastProvider';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-12 text-center">
    <span className="text-8xl font-black tracking-tighter text-accents-2">404</span>
    <h1 className="text-2xl font-bold">Page not found</h1>
    <p className="text-accents-5">This page doesn't exist or was moved.</p>
    <a href="/" className="mt-2 rounded-full border border-accents-2 px-5 py-2 text-sm font-medium hover:bg-accents-1 transition-colors">
      Go home
    </a>
  </div>
);

function AppInner() {
  const [cmdOpen, setCmdOpen] = useState(false);

  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  /* Global keyboard shortcut: Cmd+K / Ctrl+K */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-accents-8 selection:text-background">
      {/* Scroll progress bar */}
      <ScrollProgress />

      <Header onCommandOpen={openCmd} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* Command palette overlay */}
      <CommandPalette open={cmdOpen} onClose={closeCmd} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <AppInner />
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}
