import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, GitFork, CircleDot, ExternalLink, Github, Calendar, Code2, Home } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { format } from 'date-fns';
import { getRepo, getReadme, Repo, GITHUB_USERNAME } from '../services/github';
import { motion } from 'motion/react';
import { RepoLogo } from '../components/RepoLogo';

// ── Resolve a README image src to an absolute URL.
//    Many READMEs use relative paths like "./docs/banner.png" or
//    just "banner.png" — these must be rewritten to raw.githubusercontent
function resolveImageUrl(src: string | undefined, repoName: string): string {
  if (!src) return '';

  // Already absolute — return as-is (but swap github.com blob URLs → raw)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
      .replace(
        /https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\//,
        'https://raw.githubusercontent.com/$1/$2/'
      );
  }

  // Relative path — resolve against the repo root on raw.githubusercontent
  const cleanPath = src.replace(/^\.\//, '').replace(/^\//, '');
  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/HEAD/${cleanPath}`;
}

// ── Custom image component: lazy, overflow-safe, error-resilient
function ReadmeImage({
  src,
  alt,
  repoName,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & { repoName: string }) {
  const [errored, setErrored] = useState(false);
  const resolved = resolveImageUrl(src, repoName);

  if (errored) {
    // Render a placeholder instead of a broken image
    return (
      <span className="flex items-center justify-center rounded-xl border border-accents-2 bg-accents-1 px-4 py-6 text-xs text-accents-5 italic my-2">
        {alt || 'Image could not be loaded'}
      </span>
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
      style={{ maxWidth: '100%', height: 'auto' }}
      {...rest}
    />
  );
}

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [repo, setRepo] = useState<Repo | null>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        setLoading(true);
        const [repoData, readmeData] = await Promise.all([
          getRepo(id),
          getReadme(id),
        ]);
        setRepo(repoData);
        setReadme(readmeData);
      } catch (err) {
        console.error(err);
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-accents-2/50 border-t-foreground" />
        <p className="mt-6 text-accents-5 font-medium animate-pulse">Loading project details...</p>
      </div>
    );
  }

  if (error || !repo) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">Project Not Found</h2>
        <p className="mb-8 text-accents-5 text-lg">{error || "The repository doesn't exist or is private."}</p>
        <Link
          to="/projects"
          className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background transition-all hover:bg-foreground/90"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

  // Custom markdown components — the key fix for images
  const markdownComponents = {
    img: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <ReadmeImage src={src} alt={alt} repoName={repo.name} {...props} />
    ),
    // Ensure links open in new tab and don't navigate away
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        href={href}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl px-6 py-12 md:py-24"
    >
      {/* Header */}
      <div className="mb-12">
        <Link
          to="/projects"
          className="mb-8 inline-flex items-center text-sm font-medium text-accents-5 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-6 mb-6">
          <RepoLogo name={repo.name} className="w-16 h-16 rounded-xl border border-accents-2 bg-background p-2" />
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{repo.name}</h1>
        </div>
        <p className="max-w-[42rem] text-xl text-accents-5 leading-relaxed">
          {repo.description || 'No description provided.'}
        </p>
      </div>

      <hr className="my-12 border-accents-2" />

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Main Content (README) */}
        <div className="lg:col-span-2 min-w-0 overflow-hidden">
          {readme ? (
            <div className="prose prose-neutral dark:prose-invert max-w-none prose-a:text-foreground prose-a:underline-offset-4 hover:prose-a:text-accents-5 prose-pre:border prose-pre:border-accents-2 prose-pre:bg-accents-1 overflow-hidden">
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents as any}
              >
                {readme}
              </Markdown>
            </div>
          ) : (
            <div className="rounded-xl border border-accents-2 bg-background p-16 text-center text-accents-5 flex flex-col items-center justify-center">
              <Code2 className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No README found for this repository.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-xl border border-accents-2 bg-background p-6">
            <h3 className="mb-6 text-lg font-semibold tracking-tight">Repository Details</h3>

            <div className="mb-8 space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-accents-2">
                <span className="flex items-center text-accents-5">
                  <Star className="mr-2 h-4 w-4" /> Stars
                </span>
                <span className="font-medium">{repo.stargazers_count}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-accents-2">
                <span className="flex items-center text-accents-5">
                  <GitFork className="mr-2 h-4 w-4" /> Forks
                </span>
                <span className="font-medium">{repo.forks_count}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-accents-2">
                <span className="flex items-center text-accents-5">
                  <CircleDot className="mr-2 h-4 w-4" /> Open Issues
                </span>
                <span className="font-medium">{repo.open_issues_count}</span>
              </div>
              {repo.language && (
                <div className="flex items-center justify-between py-2 border-b border-accents-2">
                  <span className="flex items-center text-accents-5">
                    <Code2 className="mr-2 h-4 w-4" /> Language
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          repo.language === 'TypeScript' ? '#3178c6'
                          : repo.language === 'JavaScript' ? '#f1e05a'
                          : repo.language === 'Rust'       ? '#dea584'
                          : repo.language === 'Go'         ? '#00ADD8'
                          : repo.language === 'Python'     ? '#3572A5'
                          : '#ccc',
                      }}
                    />
                    {repo.language}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="flex items-center text-accents-5">
                  <Calendar className="mr-2 h-4 w-4" /> Last Updated
                </span>
                <span className="font-medium text-right">
                  {format(new Date(repo.updated_at), 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <Github className="mr-2 h-4 w-4" />
                View Source Code
              </a>
              {repo.homepage && (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-md border border-accents-2 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accents-1"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              )}
            </div>

            {repo.topics && repo.topics.length > 0 && (
              <div className="mt-8 pt-6 border-t border-accents-2">
                <h4 className="mb-3 text-xs font-semibold text-accents-5 uppercase tracking-wider">Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {repo.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-accents-1 px-3 py-1 text-xs font-medium text-accents-5 border border-accents-2"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="my-16 border-accents-2" />

      <div className="mt-16 flex justify-center">
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-md border border-accents-2 bg-background px-8 text-sm font-medium text-foreground transition-colors hover:bg-accents-1"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}
