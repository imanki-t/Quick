import React, { useState, useEffect } from 'react';
import { Github, Mail, ArrowLeft, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwvngrkl';

// 👇 Replace with your reCAPTCHA v3 site key from https://www.google.com/recaptcha/admin
const RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_V3_SITE_KEY';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const RedditIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    name: 'GitHub', id: 'imanki-t', url: 'https://github.com/imanki-t',
    icon: <Github className="h-5 w-5" />, description: 'Check out my open source work.',
  },
  {
    name: 'Reddit', id: 'u/imunmuted', url: 'https://reddit.com/user/imunmuted',
    icon: <RedditIcon className="h-5 w-5" />, description: 'Active in developer communities.',
  },
  {
    name: 'Discord', id: '_imgeno', url: '#',
    icon: <DiscordIcon className="h-5 w-5" />, description: 'Quick chats or collaboration.',
  },
  {
    name: 'Email', id: 'imitsankit@gmail.com', url: 'mailto:imitsankit@gmail.com',
    icon: <Mail className="h-5 w-5" />, description: 'For professional opportunities.',
  },
];

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

/* ─── Load reCAPTCHA v3 script ─── */
function useRecaptchaV3() {
  useEffect(() => {
    if (document.getElementById('recaptcha-script')) return;
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  const getToken = (action: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const attempt = (retries: number) => {
        if (window.grecaptcha?.ready) {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(RECAPTCHA_SITE_KEY, { action })
              .then(resolve)
              .catch(reject);
          });
        } else if (retries > 0) {
          setTimeout(() => attempt(retries - 1), 200);
        } else {
          reject(new Error('reCAPTCHA not loaded'));
        }
      };
      attempt(20);
    });
  };

  return { getToken };
}

/* ─── Floating label input ─── */
function Field({
  label, name, type = 'text', required = true, multiline = false,
}: {
  label: string; name: string; type?: string; required?: boolean; multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const filled = value.length > 0;

  const baseClass =
    'peer w-full rounded-xl border border-accents-2 bg-background px-4 pt-6 pb-2 text-sm text-foreground placeholder-transparent outline-none ring-0 transition-all focus:border-accents-5 focus:ring-1 focus:ring-accents-5/30 hover:border-accents-4 resize-none';

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          name={name}
          id={name}
          required={required}
          rows={5}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label}
          className={baseClass}
        />
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={label}
          className={baseClass}
        />
      )}
      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-4 transition-all duration-200 font-medium ${
          focused || filled
            ? 'top-2 text-[10px] text-accents-4 uppercase tracking-wide'
            : 'top-4 text-sm text-accents-4'
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export function Contacts() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const { getToken } = useRecaptchaV3();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Get v3 token invisibly — no user interaction needed
      const token = await getToken('contact_form');

      const form = e.currentTarget;
      const data = new FormData(form);
      data.append('g-recaptcha-response', token);

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        const body = await res.json();
        console.error('Formspree error:', res.status, body);
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    }

    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl px-6 py-12 md:py-24"
    >
      {/* Header */}
      <div className="mb-16 flex flex-col items-center text-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Let's Connect</h1>
        <p className="max-w-[42rem] text-base text-accents-5">
          Whether it's a project, a collaboration, or just saying hi — I'd love to hear from you.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* ── Left: Social links ── */}
        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-accents-4">Find me on</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {SOCIAL_LINKS.map((link, idx) => (
              <motion.a
                key={link.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 rounded-xl border border-accents-2 bg-background p-4 transition-all hover:border-accents-4 hover:bg-accents-1/50 card-top-border"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accents-2 bg-background text-foreground transition-all duration-300 group-hover:scale-110 group-hover:border-accents-5">
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{link.name}</p>
                  <p className="text-xs text-accents-5 truncate">{link.id}</p>
                </div>
                <svg className="h-4 w-4 opacity-0 text-accents-5 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>
            ))}
          </div>

          {/* Availability note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-green-500 status-dot-available" />
              <span className="text-sm font-semibold text-green-400">Currently available</span>
            </div>
            <p className="text-xs text-accents-5 leading-relaxed">
              Open to freelance projects, collaborations, and full-time opportunities. Response time is usually within 24 hours.
            </p>
          </motion.div>
        </div>

        {/* ── Right: Contact form ── */}
        <div>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-accents-4">Send a message</h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-accents-2 bg-background p-6"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Message sent!</h3>
                    <p className="mt-1 text-sm text-accents-5">I'll get back to you within 24 hours.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Your name" name="name" />
                    <Field label="Email address" name="email" type="email" />
                  </div>
                  <Field label="Subject" name="subject" />
                  <Field label="Message" name="message" multiline />

                  {/* Hidden honeypot for spam */}
                  <input type="text" name="_gotcha" className="hidden" />

                  {status === 'error' && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                      <p className="text-xs text-red-400">Something went wrong. Please try emailing directly.</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="deploy-btn group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background transition-all hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        Send Message
                      </>
                    )}
                  </button>

                  {/* Required reCAPTCHA v3 branding */}
                  <p className="text-center text-[10px] text-accents-4">
                    Protected by reCAPTCHA —{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-accents-5">Privacy</a>
                    {' & '}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-accents-5">Terms</a>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <hr className="my-16 border-accents-2" />

      <div className="flex justify-center">
        <Link to="/" className="inline-flex h-10 items-center justify-center rounded-md border border-accents-2 bg-background px-8 text-sm font-medium text-foreground transition-colors hover:bg-accents-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
