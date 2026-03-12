import { BrandContext, Template, IGTemplate, ContextMeta } from "@/types/onboarding.types";

export const CTXS: BrandContext[] = [
  {
    id: 1,
    title: "Direct Response",
    body: `Are you struggling to capture high-quality leads that actually convert?\n\nMost businesses pour money into ads and get nothing but vanity metrics in return. The problem isn't your product — it's your messaging.\n\nOur AI-driven platform analyses every visible signal on your website and LinkedIn presence to map exactly who your ideal buyer is, what they fear, and what makes them act.\n\nWe don't guess. We extract. Our engine processes your homepage copy, about page, case studies, and social posts to build a precision persona model — then generates campaigns engineered around that exact psychological profile.\n\nThe result? Campaigns that feel personal at scale. Leads that already believe in what you do before they book a call.`,
  },
  {
    id: 2,
    title: "Founder's Origin",
    body: `I spent 5 years building something nobody wanted.\n\nThe product was good. The team was great. But every campaign felt like screaming into a void. We'd launch, get a spike, then silence.\n\nThen I realised the truth about B2B growth: It's not about being louder, it's about being more precise.\n\nWe were talking to everyone — which meant resonating with no one. Our messaging was generic because we'd never decoded what our brand stood for at a DNA level.\n\nSo I built the tool I wished I had. One that reads your website, parses your LinkedIn, and tells you: here is who you are, here is who you're speaking to, and here is how to close the gap.`,
  },
  {
    id: 3,
    title: "The Contrarian View",
    body: `Most people think you need a massive ad budget to scale your SaaS.\n\nThey're entirely wrong.\n\nThe businesses that scale fastest aren't the ones spending most — they've achieved brand resonance precision. They know exactly who they're for, say it clearly, and every piece of content filters out the wrong people and magnetises the right ones.\n\nHere's the uncomfortable truth: most startups have already written everything they need. It's on their homepage, buried in their about page, scattered across LinkedIn posts from last quarter.\n\nAdForge doesn't generate ideas from thin air. It reads what you've already built, finds the throughline, and crystallises it into five actionable brand contexts.`,
  },
  {
    id: 4,
    title: "Social Proof",
    body: `When Meridian SaaS came to us, they had a 4% trial-to-paid conversion rate.\n\nTheir product solved a real problem. Their support was excellent. But their positioning was creating friction at exactly the wrong moment.\n\nIn 20 minutes, AdForge processed their website and LinkedIn. It surfaced something the team had missed: they were speaking to VP-level buyers with language designed for individual contributors.\n\nThey rewrote their homepage headline and two email sequences based on our output.\n\nSix weeks later: 11.3% trial-to-paid. Zero product changes. We just helped them say the right thing to the right person.`,
  },
  {
    id: 5,
    title: "Problem → Solution",
    body: `You've got a great product. A growing team. A marketing budget. So why does every campaign still feel like a gamble?\n\nHere's what nobody tells early-stage B2B founders: the bottleneck isn't your offer. It's your brand positioning.\n\nRight now, your website speaks one language. Your LinkedIn speaks another. Your ads speak a third. And your prospects — skimming everything in under eight seconds — are hearing noise.\n\nAdForge breaks this cycle. By extracting the positioning intelligence already embedded in your digital presence, we generate five distinct brand contexts — each one a complete messaging framework you can deploy immediately.`,
  },
];

export const CTX_META: ContextMeta[] = [
  { funnel: "Cold Audience", angle: "Direct Response", color: "0" },
  { funnel: "Warm Audience", angle: "Founder Story", color: "1" },
  { funnel: "Cold / Warm", angle: "Thought Leadership", color: "2" },
  { funnel: "Hot Audience", angle: "Social Proof", color: "3" },
  { funnel: "Cold Audience", angle: "Problem Aware", color: "4" },
];

