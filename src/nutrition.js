export const NUTRIENT_CATEGORIES = [
  { id: "macros", label: "Core Nutrients", theme: "#2f7f68" },
  { id: "vitamins", label: "Vitamins", theme: "#d88324" },
  { id: "minerals", label: "Minerals and Electrolytes", theme: "#3e70ad" }
];

export const NUTRIENTS = [
  { id: "protein", name: "Protein", category: "macros", unit: "g", role: "Builds and repairs tissues and supplies the amino acids used to make enzymes and hormones." },
  { id: "carbohydrate", name: "Carbohydrate", category: "macros", unit: "g", role: "Provides glucose for the brain and working muscles." },
  { id: "fiber", name: "Dietary Fiber", category: "macros", unit: "g", role: "Supports digestion, fullness, blood sugar management, and healthy cholesterol levels." },
  { id: "water", name: "Total Water", category: "macros", unit: "L", role: "Supports circulation, temperature control, digestion, and normal cell function. The target includes water in foods and drinks." },
  { id: "omega-6-la", name: "Linoleic Acid (Omega-6)", category: "macros", unit: "g", role: "An essential fatty acid used in cell membranes, growth, and normal skin function." },
  { id: "omega-3-ala", name: "Alpha-Linolenic Acid (Omega-3)", category: "macros", unit: "g", role: "An essential fatty acid used in cell membranes and as a precursor to longer-chain omega-3 fats." },

  { id: "vitamin-a", name: "Vitamin A", category: "vitamins", unit: "mcg RAE", role: "Supports vision, immune function, growth, and cell development." },
  { id: "vitamin-c", name: "Vitamin C", category: "vitamins", unit: "mg", role: "Helps form collagen, supports antioxidant defenses, and improves absorption of plant iron." },
  { id: "vitamin-d", name: "Vitamin D", category: "vitamins", unit: "mcg", role: "Helps absorb calcium and supports bones, muscles, nerves, and immune function." },
  { id: "vitamin-e", name: "Vitamin E", category: "vitamins", unit: "mg", role: "Acts as an antioxidant and helps protect cell membranes." },
  { id: "vitamin-k", name: "Vitamin K", category: "vitamins", unit: "mcg", role: "Supports normal blood clotting and bone proteins." },
  { id: "thiamin", name: "Thiamin (B1)", category: "vitamins", unit: "mg", role: "Helps convert food into energy and supports nerve function." },
  { id: "riboflavin", name: "Riboflavin (B2)", category: "vitamins", unit: "mg", role: "Supports energy production, growth, and cellular function." },
  { id: "niacin", name: "Niacin (B3)", category: "vitamins", unit: "mg NE", role: "Supports energy metabolism, the nervous system, and skin." },
  { id: "pantothenic-acid", name: "Pantothenic Acid (B5)", category: "vitamins", unit: "mg", role: "Helps make coenzyme A for energy metabolism and fatty-acid synthesis." },
  { id: "vitamin-b6", name: "Vitamin B6", category: "vitamins", unit: "mg", role: "Supports protein metabolism, brain development, and immune function." },
  { id: "biotin", name: "Biotin (B7)", category: "vitamins", unit: "mcg", role: "Helps metabolize carbohydrate, fat, and protein." },
  { id: "folate", name: "Folate (B9)", category: "vitamins", unit: "mcg DFE", role: "Supports DNA production and cell division and is especially important before and during pregnancy." },
  { id: "vitamin-b12", name: "Vitamin B12", category: "vitamins", unit: "mcg", role: "Helps form red blood cells and DNA and supports healthy nerve cells." },
  { id: "choline", name: "Choline", category: "vitamins", unit: "mg", role: "Supports cell membranes, memory, mood, muscle control, and early brain development." },

  { id: "calcium", name: "Calcium", category: "minerals", unit: "mg", role: "Builds bones and teeth and supports muscle contraction, nerves, and blood vessels." },
  { id: "chromium", name: "Chromium", category: "minerals", unit: "mcg", role: "Supports normal macronutrient metabolism and insulin action." },
  { id: "copper", name: "Copper", category: "minerals", unit: "mg", role: "Supports iron metabolism, connective tissue, energy production, and antioxidant enzymes." },
  { id: "fluoride", name: "Fluoride", category: "minerals", unit: "mg", role: "Helps strengthen teeth and reduce tooth decay." },
  { id: "iodine", name: "Iodine", category: "minerals", unit: "mcg", role: "Helps the thyroid make hormones that regulate metabolism and development." },
  { id: "iron", name: "Iron", category: "minerals", unit: "mg", role: "Helps make hemoglobin, which carries oxygen through the body." },
  { id: "magnesium", name: "Magnesium", category: "minerals", unit: "mg", role: "Supports muscle and nerve function, blood glucose control, and energy production." },
  { id: "manganese", name: "Manganese", category: "minerals", unit: "mg", role: "Supports metabolism, bone formation, and antioxidant enzymes." },
  { id: "molybdenum", name: "Molybdenum", category: "minerals", unit: "mcg", role: "Acts as a helper for enzymes that process sulfur compounds and other molecules." },
  { id: "phosphorus", name: "Phosphorus", category: "minerals", unit: "mg", role: "Helps build bones and teeth and supports energy production and cell repair." },
  { id: "potassium", name: "Potassium", category: "minerals", unit: "mg", role: "Supports fluid balance, nerve signals, muscle contraction, and healthy blood pressure." },
  { id: "selenium", name: "Selenium", category: "minerals", unit: "mcg", role: "Supports thyroid function, reproduction, DNA production, and antioxidant defenses." },
  { id: "sodium", name: "Sodium", category: "minerals", unit: "mg", role: "Supports fluid balance, nerves, and muscles. More is not better; the tracker also shows the age-appropriate reduction limit." },
  { id: "chloride", name: "Chloride", category: "minerals", unit: "g", role: "Works with sodium in fluid balance and is used to make stomach acid." },
  { id: "zinc", name: "Zinc", category: "minerals", unit: "mg", role: "Supports immune function, wound healing, DNA production, growth, and taste." }
];

