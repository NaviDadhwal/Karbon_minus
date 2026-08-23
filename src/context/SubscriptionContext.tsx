"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { PricingPlan, UserSubscriptionState } from "@/types";
import {
  DEFAULT_SUBSCRIPTION_STATE,
  loadSubscriptionState,
  saveSubscriptionState,
} from "@/lib/storage";
import { notifySuccess, notifyInfo, notifyError } from "@/lib/toast";
import { useUser } from "@clerk/nextjs";

export const UNLIMITED_EMAILS = [
  "navidadhwal06@gmail.com",
  "navidadhwal@gmail.com",
  "navi.dadhwal@gmail.com",
  "navidadhwal",
];

export const UNLIMITED_PASS_KEYS = [
  "KARBON-UNLIMITED-VIP-2026",
  "ADMIN-VIP-PASS",
  "UNLIMITED-PRO-2026",
  "KARBON-ADMIN-VIP",
  "HACKUNSEEN-UNLIMITED",
  "VIP-UNLIMITED",
  "user_unlimited_vip",
  "navidadhwal06@gmail.com",
  "navidadhwal@gmail.com",
  "navidadhwal",
  "navi",
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "single_report",
    name: "Pay-As-You-Go",
    badge: "1 Report Pass",
    description: "Ideal for single project procurement and tender bidding.",
    priceInr: 999,
    credits: 1,
    unitDescription: "per project report",
    features: [
      "1 Full Embodied Carbon Procurement Report",
      "AI Lower-Carbon Alternatives & Swaps",
      "Semiconductor Supply Resilience Risk Analysis",
      "Official PDF & CSV Compliance Export with Passport",
      "AI Executive Summary Generation",
      "No recurring commitment",
    ],
    ctaText: "Buy 1 Report Pass",
  },
  {
    id: "growth_5_pack",
    name: "5-Report Pack",
    badge: "Most Popular · Save 20%",
    description: "Best for active contractors, architects, and sustainability teams.",
    priceInr: 3999,
    credits: 5,
    unitDescription: "for 5 project reports (₹799/ea)",
    popular: true,
    features: [
      "5 Project Report Credits (Valid 12 months)",
      "AI Lower-Carbon Alternatives on all projects",
      "Semiconductor Supply Shortage Index",
      "Full PDF & CSV Downloads with QR stamps",
      "Multi-project Pareto Cost vs Carbon Tradeoffs",
      "Priority AI Generation speed",
    ],
    ctaText: "Get 5-Report Pack",
  },
  {
    id: "pro_monthly",
    name: "Enterprise Pro",
    badge: "Unlimited Access",
    description: "For EPC firms and developers with high-volume procurement pipelines.",
    priceInr: 9999,
    credits: "unlimited",
    unitDescription: "per month, billed monthly",
    features: [
      "Unlimited Carbon Project Reports",
      "Unlimited AI Lower-Carbon Swaps & Optimization",
      "Unlimited PDF & CSV Compliance Passes",
      "Unlimited AI Executive Summaries",
      "Custom EPD Ingestion & Dedicated Support",
      "Team collaboration access",
    ],
    ctaText: "Start Pro Subscription",
  },
];

interface SubscriptionContextType {
  state: UserSubscriptionState;
  plans: PricingPlan[];
  isUpgradeModalOpen: boolean;
  upgradeModalContext: string | null;
  openUpgradeModal: (contextReason?: string) => void;
  closeUpgradeModal: () => void;
  hasProjectAccess: (projectId?: string | null) => boolean;
  unlockProjectWithCredit: (projectId: string, projectName?: string) => boolean;
  purchasePlan: (planId: string) => void;
  claimStarterTrialCredit: () => void;
  redeemPassCode: (codeOrUserId: string) => boolean;
  resetSubscriptionState: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

function ClerkEmailWatcher({
  onAuthEmail,
}: {
  onAuthEmail: (email: string) => void;
}) {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    const primaryEmail = user.primaryEmailAddress?.emailAddress;
    if (primaryEmail) {
      onAuthEmail(primaryEmail);
    }
    // Also check any linked emails from Google
    user.emailAddresses?.forEach((e) => {
      if (e.emailAddress) onAuthEmail(e.emailAddress);
    });
  }, [isLoaded, isSignedIn, user, onAuthEmail]);

  return null;
}


