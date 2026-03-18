# Delayed Authentication Flow

## 1. Why Delayed Auth?

plug and playa gents v2 optimizes for maximum user acquisition by minimizing initial friction. Users can input their website and watch our AI execute a deep analysis completely for free, without needing to sign up.

Friction is intentionally delayed until the critical "value moment" — when the user attempts to generate the final, actionable ad variations base on their selected contexts.

## 2. Phase 1 — Guest Brand Creation

The journey begins at `Page1URL`. When a user submits a URL, the system invokes the `createBrandStream` API endpoint. Because no user session exists:

1. The API creates an anonymous/guest brand entity.
2. During the SSE stream, a specific `brand_created` event is fired.
3. The frontend intercepts this, extracts the `brand_id`, and stores it locally utilizing helper functions like `savePendingBrandId`.

## 3. Phase 2 — Intent Preservation

When a guest user completes their context selections and clicks **Generate**:

1. `useToolState.handleGenerate` detects `user === null`.
2. Rather than outright failure, it builds a payload detailing exactly what the user was trying to do (e.g., Generate IG Ads for Context 2 using Professional Tone).
3. It saves this object using `savePendingAction({...})` to `localStorage`.
4. Finally, it toggles the display of the `AuthModal` to force authentication.

## 4. Phase 3 — Post-Login Claim

`src/store/authStore.tsx` wraps the Supabase authentication provider. Inside, it utilizes `onAuthStateChange`.

When a transition to a `SIGNED_IN` event successfully occurs:

1. The store checks for the existence of a saved `brand_id`.
2. It automatically fires a `POST /brands/{id}/claim` request to the API, effectively transferring ownership of the guest brand entity mapping to the new user.

## 5. Phase 4 — Automatic Resumption

Immediately following a successful API claim response:

1. The store checks for a saved `pending_action`.
2. Because the user's intent was preserved in Phase 2, the application automatically invokes `generateAdVariations` passing back the exact payload previously halted.
3. The user seamlessly drops into `Page6Generating` without having to click "Generate" a second time or rebuild their options.

## 6. Cleanup Contract

To prevent chaotic state bleed across sessions or concurrent tabs, a strict cleanup contract is enforced via `clearDelayedAuthState()`.

This method **MUST** be called:

- Immediately after a successful claim and generation sequence.
- Immediately upon any error encountered _during_ the claim flow to ensure graceful UI failure preventing infinite loops.
- **Never** leave stale phase state lingering in `localStorage`.

## 7. OAuth Redirect Handling

When users utilize Google OAuth or Magic Links, they inherently leave the SPA and redirect back. We configure our Supabase authentication to enforce strict redirection continuously back to `/onboarding`.

Because our global `onAuthStateChange` listener inherently boots on that specific route, the system transparently catches the newly authenticated session and fires the Claim (Phase 3) automatically.

## 8. Edge Cases

- **Brand already claimed (HTTP 409)**: If for whatever reason the system tries to claim a brand that is already linked, we catch the `409 Conflict`, immediately execute `clearDelayedAuthState`, and allow the flow to continue normally (or error out based on local logic).
- **Invalid/Expired Token on Claim**: If the login session drops instantly, we fail gracefully. The state is cleared, an Error Toast is presented, and we do not break the entire web session.
- **SSE Disconnection before brand save**: If the user's internet drops before `brand_created` fires in Step 2, no `pending_brand_id` can be saved. Thus, the Generate button later on will safely trigger an error state requesting the user to restart the analysis.
