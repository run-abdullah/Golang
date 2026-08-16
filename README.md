# 🐹 Golang Docs Vault

A modern, fast, and interactive documentation vault written in **Roman Urdu**, tailored for developers across South Asia to master **Golang**—from core language mechanics to advanced concurrency patterns.

[![Live Documentation](https://img.shields.io/badge/📖_View_Docs-golang.ariaz7556.workers.dev-a3e635?style=for-the-badge)](https://golang.ariaz7556.workers.dev)

![License](https://img.shields.io/badge/license-MIT-a3e635?style=flat-square)
![SolidJS](https://img.shields.io/badge/SolidJS-1.9-2c4f7c?style=flat-square&logo=solid)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06b6d4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat-square&logo=vite)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers_Assets-f38020?style=flat-square&logo=cloudflare)

---

## 🔗 Live Demo

Access the live documentation vault here:  
👉 **[golang.ariaz7556.workers.dev](https://golang.ariaz7556.workers.dev)**

---

## 📌 Overview

**Golang Docs Vault** is a centralized, high-performance reference hub built to bridge the gap in localized technical documentation. It provides clear explanations, structural diagrams, and contextual code examples in Roman Urdu, enabling backend engineers to build a strong mental model of Go ecosystem concepts.

---

## ✨ Key Capabilities

- 🌲 **Hierarchical File Tree:** Recursive sidebar rendering with natural numeric sorting (`1-Variables`, `2-Functions`).
- ⚡ **Ultra-Low Latency:** High-performance static architecture built with SolidJS reactive primitives and Vite compilation.
- 🎨 **Obsidian Dark Theme:** Carefully engineered dark UI (`#0d0d0d`) featuring Neon Green (`#a3e635`) visual accents.
- 📝 **Rich Markdown Engine:**
  - Contextual syntax highlighting powered by `highlight.js`
  - Obsidian-compliant Callouts (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`)
  - Support for dynamic checkboxes, structured data tables, and custom code panels.
- 📱 **Adaptive Responsive Design:** Seamless experience across desktop viewports and mobile navigation drawers.

---

## 🛠️ Architecture & Tech Stack

| Component                | Technology                                                                                          |
| :----------------------- | :-------------------------------------------------------------------------------------------------- |
| **Frontend Framework**   | [SolidJS](https://www.solidjs.com/)                                                                 |
| **Build System**         | [Vite](https://vitejs.dev/)                                                                         |
| **Styling Engine**       | [Tailwind CSS v4](https://tailwindcss.com/)                                                         |
| **Markdown Processing**  | [Marked](https://marked.js.org/) & [marked-highlight](https://github.com/markedjs/marked-highlight) |
| **Deployment & Hosting** | [Cloudflare Workers Assets](https://developers.cloudflare.com/workers/)                             |

---

## 📂 Project Structure

```text
├── public/
│   └── logo.svg           # Custom Go emblem asset
├── src/
│   ├── Golang/            # Production documentation source files (.md)
│   ├── App.tsx            # Primary Application Entry & Layout Router
│   ├── Sidebar.tsx        # Dynamic File Tree Component
│   └── global.css         # Custom tokens & base style definitions
├── wrangler.jsonc         # Cloudflare Workers Assets Configuration
├── package.json
└── README.md
```
