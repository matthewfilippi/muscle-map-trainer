import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [sourcePath, outputPath = "src/foodNutrients.js"] = process.argv.slice(2);

if (!sourcePath) {
  throw new Error("Usage: node scripts/build-nutrient-profiles.mjs <USDA SR Legacy JSON> [output]");
}

const { FOODS } = await import(pathToFileURL(path.resolve("src/data.js")));
const records = JSON.parse(fs.readFileSync(sourcePath, "utf8")).SRLegacyFoods;
const recordsByNdb = new Map(records.map((record) => [Number(record.ndbNumber), record]));

// Curated USDA SR Legacy records. A missing entry is intentional when no close,
// compositionally useful record exists in the source archive.
const FOOD_NDB = {
  "chicken-breast": 5064, turkey: 5220, salmon: 15209, tuna: 15121, sardines: 15088,
  shrimp: 15271, eggs: 1129, "lean-beef": 13070, "pork-tenderloin": 10061,
  tofu: 16126, tempeh: 16174, edamame: 11451, lentils: 16070, "black-beans": 16015,
  chickpeas: 16057, spinach: 11457, kale: 11233, broccoli: 11091,
  "bell-pepper": 11821, carrots: 11124, tomatoes: 11529, asparagus: 11012,
  "brussels-sprouts": 11099, cauliflower: 11136, mushrooms: 11261, onions: 11283,
  "bok-choy": 11117, "green-beans": 11053, cucumber: 11205, beets: 11081,
  blueberries: 9050, strawberries: 9316, banana: 9040, apple: 9003, orange: 9200,
  grapes: 9132, pineapple: 9266, mango: 9176, kiwi: 9148, "avocado-fruit": 9037,
  watermelon: 9326, cherries: 9070, lemon: 9150, lime: 9159, plum: 9279,
  raspberries: 9302, oats: 8121, "brown-rice": 20037, quinoa: 20137,
  "whole-wheat-bread": 18075, "whole-grain-pita": 18042, "sweet-potato": 11508,
  potatoes: 11674, barley: 20006, "corn-tortilla": 18449, "whole-grain-pasta": 20125,
  buckwheat: 20010, "greek-yogurt": 1287, "cottage-cheese": 1015, milk: 1079,
  kefir: 1289, cheddar: 1009, mozzarella: 1028, "soy-milk": 16139,
  "almond-milk": 14091, "olive-oil": 4053, almonds: 12061, walnuts: 12155,
  "peanut-butter": 16167, "chia-seeds": 12006, flaxseed: 12220,
  "pumpkin-seeds": 12014, tahini: 12166, olives: 9193,
  allspice: 2001, "anise-seed": 2002, "black-pepper": 2030, "white-pepper": 2032,
  "caraway-seed": 2005, cardamom: 2006, cayenne: 2031, "celery-seed": 2007,
  cinnamon: 2010, cloves: 2011, "coriander-seed": 2013, cumin: 2014,
  "dill-seed": 2016, "fennel-seed": 2018, fenugreek: 2019, "garlic-powder": 2020,
  "ground-ginger": 2021, mace: 2022, "mustard-seed": 2024, nutmeg: 2025,
  "onion-powder": 2026, paprika: 2028, "smoked-paprika": 2028, "poppy-seed": 2033,
  "red-pepper-flakes": 2031, saffron: 2037, turmeric: 2043,
  "chili-powder": 2009, "chipotle-powder": 2031, gochugaru: 2031,
  "dried-basil": 2003, "bay-leaf": 2004, "dill-weed": 2017,
  "dried-marjoram": 2023, "dried-mint": 2066, "dried-oregano": 2027,
  "dried-parsley": 2029, "dried-rosemary": 2036, "dried-sage": 2038,
  "dried-savory": 2039, "dried-tarragon": 2041, "dried-thyme": 2042,
  water: 14555, "sparkling-water": 14384, "unsweet-tea": 14355, coffee: 14209,
  "coconut-water": 14090
};

const NUTRIENT_IDS = {
  protein: [1003], carbohydrate: [1005], fiber: [1079], water: [1051],
  "omega-6-la": [1269, 1316], "omega-3-ala": [1404, 1270],
  "vitamin-a": [1106], "vitamin-c": [1162], "vitamin-d": [1114],
  "vitamin-e": [1109], "vitamin-k": [1185], thiamin: [1165], riboflavin: [1166],
  niacin: [1167], "pantothenic-acid": [1170], "vitamin-b6": [1175],
  folate: [1190, 1177], "vitamin-b12": [1178], choline: [1180], calcium: [1087],
  copper: [1098], fluoride: [1099], iron: [1089], magnesium: [1090],
  manganese: [1101], phosphorus: [1091], potassium: [1092], selenium: [1103],
  sodium: [1093], zinc: [1095]
};

