import React, { useEffect, useState } from 'react';
import { ArrowRight, Code2, Cpu, Database, GitBranch, Globe, Layout, Server, Terminal, Star, GitFork, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRepos, Repo } from '../services/github';
import { motion } from 'motion/react';
import { RepoLogo } from '../components/RepoLogo';

const SKILLS = [
  { name: 'TypeScript', icon: <Code2 className="h-4 w-4" /> },
  { name: 'React', icon: <Layout className="h-4 w-4" /> },
  { name: 'Node.js', icon: <Server className="h-4 w-4" /> },
  { name: 'Next.js', icon: <Globe className="h-4 w-4" /> },
  { name: 'PostgreSQL', icon: <Database className="h-4 w-4" /> },
  { name: 'GraphQL', icon: <GitBranch className="h-4 w-4" /> },
  { name: 'Docker', icon: <Cpu className="h-4 w-4" /> },
  { name: 'Linux', icon: <Terminal className="h-4 w-4" /> },
];

const TIMELINE = [
  {
    year: '2023 - Present',
    role: 'Open Source Contributor',
    description: 'Actively contributing to various open-source projects, focusing on developer tooling and React ecosystem.',
  },
  {
    year: '2022 - 2023',
    role: 'Frontend Engineer',
    description: 'Built scalable web applications using React, TypeScript, and modern CSS frameworks.',
  },
  {
    year: '2021 - 2022',
    role: 'Full Stack Developer',
    description: 'Developed end-to-end solutions, integrating RESTful APIs with responsive frontends.',
  },
];

