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

const animationProfiles = {
  inclinePushUp: {
    pattern: "press",
    label: "Incline Push-Up",
    setup: "Place both hands on the front edge of the bench and step the feet back into a straight plank.",
    motion: "Lower the chest toward the bench by bending the elbows, then press the body away as one line.",
    focus: "Keep the hips from sagging and keep the bench under the hands."
  },
  benchPressDumbbell: {
    pattern: "press",
    label: "Dumbbell Bench Press",
    setup: "Lie face up on the bench with a dumbbell in each hand beside the chest.",
    motion: "Press the dumbbells up over the chest, then lower them in a controlled arc.",
    focus: "Keep the wrists over the elbows and the weights directly above the upper torso."
  },
  benchPressBarbell: {
    pattern: "press",
    label: "Barbell Bench Press",
    setup: "Lie face up on the bench with the bar over the chest and hands set evenly.",
    motion: "Lower the bar to the chest, pause, then press it back over the shoulders.",
    focus: "Keep the bar close to a vertical path over the chest instead of drifting toward the face."
  },
  cableFly: {
    pattern: "raise",
    label: "Cable Fly",
    setup: "Stand between the cable columns with the handles out wide and elbows softly bent.",
    motion: "Sweep the hands together in front of the chest, then return along the same arc.",
    focus: "Keep the elbow bend mostly fixed so the motion comes from the shoulders."
  },
  wallSlide: {
    pattern: "raise",
    label: "Wall Slide",
    setup: "Stand with the back, head, elbows, wrists, and hands close to the wall in a goalpost shape.",
    motion: "Slide the arms upward along the wall toward overhead, then return to the goalpost position.",
    focus: "Keep the ribs down and keep the arms traveling on the wall."
  },
  lateralRaise: {
    pattern: "raise",
    label: "Lateral Raise",
    setup: "Stand tall with dumbbells at the sides and a slight, fixed bend in the elbows.",
    motion: "Raise the elbows and hands out to the sides until they reach shoulder height, then lower.",
    focus: "Lead with the elbows and avoid turning it into a shrug."
  },
  seatedOverheadPress: {
    pattern: "press",
    label: "Seated Overhead Press",
    setup: "Sit tall on the bench with dumbbells at shoulder height.",
    motion: "Press the dumbbells overhead, then lower them back to the shoulders.",
    focus: "Keep the ribs stacked over the pelvis while the weights move vertically."
  },
  landminePress: {
    pattern: "press",
    label: "Half-Kneeling Landmine Press",
    setup: "Kneel with one knee down and hold the end of the angled bar near the shoulder.",
    motion: "Press the bar up and forward on its diagonal path, then return it to the shoulder.",
    focus: "Let the bar rotate around the floor anchor instead of moving like a straight overhead press."
  },
  benchDip: {
    pattern: "press",
    label: "Bench Dip",
    setup: "Face away from the bench with hands on the bench edge behind the hips and heels on the floor.",
    motion: "Lower the hips by bending the elbows back, then press up by extending the elbows.",
    focus: "Keep the bench behind the body and keep the elbows pointing backward."
  },
  cablePressdown: {
    pattern: "press",
    label: "Cable Pressdown",
    setup: "Stand at a high cable with elbows pinned beside the ribs and forearms angled upward.",
    motion: "Extend the elbows to press the handle down, then let the forearms return upward.",
    focus: "Keep the upper arms still while the cable runs from the high pulley to the hands."
  },
  overheadTricepsExtension: {
    pattern: "press",
    label: "Overhead Extension",
    setup: "Hold one dumbbell overhead with both hands and elbows pointing upward.",
    motion: "Bend the elbows to lower the dumbbell behind the head, then extend back overhead.",
    focus: "Keep the upper arms near the ears instead of letting the elbows flare wide."
  },
  closeGripBenchPress: {
    pattern: "press",
    label: "Close-Grip Bench Press",
    setup: "Lie on the bench with the bar over the lower chest and hands closer than shoulder width.",
    motion: "Lower the bar with elbows tucked, then press it back to lockout.",
    focus: "Show a narrower hand position than the regular bench press."
  },
  bandCurl: {
    pattern: "curl",
    label: "Band Curl",
    setup: "Stand on the band with both handles in the hands and upper arms still.",
    motion: "Curl the hands toward the shoulders, then lower against the band's pull.",
    focus: "Keep the band anchored under the feet."
  },
  dumbbellCurl: {
    pattern: "curl",
    label: "Dumbbell Curl",
    setup: "Stand tall with dumbbells at the sides and elbows close to the ribs.",
    motion: "Curl the weights upward, then lower them under control.",
    focus: "Keep the elbows from drifting forward."
  },
  inclineDumbbellCurl: {
    pattern: "curl",
    label: "Incline Dumbbell Curl",
    setup: "Recline on an inclined bench with arms hanging slightly behind the torso.",
    motion: "Curl the dumbbells up without moving the upper arms, then return to the long-arm start.",
    focus: "The bench should support the back while the arms start behind the body."
  },
  reverseCurl: {
    pattern: "curl",
    label: "Reverse Curl",
    setup: "Hold the EZ bar with palms facing down and elbows beside the ribs.",
    motion: "Curl the bar upward while keeping the wrists straight, then lower.",
    focus: "Keep the bar in front of the body and the forearms doing the work."
  },
  pullUp: {
    pattern: "pull",
    label: "Pull-Up",
    setup: "Hang from the pull-up bar with arms long and feet off the floor.",
    motion: "Pull the chest toward the bar by driving the elbows down, then lower under control.",
    focus: "Keep the bar fixed above the body."
  },
  chinUp: {
    pattern: "pull",
    label: "Chin-Up",
    setup: "Hang from the bar with an underhand grip and arms long.",
    motion: "Pull the chest toward the bar, then lower back to a full hang.",
    focus: "Show the body moving up toward a fixed overhead bar."
  },
  towelHang: {
    pattern: "carry",
    label: "Towel Hang",
    setup: "Loop a towel over the pull-up bar and grip both sides while hanging.",
    motion: "Hold the hang while the shoulders stay active and the body remains long.",
    focus: "The towel should hang from the bar and the hands should stay on it."
  },
  farmerCarry: {
    pattern: "carry",
    label: "Farmer Carry",
    setup: "Stand tall with dumbbells held at the sides.",
    motion: "Walk with small alternating steps while keeping the weights quiet.",
    focus: "Keep the weights beside the thighs and the shoulders level."
  },
  suitcaseCarry: {
    pattern: "carry",
    label: "Suitcase Carry",
    setup: "Hold one kettlebell at one side with the body tall and square.",
    motion: "Walk without leaning toward the weight.",
    focus: "Show one-sided loading so the trunk has to resist side bend."
  },
  wristCurl: {
    pattern: "curl",
    label: "Wrist Curl",
    setup: "Support the forearm on the bench with the hand holding a dumbbell past the edge.",
    motion: "Curl the wrist up and lower it through a small controlled range.",
    focus: "Only the hand and wrist should move."
  },
  latPulldown: {
    pattern: "pull",
    label: "Lat Pulldown",
    setup: "Anchor the band or machine high overhead with hands reaching up.",
    motion: "Pull the elbows down toward the ribs, then return to the overhead reach.",
    focus: "Keep the cable or band coming from above."
  },
  cableRow: {
    pattern: "pull",
    label: "Single-Arm Cable Row",
    setup: "Face the low cable with one arm reaching forward.",
    motion: "Pull the handle toward the ribs, then reach forward again.",
    focus: "Use a low cable path from the column to the working hand."
  },
  proneYRaise: {
    pattern: "raise",
    label: "Prone Y Raise",
    setup: "Lie chest-down on an incline bench with arms reaching in a Y shape.",
    motion: "Lift the arms slightly above the bench, then lower with control.",
    focus: "The bench supports the torso while the arms move diagonally overhead."
  },
  shrug: {
    pattern: "raise",
    label: "Dumbbell Shrug",
    setup: "Stand tall with dumbbells hanging beside the thighs.",
    motion: "Lift the shoulders straight up, pause, then lower.",
    focus: "The arms stay long while the shoulders do the movement."
  },
  facePull: {
    pattern: "pull",
    label: "Face Pull",
    setup: "Stand facing a cable set near face height with arms reaching forward.",
    motion: "Pull the handle toward the face with elbows high, then return.",
    focus: "The cable should run from the face-height pulley to the hands."
  },
  highPull: {
    pattern: "pull",
    label: "High Pull",
    setup: "Hold the barbell in front of the thighs with a wide grip.",
    motion: "Drive the bar upward close to the body with elbows rising high.",
    focus: "Show the bar traveling vertically close to the torso."
  },
  chinTuck: {
    pattern: "neck",
    label: "Chin Tuck",
    setup: "Lie or stand with the head neutral and the chin gently drawn in.",
    motion: "Glide the chin straight back, pause, then release.",
    focus: "The head should translate back instead of tipping up or down."
  },
  neckIsometric: {
    pattern: "neck",
    label: "Neck Isometric",
    setup: "Place one hand against the head while the neck stays neutral.",
    motion: "Press lightly into the hand without letting the head move.",
    focus: "Show resistance at the head with almost no visible neck motion."
  },
  proneNeckExtension: {
    pattern: "neck",
    label: "Prone Neck Extension",
    setup: "Lie face down on a bench with the head just beyond the edge.",
    motion: "Lift the head to neutral, then lower slightly.",
    focus: "The bench supports the body while the neck moves gently."
  },
  bandNeckRotation: {
    pattern: "neck",
    label: "Band Neck Rotation",
    setup: "Attach a band to the side of the head from a side anchor.",
    motion: "Rotate the head slowly against the band and return.",
    focus: "Keep the band connected to the head from the side."
  },
  harnessNeckExtension: {
    pattern: "neck",
    label: "Harness Neck Extension",
    setup: "Attach the neck harness while hinged forward or supported on a bench.",
    motion: "Extend the neck gently against the harness load, then lower.",
    focus: "Keep the harness around the head and use a very small range."
  },
  birdDog: {
    pattern: "core",
    label: "Bird Dog",
    setup: "Start on hands and knees on the mat.",
    motion: "Reach one arm forward and the opposite leg backward, then switch sides.",
    focus: "Keep the hips level while opposite limbs move."
  },
  backExtension: {
    pattern: "hinge",
    label: "Back Extension",
    setup: "Set the hips on the roman chair pad with the feet anchored.",
    motion: "Hinge the torso down, then extend back to a straight line.",
    focus: "Move around the hips rather than overextending the low back."
  },
  romanianDeadlift: {
    pattern: "hinge",
    label: "Romanian Deadlift",
    setup: "Stand with the bar or dumbbells close to the thighs and knees softly bent.",
    motion: "Hinge the hips back while the load slides close to the legs, then stand tall.",
    focus: "The load should stay close to the body through the hinge."
  },
  deadlift: {
    pattern: "hinge",
    label: "Deadlift",
    setup: "Start with the bar on the floor close to the shins.",
    motion: "Push the floor away and stand with the bar close, then return it to the floor.",
    focus: "Show the bar starting lower than a Romanian deadlift."
  },
  deadBug: {
    pattern: "core",
    label: "Dead Bug",
    setup: "Lie face up with arms reaching to the ceiling and hips and knees bent to 90 degrees.",
    motion: "Extend the opposite arm and leg away, then return and switch sides.",
    focus: "Keep the back position steady while opposite limbs move."
  },
  frontPlank: {
    pattern: "core",
    label: "Front Plank",
    setup: "Hold a forearm plank with elbows under shoulders and body long.",
    motion: "Maintain the hold with small breathing motion.",
    focus: "The body should stay straight from head to heels."
  },
  cableCrunch: {
    pattern: "core",
    label: "Cable Crunch",
    setup: "Kneel facing the cable with the high pulley above the head.",
    motion: "Curl the ribs toward the pelvis, then return to tall kneeling.",
    focus: "The cable should run from overhead to the hands near the head."
  },
  abWheelRollout: {
    pattern: "core",
    label: "Ab Wheel Rollout",
    setup: "Kneel on the mat with both hands on the ab wheel under the shoulders.",
    motion: "Roll the wheel forward while the body lengthens, then pull it back.",
    focus: "Keep the wheel on the floor in front of the knees."
  },
  sidePlank: {
    pattern: "core",
    label: "Side Plank",
    setup: "Stack the feet and support the body on one forearm.",
    motion: "Hold the side plank with a steady trunk.",
    focus: "Shoulders, hips, and ankles should form one long line."
  },
  pallofPress: {
    pattern: "core",
    label: "Pallof Press",
    setup: "Stand sideways to the cable or band anchor with hands at the chest.",
    motion: "Press the hands straight out from the chest, then return.",
    focus: "The cable or band should pull from the side while the torso resists rotation."
  },
  woodChop: {
    pattern: "core",
    label: "Cable Wood Chop",
    setup: "Stand beside the cable with the handle high and to one side.",
    motion: "Move the hands diagonally across the body toward the opposite hip.",
    focus: "Show a high-to-low diagonal cable path."
  },
  gluteBridge: {
    pattern: "hinge",
    label: "Glute Bridge",
    setup: "Lie on the mat with knees bent and feet flat.",
    motion: "Lift the hips until the torso and thighs line up, then lower.",
    focus: "Keep the feet planted while the hips move."
  },
  stepUp: {
    pattern: "squat",
    label: "Step-Up",
    setup: "Place one foot fully on the box with the other foot on the floor.",
    motion: "Drive through the box foot to stand tall, then step back down.",
    focus: "The box should sit under the working foot."
  },
  hipThrust: {
    pattern: "hinge",
    label: "Barbell Hip Thrust",
    setup: "Rest the upper back on the bench with the bar across the hips.",
    motion: "Drive the hips up to lockout, then lower under control.",
    focus: "Keep the bench behind the shoulders and the bar over the hips."
  },
  splitSquat: {
    pattern: "squat",
    label: "Bulgarian Split Squat",
    setup: "Place the rear foot on the bench and hold dumbbells at the sides.",
    motion: "Lower the back knee toward the floor, then drive up through the front foot.",
    focus: "Show the rear foot elevated behind the body."
  },
  boxSquat: {
    pattern: "squat",
    label: "Box Squat",
    setup: "Stand in front of the box with feet planted.",
    motion: "Sit back to lightly touch the box, then stand.",
    focus: "Keep the box behind the hips."
  },
  gobletSquat: {
    pattern: "squat",
    label: "Goblet Squat",
    setup: "Hold one dumbbell upright against the chest.",
    motion: "Squat down with the weight at chest height, then stand.",
    focus: "Keep the front-loaded weight close to the torso."
  },
  frontSquat: {
    pattern: "squat",
    label: "Front Squat",
    setup: "Hold the barbell in the front rack across the shoulders.",
    motion: "Squat down with an upright torso, then drive back up.",
    focus: "The bar should stay at the front of the shoulders."
  },
  cyclistSquat: {
    pattern: "squat",
    label: "Heel-Elevated Squat",
    setup: "Stand with both heels on the wedge and torso tall.",
    motion: "Bend the knees deeply over the toes, then stand.",
    focus: "Keep the wedge under the heels throughout."
  },
  ballLegCurl: {
    pattern: "squat",
    label: "Stability Ball Leg Curl",
    setup: "Lie face up with heels on the ball and hips lifted.",
    motion: "Curl the ball toward the hips by bending the knees, then roll it away.",
    focus: "The ball should stay under the heels."
  },
  seatedLegCurl: {
    pattern: "squat",
    label: "Seated Leg Curl",
    setup: "Sit in the machine with the pad in front of the lower legs.",
    motion: "Bend the knees to pull the pad down and back, then return.",
    focus: "Show a seated body with lower legs moving around the knee."
  },
  nordicCurl: {
    pattern: "squat",
    label: "Nordic Hamstring Curl",
    setup: "Kneel with the ankles anchored behind the body.",
    motion: "Lower the straight torso forward from the knees, then pull back up.",
    focus: "The feet should remain fixed while the body pivots forward."
  },
  standingCalfRaise: {
    pattern: "calf",
    label: "Standing Calf Raise",
    setup: "Stand with the balls of the feet on the step and heels free.",
    motion: "Rise onto the toes, then lower the heels into a stretch.",
    focus: "The step should sit under the forefoot."
  },
  seatedCalfRaise: {
    pattern: "calf",
    label: "Seated Calf Raise",
    setup: "Sit in the machine with knees bent and the pad over the thighs.",
    motion: "Raise the heels, pause, then lower.",
    focus: "Show bent knees to distinguish it from a standing calf raise."
  },
  singleLegCalfRaise: {
    pattern: "calf",
    label: "Single-Leg Calf Raise",
    setup: "Stand on one forefoot on the step while the other foot floats.",
    motion: "Rise and lower on the working ankle.",
    focus: "Only one foot should be loaded on the step."
  },
  donkeyCalfRaise: {
    pattern: "calf",
    label: "Donkey Calf Raise",
    setup: "Hinge forward with the forefeet on the platform and load over the hips.",
    motion: "Raise and lower the heels while the torso stays hinged.",
    focus: "Show the body bent forward instead of upright."
  },
  toeYoga: {
    pattern: "ankle",
    label: "Toe Yoga",
    setup: "Stand or sit with the foot flat on the floor.",
    motion: "Lift the big toe and other toes in small alternating motions.",
    focus: "Keep the foot on the floor and make the motion small."
  },
  ankleAlphabet: {
    pattern: "ankle",
    label: "Ankle Alphabet",
    setup: "Sit with one leg extended and the foot off the floor.",
    motion: "Trace small letters with the toes by moving the ankle.",
    focus: "The shin stays mostly still while the foot draws the shapes."
  },
  tibialisRaise: {
    pattern: "ankle",
    label: "Tibialis Raise",
    setup: "Lean the back against the wall with heels on the floor and toes lowered.",
    motion: "Lift the toes toward the shins, then lower.",
    focus: "Keep the heels planted while only the front of the feet lift."
  },
  balanceReach: {
    pattern: "ankle",
    label: "Single-Leg Balance Reach",
    setup: "Stand on one foot with the other foot ready to reach.",
    motion: "Reach the free foot forward and to the side while the stance foot stabilizes.",
    focus: "Keep the working foot rooted and the arch active."
  },
  ankleEversion: {
    pattern: "ankle",
    label: "Band Ankle Eversion",
    setup: "Sit with a band attached to the outside of the foot from a side anchor.",
    motion: "Turn the foot outward against the band, then return.",
    focus: "The band should connect to the foot, not the hands."
  }
};

