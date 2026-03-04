<p align="center">
<img src="public/quick.png" alt="Quick Portfolio Banner" width="100%">
</p>

<div align="center">
<h1>Quick Portfolio</h1>
<p>A high-performance, interactive personal portfolio built with React 18, TypeScript, and Vite.</p>
</div>

🚀 Features

⚡ Blazing Fast: Optimized build with Vite and React 18.

🎨 Interactive UI: Smooth animations powered by Framer Motion and styled with Tailwind CSS.

⌘ Command Palette: Keyboard-first navigation and global actions.

🐙 GitHub Sync: Dynamic project fetching via GitHub API.

🌙 Theme System: Full Dark/Light mode support with persistent state.

🎮 Easter Egg: Built-in Konami code listener.

📱 Responsive: Fluid design for mobile, tablet, and desktop.

🛠️ Tech Stack

Core: React, TypeScript

Build Tool: Vite

Styling: Tailwind CSS

Animation: Framer Motion

Icons: Lucide React

Navigation: React Router v6

📦 Getting Started

Prerequisites

Node.js (v18+)

npm / yarn / pnpm

Installation

Clone the repo

git clone [https://github.com/yourusername/quick.git](https://github.com/yourusername/quick.git)
cd quick


Install dependencies

npm install


Configure Environment

cp .env.example .env
# Add your GitHub Personal Access Token to .env


Development

npm run dev


📂 Structure

src/
├── components/   # UI logic (Palette, Theme, Eggs)
├── hooks/        # Custom logic (useCountUp)
├── pages/        # Views (Home, Projects, Now)
├── services/     # API handlers (GitHub)
├── utils/        # Styles and helpers
└── App.tsx       # Root & Routing


🔨 Build

To generate a production build in the dist/ folder:

npm run build


📄 License

MIT © [Your Name]
