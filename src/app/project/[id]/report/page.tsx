"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Nav } from "@/components/Nav";
import {
  BeforeAfterCarbonChart,
  BeforeAfterCostChart,
  BudgetUtilizationChart,
  CategoryCarbonPie,
} from "@/components/report/ReportCharts";
import { downloadProcurementPdf } from "@/components/report/ProcurementPDF";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useProject } from "@/context/ProjectContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { PaywallBanner } from "@/components/subscription/PaywallBanner";
import { notifyError, notifySuccess } from "@/lib/toast";
import { formatInr, formatKgCo2e, sumMaterialTotals } from "@/lib/utils";
import { Lock, Sparkles, Zap, ShieldCheck, Download, FileText } from "lucide-react";

function csvEscape(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const {
    project,
    materials,
    loadProject,
    optimizationResult,
    selectedCombination,
    updateProject,
  } = useProject();

  const { hasProjectAccess, openUpgradeModal, unlockProjectWithCredit, state: subState } = useSubscription();
  const isUnlocked = hasProjectAccess(id);

  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  /** Seeds baseline once per project when still 0/0 (manual projects). */
  const baselineSeededForProjectRef = useRef<string | null>(null);

  useEffect(() => {
    if (id && project?.id !== id) loadProject(id);
  }, [id, project?.id, loadProject]);

  useEffect(() => {
    if (!project || project.id !== id) return;
    if (project.baselineTotalCost !== 0 || project.baselineTotalCarbon !== 0) return;
    if (materials.length === 0) return;
    if (baselineSeededForProjectRef.current === project.id) return;
    baselineSeededForProjectRef.current = project.id;
    const { totalCost, totalCarbon } = sumMaterialTotals(materials);
    updateProject({
      baselineTotalCost: totalCost,
      baselineTotalCarbon: totalCarbon,
    });
  }, [project, id, materials, updateProject]);

  const totals = useMemo(() => {
    const { totalCost, totalCarbon } = sumMaterialTotals(materials);
    const byCat = new Map<string, { cost: number; carbon: number }>();
    for (const m of materials) {
      const cur = byCat.get(m.category) ?? { cost: 0, carbon: 0 };
      cur.cost += m.totalCost;
      cur.carbon += m.totalCarbon;
      byCat.set(m.category, cur);
    }
    const categoryBreakdown = Array.from(byCat.entries()).map(
      ([category, v]) => ({
        category,
        cost: v.cost,
        carbon: v.carbon,
        percentage: totalCarbon > 0 ? (100 * v.carbon) / totalCarbon : 0,
      }),
    );
    const assumedArea = project?.assumedBuildingArea ?? 10000;
    return {
      totalCost,
      totalCarbon,
      categoryBreakdown,
      costPerSqm: assumedArea > 0 ? totalCost / assumedArea : 0,
      carbonPerSqm: assumedArea > 0 ? totalCarbon / assumedArea : 0,
      assumedArea,
    };
  }, [materials, project?.assumedBuildingArea]);

  const baseline = project
    ? {
      cost: project.baselineTotalCost,
      carbon: project.baselineTotalCarbon,
    }
    : { cost: 0, carbon: 0 };

  const savings = useMemo(() => {
    const costSavings = baseline.cost - totals.totalCost;
    const carbonSavings = baseline.carbon - totals.totalCarbon;
    return {
      costSavings,
      carbonSavings,
      costPct:
        baseline.cost > 0 ? (100 * costSavings) / baseline.cost : 0,
      carbonPct:
        baseline.carbon > 0 ? (100 * carbonSavings) / baseline.carbon : 0,
    };
  }, [baseline.cost, baseline.carbon, totals.totalCost, totals.totalCarbon]);

  async function genSummary() {
    if (!project) return;
    if (!isUnlocked) {
      if (subState.creditsRemaining > 0 || subState.tier === "pro_monthly") {
        unlockProjectWithCredit(id, project.name);
      } else {
        openUpgradeModal("Unlock AI Executive Summary Generation");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: project.name,
          carbonBudget: project.carbonBudget,
          costCeiling: project.costCeiling,
          baselineCost: baseline.cost,
          baselineCarbon: baseline.carbon,
          currentCost: totals.totalCost,
          currentCarbon: totals.totalCarbon,
          costSavings: savings.costSavings,
          carbonSavings: savings.carbonSavings,
          materialCount: materials.length,
        }),
      });
      if (!res.ok) throw new Error("Summary generation failed");
      const data = await res.json();
      setSummary(data.executiveSummary ?? "");
      notifySuccess("Executive summary generated");
    } catch {
      notifyError("Could not generate summary", "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    if (!project) return;

    if (!isUnlocked) {
      // Allow downloading free pricing-only CSV with upgrade prompt
      const lines: string[] = [];
      lines.push("section,field,value");
      lines.push(
        `summary,current_total_cost_inr,${totals.totalCost}`,
        `summary,cost_ceiling_inr,${project.costCeiling}`,
        `summary,assumed_area_sqm,${totals.assumedArea}`,
        `summary,cost_per_sqm_inr,${totals.costPerSqm}`,
        `summary,tier,Free_Pricing_Tier`,
        `summary,embodied_carbon_status,Unlock_Paid_Tier_For_Carbon_Values`,
      );
      lines.push(
        "material_name,category,supplier,quantity,unit,unit_price_inr,total_cost_inr,embodied_carbon",
      );
      for (const m of materials) {
        lines.push(
          [
            csvEscape(m.materialName),
            csvEscape(m.category),
            csvEscape(m.supplierName),
            String(m.quantity),
            csvEscape(m.unit),
            String(m.unitPrice),
            String(m.totalCost),
            "LOCKED_UPGRADE_FOR_EPD_CARBON",
          ].join(","),
        );
      }
      const csv = lines.join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pricing-bom-${project.name.replace(/\s+/g, "-")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      notifySuccess("Free Pricing CSV Downloaded", "Unlock report to include carbon values & QR passports.");
      return;
    }

    const lines: string[] = [];
    lines.push("section,field,value");
    lines.push(
      `summary,baseline_cost_inr,${baseline.cost}`,
      `summary,baseline_carbon_kgco2e,${baseline.carbon}`,
      `summary,current_cost_inr,${totals.totalCost}`,
      `summary,current_carbon_kgco2e,${totals.totalCarbon}`,
      `summary,cost_savings_inr,${savings.costSavings}`,
      `summary,carbon_savings_kgco2e,${savings.carbonSavings}`,
      `summary,carbon_budget,${project.carbonBudget}`,
      `summary,cost_ceiling,${project.costCeiling}`,
    );
    lines.push(
      "material,material_name,category,supplier,quantity,unit,unit_price,embodied_carbon_per_unit,total_cost,total_carbon_kgco2e",
    );
    for (const m of materials) {
      lines.push(
        [
          "line",
          csvEscape(m.materialName),
          csvEscape(m.category),
          csvEscape(m.supplierName),
          String(m.quantity),
          csvEscape(m.unit),
          String(m.unitPrice),
          String(m.embodiedCarbon),
          String(m.totalCost),
          String(m.totalCarbon),
        ].join(","),
      );
    }
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `procurement-${project.name.replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notifySuccess("CSV downloaded");
  }

  async function downloadPdf() {
    if (!project) return;
    if (!isUnlocked) {
      if (subState.creditsRemaining > 0 || subState.tier === "pro_monthly") {
        unlockProjectWithCredit(id, project.name);
      } else {
        openUpgradeModal("Download Certified Carbon Procurement PDF");
        return;
      }
    }

    try {
      await downloadProcurementPdf({
        project,
        materials,
        executiveSummary: summary || "Summary not generated yet.",
        baselineCost: baseline.cost,
        baselineCarbon: baseline.carbon,
        currentCost: totals.totalCost,
        currentCarbon: totals.totalCarbon,
        costSavings: savings.costSavings,
        carbonSavings: savings.carbonSavings,
        totalCost: totals.totalCost,
        totalCarbon: totals.totalCarbon,
        categoryBreakdown: totals.categoryBreakdown,
        costPerSqm: totals.costPerSqm,
        carbonPerSqm: totals.carbonPerSqm,
        assumedArea: totals.assumedArea,
      });
      notifySuccess("PDF downloaded");
    } catch {
      notifyError("Could not download PDF");
    }
  }

  if (!project || project.id !== id) {
    return (
      <>
        <Nav projectId={id} />
        <main className="page-shell">Loading…</main>
      </>
    );
  }

  const hasBaseline =
    baseline.cost > 0 || baseline.carbon > 0 || materials.length > 0;
  const winCost = savings.costSavings > 0;
  const winCarb = savings.carbonSavings > 0;

  return (
    <>
      <Nav projectId={id} />
      <main className="page-shell pb-16">
        <Link
          href={`/project/${id}`}
          className="text-sm text-accent hover:underline"
        >
          ← Dashboard
        </Link>
        <p className="eyebrow mt-8">Insights</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Procurement report
            </h1>
            <p className="mt-2 max-w-2xl text-muted">
              {isUnlocked
                ? "Full Embodied Carbon analytics, before vs after comparisons, and compliance export."
                : "Free Bill of Materials pricing preview. Unlock full Embodied Carbon intelligence on a per-report basis."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/20 border border-accent/40 text-accent text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4" /> Full Carbon Report Unlocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" /> Free Pricing Tier Preview
              </span>
            )}
          </div>
        </div>

        {/* Free Tier: Show prominent Paywall Banner */}
        {!isUnlocked && (
          <div className="mt-6">
            <PaywallBanner
              title="Unlock Embodied Carbon Procurement Report & AI Export"
              description="You are currently viewing the free pricing and cost bill of materials. Unlock this project using 1 report credit to generate full embodied carbon analytics, before/after Pareto charts, AI executive summaries, and certified PDF/CSV compliance passports."
              feature="report"
            />
          </div>
        )}

        {/* Free Tier: Line Item Pricing & Cost Table */}
        <Card className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg font-medium text-foreground">
                Itemized Procurement Pricing & Bill of Materials
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Material quantities, unit prices, and line item costs (Free Tier).
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted block">Total Project Cost</span>
              <span className="text-xl font-bold text-foreground font-mono">
                {formatInr(totals.totalCost)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-foreground text-left">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                  <th className="py-2.5 px-3">Material</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Supplier</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total Cost</th>
                  <th className="py-2.5 px-3 text-center">Embodied Carbon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-medium">{m.materialName}</td>
                    <td className="py-3 px-3 text-xs text-subtle">{m.category}</td>
                    <td className="py-3 px-3 text-xs text-muted">{m.supplierName}</td>
                    <td className="py-3 px-3 text-right font-mono">
                      {m.quantity.toLocaleString()} {m.unit}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-xs">
                      ₹{m.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-400">
                      {formatInr(m.totalCost)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isUnlocked ? (
                        <span className="text-xs font-mono font-semibold text-accent">
                          {formatKgCo2e(m.totalCarbon)}
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-muted/60 bg-white/5 px-2 py-0.5 rounded">
                          🔒 Paid Tier
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between text-xs text-muted">
            <span>
              Assumed Building Area: <strong>{totals.assumedArea} m²</strong> &bull; Cost / m²:{" "}
              <strong>{formatInr(totals.costPerSqm)}</strong>
            </span>
            <span className="text-accent">
              {materials.length} {materials.length === 1 ? "Line Item" : "Line Items"} in shortlist
            </span>
          </div>
        </Card>

        {/* Win / Savings Progress Banner when unlocked or calculated */}
        {isUnlocked && (winCost || winCarb) && (
          <div className="glass-panel-strong mt-8 rounded-2xl border border-accent/35 bg-accent/10 px-5 py-4 text-foreground">
            <p className="text-lg font-semibold text-accent">
              Great progress on your procurement mix
            </p>
            <p className="mt-1 text-sm text-label">
              {winCost && (
                <>
                  You saved approximately{" "}
                  <strong>{formatInr(savings.costSavings)}</strong> on cost
                  {winCarb ? " and " : "."}
                </>
              )}
              {winCarb && (
                <>
                  <strong>{formatKgCo2e(savings.carbonSavings)}</strong> of
                  embodied carbon versus your baseline at project creation.
                </>
              )}
            </p>
          </div>
        )}

        {!winCost && !winCarb && hasBaseline && isUnlocked && (
          <div className="glass-panel mt-8 px-5 py-4 text-sm text-muted">
            Current totals are aligned with your creation baseline. Adjust
            materials or run optimization to unlock further savings.
          </div>
        )}

        {/* Embodied Carbon & Before vs After Section (Gated on Paid Tier) */}
        <div className="mt-8">
          {!isUnlocked ? (
            <div className="relative rounded-2xl border border-accent/20 bg-card/40 p-6 overflow-hidden">
              <div className="absolute inset-0 bg-background/70 backdrop-blur-[7px] z-10 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="p-3 rounded-2xl bg-accent/20 border border-accent/40 text-accent">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Embodied Carbon Analytics & Charts (Paid Feature)
                </h3>
                <p className="text-xs text-muted max-w-md">
                  Unlock before vs after carbon comparisons, category carbon distributions, and budget compliance tracking for this project.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    if (subState.creditsRemaining > 0 || subState.tier === "pro_monthly") {
                      unlockProjectWithCredit(id, project.name);
                    } else {
                      openUpgradeModal("Unlock Embodied Carbon Analytics");
                    }
                  }}
                  className="px-6 py-2.5 bg-accent text-black font-bold text-xs shadow-lg shadow-accent/20"
                >
                  <Zap className="w-3.5 h-3.5 fill-black mr-1" />
                  {subState.creditsRemaining > 0 ? "Unlock Report (1 Credit)" : "Buy Report Pass (₹999)"}
                </Button>
              </div>

              {/* Blurred background mockup */}
              <div className="opacity-30 filter blur-[4px] pointer-events-none select-none grid gap-6 lg:grid-cols-2" aria-hidden="true">
                <div className="h-64 rounded-xl bg-card border border-border" />
                <div className="h-64 rounded-xl bg-card border border-border" />
              </div>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="overflow-hidden border-accent/20">
                <h2 className="text-lg font-medium text-foreground">
                  Before vs after (creation baseline → now)
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted/40 p-4">
                    <p className="text-xs font-medium uppercase text-subtle">
                      Baseline
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {formatInr(baseline.cost)}
                    </p>
                    <p className="text-sm text-muted">
                      {formatKgCo2e(baseline.carbon)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-4 ring-1 ring-accent/30">
                    <p className="text-xs font-medium uppercase text-subtle">
                      Current
                    </p>
                    <p className="mt-1 text-lg font-semibold">
                      {formatInr(totals.totalCost)}
                    </p>
                    <p className="text-sm text-muted">
                      {formatKgCo2e(totals.totalCarbon)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted">
                  Per m² ({totals.assumedArea} m² assumed):{" "}
                  {formatInr(totals.costPerSqm)} · {totals.carbonPerSqm.toFixed(2)}{" "}
                  kgCO₂e/m²
                </p>
                <div className="mt-6 space-y-8">
                  <BeforeAfterCostChart
                    baselineCost={baseline.cost}
                    currentCost={totals.totalCost}
                  />
                  <BeforeAfterCarbonChart
                    baselineCarbon={baseline.carbon}
                    currentCarbon={totals.totalCarbon}
                  />
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-medium text-foreground">
                  Budget utilization
                </h2>
                <p className="mt-1 text-sm text-muted">
                  How much of your stated limits the current shortlist uses.
                </p>
                <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:justify-around">
                  <BudgetUtilizationChart
                    label="Carbon budget"
                    actual={totals.totalCarbon}
                    limit={project.carbonBudget}
                    formatActual={formatKgCo2e}
                    formatLimit={formatKgCo2e}
                  />
                  <BudgetUtilizationChart
                    label="Cost ceiling"
                    actual={totals.totalCost}
                    limit={project.costCeiling}
                    formatActual={formatInr}
                    formatLimit={formatInr}
                  />
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Carbon by Category Section */}
        {isUnlocked && (
          <Card className="mt-6">
            <h2 className="text-lg font-medium text-foreground">
              Carbon by category
            </h2>
            <div className="mt-4 grid gap-8 lg:grid-cols-2">
              <table className="w-full text-sm text-foreground">
                <thead>
                  <tr className="text-left text-subtle">
                    <th className="py-2">Category</th>
                    <th>Carbon</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {totals.categoryBreakdown.map((c) => (
                    <tr key={c.category} className="border-t border-divide">
                      <td className="py-2">{c.category}</td>
                      <td>{formatKgCo2e(c.carbon)}</td>
                      <td>{c.percentage.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <CategoryCarbonPie breakdown={totals.categoryBreakdown} />
            </div>
          </Card>
        )}

        {/* Optimization Shortlist Card */}
        {isUnlocked && optimizationResult && selectedCombination && (
          <Card className="mt-6 border-amber-500/20 bg-amber-500/5">
            <h2 className="text-lg font-medium text-foreground">
              Optimization shortlist (supplier mix)
            </h2>
            <p className="mt-1 text-sm text-muted">
              Compared to the default supplier index mix from the last run.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-subtle">Default mix (baseline)</p>
                <p className="font-medium">
                  {formatInr(optimizationResult.baseline.totalCost)} ·{" "}
                  {formatKgCo2e(optimizationResult.baseline.totalCarbon)}
                </p>
              </div>
              <div>
                <p className="text-xs text-subtle">Selected shortlist</p>
                <p className="font-medium">
                  {formatInr(selectedCombination.totalCost)} ·{" "}
                  {formatKgCo2e(selectedCombination.totalCarbon)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* AI Executive Summary & Official Exports Card */}
        <Card className="mt-6 border-accent/30">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-medium text-foreground">
                Executive Synthesis & Export
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Generate AI procurement brief and export certified PDF/CSV reports.
              </p>
            </div>
            {!isUnlocked && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent font-semibold border border-accent/30 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Paid Tier Feature
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              disabled={loading}
              onClick={() => void genSummary()}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Synthesizing…" : "Generate executive summary (AI)"}</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => void downloadPdf()}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-accent" />
              <span>{isUnlocked ? "Download Certified PDF" : "Download PDF (Paid)"}</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={downloadCsv}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{isUnlocked ? "Download Full CSV" : "Download Pricing CSV (Free)"}</span>
            </Button>
          </div>

          {summary && (
            <div className="mt-4 p-4 rounded-xl bg-card/90 border border-accent/30">
              <p className="text-xs uppercase font-bold text-accent tracking-wider mb-1">
                AI Executive Procurement Brief
              </p>
              <p className="whitespace-pre-wrap text-sm text-label leading-relaxed">
                {summary}
              </p>
            </div>
          )}
        </Card>
      </main>
    </>
  );
}
