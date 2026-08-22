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
} from "lucide-react";
import { getBatchOrMaterial, DEMO_NFC_BATCHES } from "@/lib/nfc";
import { Nav } from "@/components/Nav";
import { notifySuccess, notifyError } from "@/lib/toast";

export default function NfcPassportPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.tagId as string) || "GC1024";
  const [viewRole, setViewRole] = useState<"client" | "supplier">("client");
  const [isWritingNfc, setIsWritingNfc] = useState(false);
  const [verifiedOnSite, setVerifiedOnSite] = useState(false);

  const batch = getBatchOrMaterial(rawId);

  if (!batch) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6">
        <div className="glass-panel max-w-md w-full p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold mb-2">Tag Not Found</h1>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            No registered material batch found for ID &ldquo;{rawId}&rdquo;.
          </p>
          <Link
            href="/nfc/GC1024"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-slate-950 font-semibold text-sm hover:opacity-90 transition"
          >
            Load Demo Tag (GC1024)
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://karbon-minus.vercel.app/nfc/${batch.tagId}`;

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
        "Web NFC Unsupported",
        "Web NFC is supported on Chrome for Android. On iPhones, use any free NFC Tools app to write this URL to your tag."
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
      notifySuccess("NFC Tag Written!", `Physical tag programmed with URL for ${batch.batchNumber}`);
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

      <main className="page-shell max-w-4xl pt-6">
        {/* Top Demo Selector Pill Bar */}
        <div className="glass-panel p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5 pl-2">
              <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
              NFC Demo Tags:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {Object.keys(DEMO_NFC_BATCHES).map((id) => (
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
                    <ShieldCheck className="w-3.5 h-3.5" /> EPD VERIFIED BATCH
                  </span>
                  <span className="text-xs font-mono text-[var(--muted-subtle)]">
                    ID: #{batch.tagId}
                  </span>
                </div>
                <div className="text-xs font-mono text-[var(--muted-foreground)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  {batch.dispatchDate}
                </div>
              </div>

              {/* Material Title & Manufacturer */}
              <div className="mt-5 mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      {batch.materialName}
                    </h1>
                    <p className="text-sm text-accent font-medium mt-1 flex items-center gap-1.5">
                      <Factory className="w-4 h-4" />
                      {batch.manufacturer} &bull;{" "}
                      <span className="text-[var(--muted-foreground)] font-normal">
                        {batch.plantLocation}
                      </span>
                    </p>
                  </div>
                  <div className="shrink-0 text-center px-3 py-2 rounded-2xl bg-accent/15 border border-accent/30">
                    <div className="text-[10px] uppercase font-semibold text-accent tracking-wider">
                      Green Grade
                    </div>
                    <div className="text-2xl font-black text-accent">{batch.greenGrade}</div>
                  </div>
                </div>
              </div>

              {/* CLIENT PERSPECTIVE HERO: CARBON & SAVINGS */}
              {viewRole === "client" ? (
                <>
                  {/* Hero Carbon Box */}
                  <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-emerald-900/20 to-transparent border border-accent/40 p-5 sm:p-6 mb-6 relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                      <Leaf className="w-48 h-48 text-accent" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-1">
                          <Leaf className="w-3.5 h-3.5" /> Embodied Carbon Footprint
                        </span>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-4xl sm:text-5xl font-black text-white">
                            {batch.embodiedCarbon}
                          </span>
                          <span className="text-sm text-[var(--muted-foreground)]">
                            kg CO₂e / {batch.unit}
                          </span>
                        </div>
                      </div>

                      <div className="sm:border-l sm:border-white/10 sm:pl-4 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[var(--muted-foreground)]">Conventional Benchmark:</span>
                          <span className="font-semibold text-white/80 line-through">
                            {batch.conventionalCarbon} kg CO₂e
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-accent font-semibold">Net Carbon Saved:</span>
                          <span className="font-bold text-accent">
                            -{batch.carbonSavedPerUnit} kg CO₂e ({batch.carbonReductionPercent}%)
                          </span>
                        </div>
                        <div className="pt-2">
                          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-accent h-full rounded-full transition-all duration-500"
                              style={{ width: `${100 - batch.carbonReductionPercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-[var(--muted-subtle)] mt-1 block text-right">
                            {batch.carbonReductionPercent}% lower than national average
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Batch Total Savings Banner */}
                    <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        <span className="text-white font-medium">
                          Total Batch Savings ({batch.quantity} {batch.unit}):
                        </span>
                        <span className="font-bold text-accent text-sm">
                          {batch.totalCarbonSaved.toLocaleString()} kg CO₂e
                        </span>
                      </div>
                      <div className="text-[var(--muted-foreground)] flex items-center gap-3">
                        <span>🚗 ~{batch.carKmEquivalent.toLocaleString()} km car offset</span>
                        <span>🌲 ~{batch.treesPlantedEquivalent} trees/yr</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost & Procurement Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    <div className="glass-panel p-4 rounded-xl">
                      <span className="text-xs text-[var(--muted-foreground)] block">
                        Batch Unit Price
                      </span>
                      <div className="text-lg font-bold text-white mt-1">
                        ₹{batch.unitPrice.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-[var(--muted-subtle)]">per {batch.unit}</span>
                    </div>

                    <div className="glass-panel p-4 rounded-xl">
                      <span className="text-xs text-[var(--muted-foreground)] block">
                        Cost Difference
                      </span>
                      <div
                        className={`text-lg font-bold mt-1 ${
                          batch.priceDifference <= 0 ? "text-accent" : "text-amber-400"
                        }`}
                      >
                        {batch.priceDifference > 0
                          ? `+₹${batch.priceDifference.toLocaleString()}`
                          : `-₹${Math.abs(batch.priceDifference).toLocaleString()}`}
                      </div>
                      <span className="text-[10px] text-[var(--muted-subtle)]">
                        vs conventional market
                      </span>
                    </div>

                    <div className="glass-panel p-4 rounded-xl col-span-2 sm:col-span-1">
                      <span className="text-xs text-[var(--muted-foreground)] block">
                        Total Shipment Cost
                      </span>
                      <div className="text-lg font-bold text-white mt-1">
                        ₹{batch.totalBatchCost.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-[var(--muted-subtle)]">
                        qty: {batch.quantity} {batch.unit}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                /* SUPPLIER / QA PERSPECTIVE */
                <div className="space-y-4 mb-6">
                  <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Factory className="w-4 h-4 text-accent" /> Dispatch & Quality Specifications
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[var(--muted-foreground)] block">Batch Reference:</span>
                        <span className="font-mono font-semibold text-white">{batch.batchNumber}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted-foreground)] block">Destination Project:</span>
                        <span className="font-semibold text-white">{batch.targetProject}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted-foreground)] block">EPD Certificate ID:</span>
                        <span className="font-mono text-accent font-medium">{batch.epdNumber}</span>
                      </div>
                      <div>
                        <span className="text-[var(--muted-foreground)] block">Dispatch Quantity:</span>
                        <span className="font-semibold text-white">
                          {batch.quantity} {batch.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Verification Hash */}
                  <div className="glass-panel p-4 rounded-xl border border-accent/20">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Cryptographic Integrity Hash
                    </span>
                    <p className="font-mono text-xs text-white/90 break-all bg-black/30 p-2 rounded-lg border border-white/5">
                      {batch.verificationHash}
                    </p>
                    <span className="text-[10px] text-[var(--muted-subtle)] mt-1 block">
                      Tamper-proof record verified against Karbon-Minus Green Ledger.
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
                      "Delivery Verified",
                      `Batch ${batch.batchNumber} confirmed on site and logged to carbon ledger.`
                    );
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    verifiedOnSite
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-accent hover:bg-accent-hover text-slate-950 shadow-md"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {verifiedOnSite ? "Delivery Confirmed On-Site ✓" : "Confirm On-Site Inspection"}
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

          {/* Right Column: Physical Tag Simulator & How It Works */}
          <div className="lg:col-span-4 space-y-6">
            {/* Physical Tag Visualizer */}
            <div className="glass-panel p-6 text-center relative overflow-hidden">
              <span className="eyebrow block mb-3">Physical Tag Simulator</span>

              {/* Tag Physical Chip Badge */}
              <div className="w-36 h-36 mx-auto rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 border-2 border-accent/50 p-3 shadow-2xl flex flex-col items-center justify-between relative group">
                <div className="w-full flex justify-between items-center text-[9px] font-mono text-accent">
                  <span>NFC 13.56MHz</span>
                  <Radio className="w-3 h-3 text-accent animate-ping" />
                </div>

                <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
                  <Leaf className="w-6 h-6" />
                </div>

                <div className="text-center w-full">
                  <div className="text-[11px] font-bold text-white tracking-tight">KARBON-MINUS</div>
                  <div className="text-[9px] font-mono text-accent/90">#{batch.tagId}</div>
                </div>
              </div>

              <p className="text-xs text-[var(--muted-foreground)] mt-4">
                Encodes URL: <br />
                <code className="text-[10px] text-accent font-mono bg-black/30 px-2 py-0.5 rounded">
                  karbon-minus.vercel.app/nfc/{batch.tagId}
                </code>
              </p>

              <div className="mt-5 space-y-2">
                <Link
                  href="/projects"
                  className="w-full py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition"
                >
                  Attach to Project Bill of Materials <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/nfc"
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center justify-center gap-1 transition"
                >
                  View All Tag Batches
                </Link>
              </div>
            </div>

            {/* How Karbon-Minus Middleman Works */}
            <div className="glass-panel p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Karbon-Minus Trust Ledger
              </h4>
              <ol className="text-xs text-[var(--muted-foreground)] space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  <strong className="text-white">Procurement Optimization:</strong> Client selects
                  verified low-carbon supplier in Karbon-Minus.
                </li>
                <li>
                  <strong className="text-white">Tag Generation:</strong> Karbon-Minus mints a digital
                  batch passport with verified EPD hash.
                </li>
                <li>
                  <strong className="text-white">Physical Tagging:</strong> Tag is attached to cement
                  bags/rebar bundles at dispatch.
                </li>
                <li>
                  <strong className="text-white">On-Site Tap:</strong> Site engineer taps the tag with any
                  phone to verify carbon & cost savings instantly.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
