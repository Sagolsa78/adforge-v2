import { useState, useCallback, useMemo } from "react";
import { AuthState, BrandContext, GeneratedContent } from "@/types/tool";
import { CTXS } from "@/config/toolData";
import { buildContent } from "@/utils/contentEngine";

export function useToolState() {
  const [curStep, setCurStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [url, setUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [ctx, setCtx] = useState<BrandContext[]>(CTXS);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [bm, setBm] = useState<Set<number>>(new Set());
  const [likes, setLikes] = useState<Set<number>>(new Set());
  const [selCtx, setSelCtx] = useState<number | null>(null);
  const [selTpl, setSelTpl] = useState<string | null>(null);
  const [selIgTpl, setSelIgTpl] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null);
  const [emoji, setEmoji] = useState("minimal");
  const [platform, setPlatform] = useState("linkedin");
  const [cta, setCta] = useState("");
  const [offer, setOffer] = useState("");
  const [slideN, setSlideN] = useState(6);
  const [gen, setGen] = useState<GeneratedContent | null>(null);
  const [auth, setAuth] = useState<AuthState>({ loggedIn: false, name: "", email: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup">("login");
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [dynFields, setDynFields] = useState<Record<string, string>>({});

  const goStep = useCallback((n: number) => {
    setCurStep(n);
    setMaxReached((p) => Math.max(p, n));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  }, []);

  const copyToCB = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => toast("Copied to clipboard!")).catch(() => toast("Copy failed"));
  }, [toast]);

  const handleAnalyse = useCallback((u: string, bName: string) => {
    setUrl(u);
    setBrandName(bName);
    goStep(2);
  }, [goStep]);

  const handleAnalysisDone = useCallback((contexts?: string[]) => {
    if (contexts && contexts.length > 0) {
      // Convert API contexts to BrandContext format
      const newContexts: BrandContext[] = contexts.map((body, idx) => ({
        id: idx + 1,
        title: `Brand Identity ${idx + 1}`,
        body,
      }));
      setCtx(newContexts);
    }
    goStep(3);
  }, [goStep]);

  const handleUpdateContexts = useCallback((newContexts: string[]) => {
    if (newContexts.length > 0) {
      const formattedContexts: BrandContext[] = newContexts.map((body, idx) => ({
        id: idx + 1,
        title: `Brand Identity ${idx + 1}`,
        body,
      }));
      setCtx(formattedContexts);
    }
  }, []);

  const handleSelectCtx = useCallback((id: number) => {
    setSelCtx((prev) => (prev === id ? null : id));
  }, []);

  const handleRate = useCallback((id: number, stars: number) => {
    setRatings((p) => ({ ...p, [id]: stars }));
  }, []);

  const handleToggleBm = useCallback((id: number) => {
    setBm((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const handleToggleLike = useCallback((id: number) => {
    setLikes((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }, []);

  const handleUseSelected = useCallback(() => { if (selCtx != null) goStep(4); }, [selCtx, goStep]);
  const handleGoTemplates = useCallback(() => goStep(5), [goStep]);

  const handleGenerate = useCallback(() => {
    if (!auth.loggedIn) { setModalOpen(true); return; }
    goStep(6);
  }, [auth.loggedIn, goStep]);

  const handleGenerateDone = useCallback(() => {
    try {
      const content = buildContent({
        url, ctx, ratings, bm, likes, selCtx, selTpl, selIgTpl,
        tone, emoji, platform, cta, offer, slideN, curStep, gen,
        hookQuestion: dynFields.hookQuestion || "",
        mythStatement: dynFields.mythStatement || "",
        realityStatement: dynFields.realityStatement || "",
        problemStatement: dynFields.problemStatement || "",
        solutionStatement: dynFields.solutionStatement || "",
        stepCount: dynFields.stepCount || "",
        frameworkName: dynFields.frameworkName || "",
        clientName: dynFields.clientName || "",
        resultBefore: dynFields.resultBefore || "",
        resultAfter: dynFields.resultAfter || "",
        statFact: dynFields.statFact || "",
        visionOutcome: dynFields.visionOutcome || "",
        processStep: dynFields.processStep || "",
        ownBrand: dynFields.ownBrand || "",
        rivalBrand: dynFields.rivalBrand || "",
        communityTag: dynFields.communityTag || "",
        igStoryAngle: dynFields.igStoryAngle || "",
        igHeroMoment: dynFields.igHeroMoment || "",
        igCoreFact: dynFields.igCoreFact || "",
        igBrandSolution: dynFields.igBrandSolution || "",
        igProof: dynFields.igProof || "",
        igOfferDetails: dynFields.igOfferDetails || "",
        igDeadline: dynFields.igDeadline || "",
        igPrice: dynFields.igPrice || "",
        igKeyBenefits: dynFields.igKeyBenefits || "",
        igCustomerName: dynFields.igCustomerName || "",
        igQuote: dynFields.igQuote || "",
        igVariety: dynFields.igVariety || "",
        igResult: dynFields.igResult || "",
        igMission: dynFields.igMission || "",
        igImpactStat: dynFields.igImpactStat || "",
        igCampaign: dynFields.igCampaign || "",
        igCTA: dynFields.igCTA || "",
        modalOpen, modalMode, toastMsg, toastVisible, toastColor: "",
        p3View: "list",
      });
      setGen(content);
    } catch {
      setGen({
        slides: [{ h: "Generated Content", b: "Your content has been generated based on your selections.", num: 1, cov: true }],
        caption: "Your content caption here.",
        hashtags: ["#BrandDNA", "#ContentMarketing"],
        prompts: [{ lbl: "Cover Image", txt: "Clean editorial design with brand colors and bold typography." }],
      });
    }
    goStep(7);
  }, [url, ctx, ratings, bm, likes, selCtx, selTpl, selIgTpl, tone, emoji, platform, cta, offer, slideN, curStep, gen, dynFields, modalOpen, modalMode, toastMsg, toastVisible, goStep]);

  const handleAuth = useCallback((name: string, email: string) => {
    setAuth({ loggedIn: true, name, email });
    setModalOpen(false);
    toast(`Welcome, ${name}!`);
  }, [toast]);

  const handleLogout = useCallback(() => {
    setAuth({ loggedIn: false, name: "", email: "" });
    toast("Logged out");
  }, [toast]);

  const handleSetField = useCallback((key: string, val: string) => {
    setDynFields((p) => ({ ...p, [key]: val }));
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setUrl("");
    setBrandName("");
    setCtx(CTXS);
    setSelCtx(null);
    setSelTpl(null);
    setSelIgTpl(null);
    setGen(null);
    setRatings({});
    setBm(new Set());
    setLikes(new Set());
    setDynFields({});
    setCurStep(1);
    setMaxReached(1);
  }, []);

  const memoedBm = useMemo(() => bm, [bm]);
  const memoedLikes = useMemo(() => likes, [likes]);

  return {
    curStep, maxReached, url, brandName, ctx, ratings, bm: memoedBm, likes: memoedLikes,
    selCtx, selTpl, selIgTpl, tone, emoji, platform, cta, offer, slideN, gen, auth,
    modalOpen, modalMode, toastMsg, toastVisible,
    setModalMode, setModalOpen, setPlatform, setSelTpl, setSelIgTpl, setTone, setEmoji, setCta, setOffer, setSlideN,
    goStep, handleAnalyse, handleAnalysisDone, handleUpdateContexts, handleSelectCtx, handleRate, handleToggleBm, handleToggleLike,
    handleUseSelected, handleGoTemplates, handleGenerate, handleGenerateDone, handleAuth, handleLogout,
    handleSetField, handleNewAnalysis, copyToCB
  };
}
