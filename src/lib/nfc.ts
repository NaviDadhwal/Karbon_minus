export interface NfcLotItem {
  id: string;
  materialName: string;
  category: "cement" | "steel" | "glass" | "insulation" | "timber" | "aggregates";
  manufacturer: string;
  quantity: number;
  unit: string;
  embodiedCarbon: number; // per unit (kg CO2e)
  conventionalCarbon: number; // per unit (kg CO2e)
  totalEmbodiedCarbon: number; // item total
  totalConventionalCarbon: number; // item baseline total
  carbonSaved: number; // item total saved
  unitPrice: number; // per unit (INR)
  conventionalUnitPrice: number; // per unit (INR)
  totalCost: number;
  totalConventionalCost: number;
  costDifference: number;
  hasEPD: boolean;
  epdNumber: string;
}

export interface NfcLotData {
  tagId: string;
  lotNumber: string;
  consignmentTitle: string;
  targetProject: string;
  clientName: string;
  dispatchDate: string;
  dispatchPlant: string;
  verificationHash: string;
  greenGrade: "A+" | "A" | "B" | "C";
  items: NfcLotItem[];
  // Consolidated Totals
  totalEmbodiedCarbon: number; // kg CO2e
  totalConventionalCarbon: number; // kg CO2e
  totalCarbonSaved: number; // kg CO2e
  carbonReductionPercent: number; // %
  totalCost: number; // INR
  totalConventionalCost: number; // INR
  netCostDifference: number; // INR (+/-)
  carKmEquivalent: number;
  treesPlantedEquivalent: number;
}

export const DEMO_LOTS: Record<string, NfcLotData> = {
  "LOT-SAMPLE": {
    tagId: "LOT-SAMPLE",
    lotNumber: "LOT-KM-2026-0881",
    consignmentTitle: "Whole Procurement Lot #1 (Cement + High-Perf Glass)",
    targetProject: "Eco-Horizon Tech Park (Phase 1)",
    clientName: "GreenBuild Infrastructure Pvt. Ltd.",
    dispatchDate: "2026-08-22",
    dispatchPlant: "North India Regional Green Supply Hub",
    verificationHash: "0x7e4b9c1d2a3f500da4b8e1f2c6d7e8f9024c9d81",
    greenGrade: "A+",
    items: [
      {
        id: "item-cement-1",
        materialName: "UltraTech Super Pozzolana Green Cement",
        category: "cement",
        manufacturer: "UltraTech Cement Ltd.",
        quantity: 2,
        unit: "tons",
        embodiedCarbon: 180,
        conventionalCarbon: 250,
        totalEmbodiedCarbon: 360, // 2 * 180
        totalConventionalCarbon: 500, // 2 * 250
        carbonSaved: 140, // 500 - 360
        unitPrice: 7200,
        conventionalUnitPrice: 6900,
        totalCost: 14400,
        totalConventionalCost: 13800,
        costDifference: 600, // +600
        hasEPD: true,
        epdNumber: "EPD-IN-2026-CEM-0419",
      },
      {
        id: "item-glass-1",
        materialName: "Saint-Gobain Cool-Lite SKN High Performance Glass",
        category: "glass",
        manufacturer: "Saint-Gobain Glass India",
        quantity: 1,
        unit: "ton",
        embodiedCarbon: 620,
        conventionalCarbon: 990,
        totalEmbodiedCarbon: 620,
        totalConventionalCarbon: 990,
        carbonSaved: 370, // 990 - 620
        unitPrice: 92500,
        conventionalUnitPrice: 85000,
        totalCost: 92500,
        totalConventionalCost: 85000,
        costDifference: 7500, // +7500
        hasEPD: true,
        epdNumber: "EPD-IN-2026-GLS-1104",
      },
    ],
    totalEmbodiedCarbon: 980, // 360 + 620
    totalConventionalCarbon: 1490, // 500 + 990
    totalCarbonSaved: 510, // 1490 - 980
    carbonReductionPercent: 34.2, // (510 / 1490) * 100
    totalCost: 106900, // 14400 + 92500
    totalConventionalCost: 98800, // 13800 + 85000
    netCostDifference: 8100, // +8100
    carKmEquivalent: 2125,
    treesPlantedEquivalent: 25,
  },
  "GC1024": {
    tagId: "GC1024",
    lotNumber: "BATCH-GC-2026-1024",
    consignmentTitle: "UltraTech Green Cement Shipment",
    targetProject: "Eco-Hub Commercial Tower",
    clientName: "Apex Realty Developers",
    dispatchDate: "2026-08-20",
    dispatchPlant: "Kotputli Works, Rajasthan",
    verificationHash: "0x8f2d9a3b4e7c1024c9d81e6a5f3b7c2d",
    greenGrade: "A+",
    items: [
      {
        id: "item-cement-solo",
        materialName: "UltraTech Super-Pozzolana Green Cement",
        category: "cement",
        manufacturer: "UltraTech Cement Ltd.",
        quantity: 50,
        unit: "tons",
        embodiedCarbon: 180,
        conventionalCarbon: 250,
        totalEmbodiedCarbon: 9000,
        totalConventionalCarbon: 12500,
        carbonSaved: 3500,
        unitPrice: 7200,
        conventionalUnitPrice: 6900,
        totalCost: 360000,
        totalConventionalCost: 345000,
        costDifference: 15000,
        hasEPD: true,
        epdNumber: "EPD-IN-2026-CEM-0419",
      },
    ],
    totalEmbodiedCarbon: 9000,
    totalConventionalCarbon: 12500,
    totalCarbonSaved: 3500,
    carbonReductionPercent: 28,
    totalCost: 360000,
    totalConventionalCost: 345000,
    netCostDifference: 15000,
    carKmEquivalent: 14580,
    treesPlantedEquivalent: 168,
  },
};

export function getLotOrBatch(id: string): NfcLotData {
  const upper = id ? id.toUpperCase() : "LOT-SAMPLE";
  if (DEMO_LOTS[upper]) {
    return DEMO_LOTS[upper];
  }

  // Check aliases
  if (
    upper === "LOT" ||
    upper === "WHOLE-LOT" ||
    upper === "SAMPLE" ||
    upper === "LOT1" ||
    upper === "LOT-2026"
  ) {
    return DEMO_LOTS["LOT-SAMPLE"];
  }

  return DEMO_LOTS["LOT-SAMPLE"];
}
