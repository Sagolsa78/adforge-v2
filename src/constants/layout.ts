// src/constants/layout.ts

export const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Contact", href: "/#contact" },
  // "Use Cases" hidden — show once use case page is ready
] as const;


export const FOOTER_LINKS = {
  Product: [
    { label: "Updates", href: "/" },
    { label: "Blog", href: "/blog" },
  ],
  Resources: [
    { label: "Support", href: "/support" },
    { label: "Affiliate program", href: "#" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Preferences", href: "#" },
    { label: "Terms of service", href: "/terms-of-service" },
    { label: "Contact Us", href: "/contact" },
  ],
  // "Download" column removed
  "Get in touch": [
    { label: "contact@plugandplayagents.com", href: "mailto:contact@plugandplayagents.com" },
    { label: "Discord", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "X", href: "#" },
  ],
} as const;

export const HEADING_COLORS: Record<string, string> = {
  Product: "#a78bfa",
  Resources: "#818cf8",
  "Get in touch": "#e879f9",
} as const;