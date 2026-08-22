export type ProductAvailability = "High" | "Medium" | "Low";

export interface MaterialAvailabilityData {
  name: string;
  category: "Glass" | "Insulation" | "Aggregates" | "Timber" | "Cement" | "Steel";
  availability: ProductAvailability;
  manufacturingDependency: string[];
  shortageImpact: "Low" | "Low–Medium" | "Medium" | "Medium–High" | "High";
  reason?: string;
}

export const MATERIAL_AVAILABILITY_MAP: Record<string, MaterialAvailabilityData> = {
  // 1. Acoustic Laminated Glass
  "acoustic laminated glass": {
    name: "Acoustic Laminated Glass",
    category: "Glass",
    availability: "Medium",
    manufacturingDependency: [
      "PLCs",
      "sensors",
      "automated cutting systems",
      "lamination controls",
    ],
    shortageImpact: "Medium",
    reason:
      "Manufacturing uses automated glass cutting and lamination equipment controlled by electronic systems.",
  },

  // 2. Acoustic Mineral Wool
  "acoustic mineral wool": {
    name: "Acoustic Mineral Wool",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: [
      "temperature sensors",
      "PLCs",
      "conveyors",
      "variable-frequency drives",
    ],
    shortageImpact: "Medium",
  },

  // 3. Ballast Stone
  "ballast stone": {
    name: "Ballast Stone",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crusher controls", "conveyor systems", "sensors"],
    shortageImpact: "Low–Medium",
  },

  // 4. Bamboo Composite Board
  "bamboo composite board": {
    name: "Bamboo Composite Board",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: [
      "pressing equipment",
      "temperature sensors",
      "cutting machinery",
      "PLC controls",
    ],
    shortageImpact: "Medium",
  },

  // 5. Cedar Cladding
  "cedar cladding": {
    name: "Cedar Cladding",
    category: "Timber",
    availability: "High",
    manufacturingDependency: ["sawmill equipment", "moisture meters", "CNC equipment"],
    shortageImpact: "Low",
  },

  // 6. Clear Float Glass 6mm
  "clear float glass 6mm": {
    name: "Clear Float Glass 6mm",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: [
      "furnace sensors",
      "temperature-control systems",
      "PLC/DCS",
      "machine vision",
      "automated glass-line equipment",
    ],
    shortageImpact: "High",
  },

  // 7. Cork Board Insulation
  "cork board insulation": {
    name: "Cork Board Insulation",
    category: "Insulation",
    availability: "High",
    manufacturingDependency: [
      "pressing equipment",
      "cutting systems",
      "process-control equipment",
    ],
    shortageImpact: "Low–Medium",
  },

  // 8. Crushed Stone 20mm
  "crushed stone 20mm": {
    name: "Crushed Stone 20mm",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crushers", "conveyors", "VFDs", "sensors"],
    shortageImpact: "Low–Medium",
  },

  // 9. DGU Low-E 6+12Ar+6
  "dgu low-e 6+12ar+6": {
    name: "DGU Low-E 6+12Ar+6",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: [
      "Low-E coating equipment",
      "automated cutting",
      "insulating-glass production lines",
      "gas filling systems",
      "sealing systems",
      "inspection systems",
      "PLCs and sensors",
    ],
    shortageImpact: "High",
  },
  "dgu low-e 6+12ar+6 (curtain wall)": {
    name: "DGU Low-E 6+12Ar+6 (curtain wall)",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: [
      "Low-E coating equipment",
      "automated cutting",
      "insulating-glass production lines",
      "gas filling systems",
      "sealing systems",
      "inspection systems",
      "PLCs and sensors",
    ],
    shortageImpact: "High",
  },

  // 10. Dolomite Chips
  "dolomite chips": {
    name: "Dolomite Chips",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crushers", "screening systems", "conveyors"],
    shortageImpact: "Low–Medium",
  },

  // 11. EPS Thermocol Board
  "eps thermocol board": {
    name: "EPS Thermocol Board",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: ["molding machines", "temperature controllers", "PLCs"],
    shortageImpact: "Medium",
  },

  // 12. Fire-Rated Glass
  "fire-rated glass": {
    name: "Fire-Rated Glass",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: [
      "specialized glass processing",
      "coating systems",
      "furnace controls",
      "inspection systems",
    ],
    shortageImpact: "High",
  },

  // 13. Fly Ash Aggregate
  "fly ash aggregate": {
    name: "Fly Ash Aggregate",
    category: "Aggregates",
    availability: "Medium",
    manufacturingDependency: ["mixing systems", "pelletization", "conveyors", "sensors"],
    shortageImpact: "Medium",
  },

  // 14. Fly Ash Blended Cement
  "fly ash blended cement": {
    name: "Fly Ash Blended Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: [
      "kiln PLC/DCS",
      "grinding systems",
      "sensors",
      "variable-frequency drives",
      "process analyzers",
    ],
    shortageImpact: "High",
  },

  // 15. Frosted Privacy Glass
  "frosted privacy glass": {
    name: "Frosted Privacy Glass",
    category: "Glass",
    availability: "Medium",
    manufacturingDependency: [
      "cutting equipment",
      "frosting/coating systems",
      "automated inspection",
    ],
    shortageImpact: "Medium–High",
  },

  // 16. FSC-certified Structural Plywood 19mm
  "fsc-certified structural plywood 19mm": {
    name: "FSC-certified Structural Plywood 19mm",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: [
      "veneer dryers",
      "pressing systems",
      "moisture sensors",
      "PLC controls",
    ],
    shortageImpact: "Medium",
  },

  // 17. Galvanized Steel Sheet
  "galvanized steel sheet": {
    name: "Galvanized Steel Sheet",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: [
      "PLCs",
      "VFDs",
      "temperature sensors",
      "automated coating lines",
      "process-control systems",
    ],
    shortageImpact: "High",
  },

  // 18. Glass Wool Roll
  "glass wool roll": {
    name: "Glass Wool Roll",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: [
      "furnace controls",
      "fiberization equipment",
      "sensors",
      "PLCs",
    ],
    shortageImpact: "Medium–High",
  },

  // 19. Granite Chips 10mm
  "granite chips 10mm": {
    name: "Granite Chips 10mm",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crushers", "screens", "conveyors"],
    shortageImpact: "Low–Medium",
  },

  // 20. Hardwood Flooring Oak
  "hardwood flooring oak": {
    name: "Hardwood Flooring Oak",
    category: "Timber",
    availability: "High",
    manufacturingDependency: ["drying systems", "moisture sensors", "CNC machinery"],
    shortageImpact: "Low–Medium",
  },

  // 21. Laminated Glass
  "laminated glass": {
    name: "Laminated Glass",
    category: "Glass",
    availability: "Medium",
    manufacturingDependency: [
      "cutting systems",
      "lamination equipment",
      "autoclaves",
      "sensors",
      "PLC controls",
    ],
    shortageImpact: "Medium–High",
  },

  // 22. Laterite Gravel
  "laterite gravel": {
    name: "Laterite Gravel",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["excavation equipment", "crushing", "screening"],
    shortageImpact: "Low",
  },

  // 23. Low-Alkali Cement
  "low-alkali cement": {
    name: "Low-Alkali Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: [
      "kiln controls",
      "grinding systems",
      "process sensors",
      "quality analyzers",
      "PLC/DCS",
    ],
    shortageImpact: "High",
  },

  // 24. Low-E Double Glazed Unit
  "low-e double glazed unit": {
    name: "Low-E Double Glazed Unit",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: [
      "coating",
      "cutting",
      "spacer systems",
      "gas filling",
      "sealing",
      "automated inspection",
    ],
    shortageImpact: "High",
  },

  // 25. M-Sand Manufactured
  "m-sand manufactured": {
    name: "M-Sand Manufactured",
    category: "Aggregates",
    availability: "Medium",
    manufacturingDependency: [
      "crushers",
      "VSI systems",
      "screening",
      "conveyors",
      "sensors",
    ],
    shortageImpact: "Medium",
  },

  // 26. Manufactured Sand (M-Sand) Zone II
  "manufactured sand (m-sand) zone ii": {
    name: "Manufactured Sand (M-Sand) Zone II",
    category: "Aggregates",
    availability: "Medium",
    manufacturingDependency: ["crushing", "screening", "grading systems", "sensors"],
    shortageImpact: "Medium",
  },

  // 27. Marine Plywood
  "marine plywood": {
    name: "Marine Plywood",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: [
      "veneer processing",
      "drying",
      "pressing",
      "quality-control systems",
    ],
    shortageImpact: "Medium",
  },

  // 28. Masonry Cement
  "masonry cement": {
    name: "Masonry Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: [
      "grinding",
      "blending",
      "packing automation",
      "PLC/DCS",
      "sensors",
    ],
    shortageImpact: "High",
  },

  // 29. MDF Board 18mm
  "mdf board 18mm": {
    name: "MDF Board 18mm",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: [
      "fiber processing",
      "resin dosing",
      "hot pressing",
      "temperature sensors",
      "PLC controls",
    ],
    shortageImpact: "Medium–High",
  },

  // 30. Oil Well Cement
  "oil well cement": {
    name: "Oil Well Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: [
      "grinding",
      "blending",
      "quality-control analyzers",
      "automated process control",
    ],
    shortageImpact: "High",
  },

  // 31. OPC 53 Grade Cement
  "opc 53 grade cement": {
    name: "OPC 53 Grade Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: [
      "kiln",
      "raw mill",
      "cement mill",
      "weighing systems",
      "PLC/DCS",
      "sensors",
      "packing automation",
    ],
    shortageImpact: "High",
  },

  // 32. Particle Board E1
  "particle board e1": {
    name: "Particle Board E1",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: [
      "chip preparation",
      "resin dosing",
      "hot pressing",
      "sensors",
      "automated controls",
    ],
    shortageImpact: "Medium–High",
  },

  // 33. Pine Plywood BWR
  "pine plywood bwr": {
    name: "Pine Plywood BWR",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: [
      "drying",
      "resin application",
      "pressing",
      "process controls",
    ],
    shortageImpact: "Medium",
  },

  // 34. PIR Foam Board
  "pir foam board": {
    name: "PIR Foam Board",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: [
      "chemical mixing",
      "foaming systems",
      "temperature control",
      "pressure control",
      "PLCs",
    ],
    shortageImpact: "Medium–High",
  },

  // 35. PPC Cement
  "ppc cement": {
    name: "PPC Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: [
      "grinding",
      "blending",
      "process sensors",
      "packing automation",
      "PLC/DCS",
    ],
    shortageImpact: "High",
  },

  // 36. PSC 53 Portland Slag Cement
  "psc 53 portland slag cement": {
    name: "PSC 53 Portland Slag Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: [
      "grinding",
      "blending",
      "process control",
      "sensors",
      "PLC/DCS",
    ],
    shortageImpact: "High",
  },
  "psc 53 (portland slag cement)": {
    name: "PSC 53 (Portland Slag Cement)",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: [
      "grinding",
      "blending",
      "process control",
      "sensors",
      "PLC/DCS",
    ],
    shortageImpact: "High",
  },

  // 37. PSC Slag Cement
  "psc slag cement": {
    name: "PSC Slag Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: [
      "grinding",
      "blending",
      "quality control",
      "automated process control",
    ],
    shortageImpact: "High",
  },

  // 38. Quarry Dust
  "quarry dust": {
    name: "Quarry Dust",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crushers", "conveyors", "screening"],
    shortageImpact: "Low",
  },

  // 39. Rapid Hardening Cement
  "rapid hardening cement": {
    name: "Rapid Hardening Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: [
      "kiln",
      "grinding",
      "blending",
      "quality-control systems",
      "PLC/DCS",
    ],
    shortageImpact: "High",
  },

  // 40. Recycled Concrete Aggregate
  "recycled concrete aggregate": {
    name: "Recycled Concrete Aggregate",
    category: "Aggregates",
    availability: "Medium",
    manufacturingDependency: [
      "crushers",
      "magnetic separators",
      "screens",
      "conveyors",
      "sensors",
    ],
    shortageImpact: "Medium",
  },

  // Additional steel / insulation defaults
  "tmt fe500d rebar": {
    name: "TMT Fe500D Rebar",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["PLC-controlled rolling mills", "temperature sensors", "VFD drives"],
    shortageImpact: "High",
  },
  "tmt fe550d rebar": {
    name: "TMT Fe550D Rebar",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["PLC-controlled rolling mills", "temperature sensors", "VFD drives"],
    shortageImpact: "High",
  },
  "structural steel section ismb": {
    name: "Structural Steel Section ISMB",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["automated rolling lines", "PLC systems", "laser measurement sensors"],
    shortageImpact: "High",
  },
  "rockwool batt insulation": {
    name: "Rockwool Batt Insulation",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: ["furnace controls", "fiber spinning VFDs", "temperature sensors"],
    shortageImpact: "Medium",
  },
  "river sand fine": {
    name: "River Sand Fine",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["mechanical dredging", "screening"],
    shortageImpact: "Low",
  },
  "teak wood planks": {
    name: "Teak Wood Planks",
    category: "Timber",
    availability: "High",
    manufacturingDependency: ["sawmill equipment", "kiln drying"],
    shortageImpact: "Low",
  },
};

