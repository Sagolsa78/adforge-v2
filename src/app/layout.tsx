import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plug and Play Agent | 30 Days of Instagram Content, Automatically",
  description:
    "Analyze your brand and generate a month's worth of Instagram Reels, Carousels, and Hooks in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <Provider forcedTheme="light">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <main style={{ flex: 1 }}>{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
