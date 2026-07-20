# FreeOS — The Freelancer Operations System 🚀

<div align="center">
  <p align="center">
    <img src="./assets/images/freeos-logo.png" width="120" alt="FreeOS Logo" />
  </p>
  <h3 align="center">FreeOS</h3>
  <p align="center">
    A production-grade, keyboard-first, and highly unified operations system designed specifically for modern freelancers.
  </p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Expo-56-000020?style=for-the-badge&logo=expo" alt="Expo" />
  <img src="https://img.shields.io/badge/Express-4.22-black?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Neon-Database-00E676?style=for-the-badge&logo=neon" alt="Neon" />
</p>

🌐 **Live Web Application:** [https://freeos-web.vercel.app](https://freeos-web.vercel.app)
🤖 **Mobile Production APK:** [Direct Download Link](https://github.com/davariijs/freelanceros/releases/download/v1.0.0/freeos.apk)

---

## 🖼️ Application Showcase (Mockups)

<table width="100%">
  <tr>
    <td width="50%" align="center" valign="top">
      <b>💻 Web Admin Dashboard</b>
      <br/><br/>
      <img src="./assets/images/dashboard.png" width="100%" alt="Web Dashboard Preview" />
    </td>
    <td width="50%" align="center" valign="top">
      <b>🔗 Secure Client Portal</b>
      <br/><br/>
      <img src="./assets/images/portal.png" width="100%" alt="Client Portal Preview" />
    </td>
  </tr>

  <tr>
    <td width="50%" align="center" valign="top">
      <b>📱 Mobile Native App</b>
      <br/><br/>
      <img src="./assets/images/mobile.jpg" width="50%" alt="Mobile App Preview" />
      <p><i>(Replace with your Mobile Native App Screenshot)</i></p>
    </td>
    <td width="50%" align="center" valign="top">
      <b>🔋 Home Screen Widget</b>
      <br/><br/>
      <img src="./assets/images/widget.jpg" width="50%" alt="Native Widget Preview" />
      <p><i>(Replace with your Android/iOS Native Widget Screenshot)</i></p>
    </td>
  </tr>
</table>

---

# 🛠️ Tech Stack & Workspace Architecture

FreeOS is built as a highly decoupled **Monorepo** managed with **pnpm Workspaces** and accelerated by **Turborepo**.

## Frontend (Web)

- Next.js 16 (App Router)
- Tailwind CSS v4
- Framer Motion
- Fuse.js (Fuzzy Search)

## Mobile

- React Native
- Expo SDK 56
- NativeWind v5
- Expo SecureStore
- Expo Push Notifications

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM v7

## Database

- Serverless PostgreSQL
- Neon Database

## CI/CD

- GitHub Actions
- Vercel Deployments
- Automated Vercel Cron Jobs

---

# 📂 Directory Structure

```text
freelanceros/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── apps/
│   ├── web/                # Next.js Application
│   ├── api/                # Express API
│   └── mobile/             # Expo Mobile App
├── packages/
│   ├── database/           # Prisma & PostgreSQL
│   ├── eslint-config/      # Shared ESLint
│   ├── prettier-config/    # Shared Prettier
│   └── ts-config/          # Shared TypeScript
```

---

# ⚡ Core Business Features & Capabilities

## 👥 1. Client Share Portal (B2B Roster)

Generate secure token-based links (`/shared/:token`) so clients can monitor project progress, completed tasks, and timelines without requesting manual updates.

---

## 🔔 2. Smart Multi-Channel Deadline Alerts

Exactly one day before project deadlines, FreeOS automatically sends:

- Web dashboard notifications
- Native mobile push notifications
- Email notifications via Nodemailer

---

## 📝 3. Connected Rich-Text Notes

Write Markdown notes and optionally attach them directly to a Task (`taskId`) so documentation always stays connected to execution.

---

## 🎨 4. Immersive 3D Landing Page

An interactive landing page built with:

- React Three Fiber
- Three.js
- Framer Motion

The virtual workspace smoothly animates according to scroll position.

---

## 🤖 5. Native Mobile Widgets & Biometrics

### Home Screen Widget

Native Android/iOS widgets display synchronized tasks in real time.

### Biometrics

Supports:

- Fingerprint Unlock
- Face ID
- Expo LocalAuthentication

---

## ⌨️ 6. Keyboard-First Workspace

### Command Palette (`Ctrl + K`)

Search across:

- Clients
- Projects
- Tasks
- Notes

Supports inline commands like:

```text
> task Fix login bug
```

which instantly creates a new task.

---

## 🌍 7. Dual Language & RTL Engine

Complete localization support for:

- 🇺🇸 English (LTR)
- 🇮🇷 Persian (RTL)

Available across:

- Web Dashboard
- Mobile Application
- Email Notifications

---

# 🚀 Quick Start (Local Development)

## 1. Installation

Install all workspace dependencies:

```bash
pnpm install
```

---

## 2. Database Sync

Configure your PostgreSQL connection inside `.env`, then execute:

```bash
pnpm --filter @freelanceos/database db:generate
pnpm --filter @freelanceos/database db:migrate
```

---

## 3. Running Services

Start workspace applications in development mode.

### Express Backend API

```bash
pnpm --filter @freelanceos/api dev
```

### Next.js Web Application

```bash
pnpm --filter @freelanceos/web dev
```

### Expo Mobile Development Server

```bash
pnpm --filter @freelanceos/mobile start -- --dev-client --clear
```

---

# 📦 Mobile Deployment (EAS Build)

## Development APK (Local)

```bash
cd apps/mobile && eas build --platform android --profile development --local --non-interactive
```

## Production APK (Expo Cloud)

```bash
cd apps/mobile && eas build --platform android --profile production-apk --non-interactive
```