function parseAmount(value) {
  const match = value.match(/^(\d+)(?:\/(\d+))?/);
  if (!match) return 1;
  return match[2] ? Number(match[1]) / Number(match[2]) : Number(match[1]);
}

function findPortion(record, serving) {
  const lower = serving.toLowerCase();
  const amount = parseAmount(lower);
  if (/\boz\b/.test(lower)) return amount * 28.3495;

  const portionNeedle = lower.includes("cup") ? "cup"
    : lower.includes("tbsp") ? "tablespoon"
      : lower.includes("tsp") ? "teaspoon"
        : lower.includes("medium") ? "medium"
          : lower.includes("large") ? "large"
            : lower.includes("slice") ? "slice"
              : lower.includes("leaf") ? "leaf"
                : lower.includes("fruit") ? "fruit"
                  : null;

  if (!portionNeedle) return null;
  const portion = record.foodPortions?.find((item) => (
    `${item.modifier || ""} ${item.measureUnit?.name || ""}`.toLowerCase().includes(portionNeedle)
  ));
  if (!portion?.gramWeight) return null;
  return (portion.gramWeight / (Number(portion.amount) || 1)) * amount;
}

function nutrientAmount(record, ids) {
  for (const id of ids) {
    const item = record.foodNutrients?.find((entry) => entry.nutrient?.id === id);
    if (item && Number.isFinite(Number(item.amount))) return Number(item.amount);
  }
  return null;
}

function servingGrams(record, food) {
  const fromPortion = findPortion(record, food.serving);
  const caloriesPer100 = nutrientAmount(record, [1008]);
  const fromCalories = caloriesPer100 > 0 && food.calories > 0
    ? (food.calories / caloriesPer100) * 100
    : null;

  if (!fromPortion) return fromCalories ?? (food.id === "water" || food.id === "sparkling-water" || food.id === "unsweet-tea" ? 355 : 100);
  if (!fromCalories) return fromPortion;

  const ratio = fromPortion / fromCalories;
  return ratio < 0.55 || ratio > 1.8 ? fromCalories : fromPortion;
}

const profiles = {};
const missing = [];

for (const food of FOODS) {
  const ndb = FOOD_NDB[food.id];
  const record = recordsByNdb.get(ndb);
  if (!record) {
    missing.push(food.id);
    profiles[food.id] = { source: null, servingGrams: null, values: {
      protein: food.protein, carbohydrate: food.carbs, fiber: food.fiber
    } };
    continue;
  }

  const grams = servingGrams(record, food);
  const scale = grams / 100;
  const values = {};
  for (const [nutrientId, sourceIds] of Object.entries(NUTRIENT_IDS)) {
    const amount = nutrientAmount(record, sourceIds);
    if (amount !== null) values[nutrientId] = Number((amount * scale).toPrecision(6));
  }

  // Keep macros aligned with the serving labels already shown on each card.
  values.protein = food.protein;
  values.carbohydrate = food.carbs;
  values.fiber = food.fiber;
  if (values.water !== undefined) values.water = Number((values.water / 1000).toPrecision(6));
  if (values.fluoride !== undefined) values.fluoride = Number((values.fluoride / 1000).toPrecision(6));

  profiles[food.id] = {
    source: `USDA FoodData Central SR Legacy ${record.ndbNumber}: ${record.description}`,
    servingGrams: Number(grams.toFixed(1)),
    values
  };
}

const source = `// Generated by scripts/build-nutrient-profiles.mjs from USDA FoodData Central SR Legacy.\n` +
  `// Values are estimates per app serving; absent keys mean the source record did not report a value.\n` +
  `export const FOOD_NUTRIENT_PROFILES = ${JSON.stringify(profiles, null, 2)};\n`;

fs.writeFileSync(path.resolve(outputPath), source);
console.log(`Wrote ${Object.keys(profiles).length} profiles to ${outputPath}.`);
console.log(`Profiles without a close USDA record (${missing.length}): ${missing.join(", ") || "none"}`);