export const TPLS: Template[] = [
  {
    id: "curiosity",
    name: "Curiosity Hook",
    desc: "Intriguing open question",
    cls: "tp2-cu",
    dynOpts: [{ id: "hookQuestion", lbl: "Opening Hook Question", ph: "e.g. What if your brand was costing you leads?", type: "text" }],
    prev: "HOOK",
  },
  {
    id: "myth",
    name: "Myth vs Reality",
    desc: "Bust a common belief",
    cls: "tp2-my",
    dynOpts: [
      { id: "mythStatement", lbl: "The Myth to Bust", ph: "e.g. You need a big ad budget to grow", type: "text" },
      { id: "realityStatement", lbl: "The Reality", ph: "e.g. You need brand precision, not more spend", type: "text" },
    ],
    prev: "MYTH",
  },
  {
    id: "problem",
    name: "Problem → Solution",
    desc: "Pain, agitation, fix",
    cls: "tp2-pr",
    dynOpts: [
      { id: "problemStatement", lbl: "The Core Problem", ph: "e.g. Campaigns that burn budget without converting", type: "text" },
      { id: "solutionStatement", lbl: "The Solution", ph: "e.g. Brand DNA precision changes everything", type: "text" },
    ],
    prev: "PAIN",
  },
  {
    id: "steps",
    name: "Step-by-Step",
    desc: "Clear numbered process",
    cls: "tp2-st",
    dynOpts: [
      { id: "stepCount", lbl: "Number of Steps", ph: "e.g. 5", type: "number" },
      { id: "frameworkName", lbl: "Framework Name", ph: "e.g. The Brand Clarity Method", type: "text" },
    ],
    prev: "HOW-TO",
  },
  {
    id: "socialproof",
    name: "Social Proof",
    desc: "Real result-led story",
    cls: "tp2-sp",
    dynOpts: [
      { id: "clientName", lbl: "Client / Company Name", ph: "e.g. Meridian SaaS", type: "text" },
      { id: "resultBefore", lbl: "Before Result", ph: "e.g. 4% trial-to-paid", type: "text" },
      { id: "resultAfter", lbl: "After Result", ph: "e.g. 11.3% in 6 weeks", type: "text" },
    ],
    prev: "PROOF",
  },
  {
    id: "didyouknow",
    name: "Did You Know",
    desc: "Surprising stat or insight",
    cls: "tp2-dy",
    dynOpts: [{ id: "statFact", lbl: "Surprising Stat or Fact", ph: "e.g. 72% of B2B buyers expect personalised messaging", type: "text" }],
    prev: "STAT",
  },
  {
    id: "vision",
    name: "Vision",
    desc: "Future-state imagination",
    cls: "tp2-vi",
    dynOpts: [{ id: "visionOutcome", lbl: "The Ideal Outcome / Vision", ph: "e.g. A brand so clear every post attracts the right buyer", type: "text" }],
    prev: "VISION",
  },
  {
    id: "behind",
    name: "Behind the Scenes",
    desc: "Raw, unfiltered process",
    cls: "tp2-bh",
    dynOpts: [{ id: "processStep", lbl: "Key Process Moment", ph: "e.g. The exact moment we found their positioning gap", type: "text" }],
    prev: "BTS",
  },
  {
    id: "comparison",
    name: "Old vs New",
    desc: "Side-by-side contrast",
    cls: "tp2-cm",
    dynOpts: [
      { id: "ownBrand", lbl: '"New Way" Label', ph: "e.g. Context-led content", type: "text" },
      { id: "rivalBrand", lbl: '"Old Way" Label', ph: "e.g. Random daily posting", type: "text" },
    ],
    prev: "VS",
  },
  {
    id: "community",
    name: "Community",
    desc: "Speak directly to your tribe",
    cls: "tp2-co",
    dynOpts: [{ id: "communityTag", lbl: "Who Is This For? (tagline)", ph: "e.g. Founders tired of blending in", type: "text" }],
    prev: "FOR YOU",
  },
];

