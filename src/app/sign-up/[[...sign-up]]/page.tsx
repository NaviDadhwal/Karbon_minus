"use client";

import Link from "next/link";
import Image from "next/image";
import { SignUp } from "@clerk/nextjs";
import { ArrowRight, ShieldCheck, CheckCircle2, UserPlus } from "lucide-react";

import { dark } from "@clerk/themes";

export default function SignUpPage() {
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <div className="mb-8 text-center space-y-2 z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <Image
            src="/Logo.png"
            alt="CO₂DE"
            width={44}
            height={44}
            className="h-11 w-11 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            CO₂DE
          </span>
        </Link>
        <p className="text-xs text-muted max-w-sm">
          Create your account to track embodied carbon and optimize construction costs
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md z-10">
        {hasClerkKey ? (
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/projects"
            appearance={{
              baseTheme: dark,
              variables: {
                colorPrimary: "#17cf97",
                colorBackground: "#071712",
                colorInputBackground: "#0b221a",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#94a3b8",
                colorTextOnPrimaryBackground: "#000000",
                colorDanger: "#f43f5e",
                borderRadius: "1rem",
              },
              elements: {
                rootBox: "w-full",
                card: "bg-[#071712]/95 border border-emerald-500/20 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl rounded-3xl p-7",
                headerTitle: "text-foreground font-bold text-xl font-serif text-white",
                headerSubtitle: "text-emerald-200/70 text-xs mt-1",
                socialButtonsBlockButton:
                  "bg-[#0d261d] border border-emerald-500/25 hover:bg-emerald-500/15 hover:border-emerald-500/40 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 shadow-md",
                socialButtonsBlockButtonText: "text-white font-semibold text-xs",
                dividerLine: "bg-emerald-500/20",
                dividerText: "text-emerald-300/60 text-xs uppercase tracking-widest font-mono",
                formFieldLabel: "text-emerald-100/90 text-xs font-semibold tracking-wide",
                formFieldInput:
                  "bg-[#0b221a] border border-emerald-500/25 focus:border-accent focus:ring-2 focus:ring-accent/20 text-white rounded-xl py-3 px-4 transition text-sm placeholder:text-muted",
                formButtonPrimary:
                  "bg-accent hover:bg-[#14ba87] text-black font-extrabold rounded-xl py-3 shadow-[0_0_20px_rgba(23,207,151,0.35)] hover:shadow-[0_0_30px_rgba(23,207,151,0.5)] transition-all duration-300 text-sm",
                footer: "bg-transparent border-t border-emerald-500/15 mt-4 pt-4",
                footerActionLink: "text-accent font-bold hover:underline transition",
                footerActionText: "text-emerald-100/70 text-xs",
              },
            }}
          />
        ) : (
          /* Guided Setup Card if API Keys are not yet plugged into .env */
          <div className="rounded-2xl border border-accent/30 bg-card/90 p-7 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Get Started with CO₂DE
                </h2>

                <p className="text-xs text-muted">Google &amp; Email Sign-Up</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-muted bg-black/20 p-4 rounded-xl border border-white/5">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" /> Authentication Setup:
              </p>
              <p className="leading-relaxed">
                Connect your Clerk project with Google OAuth enabled to allow users to sign up using their Google accounts or email.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/projects"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-black font-bold text-sm transition hover:opacity-90 shadow-lg shadow-accent/20"
              >
                <span>Continue to Projects Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer Security Note */}
      <div className="mt-8 text-center text-[11px] text-muted flex items-center gap-1.5 z-10">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        <span>Enterprise-grade authentication with Google OAuth &amp; SSL encryption</span>
      </div>
    </div>
  );
}