const MACRO_KEYS = ["water", "carbohydrate", "fiber", "omega-6-la", "omega-3-ala", "protein"];
const VITAMIN_KEYS = ["vitamin-a", "vitamin-c", "vitamin-d", "vitamin-e", "vitamin-k", "thiamin", "riboflavin", "niacin", "vitamin-b6", "folate", "vitamin-b12", "pantothenic-acid", "biotin", "choline"];
const ELEMENT_KEYS = ["calcium", "chromium", "copper", "fluoride", "iodine", "iron", "magnesium", "manganese", "molybdenum", "phosphorus", "selenium", "zinc", "potassium", "sodium", "chloride"];

const ROWS = {
  child4_8: {
    macros: [1.7, 130, 25, 10, 0.9, 19],
    vitamins: [400, 25, 15, 7, 55, 0.6, 0.6, 8, 0.6, 200, 1.2, 3, 12, 250],
    elements: [1000, 15, 0.44, 1, 90, 10, 130, 1.5, 22, 500, 30, 5, 2300, 1000, 1.9]
  },
  male9_13: {
    macros: [2.4, 130, 31, 12, 1.2, 34],
    vitamins: [600, 45, 15, 11, 60, 0.9, 0.9, 12, 1, 300, 1.8, 4, 20, 375],
    elements: [1300, 25, 0.7, 2, 120, 8, 240, 1.9, 34, 1250, 40, 8, 2500, 1200, 2.3]
  },
  male14_18: {
    macros: [3.3, 130, 38, 16, 1.6, 52],
    vitamins: [900, 75, 15, 15, 75, 1.2, 1.3, 16, 1.3, 400, 2.4, 5, 25, 550],
    elements: [1300, 35, 0.89, 3, 150, 11, 410, 2.2, 43, 1250, 55, 11, 3000, 1500, 2.3]
  },
  male19_30: {
    macros: [3.7, 130, 38, 17, 1.6, 56],
    vitamins: [900, 90, 15, 15, 120, 1.2, 1.3, 16, 1.3, 400, 2.4, 5, 30, 550],
    elements: [1000, 35, 0.9, 4, 150, 8, 400, 2.3, 45, 700, 55, 11, 3400, 1500, 2.3]
  },
  male31_50: {
    macros: [3.7, 130, 38, 17, 1.6, 56],
    vitamins: [900, 90, 15, 15, 120, 1.2, 1.3, 16, 1.3, 400, 2.4, 5, 30, 550],
    elements: [1000, 35, 0.9, 4, 150, 8, 420, 2.3, 45, 700, 55, 11, 3400, 1500, 2.3]
  },
  male51_70: {
    macros: [3.7, 130, 30, 14, 1.6, 56],
    vitamins: [900, 90, 15, 15, 120, 1.2, 1.3, 16, 1.7, 400, 2.4, 5, 30, 550],
    elements: [1000, 30, 0.9, 4, 150, 8, 420, 2.3, 45, 700, 55, 11, 3400, 1500, 2]
  },
  male71: {
    macros: [3.7, 130, 30, 14, 1.6, 56],
    vitamins: [900, 90, 20, 15, 120, 1.2, 1.3, 16, 1.7, 400, 2.4, 5, 30, 550],
    elements: [1200, 30, 0.9, 4, 150, 8, 420, 2.3, 45, 700, 55, 11, 3400, 1500, 1.8]
  },
  female9_13: {
    macros: [2.1, 130, 26, 10, 1, 34],
    vitamins: [600, 45, 15, 11, 60, 0.9, 0.9, 12, 1, 300, 1.8, 4, 20, 375],
    elements: [1300, 21, 0.7, 2, 120, 8, 240, 1.6, 34, 1250, 40, 8, 2300, 1200, 2.3]
  },
  female14_18: {
    macros: [2.3, 130, 26, 11, 1.1, 46],
    vitamins: [700, 65, 15, 15, 75, 1, 1, 14, 1.2, 400, 2.4, 5, 25, 400],
    elements: [1300, 24, 0.89, 3, 150, 15, 360, 1.6, 43, 1250, 55, 9, 2300, 1500, 2.3]
  },
  female19_30: {
    macros: [2.7, 130, 25, 12, 1.1, 46],
    vitamins: [700, 75, 15, 15, 90, 1.1, 1.1, 14, 1.3, 400, 2.4, 5, 30, 425],
    elements: [1000, 25, 0.9, 3, 150, 18, 310, 1.8, 45, 700, 55, 8, 2600, 1500, 2.3]
  },
  female31_50: {
    macros: [2.7, 130, 25, 12, 1.1, 46],
    vitamins: [700, 75, 15, 15, 90, 1.1, 1.1, 14, 1.3, 400, 2.4, 5, 30, 425],
    elements: [1000, 25, 0.9, 3, 150, 18, 320, 1.8, 45, 700, 55, 8, 2600, 1500, 2.3]
  },
  female51_70: {
    macros: [2.7, 130, 21, 11, 1.1, 46],
    vitamins: [700, 75, 15, 15, 90, 1.1, 1.1, 14, 1.5, 400, 2.4, 5, 30, 425],
    elements: [1200, 20, 0.9, 3, 150, 8, 320, 1.8, 45, 700, 55, 8, 2600, 1500, 2]
  },
  female71: {
    macros: [2.7, 130, 21, 11, 1.1, 46],
    vitamins: [700, 75, 20, 15, 90, 1.1, 1.1, 14, 1.5, 400, 2.4, 5, 30, 425],
    elements: [1200, 20, 0.9, 3, 150, 8, 320, 1.8, 45, 700, 55, 8, 2600, 1500, 1.8]
  },
  pregnant14_18: {
    macros: [3, 175, 28, 13, 1.4, 71],
    vitamins: [750, 80, 15, 15, 75, 1.4, 1.4, 18, 1.9, 600, 2.6, 6, 30, 450],
    elements: [1300, 29, 1, 3, 220, 27, 400, 2, 50, 1250, 60, 12, 2600, 1500, 2.3]
  },
  pregnant19_30: {
    macros: [3, 175, 28, 13, 1.4, 71],
    vitamins: [770, 85, 15, 15, 90, 1.4, 1.4, 18, 1.9, 600, 2.6, 6, 30, 450],
    elements: [1000, 30, 1, 3, 220, 27, 350, 2, 50, 700, 60, 11, 2900, 1500, 2.3]
  },
  pregnant31_50: {
    macros: [3, 175, 28, 13, 1.4, 71],
    vitamins: [770, 85, 15, 15, 90, 1.4, 1.4, 18, 1.9, 600, 2.6, 6, 30, 450],
    elements: [1000, 30, 1, 3, 220, 27, 360, 2, 50, 700, 60, 11, 2900, 1500, 2.3]
  },
  lactating14_18: {
    macros: [3.8, 210, 29, 13, 1.3, 71],
    vitamins: [1200, 115, 15, 19, 75, 1.4, 1.6, 17, 2, 500, 2.8, 7, 35, 550],
    elements: [1300, 44, 1.3, 3, 290, 10, 360, 2.6, 50, 1250, 70, 13, 2500, 1500, 2.3]
  },
  lactating19_30: {
    macros: [3.8, 210, 29, 13, 1.3, 71],
    vitamins: [1300, 120, 15, 19, 90, 1.4, 1.6, 17, 2, 500, 2.8, 7, 35, 550],
    elements: [1000, 45, 1.3, 3, 290, 9, 310, 2.6, 50, 700, 70, 12, 2800, 1500, 2.3]
  },
  lactating31_50: {
    macros: [3.8, 210, 29, 13, 1.3, 71],
    vitamins: [1300, 120, 15, 19, 90, 1.4, 1.6, 17, 2, 500, 2.8, 7, 35, 550],
    elements: [1000, 45, 1.3, 3, 290, 9, 320, 2.6, 50, 700, 70, 12, 2800, 1500, 2.3]
  }
};

