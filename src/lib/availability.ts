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
  // Glass
  "acoustic laminated glass": {
    name: "Acoustic Laminated Glass",
    category: "Glass",
    availability: "Medium",
    manufacturingDependency: ["PLCs", "sensors", "automated cutting systems", "lamination controls"],
    shortageImpact: "Medium",
    reason: "Manufacturing uses automated glass cutting and lamination equipment controlled by electronic systems.",
  },
  "clear float glass 6mm": {
    name: "Clear Float Glass 6mm",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: ["furnace sensors", "temperature-control systems", "PLC/DCS", "machine vision", "automated glass-line equipment"],
    shortageImpact: "High",
    reason: "Float glass lines rely heavily on continuous automated furnace controls and sensors.",
  },
  "dgu low-e 6+12ar+6": {
    name: "DGU Low-E 6+12Ar+6",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: ["Low-E coating equipment", "automated cutting", "insulating-glass production lines", "gas filling systems", "sealing systems", "inspection systems", "PLCs and sensors"],
    shortageImpact: "High",
  },
  "dgu low-e 6+12ar+6 (curtain wall)": {
    name: "DGU Low-E 6+12Ar+6 (curtain wall)",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: ["Low-E coating equipment", "automated cutting", "insulating-glass production lines", "gas filling systems", "sealing systems", "inspection systems", "PLCs and sensors"],
    shortageImpact: "High",
  },
  "fire-rated glass": {
    name: "Fire-Rated Glass",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: ["automated lamination lines", "gel curing controls", "temperature and chemical dosing sensors", "PLCs"],
    shortageImpact: "High",
  },
  "frosted privacy glass": {
    name: "Frosted Privacy Glass",
    category: "Glass",
    availability: "Medium",
    manufacturingDependency: ["sandblasting / chemical-etching machines", "PLC conveyors", "sensors"],
    shortageImpact: "Medium",
  },
  "laminated glass": {
    name: "Laminated Glass",
    category: "Glass",
    availability: "Medium",
    manufacturingDependency: ["autoclaves", "temperature sensors", "pressure sensors", "automated loading/cutting systems", "PLCs"],
    shortageImpact: "Medium",
  },
  "low-e double glazed unit": {
    name: "Low-E Double Glazed Unit",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: ["sputtering coating machines", "DGU assembly lines", "gas filling sensors", "PLC controls"],
    shortageImpact: "High",
  },
  "spandrel ceramic glass": {
    name: "Spandrel Ceramic Glass",
    category: "Glass",
    availability: "Medium",
    manufacturingDependency: ["roller-coater machinery", "curing ovens", "temperature sensors", "PLCs"],
    shortageImpact: "Medium",
  },
  "structural glazing panel": {
    name: "Structural Glazing Panel",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: ["CNC cutting & edge processing", "automated robotic structural silicone dispensing", "curing sensors", "PLC vision systems"],
    shortageImpact: "High",
    reason: "Advanced curtain wall glazing fabrication requires high-precision robotic sealant dispensers, automated CNC edging, and PLC vision systems.",
  },
  "tinted solar glass": {
    name: "Tinted Solar Glass",
    category: "Glass",
    availability: "Low",
    manufacturingDependency: ["automated furnace batching", "spectral sensors", "temperature controllers", "PLCs"],
    shortageImpact: "High",
  },
  "toughened safety glass": {
    name: "Toughened Safety Glass",
    category: "Glass",
    availability: "Medium",
    manufacturingDependency: ["tempering furnaces", "convection blowers", "optical sensors", "PLCs", "VFDs"],
    shortageImpact: "Medium",
  },

  // Insulation
  "acoustic mineral wool": {
    name: "Acoustic Mineral Wool",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: ["temperature sensors", "PLCs", "conveyors", "variable-frequency drives"],
    shortageImpact: "Medium",
  },
  "cork board insulation": {
    name: "Cork Board Insulation",
    category: "Insulation",
    availability: "High",
    manufacturingDependency: ["pressing equipment", "cutting systems", "process-control equipment"],
    shortageImpact: "Low–Medium",
  },
  "eps thermocol board": {
    name: "EPS Thermocol Board",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: ["steam expansion machinery", "block molding equipment", "hot-wire cutting systems", "PLC controls"],
    shortageImpact: "Medium",
  },
  "glass wool roll": {
    name: "Glass Wool Roll",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: ["spinning centrifuges", "curing ovens", "thermal sensors", "PLC controllers"],
    shortageImpact: "Medium",
  },
  "pir foam board": {
    name: "PIR Foam Board",
    category: "Insulation",
    availability: "Low",
    manufacturingDependency: ["chemical metering equipment", "continuous lamination lines", "temperature sensors", "automated cutting systems", "PLC automation"],
    shortageImpact: "High",
  },
  "recycled denim batt": {
    name: "Recycled Denim Batt",
    category: "Insulation",
    availability: "High",
    manufacturingDependency: ["textile shredding machines", "garnetting machines", "conveyors", "basic sensor controls"],
    shortageImpact: "Low",
  },
  "reflective foil insulation": {
    name: "Reflective Foil Insulation",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: ["lamination equipment", "foil-bonding machines", "temperature sensors", "drive controllers"],
    shortageImpact: "Medium",
  },
  "rockwool batt insulation": {
    name: "Rockwool Batt Insulation",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: ["furnaces", "spinning machines", "curing ovens", "automated packaging lines", "sensors and PLCs"],
    shortageImpact: "Medium",
  },
  "rockwool curtain wall pack 100mm": {
    name: "Rockwool curtain wall pack 100mm",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: ["furnaces", "spinning machines", "curing ovens", "automated packaging lines", "sensors and PLCs"],
    shortageImpact: "Medium",
  },
  "sheep wool insulation": {
    name: "Sheep Wool Insulation",
    category: "Insulation",
    availability: "High",
    manufacturingDependency: ["washing lines", "carding equipment", "bonding ovens", "basic automation"],
    shortageImpact: "Low",
  },
  "xps board 50mm": {
    name: "XPS Board 50mm",
    category: "Insulation",
    availability: "Medium",
    manufacturingDependency: ["extruders", "gas-injection controls", "temperature controllers", "cooling conveyors", "PLCs"],
    shortageImpact: "Medium",
  },

  // Aggregates
  "ballast stone": {
    name: "Ballast Stone",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crusher controls", "conveyor systems", "sensors"],
    shortageImpact: "Low–Medium",
  },
  "crushed stone 20mm": {
    name: "Crushed Stone 20mm",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crushers", "conveyors", "VFDs", "sensors"],
    shortageImpact: "Low–Medium",
  },
  "dolomite chips": {
    name: "Dolomite Chips",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crushers", "screening systems", "conveyors"],
    shortageImpact: "Low–Medium",
  },
  "fly ash aggregate": {
    name: "Fly Ash Aggregate",
    category: "Aggregates",
    availability: "Medium",
    manufacturingDependency: ["pelletizing disks", "sintering/curing machinery", "temperature sensors", "PLCs"],
    shortageImpact: "Medium",
  },
  "granite chips 10mm": {
    name: "Granite Chips 10mm",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crushing plants", "screening decks", "conveyors", "basic sensor monitors"],
    shortageImpact: "Low–Medium",
  },
  "laterite gravel": {
    name: "Laterite Gravel",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["excavators", "screening plants", "conveyor systems"],
    shortageImpact: "Low",
  },
  "m-sand manufactured": {
    name: "M-Sand Manufactured",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["VSI crushers", "air classifiers", "moisture sensors", "motor controllers"],
    shortageImpact: "Low–Medium",
  },
  "manufactured sand (m-sand) zone ii": {
    name: "Manufactured sand (M-sand) Zone II",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["VSI crushers", "air classifiers", "moisture sensors", "motor controllers"],
    shortageImpact: "Low–Medium",
  },
  "quarry dust": {
    name: "Quarry Dust",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["crushing byproduct collection", "conveyors"],
    shortageImpact: "Low",
  },
  "recycled concrete aggregate": {
    name: "Recycled Concrete Aggregate",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["impact crushers", "magnetic separators", "screening plants", "drive controls"],
    shortageImpact: "Low–Medium",
  },
  "river sand fine": {
    name: "River Sand Fine",
    category: "Aggregates",
    availability: "High",
    manufacturingDependency: ["dredging pumps", "washing plants", "classifiers", "conveyors"],
    shortageImpact: "Low",
  },

  // Timber
  "bamboo composite board": {
    name: "Bamboo Composite Board",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: ["pressing equipment", "temperature sensors", "cutting machinery", "PLC controls"],
    shortageImpact: "Medium",
  },
  "cedar cladding": {
    name: "Cedar Cladding",
    category: "Timber",
    availability: "High",
    manufacturingDependency: ["sawmill equipment", "moisture meters", "CNC equipment"],
    shortageImpact: "Low",
  },
  "fsc-certified structural plywood 19mm": {
    name: "FSC-certified structural plywood 19mm",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: ["rotary peeling lathes", "hot presses", "moisture sensors", "glue spreaders", "automated cross-cutting", "PLCs"],
    shortageImpact: "Medium",
  },
  "hardwood flooring oak": {
    name: "Hardwood Flooring Oak",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: ["automated kilns", "molding machines", "finishing lines", "sensors and PLCs"],
    shortageImpact: "Medium",
  },
  "marine plywood": {
    name: "Marine Plywood",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: ["rotary veneer peelers", "drying machinery", "hot presses", "automated sizing saws", "PLC systems"],
    shortageImpact: "Medium",
  },
  "mdf board 18mm": {
    name: "MDF Board 18mm",
    category: "Timber",
    availability: "Low",
    manufacturingDependency: ["defibrators", "continuous pressing lines", "thickness gauges", "automated sanding systems", "DCS/PLCs"],
    shortageImpact: "High",
  },
  "particle board e1": {
    name: "Particle Board E1",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: ["flakers", "dosing systems", "presses", "PLC controllers", "sensors"],
    shortageImpact: "Medium",
  },
  "pine plywood bwr": {
    name: "Pine Plywood BWR",
    category: "Timber",
    availability: "Medium",
    manufacturingDependency: ["peeling lathes", "hot presses", "moisture sensors", "cross-cutting saws"],
    shortageImpact: "Medium",
  },
  "rubberwood furniture grade": {
    name: "Rubberwood Furniture Grade",
    category: "Timber",
    availability: "High",
    manufacturingDependency: ["treatment plants", "kilns", "planers", "temperature controllers"],
    shortageImpact: "Low–Medium",
  },
  "sal wood beams": {
    name: "Sal Wood Beams",
    category: "Timber",
    availability: "High",
    manufacturingDependency: ["heavy sawmills", "conveyors", "chainsaws", "basic electrical drives"],
    shortageImpact: "Low",
  },
  "teak wood planks": {
    name: "Teak Wood Planks",
    category: "Timber",
    availability: "High",
    manufacturingDependency: ["sawing machines", "kiln-drying controllers", "planers", "moisture meters"],
    shortageImpact: "Low",
  },

  // Cement
  "fly ash blended cement": {
    name: "Fly Ash Blended Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: ["blending controls", "ball mills/VRMs", "flow sensors", "continuous DCS/PLCs"],
    shortageImpact: "High",
  },
  "low-alkali cement": {
    name: "Low-Alkali Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: ["kiln sensors", "gas analyzers", "process-control systems", "DCS/PLCs"],
    shortageImpact: "High",
  },
  "masonry cement": {
    name: "Masonry Cement",
    category: "Cement",
    availability: "Medium",
    manufacturingDependency: ["grinding mills", "weigh-feeders", "automated bagging", "PLCs"],
    shortageImpact: "Medium",
  },
  "oil well cement": {
    name: "Oil Well Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: ["high-precision chemical analyzers", "calcining controls", "DCS automation"],
    shortageImpact: "High",
  },
  "opc 53 grade cement": {
    name: "OPC 53 Grade Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: ["rotary kilns", "burners", "cooler drives", "grinding VRMs", "DCS/SCADA automation", "gas analyzers"],
    shortageImpact: "High",
    reason: "Modern high-grade cement plants are continuous-process automated operations relying heavily on distributed control systems (DCS), VFDs, and sensors.",
  },
  "ppc cement": {
    name: "PPC Cement",
    category: "Cement",
    availability: "Medium",
    manufacturingDependency: ["pozzolan dosing systems", "grinding automation", "bagging machinery", "PLCs"],
    shortageImpact: "Medium",
  },
  "psc 53 (portland slag cement)": {
    name: "PSC 53 (Portland Slag Cement)",
    category: "Cement",
    availability: "Medium",
    manufacturingDependency: ["slag dryers", "vertical roller mills", "dosing scales", "PLCs"],
    shortageImpact: "Medium",
  },
  "psc slag cement": {
    name: "PSC Slag Cement",
    category: "Cement",
    availability: "Medium",
    manufacturingDependency: ["slag dryers", "vertical roller mills", "dosing scales", "PLCs"],
    shortageImpact: "Medium",
  },
  "rapid hardening cement": {
    name: "Rapid Hardening Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: ["ultra-fine grinding controls", "temperature sensors", "kiln analyzers", "DCS"],
    shortageImpact: "High",
  },
  "sulphate resisting cement": {
    name: "Sulphate Resisting Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: ["batch chemistry controls", "kiln DCS", "optical pyrometers"],
    shortageImpact: "High",
  },
  "white portland cement": {
    name: "White Portland Cement",
    category: "Cement",
    availability: "Low",
    manufacturingDependency: ["specialized fuel controls", "gas analyzers", "optical sensors", "automated quenching", "DCS"],
    shortageImpact: "High",
  },

  // Steel
  "galvanized steel sheet": {
    name: "Galvanized Steel Sheet",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["continuous galvanizing lines (CGL)", "zinc bath sensors", "air-knife controls", "skin-pass mills", "DCS/PLCs"],
    shortageImpact: "High",
  },
  "steel angles isa": {
    name: "Steel Angles ISA",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["rolling mills", "cooling bed automation", "flying shears", "PLCs and motor drives"],
    shortageImpact: "High",
  },
  "steel binding wire": {
    name: "Steel Binding Wire",
    category: "Steel",
    availability: "Medium",
    manufacturingDependency: ["wire drawing machines", "annealing furnaces", "temperature controllers", "spoolers"],
    shortageImpact: "Medium",
  },
  "steel channels ismc": {
    name: "Steel Channels ISMC",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["structural rolling mills", "laser profile measurement", "cooling controls", "PLCs"],
    shortageImpact: "High",
  },
  "steel plates hr": {
    name: "Steel Plates HR",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["reheating furnaces", "roughing/finishing rolling stands", "hydraulic AGC", "cooling headers", "DCS/PLCs"],
    shortageImpact: "High",
  },
  "steel round bars": {
    name: "Steel Round Bars",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["billet rolling lines", "temperature sensors", "automated shears", "PLCs"],
    shortageImpact: "High",
  },
  "steel wire mesh": {
    name: "Steel Wire Mesh",
    category: "Steel",
    availability: "Medium",
    manufacturingDependency: ["automated mesh welding machines", "pneumatic / servo wire feeders", "weld controllers", "PLCs"],
    shortageImpact: "Medium",
  },
  "structural steel section ismb": {
    name: "Structural Steel Section ISMB",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["heavy section mills", "reheating furnace DCS", "automated roll positioning", "cooling controls", "shearing PLCs"],
    shortageImpact: "High",
  },
  "tmt fe500d (eaf / scrap-based)": {
    name: "TMT Fe500D (EAF / scrap-based)",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["electric arc furnace (EAF) controls", "ladle refining sensors", "continuous casting machines", "thermex quenching automation", "DCS/PLCs"],
    shortageImpact: "High",
  },
  "tmt fe500d rebar": {
    name: "TMT Fe500D Rebar",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["blast furnace/EAF controls", "continuous casting", "high-speed rolling mills", "Thermex water-quenching automation", "PLCs/DCS", "VFDs"],
    shortageImpact: "High",
  },
  "tmt fe550d rebar": {
    name: "TMT Fe550D Rebar",
    category: "Steel",
    availability: "Low",
    manufacturingDependency: ["precision micro-alloying controls", "quenching automation", "rolling mill drives", "DCS/PLCs"],
    shortageImpact: "High",
  },
};

