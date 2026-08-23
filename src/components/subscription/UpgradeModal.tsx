"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Check,
  Zap,
  HelpCircle,
  KeyRound,
  Crown,
} from "lucide-react";


import { useSubscription } from "@/context/SubscriptionContext";
import { useProject } from "@/context/ProjectContext";
import { formatInr } from "@/lib/utils";

export function UpgradeModal() {
  const {
    isUpgradeModalOpen,
    closeUpgradeModal,
    upgradeModalContext,
    plans,
    state,
    unlockProjectWithCredit,
    purchasePlan,
    claimStarterTrialCredit,
    redeemPassCode,
  } = useSubscription();

  const { project } = useProject();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("growth_5_pack");
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [showPromoBox, setShowPromoBox] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const handleCheckout = (planId: string) => {
    setIsProcessing(true);
    setSelectedPlanId(planId);

    // Simulate instant checkout / payment gateway transition
    setTimeout(() => {
      purchasePlan(planId);
      setIsProcessing(false);
    }, 600);
  };

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = redeemPassCode(promoInput.trim());
    if (success) {
      setPromoInput("");
      setShowPromoBox(false);
    }
  };

  const isUnlimited = state.tier === "pro_monthly" || state.creditsRemaining > 9000 || Boolean(state.vipPassKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-accent/30 bg-[#0c1319]/95 p-6 sm:p-8 shadow-2xl shadow-accent/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeUpgradeModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted hover:text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 fill-accent" />
            <span>Pay-Per-Report & Pro Model</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Unlock Full Carbon Intelligence
          </h2>

          <p className="mt-2 text-sm text-muted">
            {upgradeModalContext ||
              "Unlock AI lower-carbon alternatives, Pareto cost-carbon optimization, and certified PDF/CSV export for your project."}
          </p>

          {/* Current Credit Status */}
          <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <span className="text-muted">Current Balance:</span>
            {isUnlimited ? (
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Unlimited VIP Pro Pass Active
              </span>
            ) : (
              <span className="font-mono font-bold text-accent">
                {state.creditsRemaining}{" "}
                {state.creditsRemaining === 1 ? "Report Credit" : "Report Credits"}
              </span>
            )}
          </div>
        </div>

        {/* 1-Click Instant Unlock Banner if user already has credits and a project */}
        {project && !isUnlimited && state.creditsRemaining > 0 && (
          <div className="mt-6 p-4 rounded-2xl border border-accent/50 bg-accent/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-accent text-sm">
                Unlock &quot;{project.name}&quot; now
              </p>
              <p className="text-xs text-muted">
                You have {state.creditsRemaining} credit available. Deduct 1 credit to unlock full carbon access for this project.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                unlockProjectWithCredit(project.id, project.name);
                closeUpgradeModal();
              }}
              className="px-4 py-2 rounded-xl bg-accent text-black font-bold text-xs hover:opacity-90 transition shadow-lg shadow-accent/20 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Use 1 Credit to Unlock</span>
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
                className={`relative flex flex-col justify-between rounded-2xl p-5 border transition-all cursor-pointer ${
                  plan.popular
                    ? "border-accent bg-accent/10 shadow-lg shadow-accent/10 ring-1 ring-accent"
                    : isSelected
                    ? "border-white/40 bg-white/5"
                    : "border-border bg-card/60 hover:border-white/20"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-accent text-black text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-foreground text-base mt-1">{plan.name}</h3>
                  <p className="text-xs text-muted mt-1 min-h-[32px]">{plan.description}</p>

                  <div className="mt-4 pb-4 border-b border-white/10">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
                      {formatInr(plan.priceInr)}
                    </span>
                    <span className="text-[11px] text-muted block mt-0.5">
                      {plan.unitDescription}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-label">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckout(plan.id);
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                      plan.popular
                        ? "bg-accent text-black hover:opacity-90"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {isProcessing && selectedPlanId === plan.id ? "Processing..." : "Select Plan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* VIP Passcode / Master ID Activation Box */}
        <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowPromoBox(!showPromoBox)}
              className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Have a VIP Passcode or Unlimited User ID?</span>
            </button>
            <span className="text-[11px] text-muted">
              Master Pass: <code className="font-mono text-amber-300 bg-black/40 px-1.5 py-0.5 rounded">KARBON-UNLIMITED-VIP-2026</code>
            </span>
          </div>

          {showPromoBox && (
            <form onSubmit={handleRedeem} className="mt-3 flex flex-wrap gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter VIP Passcode or User ID (e.g. KARBON-UNLIMITED-VIP-2026)"
                className="flex-1 min-w-[240px] px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition shadow-md shadow-amber-400/20 flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5 fill-black" />
                <span>Activate VIP Pass</span>
              </button>
            </form>
          )}
        </div>

        {/* Free Tier Notice & Onboarding Trial */}
        <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-border flex flex-wrap items-center justify-between gap-3 text-xs">
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
