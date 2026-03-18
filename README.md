<div align="center">
  <h1>plug-and-play-agents</h1>
  <p><strong>AI-powered brand analysis and ad generation — from URL to campaign in minutes.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js">
    <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Chakra%20UI-v3-teal?logo=chakraui" alt="Chakra UI">
    <img src="https://img.shields.io/badge/Supabase-green?logo=supabase" alt="Supabase">
    <img src="https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel" alt="Vercel">
    <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
  </p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [✨ Features](#-features)
- [🖥️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [🔐 Authentication](#-authentication)
- [🧪 Running Tests](#-running-tests)
- [📦 Available Scripts](#-available-scripts)
- [🌐 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## Overview

Users enter a website URL → plug and playa gents scrapes and analyses brand signals via SSE streaming.

Generates 5 distinct brand positioning contexts (Brand Overview, Target Audience, Value Proposition, Tone & Voice, Key Differentiators). User selects a context, picks an ad template, configures tone/platform/CTA.

Authenticated users get AI-generated ad variations (headlines, body copy, CTAs) via the API. Guest-first flow: analysis is free and anonymous; login is only required at generation time (delayed auth architecture).

---

## ✨ Features

| Feature                 | Description                                                 |
| ----------------------- | ----------------------------------------------------------- |
| Guest brand analysis    | No login required for initial URL analysis.                 |
| SSE real-time streaming | Real-time progress updates during brand signal processing.  |
| 5 AI context blocks     | Automatically generated positioning contexts.               |
| Ad template engine      | LinkedIn + Instagram ad creation.                           |
| Delayed authentication  | Guest → claim → generate seamless flow.                     |
| Supabase Auth           | Google OAuth + Magic Link + Email/Password.                 |
| Responsive design       | Mobile-first, fluid layout across devices.                  |
| Space Grotesk identity  | Custom purple/orange brand identity with modern typography. |
| 7-step guided flow      | Clear, navigable step bar orchestrating the tool logic.     |

---

## 🖥️ Tech Stack

| Layer      | Technology                            | Notes                                   |
| ---------- | ------------------------------------- | --------------------------------------- |
| Framework  | Next.js 16 (App Router)               | Core React framework.                   |
| UI Library | Chakra UI v3                          | Accessible component system.            |
| Animation  | Framer Motion v12                     | Fluid transitions & micro-interactions. |
| Language   | TypeScript 5                          | Strict type-safety.                     |
| Auth       | Supabase Auth (@supabase/supabase-js) | Backend-as-a-service auth.              |
| Styling    | Tailwind CSS v4 + Chakra tokens       | Combined utility & token styling.       |
| Icons      | Lucide React                          | Minimalist SVG icons.                   |
| Font       | Space Grotesk                         | Google Fonts via `next/font`.           |
| State      | React Context + custom hooks          | No Redux/Zustand required.              |
| Testing    | Playwright                            | Full E2E test coverage.                 |
| Deployment | Vercel                                | Seamless edge deployment.               |

---

## 📁 Project Structure

```bash
plug-and-play-agents-v2/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — Chakra Provider, Space Grotesk font
│   │   ├── page.tsx                # Landing page (marketing)
│   │   └── onboarding/
│   │       └── page.tsx            # Tool orchestrator — 7-step flow
│   ├── components/
│   │   ├── landing/                # Marketing page sections (DO NOT EDIT)
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeatureGrid.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── UseCases.tsx
│   │   │   └── FinalCTA.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Landing page navbar (fixed, frosted glass)
│   │   │   └── Footer.tsx          # Site footer
│   │   └── tool/
│   │       ├── ToolNavbar.tsx      # App navbar (sticky, auth-aware)
│   │       ├── StepBar.tsx         # 7-step progress indicator
│   │       ├── AuthModal.tsx       # Supabase auth modal (login/signup/Google/magic link)
│   │       ├── Page1URL.tsx        # Step 1: Enter URL + brand name
│   │       ├── Page2Analysing.tsx  # Step 2: SSE streaming analysis progress
│   │       ├── Page3Results.tsx    # Step 3: View 5 brand context cards
│   │       ├── Page4SelectContext.tsx  # Step 4: Confirm context selection
│   │       ├── Page5TemplateOptions.tsx # Step 5: Choose template, tone, platform
│   │       ├── Page6Generating.tsx # Step 6: Generating ad variations
│   │       ├── Page7Output.tsx     # Step 7: Final output — copy, export
│   │       └── Toast.tsx           # Ephemeral notification component
│   ├── lib/
│   │   ├── api.ts                  # ALL API calls — single source of truth
│   │   ├── supabase.ts             # Supabase client singleton
│   │   ├── contextSplitter.ts      # Splits context_md into 5 indexed blocks
│   │   └── delayedAuth.ts          # localStorage helpers for guest→claim flow
│   ├── store/
│   │   └── authStore.tsx           # React Context — Supabase auth state + delayed auth
│   ├── hooks/
│   │   └── useToolState.ts         # All tool step state + handlers
│   ├── types/
│   │   ├── index.ts
│   │   └── tool.ts                 # All TypeScript interfaces
│   ├── config/
│   │   └── toolData.ts             # Static template/context config data
│   ├── utils/
│   │   └── contentEngine.ts        # Content generation logic
│   ├── theme/
│   │   └── index.ts                # Chakra UI custom theme tokens
│   └── styles/
│       └── globals.css             # Global styles, scrollbar, animations
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── AUTH_FLOW.md
│   └── CONTRIBUTING.md
├── tests/
│   └── e2e/                        # Playwright E2E tests
├── public/                         # Static assets
├── .env.local.example              # Environment variable template
├── playwright.config.ts            # Playwright configuration
└── package.json
```

---

## 🚀 Getting Started

**Prerequisites:**

- Node.js >= 18.17.0
- npm >= 9.0.0
- A Supabase project

```bash
# 1. Clone the repository
git clone https://github.com/Sagolsa78/plug and playa gents-v2.git
cd plug and playa gents-v2

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local and fill in your values

# 4. Run the development server
npm run dev

# 5. Open the app
# Visit http://localhost:3000
```

---

## ⚙️ Environment Variables

| Variable                        | Required | Description                           |
| ------------------------------- | -------- | ------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✅ Yes   | Your Supabase project URL             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes   | Supabase anon/public key              |
| `NEXT_PUBLIC_API_URL`           | ✅ Yes   | plug and playa gents backend base URL |

---

## 🔐 Authentication

plug and playa gents uses two distinct authentication flows:

- **Standard flow (returning user)**: Sign in → JWT → all API calls authenticated.
- **Delayed auth flow (new/guest user)**: Discover the tool completely free up to generating final assets. Friction is introduced only at the end.

```
[User enters URL] → [Guest brand created] → [brand_id saved to localStorage]
       ↓
[User clicks Generate] → [pending_action saved] → [Auth modal opens]
       ↓
[User logs in] → [brand claimed via POST /brands/{id}/claim]
       ↓
[pending_action replayed] → [Ad variations generated] → [localStorage cleared]
```

Full details are available in [`docs/AUTH_FLOW.md`](docs/AUTH_FLOW.md).

---

## 🧪 Running Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run tests with UI mode (recommended for development)
npm run test:e2e:ui

# Run a specific test file
npx playwright test tests/e2e/onboarding.spec.ts

# View last test report
npx playwright show-report
```

---

## 📦 Available Scripts

| Script                | Description                         |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Start dev server on port 3000       |
| `npm run build`       | Production build                    |
| `npm run start`       | Start production server             |
| `npm run lint`        | Run ESLint                          |
| `npm run test:e2e`    | Run Playwright E2E tests headlessly |
| `npm run test:e2e:ui` | Run Playwright with interactive UI  |
| `npx tsc --noEmit`    | TypeScript type check (no output)   |

---

## 🌐 API Reference

Brief summary of the plug and playa gents backend API structure. Full reference can be found in [`docs/API.md`](docs/API.md).

| Method | Endpoint                     | Auth   | Description               |
| ------ | ---------------------------- | ------ | ------------------------- |
| POST   | `/auth/signup`               | None   | Register new user         |
| POST   | `/auth/signin`               | None   | Authenticate user         |
| POST   | `/brands`                    | None   | Create brand + SSE stream |
| GET    | `/brands/{id}/context`       | Bearer | Get brand context_md      |
| POST   | `/brands/{id}/claim`         | Bearer | Claim guest brand         |
| POST   | `/brands/{id}/ad-variations` | Bearer | Generate ad variations    |

---

## 🤝 Contributing

We welcome contributions! Please read [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) for details on our code of conduct, development process, branch naming conventions, and how to submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. Copyright © 2026 plug and playa gents.

## 🙏 Acknowledgements

- Next.js
- Chakra UI
- Supabase
- Framer Motion
- Lucide React
- Vercel
