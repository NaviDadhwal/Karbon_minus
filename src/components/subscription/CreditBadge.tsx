"use client";

import React from "react";
import { Sparkles, Zap, Crown } from "lucide-react";
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

  const isUnlimited = state.tier === "pro_monthly" || state.creditsRemaining > 9000 || Boolean(state.vipPassKey);
  const credits = state.creditsRemaining;

  return (
    <button
      type="button"
      onClick={() => openUpgradeModal()}
      className={cn(
        "relative inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 backdrop-blur-md group",
        isUnlimited
          ? "border border-amber-400/60 bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          : credits > 0
          ? "border border-accent/40 bg-accent/15 text-foreground hover:bg-accent/25 hover:border-accent/60 shadow-[0_0_12px_rgba(23,207,151,0.15)]"
          : "border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/60",
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className,
      )}
      title="View Report Credits & Pricing"
    >
      {isUnlimited ? (
        <>
          <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40 animate-pulse" />
          <span className="font-bold text-amber-300">Unlimited VIP Pass</span>
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

