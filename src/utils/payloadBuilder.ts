/**
 * Payload Builder
 * Utilities for constructing API payloads from onboarding state
 */

import type { AdVariationsPayload } from "@/types/onboarding.types";

/**
 * Builds the ad variations payload from user selections
 * @param contextIndex - Selected context ID (1-5)
 * @param userBrief - User's content brief/focus
 * @param platform - Target platform (linkedin, instagram, twitter, facebook)
 * @returns Payload ready for POST /brands/{id}/ad-variations
 */
export function buildAdVariationsPayload(
  contextIndex: number | null,
  userBrief: string,
  platform: string
): AdVariationsPayload {
  // Map platform to ad_type
  const adTypeMap: Record<string, string> = {
    linkedin: "professional",
    instagram: "visual",
    twitter: "conversational",
    facebook: "social",
    carousel: "carousel",
  };

  return {
    context_index: (contextIndex as 1 | 2 | 3 | 4 | 5) || 1,
    user_brief: userBrief || "Generate content based on selected context",
    ad_type: adTypeMap[platform] || platform,
  };
}

/**
 * Validates that the payload is complete and valid
 * @param payload - The payload to validate
 * @returns Object with isValid flag and any error messages
 */
export function validateAdVariationsPayload(payload: AdVariationsPayload): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!payload.context_index || payload.context_index < 1 || payload.context_index > 5) {
    errors.push("context_index must be between 1 and 5");
  }

  if (!payload.user_brief || payload.user_brief.trim().length === 0) {
    errors.push("user_brief is required");
  }

  if (!payload.ad_type || payload.ad_type.trim().length === 0) {
    errors.push("ad_type is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
