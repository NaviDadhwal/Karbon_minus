"use client";

import React from "react";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";
import { cn } from "@/lib/utils";

export function CreditBadge({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const { state, openUpgradeModal } = useSubscription();

  const isPro = state.tier === "pro_monthly";
  const credits = state.creditsRemaining;

  return (
    <button
      type="button"
      onClick={() => openUpgradeModal()}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 backdrop-blur-md group",
        isPro
          ? "border border-accent/60 bg-accent/20 text-accent hover:bg-accent/30 shadow-[0_0_15px_rgba(23,207,151,0.25)]"
          : credits > 0
          ? "border border-accent/40 bg-accent/15 text-foreground hover:bg-accent/25 hover:border-accent/60 shadow-[0_0_12px_rgba(23,207,151,0.15)]"
          : "border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/60",
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className,
      )}
      title="View Report Credits & Pricing"
    >
      {isPro ? (
        <>
          <ShieldCheck className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="font-semibold text-accent">Pro Plan</span>
        </>
      ) : credits > 0 ? (
        <>
          <Zap className="w-3.5 h-3.5 text-accent fill-accent/30 group-hover:scale-110 transition-transform" />
          <span className="font-mono font-bold text-foreground">
            {credits} {credits === 1 ? "Report Credit" : "Report Credits"}
          </span>
        </>
      ) : (
        <>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-amber-300">0 Credits &bull; Top-up</span>
        </>
      )}
    </button>
  );
}
