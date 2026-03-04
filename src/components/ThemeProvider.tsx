import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'system' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('qw-theme') as Theme) || 'system';
    } catch {
      return 'system';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('qw-theme', newTheme);
    } catch {}
  };

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      root.classList.remove('light', 'dark');
      let resolved: 'light' | 'dark';
      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = theme;
      }
      root.classList.add(resolved);
      setResolvedTheme(resolved);
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (theme === 'system') {
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
