"use client";

import {
  ProductAvailability,
  getAvailabilityForMaterial,
  getAvailabilityBadgeProps,
  getSemiconductorRisk,
} from "@/lib/availability";

interface AvailabilityBadgeProps {
  materialName?: string;
  availability?: ProductAvailability;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  showRiskScore?: boolean;
  className?: string;
}

export function AvailabilityBadge({
  materialName,
  availability,
  size = "sm",
  showTooltip = true,
  showRiskScore = true,
  className = "",
}: AvailabilityBadgeProps) {
  const data = materialName ? getAvailabilityForMaterial(materialName) : null;
  const effAvailability: ProductAvailability =
    availability ?? data?.availability ?? "Medium";
  const badge = getAvailabilityBadgeProps(effAvailability);
  const risk = materialName ? getSemiconductorRisk(materialName) : null;

  const sizeClasses =
    size === "lg"
      ? "text-xs px-3 py-1 gap-1.5"
      : size === "md"
      ? "text-[11px] px-2.5 py-1 gap-1.5"
      : "text-[10px] px-2 py-0.5 gap-1.5";

  const tooltipText = data
    ? `Manufacturing dependency: ${data.manufacturingDependency.slice(0, 3).join(", ")} | Semiconductor Shortage Impact: ${data.shortageImpact} (${risk?.riskScore}/100)`
    : "Supply chain & industrial automation availability index";

  return (
    <span
      title={showTooltip ? tooltipText : undefined}
      className={`inline-flex items-center rounded-full font-medium border font-mono tracking-tight transition-all duration-200 ${badge.bgClass} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor} shrink-0 animate-pulse`} />
      <span>{badge.label}</span>
      {showRiskScore && risk && (
        <span className="opacity-90 font-semibold border-l border-current/30 pl-1.5 ml-0.5 flex items-center gap-1">
          <span>⚡ Semi Risk:</span>
          <span className="font-bold">{risk.riskScore}/100</span>
        </span>
      )}
    </span>
  );
}

export function SemiconductorRiskBadge({
  materialName,
  size = "sm",
  showTooltip = true,
  className = "",
}: {
  materialName: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}) {
  const risk = getSemiconductorRisk(materialName);

  const sizeClasses =
    size === "lg"
      ? "text-xs px-3 py-1 gap-1.5"
      : size === "md"
      ? "text-[11px] px-2.5 py-1 gap-1.5"
      : "text-[10px] px-2 py-0.5 gap-1.5";

  const tooltipText = `Industrial automation dependency: ${risk.manufacturingDependency.slice(0, 3).join(", ")} (Shortage impact: ${risk.shortageImpact})`;

  return (
    <span
      title={showTooltip ? tooltipText : undefined}
      className={`inline-flex items-center rounded-full font-medium border font-mono tracking-tight transition-all duration-200 ${risk.bgClass} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${risk.dotColor} shrink-0`} />
      <span>⚡ Semiconductor Risk: <strong className="font-bold">{risk.riskScore}/100</strong> ({risk.riskLevel})</span>
    </span>
  );
}
