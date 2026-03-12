import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Provider } from "@/components/ui/provider";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AdForge | Your Instagram, Autopiloted",
  description: "24/7 autonomous content creation, community management, and growth scaling powered by AI.",
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={dmSans.className}>
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
