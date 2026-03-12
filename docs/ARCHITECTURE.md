# Architecture Overview

## 1. System Overview
AdForge v2 follows a typical client-server architecture separated by responsibilities. Our interactive Next.js application frontend is deployed on Vercel while our specialized AdForge backend API operates at `https://content.bhuexpert.com`. We rely on Supabase for robust authentication and potentially persistent database storage.

## 2. Frontend Architecture
The frontend is built on the modern Next.js 16 App Router. The routing structure is primarily split into two main experiences:
* `/` — The landing page for marketing. It's statically structured for performance and SEO.
* `/onboarding` — The core tool orchestrator, managing a complex 7-step interactive workflow.

### State Flow
State is layered effectively across the tool:
1. `AuthProvider` wraps the entire application, making user session data available everywhere.
2. `useToolState` manages the specific progress of the 7-step workflow (from URL input to Ad generation).
3. All external API communication channels through `src/lib/api.ts` providing a uniform error-handling and data transformation layer.

## 3. State Management

Our application utilizes three distinct layers of state:

* **Auth State**: Located in `src/store/authStore.tsx`. This uses React Context to wrap the Supabase session, providing a predictable `useAuth` hook.
* **Tool/Workflow State**: Located in `src/hooks/useToolState.ts`. This utilizes local `useState` to navigate between steps, record selections, and hold intermediate API results.
* **Persistence State**: Handled primarily via `src/lib/delayedAuth.ts`. This acts as our fallback layer bridging guest experiences to authenticated features ensuring user progress survives page reloads or OAuth redirects via `localStorage`.

### Data Flow Diagram

```text
AuthProvider (Supabase session)
    └── ToolPageInner
            ├── useToolState (step, selections, brandId, variations)
            ├── ToolNavbar  ← reads user from useAuth()
            ├── StepBar     ← reads curStep
            ├── AuthModal   ← calls signIn/signUp from useAuth()
            └── Page[N]     ← reads/writes tool state
```

## 4. API Layer
The `src/lib/api.ts` file acts as the single fetch boundary for the whole application. This pattern ensures any changes to standard headers, auth handling, or base URL logic occur in one single file.

### SSE Streaming Pattern
A crucial part of our architecture is Server-Sent Events (SSE). The `createBrandStream` function is structured as an `AsyncGenerator`. This allows `Page2Analysing` to `for await...of` consume incoming data events asynchronously. During this process, when a `brand_created` event arrives, the frontend intelligently intercepts the embedded `brand_id`.

## 5. Delayed Auth Architecture
Our system ensures users can experience the value of AdForge without immediate friction.

1. **Guest Phase**: A user submits a URL; we analyze it and display results without requiring login.
2. **Intent Phase**: When the user clicks to "Generate" variations based on their context selection, we capture this intended action via `localStorage` (keys defined in `lib/delayedAuth.ts`).
3. **Authentication Modal**: We then prompt for identification (Supabase Auth).
4. **Claim & Replay**: Post-login, our system automatically runs the `claim` API endpoint against the guest brand using the new user's authorization. If successful, the previously saved intent is automatically executed (generating variations).
5. **Cleanup Contract**: A strict requirement is implemented: always call `clearDelayedAuthState()` immediately after a successful claim and generation to ensure `localStorage` remains pristine.

## 6. Context Splitting Logic
The backend returns a large structured markdown string containing 5 distinct brand contexts.

We split this string client-side primarily utilizing a regex pattern akin to `\n## \d+\.\s.*?\n`.
* We prepend a newline `\n` to the raw string to ensure the first header optimally matches our regex.
* The pre-match section (`block[0]`) is purposefully ignored as setup text.
* The resulting `context_index` mapping (1 through 5) strictly dictates which portion of the overall data is sent back to the API during the actual ad generation phase.

## 7. Theme System
Our UI leverages Chakra UI v3 custom tokens mapped closely to a complementary Tailwind config.

* **Primary Color**: Purple `#8a2ce2`
* **Accent Color**: Orange `#ea580c`
* **Background**: Light `#faf5ff`
* **Typography**: Space Grotesk (Google Fonts via next/font)
* **Shadows/Gradients**: Custom soft tokens detailed in `theme/index.ts`

**Important Note**: The components inside `components/landing/` effectively exist in a frozen state. Focus heavily on expanding functionality within `components/tool/` and global themes.

## 8. Folder Conventions
* `lib/` → Pure utility logic. Strictly no React, no JSX, named exports exclusively.
* `store/` → React Context providers, generally minimal.
* `hooks/` → Dedicated custom React hooks (often wrapping Context or internal state engines).
* `components/tool/` → UI components specific to the app state that inherently connect to `useToolState`.
* `components/landing/` → Static presentation-focused UI. Never edited during core tool development.
