"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  Leaf,
  Layers,
  Calendar,
  CheckCircle2,
  Copy,
  Sparkles,
  Package,
} from "lucide-react";
import { getLotOrBatch } from "@/lib/nfc";
import { Nav } from "@/components/Nav";
import { notifySuccess } from "@/lib/toast";

export default function ClientNfcPage() {
  const params = useParams();
  const rawId = (params?.tagId as string) || "LOT-SAMPLE";
  const [verifiedOnSite, setVerifiedOnSite] = useState(false);

  const lot = getLotOrBatch(rawId);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://karbon-minus-xvt1.vercel.app/nfc/client/${lot.tagId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      notifySuccess("Link Copied", "Client Digital Material Passport URL copied.");
    } catch {
      notifySuccess("URL", shareUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] app-background-gradient pb-20">
      <Nav minimal />

      <main className="page-shell max-w-4xl pt-6">
        {/* Client Top Header Badge */}
        <div className="glass-panel p-3.5 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 pl-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> CLIENT MATERIAL PASSPORT
            </span>
            <span className="text-xs font-mono text-[var(--muted-subtle)]">Tag: #{lot.tagId}</span>
          </div>

          <div className="text-xs font-mono text-[var(--muted-foreground)] flex items-center gap-1.5 pr-2">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            Verified: {lot.dispatchDate}
          </div>
        </div>

        {/* The Client Digital Material Passport Card */}
        <div className="glass-panel glass-panel-strong p-6 sm:p-8 relative overflow-hidden">
          {/* Title & Consignment Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-accent font-semibold flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Consignment: {lot.lotNumber}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                  {lot.consignmentTitle}
                </h1>
                <p className="text-sm text-accent font-medium mt-1">
                  Project: <span className="text-white font-semibold">{lot.targetProject}</span> &bull;{" "}
                  <span className="text-[var(--muted-foreground)] font-normal">
                    Client: {lot.clientName}
                  </span>
                </p>
              </div>
              <div className="shrink-0 text-center px-3.5 py-2 rounded-2xl bg-accent/15 border border-accent/30">
                <div className="text-[10px] uppercase font-semibold text-accent tracking-wider">
                  Green Grade
                </div>
                <div className="text-2xl font-black text-accent">{lot.greenGrade}</div>
              </div>
            </div>
          </div>

          {/* HERO CARBON & SAVINGS */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-950/50 via-emerald-900/25 to-transparent border border-accent/40 p-5 sm:p-6 mb-6 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <Leaf className="w-48 h-48 text-accent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <span className="text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> Total Lot Embodied Carbon
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    {lot.totalEmbodiedCarbon.toLocaleString()}
                  </span>
                  <span className="text-sm text-[var(--muted-foreground)]">kg CO₂e (Whole Lot)</span>
                </div>
              </div>

              <div className="sm:border-l sm:border-white/10 sm:pl-4 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--muted-foreground)]">Conventional Baseline:</span>
                  <span className="font-semibold text-white/80 line-through">
                    {lot.totalConventionalCarbon.toLocaleString()} kg CO₂e
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-accent font-semibold">Net Carbon Saved:</span>
                  <span className="font-bold text-accent">
                    -{lot.totalCarbonSaved.toLocaleString()} kg CO₂e ({lot.carbonReductionPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="pt-2">
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-accent h-full rounded-full transition-all duration-500"
                      style={{ width: `${100 - lot.carbonReductionPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--muted-subtle)] mt-1 block text-right">
                    {lot.carbonReductionPercent.toFixed(1)}% reduction vs conventional procurement
                  </span>
                </div>
              </div>
            </div>

            {/* Equivalency metrics */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-white font-medium">Environmental Impact:</span>
                <span className="font-bold text-accent text-sm">
                  -{lot.totalCarbonSaved} kg CO₂e Saved
                </span>
              </div>
              <div className="text-[var(--muted-foreground)] flex items-center gap-3">
                <span>🚗 ~{lot.carKmEquivalent.toLocaleString()} km car offset</span>
                <span>🌲 ~{lot.treesPlantedEquivalent} trees planted/yr</span>
              </div>
            </div>
          </div>

          {/* Cost & Procurement Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="glass-panel p-4 rounded-xl">
              <span className="text-xs text-[var(--muted-foreground)] block">Total Lot Cost</span>
              <div className="text-lg font-bold text-white mt-1">
                ₹{lot.totalCost.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--muted-subtle)]">{lot.items.length} verified materials</span>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <span className="text-xs text-[var(--muted-foreground)] block">Conventional Cost</span>
              <div className="text-lg font-bold text-slate-300 mt-1">
                ₹{lot.totalConventionalCost.toLocaleString()}
              </div>
              <span className="text-[10px] text-[var(--muted-subtle)]">standard baseline</span>
            </div>

            <div className="glass-panel p-4 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-xs text-[var(--muted-foreground)] block">Cost Difference</span>
              <div
                className={`text-lg font-bold mt-1 ${
                  lot.netCostDifference <= 0 ? "text-accent" : "text-amber-400"
                }`}
              >
                {lot.netCostDifference > 0
                  ? `+₹${lot.netCostDifference.toLocaleString()}`
                  : `-₹${Math.abs(lot.netCostDifference).toLocaleString()}`}
              </div>
              <span className="text-[10px] text-[var(--muted-subtle)]">
                +{(lot.netCostDifference / (lot.totalConventionalCost || 1) * 100).toFixed(1)}% green investment
              </span>
            </div>
          </div>

          {/* Itemized Lot Manifest */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" /> Itemized Bill of Materials
            </h3>

            <div className="space-y-3">
              {lot.items.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel p-4 rounded-xl border border-white/10 hover:border-accent/30 transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.materialName}</span>
                        {item.hasEPD && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                            EPD VERIFIED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {item.manufacturer} &bull; Quantity: <strong>{item.quantity} {item.unit}</strong>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">₹{item.totalCost.toLocaleString()}</div>
                      <span className="text-[10px] text-[var(--muted-subtle)]">
                        (₹{item.unitPrice.toLocaleString()} / {item.unit})
                      </span>
                    </div>
                  </div>

                  {/* Item Carbon Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-[10px] text-[var(--muted-subtle)] block">Item Carbon:</span>
                      <span className="font-bold text-white">{item.totalEmbodiedCarbon} kg CO₂e</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--muted-subtle)] block">Conventional:</span>
                      <span className="line-through text-slate-400">{item.totalConventionalCarbon} kg CO₂e</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--muted-subtle)] block">Carbon Saved:</span>
                      <span className="font-bold text-accent">-{item.carbonSaved} kg CO₂e</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--muted-subtle)] block">Cost Diff:</span>
                      <span className="text-amber-400 font-semibold">+₹{item.costDifference.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On-Site Verification Action */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setVerifiedOnSite(true);
                notifySuccess(
                  "Lot Verified On-Site",
                  `Consignment ${lot.lotNumber} confirmed on site and logged to project carbon ledger.`
                );
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                verifiedOnSite
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-accent hover:bg-accent-hover text-slate-950 shadow-md"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {verifiedOnSite ? "Consignment Received On-Site ✓" : "Confirm On-Site Inspection"}
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1.5 transition border border-white/10"
              title="Copy Client Digital Passport Link"
            >
              <Copy className="w-3.5 h-3.5 text-accent" /> Copy Client Passport URL
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
