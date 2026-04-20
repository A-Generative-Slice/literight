# 🎓 LiteRight Academy — Litelab Royale

**LiteRight Academy** is the definitive, security-first Learning Management System built for **Litelab Milano** — a global vanguard in architectural lighting. The platform delivers a cinematic, studio-grade educational experience through the "Litelab Royale" monochromatic design philosophy.

---

## 🌐 Live Platform

**[literight.centralindia.cloudapp.azure.com](http://literight.centralindia.cloudapp.azure.com)**

---

## ✨ Key Features

- **💎 Royale Aesthetic**: A premium monochromatic interface (`#000` / `#FFF`) featuring glassmorphism, heavy typography, and cinematic transitions.
- **🔐 Secure Authentication**: SHA-256 password hashing, 6-digit OTP email verification, and JWT session management.
- **🔑 Forgot Password**: Robust recovery pipeline — request code → verify → set new password.
- **🎬 Professional Player**: 16:9 mathematically perfect aspect ratio video playback with branded preview overlays.
- **📱 Stacked Architecture**: Responsive vertical logo architecture to prevent UI overlap on mobile devices.
- **🧭 Student Nexus**: A simplified, high-end profile dashboard for tracking progress and managing sessions.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Zustand, react-router-dom |
| **Styling** | Vanilla CSS (Royale Design System - Outfit + Inter) |
| **Backend** | NestJS (Node.js), TypeORM |
| **Database** | SQLite (`backend/data/lms.db`) |
| **Deploy** | Azure VM (Central India) — Nginx reverse proxy + PM2 |

---

## 📂 Project Structure

```
lms.ags/
├── src/                      # React frontend
│   ├── pages/                # Cinematic Route-level pages
│   │   ├── PublicLanding.jsx # Royale Hero & Course Listing
│   │   ├── AuthPage.jsx      # Hardened Sign Up/Log In/Recovery
│   │   ├── ProfilePage.jsx   # Student Nexus Dashboard
│   │   └── AdminPanel.jsx    # Instructor Course Builder
│   ├── components/           
│   │   ├── Common.jsx        # Stacked Logo, Royale Badges, Avatars
│   │   ├── Icon.jsx          # Architectural & Social Icon Set
│   │   └── Footer.jsx        # Monochromatic Global Footer
```

---

## 🚀 Deployment

The platform is synced atomically via established deployment scripts.

```bash
# Atomic sync to Azure
./sync_to_azure.sh
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
