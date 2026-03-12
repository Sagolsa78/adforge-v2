"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useOnboardingFlow } from "@/hooks";
import { useAuth, AuthProvider } from "@/store/AuthProvider";

import ToolNavbar from "@/components/tool/ToolNavbar";
import StepBar from "@/components/tool/StepBar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/tool/AuthModal";
import Toast from "@/components/tool/Toast";
import Page1URL from "@/components/tool/Page1URL";
import Page2Analysing from "@/components/tool/Page2Analysing";
import Page3Results from "@/components/tool/Page3Results";
import Page4SelectContext from "@/components/tool/Page4SelectContext";
import Page5TemplateOptions from "@/components/tool/Page5TemplateOptions";
import Page6Generating from "@/components/tool/Page6Generating";
import Page7Output from "@/components/tool/Page7Output";
import { LightMode } from "@/components/ui/color-mode";

export default function ToolPage() {
  const {
    curStep, maxReached, url, brandName, ctx, ratings, bm, likes,
    selCtx, selTpl, selIgTpl, tone, emoji, platform, cta, offer, slideN, gen, auth,
    modalOpen, modalMode, toastMsg, toastVisible,
    setModalMode, setModalOpen, setPlatform, setSelTpl, setSelIgTpl, setTone, setEmoji, setCta, setOffer, setSlideN,
    goStep, handleAnalyse, handleAnalysisDone, handleUpdateContexts, handleSelectCtx, handleRate, handleToggleBm, handleToggleLike,
    handleUseSelected, handleGoTemplates, handleGenerate, handleGenerateDone, handleAuth, handleLogout,
    handleSetField, handleNewAnalysis, copyToCB
  } = useToolState();

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
      {ts.curStep === 1 && <URLInput onAnalyse={ts.handleAnalyse} />}

      {ts.curStep === 2 && (
        <BrandAnalysis
          url={ts.url}
          brandName={ts.brandName}
          token={session?.access_token}
          onDone={() => ts.goTo(3)}
          onBack={() => ts.goTo(1)}
        />
      )}

      {ts.curStep === 3 && (
        <ContextResults
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
        <ContextSelector
          ctx={ts.ctx}
          selCtx={ts.selCtx}
          onSelect={ts.selectCtx}
          onBack={ts.prev}
          onNext={ts.next}
        />
      )}

      {ts.curStep === 5 && (
        <TemplateOptions
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

      {ts.curStep === 6 && <AdGeneration onDone={handleGenDone} />}

      {ts.curStep === 7 && ts.gen && (
        <AdOutput
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