export const IG_TPLS: IGTemplate[] = [
  {
    id: "ig_story",
    name: "🌿 Storytelling",
    kpi: "Saves & Shares",
    purpose: "Emotional Hook — connects through relatable stories before revealing your brand solution.",
    fields: [
      { id: "igStoryAngle", lbl: "Story Angle", ph: "e.g. A busy mom wanting chemical-free fruit for her child" },
      { id: "igHeroMoment", lbl: "Hero Moment", ph: "The turning point where your brand solves the problem" },
      { id: "igCTA", lbl: "Call to Action", ph: "e.g. DM us TREE to start your journey" },
    ],
    example: `🌱 She was tired of washing pesticides off fruit every morning. Riya, a Bengaluru mom of two, had a simple dream — fruit straight from the tree, zero chemicals.\n\nThen she found a solution. Today her family receives 50% of the harvest every season — farm to door. No middlemen. No chemicals.\n\n✨ Every story starts somewhere. What will yours be?\n\n👉 DM us TREE to adopt your tree today.`,
    tags: ["#FarmToHome", "#OrganicLiving", "#ConsciousEating"],
    cls: "tp-ig1",
    prev: "STORY",
  },
  {
    id: "ig_edu",
    name: "🚨 Educational",
    kpi: "Saves",
    purpose: "Did You Know — positions brand as expert, drives saves and long-term follower trust.",
    fields: [
      { id: "igCoreFact", lbl: "Core Fact / Stat", ph: "e.g. Regular mangoes use 45+ chemicals during growth" },
      { id: "igBrandSolution", lbl: "Brand Solution", ph: "How your brand solves this" },
      { id: "igProof", lbl: "Proof / Social Count", ph: "e.g. 850+ happy customers | 11 varieties" },
    ],
    example: `⚠️ Did you know? The average mango is exposed to 45+ synthetic chemicals before reaching your plate.\n\nPesticides. Artificial ripeners. Chemical fertilizers.\n\nHere's what we do differently:\n✅ Zero chemical pesticides\n✅ Zero synthetic fertilizers\n✅ 100% organic — verified & traceable\n\nYour fruit. Your tree. Your health.\n\n💾 Save this post to share with someone who needs to read it.`,
    tags: ["#OrganicFarming", "#FoodSafety", "#KnowYourFood", "#ChemicalFree"],
    cls: "tp-ig2",
    prev: "DID YOU KNOW?",
  },
  {
    id: "ig_offer",
    name: "🔥 Offer",
    kpi: "Clicks & DMs",
    purpose: "Limited-Time Promotion — drives immediate conversions with urgency and clear benefits.",
    fields: [
      { id: "igOfferDetails", lbl: "Offer Details", ph: "e.g. First 50 get a free mango hamper" },
      { id: "igDeadline", lbl: "Deadline / Scarcity", ph: "e.g. Only 20 spots left or Ends 31st March" },
      { id: "igPrice", lbl: "Price / Value", ph: "e.g. Starting at ₹2,999/year" },
    ],
    example: `🚨 BIG NEWS — Our Mango Season Pre-Adoption is NOW OPEN!\n\n🌳 Adopt your own exotic mango tree and receive:\n✅ 50% of the fresh organic harvest — delivered to your door\n✅ Choose from 11 rare varieties\n✅ Real-time tree updates via app\n\n⏳ Only 50 adoption slots available this season.\nStarting at just ₹2,999/year.\n\n👉 DM MANGO to reserve your tree.`,
    tags: ["#MangoSeason", "#LimitedOffer", "#FarmToTable"],
    cls: "tp-ig3",
    prev: "LIMITED",
  },
  {
    id: "ig_proof",
    name: "⭐ Testimonial",
    kpi: "Comments & DMs",
    purpose: "Social Proof — leverages real customer voices to build credibility and overcome hesitation.",
    fields: [
      { id: "igCustomerName", lbl: "Customer Name & Location", ph: "e.g. Kenji M., Osaka" },
      { id: "igQuote", lbl: "Their Quote / Review", ph: "Their actual words or key moment" },
      { id: "igResult", lbl: "Result / Emotion", ph: "What changed for them after adopting?" },
    ],
    example: `💬\n\n"I never thought I could own a mango tree in Japan. They made it real. Watching my tree grow through the app, knowing every mango will come to my family — it's something truly special."\n\n— Kenji M., Osaka 🇯🇵\n(Miyazaki Tree Partner)\n\n🌍\nJoin 850+ happy tree partners across the world. Your tree is waiting. 🌳\n\n👉 Link in bio to adopt yours today.`,
    tags: ["#CustomerLove", "#OrganicFarming", "#TreePartner"],
    cls: "tp-ig4",
    prev: "TESTIMONIAL",
  },
  {
    id: "ig_mission",
    name: "🌍 Mission",
    kpi: "Shares & Follows",
    purpose: "Brand Values — connects audience to larger vision: environmental impact and community empowerment.",
    fields: [
      { id: "igMission", lbl: "Mission Highlight", ph: "e.g. 10 million trees by 2030" },
      { id: "igImpactStat", lbl: "Impact Stats", ph: "e.g. 4,000+ trees planted | 25kg CO₂/year" },
      { id: "igCampaign", lbl: "Campaign Tie-in (Optional)", ph: "e.g. Earth Day, World Environment Day" },
    ],
    example: `🌍 We're on a mission to plant 10 MILLION fruit trees by 2030.\n\nNot just any trees — organic, exotic, life-giving fruit trees that feed families and heal the planet.\n\nHere's where we stand today:\n🌳 4,000+ trees in the ground\n👥 850+ tree partners and counting\n💨 25 kg of CO₂ absorbed per tree every year\n\nThis isn't just farming. This is the future.\n\n🙌 Adopt your tree today. For your family. For the planet.\n\n👉 Link in bio.`,
    tags: ["#PlantTrees", "#ClimateAction", "#10MillionTrees"],
    cls: "tp-ig5",
    prev: "MISSION",
  },
];

