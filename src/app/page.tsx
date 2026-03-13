"use client";

import { Box } from "@chakra-ui/react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import UseCases from "@/components/landing/UseCases";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureGrid from "@/components/landing/FeatureGrid";
import FinalCTA from "@/components/landing/FinalCTA";
import AuthModal from "@/components/tool/AuthModal";

function HomeContent() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup">("login");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const callbackUrl = searchParams.get("callbackUrl");
    const error = searchParams.get("error");
    
    // If we land here from middleware (callbackUrl exists and points to dashboard)
    // or if there's an auth error, we show the login modal
    if (callbackUrl?.includes("/dashboard") || error) {
      setModalMode("login");
      setModalOpen(true);
      
      // If it's a specific error, we could show it
      if (error === "SessionRequired") {
        // Notification logic could go here if we had a toast system
      }
    }
  }, [searchParams]);

  const openLogin = () => {
    setModalMode("login");
    setModalOpen(true);
  };

  return (
    <Box bg="brandSoft" color="brandDark" minH="100vh" className="antialiased">
      <Navbar onLoginClick={openLogin} />
      <HeroSection />
      <UseCases />
      <HowItWorks />
      <FeatureGrid />
      <FinalCTA />
      <Footer />

      <AuthModal
        open={modalOpen}
        mode={modalMode}
        onClose={() => setModalOpen(false)}
        onSwitch={setModalMode}
        onAuthSuccess={() => {
          setModalOpen(false);
          router.push("/dashboard");
        }}
      />
    </Box>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Box minH="100vh" bg="brandSoft" />}>
      <HomeContent />
    </Suspense>
  );
}

