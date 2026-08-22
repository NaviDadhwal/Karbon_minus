"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Radio,
  ArrowRight,
  PlusCircle,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { DEMO_NFC_BATCHES } from "@/lib/nfc";
import { Nav } from "@/components/Nav";

export default function NfcHubPage() {
  const router = useRouter();
  const [searchTag, setSearchTag] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCarbon, setCustomCarbon] = useState(175);
  const [customCost, setCustomCost] = useState(7100);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTag.trim()) return;
    router.push(`/nfc/${encodeURIComponent(searchTag.trim().toUpperCase())}`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] app-background-gradient pb-20">
      <Nav />

      <main className="page-shell max-w-5xl pt-6">
        {/* Hero Section */}
        <div className="glass-panel glass-panel-strong p-8 text-center relative overflow-hidden mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-xs font-semibold mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> PHYSICAL-TO-DIGITAL MATERIAL PASSPORT
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
            NFC Green Material Verification
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-xl mx-auto mt-3">
            Connect physical jobsite materials directly to Karbon-Minus carbon metrics.
            Tap an NFC tag or enter a batch number to verify embodied carbon, cost ROI, and EPD certificates.
          </p>

          {/* Quick Tag Search */}
          <form onSubmit={handleLookup} className="max-w-md mx-auto mt-6 flex gap-2">
            <input
              type="text"
              placeholder="Enter Tag / Batch ID (e.g. GC1024)"
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              className="flex-1 bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-accent font-mono uppercase"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-accent text-slate-950 font-bold text-sm hover:opacity-90 transition flex items-center gap-1.5 shrink-0"
            >
              Verify Tag <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Demo Batches Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" /> Active Demo Batch Tags
            </h2>
            <span className="text-xs text-[var(--muted-subtle)]">Click to test instant verification</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Object.values(DEMO_NFC_BATCHES).map((b) => (
              <Link
                key={b.tagId}
                href={`/nfc/${b.tagId}`}
                className="glass-panel p-5 rounded-2xl hover:border-accent/50 transition duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-mono text-xs font-bold text-accent bg-accent/15 px-2.5 py-1 rounded-lg border border-accent/30">
                      #{b.tagId}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {b.greenGrade} Grade
                    </span>
                  </div>

                  <h3 className="font-bold text-white group-hover:text-accent transition leading-snug">
                    {b.materialName}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{b.manufacturer}</p>

                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[var(--muted-foreground)]">
                      <span>Embodied Carbon:</span>
                      <span className="font-bold text-white">
                        {b.embodiedCarbon} kg CO₂e/{b.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-accent font-medium">
                      <span>Carbon Saved:</span>
                      <span>
                        -{b.carbonSavedPerUnit} kg ({b.carbonReductionPercent}%)
                      </span>
                    </div>
                    <div className="flex justify-between text-[var(--muted-foreground)]">
                      <span>Cost:</span>
                      <span>₹{b.unitPrice.toLocaleString()}/{b.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-accent group-hover:translate-x-1 transition duration-200">
                  <span>Open Verification Card</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How Karbon-Minus Middleman Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-accent" /> How Field NFC Works
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              When materials arrive at a construction site, quality inspectors or site managers tap the
              NFC sticker on the cement bag or steel bundle with any smartphone.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold text-[11px]">
                  1
                </div>
                <div>
                  <strong className="text-white">Zero App Installs:</strong> Native NFC reader opens the
                  secure passport URL directly.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold text-[11px]">
                  2
                </div>
                <div>
                  <strong className="text-white">Dual Verification:</strong> Supplier checks dispatch specs;
                  Client checks carbon savings & EPD proof.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-bold text-[11px]">
                  3
                </div>
                <div>
                  <strong className="text-white">Project Ledger Sync:</strong> One click updates the project&apos;s
                  actual embodied carbon ledger.
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <PlusCircle className="w-4 h-4 text-accent" /> Generate New Batch Tag
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mb-4">
                Simulate issuing an NFC tag for a custom green supplier shipment.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[var(--muted-subtle)] mb-1 font-medium">Material Name</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. EcoFly Low-Carbon Fly Ash Bricks"
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[var(--muted-subtle)] mb-1 font-medium">Carbon (kg CO₂e)</label>
                    <input
                      type="number"
                      value={customCarbon}
                      onChange={(e) => setCustomCarbon(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--muted-subtle)] mb-1 font-medium">Unit Price (₹)</label>
                    <input
                      type="number"
                      value={customCost}
                      onChange={(e) => setCustomCost(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const tagId = customName.trim()
                  ? customName.slice(0, 4).toUpperCase() + Math.floor(Math.random() * 900 + 100)
                  : "KM" + Math.floor(Math.random() * 9000 + 1000);
                router.push(`/nfc/${tagId}`);
              }}
              className="mt-5 w-full py-2.5 rounded-xl bg-accent text-slate-950 font-bold text-xs hover:opacity-90 transition flex items-center justify-center gap-1.5"
            >
              Generate Digital Tag Passport <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