const exerciseAnimationVariants = new Map([
  ["Incline Push-Up", "inclinePushUp"],
  ["Dumbbell Bench Press", "benchPressDumbbell"],
  ["Cable Fly", "cableFly"],
  ["Paused Barbell Bench Press", "benchPressBarbell"],
  ["Wall Slide", "wallSlide"],
  ["Dumbbell Lateral Raise", "lateralRaise"],
  ["Seated Dumbbell Press", "seatedOverheadPress"],
  ["Half-Kneeling Landmine Press", "landminePress"],
  ["Bench Dip", "benchDip"],
  ["Cable Pressdown", "cablePressdown"],
  ["Overhead Dumbbell Extension", "overheadTricepsExtension"],
  ["Close-Grip Bench Press", "closeGripBenchPress"],
  ["Band Curl", "bandCurl"],
  ["Alternating Dumbbell Curl", "dumbbellCurl"],
  ["Incline Dumbbell Curl", "inclineDumbbellCurl"],
  ["Weighted Chin-Up", "chinUp"],
  ["Farmer Carry", "farmerCarry"],
  ["Wrist Curl", "wristCurl"],
  ["Reverse Curl", "reverseCurl"],
  ["Towel Pull-Up Hang", "towelHang"],
  ["Band Lat Pulldown", "latPulldown"],
  ["Assisted Pull-Up", "pullUp"],
  ["Single-Arm Cable Row", "cableRow"],
  ["Weighted Pull-Up", "pullUp"],
  ["Prone Y Raise", "proneYRaise"],
  ["Dumbbell Shrug", "shrug"],
  ["Face Pull", "facePull"],
  ["Snatch-Grip High Pull", "highPull"],
  ["Chin Tuck", "chinTuck"],
  ["Neck Isometric Hold", "neckIsometric"],
  ["Prone Neck Extension", "proneNeckExtension"],
  ["Band Neck Rotation", "bandNeckRotation"],
  ["Harness Neck Extension", "harnessNeckExtension"],
  ["Bird Dog", "birdDog"],
  ["Back Extension", "backExtension"],
  ["Romanian Deadlift", "romanianDeadlift"],
  ["Deficit Deadlift", "deadlift"],
  ["Dead Bug", "deadBug"],
  ["Front Plank", "frontPlank"],
  ["Cable Crunch", "cableCrunch"],
  ["Ab Wheel Rollout", "abWheelRollout"],
  ["Side Plank", "sidePlank"],
  ["Pallof Press", "pallofPress"],
  ["Cable Wood Chop", "woodChop"],
  ["Suitcase Carry", "suitcaseCarry"],
  ["Glute Bridge", "gluteBridge"],
  ["Step-Up", "stepUp"],
  ["Barbell Hip Thrust", "hipThrust"],
  ["Bulgarian Split Squat", "splitSquat"],
  ["Box Squat", "boxSquat"],
  ["Goblet Squat", "gobletSquat"],
  ["Front Squat", "frontSquat"],
  ["Heel-Elevated Cyclist Squat", "cyclistSquat"],
  ["Stability Ball Leg Curl", "ballLegCurl"],
  ["Dumbbell Romanian Deadlift", "romanianDeadlift"],
  ["Seated Leg Curl", "seatedLegCurl"],
  ["Nordic Hamstring Curl", "nordicCurl"],
  ["Standing Calf Raise", "standingCalfRaise"],
  ["Seated Calf Raise", "seatedCalfRaise"],
  ["Single-Leg Calf Raise", "singleLegCalfRaise"],
  ["Loaded Donkey Calf Raise", "donkeyCalfRaise"],
  ["Toe Yoga", "toeYoga"],
  ["Ankle Alphabet", "ankleAlphabet"],
  ["Tibialis Raise", "tibialisRaise"],
  ["Single-Leg Balance Reach", "balanceReach"],
  ["Band Resisted Ankle Eversion", "ankleEversion"]
]);

