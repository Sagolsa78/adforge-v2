/**
 * Brand API
 * Unified API functions for brand discovery and analysis
 */

import { API_ENDPOINTS } from "@/constants/apiUrls";

export interface CreateBrandStreamOptions {
  websiteUrl: string;
  name?: string;
}

export interface BrandStreamData {
  progress?: number;
  step?: string;
  brand_id?: string;
  message?: string;
  thought?: string;
  image?: string;
  chunk?: string;
}

/**
 * Creates an SSE stream for brand discovery
 * @param websiteUrl - The brand website URL to analyze
 * @param name - Optional brand name
 * @returns AsyncIterableIterator of brand stream data
 */
export async function* createBrandStream(
  websiteUrl: string,
  name: string = ""
): AsyncIterableIterator<BrandStreamData> {
  const url = `${API_ENDPOINTS.BRANDS}?website_url=${encodeURIComponent(websiteUrl)}&name=${encodeURIComponent(name)}`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "text/event-stream",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to connect to brand stream: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get stream reader");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            yield { step: "completed", progress: 100 };
            return;
          }
          try {
            yield JSON.parse(data);
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Gets the SSE URL for brand discovery
 * @param websiteUrl - The brand website URL to analyze
 * @param name - Optional brand name
 * @returns The full SSE URL
 */
export function getBrandStreamUrl(websiteUrl: string, name: string = ""): string {
  return `${API_ENDPOINTS.BRANDS}?website_url=${encodeURIComponent(websiteUrl)}&name=${encodeURIComponent(name)}`;
}
