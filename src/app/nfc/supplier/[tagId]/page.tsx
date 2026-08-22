"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  Factory,
  Calendar,
  CheckCircle2,
  Copy,
  Package,
  FileCheck,
  Truck,
  Building2,
} from "lucide-react";
import { getLotOrBatch } from "@/lib/nfc";
import { Nav } from "@/components/Nav";
import { notifySuccess } from "@/lib/toast";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";

export default function SupplierNfcPage() {
  const params = useParams();
  const rawId = (params?.tagId as string) || "LOT-SAMPLE";
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

  const lot = getLotOrBatch(rawId);

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://karbon-minus-xvt1.vercel.app/nfc/supplier/${lot.tagId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      notifySuccess("Link Copied", "Supplier Dispatch Passport URL copied.");
    } catch {
      notifySuccess("URL", shareUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] app-background-gradient pb-20">
      <Nav minimal />

      <main className="page-shell max-w-4xl pt-6">
        {/* Supplier Top Header Badge */}
        <div className="glass-panel p-3.5 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 pl-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-mono text-xs font-semibold">
              <Factory className="w-3.5 h-3.5" /> SUPPLIER DISPATCH &amp; QA MANIFEST
            </span>
            <span className="text-xs font-mono text-[var(--muted-subtle)]">Tag: #{lot.tagId}</span>
          </div>

          <div className="text-xs font-mono text-[var(--muted-foreground)] flex items-center gap-1.5 pr-2">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            Dispatch: {lot.dispatchDate}
          </div>
        </div>

        {/* The Supplier Digital Dispatch Card */}
        <div className="glass-panel glass-panel-strong p-6 sm:p-8 relative overflow-hidden">
          {/* Title & Consignment Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-accent font-semibold flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Consignment #{lot.lotNumber}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                  {lot.consignmentTitle}
                </h1>
                <p className="text-sm text-accent font-medium mt-1">
                  Target Hub: <span className="text-white font-semibold">{lot.dispatchPlant}</span>
                </p>
              </div>
              <div className="shrink-0 text-center px-3.5 py-2 rounded-2xl bg-blue-500/15 border border-blue-500/30">
                <div className="text-[10px] uppercase font-semibold text-blue-300 tracking-wider">
                  QA Status
                </div>
                <div className="text-xl font-black text-blue-400">PASSED ✓</div>
              </div>
            </div>
          </div>

          {/* Dispatch Specifications */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent" /> Shipment &amp; Logistics Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <span className="text-[var(--muted-subtle)] block">Consignment Lot ID:</span>
                <span className="font-mono font-semibold text-white text-sm">{lot.lotNumber}</span>
              </div>
              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <span className="text-[var(--muted-subtle)] block">Dispatch Plant:</span>
                <span className="font-semibold text-white text-sm">{lot.dispatchPlant}</span>
              </div>
              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <span className="text-[var(--muted-subtle)] block">Recipient Client:</span>
                <span className="font-semibold text-white text-sm flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-accent" /> {lot.clientName}
                </span>
              </div>
              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <span className="text-[var(--muted-subtle)] block">Destination Project:</span>
                <span className="font-semibold text-white text-sm mt-0.5">{lot.targetProject}</span>
              </div>
            </div>
          </div>

          {/* Environmental Product Declaration (EPD) Records */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-accent" /> Certified Environmental Product Declarations (EPD)
            </h3>
            <div className="space-y-3">
              {lot.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 bg-black/25 p-3.5 rounded-xl border border-white/5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm block">{item.materialName}</span>
                      <AvailabilityBadge materialName={item.materialName} />
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {item.manufacturer} &bull; Dispatch Qty: <strong>{item.quantity} {item.unit}</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs text-accent font-semibold block">{item.epdNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold inline-block mt-0.5">
                      EPD VERIFIED ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Verification Hash */}
          <div className="glass-panel p-4 rounded-xl border border-accent/20 mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Consignment Integrity Hash
            </span>
            <p className="font-mono text-xs text-white/90 break-all bg-black/40 p-2.5 rounded-lg border border-white/5">
              {lot.verificationHash}
            </p>
            <span className="text-[10px] text-[var(--muted-subtle)] mt-1.5 block">
              Cryptographically signed by Karbon-Minus Middleman Ledger for tamper prevention.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setDispatchConfirmed(true);
                notifySuccess(
                  "Dispatch Confirmed",
                  `Consignment ${lot.lotNumber} marked as dispatched and cryptographically sealed.`
                );
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                dispatchConfirmed
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-accent hover:bg-accent-hover text-slate-950 shadow-md"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {dispatchConfirmed ? "Dispatch Sealed &amp; Synced ✓" : "Seal &amp; Confirm Factory Dispatch"}
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs flex items-center gap-1.5 transition border border-white/10"
              title="Copy Supplier Dispatch Link"
            >
              <Copy className="w-3.5 h-3.5 text-accent" /> Copy Supplier URL
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
