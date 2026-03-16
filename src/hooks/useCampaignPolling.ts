"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pollCampaignStatus, getCampaignAssets } from "@/api";
import type { CampaignStatus, CampaignAsset } from "@/types/onboarding.types";

const POLL_INTERVAL_MS = 4000;

export interface CampaignTracker {
  campaignId: string;
  contextIndex: number;
  contextTitle: string;
  templateId: string;
  templateLabel: string;
}

export interface CampaignState {
  /** All campaigns being tracked */
  trackers: CampaignTracker[];
  /** Merged status across all campaigns */
  statuses: Record<string, CampaignStatus>;
  /** Completed assets grouped by campaignId */
  assets: Record<string, CampaignAsset[]>;
  /** Overall progress 0-100 */
  progress: number;
  /** true while any campaign is still running */
  isPolling: boolean;
  /** Error message if polling fails */
  error: string | null;
}

export function useCampaignPolling(token: string | undefined) {
  const [trackers, setTrackers] = useState<CampaignTracker[]>([]);
  const [statuses, setStatuses] = useState<Record<string, CampaignStatus>>({});
  const [assets, setAssets] = useState<Record<string, CampaignAsset[]>>({});
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchedCampaigns = useRef<Set<string>>(new Set());

  const addCampaign = useCallback((tracker: CampaignTracker) => {
    setTrackers((prev) => {
      if (prev.some((t) => t.campaignId === tracker.campaignId)) return prev;
      return [...prev, tracker];
    });
    setIsPolling(true);
    setError(null);
  }, []);

  const clearCampaigns = useCallback(() => {
    setTrackers([]);
    setStatuses({});
    setAssets({});
    setIsPolling(false);
    setError(null);
    fetchedCampaigns.current.clear();
  }, []);

  // Compute overall progress
  const progress = (() => {
    const allStatuses = Object.values(statuses);
    if (allStatuses.length === 0) return 0;
    const totalComplete = allStatuses.reduce((sum, s) => sum + s.complete, 0);
    const totalJobs = allStatuses.reduce((sum, s) => sum + s.total, 0);
    if (totalJobs === 0) return 0;
    return Math.round((totalComplete / totalJobs) * 100);
  })();

  // Poll loop
  useEffect(() => {
    if (!token || trackers.length === 0) return;

    const poll = async () => {
      const activeCampaignIds = trackers
        .map((t) => t.campaignId)
        .filter((id) => !fetchedCampaigns.current.has(id));

      if (activeCampaignIds.length === 0) {
        setIsPolling(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      try {
        const results = await Promise.all(
          activeCampaignIds.map((id) => pollCampaignStatus(id, token))
        );

        setStatuses((prev) => {
          const next = { ...prev };
          for (const status of results) {
            next[status.campaign_id] = status;
          }
          return next;
        });

        // Fetch assets for campaigns that have any completed images
        for (const status of results) {
          if (status.complete > 0) {
            try {
              const assetData = await getCampaignAssets(status.campaign_id, token);
              const allAssets = Object.values(assetData.by_context).flat();
              setAssets((prev) => ({
                ...prev,
                [status.campaign_id]: allAssets,
              }));
            } catch {
              // Assets fetch failed, don't block
            }
          }
          // Mark fully complete campaigns so we stop polling them
          if (status.status === "complete") {
            fetchedCampaigns.current.add(status.campaign_id);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Polling failed");
      }
    };

    // Initial poll immediately
    poll();

    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [token, trackers]);

  return {
    trackers,
    statuses,
    assets,
    progress,
    isPolling,
    error,
    addCampaign,
    clearCampaigns,
  };
}