function inferAnimationVariant(exercise) {
  const name = exercise.name.toLowerCase();
  const equipment = exercise.equipment.toLowerCase();

  if (/neck|chin tuck|harness/.test(name) || equipment.includes("neck harness")) return "neckIsometric";
  if (/toe|ankle|tibialis|balance/.test(name)) return "ankleAlphabet";
  if (/calf|donkey/.test(name)) return "standingCalfRaise";
  if (/carry/.test(name)) return "farmerCarry";
  if (/hang/.test(name)) return "towelHang";
  if (/plank/.test(name)) return "frontPlank";
  if (/bug/.test(name)) return "deadBug";
  if (/crunch/.test(name)) return "cableCrunch";
  if (/ab wheel|rollout/.test(name)) return "abWheelRollout";
  if (/wood chop/.test(name)) return "woodChop";
  if (/pallof/.test(name)) return "pallofPress";
  if (/deadlift|romanian/.test(name)) return "romanianDeadlift";
  if (/back extension/.test(name)) return "backExtension";
  if (/bridge/.test(name)) return "gluteBridge";
  if (/hip thrust/.test(name)) return "hipThrust";
  if (/step-up/.test(name)) return "stepUp";
  if (/split squat/.test(name)) return "splitSquat";
  if (/squat/.test(name)) return "gobletSquat";
  if (/leg curl|nordic/.test(name)) return "seatedLegCurl";
  if (/curl/.test(name)) return "dumbbellCurl";
  if (/wall slide/.test(name)) return "wallSlide";
  if (/shrug/.test(name)) return "shrug";
  if (/face pull/.test(name)) return "facePull";
  if (/raise/.test(name)) return "lateralRaise";
  if (/fly/.test(name)) return "cableFly";
  if (/pull|pulldown|row|chin-up/.test(name)) return "pullUp";
  if (/dip/.test(name)) return "benchDip";
  if (/press|push-up|extension/.test(name)) return "benchPressBarbell";

  return "inclinePushUp";
}