export function getAvailabilityForMaterial(nameOrId: string): MaterialAvailabilityData {
  const norm = (nameOrId || "").toLowerCase().trim();

  if (MATERIAL_AVAILABILITY_MAP[norm]) {
    return MATERIAL_AVAILABILITY_MAP[norm];
  }

  // Exact without parentheses
  const clean = norm.replace(/\(.*?\)/g, "").trim();
  if (MATERIAL_AVAILABILITY_MAP[clean]) {
    return MATERIAL_AVAILABILITY_MAP[clean];
  }

  // Substring matching
  for (const [key, data] of Object.entries(MATERIAL_AVAILABILITY_MAP)) {
    if (norm.includes(key) || key.includes(norm) || clean.includes(key) || key.includes(clean)) {
      return data;
    }
  }

  // Fallback by category keywords
  if (norm.includes("cement") || norm.includes("steel") || norm.includes("rebar") || norm.includes("tmt")) {
    return {
      name: nameOrId,
      category: norm.includes("cement") ? "Cement" : "Steel",
      availability: "Low",
      manufacturingDependency: ["continuous process PLCs", "kiln/mill sensors", "VFD drives"],
      shortageImpact: "High",
    };
  }

  if (norm.includes("glass") || norm.includes("insulation") || norm.includes("glazing") || norm.includes("wool") || norm.includes("foam")) {
    return {
      name: nameOrId,
      category: norm.includes("glass") || norm.includes("glazing") ? "Glass" : "Insulation",
      availability: "Medium",
      manufacturingDependency: ["automated processing lines", "temperature sensors", "PLCs"],
      shortageImpact: "Medium",
    };
  }

  if (norm.includes("timber") || norm.includes("wood") || norm.includes("board") || norm.includes("plywood")) {
    return {
      name: nameOrId,
      category: "Timber",
      availability: "High",
      manufacturingDependency: ["sawing & pressing machinery", "temperature sensors", "moisture meters"],
      shortageImpact: "Low–Medium",
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