export function getAvailabilityForMaterial(nameOrId: string): MaterialAvailabilityData {
  const norm = (nameOrId || "").toLowerCase().trim();

  if (MATERIAL_AVAILABILITY_MAP[norm]) {
    return MATERIAL_AVAILABILITY_MAP[norm];
  }

  // Substring fuzzy matching
  for (const [key, data] of Object.entries(MATERIAL_AVAILABILITY_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return data;
    }
  }

  // Category based defaults
  if (norm.includes("cement") || norm.includes("steel")) {
    return {
      name: nameOrId,
      category: norm.includes("cement") ? "Cement" : "Steel",
      availability: "Low",
      manufacturingDependency: ["continuous process PLCs", "kiln/mill sensors", "VFD drives"],
      shortageImpact: "High",
    };
  }

  if (norm.includes("glass") || norm.includes("insulation")) {
    return {
      name: nameOrId,
      category: norm.includes("glass") ? "Glass" : "Insulation",
      availability: "Medium",
      manufacturingDependency: ["automated processing lines", "temperature sensors", "PLCs"],
      shortageImpact: "Medium",
    };
  }

  return {
    name: nameOrId,
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crushing and screening equipment", "conveyors"],
    shortageImpact: "Low",
  };
}

export function getAvailabilityBadgeProps(availability: ProductAvailability) {
  switch (availability) {
    case "High":
      return {
        label: "High Availability",
        icon: "🟢",
        bgClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        dotColor: "bg-emerald-400",
        score: 1.0,
      };
    case "Medium":
      return {
        label: "Medium Availability",
        icon: "🟡",
        bgClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        dotColor: "bg-amber-400",
        score: 0.65,
      };
    case "Low":
      return {
        label: "Low Availability",
        icon: "🔴",
        bgClass: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        dotColor: "bg-rose-400",
        score: 0.3,
      };
  }
}

