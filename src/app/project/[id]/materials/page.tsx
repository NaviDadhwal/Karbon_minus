"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Nav } from "@/components/Nav";
import { MaterialInput } from "@/components/materials/MaterialInput";
import { MaterialList } from "@/components/materials/MaterialList";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useProject } from "@/context/ProjectContext";
import { getMaterialById } from "@/lib/db";
import { DEFAULT_STARTER_MATERIALS } from "@/lib/default-starter-materials";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/toast";
import { formatInr, formatKgCo2e } from "@/lib/utils";
import { buildProjectMaterial } from "@/lib/materials";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { getSemiconductorRisk } from "@/lib/availability";
import { useSubscription } from "@/context/SubscriptionContext";
import { PaywallBanner } from "@/components/subscription/PaywallBanner";
import { Lock, Zap } from "lucide-react";
import type { AlternativeSuggestion, MaterialEntry } from "@/types";

export default function MaterialsPage() {
  const params = useParams();
  const id = params.id as string;
  const {
    project,
    materials,
    loadProject,
    addMaterial,
    removeMaterial,
    updateMaterialQuantity,
    replaceMaterialLine,
  } = useProject();

  const { hasProjectAccess, openUpgradeModal, unlockProjectWithCredit, state: subState } = useSubscription();
  const isUnlocked = hasProjectAccess(id);

  const [browse, setBrowse] = useState<MaterialEntry[]>([]);
  /** Quantity typed per catalog row (same unit as the material, e.g. kg). */
  const [browseQtyById, setBrowseQtyById] = useState<Record<string, string>>(
    {},
  );
  const [cat, setCat] = useState<string>("all");
  const [alternatives, setAlternatives] = useState<AlternativeSuggestion[]>([]);
  const [altLoading, setAltLoading] = useState(false);

  useEffect(() => {
    if (id && project?.id !== id) loadProject(id);
  }, [id, project?.id, loadProject]);

  useEffect(() => {
    const q = new URLSearchParams();
    if (cat !== "all") q.set("category", cat);
    void fetch(`/api/materials?${q.toString()}`)
      .then((r) => r.json())
      .then((d) => setBrowse(d.materials ?? []));
  }, [cat]);

  /** Only refetch when line items are added or removed, not on swap/qty edit. */
  const lineIdsKey = useMemo(
    () =>
      materials
        .map((m) => m.id)
        .sort()
        .join("|"),
    [materials],
  );

  useEffect(() => {
    if (materials.length === 0) {
      setAlternatives([]);
      return;
    }
    setAltLoading(true);
    let cancelled = false;
    void fetch("/api/ai/alternatives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materials }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setAlternatives(d.suggestions ?? []);
      })
      .finally(() => {
        if (!cancelled) setAltLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // Only refetch when line IDs or line count change — not on swap/qty (materials content omitted on purpose).
    // eslint-disable-next-line react-hooks/exhaustive-deps -- materials is read when lineIdsKey/length change
  }, [lineIdsKey, project?.id, materials.length]);

  const mergedAlternatives = useMemo(() => {
    return alternatives.map((a) => {
      const line = materials.find((m) => m.id === a.currentMaterial.id);
      return {
        ...a,
        currentMaterial: line ?? a.currentMaterial,
      };
    });
  }, [alternatives, materials]);

  const suggestionsByLineId = useMemo(() => {
    const map = new Map<string, typeof mergedAlternatives>();
    for (const a of mergedAlternatives) {
      const lid = a.currentMaterial.id;
      if (!map.has(lid)) map.set(lid, []);
      map.get(lid)!.push(a);
    }
    return map;
  }, [mergedAlternatives]);

  const totalPotentialCarbonSavings = useMemo(() => {
    return alternatives.reduce((acc, a) => acc + (a.carbonSavings > 0 ? a.carbonSavings : 0), 0);
  }, [alternatives]);

  if (!project || project.id !== id) {
    return (
      <>
        <Nav projectId={id} />
        <main className="page-shell">Loading…</main>
      </>
    );
  }

  return (
    <>
      <Nav projectId={id} />
      <main className="page-shell pb-16">
        <Link
          href={`/project/${id}`}
          className="text-sm text-accent hover:underline"
        >
          ← Back to project
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Materials & EPDs
        </h1>
        <p className="mt-1 text-sm text-muted">
          Add lines with supplier quotes, or browse the database. Quantities must
          be positive.
        </p>

        {materials.length === 0 && (
          <div className="mt-4 rounded-xl border border-accent/35 bg-accent/10 p-4 text-sm text-foreground">
            <p className="font-medium">Need sample data?</p>
            <p className="mt-1 text-muted">
              Add our 4 starter materials (structural glass, insulation,
              aggregates, and frosted glass) to test optimization and reports
              instantly.
            </p>
            <Button
              type="button"
              className="mt-3"
              onClick={() => {
                for (const row of DEFAULT_STARTER_MATERIALS) {
                  const entry = getMaterialById(row.materialId);
                  if (entry) {
                    addMaterial(
                      buildProjectMaterial(entry, row.defaultQty),
                    );
                  }
                }
                notifySuccess(
                  "Starter materials added",
                  "Added sample lines to your project.",
                );
              }}
            >
              Add sample materials
            </Button>
          </div>
        )}

        <Card className="mt-6">
          <h2 className="text-lg font-medium text-foreground">Add material (Free)</h2>
          <p className="mt-1 text-sm text-muted">
            Describe what you need in plain English (e.g. &ldquo;1000 kg TMT 500D
            rebar&rdquo;).
          </p>
          <MaterialInput
            onAdd={(pm) => {
              addMaterial(pm);
              notifySuccess("Material added", `${pm.materialName} added.`);
            }}
            existingMaterialIds={materials.map((m) => m.materialId)}
          />
        </Card>

        <Card className="mt-6">
          <h2 className="text-lg font-medium text-foreground">
            Browse database (Free)
          </h2>
          <div className="mt-2">
            <label className="text-sm text-muted">Category</label>
            <select
              className="ml-2 rounded-xl border border-border bg-input-bg px-3 py-2 text-sm text-foreground backdrop-blur-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
              <option value="all">All</option>
              <option value="steel">Steel</option>
              <option value="cement">Cement</option>
              <option value="insulation">Insulation</option>
              <option value="glass">Glass</option>
              <option value="aggregates">Aggregates</option>
              <option value="timber">Timber</option>
            </select>
          </div>
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm">
            {browse.slice(0, 40).map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-divide py-2 text-foreground"
              >
                <div className="min-w-0 flex-1 flex flex-wrap items-center gap-2">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-xs text-subtle">({m.category})</span>
                  <AvailabilityBadge materialName={m.name} showRiskScore size="sm" />
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <label className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted">
                      {m.unit === "kg" ? "Qty (kg)" : `Qty (${m.unit})`}
                    </span>
                    <Input
                      type="number"
                      min={0.001}
                      step="any"
                      inputMode="decimal"
                      className="w-28 py-1.5"
                      value={browseQtyById[m.id] ?? ""}
                      onChange={(e) =>
                        setBrowseQtyById((prev) => ({
                          ...prev,
                          [m.id]: e.target.value,
                        }))
                      }
                    />
                  </label>
                  <Button
                    variant="secondary"
                    type="button"
                    className="self-end"
                    onClick={() => {
                      const raw = browseQtyById[m.id]?.trim() ?? "";
                      const q = Number(raw);
                      if (!(q > 0)) {
                        notifyError(
                          "Enter a quantity",
                          `Add a positive amount in ${m.unit}.`,
                        );
                        return;
                      }
                      const pm = buildProjectMaterial(m, q);
                      addMaterial(pm);
                      setBrowseQtyById((prev) => {
                        const next = { ...prev };
                        delete next[m.id];
                        return next;
                      });
                      notifySuccess(
                        "Material added",
                        `${m.name} (${q} ${m.unit}) added from database.`,
                      );
                    }}
                  >
                    Add
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-foreground">
                Project line items & pricing
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Itemized pricing and quantities are free to view and edit.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
              Free Tier Included
            </span>
          </div>
          <div className="mt-4">
            <MaterialList
              materials={materials}
              onRemove={(lineId) => {
                removeMaterial(lineId);
                notifyInfo("Material removed");
              }}
              onQuantityChange={updateMaterialQuantity}
            />
          </div>
        </Card>

        {/* Lower Carbon Alternatives Section (Gated on Paid Tier) */}
        <Card className="mt-6 border-accent/30">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium text-foreground">
                  Lower-carbon alternatives
                </h2>
                {!isUnlocked && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[11px] font-bold border border-accent/30">
                    <Lock className="w-3 h-3" /> Paid Tier
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">
                Options per line item with real-time carbon reduction, price change, and semiconductor shortage resilience metrics.
              </p>
            </div>

            {isUnlocked && (
              <Button
                type="button"
                variant="secondary"
                disabled={altLoading || materials.length === 0}
                onClick={() => {
                  setAltLoading(true);
                  void fetch("/api/ai/alternatives", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ materials }),
                  })
                    .then((r) => r.json())
                    .then((d) => setAlternatives(d.suggestions ?? []))
                    .finally(() => setAltLoading(false));
                  notifyInfo(
                    "Refreshing suggestions",
                    "Recalculating alternatives.",
                  );
                }}
              >
                {altLoading ? "Refreshing…" : "Refresh suggestions"}
              </Button>
            )}
          </div>

          {/* Paywall Banner if locked in Free Tier */}
          {!isUnlocked && (
            <div className="mt-4 space-y-6">
              <PaywallBanner
                title="AI Lower-Carbon Alternatives & Semiconductor Risk (Paid Feature)"
                description="Manual material entry and unit rates are free. Unlock our proprietary AI optimization engine to discover lower-carbon material swaps, quantify exact kgCO₂e savings, and benchmark semiconductor supply chain resilience."
                feature="alternatives"
              />

              {/* Locked Teaser Preview */}
              {materials.length > 0 && (
                <div className="relative rounded-2xl border border-white/10 bg-black/40 p-5 overflow-hidden">
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[6px] z-10 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="p-3 rounded-2xl bg-accent/20 border border-accent/40 text-accent">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-foreground">
                        {alternatives.length > 0 ? `${alternatives.length} Lower-Carbon Swaps Found` : "Optimization Analysis Ready"}
                      </h4>
                      {totalPotentialCarbonSavings > 0 && (
                        <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                          Potential Carbon Reduction: ~{formatKgCo2e(totalPotentialCarbonSavings)}
                        </p>
                      )}
                      <p className="text-xs text-muted max-w-sm mt-1">
                        Unlock this project with 1 report credit to reveal supplier options, cost differences, and 1-click swaps.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => {
                        if (subState.creditsRemaining > 0 || subState.tier === "pro_monthly") {
                          unlockProjectWithCredit(id, project.name);
                        } else {
                          openUpgradeModal("Unlock Lower-Carbon Alternatives");
                        }
                      }}
                      className="px-6 py-2.5 bg-accent text-black font-bold text-xs shadow-lg shadow-accent/20"
                    >
                      <Zap className="w-3.5 h-3.5 fill-black mr-1" />
                      {subState.creditsRemaining > 0
                        ? "Unlock with 1 Credit"
                        : "Buy Report Pass (₹999)"}
                    </Button>
                  </div>

                  {/* Blurred mock preview cards */}
                  <div className="opacity-40 filter blur-[3px] select-none space-y-3 pointer-events-none" aria-hidden="true">
                    {materials.slice(0, 2).map((m, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border bg-card/80 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-foreground">→ Low-Carbon {m.materialName} Alternative</p>
                          <p className="text-xs text-emerald-400 mt-1">🌿 Δ carbon -24.5% &bull; 💰 Δ cost -8.2%</p>
                        </div>
                        <div className="px-3 py-1 rounded bg-accent/20 text-xs font-mono">
                          ⚡ Semi Risk: 28/100
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Interactive Alternatives when Unlocked */}
          {isUnlocked && (
            <>
              {altLoading && <p className="mt-2 text-sm text-subtle">Analyzing…</p>}
              {!altLoading && materials.length === 0 && (
                <p className="mt-2 text-sm text-muted">
                  Add materials to see swaps.
                </p>
              )}
              {!altLoading && materials.length > 0 && (
                <div className="mt-6 space-y-8">
                  {materials.map((line) => {
                    const row = suggestionsByLineId.get(line.id) ?? [];
                    const curRisk = getSemiconductorRisk(line.materialName).riskScore;

                    return (
                      <div
                        key={line.id}
                        className="border-b border-divide pb-6 last:border-0"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-card/60 border border-border">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{line.materialName}</span>
                            <span className="text-xs text-muted">
                              ({line.quantity.toLocaleString()} {line.unit})
                            </span>
                          </div>
                          <AvailabilityBadge
                            materialName={line.materialName}
                            showRiskScore
                            size="sm"
                          />
                        </div>
                        {row.length === 0 ? (
                          <p className="mt-3 text-sm text-muted">
                            No lower-carbon catalog swap found for this line. Try
                            Refresh suggestions after changing quantities.
                          </p>
                        ) : (
                          <ul className="mt-3 space-y-3">
                            {row.map((a) => {
                              const applied = line.materialId === a.alternative.id;
                              const altRisk = a.alternativeRiskScore ?? getSemiconductorRisk(a.alternative.name).riskScore;
                              const riskDelta = altRisk - curRisk;

                              return (
                                <li
                                  key={`${line.id}-${a.alternative.id}-${a.alternativeSupplier.id}`}
                                  className={`rounded-xl border p-4 text-sm text-foreground transition-all duration-200 ${
                                    applied
                                      ? "border-border/60 bg-muted/30 opacity-80"
                                      : "border-border bg-card/80 hover:border-accent/30"
                                  }`}
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-border/40">
                                    <div className="flex items-center gap-2 font-semibold text-foreground">
                                      <span className="text-accent text-base">→ {a.alternative.name}</span>
                                      <span className="text-xs font-normal text-muted">
                                        via {a.alternativeSupplier.name}
                                      </span>
                                    </div>
                                    <AvailabilityBadge
                                      materialName={a.alternative.name}
                                      showRiskScore
                                      size="sm"
                                    />
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 text-xs mb-2.5">
                                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                                      🌿 Δ carbon {formatKgCo2e(a.carbonSavings)} ({a.carbonSavingsPercent.toFixed(1)}%)
                                    </span>
                                    <span
                                      className={`px-2.5 py-1 rounded-md font-medium border ${
                                        a.costDifference <= 0
                                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                          : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                      }`}
                                    >
                                      💰 Δ cost {formatInr(a.costDifference)} ({a.costDifferencePercent.toFixed(1)}%)
                                    </span>
                                    <span
                                      className={`px-2.5 py-1 rounded-md font-mono font-medium border ${
                                        altRisk <= curRisk
                                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                          : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                      }`}
                                    >
                                      ⚡ Semi Risk: <strong className="text-foreground">{altRisk}/100</strong>
                                      {riskDelta < 0 ? (
                                        <span className="ml-1 text-emerald-400 font-bold">
                                          (Save {Math.abs(riskDelta)} pts vs {curRisk})
                                        </span>
                                      ) : riskDelta > 0 ? (
                                        <span className="ml-1 text-amber-400">
                                          (+{riskDelta} pts vs {curRisk})
                                        </span>
                                      ) : (
                                        <span className="ml-1 opacity-75">
                                          (= {curRisk})
                                        </span>
                                      )}
                                    </span>
                                  </div>

                                  <p className="text-xs text-muted leading-relaxed">{a.explanation}</p>
                                  {applied ? (
                                    <p className="mt-2 text-xs font-medium text-subtle">
                                      Already in project — this catalog option is
                                      your current line.
                                    </p>
                                  ) : null}
                                  <Button
                                    className="mt-3"
                                    type="button"
                                    disabled={applied}
                                    variant={applied ? "secondary" : "primary"}
                                    onClick={() => {
                                      const next = buildProjectMaterial(
                                        a.alternative,
                                        line.quantity,
                                        a.alternativeSupplier.id,
                                        line.id,
                                      );
                                      replaceMaterialLine(line.id, next);
                                      notifySuccess(
                                        "Material swapped",
                                        `${a.alternative.name} is now in the shortlist.`,
                                      );
                                    }}
                                  >
                                    {applied
                                      ? "Current selection"
                                      : "Swap in project"}
                                  </Button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </Card>

        <Card className="mt-8 border-accent/20 bg-card/70 backdrop-blur-xl">
          <div className="flex flex-col gap-6">
            {/* Heading */}
            <div>
              <p className="text-sm uppercase tracking-wider text-accent">
                Next Step
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                Continue Your Workflow
              </h2>

              <p className="mt-2 text-sm text-muted">
                You have selected materials. Now optimize cost vs carbon
                tradeoffs or generate a professional report.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-emerald-300">
                ✓ Materials Added
              </span>
            </div>

            {/* Buttons */}
            <div>
              <Link
                href={`/project/${id}/report`}
                className="group inline-flex items-center justify-between rounded-2xl bg-accent px-8 py-5 text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(23,207,151,0.35)]"
              >
                <div>
                  <div className="text-lg font-bold">
                    Generate Carbon Report →
                  </div>
                  <p className="mt-1 text-sm text-black/70">
                    Export embodied carbon breakdown, supplier bills, and compliance insights
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
