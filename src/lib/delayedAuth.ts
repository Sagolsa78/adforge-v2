import type { PendingAction } from "@/types/tool";

// ─── Keys ────────────────────────────────────────────────────────────

const KEY_BRAND_ID = "adforge_pending_brand_id";
const KEY_ACTION = "adforge_pending_action";

// ─── Brand ID helpers ────────────────────────────────────────────────

export function savePendingBrandId(id: string): void {
  localStorage.setItem(KEY_BRAND_ID, id);
}

export function getPendingBrandId(): string | null {
  return localStorage.getItem(KEY_BRAND_ID);
}

export function clearPendingBrandId(): void {
  localStorage.removeItem(KEY_BRAND_ID);
}

// ─── Pending action helpers ──────────────────────────────────────────

export function savePendingAction(action: PendingAction): void {
  localStorage.setItem(KEY_ACTION, JSON.stringify(action));
}

export function getPendingAction(): PendingAction | null {
  const raw = localStorage.getItem(KEY_ACTION);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingAction;
  } catch {
    return null;
  }
}

export function clearPendingAction(): void {
  localStorage.removeItem(KEY_ACTION);
}

// ─── Clear all delayed auth state ────────────────────────────────────

export function clearDelayedAuthState(): void {
  clearPendingBrandId();
  clearPendingAction();
}
