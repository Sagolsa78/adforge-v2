import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import "@/styles/globals.css";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AdForge | Your Instagram, Autopiloted",
  description: "24/7 autonomous content creation, community management, and growth scaling powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <Provider>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <main style={{ flex: 1 }}>{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