export const TPL_META: Record<string, { label: string; stat: string; use: string }> = {
  curiosity: { label: "HOOK", stat: "?", use: "Cold traffic" },
  myth: { label: "MYTH", stat: "⚡", use: "Awareness" },
  problem: { label: "PAIN", stat: "→", use: "Problem-aware" },
  steps: { label: "HOW-TO", stat: "1→5", use: "Education" },
  socialproof: { label: "PROOF", stat: "11.3%", use: "Decision stage" },
  didyouknow: { label: "STAT", stat: "72%", use: "Trust-build" },
  vision: { label: "VISION", stat: "∞", use: "Brand-building" },
  behind: { label: "BTS", stat: "BTS", use: "Authenticity" },
  comparison: { label: "VS", stat: "⚔", use: "Differentiation" },
  community: { label: "FOR YOU", stat: "👥", use: "Community" },
};

export const TPL_EXAMPLES: Record<string, { h: string; b: string }[]> = {
  curiosity: [
    { h: "What if your brand was costing you leads?", b: "Most marketers focus on reach. The best ones obsess over resonance." },
    { h: "The hidden problem nobody talks about", b: "Your message says everything — or nothing. There is no in-between." },
    { h: "What precision actually looks like", b: "5 positioning contexts. One perfect fit. Campaigns that compound." },
  ],
  myth: [
    { h: 'MYTH: "You need a big ad budget"', b: "This belief keeps thousands of great companies invisible." },
    { h: "REALITY: You need brand precision", b: "The clearest brands spend the least on acquisition. Always." },
    { h: "What changes when you flip the script", b: "Know your DNA. Say the right thing. Watch it compound." },
  ],
  problem: [
    { h: "The Problem", b: "Campaigns that never convert. Budget wasted. Leads that ghost." },
    { h: "Why it keeps happening", b: "Your website, LinkedIn and ads are all saying different things." },
    { h: "Brand DNA precision. One throughline.", b: "Brand DNA precision. One throughline. Every post builds on the last." },
  ],
  steps: [
    { h: "The Brand Clarity Framework", b: "5 steps to positioning clarity. Used on every client." },
    { h: "Step 1 — Audit your full presence", b: "Website, LinkedIn, social — what story are you actually telling?" },
    { h: "Step 5 — Deploy & compound", b: "Test, rate, refine. Turn clarity into content that compounds." },
  ],
  socialproof: [
    { h: "Meridian SaaS — Before", b: "4% trial-to-paid. Campaigns that felt like screaming into a void." },
    { h: "The diagnosis", b: "Talking to VP-level buyers with language designed for ICs." },
    { h: "Meridian SaaS — After", b: "11.3% trial-to-paid in 6 weeks. Zero product changes." },
  ],
  didyouknow: [
    { h: "Did you know?", b: "72% of B2B buyers expect personalised messaging on every touchpoint." },
    { h: "Why this number matters", b: "Most B2B websites are speaking to the wrong person on every page." },
    { h: "Now you know — act on it", b: "The clearest brands spend the least on acquisition." },
  ],
  vision: [
    { h: "Imagine this", b: "A brand so clear every post attracts the right buyer, automatically." },
    { h: "What we're building toward", b: "Not louder. Not more frequent. More resonant. More precise." },
    { h: "The future is now", b: "Your brand DNA is the foundation everything else builds on." },
  ],
  behind: [
    { h: "Behind the scenes 🎬", b: "How we decode brand DNA in under 30 minutes." },
    { h: "First, we pull everything", b: "Website copy, about page, case studies, LinkedIn posts — all of it." },
    { h: "Then we hand it over", b: "You rate. You refine. You deploy. Content that compounds." },
  ],
  comparison: [
    { h: "Old Way ❌ vs New Way ✅", b: "Two approaches. Completely different outcomes over 90 days." },
    { h: "Old Way: Random daily posting", b: "Post every day, hope something sticks. Watch engagement flatline." },
    { h: "New Way: Context-led content", b: "Every post stems from a positioning angle. Everything compounds." },
  ],
  community: [
    { h: "This is for you if…", b: "You're building something real and tired of blending in." },
    { h: "You've tried the templates", b: 'The hooks, the frameworks, the "proven" formulas. Still — silence.' },
    { h: "Welcome to AdForge 💜", b: "Your brand DNA — finally decoded. Every post builds from here." },
  ],
};
