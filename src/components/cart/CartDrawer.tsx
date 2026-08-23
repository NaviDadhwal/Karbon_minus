"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Leaf,
  DollarSign,
  Cpu,
  Sparkles,
  FileSpreadsheet,
  QrCode,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { getSemiconductorRisk } from "@/lib/availability";
import { formatInr, formatKgCo2e } from "@/lib/utils";
import { getMaterialById } from "@/lib/db";
import { buildProjectMaterial } from "@/lib/materials";
import { DEFAULT_STARTER_MATERIALS } from "@/lib/default-starter-materials";
import { notifyInfo, notifySuccess } from "@/lib/toast";

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    project,
    materials,
    removeMaterial,
    updateMaterialQuantity,
    addMaterial,
  } = useProject();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  // Real-time totals
  const totalCost = materials.reduce((acc, m) => acc + (m.totalCost || 0), 0);
  const totalCarbon = materials.reduce((acc, m) => acc + (m.totalCarbon || 0), 0);

  // Semiconductor average risk calculation
  const totalRiskScore = materials.reduce(
    (acc, m) => acc + getSemiconductorRisk(m.materialName).riskScore,
    0,
  );
  const avgRiskScore =
    materials.length > 0 ? Math.round(totalRiskScore / materials.length) : 0;

  const riskLevelLabel =
    avgRiskScore <= 30
      ? "High Supply Resilience (Low Risk)"
      : avgRiskScore <= 60
      ? "Moderate Supply Risk"
      : "High Semiconductor Dependency Risk";

  const costCeiling = project?.costCeiling ?? 10000000;
  const carbonBudget = project?.carbonBudget ?? 500000;

  const costPercentage = Math.min(100, Math.round((totalCost / (costCeiling || 1)) * 100));
  const carbonPercentage = Math.min(100, Math.round((totalCarbon / (carbonBudget || 1)) * 100));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-over Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-[var(--background)] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/15 border border-accent/30 text-accent">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">Procurement Cart</h2>
                <span className="px-2 py-0.5 text-xs font-bold font-mono rounded-full bg-accent/20 text-accent border border-accent/30">
                  {materials.length} {materials.length === 1 ? "line" : "lines"}
                </span>
              </div>
              <p className="text-xs text-muted">
                {project ? `Project: ${project.name}` : "Real-time Bill of Materials"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-Time Live Metrics Overview */}
        {materials.length > 0 && (
          <div className="p-4 bg-black/30 border-b border-white/10 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Cost card */}
              <div className="p-3 rounded-xl bg-card/60 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-muted">
                  <span className="flex items-center gap-1 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Total Cost
                  </span>
                  <span className="font-mono text-[11px]">{costPercentage}% of budget</span>
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {formatInr(totalCost)}
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      totalCost > costCeiling ? "bg-rose-500" : "bg-emerald-400"
                    }`}
                    style={{ width: `${costPercentage}%` }}
                  />
                </div>
              </div>

              {/* Carbon card */}
              <div className="p-3 rounded-xl bg-card/60 border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-muted">
                  <span className="flex items-center gap-1 font-medium">
                    <Leaf className="w-3.5 h-3.5 text-accent" /> Total Carbon
                  </span>
                  <span className="font-mono text-[11px]">{carbonPercentage}% of cap</span>
                </div>
                <div className="text-base font-bold text-white font-mono">
                  {formatKgCo2e(totalCarbon)}
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      totalCarbon > carbonBudget ? "bg-rose-500" : "bg-accent"
                    }`}
                    style={{ width: `${carbonPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Average Semiconductor Risk Banner */}
            <div className="p-2.5 rounded-xl bg-card/40 border border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span className="text-muted">Avg Supply Chain Risk:</span>
                <span className="font-bold text-white font-mono">{avgRiskScore}/100</span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium ${
                  avgRiskScore <= 30
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : avgRiskScore <= 60
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                }`}
              >
                {riskLevelLabel}
              </span>
            </div>
          </div>
        )}

        {/* Itemized Materials Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {materials.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-muted">
                <ShoppingCart className="w-12 h-12 stroke-[1.2]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Your Cart is Empty</h3>
                <p className="text-xs text-muted max-w-xs mt-1">
                  Add construction materials from the catalog or load a sample starter bill of materials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  for (const row of DEFAULT_STARTER_MATERIALS) {
                    const entry = getMaterialById(row.materialId);
                    if (entry) {
                      addMaterial(buildProjectMaterial(entry, row.defaultQty));
                    }
                  }
                  notifySuccess("Sample materials added", "Added starter batch to your cart.");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-black font-semibold text-xs transition hover:opacity-90 shadow-lg shadow-accent/20"
              >
                <Sparkles className="w-4 h-4" /> Load Sample Materials
              </button>
            </div>
          ) : (
            materials.map((m) => {
              const lineCost = m.totalCost || m.quantity * m.unitPrice;
              const lineCarbon = m.totalCarbon || m.quantity * m.embodiedCarbon;

              return (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-card/80 border border-white/10 hover:border-accent/30 transition-all space-y-2.5"
                >
                  {/* Top line: Name & Availability Badge */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-sm text-white flex items-center gap-2">
                        <span>{m.materialName}</span>
                      </div>
                      <p className="text-xs text-muted">
                        {m.supplierName} &bull; ₹{m.unitPrice} / {m.unit}
                      </p>
                    </div>

                    <AvailabilityBadge
                      materialName={m.materialName}
                      availability={m.availability}
                      showRiskScore
                      size="sm"
                    />
                  </div>

                  {/* Metrics & Quantity Control */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] text-muted block">Cost</span>
                        <span className="font-bold text-white font-mono">{formatInr(lineCost)}</span>
                      </div>
                      <div className="border-l border-white/10 pl-3">
                        <span className="text-[10px] text-muted block">Carbon</span>
                        <span className="font-bold text-emerald-400 font-mono">{formatKgCo2e(lineCarbon)}</span>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center rounded-lg border border-border bg-input-bg p-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            const newQty = Math.max(1, m.quantity - (m.quantity >= 100 ? 50 : 1));
                            updateMaterialQuantity(m.id, newQty);
                          }}
                          className="p-1 rounded text-muted hover:text-white hover:bg-white/10 transition"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          min={1}
                          step="any"
                          value={m.quantity}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val > 0) updateMaterialQuantity(m.id, val);
                          }}
                          className="w-16 bg-transparent text-center text-xs font-mono font-bold text-white focus:outline-none"
                        />
                        <span className="text-[10px] text-muted pr-1.5">{m.unit}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newQty = m.quantity + (m.quantity >= 100 ? 50 : 1);
                            updateMaterialQuantity(m.id, newQty);
                          }}
                          className="p-1 rounded text-muted hover:text-white hover:bg-white/10 transition"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          removeMaterial(m.id);
                          notifyInfo("Removed line", `${m.materialName} removed from cart.`);
                        }}
                        className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Action Footer */}
        {materials.length > 0 && (
          <div className="p-4 bg-black/40 border-t border-white/10 space-y-2.5">
            {project && (
              <Link
                href={`/project/${project.id}/report`}
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-black font-bold text-sm transition hover:opacity-90 shadow-lg shadow-accent/20"
              >
                <FileSpreadsheet className="w-4 h-4 text-black" />
                <span>Generate Carbon Report</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              href="/nfc/client/LOT-SAMPLE"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              <QrCode className="w-3.5 h-3.5 text-accent" />
              <span>Inspect NFC Material Passport</span>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
