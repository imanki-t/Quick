import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, Star, GitFork, CircleDot, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRepos, Repo } from '../services/github';
import { motion } from 'motion/react';
import { RepoLogo } from '../components/RepoLogo';

export function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const repos = await getRepos();
        setProjects(repos.filter((r) => !r.fork)); // Exclude forks
      } catch (error) {
        console.error('Failed to fetch repos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const languages = useMemo(() => {
    const langs = new Set<string>();
    projects.forEach((p) => {
      if (p.language) langs.add(p.language);
    });
    return ['All', ...Array.from(langs).sort()];
  }, [projects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLanguage = selectedLanguage === 'All' || project.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-5xl px-6 py-12 md:py-24"
    >
      <div className="mb-12 flex flex-col items-start gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Projects</h1>
        <p className="max-w-[42rem] text-lg text-accents-5">
          A comprehensive list of my open-source projects, experiments, and contributions.
        </p>
        <div className="max-w-[42rem] text-sm text-accents-5 mt-2 border-l border-accents-2 pl-4">
          <p>I love to build these! Here you'll find a collection of my open-source work, ranging from small utilities to full-stack applications.</p>
          <p className="mt-1">Feel free to explore the code, star the repos you like, and even contribute if you find something interesting.</p>
        </div>
      </div>

      {/* Stats Overview */}
      {!loading && projects.length > 0 && (
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col rounded-xl border border-accents-2 bg-background p-4 transition-colors hover:bg-accents-1/50">
            <span className="text-sm font-medium text-accents-5">Total Repos</span>
            <span className="text-2xl font-bold">{projects.length}</span>
          </div>
          <div className="flex flex-col rounded-xl border border-accents-2 bg-background p-4 transition-colors hover:bg-accents-1/50">
            <span className="text-sm font-medium text-accents-5">Total Stars</span>
            <span className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.stargazers_count, 0)}</span>
          </div>
          <div className="flex flex-col rounded-xl border border-accents-2 bg-background p-4 transition-colors hover:bg-accents-1/50">
            <span className="text-sm font-medium text-accents-5">Total Forks</span>
            <span className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.forks_count, 0)}</span>
          </div>
          <div className="flex flex-col rounded-xl border border-accents-2 bg-background p-4 transition-colors hover:bg-accents-1/50">
            <span className="text-sm font-medium text-accents-5">Languages</span>
            <span className="text-2xl font-bold">{languages.length - 1}</span>
          </div>
        </div>
      )}

      <hr className="my-12 border-accents-2" />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-accents-4 transition-colors group-focus-within:text-foreground" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-accents-2 bg-background py-2 pl-10 pr-3 text-sm placeholder:text-accents-4 focus:border-accents-5 focus:outline-none focus:ring-1 focus:ring-accents-5 transition-colors hover:border-accents-5"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <Filter className="h-4 w-4 text-accents-4" />
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                selectedLanguage === lang
                  ? 'bg-foreground text-background'
                  : 'bg-background text-accents-5 hover:bg-accents-1 hover:text-foreground border border-accents-2'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl border border-accents-2 bg-accents-1/50"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                key={project.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-accents-2 bg-background transition-all hover:border-accents-5 hover:shadow-sm"
              >
                <Link to={`/project/${project.name}`} className="absolute inset-0 z-20 rounded-xl">
                  <span className="sr-only">View Project</span>
                </Link>
                
                <div className="p-6 relative z-10 pointer-events-none">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="relative overflow-hidden rounded-lg border border-accents-2 bg-background p-1.5">
                      <RepoLogo name={project.name} className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold tracking-tight text-lg">{project.name}</h3>
                  </div>
                  <p className="mb-6 text-sm text-accents-5 line-clamp-3 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="mt-auto border-t border-accents-2 p-4 relative z-10 bg-background pointer-events-none">
                  <div className="flex items-center justify-between text-xs font-medium text-accents-5">
                    <span className="flex items-center gap-1.5">
                      {project.language && (
                        <>
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                project.language === 'TypeScript'
                                  ? '#3178c6'
                                  : project.language === 'JavaScript'
                                  ? '#f1e05a'
                                  : project.language === 'Rust'
                                  ? '#dea584'
                                  : project.language === 'Go'
                                  ? '#00ADD8'
                                  : project.language === 'Python'
                                  ? '#3572A5'
                                  : '#ccc',
                            }}
                          />
                          {project.language}
                        </>
                      )}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5" title="Stars">
                        <Star className="h-3.5 w-3.5" />
                        {project.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1.5" title="Forks">
                        <GitFork className="h-3.5 w-3.5" />
                        {project.forks_count}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute right-4 top-4 z-30 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-background border border-accents-2 text-foreground transition-colors hover:bg-accents-1"
                      title="Live Demo"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                  <a
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-background border border-accents-2 text-foreground transition-colors hover:bg-accents-1"
                    title="Source Code"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accents-1/50 text-accents-5 border border-accents-2/50 backdrop-blur-sm">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">No projects found</h3>
              <p className="text-accents-5 mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </>
      )}

      <hr className="my-16 border-accents-2" />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-16 flex justify-center"
      >
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-md border border-accents-2 bg-background px-8 text-sm font-medium text-foreground transition-colors hover:bg-accents-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  );
}
