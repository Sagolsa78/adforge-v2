# Contributing to AdForge v2

Welcome to AdForge v2! We appreciate your interest in contributing to our codebase. Please review the following guidelines before submitting any code.

## Code Style Rules

We enforce a strict and modern development environment to ensure long-term stability:

* **TypeScript Strictness**: We compile with strict mode enabled.
* **No `any` Types**: Do not bypass the type system. You must strictly define your interfaces or use `unknown` if truly dynamic, forcing type guards later.
* **Utility Purity**: Files within the `lib/` directory must utilize Named Exports exclusively. They must remain pure logic boundaries (No React, No JSX).

## Branch Naming Convention

Please prefix your branches correctly to help orchestrate CI workflows:

* `feat/` — For all brand new features or significant components. (e.g., `feat/linkedin-templates`)
* `fix/` — For patching bugs or state issues. (e.g., `fix/auth-modal-overflow`)
* `chore/` — For dependency updates, typo fixes, or minor configuration adjustments.

## Commit Message Format

AdForge v2 uses the [Conventional Commits](https://www.conventionalcommits.org/) specification:

* `feat:` A new feature.
* `fix:` A bug fix.
* `docs:` Documentation only changes.
* `chore:` Changes to the build process or auxiliary tools and libraries such as documentation generation.

Example: `feat: add Google OAuth support to login modal`

## Pull Request Checklist

Before submitting a PR, ensure your branch successfully answers true to the following requirements:

- [ ] **TypeScript Clean**: Run `npx tsc --noEmit` and ensure zero errors are reported.
- [ ] **ESLint Clean**: General linting must pass cleanly (`npm run lint`).
- [ ] **Tests Passing**: Playwright E2E tests must execute successfully (`npm run test:e2e`).
- [ ] **Clean Console**: Remove all temporary `console.log`, `console.warn`, or debugging statements before committing.

## The Frozen Zone: DO NOT EDIT

Certain architectural boundaries within this application are considered fundamentally feature-complete or strictly managed.

Unless explicitly approved via an architecture review issue, do **not** edit:
* Any component residing in `components/landing/`
* `components/layout/Navbar.tsx`

If you feel changes are necessary here, open a Discussion thread first.

## Running the Dev Environment Locally

```bash
# Clone the repo
git clone https://github.com/Sagolsa78/adforge-v2.git

# Install dependencies
npm install

# Setup local env file
cp .env.local.example .env.local
# You must provide a valid Supabase configuration inside .env.local

# Run the Next server
npm run dev

# Run tests locally
npm run test:e2e:ui
```
