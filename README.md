# 🎓 LiteRight Academy — LMS Platform

**LiteRight Academy** is a premium, security-first Learning Management System built for Litelab Milano — a specialist corporate lighting consultancy. The platform delivers a studio-grade educational experience with a "Preview First" philosophy inspired by the minimalist elegance of platforms like Domestika.

---

## 🌐 Live Platform

**[literight.centralindia.cloudapp.azure.com](http://literight.centralindia.cloudapp.azure.com)**

---

## ✨ Key Features

- **🔐 Secure Authentication**: SHA-256 password hashing, 6-digit OTP email verification, and JWT session management.
- **📨 Transactional Emails**: Branded OTP verification and welcome emails delivered via Gmail SMTP (Nodemailer).
- **🔑 Forgot Password**: Full OTP-based password recovery flow — request code → verify → set new password (confirmed twice).
- **⚡ Smart Auth Routing**: Conflict modals for duplicate accounts and missing accounts with one-click tab switching between Sign Up and Log In.
- **🎬 16:9 Video Player**: Mathematically perfect aspect ratio video playback with a blurred preview overlay for unauthenticated users.
- **📱 Mobile-First UI**: Responsive layout using custom utility classes; no layout overflow bugs.
- **🧭 SPA Routing**: Clean sub-URL navigation (`/`, `/sign-up`, `/course/:id`, `/admin`) powered by `react-router-dom`.
- **🛡️ Role-Based Access**: Student and Admin roles with protected route guards.
- **📊 Course Progress**: Lesson-level progress tracking persisted to SQLite.
- **⚙️ Admin Dashboard**: Full course/chapter/lesson CRUD, enrollment management, and analytics.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Zustand, react-router-dom |
| **Styling** | Vanilla CSS with custom design system (Outfit + Inter fonts) |
| **Backend** | NestJS (Node.js), TypeORM |
| **Database** | SQLite (`backend/data/lms.db`) — persistent across restarts |
| **Auth** | JWT, SHA-256 password hashing, OTP via Nodemailer + Gmail |
| **Server** | Azure VM (Central India) — Nginx reverse proxy + PM2 |

---

## 📂 Project Structure

```
lms.ags/
├── src/                      # React frontend
│   ├── pages/                # Route-level pages
│   │   ├── PublicLanding.jsx # Home / landing
│   │   ├── AuthPage.jsx      # Sign Up, Log In, Forgot Password
│   │   ├── CourseDetail.jsx  # Course viewer + video player
│   │   └── AdminPanel.jsx    # Admin dashboard
│   ├── components/           # Shared UI components
│   │   ├── Navigation.jsx    # Top nav (dynamic Get Started / Back to Academy)
│   │   ├── Syllabus.jsx      # Course curriculum tree
│   │   ├── QuizPlayer.jsx    # In-course quiz engine
│   │   ├── Common.jsx        # Design tokens, Avatar, Card, Logo
│   │   ├── Inputs.jsx        # Btn, Field components
│   │   ├── Icon.jsx          # Lucide icon wrapper
│   │   ├── Footer.jsx        # Global footer
│   │   └── UIExtras.jsx      # Toast, Modal components
│   ├── stores/
│   │   └── useLmsStore.js    # Zustand global state (auth, courses, progress)
│   └── hooks/
│       └── useProgress.js    # Lesson progress hook
│
├── backend/                  # NestJS API
│   └── src/
│       ├── auth/             # JWT, OTP, password logic + email service
│       ├── courses/          # Course, chapter, lesson CRUD
│       ├── progress/         # Student progress tracking
│       └── uploads/          # File/media uploads
│
└── infrastructure/
    └── nginx.conf            # Nginx SPA + reverse proxy config
```

---

## 🚀 Local Development

```bash
# Frontend
npm install
npm run dev          # starts on http://localhost:5173

# Backend
cd backend
npm install
npm run start:dev    # starts on http://localhost:3000
```

---

## 📡 Deployment

Deployments are automatic — push to `main` and the Azure server pulls, builds, and restarts via PM2.

```bash
# Manual deploy
git push origin main
# On Azure VM (auto-triggered or manual):
git pull origin main && npm run build
cd backend && npm run build && pm2 restart all
```

---

## 🛡️ Auth Flow

| Action | Behaviour |
|---|---|
| **Sign Up (new email)** | Creates account → sends OTP → verify → logged in → welcome email sent |
| **Sign Up (existing email)** | Modal: "Account already exists" → one-click to Log In tab |
| **Log In (correct password)** | Direct login — no OTP required for verified accounts |
| **Log In (wrong password)** | Error banner: "Wrong password" |
| **Log In (unknown email)** | Modal: "Account not found" → one-click to Sign Up tab |
| **Forgot Password** | Email → OTP → new password (confirmed twice) → logged in |

---

*Developed for LiteRight Academy by Litelab Professional Services, Milano.*