export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserSubscriptionState>(DEFAULT_SUBSCRIPTION_STATE);
  const [mounted, setMounted] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeModalContext, setUpgradeModalContext] = useState<string | null>(null);

  const persist = useCallback((next: UserSubscriptionState) => {
    setState(next);
    saveSubscriptionState(next);
  }, []);

  const redeemPassCode = useCallback((codeOrUserId: string): boolean => {
    if (!codeOrUserId) return false;
    const clean = codeOrUserId.trim();
    const cleanLower = clean.toLowerCase();
    const cleanUpper = clean.toUpperCase();

    const isMatch =
      UNLIMITED_PASS_KEYS.some((k) => k.toLowerCase() === cleanLower) ||
      UNLIMITED_EMAILS.some((e) => e.toLowerCase() === cleanLower) ||
      cleanUpper.startsWith("VIP-") ||
      cleanUpper.startsWith("ADMIN-") ||
      cleanLower.includes("navidadhwal") ||
      cleanLower === "admin" ||
      cleanLower === "hackunseen";

    if (isMatch) {
      const next: UserSubscriptionState = {
        tier: "pro_monthly",
        creditsRemaining: 99999,
        unlockedProjectIds: state.unlockedProjectIds,
        totalReportsGenerated: state.totalReportsGenerated,
        subscriptionExpiresAt: "2099-12-31T23:59:59.999Z",
        vipPassKey: clean,
      };
      persist(next);
      notifySuccess(
        "👑 Unlimited VIP Pass Activated!",
        `Verified "${clean}". You now have lifetime unlimited access to all AI carbon alternatives, Pareto optimization, and certified exports.`,
      );
      return true;
    } else {
      notifyError("Invalid Pass Code", "The entered pass code or User ID was not recognized.");
      return false;
    }
  }, [state, persist]);

  const handleClerkUserEmail = useCallback(
    (email: string) => {
      const clean = email.toLowerCase().trim();
      const isUnlimitedUser =
        UNLIMITED_EMAILS.some((e) => e.toLowerCase() === clean) ||
        clean === "navidadhwal06@gmail.com" ||
        clean.startsWith("navidadhwal");

      if (isUnlimitedUser) {
        if (state.tier !== "pro_monthly" || !state.vipPassKey) {
          const next: UserSubscriptionState = {
            ...state,
            tier: "pro_monthly",
            creditsRemaining: 99999,
            subscriptionExpiresAt: "2099-12-31T23:59:59.999Z",
            vipPassKey: `GOOGLE_AUTH:${clean}`,
          };
          persist(next);
          notifySuccess(
            "👑 Google VIP Account Verified",
            `Welcome ${clean}! Permanent Unlimited Pro Pass activated for your account.`,
          );
        }
      }
    },
    [state, persist],
  );

  useEffect(() => {
    const loaded = loadSubscriptionState();
    setState(loaded);
    setMounted(true);

    // Auto-check URL query parameters for ?pass=... or ?vip_pass=...
    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const passParam = urlParams.get("pass") || urlParams.get("vip_pass") || urlParams.get("promo");
        if (passParam) {
          redeemPassCode(passParam);
        }
      } catch {
        // Ignore URL parsing errors
      }
    }
  }, [redeemPassCode]);

  const openUpgradeModal = useCallback((contextReason?: string) => {
    setUpgradeModalContext(contextReason ?? null);
    setIsUpgradeModalOpen(true);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(false);
    setUpgradeModalContext(null);
  }, []);

  const hasProjectAccess = useCallback(
    (projectId?: string | null): boolean => {
      if (!projectId) return false;
      if (state.tier === "pro_monthly" || state.creditsRemaining > 9000 || Boolean(state.vipPassKey)) return true;
      return state.unlockedProjectIds.includes(projectId);
    },
    [state.tier, state.creditsRemaining, state.vipPassKey, state.unlockedProjectIds],
  );

  const unlockProjectWithCredit = useCallback(
    (projectId: string, projectName?: string): boolean => {
      if (state.tier === "pro_monthly" || state.creditsRemaining > 9000 || Boolean(state.vipPassKey)) {
        if (!state.unlockedProjectIds.includes(projectId)) {
          const next: UserSubscriptionState = {
            ...state,
            unlockedProjectIds: [...state.unlockedProjectIds, projectId],
            totalReportsGenerated: state.totalReportsGenerated + 1,
          };
          persist(next);
        }
        notifySuccess("Report unlocked", projectName ? `Full carbon access unlocked for "${projectName}".` : "Full carbon intelligence unlocked.");
        return true;
      }

      if (state.unlockedProjectIds.includes(projectId)) {
        return true;
      }

      if (state.creditsRemaining <= 0) {
        openUpgradeModal(projectName ? `Unlock report for ${projectName}` : "Unlock report");
        return false;
      }

      const next: UserSubscriptionState = {
        ...state,
        creditsRemaining: state.creditsRemaining - 1,
        unlockedProjectIds: [...state.unlockedProjectIds, projectId],
        totalReportsGenerated: state.totalReportsGenerated + 1,
      };
      persist(next);
      notifySuccess(
        "Project Report Unlocked!",
        `1 credit used. ${next.creditsRemaining} ${next.creditsRemaining === 1 ? "credit" : "credits"} remaining.`,
      );
      return true;
    },
    [state, persist, openUpgradeModal],
  );

  const purchasePlan = useCallback(
    (planId: string) => {
      const plan = PRICING_PLANS.find((p) => p.id === planId);
      if (!plan) return;

      let next: UserSubscriptionState;
      if (plan.credits === "unlimited") {
        next = {
          ...state,
          tier: "pro_monthly",
          subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        notifySuccess(
          "Welcome to Karbon Minus Pro!",
          "Unlimited project reports and AI carbon alternatives activated.",
        );
      } else {
        const addedCredits = plan.credits;
        next = {
          ...state,
          tier: state.tier === "pro_monthly" ? "pro_monthly" : "pay_per_report",
          creditsRemaining: state.creditsRemaining + addedCredits,
        };
        notifySuccess(
          `Purchased ${plan.name}`,
          `Added ${addedCredits} report ${addedCredits === 1 ? "credit" : "credits"} to your balance.`,
        );
      }

      persist(next);
      closeUpgradeModal();
    },
    [state, persist, closeUpgradeModal],
  );

  const claimStarterTrialCredit = useCallback(() => {
    if (state.creditsRemaining > 0) {
      notifyInfo("You already have credits available", `Current balance: ${state.creditsRemaining} credits.`);
      return;
    }
    const next: UserSubscriptionState = {
      ...state,
      creditsRemaining: state.creditsRemaining + 1,
    };
    persist(next);
    notifySuccess("Free Trial Credit Added!", "Enjoy 1 complimentary project carbon report.");
  }, [state, persist]);

  const resetSubscriptionState = useCallback(() => {
    persist(DEFAULT_SUBSCRIPTION_STATE);
    notifyInfo("All credits reset to default free tier (0 credits).");
  }, [persist]);

  const value = useMemo(
    () => ({
      state,
      plans: PRICING_PLANS,
      isUpgradeModalOpen,
      upgradeModalContext,
      openUpgradeModal,
      closeUpgradeModal,
      hasProjectAccess,
      unlockProjectWithCredit,
      purchasePlan,
      claimStarterTrialCredit,
      redeemPassCode,
      resetSubscriptionState,
    }),
    [
      state,
      isUpgradeModalOpen,
      upgradeModalContext,
      openUpgradeModal,
      closeUpgradeModal,
      hasProjectAccess,
      unlockProjectWithCredit,
      purchasePlan,
      claimStarterTrialCredit,
      redeemPassCode,
      resetSubscriptionState,
    ],
  );

  if (!mounted) {
    return null;
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
        <ClerkEmailWatcher onAuthEmail={handleClerkUserEmail} />
      )}
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return ctx;
}
