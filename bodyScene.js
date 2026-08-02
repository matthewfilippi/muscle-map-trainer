import test from "node:test";
import assert from "node:assert/strict";
import { choosePairingCounterSuggestion } from "../src/pairingSuggestions.js";

const foods = {
  current: { id: "current", boost: 0 },
  "bell-pepper": { id: "bell-pepper", boost: 8 },
  "olive-oil": { id: "olive-oil", boost: 14 },
  lemon: { id: "lemon", boost: 5 }
};

function getFood(id) {
  return foods[id];
}

function analyzeFoods(selectedFoods) {
  const score = selectedFoods.reduce((sum, food) => sum + food.boost, 40);
  return { scores: { absorption: score } };
}

test("counter suggestions choose the available food with the largest score gain", () => {
  const suggestion = choosePairingCounterSuggestion(
    "absorption",
    [foods.current],
    getFood,
    analyzeFoods
  );

  assert.equal(suggestion.food.id, "olive-oil");
  assert.equal(suggestion.gain, 14);
  assert.equal(suggestion.nextScore, 54);
});

test("counter suggestions skip foods that are already on the plate", () => {
  const suggestion = choosePairingCounterSuggestion(
    "absorption",
    [foods.current, foods["olive-oil"]],
    getFood,
    analyzeFoods
  );

  assert.equal(suggestion.food.id, "bell-pepper");
});

test("unsupported counters do not produce a suggestion", () => {
  assert.equal(
    choosePairingCounterSuggestion("digestion", [foods.current], getFood, analyzeFoods),
    null
  );
});
