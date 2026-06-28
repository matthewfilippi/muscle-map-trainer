// Selected-food estimates fill gaps that USDA SR Legacy does not report.
// Values use the closest matching food and the serving shown on the card.
export const SPECIAL_NUTRIENT_VALUES = {
  "chicken-breast": { iodine: 1, molybdenum: 9 },
  tuna: { biotin: 0.6, iodine: 7 },
  shrimp: { iodine: 13 },
  eggs: { biotin: 20, iodine: 62, molybdenum: 18 },
  "green-beans": { molybdenum: 6 },
  carrots: { molybdenum: 4 },
  asparagus: { molybdenum: 4 },
  banana: { biotin: 0.3, molybdenum: 15 },
  orange: { molybdenum: 4 },
  oats: { biotin: 0.2 },
  "whole-wheat-bread": { molybdenum: 24 },
  "sweet-potato": { biotin: 2.4 },
  "greek-yogurt": { iodine: 87 },
  milk: { biotin: 0.3, iodine: 84, molybdenum: 22 },
  cheddar: { biotin: 0.4, iodine: 14, molybdenum: 6 },
  "soy-milk": { iodine: 3 },
  almonds: { biotin: 1.2 }
};

export const MANUAL_FOOD_PROFILES = {
  honey: {
    source: "USDA standard reference estimate for honey",
    servingGrams: 21,
    values: { protein: 0, carbohydrate: 17, fiber: 0 }
  },
  "iodized-salt": {
    source: "NIH ODS selected-food estimate for iodized table salt",
    servingGrams: 1.5,
    values: {
      protein: 0,
      carbohydrate: 0,
      fiber: 0,
      iodine: 78,
      sodium: 590,
      chloride: 0.91
    }
  }
};

export const SPECIAL_NUTRIENT_GUIDANCE = {
  biotin: {
    label: "NIH selected-food estimates",
    url: "https://ods.od.nih.gov/factsheets/Biotin-HealthProfessional/",
    note: "USDA FoodData Central does not list biotin. These approximate values come from the NIH selected-food table and may vary by product and preparation."
  },
  chromium: {
    label: "NIH chromium guidance",
    url: "https://ods.od.nih.gov/factsheets/Chromium-Consumer/",
    note: "Amounts vary with soil, animal feed, and processing, so the app does not invent serving totals. NIH now says chromium may not be necessary for good health; the displayed AI is the historical 2001 reference.",
    sourceFoodIds: ["lean-beef", "turkey", "whole-wheat-bread", "green-beans", "apple", "banana", "almonds"]
  },
  iodine: {
    label: "NIH iodine selected-food table",
    url: "https://ods.od.nih.gov/factsheets/Iodine-HealthProfessional/",
    note: "Iodine varies substantially in dairy, seafood, bread, and salt. Values shown here are approximate selected-food estimates; product labels and ingredients can differ."
  },
  molybdenum: {
    label: "NIH selected-food estimates",
    url: "https://ods.od.nih.gov/factsheets/Molybdenum-HealthProfessional/",
    note: "USDA FoodData Central does not list molybdenum. NIH selected-food estimates are approximate because soil and irrigation water affect food content."
  },
  chloride: {
    label: "Dietary chloride reference",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7009052/",
    note: "Most dietary chloride comes from salt. The app estimates chloride only for the measured iodized-salt serving instead of assuming that every milligram of sodium came from sodium chloride."
  }
};
