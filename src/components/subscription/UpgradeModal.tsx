"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Check,
  Zap,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

import { useSubscription } from "@/context/SubscriptionContext";
import { useProject } from "@/context/ProjectContext";
import { formatInr } from "@/lib/utils";

export function UpgradeModal() {
  const {
    isUpgradeModalOpen,
    closeUpgradeModal,
    upgradeModalContext,
    state,
    plans,
    purchasePlan,
    unlockProjectWithCredit,
    claimStarterTrialCredit,
  } = useSubscription();

  const { project } = useProject();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("growth_5_pack");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const isPro = state.tier === "pro_monthly";
  const hasCredits = state.creditsRemaining > 0;
  const isCurrentProjectUnlocked = project ? state.unlockedProjectIds.includes(project.id) || isPro : false;

  const handleCheckout = (planId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      purchasePlan(planId);
      setIsProcessing(false);
    }, 600);
  };

  const handleUnlockCurrentProject = () => {
    if (!project) return;
    const ok = unlockProjectWithCredit(project.id, project.name);
    if (ok) {
      closeUpgradeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-accent/30 bg-[var(--background)] shadow-2xl p-6 sm:p-8 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeUpgradeModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-muted hover:text-foreground hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Monetization & Report Credits</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Unlock Full Carbon Intelligence
          </h2>

          <p className="mt-2 text-sm text-muted">
            {upgradeModalContext ||
              "Material selection and pricing are 100% free. Upgrade to unlock AI Lower-Carbon Swaps and generate official Embodied Carbon Procurement Reports on a per-report basis."}
          </p>

          {/* Current Balance Bar */}
          <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-card/80 border border-border text-xs">
            <span className="text-muted">Current Balance:</span>
            <span className="font-mono font-bold text-accent">
              {isPro
                ? "Unlimited Pro Pass"
                : `${state.creditsRemaining} Report ${state.creditsRemaining === 1 ? "Credit" : "Credits"}`}
            </span>
          </div>
        </div>

        {/* If user already has credits & current project is locked, offer 1-click unlock */}
        {hasCredits && project && !isCurrentProjectUnlocked && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-accent/20 via-emerald-500/15 to-transparent border border-accent/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent text-black font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  You have {state.creditsRemaining} available {state.creditsRemaining === 1 ? "credit" : "credits"}!
                </h3>
                <p className="text-xs text-muted">
                  Use 1 credit now to unlock AI Alternatives & Report generation for &ldquo;{project.name}&rdquo;.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUnlockCurrentProject}
              className="px-5 py-2.5 rounded-xl bg-accent text-black font-bold text-xs hover:opacity-90 transition shadow-md shadow-accent/25 flex items-center gap-1.5"
            >
              <span>Unlock Project (1 Credit)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 cursor-pointer ${
                  plan.popular
                    ? "border-accent bg-accent/10 shadow-[0_0_30px_rgba(23,207,151,0.2)]"
                    : isSelected
                    ? "border-accent/80 bg-card/90"
                    : "border-border bg-card/50 hover:border-accent/40"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent text-black font-bold text-[10px] uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-base text-foreground">{plan.name}</h4>
                    {!plan.popular && plan.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-muted">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-muted leading-relaxed min-h-[32px]">
                    {plan.description}
                  </p>

                  <div className="mt-4 pb-4 border-b border-border">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-foreground font-mono">
                        {formatInr(plan.priceInr)}
                      </span>
                    </div>
                    <p className="text-[11px] text-subtle mt-0.5">{plan.unitDescription}</p>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-4 space-y-2 text-xs">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-foreground/90">
                        <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckout(plan.id);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 ${
                      plan.popular
                        ? "bg-accent text-black hover:opacity-90 shadow-accent/20"
                        : "bg-white/10 hover:bg-white/20 text-foreground border border-white/15"
                    }`}
                  >
                    {isProcessing && selectedPlanId === plan.id ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Tier Notice & Onboarding Trial */}
        <div className="mt-8 p-4 rounded-2xl bg-black/20 border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted">
            <HelpCircle className="w-4 h-4 text-accent" />
            <span>
              Material selection & price verification are <strong>always 100% free</strong>.
            </span>
          </div>

          <div className="flex items-center gap-3">
            {state.creditsRemaining === 0 && (
              <button
                type="button"
                onClick={claimStarterTrialCredit}
                className="text-accent underline font-semibold hover:text-accent/80 transition"
              >
                Claim 1 Free Starter Report
              </button>
            )}

            <Link
              href="/pricing"
              onClick={closeUpgradeModal}
              className="text-muted hover:text-foreground font-medium underline transition"
            >
              View Full Pricing Details & FAQ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
