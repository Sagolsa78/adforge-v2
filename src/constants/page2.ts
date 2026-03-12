/**
 * Page2 Constants
 * Constants for the Page2 Analysis view
 */

export const ANALYSIS_STEPS = [
  "Scraping website content",
  "Extracting brand signals",
  "Analysing tone & positioning",
  "Generating 5 brand contexts",
  "Finalising output",
] as const;

export const STATUS_COLORS = {
  idle: "gray",
  browsing: "emerald",
  generating: "violet",
  finished: "blue",
  error: "red",
} as const;

export const STATUS_LABELS = {
  idle: "IDLE",
  browsing: "BROWSING",
  generating: "GENERATING",
  finished: "FINISHED",
  error: "ERROR",
} as const;

export const IDENTITY_ACCENTS = [
  { bg: "bg.blue.500/10", border: "border.blue.500/30", text: "text.blue.600", numBg: "bg.blue.500" },
  { bg: "bg.emerald.500/10", border: "border.emerald.500/30", text: "text.emerald.600", numBg: "bg.emerald.500" },
  { bg: "bg.violet.500/10", border: "border.violet.500/30", text: "text.violet.600", numBg: "bg.violet.500" },
  { bg: "bg.orange.500/10", border: "border.orange.500/30", text: "text.orange.600", numBg: "bg.orange.500" },
  { bg: "bg.pink.500/10", border: "border.pink.500/30", text: "text.pink.600", numBg: "bg.pink.500" },
] as const;

export const PROGRESS_WIDTHS = {
  idle: "0%",
  browsing: "40%",
  generating: "75%",
  finished: "100%",
  error: "0%",
} as const;