const TARGET_TYPES = {
  water: "AI", fiber: "AI", "omega-6-la": "AI", "omega-3-ala": "AI",
  "vitamin-k": "AI", "pantothenic-acid": "AI", biotin: "AI", choline: "AI",
  chromium: "AI", fluoride: "AI", manganese: "AI", potassium: "AI", sodium: "AI", chloride: "AI"
};

function rowToTargets(row, age) {
  const values = {};
  MACRO_KEYS.forEach((key, index) => { values[key] = row.macros[index]; });
  VITAMIN_KEYS.forEach((key, index) => { values[key] = row.vitamins[index]; });
  ELEMENT_KEYS.forEach((key, index) => { values[key] = row.elements[index]; });
  return Object.fromEntries(Object.entries(values).map(([id, value]) => [id, {
    value,
    type: TARGET_TYPES[id] || "RDA",
    ...(id === "sodium" ? { limit: age <= 8 ? 1500 : age <= 13 ? 1800 : 2300 } : {})
  }]));
}

export function normalizeNutritionProfile(profile = {}) {
  const age = Math.min(120, Math.max(4, Math.round(Number(profile.age) || 30)));
  const sex = profile.sex === "female" ? "female" : "male";
  const lifeStageAllowed = sex === "female" && age >= 14 && age <= 50;
  const lifeStage = lifeStageAllowed && ["pregnant", "lactating"].includes(profile.lifeStage)
    ? profile.lifeStage
    : "none";
  return { age, sex, lifeStage };
}

export function getDriGroup(profile) {
  const normalized = normalizeNutritionProfile(profile);
  const { age, sex, lifeStage } = normalized;
  let ageBand = age <= 8 ? "4_8" : age <= 13 ? "9_13" : age <= 18 ? "14_18"
    : age <= 30 ? "19_30" : age <= 50 ? "31_50" : age <= 70 ? "51_70" : "71";
  const key = age <= 8 ? "child4_8" : lifeStage !== "none" ? `${lifeStage}${ageBand}` : `${sex}${ageBand}`;
  const label = age <= 8 ? "Ages 4-8" : `${lifeStage === "pregnant" ? "Pregnancy" : lifeStage === "lactating" ? "Breastfeeding" : sex === "female" ? "Female" : "Male"}, ${ageBand.replace("_", "-")}${ageBand === "71" ? "+" : ""}`;
  return { ...normalized, key, label, targets: rowToTargets(ROWS[key], age) };
}

export function getNutrientTarget(nutrientId, profile) {
  return getDriGroup(profile).targets[nutrientId];
}