export function Home() {
  const [featuredRepos, setFeaturedRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const repos = await getRepos();
        const topRepos = repos
          .filter((r) => !r.fork)
          .sort((a, b) => (b.stargazers_count + b.size) - (a.stargazers_count + a.size))
          .slice(0, 4);
        setFeaturedRepos(topRepos);
      } catch (error) {
        console.error('Failed to fetch repos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-24">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-32 flex flex-col items-center text-center gap-6 pt-20 relative"
      >
        <div className="inline-flex items-center rounded-full border border-accents-2 bg-background px-3 py-1 text-xs font-medium text-accents-5 transition-colors hover:bg-accents-1">
          <span className="mr-2 flex h-2 w-2 rounded-full bg-green-500"></span>
          Available for new opportunities
        </div>
        <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
          Build and deploy<br />on the Web.
        </h1>
        <p className="max-w-[42rem] text-lg text-accents-5 sm:text-xl sm:leading-8">
          Quick Witty provides the developer tools and infrastructure to build, scale, and secure a faster, more personalized web.
        </p>
        
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center justify-center">
          <Link
            to="/projects"
            className="group flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background transition-all hover:bg-foreground/90"
          >
            <svg viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-background">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
            </svg>
            View Projects
          </Link>
          <Link
            to="/contacts"
            className="flex h-12 items-center justify-center rounded-full border border-accents-2 bg-transparent px-8 text-sm font-medium text-foreground transition-colors hover:bg-accents-1"
          >
            Contact Me
          </Link>
        </div>
      </motion.section>

      <hr className="my-16 border-accents-2/50" />

      {/* Philosophy / About Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-32"
      >
        <div className="grid md:grid-cols-2 border border-accents-2 rounded-xl overflow-hidden">
          <div className="flex flex-col justify-center p-8 md:p-12 border-b md:border-b-0 md:border-r border-accents-2 bg-background transition-colors hover:bg-accents-1/50">
            <h2 className="mb-4 text-2xl font-bold tracking-tight">Design Philosophy</h2>
            <p className="text-accents-5 leading-relaxed">
              I believe in building software that is not only functional but also beautiful and intuitive. 
              My approach centers around minimalism, performance, and accessibility. Every line of code 
              should serve a purpose, and every interface should feel natural to the user.
            </p>
          </div>
          <div className="grid grid-cols-2">
            <div className="group flex flex-col justify-center p-8 border-b border-r border-accents-2 bg-background transition-colors hover:bg-accents-1/50">
              <h3 className="mb-2 text-3xl font-bold tracking-tight">100+</h3>
              <p className="text-sm text-accents-5">Open Source Commits</p>
            </div>
            <div className="group flex flex-col justify-center p-8 border-b border-accents-2 bg-background transition-colors hover:bg-accents-1/50">
              <h3 className="mb-2 text-3xl font-bold tracking-tight">15+</h3>
              <p className="text-sm text-accents-5">Projects Built</p>
            </div>
            <div className="group col-span-2 flex flex-col justify-center p-8 bg-background transition-colors hover:bg-accents-1/50">
              <h3 className="mb-2 text-xl font-bold tracking-tight">Always Learning</h3>
              <p className="text-sm text-accents-5">Currently exploring Rust and WebAssembly.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <hr className="my-16 border-accents-2/50" />

      {/* Skills Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-32"
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Core Technologies</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-accents-2">
          {SKILLS.map((skill, idx) => (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              key={skill.name}
              className="group flex flex-col items-center justify-center gap-4 border-b border-r border-accents-2 bg-background p-8 transition-colors hover:bg-accents-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accents-2 bg-background text-foreground transition-all group-hover:scale-110 group-hover:border-foreground">
                {skill.icon}
              </div>
              <span className="text-sm font-medium text-accents-5 group-hover:text-foreground transition-colors">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <hr className="my-16 border-accents-2/50" />

      {/* Journey / Timeline Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-32"
      >
        <h2 className="mb-8 text-2xl font-semibold tracking-tight">My Journey</h2>
        <div className="flex flex-col border-t border-accents-2">
          {TIMELINE.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={idx} 
              className="group flex flex-col sm:flex-row gap-4 sm:gap-12 py-8 border-b border-accents-2 transition-colors hover:bg-accents-1/50 px-4 -mx-4 sm:px-8 sm:-mx-8"
            >
              <div className="sm:w-32 shrink-0">
                <div className="text-sm font-mono text-accents-5">{item.year}</div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.role}</h3>
                <p className="text-accents-5 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <hr className="my-16 border-accents-2/50" />

      {/* Featured Repositories Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Featured Work</h2>
          <Link
            to="/projects"
            className="group flex items-center text-sm font-medium text-accents-5 transition-colors hover:text-foreground"
          >
            View all
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {loading ? (
            <>
              <div className="h-48 animate-pulse rounded-xl border border-accents-2 bg-accents-1/50"></div>
              <div className="h-48 animate-pulse rounded-xl border border-accents-2 bg-accents-1/50"></div>
              <div className="h-48 animate-pulse rounded-xl border border-accents-2 bg-accents-1/50"></div>
              <div className="h-48 animate-pulse rounded-xl border border-accents-2 bg-accents-1/50"></div>
            </>
          ) : featuredRepos.length > 0 ? (
            featuredRepos.map((repo, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                key={repo.id}
                className="group relative h-full"
              >
                <Link
                  to={`/project/${repo.name}`}
                  className="absolute inset-0 z-20 rounded-xl"
                >
                  <span className="sr-only">View {repo.name}</span>
                </Link>
                <div className="flex h-full flex-col justify-between rounded-xl border border-accents-2 bg-background p-6 transition-all hover:border-accents-5 hover:shadow-sm">
                  <div className="relative z-10 pointer-events-none">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative overflow-hidden rounded-lg border border-accents-2 bg-background p-1.5">
                          <RepoLogo name={repo.name} className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold tracking-tight text-lg">{repo.name}</h3>
                      </div>
                    </div>
                    <p className="mb-6 text-sm text-accents-5 line-clamp-2 leading-relaxed">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center justify-between mt-auto pt-4 pointer-events-none">
                    <div className="flex items-center gap-4 text-xs text-accents-5">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                repo.language === 'TypeScript'
                                  ? '#3178c6'
                                  : repo.language === 'JavaScript'
                                  ? '#f1e05a'
                                  : repo.language === 'Rust'
                                  ? '#dea584'
                                  : '#ccc',
                            }}
                          />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 font-medium">
                        <Star className="h-3.5 w-3.5" />
                        {repo.stargazers_count}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 py-12 text-center text-accents-5">No repositories found.</div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
