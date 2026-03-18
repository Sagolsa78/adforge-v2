import { ToolState, GeneratedContent, Template, IGTemplate } from "@/types/onboarding.types";
import { TPLS, IG_TPLS } from "@/constants";

export function buildContent(state: ToolState): GeneratedContent {
  const ctx = state.ctx.find((x) => x.id === state.selCtx);
  if (!ctx) throw new Error("No context selected");

  const isIg = state.platform === "instagram";
  const tpl = isIg
    ? IG_TPLS.find((x) => x.id === state.selIgTpl)
    : TPLS.find((x) => x.id === state.selTpl);
  if (!tpl) throw new Error("No template selected");

  const eMap: Record<string, string> = { none: "", minimal: "✨", moderate: "🔥💡", heavy: "🚀🎯🔥" };
  const e = eMap[state.emoji || "minimal"];
  const platCTA: Record<string, string> = {
    linkedin: "Follow for more positioning insights",
    instagram: "Save this & share with a founder",
    twitter: "RT if this hit",
    facebook: "Share with a founder who needs this",
  };
  const cta = state.cta || platCTA[state.platform] || "Follow for more insights";
  const offer = state.offer || "";
  const L = ctx.body.split("\n\n").filter(Boolean);
  const n = state.slideN || 6;

  // Instagram-specific build
  if (isIg) {
    const igTpl = tpl as IGTemplate;
    const caption = igTpl.example + (offer ? `\n\n${e} ${offer}` : "") + `\n\n${cta}`;
    const slides = Array.from({ length: n }, (_, i) => {
      const heads = ["The Story", "The Turning Point", "The Discovery", "The Change", "The Result", "The Invitation", "One More Thing", "Your Turn"];
      const bodies = [
        L[0]?.slice(0, 100) || "Every brand has a story.",
        L[1]?.slice(0, 100) || "Then something changed.",
        L[2]?.slice(0, 100) || "The solution was closer than expected.",
        L[3]?.slice(0, 100) || "Here is what we found.",
        `The result? ${offer || "Real, measurable impact."}`,
        `${cta}`,
        "The brands winning are the clearest.",
        "Your brand DNA holds the answer.",
      ];
      return { h: heads[i] || `Slide ${i + 1}`, b: bodies[i] || L[i % L.length]?.slice(0, 100) || "", num: i + 1, cov: i === 0 };
    });
    const hashtags = [...(igTpl.tags || []), "#Instagram", "#ContentCreator", "#BrandDNA", "#OrganicReach", "#ContentStrategy"];
    const prompts = [
      {
        lbl: "Cover Slide",
        txt: `Instagram carousel cover for ${igTpl.name}: clean editorial style, soft pink-to-violet gradient, bold white headline typography, minimal design, 1:1 ratio. Theme: "${L[0]?.slice(0, 60) || "Brand Story"}".`,
      },
      {
        lbl: "Mid Slide",
        txt: `Instagram carousel slide, same brand style: white on dark background, concise text, subtle texture. Concept: "${L[1]?.slice(0, 60) || "The Solution"}".`,
      },
    ];
    return { slides, caption, hashtags, prompts };
  }

  // LinkedIn and other platforms
  const liTpl = tpl as Template;
  const hook = state.hookQuestion || "What if your brand was costing you leads?";
  const myth = state.mythStatement || "You need a big ad budget to grow";
  const reality = state.realityStatement || "You need brand precision, not spend";
  const prob = state.problemStatement || L[0]?.slice(0, 120) || "Campaigns that don't convert.";
  const sol = state.solutionStatement || "Brand DNA precision fixes the gap.";
  const steps = parseInt(state.stepCount) || 5;
  const framework = state.frameworkName || "Brand Clarity Framework";
  const client = state.clientName || "Meridian SaaS";
  const before = state.resultBefore || "4% trial-to-paid";
  const after = state.resultAfter || "11.3% in 6 weeks";
  const stat = state.statFact || "72% of B2B buyers expect personalised messaging";
  const vision = state.visionOutcome || "A brand so clear every post attracts the right buyer";
  const process = state.processStep || "How we decode brand DNA in 30 minutes";
  const newWay = state.ownBrand || "Context-led content";
  const oldWay = state.rivalBrand || "Random daily posting";
  const community = state.communityTag || "Founders tired of blending in";

  const stepSlides = Array.from({ length: Math.min(steps, 6) }, (_, i) => {
    const stepNames = ["Audit your full digital presence", "Extract your brand signals", "Map positioning gaps", "Build your context library", "Deploy & iterate", "Review & compound"];
    const stepBodies = [
      "Website, LinkedIn, social — what story are you actually telling?",
      "Tone, vocabulary, proof points, the specific language your buyers use.",
      "Where your message fragments. Where the audience gets confused.",
      "5 distinct angles, each for a different buyer stage.",
      "Test, rate, refine. Turn clarity into content that compounds.",
      "Monthly review. See what's working. Double down.",
    ];
    return { h: `Step ${i + 1} — ${stepNames[i] || "Next Step"}`, b: stepBodies[i] || L[i]?.slice(0, 120) || "" };
  });

  const allSlides: Record<string, { h: string; b: string }[]> = {
    curiosity: [
      { h: `${e} ${hook}`, b: "Most marketers focus on reach. The best ones obsess over resonance." },
      { h: "The hidden problem nobody talks about", b: L[0]?.slice(0, 120) || "" },
      { h: "Why your messaging keeps breaking down", b: L[1]?.slice(0, 120) || "" },
      { h: "The insight that changes everything", b: L[2]?.slice(0, 120) || "" },
      { h: "What precision actually looks like", b: L[3]?.slice(0, 120) || "" },
      { h: `${e} The result`, b: `Campaigns that convert. Leads who trust you before booking.${offer ? " — " + offer : ""}` },
      { h: "One last thing…", b: "The brands winning aren't louder. They're clearer." },
      { h: `Save this ${e}`, b: `Your brand already has everything it needs. You just need to hear it.${offer ? " — " + offer : ""}` },
    ],
    myth: [
      { h: `${e} The Myth: "${myth}"`, b: "Most B2B founders believe this. Most B2B founders stay stuck." },
      { h: `❌ Myth: ${myth}`, b: "This belief keeps thousands of great companies invisible." },
      { h: `✅ Reality: ${reality}`, b: L[0]?.slice(0, 120) || "" },
      { h: "Why the myth is so sticky", b: "Because it sounds logical. And because nobody challenges it." },
      { h: "The brands that got this right", b: L[2]?.slice(0, 120) || "" },
      { h: `${e} What changes when you flip the script`, b: `Know your DNA. Say the right thing. Watch it compound.${offer ? " — " + offer : ""}` },
      { h: "The question to ask yourself", b: `"Am I investing in volume or in precision?"${offer ? " — " + offer : ""}` },
    ],
    problem: [
      { h: `${e} The Problem`, b: prob },
      { h: "Why it keeps happening", b: L[1]?.slice(0, 130) || "" },
      { h: "The hidden cost of unclear positioning", b: "Every month without clarity = budget burned on campaigns that miss." },
      { h: "What's actually causing this", b: L[2]?.slice(0, 130) || "" },
      { h: `${e} Brand DNA precision. One throughline.`, b: sol },
      { h: "How it works in practice", b: "Website → signals → positioning gaps → 5 contexts → deploy." },
      { h: "What changes with clarity", b: "Campaigns convert. Content compounds. Confidence grows." },
      { h: `The outcome ${e}`, b: `Precision positioning. Content that converts.${offer ? " — " + offer : ""}` },
    ],
    steps: [{ h: `${e} The ${framework}`, b: `${steps} steps to brand positioning clarity. Used on every client.` }, ...stepSlides, { h: `${e} The compound effect`, b: `Each piece of content builds on the last.${offer ? " — " + offer : ""}` }].slice(0, 8),
    socialproof: [
      { h: `${e} ${client} — Before`, b: `${before}. Campaigns that felt like screaming into a void.` },
      { h: "The diagnosis", b: "Talking to VP-level buyers with language designed for ICs." },
      { h: "The 20-minute fix", b: L[2]?.slice(0, 120) || "" },
      { h: `${client} — After`, b: `${after}. Zero product changes. Just better positioning.` },
      { h: "What actually changed?", b: "Their messaging. Who they spoke to. How precisely." },
      { h: `${e} The lesson`, b: `It's rarely the product. It's almost always the positioning.${offer ? " — " + offer : ""}` },
      { h: "Could this be your story?", b: `Your brand DNA is waiting to be decoded.${offer ? " — " + offer : ""}` },
    ],
    didyouknow: [
      { h: `${e} Did you know?`, b: stat },
      { h: "Why this number matters", b: "Most B2B websites are speaking to the wrong person on every page." },
      { h: "The overlooked insight", b: L[0]?.slice(0, 130) || "" },
      { h: "Why most brands miss this", b: L[1]?.slice(0, 130) || "" },
      { h: "The smarter approach", b: L[2]?.slice(0, 130) || "" },
      { h: `Now you know ${e}`, b: `Act on it.${offer ? " — " + offer : ""}` },
      { h: "One more fact", b: "The clearest brands spend the least on acquisition." },
      { h: `What will you do differently? ${e}`, b: `Your brand DNA holds the answer.${offer ? " — " + offer : ""}` },
    ],
    vision: [
      { h: `${e} Imagine this`, b: vision },
      { h: "The future of B2B marketing", b: "Not louder. Not more frequent. More resonant. More precise." },
      { h: "What we're building toward", b: L[0]?.slice(0, 130) || "" },
      { h: "The world we want to create", b: "Founders who know exactly who they are — and own it." },
      { h: "The roadmap", b: L[2]?.slice(0, 130) || "" },
      { h: `Join the movement ${e}`, b: `Brand clarity isn't a luxury. It's the strategy.${offer ? " — " + offer : ""}` },
      { h: `The future is now ${e}`, b: `Your brand DNA is the foundation everything else builds on.${offer ? " — " + offer : ""}` },
    ],
    behind: [
      { h: `${e} Behind the scenes`, b: process },
      { h: "First, we pull everything", b: "Website copy, about page, case studies, LinkedIn posts — all of it." },
      { h: "Then we find the throughline", b: "What's the consistent promise? The recurring emotion?" },
      { h: "We surface the gaps", b: "Where the message fragments. Where the audience gets confused." },
      { h: "We generate 5 contexts", b: "Each one a complete framework for a different stage of the funnel." },
      { h: `Then we hand it over ${e}`, b: `You rate. You refine. You deploy.${offer ? " — " + offer : ""}` },
      { h: "What we've learned", b: "The winning brands aren't the loudest. They're the most consistent." },
      { h: `The result ${e}`, b: `Content that feels personal. Because it's built from your actual DNA.${offer ? " — " + offer : ""}` },
    ],
    comparison: [
      { h: `${e} ${oldWay} vs ${newWay}`, b: "Two approaches. Completely different outcomes." },
      { h: `❌ Old: ${oldWay}`, b: "Post every day, hope something sticks. Watch engagement flatline." },
      { h: `✅ New: ${newWay}`, b: "Every post stems from a positioning angle. Everything compounds." },
      { h: "❌ Old: Spray & pray ads", b: "Generic hooks. Broad targeting. High CPL. Low buyer intent." },
      { h: "✅ New: Brand DNA precision", b: L[1]?.slice(0, 120) || "" },
      { h: `The 90-day difference ${e}`, b: `Old way: exhaustion. New way: momentum.${offer ? " — " + offer : ""}` },
      { h: `Which side are you on? ${e}`, b: `Make the switch.${offer ? " — " + offer : ""}` },
    ],
    community: [
      { h: `${e} This is for you if…`, b: community || "You're building something real and tired of blending in." },
      { h: "You know your product works", b: "But the market doesn't see it. The gap is in your messaging." },
      { h: "You've tried the templates", b: 'The hooks, the frameworks, the "proven" formulas. Still — silence.' },
      { h: "Here's what's actually missing", b: L[1]?.slice(0, 130) || "" },
      { h: "You deserve brand clarity", b: "Not tactics. A positioning foundation everything builds on." },
      { h: `Welcome to plug and playa gents ${e}`, b: `Your brand DNA — finally decoded.${offer ? " — " + offer : ""}` },
      { h: "You're not alone", b: "Thousands of founders have been here. Clarity is the turning point." },
      { h: `Ready? ${e}`, b: `Your brand is already saying something. Let's make sure it's right.${offer ? " — " + offer : ""}` },
    ],
  };

  const pool = allSlides[liTpl.id] || allSlides.problem;
  const slides = pool.slice(0, n).map((s, i) => ({ ...s, num: i + 1, cov: i === 0 }));

  const hooks: Record<string, string> = {
    curiosity: `${hook} (Here's the answer nobody tells you →)`,
    myth: "The biggest myth about B2B growth — and why it's holding you back.",
    problem: "Here's the real reason your campaigns aren't converting (swipe →)",
    steps: `The ${framework}: ${steps} steps to brand clarity ↓`,
    socialproof: `${client} went from ${before} to ${after}. Here's exactly what changed.`,
    didyouknow: `Did you know? ${stat.slice(0, 80)}`,
    vision: `${vision} — Here's the path to get there.`,
    behind: `Behind the scenes: ${process.slice(0, 80)}`,
    comparison: `${oldWay} vs ${newWay}. Here's why one wins every time.`,
    community: `This is for ${community || "founders who are tired of blending in"}. 💜`,
  };

  const body = ctx.body.split("\n\n").slice(0, 2).join("\n\n");
  const offerLine = offer ? `\n\n${e} ${offer}` : "";
  const caption = `${hooks[liTpl.id] || hooks.problem}\n\n${body.slice(0, 300)}…${offerLine}\n\n${cta}\n\nSave this if it resonated.`;

  const base = ["#BrandDNA", "#ContentMarketing", "#B2BMarketing", "#Positioning", "#LinkedInContent", "#MarketingStrategy"];
  const tTags: Record<string, string[]> = {
    curiosity: ["#CuriosityHook", "#ContentStrategy"],
    myth: ["#MarketingMyths", "#GrowthMarketing"],
    problem: ["#ProblemSolution", "#Conversion"],
    steps: ["#HowTo", "#Framework"],
    socialproof: ["#CaseStudy", "#Results"],
    didyouknow: ["#DidYouKnow", "#Insight"],
    vision: ["#Founder", "#BuildingInPublic"],
    behind: ["#BehindTheScenes", "#Process"],
    comparison: ["#OldVsNew", "#Strategy"],
    community: ["#Founders", "#Community"],
  };
  const pTags: Record<string, string[]> = {
    linkedin: ["#LinkedIn", "#B2B"],
    instagram: ["#Instagram", "#ContentCreator"],
    twitter: ["#BuildInPublic", "#XMarketing"],
    facebook: ["#FacebookMarketing", "#SMB"],
  };
  const hashtags = [...base, ...(tTags[liTpl.id] || []), ...(pTags[state.platform] || [])];

  const imgStyle = "clean editorial flat illustration, crisp white background, soft indigo/violet accent (#4F3FED), bold modern typography, generous whitespace, professional SaaS, no faces, subtle geometry, 1:1 square ratio";
  const prompts = slides.slice(0, 3).map((s, i) => ({
    lbl: `Slide ${i + 1}: ${s.h}`,
    txt: `${imgStyle} — concept: "${s.b.slice(0, 80)}". Template: ${liTpl.name}. Tone: ${state.tone || "professional"}. Headline overlay: "${s.h}". Minimal, ultra-clean.`,
  }));

  return { slides, caption, hashtags, prompts };
}
