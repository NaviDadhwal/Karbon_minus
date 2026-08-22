"use client";

import {
  ProductAvailability,
  getAvailabilityForMaterial,
  getAvailabilityBadgeProps,
} from "@/lib/availability";

interface AvailabilityBadgeProps {
  materialName?: string;
  availability?: ProductAvailability;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export function AvailabilityBadge({
  materialName,
  availability,
  size = "sm",
  showTooltip = true,
  className = "",
}: AvailabilityBadgeProps) {
  const data = materialName ? getAvailabilityForMaterial(materialName) : null;
  const effAvailability: ProductAvailability =
    availability ?? data?.availability ?? "Medium";
  const badge = getAvailabilityBadgeProps(effAvailability);

  const sizeClasses =
    size === "lg"
      ? "text-xs px-3 py-1 gap-1.5"
      : size === "md"
      ? "text-[11px] px-2.5 py-0.5 gap-1.5"
      : "text-[10px] px-2 py-0.5 gap-1";

  const tooltipText = data
    ? `Manufacturing dependency: ${data.manufacturingDependency.slice(0, 3).join(", ")}`
    : "Supply chain & industrial automation availability index";

  return (
    <span
      title={showTooltip ? tooltipText : undefined}
      className={`inline-flex items-center rounded-full font-medium border font-mono tracking-tight transition-all duration-200 ${badge.bgClass} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor} shrink-0 animate-pulse`} />
      <span>{badge.label}</span>
    </span>
  );
}
