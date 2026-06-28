import { FOOD_NUTRIENT_PROFILES as USDA_PROFILES } from "./foodNutrients.js";
import {
  MANUAL_FOOD_PROFILES,
  SPECIAL_NUTRIENT_GUIDANCE,
  SPECIAL_NUTRIENT_VALUES
} from "./specialNutrients.js";

const foodIds = new Set([
  ...Object.keys(USDA_PROFILES),
  ...Object.keys(MANUAL_FOOD_PROFILES),
  ...Object.keys(SPECIAL_NUTRIENT_VALUES)
]);

export const FOOD_NUTRIENT_PROFILES = Object.fromEntries([...foodIds].map((foodId) => {
  const usda = USDA_PROFILES[foodId] ?? {};
  const manual = MANUAL_FOOD_PROFILES[foodId] ?? {};
  return [foodId, {
    ...usda,
    ...manual,
    values: {
      ...(usda.values ?? {}),
      ...(manual.values ?? {}),
      ...(SPECIAL_NUTRIENT_VALUES[foodId] ?? {})
    }
  }];
}));

export { SPECIAL_NUTRIENT_GUIDANCE };
