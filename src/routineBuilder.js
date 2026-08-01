import { LEVELS, MUSCLES, SPLITS, getMuscle } from "./data.js";

export const CUSTOM_ROUTINE_STORAGE_KEY = "wellness-map-custom-routine-v1";

const LEVEL_ORDER = ["beginner", "intermediate", "expert"];
const DEFAULTS_BY_LEVEL = {
  beginner: { sets: 2, reps: 10, restSeconds: 90 },
  intermediate: { sets: 3, reps: 10, restSeconds: 90 },
  expert: { sets: 4, reps: 8, restSeconds: 120 }
};

function boundedInteger(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `routine-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function findExercise(muscleId, exerciseName) {
  return getMuscle(muscleId)?.exercises.find((exercise) => exercise.name === exerciseName) ?? null;
}

export function getDefaultCustomRoutine() {
  return {
    name: "My workout",
    level: "beginner",
    targetMuscles: ["chest", "shoulders", "triceps"],
    selectedEquipment: [],
    items: []
  };
}

export function createRoutineItem(muscleId, exercise, level = "beginner") {
  const defaults = DEFAULTS_BY_LEVEL[level] ?? DEFAULTS_BY_LEVEL.beginner;
  return {
    id: createId(),
    muscleId,
    exerciseName: exercise.name,
    exerciseLevel: exercise.level,
    equipment: exercise.equipment,
    cue: exercise.cue,
    sets: defaults.sets,
    reps: defaults.reps,
    restSeconds: defaults.restSeconds
  };
}

export function normalizeCustomRoutine(candidate = {}) {
  const defaults = getDefaultCustomRoutine();
  const level = Object.hasOwn(LEVELS, candidate.level) ? candidate.level : defaults.level;
  const validMuscleIds = new Set(MUSCLES.map((muscle) => muscle.id));
  const targetMuscles = Array.isArray(candidate.targetMuscles)
    ? [...new Set(candidate.targetMuscles.filter((id) => validMuscleIds.has(id)))]
    : defaults.targetMuscles;
  const selectedEquipment = Array.isArray(candidate.selectedEquipment)
    ? [...new Set(candidate.selectedEquipment.filter((id) => typeof id === "string"))]
    : [];
  const items = Array.isArray(candidate.items) ? candidate.items.flatMap((item) => {
    const exercise = findExercise(item?.muscleId, item?.exerciseName);
    if (!exercise) return [];
    const defaultsForLevel = DEFAULTS_BY_LEVEL[level];
    return [{
      id: typeof item.id === "string" && item.id ? item.id : createId(),
      muscleId: item.muscleId,
      exerciseName: exercise.name,
      exerciseLevel: exercise.level,
      equipment: exercise.equipment,
      cue: exercise.cue,
      sets: boundedInteger(item.sets, defaultsForLevel.sets, 1, 12),
      reps: boundedInteger(item.reps, defaultsForLevel.reps, 1, 100),
      restSeconds: boundedInteger(item.restSeconds, defaultsForLevel.restSeconds, 0, 600)
    }];
  }) : [];

  return {
    name: typeof candidate.name === "string" && candidate.name.trim()
      ? candidate.name.trim().slice(0, 80)
      : defaults.name,
    level,
    targetMuscles,
    selectedEquipment,
    items
  };
}

export function estimateRoutineMinutes(items = []) {
  const workingSeconds = items.reduce((total, item) => {
    const sets = boundedInteger(item.sets, 1, 1, 12);
    const reps = boundedInteger(item.reps, 1, 1, 100);
    const restSeconds = boundedInteger(item.restSeconds, 0, 0, 600);
    const repetitionSeconds = Math.min(180, reps * 4);
    return total + sets * repetitionSeconds + Math.max(0, sets - 1) * restSeconds + 75;
  }, 0);
  return items.length ? Math.max(5, Math.round(workingSeconds / 60)) : 0;
}

export function analyzeRoutine(routine) {
  const normalized = normalizeCustomRoutine(routine);
  const findings = [];
  const totalSets = normalized.items.reduce((sum, item) => sum + item.sets, 0);
  const estimatedMinutes = estimateRoutineMinutes(normalized.items);
  const setsByMuscle = new Map(normalized.targetMuscles.map((id) => [id, 0]));
  const exercisesByMuscle = new Map(normalized.targetMuscles.map((id) => [id, 0]));

  normalized.items.forEach((item) => {
    setsByMuscle.set(item.muscleId, (setsByMuscle.get(item.muscleId) ?? 0) + item.sets);
    exercisesByMuscle.set(item.muscleId, (exercisesByMuscle.get(item.muscleId) ?? 0) + 1);
  });

  if (normalized.targetMuscles.length === 0) {
    findings.push({
      id: "no-targets",
      tone: "incomplete",
      title: "Choose target muscles",
      message: "The review needs at least one target muscle to measure session coverage."
    });
  }

  normalized.targetMuscles.forEach((muscleId) => {
    const muscle = getMuscle(muscleId);
    const sets = setsByMuscle.get(muscleId) ?? 0;
    if (sets === 0) {
      findings.push({
        id: `missing-${muscleId}`,
        tone: "caution",
        title: `No direct ${muscle.name.toLowerCase()} work`,
        message: `${muscle.name} is selected as a target but has no exercise in this session.`
      });
    } else if (sets < 2) {
      findings.push({
        id: `light-${muscleId}`,
        tone: "caution",
        title: `Light ${muscle.name.toLowerCase()} coverage`,
        message: "One working set can be useful, but two or three sets are a common general-fitness starting point."
      });
    }
  });

  if (normalized.items.length > 10 || totalSets > 30 || estimatedMinutes > 120) {
    findings.push({
      id: "long-session",
      tone: "caution",
      title: "Large single-session workload",
      message: `${normalized.items.length} exercises and ${totalSets} working sets may make quality and focus harder to maintain in one sitting.`
    });
  }

  setsByMuscle.forEach((sets, muscleId) => {
    const muscle = getMuscle(muscleId);
    if (sets > 10) {
      findings.push({
        id: `high-volume-${muscleId}`,
        tone: "caution",
        title: `High ${muscle.name.toLowerCase()} volume`,
        message: `${sets} direct sets in one sitting is concentrated work. Check whether fewer high-quality sets would meet the same goal.`
      });
    }
    if ((exercisesByMuscle.get(muscleId) ?? 0) > 4) {
      findings.push({
        id: `many-variations-${muscleId}`,
        tone: "caution",
        title: `Many ${muscle.name.toLowerCase()} variations`,
        message: "More than four exercises for one muscle may add repetition without adding much useful variety."
      });
    }
  });

  normalized.items.forEach((item) => {
    if (item.sets > 5) {
      findings.push({
        id: `sets-${item.id}`,
        tone: "caution",
        title: `Check sets for ${item.exerciseName}`,
        message: `${item.sets} sets is above the common two-to-three-set general-fitness range. Make sure the extra volume is intentional.`
      });
    }
    if (item.reps > 30) {
      findings.push({
        id: `reps-${item.id}`,
        tone: "caution",
        title: `Very high reps for ${item.exerciseName}`,
        message: `${item.reps} reps may shift the goal toward endurance and make technique harder to keep consistent.`
      });
    }
    if (LEVEL_ORDER.indexOf(item.exerciseLevel) > LEVEL_ORDER.indexOf(normalized.level)) {
      findings.push({
        id: `level-${item.id}`,
        tone: "caution",
        title: `${item.exerciseName} exceeds the selected level`,
        message: `This exercise is listed as ${LEVELS[item.exerciseLevel].label.toLowerCase()} while the routine is set to ${LEVELS[normalized.level].label.toLowerCase()}.`
      });
    }
  });

  const duplicateCounts = new Map();
  normalized.items.forEach((item) => {
    const key = `${item.muscleId}:${item.exerciseName.toLowerCase()}`;
    duplicateCounts.set(key, (duplicateCounts.get(key) ?? 0) + 1);
  });
  duplicateCounts.forEach((count, key) => {
    if (count < 2) return;
    const [muscleId] = key.split(":");
    const item = normalized.items.find((candidate) => `${candidate.muscleId}:${candidate.exerciseName.toLowerCase()}` === key);
    findings.push({
      id: `duplicate-${key}`,
      tone: "caution",
      title: `Repeated ${item.exerciseName}`,
      message: `The same ${getMuscle(muscleId).name.toLowerCase()} exercise appears ${count} times. Combine the sets unless the repeats serve a specific purpose.`
    });
  });

  if (normalized.targetMuscles.length > 1) {
    const compatibleSplit = SPLITS.some((split) => normalized.targetMuscles.every((id) => split.muscles.includes(id)));
    if (!compatibleSplit) {
      findings.push({
        id: "mixed-focus",
        tone: "caution",
        title: "Mixed session focus",
        message: "These targets do not fit one of the app's established training groups. The combination can still be valid, but may be easier to organize across separate sessions."
      });
    }
  }

  const cautionCount = findings.filter((finding) => finding.tone === "caution").length;
  return {
    findings,
    cautionCount,
    totalExercises: normalized.items.length,
    totalSets,
    estimatedMinutes,
    setsByMuscle: Object.fromEntries(setsByMuscle)
  };
}
