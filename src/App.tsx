import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { CommandPalette } from './components/CommandPalette';
import { ToastProvider } from './components/ToastProvider';
import { KonamiEgg } from './components/KonamiEgg';

// ── Lazy-load every page so each route is its own JS chunk.
//    This drastically reduces initial bundle size and TTI.
const Home          = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Projects      = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })));
const Contacts      = lazy(() => import('./pages/Contacts').then(m => ({ default: m.Contacts })));
const Now           = lazy(() => import('./pages/Now').then(m => ({ default: m.Now })));
const NotFound      = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// ── Minimal full-page spinner shown while a lazy chunk loads
function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-accents-2 border-t-foreground animate-spin" />
    </div>
  );
}

function AppInner() {
  const [cmdOpen, setCmdOpen] = useState(false);

  const openCmd  = useCallback(() => setCmdOpen(true),  []);
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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/projects"    element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/contacts"    element={<Contacts />} />
            <Route path="/now"         element={<Now />} />
            <Route path="*"            element={<NotFound />} />
          </Routes>
        </Suspense>
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
