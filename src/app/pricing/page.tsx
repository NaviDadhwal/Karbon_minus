"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Leaf,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useSubscription, PRICING_PLANS } from "@/context/SubscriptionContext";
import { formatInr } from "@/lib/utils";

const COMPARISON_FEATURES = [
  {
    category: "Material Selection & Database",
    items: [
      { name: "Manual Natural Language Material Parser", free: true, perReport: true, pro: true },
      { name: "Full Indian Materials Database (Steel, Cement, Glass, Timber, etc.)", free: true, perReport: true, pro: true },
      { name: "Itemized Supplier Pricing (₹/unit) & Total Cost", free: true, perReport: true, pro: true },
      { name: "Real-time Bill of Materials Procurement Cart", free: true, perReport: true, pro: true },
      { name: "Project Cost Ceiling Tracking", free: true, perReport: true, pro: true },
    ],
  },
  {
    category: "AI Carbon Intelligence & Optimization",
    items: [
      { name: "AI Lower-Carbon Alternatives & Material Swaps", free: false, perReport: true, pro: true },
      { name: "Embodied Carbon Calculations (kgCO₂e)", free: false, perReport: true, pro: true },
      { name: "Semiconductor Automation Supply Chain Risk Index", free: false, perReport: true, pro: true },
      { name: "Pareto Cost vs Carbon Optimization Engine", free: false, perReport: true, pro: true },
      { name: "AI Executive Summary Generator", free: false, perReport: true, pro: true },
    ],
  },
  {
    category: "Reports & Compliance Exports",
    items: [
      { name: "Procurement Pricing Summary (Cost-only preview)", free: true, perReport: true, pro: true },
      { name: "Full Carbon Procurement Report (Before vs After, Category Pie)", free: false, perReport: true, pro: true },
      { name: "Official PDF Export with EPD Compliance & QR Carbon Passport", free: false, perReport: true, pro: true },
      { name: "Itemized CSV Data Export with Embodied Carbon Values", free: false, perReport: true, pro: true },
      { name: "Custom EPD Data Ingestion & Priority SLA Support", free: false, perReport: false, pro: true },
    ],
  },
];

const FAQS = [
  {
    q: "Why is material selection and pricing free while carbon reports are paid?",
    a: "We believe every contractor, engineer, and quantity surveyor should be able to freely browse construction materials and compare supplier prices. Our advanced AI lower-carbon alternative models, supply chain risk intelligence, and certified EPD carbon calculation engine operate on a per-report credit model to keep costs fair and predictable.",
  },
  {
    q: "How does the per-report credit model work?",
    a: "Each report credit unlocks full carbon intelligence, AI alternatives, semiconductor risk analysis, and unlimited PDF/CSV downloads for 1 specific project. Once unlocked, that project stays permanently unlocked for you to edit and re-export anytime.",
  },
  {
    q: "Do report credits expire?",
    a: "Report credits purchased via our Pay-As-You-Go or 5-Report Pack are valid for 12 full months from the date of purchase.",
  },
  {
    q: "What green building frameworks do Karbon Minus reports comply with?",
    a: "Our PDF and CSV reports generate embodied carbon disclosures compatible with IGBC Green Building Rating, GRIHA v2019, LEED v4.1 (MR Credit: Building Life-Cycle Impact Reduction), and ECBC compliance submissions.",
  },
  {
    q: "Can I try before purchasing?",
    a: "Yes! Every user receives 1 free complimentary trial report credit upon onboarding, allowing you to test the full carbon optimization and export workflow on a real project.",
  },
];

