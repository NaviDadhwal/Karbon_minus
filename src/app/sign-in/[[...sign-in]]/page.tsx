"use client";

import Link from "next/link";
import Image from "next/image";
import { SignIn } from "@clerk/nextjs";
import { ArrowRight, ShieldCheck, CheckCircle2, Lock } from "lucide-react";

export default function SignInPage() {
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
      <div className="mb-8 text-center space-y-2 z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <Image
            src="/Logo.png"
            alt="Karbon Minus"
            width={44}
            height={44}
            className="h-11 w-11 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
            Karbon Minus
          </span>
        </Link>
        <p className="text-xs text-muted max-w-sm">
          Green Procurement Decision Support &amp; Embodied Carbon Intelligence
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md z-10">
        {hasClerkKey ? (
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/projects"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-card/90 border border-border shadow-2xl rounded-2xl backdrop-blur-xl p-6",
                headerTitle: "text-foreground font-bold text-xl",
                headerSubtitle: "text-muted text-sm",
                socialButtonsBlockButton:
                  "border border-border bg-input-bg hover:bg-card-hover text-foreground font-medium rounded-xl transition py-2.5",
                socialButtonsBlockButtonText: "text-foreground font-semibold text-xs",
                dividerLine: "bg-border",
                dividerText: "text-muted text-xs uppercase tracking-wider",
                formFieldLabel: "text-label text-xs font-semibold",
                formFieldInput:
                  "bg-input-bg border border-border text-foreground focus:border-accent focus:ring-1 focus:ring-accent rounded-xl py-2",
                formButtonPrimary:
                  "bg-accent hover:opacity-90 text-black font-bold rounded-xl py-2.5 shadow-lg shadow-accent/20 transition",
                footerActionLink: "text-accent font-semibold hover:underline",
                footerActionText: "text-muted text-xs",
              },
            }}
          />
        ) : (
          /* Guided Setup Card if API Keys are not yet plugged into .env */
          <div className="rounded-2xl border border-accent/30 bg-card/90 p-7 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/15 border border-accent/30 text-accent">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Google &amp; Email Authentication
                </h2>
                <p className="text-xs text-muted">Clerk Auth Integration Ready</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-muted bg-black/20 p-4 rounded-xl border border-white/5">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-accent" /> To enable Google Sign-In:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                <li>Create a free account at <strong className="text-accent">clerk.com</strong></li>
                <li>Enable <strong className="text-foreground">Google OAuth</strong> under SSO Connections</li>
                <li>Add your <code className="font-mono text-emerald-400">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code className="font-mono text-emerald-400">CLERK_SECRET_KEY</code> to your environment variables</li>
              </ol>
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
