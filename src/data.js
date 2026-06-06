export const LEVELS = {
  beginner: {
    label: "Beginner",
    sets: "2-3",
    reps: "8-12",
    rest: "75-90 sec",
    note: "Controlled tempo, lighter loads, and clean reps.",
    exerciseCount: 2
  },
  intermediate: {
    label: "Intermediate",
    sets: "3-4",
    reps: "8-15",
    rest: "60-90 sec",
    note: "Moderate loads with one or two reps left in reserve.",
    exerciseCount: 3
  },
  expert: {
    label: "Expert",
    sets: "4-5",
    reps: "6-15",
    rest: "45-120 sec",
    note: "Higher volume, heavier top sets, and precise recovery.",
    exerciseCount: 3
  }
};

export const MUSCLES = [
  {
    id: "chest",
    name: "Chest",
    region: "Push",
    color: "#e25555",
    role: "Pressing strength and shoulder horizontal adduction.",
    exercises: [
      { name: "Incline Push-Up", level: "beginner", equipment: "Bench", cue: "Keep ribs down and lower under control." },
      { name: "Dumbbell Bench Press", level: "intermediate", equipment: "Dumbbells", cue: "Let elbows travel about 45 degrees from the torso." },
      { name: "Cable Fly", level: "intermediate", equipment: "Cable", cue: "Reach wide, then close the arms without shrugging." },
      { name: "Paused Barbell Bench Press", level: "expert", equipment: "Barbell", cue: "Pause on the chest and drive evenly through both hands." }
    ]
  },
  {
    id: "shoulders",
    name: "Shoulders",
    region: "Push",
    color: "#f28d35",
    role: "Overhead pressing, arm elevation, and shoulder stability.",
    exercises: [
      { name: "Wall Slide", level: "beginner", equipment: "Wall", cue: "Slide slowly while keeping the back of the ribs quiet." },
      { name: "Dumbbell Lateral Raise", level: "beginner", equipment: "Dumbbells", cue: "Lead with elbows and stop around shoulder height." },
      { name: "Seated Dumbbell Press", level: "intermediate", equipment: "Dumbbells", cue: "Press up without flaring the ribs." },
      { name: "Half-Kneeling Landmine Press", level: "expert", equipment: "Landmine", cue: "Brace hard and finish with the biceps near the ear." }
    ]
  },
  {
    id: "triceps",
    name: "Triceps",
    region: "Push",
    color: "#df6a9c",
    role: "Elbow extension and lockout strength.",
    exercises: [
      { name: "Bench Dip", level: "beginner", equipment: "Bench", cue: "Keep shoulders down and elbows tracking back." },
      { name: "Cable Pressdown", level: "beginner", equipment: "Cable", cue: "Pin elbows by the ribs and finish fully." },
      { name: "Overhead Dumbbell Extension", level: "intermediate", equipment: "Dumbbell", cue: "Let the elbows bend deeply without arching." },
      { name: "Close-Grip Bench Press", level: "expert", equipment: "Barbell", cue: "Use a narrow grip and press through a steady bar path." }
    ]
  },
  {
    id: "biceps",
    name: "Biceps",
    region: "Pull",
    color: "#4ea1d3",
    role: "Elbow flexion and forearm supination.",
    exercises: [
      { name: "Band Curl", level: "beginner", equipment: "Band", cue: "Keep upper arms still and squeeze at the top." },
      { name: "Alternating Dumbbell Curl", level: "beginner", equipment: "Dumbbells", cue: "Rotate the palm up as the weight rises." },
      { name: "Incline Dumbbell Curl", level: "intermediate", equipment: "Dumbbells", cue: "Start each rep from a long arm position." },
      { name: "Weighted Chin-Up", level: "expert", equipment: "Pull-up bar", cue: "Pull chest toward the bar without craning the neck." }
    ]
  },
  {
    id: "forearms",
    name: "Forearms",
    region: "Pull",
    color: "#68bfa3",
    role: "Grip endurance, wrist control, and loaded carries.",
    exercises: [
      { name: "Farmer Carry", level: "beginner", equipment: "Dumbbells", cue: "Walk tall and keep the handles quiet." },
      { name: "Wrist Curl", level: "beginner", equipment: "Dumbbell", cue: "Move through the wrist, not the shoulder." },
      { name: "Reverse Curl", level: "intermediate", equipment: "EZ bar", cue: "Use a smooth path and avoid swinging." },
      { name: "Towel Pull-Up Hang", level: "expert", equipment: "Towel", cue: "Crush the towel and keep shoulder blades engaged." }
    ]
  },
  {
    id: "lats",
    name: "Lats",
    region: "Pull",
    color: "#3578bf",
    role: "Vertical pulling, shoulder extension, and torso width.",
    exercises: [
      { name: "Band Lat Pulldown", level: "beginner", equipment: "Band", cue: "Drive elbows toward the ribs." },
      { name: "Assisted Pull-Up", level: "beginner", equipment: "Machine or band", cue: "Start each rep with shoulder blades set." },
      { name: "Single-Arm Cable Row", level: "intermediate", equipment: "Cable", cue: "Pull the elbow toward the back pocket." },
      { name: "Weighted Pull-Up", level: "expert", equipment: "Pull-up bar", cue: "Own the bottom and keep reps crisp." }
    ]
  },
  {
    id: "traps",
    name: "Traps",
    region: "Pull",
    color: "#6b67c8",
    role: "Scapular elevation, upward rotation, and upper-back posture.",
    exercises: [
      { name: "Prone Y Raise", level: "beginner", equipment: "Bench", cue: "Reach long without shrugging hard." },
      { name: "Dumbbell Shrug", level: "beginner", equipment: "Dumbbells", cue: "Lift straight up and pause briefly." },
      { name: "Face Pull", level: "intermediate", equipment: "Cable", cue: "Pull toward the eyes with elbows high." },
      { name: "Snatch-Grip High Pull", level: "expert", equipment: "Barbell", cue: "Explode vertically and keep the bar close." }
    ]
  },
  {
    id: "neck",
    name: "Neck",
    region: "Upper Support",
    color: "#9c6fcb",
    role: "Neck control, posture, and resilience for upper-body training.",
    exercises: [
      { name: "Chin Tuck", level: "beginner", equipment: "Floor or wall", cue: "Glide the chin straight back without tipping the head." },
      { name: "Neck Isometric Hold", level: "beginner", equipment: "Hand resistance", cue: "Press gently in each direction while the head stays still." },
      { name: "Prone Neck Extension", level: "intermediate", equipment: "Bench", cue: "Lift the head to neutral and avoid craning upward." },
      { name: "Band Neck Rotation", level: "intermediate", equipment: "Band", cue: "Rotate slowly through a comfortable range." },
      { name: "Harness Neck Extension", level: "expert", equipment: "Neck harness", cue: "Use light load and smooth reps with no jerking." }
    ]
  },
  {
    id: "lowerBack",
    name: "Lower Back",
    region: "Core / Pull",
    color: "#8b6f47",
    role: "Spinal endurance, hip hinging, and trunk stiffness.",
    exercises: [
      { name: "Bird Dog", level: "beginner", equipment: "Mat", cue: "Reach long and keep hips level." },
      { name: "Back Extension", level: "beginner", equipment: "Roman chair", cue: "Move from the hips and stop at neutral." },
      { name: "Romanian Deadlift", level: "intermediate", equipment: "Barbell", cue: "Hinge back until hamstrings load." },
      { name: "Deficit Deadlift", level: "expert", equipment: "Barbell", cue: "Brace before each pull and keep the floor push steady." }
    ]
  },
  {
    id: "abs",
    name: "Abs",
    region: "Core",
    color: "#f0bd39",
    role: "Trunk flexion, bracing, and anti-extension.",
    exercises: [
      { name: "Dead Bug", level: "beginner", equipment: "Mat", cue: "Exhale as the leg reaches away." },
      { name: "Front Plank", level: "beginner", equipment: "Mat", cue: "Squeeze glutes and keep the body long." },
      { name: "Cable Crunch", level: "intermediate", equipment: "Cable", cue: "Curl ribs toward pelvis without sitting back." },
      { name: "Ab Wheel Rollout", level: "expert", equipment: "Ab wheel", cue: "Reach only as far as you can return from cleanly." }
    ]
  },
  {
    id: "obliques",
    name: "Obliques",
    region: "Core",
    color: "#d49b2a",
    role: "Rotation, side bending, and anti-rotation control.",
    exercises: [
      { name: "Side Plank", level: "beginner", equipment: "Mat", cue: "Stack shoulders and hips." },
      { name: "Pallof Press", level: "beginner", equipment: "Cable or band", cue: "Press straight out without twisting." },
      { name: "Cable Wood Chop", level: "intermediate", equipment: "Cable", cue: "Rotate through the torso with steady hips." },
      { name: "Suitcase Carry", level: "expert", equipment: "Kettlebell", cue: "Walk tall and resist leaning." }
    ]
  },
  {
    id: "glutes",
    name: "Glutes",
    region: "Legs",
    color: "#b35fa3",
    role: "Hip extension, pelvic control, and powerful lower-body drive.",
    exercises: [
      { name: "Glute Bridge", level: "beginner", equipment: "Mat", cue: "Tuck pelvis slightly and squeeze at the top." },
      { name: "Step-Up", level: "beginner", equipment: "Box", cue: "Drive through the whole foot on the box." },
      { name: "Barbell Hip Thrust", level: "intermediate", equipment: "Barbell", cue: "Pause at lockout with ribs stacked." },
      { name: "Bulgarian Split Squat", level: "expert", equipment: "Dumbbells", cue: "Stay balanced and use a full range." }
    ]
  },
  {
    id: "quads",
    name: "Quads",
    region: "Legs",
    color: "#56a05a",
    role: "Knee extension, squatting, and deceleration.",
    exercises: [
      { name: "Box Squat", level: "beginner", equipment: "Box", cue: "Sit back lightly, then stand with control." },
      { name: "Goblet Squat", level: "beginner", equipment: "Dumbbell", cue: "Keep knees tracking over toes." },
      { name: "Front Squat", level: "intermediate", equipment: "Barbell", cue: "Keep elbows high and torso tall." },
      { name: "Heel-Elevated Cyclist Squat", level: "expert", equipment: "Wedge", cue: "Use a deep knee bend and smooth tempo." }
    ]
  },
  {
    id: "hamstrings",
    name: "Hamstrings",
    region: "Legs",
    color: "#2f9b85",
    role: "Knee flexion, hip extension, and sprint mechanics.",
    exercises: [
      { name: "Stability Ball Leg Curl", level: "beginner", equipment: "Ball", cue: "Lift hips before curling the heels in." },
      { name: "Dumbbell Romanian Deadlift", level: "beginner", equipment: "Dumbbells", cue: "Push hips back while keeping shins quiet." },
      { name: "Seated Leg Curl", level: "intermediate", equipment: "Machine", cue: "Pause in the shortened position." },
      { name: "Nordic Hamstring Curl", level: "expert", equipment: "Anchor", cue: "Lower slowly and catch yourself cleanly." }
    ]
  },
  {
    id: "calves",
    name: "Calves",
    region: "Legs",
    color: "#7ab648",
    role: "Ankle extension, gait power, and lower-leg resilience.",
    exercises: [
      { name: "Standing Calf Raise", level: "beginner", equipment: "Step", cue: "Use a full stretch and a high finish." },
      { name: "Seated Calf Raise", level: "beginner", equipment: "Machine", cue: "Pause at the bottom and top." },
      { name: "Single-Leg Calf Raise", level: "intermediate", equipment: "Step", cue: "Keep the ankle moving straight." },
      { name: "Loaded Donkey Calf Raise", level: "expert", equipment: "Machine", cue: "Control the stretch before driving up." }
    ]
  },
  {
    id: "feetAnkles",
    name: "Feet & Ankles",
    region: "Legs",
    color: "#8f7bdc",
    role: "Foot strength, ankle mobility, balance, and lower-leg injury resilience.",
    exercises: [
      { name: "Toe Yoga", level: "beginner", equipment: "Floor", cue: "Lift the big toe without gripping the floor." },
      { name: "Ankle Alphabet", level: "beginner", equipment: "Floor", cue: "Draw slow letters with the toes while the shin stays quiet." },
      { name: "Tibialis Raise", level: "intermediate", equipment: "Wall", cue: "Lift the toes toward the shins and lower with control." },
      { name: "Single-Leg Balance Reach", level: "intermediate", equipment: "Floor", cue: "Keep the arch active as the free foot reaches." },
      { name: "Band Resisted Ankle Eversion", level: "expert", equipment: "Band", cue: "Move from the ankle and avoid rolling the knee outward." }
    ]
  }
];

