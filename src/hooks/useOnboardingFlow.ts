"use client";

import { useState, useCallback } from "react";
import type { BrandContext, GeneratedContent, PendingAction } from "@/types/onboarding.types";
import { CTXS } from "@/config";
import { buildContent } from "@/utils/contentEngine";
import { savePendingAction } from "@/lib/delayedAuth";
import { buildAdVariationsPayload } from "@/utils/payloadBuilder";

export function useOnboardingFlow() {
  // Step navigation
  const [curStep, setCurStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);

  // Page 1
  const [url, setUrl] = useState("");
  const [brandName, setBrandName] = useState("");

  // Page 3 – Brand contexts
  const [ctx, setCtx] = useState<BrandContext[]>(CTXS);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [bm, setBm] = useState<Set<number>>(new Set());
  const [likes, setLikes] = useState<Set<number>>(new Set());
  const [selCtx, setSelCtx] = useState<number | null>(null);

  // Page 5 – Template / options
  const [selTpl, setSelTpl] = useState<string | null>(null);
  const [selIgTpl, setSelIgTpl] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string>("carousel");
  const [tone, setTone] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string>("moderate");
  const [cta, setCta] = useState<string>("");
  const [offer, setOffer] = useState<string>("");
  const [slideN, setSlideN] = useState<number>(5);
  const [userBrief, setUserBrief] = useState<string>("");

  // Dynamic template fields
  const [dynFields, setDynFields] = useState<Record<string, string>>({});

  // Output
  const [gen, setGen] = useState<GeneratedContent | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup">("login");

  // Clipboard toast
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // View mode for results page
  const [p3View, setP3View] = useState<"list" | "grid">("list");

  // ─── Navigation ────────────────────────────────────────────────────

  const goTo = useCallback(
    (step: number) => {
      setCurStep(step);
      setMaxReached((prev) => Math.max(prev, step));
    },
    []
  );

  const next = useCallback(() => goTo(curStep + 1), [curStep, goTo]);
  const prev = useCallback(() => goTo(Math.max(1, curStep - 1)), [curStep, goTo]);

  // ─── Page 1 ────────────────────────────────────────────────────────

  const handleAnalyse = useCallback(
    (inputUrl: string, inputBrandName: string) => {
      setUrl(inputUrl);
      setBrandName(inputBrandName);
      goTo(2);
    },
    [goTo]
  );

  // ─── Page 2 (Analysis complete) ────────────────────────────────────

  const handleAnalysisDone = useCallback((contexts: string[]) => {
    if (contexts && contexts.length > 0) {
      const newContexts: BrandContext[] = contexts.map((body, idx) => {
        // Extract title from markdown heading (e.g., "## 1. Environmental Impact" -> "Environmental Impact")
        const titleMatch = body.match(/^##\s*\d+\.\s*(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : `Brand Identity ${idx + 1}`;
        // Remove the heading from body for cleaner display
        const cleanBody = body.replace(/^##\s*\d+\.\s*.+$/m, "").trim();
        return {
          id: idx + 1,
          title,
          body: cleanBody,
        };
      });
      setCtx(newContexts);
    }
    goTo(3);
  }, [goTo]);

  // ─── Page 3 actions ────────────────────────────────────────────────

  const selectCtx = useCallback((id: number) => {
    setSelCtx((prev) => (prev === id ? null : id));
  }, []);

  const rateCtx = useCallback((id: number, stars: number) => {
    setRatings((prev) => ({ ...prev, [id]: stars }));
  }, []);

  const toggleBm = useCallback((id: number) => {
    setBm((prev) => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });
  }, []);

  const toggleLike = useCallback((id: number) => {
    setLikes((prev) => {
      const n = new Set(prev);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });
  }, []);

  const useSelected = useCallback(() => {
    if (selCtx !== null) goTo(4);
  }, [selCtx, goTo]);

  const handleGoTemplates = useCallback(() => {
    if (selCtx !== null) goTo(4);
  }, [selCtx, goTo]);

  const setField = useCallback((fieldId: string, value: string) => {
    setDynFields((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    // Save pending action for delayed authentication flow
    if (selCtx !== null) {
      const payload = buildAdVariationsPayload(selCtx, userBrief, platform);
      const pendingAction: PendingAction = {
        type: "GENERATE_VARIATIONS",
        params: payload,
      };
      savePendingAction(pendingAction);
    }
    goTo(6);
  }, [goTo, selCtx, userBrief, platform]);

  // ─── Copy helper ──────────────────────────────────────────────────

  const copyText = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMsg("Copied to clipboard!");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2000);
    });
  }, []);

  // ─── Modal helpers ─────────────────────────────────────────────────

  const openLogin = useCallback(() => {
    setModalMode("login");
    setModalOpen(true);
  }, []);

  const openSignup = useCallback(() => {
    setModalMode("signup");
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);

  // ─── Reset ─────────────────────────────────────────────────────────

  const newAnalysis = useCallback(() => {
    setUrl("");
    setBrandName("");
    setCtx(CTXS);
    setRatings({});
    setBm(new Set());
    setLikes(new Set());
    setSelCtx(null);
    setSelTpl(null);
    setSelIgTpl(null);
    setTone(null);
    setEmoji("moderate");
    setCta("");
    setOffer("");
    setSlideN(5);
    setUserBrief("");
    setDynFields({});
    setGen(null);
    setPlatform("carousel");
    setCurStep(1);
    setMaxReached(1);
    setP3View("list");
  }, []);

  return {
    // State
    curStep,
    maxReached,
    url,
    brandName,
    ctx,
    ratings,
    bm,
    likes,
    selCtx,
    selTpl,
    selIgTpl,
    platform,
    tone,
    emoji,
    cta,
    offer,
    slideN,
    userBrief,
    dynFields,
    gen,
    modalOpen,
    modalMode,
    toastMsg,
    toastVisible,
    p3View,

    // Navigation
    goTo,
    next,
    prev,

    // Page 1
    handleAnalyse,
    setBrandName,

    // Page 2
    handleAnalysisDone,

    // Page 3
    selectCtx,
    rateCtx,
    toggleBm,
    toggleLike,
    useSelected,
    handleGoTemplates,

    // Page 5
    setPlatform,
    setSelTpl,
    setSelIgTpl,
    setTone,
    setEmoji,
    setCta,
    setOffer,
    setSlideN,
    setUserBrief,
    setField,
    handleGenerate,
    setGen,

    // Modal
    openLogin,
    openSignup,
    closeModal,
    setModalMode,
    setModalOpen,

    // Misc
    copyText,
    newAnalysis,
    setP3View,
    setCtx,
  };
}
