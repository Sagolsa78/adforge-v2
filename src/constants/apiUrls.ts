/**
 * API URL Constants
 * Centralised configuration for all API endpoints
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
export const API_VERSION = "/api/v1";

export const API_ENDPOINTS = {
  // Brand Discovery
  BRANDS: `${API_BASE_URL}${API_VERSION}/data/brands`,
} as const;
