# Literight Academy: Project Evolution & Fix Log

This document tracks the architectural growth and bug fixes of the Literight Academy LMS platform.

---

## 🏛️ Phase 1: Base Architecture (Prototype)
**Timestamp:** 2026-04-09
- **Initial State:** Local React application using Vite.
- **Data Model:** Completely in-memory `COURSES` constant.
- **Key Limitation:** Changes made in the browser were lost on refresh; no persistence across devices.

## ☁️ Phase 2: Cloud Deployment (Azure)
**Timestamp:** 2026-04-15
- **Infrastructure:** Deployed to Azure Ubuntu 22.04 VM ("Jarvis").
- **Web Server:** Configured Nginx to serve the production build from `/home/smdhussain06/literight/dist`.
- **Connectivity:** Integrated Cloudflare Quick Tunnel for public HTTPS access without a permanent domain.
- **Process Management:** Leveraged PM2 to ensure the backend remains active 24/7.

## 💾 Phase 3: Backend Persistence & Sync
**Timestamp:** 2026-04-16 (Early Session)
- **Engine:** Built a NestJS backend to handle data storage.
- **Storage:** Implemented a JSON-based file database (`backend/data/courses.json`) for course persistence.
- **Bug Fix (Data Loss):** Resolved the "volatile data" issue. Course edits in the Admin Panel now survive server restarts and browser refreshes.
- **Curriculum Integration:** Successfully mapped the full `course_outline.md` into the dynamic course builder.

## 🔐 Phase 4: Session Persistence & Media Pipeline
**Timestamp:** 2026-04-16 (Current Session)

### ✨ Bug Fix: Automatic Logout on Refresh
- **Issue:** Users were logged out every time they reloaded the page.
- **Solution:** Switched status management to `localStorage`. The application now checks for a saved session on boot, keeping users logged in permanently until they click "Logout".

### ✨ Bug Fix: Media Upload Engine
- **Issue:** File uploads were failing or not appearing correctly.
- **Solution (Backend):** Created `UploadsModule` to save images and videos to the server's disk.
- **Solution (Infrastructure):** Expanded the Nginx "Security Gate" limit from 1MB to 500MB (allowing professional video clips).
- **Solution (UI):** Updated `CourseCard` components to stop using placeholders and start rendering real uploaded `thumbnail` images.

---

## 🛠️ Summary of Key Technical Changes
| Component | Change Type | Description |
|-----------|-------------|-------------|
| **Nginx** | Infrastructure | Increased `client_max_body_size` & configured `/uploads` proxy. |
| **NestJS** | Feature | Created `UploadsController` with Multer disk storage. |
| **React** | UX/UI | Replaced placeholder circles with real `img` tags; implemented `localStorage` auth sync. |
| **Data** | Architecture | Transitioned from `COURSES` constant to `courses.json` API delivery. |

---
*Last updated: 2026-04-16T21:30:00Z by Antigravity*
