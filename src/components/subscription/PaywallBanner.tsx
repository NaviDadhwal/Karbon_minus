"use client";

import React from "react";
import { Lock, Sparkles, Zap, ArrowRight, FileSpreadsheet, Leaf, Cpu } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";
import { useProject } from "@/context/ProjectContext";
import { Button } from "@/components/ui/Button";

export function PaywallBanner({
  title,
  description,
  feature = "alternatives",
}: {
  title?: string;
  description?: string;
  feature?: "alternatives" | "report";
}) {
  const { state, openUpgradeModal, unlockProjectWithCredit } = useSubscription();
  const { project } = useProject();

  const isPro = state.tier === "pro_monthly";
  const hasCredits = state.creditsRemaining > 0;

  const defaultTitle =
    feature === "alternatives"
      ? "AI Lower-Carbon Alternatives & Risk Intelligence (Paid Tier)"
      : "Full Embodied Carbon Report & Export (Paid Tier)";

  const defaultDesc =
    feature === "alternatives"
      ? "Manual material selection and line item pricing are free. Upgrade to unlock AI-powered lower-carbon swaps, cost delta calculations, and semiconductor shortage supply chain resilience scores."
      : "Basic procurement pricing and cost totals are visible in the free tier. Unlock the full Embodied Carbon Procurement Report to access before/after carbon charts, category breakdowns, AI executive summary, and official PDF/CSV downloads.";

  const handleUnlock = () => {
    if (!project) {
      openUpgradeModal();
      return;
    }
    if (hasCredits || isPro) {
      unlockProjectWithCredit(project.id, project.name);
    } else {
      openUpgradeModal(title || defaultTitle);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-br from-card/90 via-card/70 to-accent/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Decorative Glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Paid Feature &bull; Per-Report Model</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {title || defaultTitle}
          </h3>

          <p className="text-sm text-muted leading-relaxed">
            {description || defaultDesc}
          </p>

          {/* Value Highlights Pill Grid */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-foreground font-medium">
              <Leaf className="w-3.5 h-3.5 text-accent" />
              <span>Real-Time Carbon Savings (kgCO₂e)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-foreground font-medium">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Semiconductor Shortage Index</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-foreground font-medium">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>PDF Compliance & QR Passports</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-foreground font-medium">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>AI Executive Synthesis</span>
            </span>
          </div>
        </div>

        {/* Action Column */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end gap-3 shrink-0">
          <div className="text-xs text-subtle md:text-right">
            <span>Your Balance: </span>
            <strong className="text-accent font-mono">
              {isPro
                ? "Unlimited Pro"
                : `${state.creditsRemaining} ${state.creditsRemaining === 1 ? "credit" : "credits"}`}
            </strong>
          </div>

          {hasCredits || isPro ? (
            <Button
              type="button"
              onClick={handleUnlock}
              className="w-full sm:w-auto px-6 py-3 font-bold text-sm bg-accent text-black hover:opacity-90 shadow-lg shadow-accent/25 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Unlock for this Project (1 Credit)</span>
            </Button>
          ) : (
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Button
                type="button"
                onClick={() => openUpgradeModal(title || defaultTitle)}
                className="w-full sm:w-auto px-6 py-3 font-bold text-sm bg-accent text-black hover:opacity-90 shadow-lg shadow-accent/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buy Report Pass (₹999)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <button
                type="button"
                onClick={() => openUpgradeModal()}
                className="text-xs text-muted hover:text-accent underline text-center md:text-right"
              >
                View 5-Pack & Pro Plans
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
