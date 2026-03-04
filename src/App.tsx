import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Contacts } from './pages/Contacts';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Now } from './pages/Now';
import { NotFound } from './pages/NotFound';
import { ScrollProgress } from './components/ScrollProgress';
import { CommandPalette } from './components/CommandPalette';
import { ToastProvider } from './components/ToastProvider';
import { KonamiEgg } from './components/KonamiEgg';

function AppInner() {
  const [cmdOpen, setCmdOpen] = useState(false);

  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

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
      <ScrollProgress />
      <Header onCommandOpen={openCmd} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/now" element={<Now />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <CommandPalette open={cmdOpen} onClose={closeCmd} />

      {/* Global easter egg — works on any page */}
      <KonamiEgg />
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
