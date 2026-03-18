/**
 * Landing Page Constants
 */

import { Globe, BrainCircuit, LayoutTemplate, CalendarClock } from "lucide-react";

export const USE_CASES = [
  {
    title: "Know your brand before you advertise",
    tags: [
      { label: "brand analysis", color: "#0a1e7a", bg: "#e1e7ff" },
      { label: "AI insights", color: "#0a1e7a", bg: "#dbe3ff" },
      { label: "competitor scan", color: "#0a1e7a", bg: "#cfd8ff" },
    ],
    description:
      "plug-and-play-agents scans your website, notes your tone, audience, and positioning, and delivers a one-page brand blueprint before you spend a rupee on ads.",
    image: "/usecase-website-ads.png",
    bgColor: "#e4edff",
    direction: "row" as const,
  },
  {
    title: "Launch campaigns in minutes, not days",
    tags: [
      { label: "quick launch", color: "#0a1e7a", bg: "#dbe3ff" },
      { label: "multi-platform", color: "#0a1e7a", bg: "#cfd8ff" },
      { label: "auto-schedule", color: "#0a1e7a", bg: "#e1e7ff" },
    ],
    description:
      "Go from brand analysis to a scheduled launch in under 10 minutes. plug and playa gents writes the strategy, copy, and publishing schedule for you.",
    image: "/usecase-campaign-launch.png",
    bgColor: "#dfe7ff",
    direction: "row-reverse" as const,
  },
  {
    title: "Multi-platform ad distribution",
    tags: [
      { label: "Instagram", color: "#0a1e7a", bg: "#cfd8ff" },
      { label: "LinkedIn", color: "#0a1e7a", bg: "#dbe3ff" },
      { label: "YouTube", color: "#0a1e7a", bg: "#e4edff" },
      { label: "Reels + Stories", color: "#0a1e7a", bg: "#cfd8ff" },
    ],
    description:
      "Generate and schedule ads for every platform at once, with formats and captions tuned to what each audience expects.",
    image: "/usecase-social-ads.png",
    bgColor: "#e3ebff",
    direction: "row" as const,
  },
  {
    title: "AI-powered creative generation",
    tags: [
      { label: "smart copy", color: "#0a1e7a", bg: "#dbe3ff" },
      { label: "visual ads", color: "#0a1e7a", bg: "#cfd8ff" },
      { label: "A/B variants", color: "#0a1e7a", bg: "#e1e7ff" },
    ],
    description:
      "Choose your campaign context and plug and playa gents outputs multiple visual and copy variations that keep your tone and goals aligned.",
    image: "/usecase-html-banners.png",
    bgColor: "#e8f0ff",
    direction: "row-reverse" as const,
  },
] as const;

// src/constants/landing.ts — HOW_IT_WORKS_STEPS section only (rest stays the same)

export const HOW_IT_WORKS_STEPS = [
  {
    num: "01",
    icon: Globe,
    title: "Paste your website URL",
    description:
      "Point the agent at your website and it crawls your brand to understand tone, messaging, and positioning.",
    color: "#0F4BF3",
    bgColor: "rgba(15, 75, 243, 0.12)",
  },
  {
    num: "02",
    icon: BrainCircuit,
    title: "Review the brand analysis",
    description:
      "See a tailored report summarizing your audience, values, and creative direction — review and confirm before generating posts.",
    color: "#0F4BF3",
    bgColor: "rgba(15, 75, 243, 0.16)",
  },
  {
    num: "03",
    icon: LayoutTemplate,
    title: "Generate tailored creatives",
    description:
      "Choose your content context and get reels, carousels, captions, and copy — built specifically for Instagram and aligned with your identity.",
    color: "#0F4BF3",
    bgColor: "rgba(15, 75, 243, 0.1)",
  },
  {
    num: "04",
    icon: CalendarClock,
    title: "Schedule & launch on Instagram",
    description:
      "Set your calendar and watch the agent publish your Instagram content automatically — no manual work needed.",
    color: "#0F4BF3",
    bgColor: "rgba(15, 75, 243, 0.18)",
  },
] as const;

// Animation Variants
export const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const CARD_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};
