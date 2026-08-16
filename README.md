# 🐹 Golang Docs Vault

> **Roman Urdu** mein Golang seekhne aur sikhane ke liye ek modern, fast, aur interactive documentation vault. Designed & Developed by **Abdullah Riaz**.

![License](https://img.shields.io/badge/license-MIT-a3e635?style=flat-square)
![SolidJS](https://img.shields.io/badge/SolidJS-1.9-2c4f7c?style=flat-square&logo=solid)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06b6d4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat-square&logo=vite)

---

## 🚀 About The Project

Yeh project India aur Pakistan ke emerging backend developers ke liye banaya gaya hai taake wo **Golang (Go)** ke core fundamentals se le kar advance concurrency concepts tak ko easy-to-understand **Roman Urdu** aur visual code examples ke sath seekh sakein.

### ✨ Key Features

- 🌲 **Recursive Tree Navigation:** Vault files aur nested folders ke liye natural numerical sorting (`1-Variables`, `2-Functions`).
- ⚡ **Lightning Fast:** SolidJS aur Vite v6 par built hone ki wajah se zero-lag rendering.
- 🎨 **Dark Obsidian UI:** Deep dark background (`#0d0d0d`) aur Neon Green accent (`#a3e635`) theme.
- 📝 **Enhanced Markdown Support:**
  - Syntax Highlighting via `highlight.js`
  - Obsidian-style Callouts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`)
  - Dynamic Checkboxes, Tables, aur Custom Code Blocks
- 📱 **Fully Responsive:** Mobile drawer aur desktop sidebar support.

---

## 🛠️ Tech Stack

- **Frontend Framework:** [SolidJS](https://www.solidjs.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Markdown Parser:** [Marked](https://marked.js.org/) + [marked-highlight](https://github.com/markedjs/marked-highlight)
- **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 📂 Project Structure

```text
├── public/
│   ├── logo.svg           # Custom Gopher SVG Emblem
│   └── _redirects         # SPA routing for Cloudflare Pages
├── src/
│   ├── Golang/            # Markdown documentation notes (.md)
│   ├── App.tsx            # Main layout & route handlers
│   ├── Sidebar.tsx        # File tree sidebar navigation
│   └── global.css         # CSS variables & global styling
├── package.json
└── README.md
```
