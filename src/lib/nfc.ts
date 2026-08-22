export interface NfcBatchData {
  tagId: string;
  batchNumber: string;
  materialName: string;
  category: "cement" | "steel" | "glass" | "insulation" | "timber" | "aggregates";
  manufacturer: string;
  plantLocation: string;
  dispatchDate: string;
  targetProject: string;
  hasEPD: boolean;
  epdNumber: string;
  verificationHash: string;
  quantity: number;
  unit: string;
  // Carbon metrics
  embodiedCarbon: number; // kg CO2e per unit
  conventionalCarbon: number; // kg CO2e per unit
  carbonSavedPerUnit: number; // kg CO2e per unit
  totalCarbonSaved: number; // kg CO2e for batch
  carbonReductionPercent: number;
  greenGrade: "A+" | "A" | "B" | "C";
  // Cost metrics
  unitPrice: number; // INR
  conventionalUnitPrice: number; // INR
  priceDifference: number; // INR
  totalBatchCost: number; // INR
  // Equivalent metrics
  carKmEquivalent: number;
  treesPlantedEquivalent: number;
}

export const DEMO_NFC_BATCHES: Record<string, NfcBatchData> = {
  GC1024: {
    tagId: "GC1024",
    batchNumber: "BATCH-GC-2026-1024",
    materialName: "UltraTech Super-Pozzolana Green Cement",
    category: "cement",
    manufacturer: "UltraTech Cement Ltd.",
    plantLocation: "Kotputli Works, Rajasthan, India",
    dispatchDate: "2026-08-20",
    targetProject: "Eco-Hub Commercial Tower (Phase 2)",
    hasEPD: true,
    epdNumber: "EPD-IN-2026-CEM-0419",
    verificationHash: "0x8f2d9a3b4e7c1024c9d81e6a5f3b7c2d",
    quantity: 50,
    unit: "tons",
    embodiedCarbon: 180,
    conventionalCarbon: 250,
    carbonSavedPerUnit: 70,
    totalCarbonSaved: 3500, // 50 * 70
    carbonReductionPercent: 28,
    greenGrade: "A+",
    unitPrice: 7200,
    conventionalUnitPrice: 6900,
    priceDifference: 300,
    totalBatchCost: 360000,
    carKmEquivalent: 14580,
    treesPlantedEquivalent: 168,
  },
  ST500D: {
    tagId: "ST500D",
    batchNumber: "BATCH-ST-2026-500D",
    materialName: "Tata Tiscon 500D Low-Emission Rebar",
    category: "steel",
    manufacturer: "Tata Steel Ltd.",
    plantLocation: "Jamshedpur Works, Jharkhand, India",
    dispatchDate: "2026-08-21",
    targetProject: "Skyline Green Residences - Block B",
    hasEPD: true,
    epdNumber: "EPD-IN-2026-STL-0912",
    verificationHash: "0x3a9b1c7e5d2f500da4b8e1f2c6d7e8f9",
    quantity: 25,
    unit: "tons",
    embodiedCarbon: 1910,
    conventionalCarbon: 2650,
    carbonSavedPerUnit: 740,
    totalCarbonSaved: 18500, // 25 * 740
    carbonReductionPercent: 28,
    greenGrade: "A+",
    unitPrice: 68000,
    conventionalUnitPrice: 65500,
    priceDifference: 2500,
    totalBatchCost: 1700000,
    carKmEquivalent: 77080,
    treesPlantedEquivalent: 888,
  },
  "GL-ECO": {
    tagId: "GL-ECO",
    batchNumber: "BATCH-GL-2026-ECO77",
    materialName: "Saint-Gobain Cool-Lite SKN High-Performance Glass",
    category: "glass",
    manufacturer: "Saint-Gobain Glass India",
    plantLocation: "Sriperumbudur Complex, Tamil Nadu, India",
    dispatchDate: "2026-08-22",
    targetProject: "Bengaluru Innovation Campus",
    hasEPD: true,
    epdNumber: "EPD-IN-2026-GLS-1104",
    verificationHash: "0x1e7a4b9c2d3fec077a8b1c2d3e4f5a6b",
    quantity: 200,
    unit: "m²",
    embodiedCarbon: 12.4,
    conventionalCarbon: 19.8,
    carbonSavedPerUnit: 7.4,
    totalCarbonSaved: 1480,
    carbonReductionPercent: 37,
    greenGrade: "A+",
    unitPrice: 1850,
    conventionalUnitPrice: 1700,
    priceDifference: 150,
    totalBatchCost: 370000,
    carKmEquivalent: 6160,
    treesPlantedEquivalent: 71,
  },
};

export function getBatchOrMaterial(id: string): NfcBatchData | null {
  const upper = id.toUpperCase();
  if (DEMO_NFC_BATCHES[upper]) {
    return DEMO_NFC_BATCHES[upper];
  }

  // Allow fallback synthetic generation for any arbitrary tag ID
  return {
    tagId: upper,
    batchNumber: `BATCH-KM-${upper}`,
    materialName: `${upper} Verified Low-Carbon Material`,
    category: "cement",
    manufacturer: "Karbon-Minus Certified Partner",
    plantLocation: "National Green Hub, India",
    dispatchDate: new Date().toISOString().slice(0, 10),
    targetProject: "Active Client Procurement",
    hasEPD: true,
    epdNumber: `EPD-KM-2026-${upper}`,
    verificationHash: `0x${Array.from(upper).map(c => c.charCodeAt(0).toString(16)).join("")}7b8a9c`,
    quantity: 10,
    unit: "units",
    embodiedCarbon: 165,
    conventionalCarbon: 240,
    carbonSavedPerUnit: 75,
    totalCarbonSaved: 750,
    carbonReductionPercent: 31,
    greenGrade: "A+",
    unitPrice: 4500,
    conventionalUnitPrice: 4200,
    priceDifference: 300,
    totalBatchCost: 45000,
    carKmEquivalent: 3125,
    treesPlantedEquivalent: 36,
  };
}
