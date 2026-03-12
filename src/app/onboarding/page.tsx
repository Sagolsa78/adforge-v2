"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useOnboardingFlow } from "@/hooks";
import { AuthProvider } from "@/store/AuthProvider";

import ToolNavbar from "@/components/tool/ToolNavbar";
import StepBar from "@/components/tool/StepBar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/tool/AuthModal";
import URLInput from "@/components/tool/URLInput";
import BrandAnalysis from "@/components/tool/BrandAnalysis";
import ContextResults from "@/components/tool/ContextResults";
import TemplateOptions from "@/components/tool/TemplateOptions";
import AdGeneration from "@/components/tool/AdGeneration";
import AdOutput from "@/components/tool/AdOutput";

function ToolContent() {
  const ts = useOnboardingFlow();

  return (
    <Box bg="#faf5ff" minH="100vh" overflowX="hidden">
      {/* Tool Navbar */}
      <ToolNavbar
        user={null}
        onLoginClick={ts.openLogin}
        onSignupClick={ts.openSignup}
        onLogout={() => {}}
        onHome={() => {}}
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
        onAuthSuccess={() => {}}
      />

      {/* Pages */}
      {ts.curStep === 1 && <URLInput onAnalyse={ts.handleAnalyse} />}

      {ts.curStep === 2 && (
        <BrandAnalysis
          url={ts.url}
          brandName={ts.brandName}
          onDone={ts.handleAnalysisDone}
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
          onUseSelected={ts.handleGoTemplates}
          onNewAnalysis={ts.newAnalysis}
          onCopy={ts.copyText}
        />
      )}

      {ts.curStep === 4 && (
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
          userBrief={ts.userBrief}
          isLoggedIn={false}
          onBack={ts.prev}
          onSelPlatform={ts.setPlatform}
          onSelTpl={ts.setSelTpl}
          onSelIgTpl={ts.setSelIgTpl}
          onSelTone={(t: string) => ts.setTone(t)}
          onSelEmoji={ts.setEmoji}
          onSetCta={ts.setCta}
          onSetOffer={ts.setOffer}
          onSetSlideN={ts.setSlideN}
          onSetUserBrief={ts.setUserBrief}
          onSetField={ts.setField}
          onGenerate={ts.handleGenerate}
          onOpenLogin={ts.openLogin}
        />
      )}

      {ts.curStep === 5 && <AdGeneration onDone={() => ts.goTo(6)} />}

      {ts.curStep === 6 && ts.gen && (
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