const equipmentNameMap = new Map([
  ["ab wheel", "Ab Wheel"],
  ["anchor", "Anchor"],
  ["ball", "Ball"],
  ["band", "Band"],
  ["barbell", "Barbell"],
  ["bench", "Bench"],
  ["box", "Box"],
  ["cable", "Cable"],
  ["dumbbell", "Dumbbells"],
  ["dumbbells", "Dumbbells"],
  ["ez bar", "EZ Bar"],
  ["floor", "Floor"],
  ["hand resistance", "Hand Resistance"],
  ["kettlebell", "Kettlebell"],
  ["landmine", "Landmine"],
  ["machine", "Machine"],
  ["mat", "Mat"],
  ["neck harness", "Neck Harness"],
  ["pull-up bar", "Pull-Up Bar"],
  ["roman chair", "Roman Chair"],
  ["step", "Step"],
  ["towel", "Towel"],
  ["wall", "Wall"],
  ["wedge", "Wedge"]
]);

function slugifyEquipment(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeEquipmentLabel(label) {
  const key = label.trim().toLowerCase();
  if (equipmentNameMap.has(key)) {
    return equipmentNameMap.get(key);
  }

  return key
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getExerciseEquipmentTypes(equipment) {
  return equipment
    .split(/\s+or\s+|,|\/|\+/i)
    .map(normalizeEquipmentLabel)
    .filter(Boolean)
    .map((label) => ({
      id: slugifyEquipment(label),
      label
    }));
}

export function getEquipmentOptions() {
  const options = new Map();

  MUSCLES.forEach((muscle) => {
    muscle.exercises.forEach((exercise) => {
      getExerciseEquipmentTypes(exercise.equipment).forEach((equipment) => {
        options.set(equipment.id, equipment.label);
      });
    });
  });

  return [...options.entries()]
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getEquipmentIdsForMuscles(muscleIds, level) {
  const maxLevel = level ? levelOrder.indexOf(level) : levelOrder.length - 1;
  const equipmentIds = new Set();

  muscleIds.forEach((muscleId) => {
    const muscle = getMuscle(muscleId);
    if (!muscle) return;

    muscle.exercises
      .filter((exercise) => levelOrder.indexOf(exercise.level) <= maxLevel)
      .forEach((exercise) => {
        getExerciseEquipmentTypes(exercise.equipment).forEach((equipment) => {
          equipmentIds.add(equipment.id);
        });
      });
  });

  return equipmentIds;
}

export function exerciseMatchesEquipment(exercise, selectedEquipmentIds = []) {
  if (selectedEquipmentIds.length === 0) {
    return true;
  }

  const exerciseEquipmentIds = getExerciseEquipmentTypes(exercise.equipment).map((equipment) => equipment.id);
  return exerciseEquipmentIds.some((equipmentId) => selectedEquipmentIds.includes(equipmentId));
}

export function getMuscle(id) {
  return MUSCLES.find((muscle) => muscle.id === id);
}

export function getExercisePool(muscleId, level, selectedEquipmentIds = []) {
  const muscle = getMuscle(muscleId);
  const maxLevel = levelOrder.indexOf(level);
  return muscle.exercises.filter(
    (exercise) => levelOrder.indexOf(exercise.level) <= maxLevel && exerciseMatchesEquipment(exercise, selectedEquipmentIds)
  );
}

export function getExerciseAnimation(exercise) {
  const variant = exerciseAnimationVariants.get(exercise.name) ?? inferAnimationVariant(exercise);
  const profile = animationProfiles[variant] ?? animationProfiles.inclinePushUp;

  return {
    variant,
    ...profile
  };
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

const animationProfiles = {
  inclinePushUp: {
    pattern: "press",
    label: "Incline Push-Up",
    setup: "Place both hands on the front edge of the bench and step the feet back into a straight plank.",
    motion: "Lower the chest toward the bench by bending the elbows, then press the body away as one line.",
    focus: "Keep the hips from sagging and keep the bench under the hands."
  },
  benchPressDumbbell: {
    pattern: "press",
    label: "Dumbbell Bench Press",
    setup: "Lie face up on the bench with a dumbbell in each hand beside the chest.",
    motion: "Press the dumbbells up over the chest, then lower them in a controlled arc.",
    focus: "Keep the wrists over the elbows and the weights directly above the upper torso."
  },
  benchPressBarbell: {
    pattern: "press",
    label: "Barbell Bench Press",
    setup: "Lie face up on the bench with the bar over the chest and hands set evenly.",
    motion: "Lower the bar to the chest, pause, then press it back over the shoulders.",
    focus: "Keep the bar close to a vertical path over the chest instead of drifting toward the face."
  },
  cableFly: {
    pattern: "raise",
    label: "Cable Fly",
    setup: "Stand between the cable columns with the handles out wide and elbows softly bent.",
    motion: "Sweep the hands together in front of the chest, then return along the same arc.",
    focus: "Keep the elbow bend mostly fixed so the motion comes from the shoulders."
  },
  wallSlide: {
    pattern: "raise",
    label: "Wall Slide",
    setup: "Stand with the back, head, elbows, wrists, and hands close to the wall in a goalpost shape.",
    motion: "Slide the arms upward along the wall toward overhead, then return to the goalpost position.",
    focus: "Keep the ribs down and keep the arms traveling on the wall."
  },
  lateralRaise: {
    pattern: "raise",
    label: "Lateral Raise",
    setup: "Stand tall with dumbbells at the sides and a slight, fixed bend in the elbows.",
    motion: "Raise the elbows and hands out to the sides until they reach shoulder height, then lower.",
    focus: "Lead with the elbows and avoid turning it into a shrug."
  },
  seatedOverheadPress: {
    pattern: "press",
    label: "Seated Overhead Press",
    setup: "Sit tall on the bench with dumbbells at shoulder height.",
    motion: "Press the dumbbells overhead, then lower them back to the shoulders.",
    focus: "Keep the ribs stacked over the pelvis while the weights move vertically."
  },
  landminePress: {
    pattern: "press",
    label: "Half-Kneeling Landmine Press",
    setup: "Kneel with one knee down and hold the end of the angled bar near the shoulder.",
    motion: "Press the bar up and forward on its diagonal path, then return it to the shoulder.",
    focus: "Let the bar rotate around the floor anchor instead of moving like a straight overhead press."
  },
  benchDip: {
    pattern: "press",
    label: "Bench Dip",
    setup: "Face away from the bench with hands on the bench edge behind the hips and heels on the floor.",
    motion: "Lower the hips by bending the elbows back, then press up by extending the elbows.",
    focus: "Keep the bench behind the body and keep the elbows pointing backward."
  },
  cablePressdown: {
    pattern: "press",
    label: "Cable Pressdown",
    setup: "Stand at a high cable with elbows pinned beside the ribs and forearms angled upward.",
    motion: "Extend the elbows to press the handle down, then let the forearms return upward.",
    focus: "Keep the upper arms still while the cable runs from the high pulley to the hands."
  },
  overheadTricepsExtension: {
    pattern: "press",
    label: "Overhead Extension",
    setup: "Hold one dumbbell overhead with both hands and elbows pointing upward.",
    motion: "Bend the elbows to lower the dumbbell behind the head, then extend back overhead.",
    focus: "Keep the upper arms near the ears instead of letting the elbows flare wide."
  },
  closeGripBenchPress: {
    pattern: "press",
    label: "Close-Grip Bench Press",
    setup: "Lie on the bench with the bar over the lower chest and hands closer than shoulder width.",
    motion: "Lower the bar with elbows tucked, then press it back to lockout.",
    focus: "Show a narrower hand position than the regular bench press."
  },
  bandCurl: {
    pattern: "curl",
    label: "Band Curl",
    setup: "Stand on the band with both handles in the hands and upper arms still.",
    motion: "Curl the hands toward the shoulders, then lower against the band's pull.",
    focus: "Keep the band anchored under the feet."
  },
  dumbbellCurl: {
    pattern: "curl",
    label: "Dumbbell Curl",
    setup: "Stand tall with dumbbells at the sides and elbows close to the ribs.",
    motion: "Curl the weights upward, then lower them under control.",
    focus: "Keep the elbows from drifting forward."
  },
  inclineDumbbellCurl: {
    pattern: "curl",
    label: "Incline Dumbbell Curl",
    setup: "Recline on an inclined bench with arms hanging slightly behind the torso.",
    motion: "Curl the dumbbells up without moving the upper arms, then return to the long-arm start.",
    focus: "The bench should support the back while the arms start behind the body."
  },
  reverseCurl: {
    pattern: "curl",
    label: "Reverse Curl",
    setup: "Hold the EZ bar with palms facing down and elbows beside the ribs.",
    motion: "Curl the bar upward while keeping the wrists straight, then lower.",
    focus: "Keep the bar in front of the body and the forearms doing the work."
  },
  pullUp: {
    pattern: "pull",
    label: "Pull-Up",
    setup: "Hang from the pull-up bar with arms long and feet off the floor.",
    motion: "Pull the chest toward the bar by driving the elbows down, then lower under control.",
    focus: "Keep the bar fixed above the body."
  },
  chinUp: {
    pattern: "pull",
    label: "Chin-Up",
    setup: "Hang from the bar with an underhand grip and arms long.",
    motion: "Pull the chest toward the bar, then lower back to a full hang.",
    focus: "Show the body moving up toward a fixed overhead bar."
  },
  towelHang: {
    pattern: "carry",
    label: "Towel Hang",
    setup: "Loop a towel over the pull-up bar and grip both sides while hanging.",
    motion: "Hold the hang while the shoulders stay active and the body remains long.",
    focus: "The towel should hang from the bar and the hands should stay on it."
  },
  farmerCarry: {
    pattern: "carry",
    label: "Farmer Carry",
    setup: "Stand tall with dumbbells held at the sides.",
    motion: "Walk with small alternating steps while keeping the weights quiet.",
    focus: "Keep the weights beside the thighs and the shoulders level."
  },
  suitcaseCarry: {
    pattern: "carry",
    label: "Suitcase Carry",
    setup: "Hold one kettlebell at one side with the body tall and square.",
    motion: "Walk without leaning toward the weight.",
    focus: "Show one-sided loading so the trunk has to resist side bend."
  },
  wristCurl: {
    pattern: "curl",
    label: "Wrist Curl",
    setup: "Support the forearm on the bench with the hand holding a dumbbell past the edge.",
    motion: "Curl the wrist up and lower it through a small controlled range.",
    focus: "Only the hand and wrist should move."
  },
  latPulldown: {
    pattern: "pull",
    label: "Lat Pulldown",
    setup: "Anchor the band or machine high overhead with hands reaching up.",
    motion: "Pull the elbows down toward the ribs, then return to the overhead reach.",
    focus: "Keep the cable or band coming from above."
  },
  cableRow: {
    pattern: "pull",
    label: "Single-Arm Cable Row",
    setup: "Face the low cable with one arm reaching forward.",
    motion: "Pull the handle toward the ribs, then reach forward again.",
    focus: "Use a low cable path from the column to the working hand."
  },
  proneYRaise: {
    pattern: "raise",
    label: "Prone Y Raise",
    setup: "Lie chest-down on an incline bench with arms reaching in a Y shape.",
    motion: "Lift the arms slightly above the bench, then lower with control.",
    focus: "The bench supports the torso while the arms move diagonally overhead."
  },
  shrug: {
    pattern: "raise",
    label: "Dumbbell Shrug",
    setup: "Stand tall with dumbbells hanging beside the thighs.",
    motion: "Lift the shoulders straight up, pause, then lower.",
    focus: "The arms stay long while the shoulders do the movement."
  },
  facePull: {
    pattern: "pull",
    label: "Face Pull",
    setup: "Stand facing a cable set near face height with arms reaching forward.",
    motion: "Pull the handle toward the face with elbows high, then return.",
    focus: "The cable should run from the face-height pulley to the hands."
  },
  highPull: {
    pattern: "pull",
    label: "High Pull",
    setup: "Hold the barbell in front of the thighs with a wide grip.",
    motion: "Drive the bar upward close to the body with elbows rising high.",
    focus: "Show the bar traveling vertically close to the torso."
  },
  chinTuck: {
    pattern: "neck",
    label: "Chin Tuck",
    setup: "Lie or stand with the head neutral and the chin gently drawn in.",
    motion: "Glide the chin straight back, pause, then release.",
    focus: "The head should translate back instead of tipping up or down."
  },
  neckIsometric: {
    pattern: "neck",
    label: "Neck Isometric",
    setup: "Place one hand against the head while the neck stays neutral.",
    motion: "Press lightly into the hand without letting the head move.",
    focus: "Show resistance at the head with almost no visible neck motion."
  },
  proneNeckExtension: {
    pattern: "neck",
    label: "Prone Neck Extension",
    setup: "Lie face down on a bench with the head just beyond the edge.",
    motion: "Lift the head to neutral, then lower slightly.",
    focus: "The bench supports the body while the neck moves gently."
  },
  bandNeckRotation: {
    pattern: "neck",
    label: "Band Neck Rotation",
    setup: "Attach a band to the side of the head from a side anchor.",
    motion: "Rotate the head slowly against the band and return.",
    focus: "Keep the band connected to the head from the side."
  },
  harnessNeckExtension: {
    pattern: "neck",
    label: "Harness Neck Extension",
    setup: "Attach the neck harness while hinged forward or supported on a bench.",
    motion: "Extend the neck gently against the harness load, then lower.",
    focus: "Keep the harness around the head and use a very small range."
  },
  birdDog: {
    pattern: "core",
    label: "Bird Dog",
    setup: "Start on hands and knees on the mat.",
    motion: "Reach one arm forward and the opposite leg backward, then switch sides.",
    focus: "Keep the hips level while opposite limbs move."
  },
  backExtension: {
    pattern: "hinge",
    label: "Back Extension",
    setup: "Set the hips on the roman chair pad with the feet anchored.",
    motion: "Hinge the torso down, then extend back to a straight line.",
    focus: "Move around the hips rather than overextending the low back."
  },
  romanianDeadlift: {
    pattern: "hinge",
    label: "Romanian Deadlift",
    setup: "Stand with the bar or dumbbells close to the thighs and knees softly bent.",
    motion: "Hinge the hips back while the load slides close to the legs, then stand tall.",
    focus: "The load should stay close to the body through the hinge."
  },
  deadlift: {
    pattern: "hinge",
    label: "Deadlift",
    setup: "Start with the bar on the floor close to the shins.",
    motion: "Push the floor away and stand with the bar close, then return it to the floor.",
    focus: "Show the bar starting lower than a Romanian deadlift."
  },
  deadBug: {
    pattern: "core",
    label: "Dead Bug",
    setup: "Lie face up with arms reaching to the ceiling and hips and knees bent to 90 degrees.",
    motion: "Extend the opposite arm and leg away, then return and switch sides.",
    focus: "Keep the back position steady while opposite limbs move."
  },
  frontPlank: {
    pattern: "core",
    label: "Front Plank",
    setup: "Hold a forearm plank with elbows under shoulders and body long.",
    motion: "Maintain the hold with small breathing motion.",
    focus: "The body should stay straight from head to heels."
  },
  cableCrunch: {
    pattern: "core",
    label: "Cable Crunch",
    setup: "Kneel facing the cable with the high pulley above the head.",
    motion: "Curl the ribs toward the pelvis, then return to tall kneeling.",
    focus: "The cable should run from overhead to the hands near the head."
  },
  abWheelRollout: {
    pattern: "core",
    label: "Ab Wheel Rollout",
    setup: "Kneel on the mat with both hands on the ab wheel under the shoulders.",
    motion: "Roll the wheel forward while the body lengthens, then pull it back.",
    focus: "Keep the wheel on the floor in front of the knees."
  },
  sidePlank: {
    pattern: "core",
    label: "Side Plank",
    setup: "Stack the feet and support the body on one forearm.",
    motion: "Hold the side plank with a steady trunk.",
    focus: "Shoulders, hips, and ankles should form one long line."
  },
  pallofPress: {
    pattern: "core",
    label: "Pallof Press",
    setup: "Stand sideways to the cable or band anchor with hands at the chest.",
    motion: "Press the hands straight out from the chest, then return.",
    focus: "The cable or band should pull from the side while the torso resists rotation."
  },
  woodChop: {
    pattern: "core",
    label: "Cable Wood Chop",
    setup: "Stand beside the cable with the handle high and to one side.",
    motion: "Move the hands diagonally across the body toward the opposite hip.",
    focus: "Show a high-to-low diagonal cable path."
  },
  gluteBridge: {
    pattern: "hinge",
    label: "Glute Bridge",
    setup: "Lie on the mat with knees bent and feet flat.",
    motion: "Lift the hips until the torso and thighs line up, then lower.",
    focus: "Keep the feet planted while the hips move."
  },
  stepUp: {
    pattern: "squat",
    label: "Step-Up",
    setup: "Place one foot fully on the box with the other foot on the floor.",
    motion: "Drive through the box foot to stand tall, then step back down.",
    focus: "The box should sit under the working foot."
  },
  hipThrust: {
    pattern: "hinge",
    label: "Barbell Hip Thrust",
    setup: "Rest the upper back on the bench with the bar across the hips.",
    motion: "Drive the hips up to lockout, then lower under control.",
    focus: "Keep the bench behind the shoulders and the bar over the hips."
  },
  splitSquat: {
    pattern: "squat",
    label: "Bulgarian Split Squat",
    setup: "Place the rear foot on the bench and hold dumbbells at the sides.",
    motion: "Lower the back knee toward the floor, then drive up through the front foot.",
    focus: "Show the rear foot elevated behind the body."
  },
  boxSquat: {
    pattern: "squat",
    label: "Box Squat",
    setup: "Stand in front of the box with feet planted.",
    motion: "Sit back to lightly touch the box, then stand.",
    focus: "Keep the box behind the hips."
  },
  gobletSquat: {
    pattern: "squat",
    label: "Goblet Squat",
    setup: "Hold one dumbbell upright against the chest.",
    motion: "Squat down with the weight at chest height, then stand.",
    focus: "Keep the front-loaded weight close to the torso."
  },
  frontSquat: {
    pattern: "squat",
    label: "Front Squat",
    setup: "Hold the barbell in the front rack across the shoulders.",
    motion: "Squat down with an upright torso, then drive back up.",
    focus: "The bar should stay at the front of the shoulders."
  },
  cyclistSquat: {
    pattern: "squat",
    label: "Heel-Elevated Squat",
    setup: "Stand with both heels on the wedge and torso tall.",
    motion: "Bend the knees deeply over the toes, then stand.",
    focus: "Keep the wedge under the heels throughout."
  },
  ballLegCurl: {
    pattern: "squat",
    label: "Stability Ball Leg Curl",
    setup: "Lie face up with heels on the ball and hips lifted.",
    motion: "Curl the ball toward the hips by bending the knees, then roll it away.",
    focus: "The ball should stay under the heels."
  },
  seatedLegCurl: {
    pattern: "squat",
    label: "Seated Leg Curl",
    setup: "Sit in the machine with the pad in front of the lower legs.",
    motion: "Bend the knees to pull the pad down and back, then return.",
    focus: "Show a seated body with lower legs moving around the knee."
  },
  nordicCurl: {
    pattern: "squat",
    label: "Nordic Hamstring Curl",
    setup: "Kneel with the ankles anchored behind the body.",
    motion: "Lower the straight torso forward from the knees, then pull back up.",
    focus: "The feet should remain fixed while the body pivots forward."
  },
  standingCalfRaise: {
    pattern: "calf",
    label: "Standing Calf Raise",
    setup: "Stand with the balls of the feet on the step and heels free.",
    motion: "Rise onto the toes, then lower the heels into a stretch.",
    focus: "The step should sit under the forefoot."
  },
  seatedCalfRaise: {
    pattern: "calf",
    label: "Seated Calf Raise",
    setup: "Sit in the machine with knees bent and the pad over the thighs.",
    motion: "Raise the heels, pause, then lower.",
    focus: "Show bent knees to distinguish it from a standing calf raise."
  },
  singleLegCalfRaise: {
    pattern: "calf",
    label: "Single-Leg Calf Raise",
    setup: "Stand on one forefoot on the step while the other foot floats.",
    motion: "Rise and lower on the working ankle.",
    focus: "Only one foot should be loaded on the step."
  },
  donkeyCalfRaise: {
    pattern: "calf",
    label: "Donkey Calf Raise",
    setup: "Hinge forward with the forefeet on the platform and load over the hips.",
    motion: "Raise and lower the heels while the torso stays hinged.",
    focus: "Show the body bent forward instead of upright."
  },
  toeYoga: {
    pattern: "ankle",
    label: "Toe Yoga",
    setup: "Stand or sit with the foot flat on the floor.",
    motion: "Lift the big toe and other toes in small alternating motions.",
    focus: "Keep the foot on the floor and make the motion small."
  },
  ankleAlphabet: {
    pattern: "ankle",
    label: "Ankle Alphabet",
    setup: "Sit with one leg extended and the foot off the floor.",
    motion: "Trace small letters with the toes by moving the ankle.",
    focus: "The shin stays mostly still while the foot draws the shapes."
  },
  tibialisRaise: {
    pattern: "ankle",
    label: "Tibialis Raise",
    setup: "Lean the back against the wall with heels on the floor and toes lowered.",
    motion: "Lift the toes toward the shins, then lower.",
    focus: "Keep the heels planted while only the front of the feet lift."
  },
  balanceReach: {
    pattern: "ankle",
    label: "Single-Leg Balance Reach",
    setup: "Stand on one foot with the other foot ready to reach.",
    motion: "Reach the free foot forward and to the side while the stance foot stabilizes.",
    focus: "Keep the working foot rooted and the arch active."
  },
  ankleEversion: {
    pattern: "ankle",
    label: "Band Ankle Eversion",
    setup: "Sit with a band attached to the outside of the foot from a side anchor.",
    motion: "Turn the foot outward against the band, then return.",
    focus: "The band should connect to the foot, not the hands."
  }
};

const exerciseAnimationVariants = new Map([
  ["Incline Push-Up", "inclinePushUp"],
  ["Dumbbell Bench Press", "benchPressDumbbell"],
  ["Cable Fly", "cableFly"],
  ["Paused Barbell Bench Press", "benchPressBarbell"],
  ["Wall Slide", "wallSlide"],
  ["Dumbbell Lateral Raise", "lateralRaise"],
  ["Seated Dumbbell Press", "seatedOverheadPress"],
  ["Half-Kneeling Landmine Press", "landminePress"],
  ["Bench Dip", "benchDip"],
  ["Cable Pressdown", "cablePressdown"],
  ["Overhead Dumbbell Extension", "overheadTricepsExtension"],
  ["Close-Grip Bench Press", "closeGripBenchPress"],
  ["Band Curl", "bandCurl"],
  ["Alternating Dumbbell Curl", "dumbbellCurl"],
  ["Incline Dumbbell Curl", "inclineDumbbellCurl"],
  ["Weighted Chin-Up", "chinUp"],
  ["Farmer Carry", "farmerCarry"],
  ["Wrist Curl", "wristCurl"],
  ["Reverse Curl", "reverseCurl"],
  ["Towel Pull-Up Hang", "towelHang"],
  ["Band Lat Pulldown", "latPulldown"],
  ["Assisted Pull-Up", "pullUp"],
  ["Single-Arm Cable Row", "cableRow"],
  ["Weighted Pull-Up", "pullUp"],
  ["Prone Y Raise", "proneYRaise"],
  ["Dumbbell Shrug", "shrug"],
  ["Face Pull", "facePull"],
  ["Snatch-Grip High Pull", "highPull"],
  ["Chin Tuck", "chinTuck"],
  ["Neck Isometric Hold", "neckIsometric"],
  ["Prone Neck Extension", "proneNeckExtension"],
  ["Band Neck Rotation", "bandNeckRotation"],
  ["Harness Neck Extension", "harnessNeckExtension"],
  ["Bird Dog", "birdDog"],
  ["Back Extension", "backExtension"],
  ["Romanian Deadlift", "romanianDeadlift"],
  ["Deficit Deadlift", "deadlift"],
  ["Dead Bug", "deadBug"],
  ["Front Plank", "frontPlank"],
  ["Cable Crunch", "cableCrunch"],
  ["Ab Wheel Rollout", "abWheelRollout"],
  ["Side Plank", "sidePlank"],
  ["Pallof Press", "pallofPress"],
  ["Cable Wood Chop", "woodChop"],
  ["Suitcase Carry", "suitcaseCarry"],
  ["Glute Bridge", "gluteBridge"],
  ["Step-Up", "stepUp"],
  ["Barbell Hip Thrust", "hipThrust"],
  ["Bulgarian Split Squat", "splitSquat"],
  ["Box Squat", "boxSquat"],
  ["Goblet Squat", "gobletSquat"],
  ["Front Squat", "frontSquat"],
  ["Heel-Elevated Cyclist Squat", "cyclistSquat"],
  ["Stability Ball Leg Curl", "ballLegCurl"],
  ["Dumbbell Romanian Deadlift", "romanianDeadlift"],
  ["Seated Leg Curl", "seatedLegCurl"],
  ["Nordic Hamstring Curl", "nordicCurl"],
  ["Standing Calf Raise", "standingCalfRaise"],
  ["Seated Calf Raise", "seatedCalfRaise"],
  ["Single-Leg Calf Raise", "singleLegCalfRaise"],
  ["Loaded Donkey Calf Raise", "donkeyCalfRaise"],
  ["Toe Yoga", "toeYoga"],
  ["Ankle Alphabet", "ankleAlphabet"],
  ["Tibialis Raise", "tibialisRaise"],
  ["Single-Leg Balance Reach", "balanceReach"],
  ["Band Resisted Ankle Eversion", "ankleEversion"]
]);

function inferAnimationVariant(exercise) {
  const name = exercise.name.toLowerCase();
  const equipment = exercise.equipment.toLowerCase();

  if (/neck|chin tuck|harness/.test(name) || equipment.includes("neck harness")) return "neckIsometric";
  if (/toe|ankle|tibialis|balance/.test(name)) return "ankleAlphabet";
  if (/calf|donkey/.test(name)) return "standingCalfRaise";
  if (/carry/.test(name)) return "farmerCarry";
  if (/hang/.test(name)) return "towelHang";
  if (/plank/.test(name)) return "frontPlank";
  if (/bug/.test(name)) return "deadBug";
  if (/crunch/.test(name)) return "cableCrunch";
  if (/ab wheel|rollout/.test(name)) return "abWheelRollout";
  if (/wood chop/.test(name)) return "woodChop";
  if (/pallof/.test(name)) return "pallofPress";
  if (/deadlift|romanian/.test(name)) return "romanianDeadlift";
  if (/back extension/.test(name)) return "backExtension";
  if (/bridge/.test(name)) return "gluteBridge";
  if (/hip thrust/.test(name)) return "hipThrust";
  if (/step-up/.test(name)) return "stepUp";
  if (/split squat/.test(name)) return "splitSquat";
  if (/squat/.test(name)) return "gobletSquat";
  if (/leg curl|nordic/.test(name)) return "seatedLegCurl";
  if (/curl/.test(name)) return "dumbbellCurl";
  if (/wall slide/.test(name)) return "wallSlide";
  if (/shrug/.test(name)) return "shrug";
  if (/face pull/.test(name)) return "facePull";
  if (/raise/.test(name)) return "lateralRaise";
  if (/fly/.test(name)) return "cableFly";
  if (/pull|pulldown|row|chin-up/.test(name)) return "pullUp";
  if (/dip/.test(name)) return "benchDip";
  if (/press|push-up|extension/.test(name)) return "benchPressBarbell";

  return "inclinePushUp";
}

const equipmentNameMap = new Map([
  ["ab wheel", "Ab Wheel"],
  ["anchor", "Anchor"],
  ["ball", "Ball"],
  ["band", "Band"],
  ["barbell", "Barbell"],
  ["bench", "Bench"],
  ["box", "Box"],
  ["cable", "Cable"],
  ["dumbbell", "Dumbbells"],
  ["dumbbells", "Dumbbells"],
  ["ez bar", "EZ Bar"],
  ["floor", "Floor"],
  ["hand resistance", "Hand Resistance"],
  ["kettlebell", "Kettlebell"],
  ["landmine", "Landmine"],
  ["machine", "Machine"],
  ["mat", "Mat"],
  ["neck harness", "Neck Harness"],
  ["pull-up bar", "Pull-Up Bar"],
  ["roman chair", "Roman Chair"],
  ["step", "Step"],
  ["towel", "Towel"],
  ["wall", "Wall"],
  ["wedge", "Wedge"]
]);

function slugifyEquipment(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeEquipmentLabel(label) {
  const key = label.trim().toLowerCase();
  if (equipmentNameMap.has(key)) {
    return equipmentNameMap.get(key);
  }

  return key
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getExerciseEquipmentTypes(equipment) {
  return equipment
    .split(/\s+or\s+|,|\/|\+/i)
    .map(normalizeEquipmentLabel)
    .filter(Boolean)
    .map((label) => ({
      id: slugifyEquipment(label),
      label
    }));
}

export function getEquipmentOptions() {
  const options = new Map();

  MUSCLES.forEach((muscle) => {
    muscle.exercises.forEach((exercise) => {
      getExerciseEquipmentTypes(exercise.equipment).forEach((equipment) => {
        options.set(equipment.id, equipment.label);
      });
    });
  });

  return [...options.entries()]
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getEquipmentIdsForMuscles(muscleIds, level) {
  const maxLevel = level ? levelOrder.indexOf(level) : levelOrder.length - 1;
  const equipmentIds = new Set();

  muscleIds.forEach((muscleId) => {
    const muscle = getMuscle(muscleId);
    if (!muscle) return;

    muscle.exercises
      .filter((exercise) => levelOrder.indexOf(exercise.level) <= maxLevel)
      .forEach((exercise) => {
        getExerciseEquipmentTypes(exercise.equipment).forEach((equipment) => {
          equipmentIds.add(equipment.id);
        });
      });
  });

  return equipmentIds;
}

export function exerciseMatchesEquipment(exercise, selectedEquipmentIds = []) {
  if (selectedEquipmentIds.length === 0) {
    return true;
  }

  const exerciseEquipmentIds = getExerciseEquipmentTypes(exercise.equipment).map((equipment) => equipment.id);
  return exerciseEquipmentIds.some((equipmentId) => selectedEquipmentIds.includes(equipmentId));
}

export function getMuscle(id) {
  return MUSCLES.find((muscle) => muscle.id === id);
}

export function getExercisePool(muscleId, level, selectedEquipmentIds = []) {
  const muscle = getMuscle(muscleId);
  const maxLevel = levelOrder.indexOf(level);
  return muscle.exercises.filter(
    (exercise) => levelOrder.indexOf(exercise.level) <= maxLevel && exerciseMatchesEquipment(exercise, selectedEquipmentIds)
  );
}

export function getExerciseAnimation(exercise) {
  const variant = exerciseAnimationVariants.get(exercise.name) ?? inferAnimationVariant(exercise);
  const profile = animationProfiles[variant] ?? animationProfiles.inclinePushUp;

  return {
    variant,
    ...profile
  };
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
