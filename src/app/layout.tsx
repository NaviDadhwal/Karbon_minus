import type { Metadata } from "next";

import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { LeafBorder } from "@/components/LeafBorder";
import { ToastifyHost } from "@/components/ToastifyHost";
import { ProjectProvider } from "@/context/ProjectContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UpgradeModal } from "@/components/subscription/UpgradeModal";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CO₂DE — Embodied Carbon & Cost Intelligence",
  description:
    "CO₂DE: Procurement decision support for embodied carbon and cost in Indian construction.",
  icons: {
    icon: [{ url: "/Logo.png", type: "image/png" }],
    apple: [{ url: "/Logo.png" }],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=window.location.pathname;if(p==="/"||p==="")document.documentElement.classList.add("dark");}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >

        <div
          aria-hidden
          className="app-background-gradient pointer-events-none fixed inset-0 -z-10 rotate-180"
        />
        <LeafBorder />

        <ThemeProvider>
          <ToastifyHost />
          <SubscriptionProvider>
            <ProjectProvider>
              <div className="relative z-10 min-h-screen">{children}</div>
              <UpgradeModal />
            </ProjectProvider>
          </SubscriptionProvider>
        </ThemeProvider>
      </body>
    </html>
  );

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return content;
  }

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#17cf97",
          colorBackground: "#071712",
          colorInputBackground: "#0b221a",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
        },
      }}
    >
      {content}
    </ClerkProvider>
  );
}
