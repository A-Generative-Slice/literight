# 🎓 LiteRight Academy

**LiteRight Academy** is a premium, security-first Learning Management System (LMS) designed to deliver a studio-grade educational experience. Built with a "Preview First" philosophy and inspired by the minimalist elegance of platforms like Domestika, it integrates Litelab’s professional heritage into a modern, high-performance web application.

---

## 🚀 Key Features

- **Premium UI/UX**: A dark-mode, obsidian and ruby design system optimized for focused learning and high-end visual appeal.
- **Secure Registration**: Industry-standard student enrollment with mandatory **6-digit OTP email verification**.
- **Curriculum Transparency**: A "Preview First" architecture allowing visitors to explore course structures before committing to enrollment.
- **Enterprise-Grade Infrastructure**: Automated deployments to Azure with Nginx reverse-proxying and PM2 process management.
- **Narrative Integration**: Custom sections detailing the Litelab Heritage and brand manifesto directly in the landing experience.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, TailwindCSS, Zustand (State Management)
- **Backend**: NestJS, Node.js
- **Database**: SQLite (Production-ready local instance)
- **Server**: Nginx (Static Serving & Reverse Proxy)
- **Monitoring**: PM2 (Process Manager)

---

## 📡 Deployment & Synchronization

The project includes a **Deep Clean** synchronization script designed to bypass local build caches and ensure the production server is always in perfect parity with the GitHub `main` branch.

### Quick Deploy:
```bash
# Authorizes the production build on the Azure VM
bash sync_to_azure.sh
```

## 📂 Project Structure

- `/src`: Frontend application and design system components.
- `/backend`: NestJS application logic, auth services, and course controllers.
- `/infrastructure`: Nginx configuration and deployment scripts.

---

## 🛡️ Security
Automated OTP-based identity verification prevents spam registrations and ensures that every student on the platform is verified and legitimate.

---
*Developed for LiteRight Academy by Litelab Professional Services.*
