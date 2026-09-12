# LiteRight Academy — Litelab Royale 🎓💡

<div align="center">

[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Azure Deployment](https://img.shields.io/badge/Cloud-Microsoft_Azure-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)](https://azure.microsoft.com/)

**Security-First, Monochromatic Learning Management System (LMS) Built for Litelab Milano Architectural Lighting Academy.**

🌐 **Live Platform:** [http://literight.centralindia.cloudapp.azure.com](http://literight.centralindia.cloudapp.azure.com)

</div>

---

## 📖 Overview

**LiteRight Academy** is an ultra-modern, security-first Learning Management System (LMS) engineered for **Litelab Milano** (a global vanguard in architectural lighting systems). 

The platform delivers a cinematic, studio-grade learning experience grounded in the **"Litelab Royale"** design philosophy—a stark, high-contrast monochromatic visual palette (`#000` deep black / `#FFF` pure white) with frosted glassmorphic HUD overlays, heavy architectural typography, and seamless video streaming.

---

## 🌟 Key Features

- 🖤 **Royale Aesthetic**: High-end monochromatic visual hierarchy eliminating distracting interface noise and putting pure focus on educational content.
- 🔐 **Hardened Authentication Suite**:
  - SHA-256 password hashing with salt protection.
  - 6-digit OTP email verification powered by Nodemailer.
  - JWT session token management with auto-refresh cycles.
  - Secure self-service password recovery pipeline.
- 🎬 **Studio-Grade 16:9 Video Player**: Mathematically locked 16:9 responsive video player with branded watermark overlays and progress telemetry.
- 📊 **Student Nexus Dashboard**: Centralized learner dashboard tracking module completion percentages, quiz scores, and course certifications.
- 📱 **Adaptive Vertical Architecture**: Responsive navigation architecture ensuring zero UI overlap across mobile, tablet, and widescreen viewports.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 with Fast Refresh |
| **Routing** | React Router DOM v7 |
| **State Management** | Zustand (lightweight decoupled stores) |
| **Bundler** | Vite 8 with ESBuild |
| **Styling** | Tailwind CSS with custom glassmorphic utilities |
| **Icons** | Lucide React |
| **Email Service** | Nodemailer with SMTP integration |
| **Infrastructure** | Microsoft Azure VM (Ubuntu / Nginx / Node.js) & Vercel |

---

## 📂 Directory Layout

```
literight/
├── backend/                  # Express authentication & API service
├── course1content/           # Course curricula, video metadata, and lesson text
├── infrastructure/           # Nginx reverse proxy configs & Azure setup
├── public/                   # Static branding, favicons, certificates
├── screenshots/              # UI walkthrough captures
├── src/
│   ├── components/           # UI elements (VideoPlayer, Navbar, CourseCards)
│   ├── pages/                # Route views (Dashboard, CourseView, Login, Register)
│   ├── store/                # Zustand global state stores (auth, progress)
│   ├── App.jsx               # Application root shell
│   └── main.jsx              # DOM entry point
├── course_outline.md         # Curriculum documentation
├── literight_comprehensive_report.md # Architecture & security audit report
├── run_deploy.sh             # Production deployment bash script
├── sync_to_azure.sh          # RSYNC cloud sync utility to Azure VM
└── vite.config.js            # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/A-Generative-Slice/literight.git
cd literight

# 2. Install dependencies
npm install

# 3. Launch Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🚢 Deployment

### Azure VM Deployment
```bash
# Execute the automated sync and remote build script:
./sync_to_azure.sh
```

### Vercel Deployment
The repository includes a tuned `vercel.json` and `.vercelignore` for zero-configuration serverless frontend deployments:
```bash
npx vercel --prod
```

---

## 📄 License & Attribution

Designed and engineered by **A Generative Slice** for **Litelab Milano**.  
Copyright © 2026 Litelab & A Generative Slice. All rights reserved.
