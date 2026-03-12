"use client";

import { Box } from "@chakra-ui/react";
import { useToolState } from "@/hooks/useToolState";
import ToolNavbar from "@/components/tool/ToolNavbar";
import StepBar from "@/components/tool/StepBar";
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
    <LightMode>
      <Box className="tool-app" bg="bg" minH="100vh">
        <ToolNavbar
        auth={auth}
        onLogin={() => { setModalMode("login"); setModalOpen(true); }}
        onSignup={() => { setModalMode("signup"); setModalOpen(true); }}
        onLogout={handleLogout}
        onHome={handleNewAnalysis}
      />
      <StepBar curStep={curStep} maxReached={maxReached} onNav={goStep} />
      <AuthModal
        open={modalOpen}
        mode={modalMode}
        onClose={() => setModalOpen(false)}
        onSwitch={setModalMode}
        onAuth={handleAuth}
      />
      <Toast msg={toastMsg} visible={toastVisible} />

      {curStep === 1 && <Page1URL onAnalyse={handleAnalyse} />}
      {curStep === 2 && <Page2Analysing url={url} brandName={brandName} onDone={handleAnalysisDone} />}
      {curStep === 3 && (
        <Page3Results
          url={url} ctx={ctx} ratings={ratings} bm={bm} likes={likes} selCtx={selCtx}
          onSelect={handleSelectCtx} onRate={handleRate} onToggleBm={handleToggleBm}
          onToggleLike={handleToggleLike} onUseSelected={handleUseSelected}
          onNewAnalysis={handleNewAnalysis} onCopy={copyToCB}
        />
      )}
      {curStep === 4 && (
        <Page4SelectContext ctx={ctx} selCtx={selCtx} onSelect={handleSelectCtx} onBack={() => goStep(3)} onNext={handleGoTemplates} />
      )}
      {curStep === 5 && (
        <Page5TemplateOptions
          ctx={ctx} selCtx={selCtx} selTpl={selTpl} selIgTpl={selIgTpl}
          platform={platform} tone={tone} emoji={emoji} cta={cta} offer={offer} slideN={slideN} auth={auth}
          onBack={() => goStep(4)} onSelPlatform={setPlatform} onSelTpl={setSelTpl}
          onSelIgTpl={setSelIgTpl} onSelTone={setTone} onSelEmoji={setEmoji}
          onSetCta={setCta} onSetOffer={setOffer} onSetSlideN={setSlideN}
          onSetField={handleSetField} onGenerate={handleGenerate} onOpenLogin={() => { setModalMode("login"); setModalOpen(true); }}
        />
      )}
      {curStep === 6 && <Page6Generating onDone={handleGenerateDone} />}
      {curStep === 7 && gen && (
        <Page7Output gen={gen} onCopy={copyToCB} onBack={() => goStep(5)} onNewAnalysis={handleNewAnalysis} />
      )}
      </Box>
    </LightMode>
  );
}
