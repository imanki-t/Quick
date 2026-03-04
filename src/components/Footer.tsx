import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { Github, Mail, Monitor, Sun, Moon } from 'lucide-react';
import { useTheme, Theme } from './ThemeProvider';

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

interface ThemeSwitcherProps {
  className?: string;
}

function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  const options: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'system', icon: <Monitor className="h-3.5 w-3.5" />, label: 'System' },
    { value: 'light', icon: <Sun className="h-3.5 w-3.5" />, label: 'Light' },
    { value: 'dark', icon: <Moon className="h-3.5 w-3.5" />, label: 'Dark' },
  ];

  return (
    <div className={`inline-flex items-center rounded-lg border border-accents-2 bg-accents-1 p-0.5 gap-0.5 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          className={`flex items-center justify-center rounded-md h-7 w-7 transition-all duration-200 ${
            theme === opt.value
              ? 'bg-background text-foreground shadow-sm border border-accents-2'
              : 'text-accents-5 hover:text-foreground'
          }`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}

export { ThemeSwitcher };

export function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Navigation',
      links: [
        { label: 'Home', to: '/', internal: true },
        { label: 'Projects', to: '/projects', internal: true },
        { label: 'Contacts', to: '/contacts', internal: true },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'GitHub', href: 'https://github.com/imanki-t', internal: false },
        { label: 'Reddit', href: 'https://reddit.com/user/imunmuted', internal: false },
        { label: 'Email', href: 'mailto:imitsankit@gmail.com', internal: false },
      ],
    },
    {
      title: 'Open Source',
      links: [
        { label: 'All Projects', to: '/projects', internal: true },
        { label: 'GitHub Profile', href: 'https://github.com/imanki-t', internal: false },
      ],
    },
  ];

  return (
    <footer className="border-t border-accents-2 bg-background">
      {/* Main footer content */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Logo className="h-5 w-5" />
              <span className="text-sm font-bold tracking-tight">imanki-t</span>
            </div>
            <p className="text-xs text-accents-5 leading-relaxed max-w-[180px]">
              Vibe coder building open-source tools and digital experiences on the web.
            </p>
            <div className="flex items-center gap-2 mt-1">
              <a
                href="https://github.com/imanki-t"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-accents-2 text-accents-5 hover:text-foreground hover:border-accents-5 transition-all"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://reddit.com/user/imunmuted"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-accents-2 text-accents-5 hover:text-foreground hover:border-accents-5 transition-all"
                title="Reddit"
              >
                <RedditIcon />
              </a>
              <a
                href="mailto:imitsankit@gmail.com"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-accents-2 text-accents-5 hover:text-foreground hover:border-accents-5 transition-all"
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-accents-2 text-accents-5 hover:text-foreground hover:border-accents-5 transition-all cursor-default"
                title="Discord: _imgeno"
              >
                <DiscordIcon />
              </span>
            </div>
          </div>

          {/* Link sections */}
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-accents-4">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {'to' in link && link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm text-accents-5 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={'href' in link ? link.href : '#'}
                        target={('href' in link && link.href?.startsWith('http')) ? '_blank' : undefined}
                        rel={('href' in link && link.href?.startsWith('http')) ? 'noopener noreferrer' : undefined}
                        className="text-sm text-accents-5 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-accents-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-xs text-accents-5">
            © {currentYear} imanki-t. Built with React & Tailwind CSS.
          </p>

          {/* Vercel-style theme switcher */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-accents-4">Theme</span>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
