"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useToolState } from "@/hooks/useToolState";
import { useAuth, AuthProvider } from "@/store/authStore";

import ToolNavbar from "@/components/tool/ToolNavbar";
import StepBar from "@/components/tool/StepBar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/tool/AuthModal";
import Page1URL from "@/components/tool/Page1URL";
import Page2Analysing from "@/components/tool/Page2Analysing";
import Page3Results from "@/components/tool/Page3Results";
import Page4SelectContext from "@/components/tool/Page4SelectContext";
import Page5TemplateOptions from "@/components/tool/Page5TemplateOptions";
import Page6Generating from "@/components/tool/Page6Generating";
import Page7Output from "@/components/tool/Page7Output";

import type { GeneratedContent } from "@/types/tool";

// Mock generated content for demo
const MOCK_GEN: GeneratedContent = {
  slides: [
    {
      num: 1,
      h: "Stop guessing your brand voice",
      b: "Most companies spend months trying to find their positioning. There's a faster way.",
      cov: true,
    },
    {
      num: 2,
      h: "The hidden cost of brand confusion",
      b: "When your messaging doesn't resonate, every marketing dollar works harder — not smarter.",
      cov: false,
    },
    {
      num: 3,
      h: "Enter AI-powered brand DNA analysis",
      b: "Our algorithm scans your entire web presence and extracts 5 distinct positioning angles in minutes.",
      cov: false,
    },
    {
      num: 4,
      h: "From insight to content in one click",
      b: "Choose your favourite context, pick a template, and watch your content write itself.",
      cov: false,
    },
    {
      num: 5,
      h: "Ready to decode your brand?",
      b: "Try AdForge free today — no credit card required. Your first analysis takes under 2 minutes.",
      cov: false,
    },
  ],
  caption:
    "Your brand has a story — most companies just can't articulate it clearly.\n\nWe built AdForge to change that. In under 2 minutes, our AI analyses your entire web presence and generates 5 sharp positioning angles you can immediately turn into content.\n\nStop guessing. Start generating.\n\n🔗 Link in bio to try it free.",
  hashtags: [
    "#BrandStrategy",
    "#ContentMarketing",
    "#AIMarketing",
    "#AdForge",
    "#BrandDNA",
    "#MarketingTips",
  ],
  prompts: [
    {
      lbl: "Cover Slide",
      txt: "A clean, modern graphic with bold typography reading 'Stop guessing your brand voice' on a deep purple background with subtle geometric patterns. Minimalist style, high contrast.",
    },
    {
      lbl: "Insight Slide",
      txt: "Abstract data visualization showing brand signals being extracted from a website. Soft purple and orange gradient background. Futuristic, clean design.",
    },
    {
      lbl: "CTA Slide",
      txt: "Clean call-to-action design reading 'Try AdForge Free' with a glowing purple button on a white background. Professional, trust-building aesthetic.",
    },
  ],
};

function ToolContent() {
  const router = useRouter();
  const { user, session, signOut } = useAuth();
  const ts = useToolState();

  const onHome = useCallback(() => router.push("/"), [router]);

  const handleAuthSuccess = useCallback(() => {
    ts.closeModal();
  }, [ts]);

  const handleGenDone = useCallback(() => {
    ts.setGen(MOCK_GEN);
    ts.goTo(7);
  }, [ts]);

  return (
    <Box bg="#faf5ff" minH="100vh" overflowX="hidden">
      {/* Tool Navbar */}
      <ToolNavbar
        user={user}
        onLoginClick={ts.openLogin}
        onSignupClick={ts.openSignup}
        onLogout={signOut}
        onHome={onHome}
      />

      {/* Step Bar */}
      <StepBar
        curStep={ts.curStep}
        maxReached={ts.maxReached}
        onNav={ts.goTo}
      />

      {/* Auth Modal */}
      <AuthModal
        open={ts.modalOpen}
        mode={ts.modalMode}
        onClose={ts.closeModal}
        onSwitch={ts.setModalMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Pages */}
      {ts.curStep === 1 && <Page1URL onAnalyse={ts.handleAnalyse} />}

      {ts.curStep === 2 && (
        <Page2Analysing
          url={ts.url}
          brandName={ts.brandName}
          token={session?.access_token}
          onDone={() => ts.goTo(3)}
          onBack={() => ts.goTo(1)}
        />
      )}

      {ts.curStep === 3 && (
        <Page3Results
          url={ts.url}
          ctx={ts.ctx}
          ratings={ts.ratings}
          bm={ts.bm}
          likes={ts.likes}
          selCtx={ts.selCtx}
          onSelect={ts.selectCtx}
          onRate={ts.rateCtx}
          onToggleBm={ts.toggleBm}
          onToggleLike={ts.toggleLike}
          onUseSelected={ts.useSelected}
          onNewAnalysis={ts.newAnalysis}
          onCopy={ts.copyText}
        />
      )}

      {ts.curStep === 4 && (
        <Page4SelectContext
          ctx={ts.ctx}
          selCtx={ts.selCtx}
          onSelect={ts.selectCtx}
          onBack={ts.prev}
          onNext={ts.next}
        />
      )}

      {ts.curStep === 5 && (
        <Page5TemplateOptions
          ctx={ts.ctx}
          selCtx={ts.selCtx}
          selTpl={ts.selTpl}
          selIgTpl={ts.selIgTpl}
          platform={ts.platform}
          tone={ts.tone}
          emoji={ts.emoji}
          cta={ts.cta}
          offer={ts.offer}
          slideN={ts.slideN}
          isLoggedIn={!!user}
          onBack={ts.prev}
          onSelPlatform={ts.setPlatform}
          onSelTpl={ts.setSelTpl}
          onSelIgTpl={ts.setSelIgTpl}
          onSelTone={(t: string) => ts.setTone(t)}
          onSelEmoji={ts.setEmoji}
          onSetCta={ts.setCta}
          onSetOffer={ts.setOffer}
          onSetSlideN={ts.setSlideN}
          onSetField={ts.setField}
          onGenerate={ts.handleGenerate}
          onOpenLogin={ts.openLogin}
        />
      )}

      {ts.curStep === 6 && <Page6Generating onDone={handleGenDone} />}

      {ts.curStep === 7 && ts.gen && (
        <Page7Output
          gen={ts.gen}
          onCopy={ts.copyText}
          onBack={ts.prev}
          onNewAnalysis={ts.newAnalysis}
        />
      )}

      {/* Toast notification */}
      {ts.toastVisible && (
        <Flex
          position="fixed"
          bottom={6}
          left="50%"
          transform="translateX(-50%)"
          bg="#111827"
          color="white"
          px={5}
          py={3}
          rounded="full"
          boxShadow="0 10px 40px rgba(0,0,0,0.15)"
          align="center"
          gap={2}
          zIndex={1000}
          fontSize="sm"
          fontWeight="bold"
        >
          <Text>✓</Text>
          <Text>{ts.toastMsg}</Text>
        </Flex>
      )}

      {/* Footer */}
      <Footer />
    </Box>
  );
}

export default function OnboardingPage() {
  return (
    <AuthProvider>
      <ToolContent />
    </AuthProvider>
  );
}