export const SPLITS = [
  {
    id: "push",
    name: "Push",
    description: "Chest, shoulders, and triceps share pressing patterns.",
    muscles: ["chest", "shoulders", "triceps"]
  },
  {
    id: "pull",
    name: "Pull",
    description: "Back, biceps, forearms, traps, neck, and lower back pair well around pulling, posture, and hinging.",
    muscles: ["lats", "traps", "biceps", "forearms", "lowerBack", "neck"]
  },
  {
    id: "legs",
    name: "Legs",
    description: "Quads, hamstrings, glutes, calves, feet, and ankles work together in lower-body sessions.",
    muscles: ["quads", "hamstrings", "glutes", "calves", "feetAnkles"]
  },
  {
    id: "core",
    name: "Core",
    description: "Abs, obliques, and lower back build trunk stiffness from every side.",
    muscles: ["abs", "obliques", "lowerBack"]
  },
  {
    id: "arms",
    name: "Arms",
    description: "Biceps, triceps, forearms, and shoulders can sit together as an accessory day.",
    muscles: ["biceps", "triceps", "forearms", "shoulders"]
  },
  {
    id: "upperSupport",
    name: "Upper Support",
    description: "Neck, traps, and shoulders train well together for posture and upper-body support.",
    muscles: ["neck", "traps", "shoulders"]
  }
];

const levelOrder = ["beginner", "intermediate", "expert"];

export function getMuscle(id) {
  return MUSCLES.find((muscle) => muscle.id === id);
}

export function getExercisePool(muscleId, level) {
  const muscle = getMuscle(muscleId);
  const maxLevel = levelOrder.indexOf(level);
  return muscle.exercises.filter((exercise) => levelOrder.indexOf(exercise.level) <= maxLevel);
}

export function getCompatibleSplitIds(selectedMuscles) {
  if (selectedMuscles.length === 0) {
    return SPLITS.map((split) => split.id);
  }

  return SPLITS
    .filter((split) => selectedMuscles.every((muscleId) => split.muscles.includes(muscleId)))
    .map((split) => split.id);
}

export function getAllowedMuscleIds(selectedMuscles) {
  const compatibleSplitIds = getCompatibleSplitIds(selectedMuscles);
  return new Set(
    SPLITS
      .filter((split) => compatibleSplitIds.includes(split.id))
      .flatMap((split) => split.muscles)
  );
}

export function getActiveSplits(selectedMuscles) {
  const compatibleSplitIds = getCompatibleSplitIds(selectedMuscles);
  return SPLITS.filter((split) => compatibleSplitIds.includes(split.id));
}
