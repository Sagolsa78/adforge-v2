"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { DiscoveryStreamResult, DiscoveryStatus } from "@/interfaces/discovery";
import { getBrandStreamUrl } from "@/api/brand";

export function useDiscoveryStream(): DiscoveryStreamResult {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<DiscoveryStatus>("idle");
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [contexts, setContexts] = useState<string[]>([]);
  const [browserImage, setBrowserImage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const fullMarkdownRef = useRef("");

  const resetDiscovery = useCallback(() => {
    stopDiscovery();
    setIsRunning(false);
    setStatus("idle");
    setThoughts([]);
    setContexts([]);
    setBrowserImage("");
    setError(null);
    fullMarkdownRef.current = "";
  }, []);

  const stopDiscovery = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const startDiscovery = useCallback((url: string, brandName: string) => {
    resetDiscovery();
    setIsRunning(true);
    setStatus("browsing");

    const eventSource = new EventSource(getBrandStreamUrl(url, brandName));
    eventSourceRef.current = eventSource;

    eventSource.addEventListener("agent_thought", (e) => {
      const { thought } = JSON.parse(e.data);
      setThoughts((prev) => [...prev, thought]);
    });

    eventSource.addEventListener("browser_snapshot", (e) => {
      const { image } = JSON.parse(e.data);
      setBrowserImage(image);
    });

    eventSource.addEventListener("progress", (e) => {
      const data = JSON.parse(e.data);
      setThoughts((prev) => [...prev, data.message || "Processing..."]);
      if (data.step === "generating_context") {
        setStatus("generating");
      }
    });

    eventSource.addEventListener("context_chunk", (e) => {
      const { chunk } = JSON.parse(e.data);
      fullMarkdownRef.current += chunk;

      // Split on "## <number>." pattern
      const sections = fullMarkdownRef.current.split(/##\s*\d*\.?\s*/);

      // sections[0] is usually prologue, skip it
      const newContexts = sections.slice(1);
      setContexts(newContexts);
    });

    eventSource.addEventListener("complete", () => {
      setStatus("finished");
      setIsRunning(false);
      eventSource.close();
    });

    eventSource.addEventListener("error", (e: any) => {
      let msg = "Connection lost or interrupted.";
      if (e.data) {
        try {
          const data = JSON.parse(e.data);
          msg = data.message || msg;
        } catch {
          console.error("Failed to parse SSE error data:", e.data);
        }
      }
      setError(msg);
      setStatus("error");
      setIsRunning(false);
      eventSource.close();
    });
  }, [resetDiscovery]);

  useEffect(() => {
    return () => {
      stopDiscovery();
    };
  }, [stopDiscovery]);

  return {
    isRunning,
    status,
    thoughts,
    contexts,
    browserImage,
    error,
    startDiscovery,
    stopDiscovery,
    resetDiscovery,
  };
}
