"use client";

import { Box } from "@chakra-ui/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import UseCases from "@/components/landing/UseCases";
import HowItWorks from "@/components/landing/HowItWorks";
import FeatureGrid from "@/components/landing/FeatureGrid";
import FinalCTA from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <Box bg="brandSoft" color="brandDark" minH="100vh" className="antialiased">
      <Navbar />
      <HeroSection />
      <UseCases />
      <HowItWorks />
      <FeatureGrid />
      <FinalCTA />
      <Footer />
    </Box>
  );
}

