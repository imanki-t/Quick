<div align="center">

<img src="public/quick.png" alt="Quick Portfolio" width="100%"/>

<br/>

# ⚡ Quick Portfolio

**A high-performance personal portfolio that gets out of your way — and lets your work speak.**

Built with React 18, TypeScript, and Vite. Keyboard-first. GitHub-connected. Blazing fast.

<br/>


---

## ✦ What is Quick?

Quick is a minimal, opinionated portfolio template designed for developers who want a **fast, elegant, and customizable** online presence — without the bloat.

It ships with a built-in command palette for keyboard-driven navigation, live GitHub project sync, smooth Framer Motion animations, full dark/light theming, and even a little surprise for those who know the Konami code.

---

## ✦ Features

| Feature | Description |
|---|---|
| ⚡ **Blazing Fast** | Vite-powered build with optimized chunking and React 18 concurrent rendering |
| ⌘ **Command Palette** | Global keyboard navigation — press `Cmd+K` to access any page or action instantly |
| 🐙 **GitHub Sync** | Projects page auto-populates from your GitHub repos via the GitHub API |
| 🌙 **Theme System** | Dark and light mode with persistent state across sessions |
| 🎞 **Smooth Animations** | Page transitions and micro-interactions powered by Framer Motion |
| 🎮 **Easter Egg** | A Konami code listener baked right in (↑↑↓↓←→←→BA) |
| 📱 **Fully Responsive** | Fluid layouts designed for mobile, tablet, and desktop |

---

## ✦ Tech Stack

```
React 18          →  UI & Component Architecture
TypeScript        →  Type Safety
Vite              →  Build Tool & Dev Server
Tailwind CSS      →  Styling & Utility Classes
Framer Motion     →  Animations & Page Transitions
Lucide React      →  Icon Library
React Router v6   →  Client-side Routing
GitHub REST API   →  Dynamic Project Fetching
```

---

## ✦ Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm**, **yarn**, or **pnpm**
- A [GitHub Personal Access Token](https://github.com/settings/tokens) (for project fetching)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/quick.git
cd quick
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Open `.env` and add your GitHub token:

```env
VITE_GITHUB_TOKEN=your_personal_access_token_here
VITE_GITHUB_USERNAME=your_github_username
```

**4. Start the dev server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and you're live. ✦

---

## ✦ Project Structure

```
quick/
├── public/                 # Static assets
└── src/
    ├── components/         # Reusable UI components
    │   ├── CommandPalette/ # ⌘K command palette
    │   ├── ThemeToggle/    # Dark/light mode switcher
    │   └── EasterEgg/      # Konami code handler
    ├── hooks/              # Custom React hooks
    │   └── useCountUp.ts   # Animated number counter
    ├── pages/              # Route-level views
    │   ├── Home.tsx        # Landing / hero
    │   ├── Projects.tsx    # GitHub-synced project list
    │   └── Now.tsx         # "What I'm doing now" page
    ├── services/           # External API integrations
    │   └── github.ts       # GitHub REST API client
    ├── utils/              # Shared helpers & style utilities
    └── App.tsx             # Root component & router setup
```

---

## ✦ Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start local dev server at `localhost:5173` |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## ✦ Deployment

Quick builds to a standard static `dist/` folder and can be deployed anywhere:

```bash
npm run build
```

**Recommended platforms:** [Vercel](https://vercel.com) · [Netlify](https://netlify.com) · [GitHub Pages](https://pages.github.com)

For Vercel, just connect your repo — it auto-detects Vite and deploys on every push.

---

## ✦ Customization

Most content lives in a single config file. Update your name, bio, socials, and nav links there — the rest of the portfolio pulls from it automatically.

> Full customization guide coming soon in the [Wiki](https://github.com/yourusername/quick/wiki).

---

## ✦ License

MIT © [unmuted](https://github.com/yourusername) — do whatever you want with it, just don't claim you built it from scratch. 😄

---

<div align="center">

Made with ♥ and too much coffee · [⭐ Star this repo](https://github.com/yourusername/quick) if it helped you

</div>
