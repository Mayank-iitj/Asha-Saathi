<div align="center">

# 🩺 ASHA-Saathi: The Voice-Powered Offline Copilot

**Empowering the 1 million heroes of rural healthcare with AI.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-blue?style=for-the-badge&logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange?style=for-the-badge&logo=google)](https://cloud.google.com/vertex-ai)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?style=for-the-badge&logo=prisma)](https://prisma.io)

[View Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

<br />

ASHA-Saathi is a **Progressive Web App (PWA)** engineered specifically for India's Accredited Social Health Activists (ASHAs). It transforms the tedious, paper-based data entry process into a frictionless, **voice-first** experience that works flawlessly **without internet connectivity**.

---

## ✨ Key Features

### 🎙️ Voice-to-Data AI (Offline-First)
No more typing or filling out endless forms. Workers simply speak into their phones in Hindi or Hinglish (e.g., *"Sunita devi, 7 months pregnant, BP is 150/96"*). Our local fallback regex and **Google Gemini** integration extract the vitals, symptoms, and visit context instantly.

### 📶 Zero-Internet Architecture
Built for the deepest rural pockets. The app queues all logs locally using **Dexie.js** (IndexedDB). Once the device catches a signal, a background sync engine silently pushes the encrypted data to the cloud.

### 🏆 Built-in Gamification
ASHAs are the backbone of rural health, yet they are under-compensated and overworked. ASHA-Saathi introduces a gamified "Gold/Silver" tier system with daily targets and progression bars to drive motivation and engagement.

### 📡 Outbreak Radar & Escalation
Supervisors get a real-time heatmap of anomalies. If a worker logs a patient with a high fever and rash, the system's risk-engine triggers an automatic escalation to the Medical Officer, catching outbreaks before they spread.

### 🪪 Digital ABHA Integration
A beautiful, highly-accessible digital replica of the Ayushman Bharat Health Account (ABHA) ID card is available right in the app for instant verification and QR scanning.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React, Tailwind CSS v3, Shadcn UI |
| **Backend** | Next.js Edge API Routes, Prisma ORM, PostgreSQL |
| **Authentication**| NextAuth.js (Google OAuth) |
| **AI / ML** | Google GenAI SDK (`@google/genai`) |
| **Offline Storage**| Dexie.js (IndexedDB wrapper) + Web App Manifest (PWA) |

---

## 🚀 Local Installation & Setup

Want to run ASHA-Saathi locally? Follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/Mayank-iitj/Asha-Saathi.git
cd Asha-Saathi
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following keys:
```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_super_secret_string"

# Google OAuth (Create these in Google Cloud Console)
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Prisma Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/ashasaathi"
```
*(Note: If you do not have Google API keys, you can still view the landing page, but the OAuth sign-in will fail).*

### 4. Database Setup
Push the Prisma schema to your local database:
```bash
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. 

---

## 🧠 How the Offline Sync Works

1. **Capture:** Voice data is captured via the Web Speech API.
2. **Extract:** The data is structured locally (or via Gemini if online).
3. **Queue:** The structured JSON is saved into the browser's `IndexedDB` (using `Dexie.js`) with a status of `pending`.
4. **Sync:** A custom `useSyncEngine` hook listens for the browser's `online` event. Upon connection, it flushes the queue to the Next.js API, verifying the JWT session via NextAuth.
5. **Clear:** Once the server responds with 200 OK, the local records are marked as `synced` and cleared.

---

## 🎨 Design Philosophy

The UI is built leveraging a premium, editorial design system inspired by top-tier SaaS platforms. It features:
- A breathtaking radial-gradient marketing landing page.
- Pastel category-coded taxonomy.
- Strict lightweight typography (Inter/Labil Grotesk) to ensure readability on low-end mobile devices.
- A fixed `pb-safe` bottom navigation bar optimized specifically for mobile thumb-reachability.

---
<div align="center">
  <p>Built with ❤️ for Healthcare Hackathons.</p>
</div>
