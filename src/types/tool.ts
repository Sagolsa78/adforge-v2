export interface AuthState {
  loggedIn: boolean;
  name: string;
  email: string;
}

export interface BrandContext {
  id: number;
  title: string;
  body: string;
}

export interface TemplateOption {
  id: string;
  lbl: string;
  ph: string;
  type?: string;
}

export interface Template {
  id: string;
  name: string;
  desc: string;
  cls: string;
  dynOpts: TemplateOption[];
  prev: string;
}

export interface IGTemplateField {
  id: string;
  lbl: string;
  ph: string;
}

export interface IGTemplate {
  id: string;
  name: string;
  kpi: string;
  purpose: string;
  fields: IGTemplateField[];
  example: string;
  tags: string[];
  cls: string;
  prev: string;
}

export interface ContextMeta {
  funnel: string;
  angle: string;
  color: string;
}

export interface GeneratedSlide {
  h: string;
  b: string;
  num: number;
  cov: boolean;
}

export interface GeneratedPrompt {
  lbl: string;
  txt: string;
}

export interface GeneratedContent {
  slides: GeneratedSlide[];
  caption: string;
  hashtags: string[];
  prompts: GeneratedPrompt[];
}

export interface ToolState {
  url: string;
  ctx: BrandContext[];
  ratings: Record<number, number>;
  bm: Set<number>;
  likes: Set<number>;
  selCtx: number | null;
  selTpl: string | null;
  selIgTpl: string | null;
  tone: string | null;
  emoji: string;
  platform: string;
  cta: string;
  offer: string;
  slideN: number;
  curStep: number;
  gen: GeneratedContent | null;
  // Template dynamic fields
  hookQuestion: string;
  mythStatement: string;
  realityStatement: string;
  problemStatement: string;
  solutionStatement: string;
  stepCount: string;
  frameworkName: string;
  clientName: string;
  resultBefore: string;
  resultAfter: string;
  statFact: string;
  visionOutcome: string;
  processStep: string;
  ownBrand: string;
  rivalBrand: string;
  communityTag: string;
  // IG fields
  igStoryAngle: string;
  igHeroMoment: string;
  igCoreFact: string;
  igBrandSolution: string;
  igProof: string;
  igOfferDetails: string;
  igDeadline: string;
  igPrice: string;
  igKeyBenefits: string;
  igCustomerName: string;
  igQuote: string;
  igVariety: string;
  igResult: string;
  igMission: string;
  igImpactStat: string;
  igCampaign: string;
  igCTA: string;
  // Modal
  modalOpen: boolean;
  modalMode: "login" | "signup";
  // Toast
  toastMsg: string;
  toastVisible: boolean;
  toastColor: string;
  // View mode
  p3View: "list" | "grid";
}

// --- API Types ---

export interface ApiError {
  message: string;
  status: number;
}

export interface ContextBlock {
  context_index: 1 | 2 | 3 | 4 | 5;
  content: string;
  title: string;
}

export interface AdVariation {
  id: string;
  headline: string;
  body: string;
  cta: string;
  platform: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface BrandEvent {
  step: string;
  message: string;
  brand_id?: string;
  progress?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export interface AdVariationsPayload {
  context_index: 1 | 2 | 3 | 4 | 5;
  user_brief: string;
  ad_type: string | null;
}

export interface PendingAction {
  type: "GENERATE_VARIATIONS";
  params: {
    context_index: 1 | 2 | 3 | 4 | 5;
    user_brief: string;
    ad_type: string | null;
  };
}
