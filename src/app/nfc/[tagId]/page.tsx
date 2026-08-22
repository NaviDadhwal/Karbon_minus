"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Leaf,
  Layers,
  ArrowRight,
  Factory,
  Calendar,
  CheckCircle2,
  Copy,
  Radio,
  Building2,
  Sparkles,
  Smartphone,
  Package,
  FileCheck,
} from "lucide-react";
import { getLotOrBatch, DEMO_LOTS } from "@/lib/nfc";
import { Nav } from "@/components/Nav";
import { notifySuccess, notifyError } from "@/lib/toast";

export default function NfcPassportPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.tagId as string) || "LOT-SAMPLE";
  const [viewRole, setViewRole] = useState<"client" | "supplier">("client");
  const [isWritingNfc, setIsWritingNfc] = useState(false);
  const [verifiedOnSite, setVerifiedOnSite] = useState(false);

  const lot = getLotOrBatch(rawId);

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://karbon-minus.vercel.app/nfc/${lot.tagId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      notifySuccess("Link Copied", "Digital Material Passport URL copied to clipboard.");
    } catch {
      notifySuccess("URL", shareUrl);
    }
  };

  const handleWriteNfc = async () => {
    if (typeof window === "undefined" || !("NDEFReader" in window)) {
      notifyError(
        "Web NFC Device Notice",
        "Web NFC is available on Chrome for Android. On iPhones, use any free NFC Tools app to write this URL to your physical tag."
      );
      return;
    }

    try {
      setIsWritingNfc(true);
      // @ts-expect-error Web NFC standard API
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: "url",
            data: shareUrl,
          },
        ],
      });
      notifySuccess("NFC Tag Written!", `Physical tag programmed for lot ${lot.lotNumber}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to communicate with NFC tag.";
      notifyError("NFC Write Cancelled", msg);
    } finally {
      setIsWritingNfc(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] app-background-gradient pb-20">
      <Nav />

      <main className="page-shell max-w-5xl pt-6">
        {/* Top Demo Selector Bar */}
        <div className="glass-panel p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5 pl-2">
              <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
              NFC Passports:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => router.push("/nfc/LOT-SAMPLE")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition ${
                  rawId.toUpperCase() === "LOT-SAMPLE" || rawId.toUpperCase() === "LOT"
                    ? "bg-accent text-slate-950 shadow-md font-bold"
                    : "bg-white/5 hover:bg-white/10 text-[var(--muted-foreground)]"
                }`}
              >
                ★ Whole Lot (2t Cement + 1t Glass)
              </button>
              {Object.keys(DEMO_LOTS)
                .filter((k) => k !== "LOT-SAMPLE")
                .map((id) => (
                  <button
                    key={id}
                    onClick={() => router.push(`/nfc/${id}`)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition ${
                      rawId.toUpperCase() === id
                        ? "bg-accent text-slate-950 shadow-md font-bold"
                        : "bg-white/5 hover:bg-white/10 text-[var(--muted-foreground)]"
                    }`}
                  >
                    #{id}
                  </button>
                ))}
            </div>
          </div>

          {/* Role Perspective Toggle */}
          <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setViewRole("client")}
              className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                viewRole === "client"
                  ? "bg-accent text-slate-950 font-bold shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> Client View
            </button>
            <button
              onClick={() => setViewRole("supplier")}
              className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                viewRole === "supplier"
                  ? "bg-accent text-slate-950 font-bold shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-white"
              }`}
            >
              <Factory className="w-3.5 h-3.5" /> Supplier / QA View
            </button>
          </div>
        </div>

        {/* The Digital Material Passport Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Passport Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel glass-panel-strong p-6 sm:p-8 relative overflow-hidden">
              {/* Status Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> EPD VERIFIED LOT PASSPORT
                  </span>
                  <span className="text-xs font-mono text-[var(--muted-subtle)]">
                    ID: #{lot.tagId}
                  </span>
                </div>
                <div className="text-xs font-mono text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  {lot.dispatchDate}
                </div>
              </div>

              {/* Title & Consignment Header */}
              <div className="mt-5 mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      {lot.consignmentTitle}
                    </h1>
                    <p className="text-sm text-accent font-medium mt-1 flex items-center gap-1.5">
                      <Package className="w-4 h-4" />
                      {lot.lotNumber} &bull;{" "}
                      <span className="text-[var(--muted-foreground)] font-normal">
                        Project: {lot.targetProject}
                      </span>
                    </p>
                  </div>
                  <div className="shrink-0 text-center px-3 py-2 rounded-2xl bg-accent/15 border border-accent/30">
                    <div className="text-[10px] uppercase font-semibold text-accent tracking-wider">
                      Green Grade
                    </div>
                    <div className="text-2xl font-black text-accent">{lot.greenGrade}</div>
                  </div>
                </div>
              </div>

              {/* CLIENT VIEW: HERO CARBON & SAVINGS */}
              {viewRole === "client" ? (
                <>
                  {/* Hero Carbon Box */}
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
                          <span className="text-[var(--muted-foreground)]">Conventional Benchmark:</span>
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
                          -{lot.totalCarbonSaved} kg CO₂e
                        </span>
                      </div>
                      <div className="text-[var(--muted-foreground)] flex items-center gap-3">
                        <span>🚗 ~{lot.carKmEquivalent.toLocaleString()} km car offset</span>
                        <span>🌲 ~{lot.treesPlantedEquivalent} trees/yr</span>
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
                      <span className="text-[10px] text-[var(--muted-subtle)]">standard market baseline</span>
                    </div>

                    <div className="glass-panel p-4 rounded-xl col-span-2 sm:col-span-1">
                      <span className="text-xs text-[var(--muted-foreground)] block">Net Cost Premium</span>
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
                        +{(lot.netCostDifference / (lot.totalConventionalCost || 1) * 100).toFixed(1)}% green premium
                      </span>
                    </div>
                  </div>

                  {/* Itemized Lot Manifest */}
                  <div className="space-y-3 mb-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-accent" /> Itemized Lot Bill of Materials
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
                                    EPD
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
                </>
              ) : (
                /* SUPPLIER / QA PERSPECTIVE */
                <div className="space-y-4 mb-6">
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Factory className="w-4 h-4 text-accent" /> Dispatch & Consignment Manifest
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[var(--muted-foreground)] block">Consignment Lot ID:</span>
                        <span className="font-mono font-semibold text-white">{lot.lotNumber}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted-foreground)] block">Dispatch Logistics Hub:</span>
                        <span className="font-semibold text-white">{lot.dispatchPlant}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted-foreground)] block">Recipient Client:</span>
                        <span className="font-semibold text-white">{lot.clientName}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted-foreground)] block">Destination Project:</span>
                        <span className="font-semibold text-white">{lot.targetProject}</span>
                      </div>
                    </div>
                  </div>

                  {/* Item EPD verification records */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-accent" /> Environmental Product Declaration (EPD) Records
                    </h4>
                    <div className="space-y-2 text-xs">
                      {lot.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/5"
                        >
                          <div>
                            <span className="font-medium text-white block">{item.materialName}</span>
                            <span className="font-mono text-[10px] text-accent">{item.epdNumber}</span>
                          </div>
                          <span className="text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded font-bold">
                            VALIDATED ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cryptographic Verification Hash */}
                  <div className="glass-panel p-4 rounded-xl border border-accent/20">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Consignment Integrity Hash
                    </span>
                    <p className="font-mono text-xs text-white/90 break-all bg-black/30 p-2 rounded-lg border border-white/5">
                      {lot.verificationHash}
                    </p>
                    <span className="text-[10px] text-[var(--muted-subtle)] mt-1 block">
                      Cryptographically signed by Karbon-Minus Middleman Ledger.
                    </span>
                  </div>
                </div>
              )}

              {/* On-Site Verification Action */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setVerifiedOnSite(true);
                    notifySuccess(
                      "Whole Lot Verified",
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1.5 transition border border-white/10"
                    title="Copy Digital Passport Link"
                  >
                    <Copy className="w-3.5 h-3.5 text-accent" /> Copy Link
                  </button>
                  <button
                    onClick={handleWriteNfc}
                    disabled={isWritingNfc}
                    className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition border border-accent/30"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-accent" />
                    {isWritingNfc ? "Tap tag now..." : "Write to NFC Tag"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Physical Tag & Workflow */}
          <div className="lg:col-span-4 space-y-6">
            {/* Physical Tag Visualizer */}
            <div className="glass-panel p-6 text-center relative overflow-hidden">
              <span className="eyebrow block mb-3">Physical Lot Tag</span>

              {/* Tag Physical Chip Badge */}
              <div className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 border-2 border-accent/50 p-3.5 shadow-2xl flex flex-col items-center justify-between relative group">
                <div className="w-full flex justify-between items-center text-[9px] font-mono text-accent">
                  <span>WHOLE LOT NFC</span>
                  <Radio className="w-3 h-3 text-accent animate-ping" />
                </div>

                <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                  <Package className="w-6 h-6" />
                </div>

                <div className="text-center w-full">
                  <div className="text-[11px] font-bold text-white tracking-tight">KARBON-MINUS LOT</div>
                  <div className="text-[9px] font-mono text-accent/90">#{lot.tagId}</div>
                </div>
              </div>

              <p className="text-xs text-[var(--muted-foreground)] mt-4">
                Programmed URL: <br />
                <code className="text-[10px] text-accent font-mono bg-black/30 px-2 py-0.5 rounded">
                  karbon-minus.vercel.app/nfc/{lot.tagId}
                </code>
              </p>

              <div className="mt-5 space-y-2">
                <Link
                  href="/projects"
                  className="w-full py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                >
                  View in Project Carbon Ledger <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/nfc"
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center justify-center gap-1 transition"
                >
                  Explore All NFC Tags
                </Link>
              </div>
            </div>

            {/* How Karbon-Minus Middleman Works */}
            <div className="glass-panel p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> The Whole-Lot Verification Loop
              </h4>
              <ol className="text-xs text-[var(--muted-foreground)] space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  <strong className="text-white">Report Generation:</strong> Once client selects materials &amp; generates the report, Karbon-Minus packages the lot.
                </li>
                <li>
                  <strong className="text-white">Whole-Lot Tag Minting:</strong> A single tag is issued for the shipment containing 2t cement + 1t glass.
                </li>
                <li>
                  <strong className="text-white">Supplier Dispatch:</strong> Factory quality team confirms EPD and dispatch quantities.
                </li>
                <li>
                  <strong className="text-white">Jobsite Tap:</strong> Project engineer scans the tag to verify 510 kg CO₂e saved and +₹8.1k cost difference.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
