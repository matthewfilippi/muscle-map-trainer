import test from "node:test";
import assert from "node:assert/strict";
import { MUSCLES, getMuscle } from "../src/data.js";
import {
  analyzeRoutine,
  createRoutineItem,
  estimateRoutineMinutes,
  normalizeCustomRoutine
} from "../src/routineBuilder.js";

function itemFor(muscleId, exerciseName, level = "beginner", changes = {}) {
  const exercise = getMuscle(muscleId).exercises.find((candidate) => candidate.name === exerciseName);
  return { ...createRoutineItem(muscleId, exercise, level), ...changes };
}

test("custom routines normalize saved exercises and bounded prescriptions", () => {
  const routine = normalizeCustomRoutine({
    name: "  Push day  ",
    level: "beginner",
    targetMuscles: ["chest", "chest", "not-a-muscle"],
    selectedEquipment: ["dumbbells", "dumbbells"],
    items: [{
      muscleId: "chest",
      exerciseName: "Incline Push-Up",
      sets: 40,
      reps: 0,
      restSeconds: 900
    }, {
      muscleId: "not-a-muscle",
      exerciseName: "Missing"
    }]
  });

  assert.equal(routine.name, "Push day");
  assert.deepEqual(routine.targetMuscles, ["chest"]);
  assert.deepEqual(routine.selectedEquipment, ["dumbbells"]);
  assert.equal(routine.items.length, 1);
  assert.equal(routine.items[0].sets, 12);
  assert.equal(routine.items[0].reps, 1);
  assert.equal(routine.items[0].restSeconds, 600);
});

test("routine review identifies missing and light target coverage", () => {
  const missing = analyzeRoutine({
    name: "Push",
    level: "beginner",
    targetMuscles: ["chest", "triceps"],
    items: [itemFor("chest", "Incline Push-Up")]
  });
  assert.ok(missing.findings.some((finding) => finding.id === "missing-triceps"));

  const lightItem = itemFor("chest", "Incline Push-Up", "beginner", { sets: 1 });
  const light = analyzeRoutine({ level: "beginner", targetMuscles: ["chest"], items: [lightItem] });
  assert.ok(light.findings.some((finding) => finding.id === "light-chest"));
});

test("a concise two-set target routine clears the general checks", () => {
  const routine = analyzeRoutine({
    name: "Chest session",
    level: "beginner",
    targetMuscles: ["chest"],
    items: [itemFor("chest", "Incline Push-Up", "beginner", { sets: 2, reps: 10, restSeconds: 90 })]
  });

  assert.equal(routine.cautionCount, 0);
  assert.equal(routine.totalExercises, 1);
  assert.equal(routine.totalSets, 2);
  assert.ok(routine.estimatedMinutes > 0);
});

test("routine review catches concentrated volume, long sessions, and level mismatches", () => {
  const chest = getMuscle("chest");
  const manyItems = chest.exercises.slice(0, 11).map((exercise) => ({
    ...createRoutineItem("chest", exercise, "expert"),
    sets: 3
  }));
  const expertExercise = chest.exercises.find((exercise) => exercise.level === "expert");
  manyItems[0] = { ...createRoutineItem("chest", expertExercise, "expert"), sets: 6 };

  const review = analyzeRoutine({
    level: "beginner",
    targetMuscles: ["chest"],
    items: manyItems
  });

  assert.ok(review.findings.some((finding) => finding.id === "long-session"));
  assert.ok(review.findings.some((finding) => finding.id === "high-volume-chest"));
  assert.ok(review.findings.some((finding) => finding.id === "many-variations-chest"));
  assert.ok(review.findings.some((finding) => finding.id.startsWith("level-")));
  assert.ok(review.findings.some((finding) => finding.id.startsWith("sets-")));
});

test("routine review allows mixed targets but flags the organization choice", () => {
  const review = analyzeRoutine({
    level: "beginner",
    targetMuscles: ["chest", "hamstrings"],
    items: [
      itemFor("chest", "Incline Push-Up"),
      itemFor("hamstrings", "Stability Ball Leg Curl")
    ]
  });

  assert.ok(review.findings.some((finding) => finding.id === "mixed-focus"));
});

test("routine duration increases with working sets and rest", () => {
  const shortItem = itemFor("chest", "Incline Push-Up", "beginner", { sets: 2, restSeconds: 30 });
  const longItem = { ...shortItem, sets: 5, restSeconds: 180 };
  assert.ok(estimateRoutineMinutes([longItem]) > estimateRoutineMinutes([shortItem]));
  assert.ok(MUSCLES.length > 0);
});
