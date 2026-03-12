/**
 * Discovery Stream Interfaces
 * Types for real-time agent streaming functionality
 */

export interface DiscoveryEvent {
  thought?: string;
  image?: string;
  message?: string;
  step?: string;
  chunk?: string;
  brand_id?: string;
  progress?: number;
}

export type DiscoveryStatus = "idle" | "browsing" | "generating" | "finished" | "error";

export interface DiscoveryStreamResult {
  isRunning: boolean;
  status: DiscoveryStatus;
  thoughts: string[];
  contexts: string[];
  browserImage: string;
  error: string | null;
  startDiscovery: (url: string, brandName: string) => void;
  stopDiscovery: () => void;
  resetDiscovery: () => void;
}
