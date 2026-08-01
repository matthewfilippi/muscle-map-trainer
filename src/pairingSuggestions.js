export const PAIRING_COUNTER_SUGGESTION_IDS = Object.freeze({
  absorption: [
    "bell-pepper",
    "olive-oil",
    "avocado-fruit",
    "lemon",
    "orange",
    "tomatoes",
    "salmon",
    "sardines"
  ],
  antiNutrients: [
    "lemon",
    "bell-pepper",
    "lime",
    "orange",
    "broccoli",
    "tomatoes",
    "strawberries",
    "kiwi"
  ],
  matrix: [
    "olive-oil",
    "avocado-fruit",
    "greek-yogurt",
    "lentils",
    "broccoli",
    "salmon",
    "oats",
    "blueberries"
  ],
  bloodSugar: [
    "greek-yogurt",
    "chia-seeds",
    "almonds",
    "avocado-fruit",
    "tuna",
    "lentils",
    "broccoli",
    "flaxseed"
  ]
});

export function choosePairingCounterSuggestion(counterId, selectedFoods, getFood, analyzeFoods) {
  const candidateIds = PAIRING_COUNTER_SUGGESTION_IDS[counterId] ?? [];
  const selectedIds = new Set(selectedFoods.map((food) => food.id));
  const currentScore = analyzeFoods(selectedFoods).scores[counterId];

  return candidateIds
    .map((id, order) => ({ food: getFood(id), order }))
    .filter(({ food }) => food && !selectedIds.has(food.id))
    .map(({ food, order }) => {
      const nextScore = analyzeFoods([...selectedFoods, food]).scores[counterId];
      return { food, nextScore, gain: nextScore - currentScore, order };
    })
    .filter((suggestion) => suggestion.gain > 0)
    .sort((a, b) => b.gain - a.gain || a.order - b.order)[0] ?? null;
}