export default function PricingPage() {
  const {
    state,
    purchasePlan,
    claimStarterTrialCredit,
  } = useSubscription();


  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const handlePurchase = (planId: string) => {
    setPurchasingId(planId);
    setTimeout(() => {
      purchasePlan(planId);
      setPurchasingId(null);
    }, 600);
  };

  const isPro = state.tier === "pro_monthly";

  return (
    <>
      <Nav />
      <main className="page-shell pb-24">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto pt-6 pb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(23,207,151,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pay-Per-Report & Pro Subscription</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
            Transparent Pricing Built for <br />
            <span className="text-accent">Sustainable Construction</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Manual material selection and pricing are <strong>100% free</strong>. Pay only when you need AI lower-carbon optimization and certified procurement reports.
          </p>

          {/* Current Credit State Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-card/80 border border-border text-sm shadow-md">
            <span className="text-muted">Your Current Status:</span>
            <span className="font-bold text-accent font-mono flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-accent/30" />
              {isPro
                ? "Enterprise Pro Plan (Unlimited)"
                : `${state.creditsRemaining} Report ${state.creditsRemaining === 1 ? "Credit Available" : "Credits Available"}`}
            </span>
            {state.creditsRemaining === 0 && !isPro && (
              <button
                type="button"
                onClick={claimStarterTrialCredit}
                className="text-xs font-semibold text-accent hover:underline ml-2"
              >
                Claim Free Trial Report →
              </button>
            )}
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="mt-4 grid gap-6 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const isPurchasing = purchasingId === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col justify-between p-6 sm:p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-accent bg-accent/[0.08] shadow-[0_0_35px_rgba(23,207,151,0.25)] scale-[1.02]"
                    : "border-border/80 bg-card/70 hover:border-accent/40"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-black font-extrabold text-xs uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                    {!plan.popular && plan.badge && (
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-muted">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>

                  <div className="mt-6 pb-6 border-b border-border">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-foreground font-mono">
                        {formatInr(plan.priceInr)}
                      </span>
                    </div>
                    <p className="text-xs text-subtle mt-1 font-medium">{plan.unitDescription}</p>
                  </div>

                  {/* Feature List */}
                  <ul className="mt-6 space-y-3 text-xs sm:text-sm">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-foreground/90">
                        <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-border/50">
                  <Button
                    type="button"
                    disabled={isPurchasing || (plan.id === "pro_monthly" && isPro)}
                    onClick={() => handlePurchase(plan.id)}
                    variant={plan.popular ? "primary" : "secondary"}
                    className="w-full py-3 font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isPurchasing ? (
                      <span className="animate-pulse">Processing Order...</span>
                    ) : plan.id === "pro_monthly" && isPro ? (
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-accent" /> Active Subscription
                      </span>
                    ) : (
                      <>
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </section>

        {/* Free Tier Callout Banner */}
        <section className="mt-12 p-6 sm:p-8 rounded-3xl bg-card/50 border border-border backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-accent text-xs font-semibold uppercase tracking-wider">
              <Leaf className="w-4 h-4" />
              <span>Free Starter Tier</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Always Free: Material Entry & Price Verification
            </h2>
            <p className="text-sm text-muted max-w-xl">
              No credit card required. Build unlimited project bills of materials, search over 100+ construction materials, and verify supplier costs without paying a rupee.
            </p>
          </div>

          <Link href="/projects">
            <Button variant="secondary" className="px-6 py-3 font-semibold text-sm shrink-0">
              Start Free Workspace →
            </Button>
          </Link>
        </section>

        {/* Detailed Feature Comparison Table */}
        <section className="mt-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-foreground">Detailed Plan Comparison</h2>
            <p className="mt-1 text-sm text-muted">
              Choose the right model for your project workflow and procurement volume.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
            <table className="w-full text-left text-sm text-foreground">
              <thead>
                <tr className="border-b border-border bg-card/80 text-xs uppercase tracking-wider text-muted">
                  <th className="p-4 sm:p-5 font-semibold">Features & Capabilities</th>
                  <th className="p-4 sm:p-5 font-semibold text-center w-36">Free Tier</th>
                  <th className="p-4 sm:p-5 font-semibold text-center w-40 text-accent">Per-Report Pass</th>
                  <th className="p-4 sm:p-5 font-semibold text-center w-36">Enterprise Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {COMPARISON_FEATURES.map((cat, catIdx) => (
                  <React.Fragment key={catIdx}>
                    <tr className="bg-white/5 font-semibold text-xs text-accent">
                      <td colSpan={4} className="px-4 py-2.5 tracking-wide">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.items.map((item, itemIdx) => (
                      <tr key={itemIdx} className="hover:bg-white/[0.02] transition">
                        <td className="p-4 sm:p-5 text-foreground font-medium">{item.name}</td>
                        <td className="p-4 sm:p-5 text-center">
                          {item.free ? (
                            <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted mx-auto opacity-40" />
                          )}
                        </td>
                        <td className="p-4 sm:p-5 text-center bg-accent/[0.03]">
                          {item.perReport ? (
                            <Check className="w-4 h-4 text-accent mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted mx-auto opacity-40" />
                          )}
                        </td>
                        <td className="p-4 sm:p-5 text-center">
                          {item.pro ? (
                            <Check className="w-4 h-4 text-accent mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-muted mx-auto opacity-40" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
            <p className="mt-1 text-sm text-muted">
              Everything you need to know about our per-report billing and carbon verification.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card/60 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left font-semibold text-foreground hover:text-accent transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-accent shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-sm text-muted leading-relaxed border-t border-border/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
