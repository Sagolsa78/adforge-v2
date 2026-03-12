"use client";

import { useState, useCallback } from "react";
import type { BrandContext, GeneratedContent } from "@/types/tool";
import { CTXS } from "@/config/toolData";

export function useToolState() {
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
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const toggleLike = useCallback((id: number) => {
    setLikes((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const useSelected = useCallback(() => {
    if (selCtx !== null) goTo(4);
  }, [selCtx, goTo]);

  // ─── Page 5 ────────────────────────────────────────────────────────

  const setField = useCallback((fieldId: string, value: string) => {
    setDynFields((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    goTo(6);
  }, [goTo]);

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

    // Page 3
    selectCtx,
    rateCtx,
    toggleBm,
    toggleLike,
    useSelected,

    // Page 5
    setPlatform,
    setSelTpl,
    setSelIgTpl,
    setTone,
    setEmoji,
    setCta,
    setOffer,
    setSlideN,
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