export function getSemiconductorRisk(nameOrId: string) {
  const data = getAvailabilityForMaterial(nameOrId);
  let score = 50;
  let level = "Medium Risk";
  let bgClass = "bg-amber-500/15 text-amber-400 border-amber-500/30";
  let dotColor = "bg-amber-400";

  switch (data.shortageImpact) {
    case "High":
      score = 85;
      level = "High Shortage Risk";
      bgClass = "bg-rose-500/15 text-rose-400 border-rose-500/30";
      dotColor = "bg-rose-400";
      break;
    case "Medium–High":
      score = 65;
      level = "Med-High Risk";
      bgClass = "bg-amber-500/15 text-amber-400 border-amber-500/30";
      dotColor = "bg-amber-400";
      break;
    case "Medium":
      score = 50;
      level = "Medium Risk";
      bgClass = "bg-amber-500/15 text-amber-400 border-amber-500/30";
      dotColor = "bg-amber-400";
      break;
    case "Low–Medium":
      score = 30;
      level = "Low Risk";
      bgClass = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      dotColor = "bg-emerald-400";
      break;
    case "Low":
      score = 15;
      level = "Low Risk";
      bgClass = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      dotColor = "bg-emerald-400";
      break;
  }

  return {
    ...data,
    riskScore: score,
    riskLevel: level,
    bgClass,
    dotColor,
  };
}
