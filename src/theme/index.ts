import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        bgBase: { value: "#F8F7FF" },
        bgSurface: { value: "#FFFFFF" },
        bgSurfaceHover: { value: "#F3EEFF" },
        borderCore: { value: "#E8E6F0" },
        accentViolet: { value: "#7C3AED" },
        accentOrange: { value: "#EA580C" },
        accentVioletLight: { value: "#F3EEFF" },
        textPrimary: { value: "#0F0E1A" },
        textSecondary: { value: "#6B6880" },
        textMuted: { value: "#A09DB8" },
        success: { value: "#10B981" },
      },
      fonts: {
        heading: { value: "'DM Sans', sans-serif" },
        body: { value: "'DM Sans', sans-serif" },
      },
      radii: {
        "md-custom": { value: "8px" },
        "lg-custom": { value: "10px" },
        "xl-custom": { value: "12px" },
        "2xl-custom": { value: "16px" },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: "{colors.bgBase}" },
        text: { value: "{colors.textPrimary}" }
      }
    }
  },
})

export const system = createSystem(defaultConfig, customConfig)
