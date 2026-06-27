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

const ADDITIONAL_EXERCISES_BY_MUSCLE = {
  chest: [
    { name: "Knee Push-Up", level: "beginner", equipment: "No equipment", cue: "Keep a straight line from shoulders to knees." },
    { name: "Push-Up", level: "beginner", equipment: "No equipment", cue: "Brace the trunk and lower the chest between the hands." },
    { name: "Band Chest Press", level: "beginner", equipment: "Band", cue: "Press forward without letting the shoulders shrug." },
    { name: "Machine Chest Press", level: "beginner", equipment: "Machine", cue: "Keep shoulder blades set against the pad." },
    { name: "Barbell Bench Press", level: "intermediate", equipment: "Barbell", cue: "Use a steady bar path and keep the feet planted." },
    { name: "Incline Dumbbell Press", level: "intermediate", equipment: "Dumbbells", cue: "Press up and slightly back over the upper chest." },
    { name: "Incline Barbell Bench Press", level: "intermediate", equipment: "Barbell", cue: "Lower to the upper chest with elbows under the bar." },
    { name: "Decline Push-Up", level: "intermediate", equipment: "Bench", cue: "Keep hips level as the feet stay elevated." },
    { name: "Dumbbell Fly", level: "intermediate", equipment: "Dumbbells", cue: "Keep a soft elbow bend and open only as far as shoulders allow." },
    { name: "Pec Deck Fly", level: "intermediate", equipment: "Machine", cue: "Bring the pads together by squeezing through the chest." },
    { name: "Cable Crossover", level: "intermediate", equipment: "Cable", cue: "Sweep the handles together with the ribs down." },
    { name: "Low-to-High Cable Fly", level: "intermediate", equipment: "Cable", cue: "Bring the hands upward toward eye level without leaning back." },
    { name: "Weighted Dip", level: "expert", equipment: "Dip bars", cue: "Lean slightly forward and stop before shoulder discomfort." },
    { name: "Ring Push-Up", level: "expert", equipment: "Rings", cue: "Keep the rings steady while pressing through a full range." },
    { name: "Landmine Chest Press", level: "expert", equipment: "Landmine", cue: "Press the angled bar forward while staying braced." }
  ],
  shoulders: [
    { name: "Shoulder CARs", level: "beginner", equipment: "No equipment", cue: "Move slowly through the largest pain-free circle." },
    { name: "Scaption Raise", level: "beginner", equipment: "Dumbbells", cue: "Raise in a slight V with thumbs angled up." },
    { name: "Band Pull-Apart", level: "beginner", equipment: "Band", cue: "Pull the band apart while keeping ribs quiet." },
    { name: "External Rotation", level: "beginner", equipment: "Band", cue: "Keep the elbow tucked and rotate from the shoulder." },
    { name: "Pike Push-Up", level: "intermediate", equipment: "No equipment", cue: "Lower the head between the hands and press back up." },
    { name: "Standing Dumbbell Press", level: "intermediate", equipment: "Dumbbells", cue: "Press vertically without arching the low back." },
    { name: "Barbell Overhead Press", level: "intermediate", equipment: "Barbell", cue: "Move the head through after the bar clears the forehead." },
    { name: "Arnold Press", level: "intermediate", equipment: "Dumbbells", cue: "Rotate smoothly from front rack to overhead." },
    { name: "Cable Lateral Raise", level: "intermediate", equipment: "Cable", cue: "Let the cable pull across the body and raise to shoulder height." },
    { name: "Front Raise", level: "intermediate", equipment: "Dumbbells", cue: "Raise to shoulder height without swinging." },
    { name: "Rear Delt Fly", level: "intermediate", equipment: "Dumbbells", cue: "Hinge and sweep the arms wide with soft elbows." },
    { name: "Reverse Pec Deck", level: "intermediate", equipment: "Machine", cue: "Pull the handles apart without shrugging." },
    { name: "Machine Shoulder Press", level: "intermediate", equipment: "Machine", cue: "Drive evenly through both handles." },
    { name: "Handstand Push-Up", level: "expert", equipment: "Wall", cue: "Use a controlled range and keep the body stacked." },
    { name: "Cuban Press", level: "expert", equipment: "Dumbbells", cue: "Use light weight and control the rotation." },
    { name: "Heavy Rope Waves", level: "expert", equipment: "Heavy ropes", cue: "Keep shoulders packed while the arms move quickly." }
  ],
  triceps: [
    { name: "Close-Grip Push-Up", level: "beginner", equipment: "No equipment", cue: "Keep elbows close and press through the palms." },
    { name: "Band Pressdown", level: "beginner", equipment: "Band", cue: "Pin elbows to the sides and straighten fully." },
    { name: "Dumbbell Kickback", level: "beginner", equipment: "Dumbbell", cue: "Hold the upper arm still while the forearm extends." },
    { name: "Diamond Push-Up", level: "intermediate", equipment: "No equipment", cue: "Keep the hands narrow and elbows tracking back." },
    { name: "EZ-Bar Skull Crusher", level: "intermediate", equipment: "EZ bar", cue: "Lower toward the forehead with upper arms steady." },
    { name: "Lying Dumbbell Triceps Extension", level: "intermediate", equipment: "Dumbbells", cue: "Bend only at the elbows and control the bottom." },
    { name: "Rope Pressdown", level: "intermediate", equipment: "Cable", cue: "Separate the rope slightly at the bottom." },
    { name: "Single-Arm Cable Pressdown", level: "intermediate", equipment: "Cable", cue: "Finish each rep with a full elbow lockout." },
    { name: "Overhead Cable Extension", level: "intermediate", equipment: "Cable", cue: "Keep elbows high and stretch the long head." },
    { name: "Machine Dip", level: "intermediate", equipment: "Machine", cue: "Press the handles down without rolling shoulders forward." },
    { name: "Parallel Bar Dip", level: "expert", equipment: "Dip bars", cue: "Stay tall to bias the triceps." },
    { name: "JM Press", level: "expert", equipment: "Barbell", cue: "Blend a close-grip press and extension with control." },
    { name: "Ring Triceps Extension", level: "expert", equipment: "Rings", cue: "Keep the body rigid as elbows bend and extend." }
  ],
  biceps: [
    { name: "Standing Barbell Curl", level: "beginner", equipment: "Barbell", cue: "Keep elbows near the ribs and avoid leaning back." },
    { name: "EZ-Bar Curl", level: "beginner", equipment: "EZ bar", cue: "Use a comfortable grip and smooth tempo." },
    { name: "Hammer Curl", level: "beginner", equipment: "Dumbbells", cue: "Keep thumbs up through the whole curl." },
    { name: "Cable Curl", level: "beginner", equipment: "Cable", cue: "Keep tension on the biceps at the bottom." },
    { name: "Concentration Curl", level: "intermediate", equipment: "Dumbbell", cue: "Brace the elbow against the thigh and curl slowly." },
    { name: "Preacher Curl", level: "intermediate", equipment: "Bench", cue: "Let the pad keep the upper arm quiet." },
    { name: "Spider Curl", level: "intermediate", equipment: "Bench", cue: "Lie chest-down and curl without shoulder swing." },
    { name: "Bayesian Cable Curl", level: "intermediate", equipment: "Cable", cue: "Stand ahead of the cable so the arm starts behind the torso." },
    { name: "Zottman Curl", level: "intermediate", equipment: "Dumbbells", cue: "Curl palms up and lower palms down." },
    { name: "Drag Curl", level: "intermediate", equipment: "Barbell", cue: "Pull elbows back as the bar travels close to the body." },
    { name: "Machine Curl", level: "intermediate", equipment: "Machine", cue: "Keep the upper arm on the pad through the rep." },
    { name: "Weighted Chin-Up", level: "expert", equipment: "Pull-up bar", cue: "Use a controlled pull and avoid craning the neck." },
    { name: "Ring Curl", level: "expert", equipment: "Rings", cue: "Keep the body straight and curl the hands toward the forehead." }
  ],
  forearms: [
    { name: "Reverse Wrist Curl", level: "beginner", equipment: "Dumbbell", cue: "Lift through the back of the wrist without moving the elbow." },
    { name: "Wrist Extension", level: "beginner", equipment: "Band", cue: "Extend against light resistance with a small range." },
    { name: "Pronation Supination", level: "beginner", equipment: "Dumbbell", cue: "Rotate the forearm slowly with the elbow supported." },
    { name: "Dead Hang", level: "beginner", equipment: "Pull-up bar", cue: "Hang with shoulders active and ribs down." },
    { name: "Plate Pinch", level: "intermediate", equipment: "Plate", cue: "Pinch the plates with straight wrists." },
    { name: "Wrist Roller", level: "intermediate", equipment: "Wrist roller", cue: "Roll up and down without shrugging." },
    { name: "Towel Row", level: "intermediate", equipment: "Towel", cue: "Grip the towel hard while pulling the elbows back." },
    { name: "Bottoms-Up Kettlebell Carry", level: "intermediate", equipment: "Kettlebell", cue: "Keep the bell vertical and wrist stacked." },
    { name: "Hand Gripper Squeeze", level: "intermediate", equipment: "Hand gripper", cue: "Close the handle fully and release with control." },
    { name: "Barbell Hold", level: "intermediate", equipment: "Barbell", cue: "Hold a heavy bar with tall posture and quiet shoulders." },
    { name: "Towel Pull-Up", level: "expert", equipment: "Towel", cue: "Keep the towel gripped tightly as you pull." },
    { name: "Fat-Grip Farmer Carry", level: "expert", equipment: "Dumbbells", cue: "Walk tall while the thicker handles challenge grip." }
  ],
  lats: [
    { name: "Kneeling Band Pulldown", level: "beginner", equipment: "Band", cue: "Pull elbows toward the ribs while kneeling tall." },
    { name: "Inverted Row", level: "beginner", equipment: "Barbell", cue: "Keep the body straight and pull chest to the bar." },
    { name: "Straight-Arm Band Pulldown", level: "beginner", equipment: "Band", cue: "Keep elbows soft and pull the arms toward the hips." },
    { name: "Pull-Up", level: "intermediate", equipment: "Pull-up bar", cue: "Drive elbows down and keep the ribs stacked." },
    { name: "Neutral-Grip Pull-Up", level: "intermediate", equipment: "Pull-up bar", cue: "Use a palms-facing grip and full control." },
    { name: "Lat Pulldown", level: "intermediate", equipment: "Machine", cue: "Pull the bar toward the upper chest without leaning back hard." },
    { name: "Close-Grip Pulldown", level: "intermediate", equipment: "Machine", cue: "Pull the handle toward the sternum with elbows tight." },
    { name: "Straight-Arm Cable Pulldown", level: "intermediate", equipment: "Cable", cue: "Sweep the hands to the thighs with long arms." },
    { name: "One-Arm Dumbbell Row", level: "intermediate", equipment: "Dumbbell", cue: "Pull the elbow toward the hip, not the shoulder." },
    { name: "Chest-Supported Row", level: "intermediate", equipment: "Bench", cue: "Keep the chest on the pad and row evenly." },
    { name: "Seated Cable Row", level: "intermediate", equipment: "Cable", cue: "Row to the ribs without jerking the torso." },
    { name: "T-Bar Row", level: "expert", equipment: "Barbell", cue: "Brace hard and keep the load close." },
    { name: "Meadows Row", level: "expert", equipment: "Landmine", cue: "Pull the bar end toward the lower ribs." },
    { name: "Machine Pullover", level: "expert", equipment: "Machine", cue: "Drive the elbows down in an arcing path." }
  ],
  traps: [
    { name: "Prone T Raise", level: "beginner", equipment: "Bench", cue: "Reach arms out wide and lift without shrugging." },
    { name: "Scapular Pull-Up", level: "beginner", equipment: "Pull-up bar", cue: "Keep arms long and move only the shoulder blades." },
    { name: "Band Face Pull", level: "beginner", equipment: "Band", cue: "Pull toward the face with elbows high." },
    { name: "Barbell Shrug", level: "intermediate", equipment: "Barbell", cue: "Lift shoulders straight up and pause." },
    { name: "Trap-Bar Shrug", level: "intermediate", equipment: "Trap bar", cue: "Stand tall inside the bar and shrug vertically." },
    { name: "Cable Y Raise", level: "intermediate", equipment: "Cable", cue: "Raise into a Y while keeping the neck relaxed." },
    { name: "Rack Pull", level: "intermediate", equipment: "Barbell", cue: "Brace and pull from pins with shoulders packed." },
    { name: "Overhead Carry", level: "intermediate", equipment: "Dumbbells", cue: "Walk with arms locked overhead and ribs down." },
    { name: "Kettlebell Shrug", level: "intermediate", equipment: "Kettlebell", cue: "Keep elbows long and shrug up and down." },
    { name: "Snatch High Pull", level: "expert", equipment: "Barbell", cue: "Pull explosively while elbows rise high." },
    { name: "Farmer Carry", level: "expert", equipment: "Dumbbells", cue: "Carry heavy while keeping shoulders level." }
  ],
  neck: [
    { name: "Supine Chin Tuck", level: "beginner", equipment: "Mat", cue: "Glide the chin back without lifting the head high." },
    { name: "Wall Chin Tuck", level: "beginner", equipment: "Wall", cue: "Slide the back of the head gently toward the wall." },
    { name: "Neck Flexion Isometric", level: "beginner", equipment: "Hand resistance", cue: "Press the forehead into the hand without moving." },
    { name: "Neck Extension Isometric", level: "beginner", equipment: "Hand resistance", cue: "Press the back of the head gently into the hand." },
    { name: "Neck Lateral Flexion Isometric", level: "beginner", equipment: "Hand resistance", cue: "Press ear toward hand while keeping the head still." },
    { name: "Controlled Neck CAR", level: "beginner", equipment: "No equipment", cue: "Move slowly through a comfortable circle." },
    { name: "Prone Cobra Hold", level: "intermediate", equipment: "Mat", cue: "Lift the chest slightly and keep the neck long." },
    { name: "Band Neck Flexion", level: "intermediate", equipment: "Band", cue: "Use light tension and a small controlled range." },
    { name: "Band Neck Extension", level: "intermediate", equipment: "Band", cue: "Extend gently against the band without jerking." },
    { name: "Harness Neck Flexion", level: "expert", equipment: "Neck harness", cue: "Use very light load and smooth reps only." },
    { name: "Harness Neck Extension", level: "expert", equipment: "Neck harness", cue: "Keep the range small and stop before discomfort." }
  ],
  lowerBack: [
    { name: "Cat-Cow", level: "beginner", equipment: "Mat", cue: "Move the spine slowly from flexion to extension." },
    { name: "Hip Hinge Drill", level: "beginner", equipment: "Dowel", cue: "Keep head, upper back, and hips touching the dowel." },
    { name: "Superman", level: "beginner", equipment: "Mat", cue: "Lift arms and legs lightly without cranking the neck." },
    { name: "McGill Curl-Up", level: "beginner", equipment: "Mat", cue: "Brace the trunk and lift only slightly." },
    { name: "Cable Pull-Through", level: "intermediate", equipment: "Cable", cue: "Hinge back and drive hips forward." },
    { name: "Good Morning", level: "intermediate", equipment: "Barbell", cue: "Hinge with a neutral spine and soft knees." },
    { name: "Kettlebell Swing", level: "intermediate", equipment: "Kettlebell", cue: "Snap the hips and let the bell float." },
    { name: "Reverse Hyperextension", level: "intermediate", equipment: "Machine", cue: "Lift the legs with glutes and hamstrings, not momentum." },
    { name: "Rack Pull", level: "intermediate", equipment: "Barbell", cue: "Brace before pulling from the pins." },
    { name: "Deadlift", level: "expert", equipment: "Barbell", cue: "Push the floor away and keep the bar close." },
    { name: "Jefferson Curl", level: "expert", equipment: "Dumbbell", cue: "Use light load and move segment by segment." }
  ],
  abs: [
    { name: "Crunch", level: "beginner", equipment: "Mat", cue: "Curl ribs toward pelvis without yanking the neck." },
    { name: "Reverse Crunch", level: "beginner", equipment: "Mat", cue: "Roll the pelvis up with control." },
    { name: "Hollow Body Hold", level: "beginner", equipment: "Mat", cue: "Keep low back gently pressed down." },
    { name: "Mountain Climber", level: "beginner", equipment: "No equipment", cue: "Keep shoulders over wrists as knees drive forward." },
    { name: "Stability Ball Crunch", level: "intermediate", equipment: "Stability ball", cue: "Let the ball support the low back as ribs curl." },
    { name: "Hanging Knee Raise", level: "intermediate", equipment: "Pull-up bar", cue: "Lift knees without swinging." },
    { name: "Captain's Chair Knee Raise", level: "intermediate", equipment: "Machine", cue: "Press forearms down and curl knees upward." },
    { name: "Medicine Ball Slam", level: "intermediate", equipment: "Medicine ball", cue: "Brace hard as the ball travels overhead and down." },
    { name: "V-Up", level: "intermediate", equipment: "Mat", cue: "Reach hands and feet together without losing control." },
    { name: "Toe Touch", level: "intermediate", equipment: "Mat", cue: "Reach upward by curling the upper back." },
    { name: "Hanging Leg Raise", level: "expert", equipment: "Pull-up bar", cue: "Raise legs without swinging the torso." },
    { name: "Dragon Flag", level: "expert", equipment: "Bench", cue: "Lower the body as one rigid line." },
    { name: "Weighted Cable Crunch", level: "expert", equipment: "Cable", cue: "Round through the trunk, not the hips." }
  ],
  obliques: [
    { name: "Bicycle Crunch", level: "beginner", equipment: "Mat", cue: "Rotate the ribs toward the opposite knee." },
    { name: "Side Crunch", level: "beginner", equipment: "Mat", cue: "Shorten the side of the torso without pulling the head." },
    { name: "Heel Tap", level: "beginner", equipment: "Mat", cue: "Reach side to side while keeping shoulders lifted." },
    { name: "Standing Band Rotation", level: "beginner", equipment: "Band", cue: "Rotate through the trunk while hips stay quiet." },
    { name: "Russian Twist", level: "intermediate", equipment: "Medicine ball", cue: "Rotate with the chest, not just the hands." },
    { name: "Cable Lift", level: "intermediate", equipment: "Cable", cue: "Move from low to high across the body." },
    { name: "Landmine Rotation", level: "intermediate", equipment: "Landmine", cue: "Pivot through the hips and brace the trunk." },
    { name: "Kettlebell Windmill", level: "intermediate", equipment: "Kettlebell", cue: "Hinge sideways while keeping the bell stacked." },
    { name: "Dumbbell Side Bend", level: "intermediate", equipment: "Dumbbell", cue: "Move slowly and avoid twisting." },
    { name: "Copenhagen Side Plank", level: "expert", equipment: "Bench", cue: "Keep hips high while the top leg rests on the bench." },
    { name: "Hanging Windshield Wiper", level: "expert", equipment: "Pull-up bar", cue: "Control the legs side to side without swinging." }
  ],
  glutes: [
    { name: "Bodyweight Glute Bridge", level: "beginner", equipment: "Mat", cue: "Drive through heels and squeeze glutes at the top." },
    { name: "Frog Pump", level: "beginner", equipment: "Mat", cue: "Press soles together and lift hips with short reps." },
    { name: "Clamshell", level: "beginner", equipment: "Mini band", cue: "Keep hips stacked as the top knee opens." },
    { name: "Lateral Band Walk", level: "beginner", equipment: "Mini band", cue: "Keep tension on the band with small side steps." },
    { name: "Donkey Kick", level: "beginner", equipment: "Mat", cue: "Lift the heel without arching the low back." },
    { name: "Cable Glute Kickback", level: "intermediate", equipment: "Cable", cue: "Drive the heel back while hips stay square." },
    { name: "Hip Abduction Machine", level: "intermediate", equipment: "Machine", cue: "Open the knees with control and pause briefly." },
    { name: "Reverse Lunge", level: "intermediate", equipment: "Dumbbells", cue: "Step back and drive through the front heel." },
    { name: "Walking Lunge", level: "intermediate", equipment: "Dumbbells", cue: "Keep torso tall and push through the lead foot." },
    { name: "Sumo Deadlift", level: "intermediate", equipment: "Barbell", cue: "Push knees out and drive hips through." },
    { name: "Single-Leg Hip Thrust", level: "expert", equipment: "Bench", cue: "Keep hips level while one leg works." },
    { name: "Reverse Hyperextension", level: "expert", equipment: "Machine", cue: "Lift from the hips with controlled momentum." }
  ],
  quads: [
    { name: "Bodyweight Squat", level: "beginner", equipment: "No equipment", cue: "Sit between the heels and stand tall." },
    { name: "Wall Sit", level: "beginner", equipment: "Wall", cue: "Hold thighs near parallel while breathing steadily." },
    { name: "Step-Down", level: "beginner", equipment: "Step", cue: "Lower slowly and keep the knee tracking over toes." },
    { name: "Reverse Lunge", level: "beginner", equipment: "No equipment", cue: "Step back and keep the front knee controlled." },
    { name: "Back Squat", level: "intermediate", equipment: "Barbell", cue: "Brace and keep the bar balanced over mid-foot." },
    { name: "Leg Press", level: "intermediate", equipment: "Machine", cue: "Lower until hips stay controlled on the pad." },
    { name: "Leg Extension", level: "intermediate", equipment: "Machine", cue: "Straighten the knees and pause at the top." },
    { name: "Hack Squat", level: "intermediate", equipment: "Machine", cue: "Use a deep knee bend with heels planted." },
    { name: "Walking Lunge", level: "intermediate", equipment: "Dumbbells", cue: "Take steady steps with knee tracking forward." },
    { name: "Bulgarian Split Squat", level: "intermediate", equipment: "Bench", cue: "Drop the back knee and drive through the front leg." },
    { name: "Sissy Squat", level: "expert", equipment: "No equipment", cue: "Keep hips extended as knees travel forward." },
    { name: "Pistol Squat", level: "expert", equipment: "No equipment", cue: "Control depth on one leg without collapsing inward." },
    { name: "Zercher Squat", level: "expert", equipment: "Barbell", cue: "Hold the bar in the elbows and keep torso tall." }
  ],
  hamstrings: [
    { name: "Slider Leg Curl", level: "beginner", equipment: "Sliders", cue: "Keep hips lifted while heels slide in and out." },
    { name: "Banded Leg Curl", level: "beginner", equipment: "Band", cue: "Curl the heel toward the glute with control." },
    { name: "Single-Leg Romanian Deadlift", level: "intermediate", equipment: "Dumbbell", cue: "Reach the free leg back as the torso hinges." },
    { name: "Barbell Romanian Deadlift", level: "intermediate", equipment: "Barbell", cue: "Keep the bar close and hips moving back." },
    { name: "Good Morning", level: "intermediate", equipment: "Barbell", cue: "Hinge until hamstrings load, then stand." },
    { name: "Lying Leg Curl", level: "intermediate", equipment: "Machine", cue: "Curl heels toward glutes without hips lifting." },
    { name: "Standing Leg Curl", level: "intermediate", equipment: "Machine", cue: "Keep hips square while one knee bends." },
    { name: "Cable Pull-Through", level: "intermediate", equipment: "Cable", cue: "Hinge back and finish by squeezing glutes." },
    { name: "Glute-Ham Raise", level: "expert", equipment: "Glute-ham developer", cue: "Keep the body long while hamstrings pull you up." },
    { name: "Nordic Curl", level: "expert", equipment: "Anchor", cue: "Lower slowly from the knees and catch with the hands." },
    { name: "Single-Leg Slider Curl", level: "expert", equipment: "Sliders", cue: "Keep hips lifted while one heel moves." }
  ],
  calves: [
    { name: "Bodyweight Calf Raise", level: "beginner", equipment: "No equipment", cue: "Rise high onto the toes and lower slowly." },
    { name: "Bent-Knee Calf Raise", level: "beginner", equipment: "No equipment", cue: "Keep knees bent to bias the soleus." },
    { name: "Eccentric Calf Lowering", level: "beginner", equipment: "Step", cue: "Use both feet up and one foot down slowly." },
    { name: "Toe Walk", level: "beginner", equipment: "No equipment", cue: "Walk tall on the balls of the feet." },
    { name: "Leg Press Calf Raise", level: "intermediate", equipment: "Machine", cue: "Press through the balls of the feet on the sled." },
    { name: "Smith Machine Calf Raise", level: "intermediate", equipment: "Machine", cue: "Keep knees soft and control the stretch." },
    { name: "Jump Rope", level: "intermediate", equipment: "Jump rope", cue: "Use quick, quiet contacts on the balls of the feet." },
    { name: "Pogo Jump", level: "intermediate", equipment: "No equipment", cue: "Keep knees mostly straight and bounce through the ankles." },
    { name: "Weighted Single-Leg Calf Raise", level: "expert", equipment: "Dumbbell", cue: "Use a full stretch and avoid ankle rolling." },
    { name: "Tibialis Raise", level: "expert", equipment: "Wall", cue: "Lift toes toward shins while heels stay planted." }
  ],
  feetAnkles: [
    { name: "Short Foot Drill", level: "beginner", equipment: "No equipment", cue: "Pull the ball of the foot toward the heel without curling toes." },
    { name: "Towel Curl", level: "beginner", equipment: "Towel", cue: "Scrunch the towel with the toes while heel stays down." },
    { name: "Marble Pickup", level: "beginner", equipment: "No equipment", cue: "Pick up small objects with the toes under control." },
    { name: "Heel Walk", level: "beginner", equipment: "No equipment", cue: "Walk on heels with toes lifted." },
    { name: "Toe Walk", level: "beginner", equipment: "No equipment", cue: "Walk on the balls of the feet with tall posture." },
    { name: "Ankle Dorsiflexion Mobilization", level: "beginner", equipment: "Wall", cue: "Drive the knee toward the wall without the heel lifting." },
    { name: "Band Resisted Dorsiflexion", level: "intermediate", equipment: "Band", cue: "Pull toes toward shin against band tension." },
    { name: "Band Resisted Plantarflexion", level: "intermediate", equipment: "Band", cue: "Point the toes away under control." },
    { name: "Band Resisted Inversion", level: "intermediate", equipment: "Band", cue: "Turn the sole inward without moving the knee." },
    { name: "Single-Leg Balance", level: "intermediate", equipment: "No equipment", cue: "Keep tripod foot pressure while standing on one leg." },
    { name: "Balance Board Hold", level: "intermediate", equipment: "Balance board", cue: "Keep the board level with small ankle corrections." },
    { name: "Ankle Hop", level: "expert", equipment: "No equipment", cue: "Hop lightly using ankle stiffness and quiet landings." },
    { name: "Lateral Bound Stick", level: "expert", equipment: "No equipment", cue: "Land softly and hold balance before the next rep." }
  ]
};

function mergeExerciseLists(baseExercises, extraExercises = []) {
  const seen = new Set(baseExercises.map((exercise) => exercise.name.toLowerCase()));
  const merged = [...baseExercises];

  extraExercises.forEach((exercise) => {
    const key = exercise.name.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    merged.push(exercise);
  });

  return merged;
}

MUSCLES.forEach((muscle) => {
  muscle.exercises = mergeExerciseLists(muscle.exercises, ADDITIONAL_EXERCISES_BY_MUSCLE[muscle.id]);
});

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

const equipmentNameMap = new Map([
  ["ab wheel", "Ab Wheel"],
  ["anchor", "Anchor"],
  ["balance board", "Balance Board"],
  ["ball", "Ball"],
  ["band", "Band"],
  ["barbell", "Barbell"],
  ["bench", "Bench"],
  ["box", "Box"],
  ["bosu trainer", "BOSU Trainer"],
  ["cable", "Cable"],
  ["dip bars", "Dip Bars"],
  ["dowel", "Dowel"],
  ["dumbbell", "Dumbbells"],
  ["dumbbells", "Dumbbells"],
  ["ez bar", "EZ Bar"],
  ["floor", "Floor"],
  ["glute-ham developer", "Glute-Ham Developer"],
  ["hand gripper", "Hand Gripper"],
  ["hand resistance", "Hand Resistance"],
  ["heavy ropes", "Heavy Ropes"],
  ["jump rope", "Jump Rope"],
  ["kettlebell", "Kettlebell"],
  ["landmine", "Landmine"],
  ["machine", "Machine"],
  ["mat", "Mat"],
  ["medicine ball", "Medicine Ball"],
  ["mini band", "Mini Band"],
  ["neck harness", "Neck Harness"],
  ["no equipment", "No Equipment"],
  ["plate", "Plate"],
  ["pull-up bar", "Pull-Up Bar"],
  ["raised platform", "Raised Platform"],
  ["roman chair", "Roman Chair"],
  ["rings", "Rings"],
  ["sliders", "Sliders"],
  ["stability ball", "Stability Ball"],
  ["step", "Step"],
  ["towel", "Towel"],
  ["trap bar", "Trap Bar"],
  ["trx", "TRX"],
  ["wall", "Wall"],
  ["wedge", "Wedge"],
  ["wrist roller", "Wrist Roller"]
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

export const STRETCH_ROUTINE = [
  {
    id: "warmup",
    phase: "Warm Up",
    time: "3-5 min",
    intent: "Raise temperature before longer holds.",
    stretches: [
      {
        name: "Easy Walk or March",
        area: "Whole body",
        hold: "2 min",
        steps: "Move at an easy pace until breathing warms up and joints feel less stiff."
      },
      {
        name: "Arm Circles",
        area: "Shoulders",
        hold: "30 sec each direction",
        steps: "Circle from small to medium ranges while ribs stay stacked over hips."
      },
      {
        name: "Hip Circles",
        area: "Hips",
        hold: "30 sec each direction",
        steps: "Stand tall and draw smooth circles with the hips without forcing the low back."
      }
    ]
  },
  {
    id: "neck-shoulders",
    phase: "Neck, Chest, and Shoulders",
    time: "5-6 min",
    intent: "Undo desk posture and improve overhead comfort.",
    stretches: [
      {
        name: "Chin Tuck",
        area: "Neck",
        hold: "6 slow reps",
        steps: "Glide the chin straight back, pause briefly, then return to neutral."
      },
      {
        name: "Upper Trap Stretch",
        area: "Neck",
        hold: "30 sec each side",
        steps: "Let one ear move toward the same shoulder while the opposite shoulder stays heavy."
      },
      {
        name: "Doorway Pec Stretch",
        area: "Chest",
        hold: "30 sec each side",
        steps: "Place forearm on a doorway and turn the chest away until the front shoulder opens."
      },
      {
        name: "Cross-Body Shoulder Stretch",
        area: "Rear shoulder",
        hold: "30 sec each side",
        steps: "Draw one arm across the body without shrugging the shoulder toward the ear."
      },
      {
        name: "Lat Wall Reach",
        area: "Lats",
        hold: "30 sec each side",
        steps: "Hinge back with hands on a wall or counter and breathe into the side ribs."
      }
    ]
  },
  {
    id: "spine-core",
    phase: "Spine and Core",
    time: "4-5 min",
    intent: "Move the spine gently before deeper hip and leg work.",
    stretches: [
      {
        name: "Cat-Cow",
        area: "Spine",
        hold: "8 slow reps",
        steps: "Round and arch the spine smoothly while moving with the breath."
      },
      {
        name: "Child's Pose Reach",
        area: "Back and shoulders",
        hold: "45 sec",
        steps: "Sit hips back, reach arms forward, and let the rib cage soften toward the floor."
      },
      {
        name: "Thread the Needle",
        area: "Upper back",
        hold: "30 sec each side",
        steps: "Slide one arm under the body and rotate through the upper back."
      },
      {
        name: "Open Book Rotation",
        area: "Thoracic spine",
        hold: "6 reps each side",
        steps: "Lie on one side and rotate the top arm open while knees stay stacked."
      }
    ]
  },
  {
    id: "hips",
    phase: "Hips and Glutes",
    time: "5-6 min",
    intent: "Restore hip rotation and extension for walking, lifting, and sitting recovery.",
    stretches: [
      {
        name: "Half-Kneeling Hip Flexor Stretch",
        area: "Hip flexors",
        hold: "30 sec each side",
        steps: "Tuck the pelvis slightly and shift forward until the front of the hip opens."
      },
      {
        name: "Figure Four Stretch",
        area: "Glutes",
        hold: "30 sec each side",
        steps: "Cross ankle over opposite thigh and draw the legs toward the chest."
      },
      {
        name: "90/90 Hip Switch",
        area: "Hip rotation",
        hold: "8 slow reps",
        steps: "Move between seated 90/90 positions without rushing or forcing the knees."
      },
      {
        name: "Adductor Rock Back",
        area: "Inner thighs",
        hold: "8 reps each side",
        steps: "Extend one leg to the side from hands and knees, then rock hips back gently."
      }
    ]
  },
  {
    id: "legs",
    phase: "Legs",
    time: "6-8 min",
    intent: "Cover the big lower-body muscle groups that tighten from training or sitting.",
    stretches: [
      {
        name: "Standing Quad Stretch",
        area: "Quads",
        hold: "30 sec each side",
        steps: "Pull heel toward glute, keep knees close, and avoid arching the low back."
      },
      {
        name: "Hamstring Strap Stretch",
        area: "Hamstrings",
        hold: "30 sec each side",
        steps: "Lie down, raise one leg with a strap or towel, and keep the knee softly bent."
      },
      {
        name: "Runner's Calf Stretch",
        area: "Calves",
        hold: "30 sec each side",
        steps: "Press the back heel down with the rear knee straight."
      },
      {
        name: "Bent-Knee Soleus Stretch",
        area: "Lower calves",
        hold: "30 sec each side",
        steps: "Bend the back knee while keeping the heel down to target the deeper calf."
      },
      {
        name: "Deep Squat Hold",
        area: "Hips and ankles",
        hold: "30-60 sec",
        steps: "Sit into a comfortable squat, keep heels supported if needed, and breathe."
      }
    ]
  },
  {
    id: "feet",
    phase: "Feet and Ankles",
    time: "3-4 min",
    intent: "Keep the base of the body mobile and responsive.",
    stretches: [
      {
        name: "Knee-to-Wall Ankle Mobilization",
        area: "Ankles",
        hold: "8 reps each side",
        steps: "Drive the knee toward the wall while the heel stays planted."
      },
      {
        name: "Toe Extension Stretch",
        area: "Feet",
        hold: "30 sec each side",
        steps: "Tuck toes under gently and sit back only as far as comfortable."
      },
      {
        name: "Plantar Fascia Roll",
        area: "Foot arch",
        hold: "45 sec each side",
        steps: "Roll the arch over a ball or bottle using light to moderate pressure."
      }
    ]
  }
];

export const FOOD_GROUPS = [
  {
    id: "protein",
    label: "Protein",
    theme: "#e25555",
    description: "Meat, seafood, eggs, soy, and other protein-rich foods for repair and satiety."
  },
  {
    id: "vegetables",
    label: "Vegetables",
    theme: "#56a05a",
    description: "Colorful, fiber-rich plants that bring minerals, vitamins, and volume."
  },
  {
    id: "fruits",
    label: "Fruits",
    theme: "#f28d35",
    description: "Naturally sweet carbohydrate sources with fluid, fiber, and antioxidants."
  },
  {
    id: "grains",
    label: "Whole Grains and Starches",
    theme: "#d49b2a",
    description: "Fiber-rich carbohydrates that pair well with protein around training."
  },
  {
    id: "dairy",
    label: "Dairy and Fortified Alternatives",
    theme: "#3578bf",
    description: "Calcium, protein, and vitamin D options, including fortified non-dairy choices."
  },
  {
    id: "fats",
    label: "Healthy Fats",
    theme: "#8f7bdc",
    description: "Nuts, seeds, oils, and whole-food fats that help meals stay satisfying."
  },
  {
    id: "hydration",
    label: "Hydration",
    theme: "#2f9b85",
    description: "Water and low-sugar fluids that support daily training and recovery."
  }
];

export const NUTRIENT_CATEGORIES = [
  { id: "macros", label: "Macros and Fiber", theme: "#2f7f68" },
  { id: "vitamins", label: "Vitamins", theme: "#d88324" },
  { id: "minerals", label: "Minerals", theme: "#3e70ad" }
];

// FDA Daily Values are general label references for adults and children age 4+.
export const NUTRIENTS = [
  {
    id: "protein",
    name: "Protein",
    category: "macros",
    dailyValue: 50,
    unit: "g",
    role: "Builds and repairs muscle and other tissues and helps make enzymes and hormones.",
    foodIds: ["chicken-breast", "turkey", "salmon", "tuna", "sardines", "shrimp", "eggs", "lean-beef", "pork-tenderloin", "tofu", "tempeh", "edamame", "lentils", "black-beans", "chickpeas", "greek-yogurt", "cottage-cheese", "milk", "kefir", "soy-milk"]
  },
  {
    id: "fiber",
    name: "Dietary Fiber",
    category: "macros",
    dailyValue: 28,
    unit: "g",
    role: "Supports digestion, fullness, blood sugar management, and healthy cholesterol levels.",
    foodIds: ["lentils", "black-beans", "chickpeas", "edamame", "broccoli", "brussels-sprouts", "apple", "kiwi", "avocado-fruit", "oats", "barley", "whole-grain-pasta", "chia-seeds", "flaxseed"]
  },
  {
    id: "vitamin-a",
    name: "Vitamin A",
    category: "vitamins",
    dailyValue: 900,
    unit: "mcg RAE",
    role: "Supports normal vision, immune function, growth, and cell development.",
    foodIds: ["spinach", "kale", "bell-pepper", "carrots", "mango", "sweet-potato", "cheddar"]
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    category: "vitamins",
    dailyValue: 90,
    unit: "mg",
    role: "Helps form collagen, supports immune function, and improves absorption of plant iron.",
    foodIds: ["kale", "broccoli", "bell-pepper", "tomatoes", "brussels-sprouts", "bok-choy", "strawberries", "orange", "pineapple", "mango", "kiwi", "sweet-potato", "potatoes"]
  },
  {
    id: "vitamin-d",
    name: "Vitamin D",
    category: "vitamins",
    dailyValue: 20,
    unit: "mcg",
    role: "Helps the body absorb calcium and supports bones, muscles, nerves, and immune function.",
    foodIds: ["salmon", "sardines", "eggs", "milk", "soy-milk", "almond-milk"]
  },
  {
    id: "vitamin-e",
    name: "Vitamin E",
    category: "vitamins",
    dailyValue: 15,
    unit: "mg",
    role: "Acts as an antioxidant and supports immune function and cell health.",
    foodIds: ["almonds", "olive-oil", "olives", "almond-milk", "spinach", "avocado-fruit"]
  },
  {
    id: "vitamin-k",
    name: "Vitamin K",
    category: "vitamins",
    dailyValue: 120,
    unit: "mcg",
    role: "Supports normal blood clotting and helps maintain healthy bones.",
    foodIds: ["spinach", "kale", "broccoli", "asparagus", "brussels-sprouts", "bok-choy", "green-beans", "cucumber", "grapes", "kiwi"]
  },
  {
    id: "vitamin-b6",
    name: "Vitamin B6",
    category: "vitamins",
    dailyValue: 1.7,
    unit: "mg",
    role: "Helps convert food into energy and supports brain development and immune function.",
    foodIds: ["salmon", "tuna", "chicken-breast", "turkey", "pork-tenderloin", "banana", "potatoes", "chickpeas"]
  },
  {
    id: "vitamin-b12",
    name: "Vitamin B12",
    category: "vitamins",
    dailyValue: 2.4,
    unit: "mcg",
    role: "Helps form red blood cells and DNA and keeps nerve cells healthy.",
    foodIds: ["salmon", "tuna", "sardines", "shrimp", "eggs", "lean-beef", "greek-yogurt", "milk", "kefir", "cheddar", "mozzarella", "soy-milk", "almond-milk"]
  },
  {
    id: "folate",
    name: "Folate",
    category: "vitamins",
    dailyValue: 400,
    unit: "mcg DFE",
    role: "Supports DNA production and cell division and is especially important before and during pregnancy.",
    foodIds: ["edamame", "lentils", "black-beans", "chickpeas", "spinach", "broccoli", "asparagus", "brussels-sprouts", "beets", "orange", "mango", "avocado-fruit", "quinoa"]
  },
  {
    id: "calcium",
    name: "Calcium",
    category: "minerals",
    dailyValue: 1300,
    unit: "mg",
    role: "Builds bones and teeth and supports muscle contraction, nerves, and blood vessels.",
    foodIds: ["sardines", "tofu", "bok-choy", "greek-yogurt", "cottage-cheese", "milk", "kefir", "cheddar", "mozzarella", "soy-milk", "almond-milk", "tahini"]
  },
  {
    id: "iron",
    name: "Iron",
    category: "minerals",
    dailyValue: 18,
    unit: "mg",
    role: "Helps make hemoglobin, which carries oxygen from the lungs to the rest of the body.",
    foodIds: ["lean-beef", "tofu", "tempeh", "edamame", "lentils", "black-beans", "chickpeas", "spinach", "whole-wheat-bread", "whole-grain-pita", "pumpkin-seeds"]
  },
  {
    id: "magnesium",
    name: "Magnesium",
    category: "minerals",
    dailyValue: 420,
    unit: "mg",
    role: "Supports muscle and nerve function, blood glucose control, and energy production.",
    foodIds: ["tofu", "tempeh", "edamame", "black-beans", "spinach", "oats", "brown-rice", "quinoa", "buckwheat", "almonds", "walnuts", "peanut-butter", "chia-seeds", "pumpkin-seeds"]
  },
  {
    id: "potassium",
    name: "Potassium",
    category: "minerals",
    dailyValue: 4700,
    unit: "mg",
    role: "Supports fluid balance, nerve signals, muscle contraction, and healthy blood pressure.",
    foodIds: ["lentils", "bell-pepper", "carrots", "tomatoes", "banana", "orange", "kiwi", "avocado-fruit", "sweet-potato", "potatoes", "milk", "coconut-water"]
  },
  {
    id: "zinc",
    name: "Zinc",
    category: "minerals",
    dailyValue: 11,
    unit: "mg",
    role: "Supports immune function, wound healing, DNA production, growth, and taste.",
    foodIds: ["turkey", "lean-beef", "pork-tenderloin", "chickpeas", "farro", "pumpkin-seeds", "cheddar"]
  },
  {
    id: "selenium",
    name: "Selenium",
    category: "minerals",
    dailyValue: 55,
    unit: "mcg",
    role: "Supports thyroid function, reproduction, DNA production, and antioxidant defenses.",
    foodIds: ["chicken-breast", "turkey", "tuna", "shrimp", "pork-tenderloin", "mushrooms", "brown-rice", "barley", "cottage-cheese"]
  },
  {
    id: "choline",
    name: "Choline",
    category: "minerals",
    dailyValue: 550,
    unit: "mg",
    role: "Supports memory, mood, muscle control, cell membranes, and early brain development.",
    foodIds: ["eggs", "lean-beef", "chicken-breast", "salmon", "soy-milk", "cauliflower", "broccoli"]
  },
  {
    id: "iodine",
    name: "Iodine",
    category: "minerals",
    dailyValue: 150,
    unit: "mcg",
    role: "Helps the thyroid make hormones that regulate metabolism and development.",
    foodIds: ["tuna", "shrimp", "eggs", "milk", "greek-yogurt", "cottage-cheese"]
  },
  {
    id: "phosphorus",
    name: "Phosphorus",
    category: "minerals",
    dailyValue: 1250,
    unit: "mg",
    role: "Helps build bones and teeth and supports energy production and cell repair.",
    foodIds: ["chicken-breast", "salmon", "lean-beef", "lentils", "greek-yogurt", "milk", "cheddar", "mozzarella", "pumpkin-seeds"]
  }
];

export const FOODS = [
  { id: "chicken-breast", name: "Chicken Breast", group: "protein", serving: "3 oz cooked", calories: 165, protein: 31, carbs: 0, fat: 4, fiber: 0, nutrients: ["niacin", "selenium", "phosphorus"], tags: ["lean-protein", "recovery"] },
  { id: "turkey", name: "Turkey Breast", group: "protein", serving: "3 oz cooked", calories: 125, protein: 26, carbs: 0, fat: 2, fiber: 0, nutrients: ["B vitamins", "selenium", "zinc"], tags: ["lean-protein", "recovery"] },
  { id: "salmon", name: "Salmon", group: "protein", serving: "3 oz cooked", calories: 175, protein: 19, carbs: 0, fat: 11, fiber: 0, nutrients: ["omega-3 fats", "vitamin D", "B12"], tags: ["protein", "healthy-fat", "recovery"] },
  { id: "tuna", name: "Tuna", group: "protein", serving: "3 oz canned in water", calories: 110, protein: 24, carbs: 0, fat: 1, fiber: 0, nutrients: ["B12", "selenium", "iodine"], tags: ["lean-protein", "recovery"] },
  { id: "sardines", name: "Sardines", group: "protein", serving: "3 oz canned", calories: 190, protein: 21, carbs: 0, fat: 11, fiber: 0, nutrients: ["omega-3 fats", "calcium", "vitamin D"], tags: ["protein", "healthy-fat"] },
  { id: "shrimp", name: "Shrimp", group: "protein", serving: "3 oz cooked", calories: 85, protein: 20, carbs: 1, fat: 1, fiber: 0, nutrients: ["iodine", "selenium", "B12"], tags: ["lean-protein"] },
  { id: "eggs", name: "Eggs", group: "protein", serving: "2 large", calories: 140, protein: 13, carbs: 1, fat: 10, fiber: 0, nutrients: ["choline", "vitamin D", "B12"], tags: ["protein", "healthy-fat"] },
  { id: "lean-beef", name: "Lean Beef", group: "protein", serving: "3 oz cooked", calories: 180, protein: 25, carbs: 0, fat: 8, fiber: 0, nutrients: ["iron", "zinc", "B12"], tags: ["protein", "iron"] },
  { id: "pork-tenderloin", name: "Pork Tenderloin", group: "protein", serving: "3 oz cooked", calories: 125, protein: 22, carbs: 0, fat: 3, fiber: 0, nutrients: ["thiamin", "selenium", "B6"], tags: ["lean-protein"] },
  { id: "tofu", name: "Tofu", group: "protein", serving: "1/2 cup", calories: 180, protein: 20, carbs: 4, fat: 11, fiber: 2, nutrients: ["calcium", "iron", "magnesium"], tags: ["plant-protein", "iron"] },
  { id: "tempeh", name: "Tempeh", group: "protein", serving: "3 oz", calories: 160, protein: 16, carbs: 9, fat: 9, fiber: 5, nutrients: ["manganese", "iron", "magnesium"], tags: ["plant-protein", "fiber"] },
  { id: "edamame", name: "Edamame", group: "protein", serving: "1 cup shelled", calories: 190, protein: 18, carbs: 14, fat: 8, fiber: 8, nutrients: ["folate", "iron", "magnesium"], tags: ["plant-protein", "fiber"] },
  { id: "lentils", name: "Lentils", group: "protein", serving: "1 cup cooked", calories: 230, protein: 18, carbs: 40, fat: 1, fiber: 16, nutrients: ["folate", "iron", "potassium"], tags: ["plant-protein", "plant-iron", "fiber"] },
  { id: "black-beans", name: "Black Beans", group: "protein", serving: "1 cup cooked", calories: 225, protein: 15, carbs: 41, fat: 1, fiber: 15, nutrients: ["folate", "magnesium", "iron"], tags: ["plant-protein", "fiber", "carb"] },
  { id: "chickpeas", name: "Chickpeas", group: "protein", serving: "1 cup cooked", calories: 270, protein: 15, carbs: 45, fat: 4, fiber: 13, nutrients: ["folate", "manganese", "iron"], tags: ["plant-protein", "fiber"] },

  { id: "spinach", name: "Spinach", group: "vegetables", serving: "2 cups raw", calories: 15, protein: 2, carbs: 2, fat: 0, fiber: 1, nutrients: ["vitamin K", "folate", "magnesium"], tags: ["plant-iron", "leafy-green"] },
  { id: "kale", name: "Kale", group: "vegetables", serving: "1 cup raw", calories: 35, protein: 2, carbs: 7, fat: 1, fiber: 1, nutrients: ["vitamin K", "vitamin C", "beta carotene"], tags: ["leafy-green", "vitamin-c"] },
  { id: "broccoli", name: "Broccoli", group: "vegetables", serving: "1 cup cooked", calories: 55, protein: 4, carbs: 11, fat: 1, fiber: 5, nutrients: ["vitamin C", "vitamin K", "folate"], tags: ["vitamin-c", "fiber"] },
  { id: "bell-pepper", name: "Bell Pepper", group: "vegetables", serving: "1 medium", calories: 30, protein: 1, carbs: 7, fat: 0, fiber: 2, nutrients: ["vitamin C", "vitamin A", "potassium"], tags: ["vitamin-c", "color"] },
  { id: "carrots", name: "Carrots", group: "vegetables", serving: "1 cup", calories: 50, protein: 1, carbs: 12, fat: 0, fiber: 4, nutrients: ["beta carotene", "vitamin K", "potassium"], tags: ["color", "fiber"] },
  { id: "tomatoes", name: "Tomatoes", group: "vegetables", serving: "1 cup", calories: 30, protein: 1, carbs: 7, fat: 0, fiber: 2, nutrients: ["lycopene", "vitamin C", "potassium"], tags: ["vitamin-c", "color"] },
  { id: "asparagus", name: "Asparagus", group: "vegetables", serving: "1 cup cooked", calories: 40, protein: 4, carbs: 7, fat: 0, fiber: 4, nutrients: ["folate", "vitamin K", "prebiotic fiber"], tags: ["fiber", "prebiotic"] },
  { id: "brussels-sprouts", name: "Brussels Sprouts", group: "vegetables", serving: "1 cup cooked", calories: 55, protein: 4, carbs: 11, fat: 1, fiber: 4, nutrients: ["vitamin C", "vitamin K", "folate"], tags: ["vitamin-c", "fiber"] },
  { id: "cauliflower", name: "Cauliflower", group: "vegetables", serving: "1 cup cooked", calories: 30, protein: 2, carbs: 5, fat: 0, fiber: 3, nutrients: ["vitamin C", "choline", "folate"], tags: ["vitamin-c", "fiber"] },
  { id: "mushrooms", name: "Mushrooms", group: "vegetables", serving: "1 cup cooked", calories: 45, protein: 3, carbs: 8, fat: 0, fiber: 3, nutrients: ["selenium", "B vitamins", "copper"], tags: ["umami", "fiber"] },
  { id: "onions", name: "Onions", group: "vegetables", serving: "1 cup cooked", calories: 90, protein: 2, carbs: 21, fat: 0, fiber: 3, nutrients: ["quercetin", "vitamin C", "prebiotic fiber"], tags: ["prebiotic", "color"] },
  { id: "bok-choy", name: "Bok Choy", group: "vegetables", serving: "1 cup cooked", calories: 20, protein: 2, carbs: 3, fat: 0, fiber: 1, nutrients: ["calcium", "vitamin K", "vitamin C"], tags: ["vitamin-c", "leafy-green"] },
  { id: "green-beans", name: "Green Beans", group: "vegetables", serving: "1 cup cooked", calories: 45, protein: 2, carbs: 10, fat: 0, fiber: 4, nutrients: ["vitamin K", "vitamin C", "manganese"], tags: ["fiber"] },
  { id: "cucumber", name: "Cucumber", group: "vegetables", serving: "1 cup", calories: 15, protein: 1, carbs: 4, fat: 0, fiber: 1, nutrients: ["water", "vitamin K", "potassium"], tags: ["hydrating"] },
  { id: "beets", name: "Beets", group: "vegetables", serving: "1 cup cooked", calories: 75, protein: 3, carbs: 17, fat: 0, fiber: 3, nutrients: ["nitrates", "folate", "manganese"], tags: ["carb", "color"] },

  { id: "blueberries", name: "Blueberries", group: "fruits", serving: "1 cup", calories: 85, protein: 1, carbs: 21, fat: 0, fiber: 4, nutrients: ["anthocyanins", "vitamin C", "manganese"], tags: ["carb", "color"] },
  { id: "strawberries", name: "Strawberries", group: "fruits", serving: "1 cup", calories: 50, protein: 1, carbs: 12, fat: 0, fiber: 3, nutrients: ["vitamin C", "manganese", "polyphenols"], tags: ["vitamin-c", "color"] },
  { id: "banana", name: "Banana", group: "fruits", serving: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3, nutrients: ["potassium", "vitamin B6", "carbohydrate"], tags: ["carb", "pre-workout"] },
  { id: "apple", name: "Apple", group: "fruits", serving: "1 medium", calories: 95, protein: 0, carbs: 25, fat: 0, fiber: 4, nutrients: ["pectin fiber", "vitamin C", "polyphenols"], tags: ["fiber", "carb"] },
  { id: "orange", name: "Orange", group: "fruits", serving: "1 medium", calories: 60, protein: 1, carbs: 15, fat: 0, fiber: 3, nutrients: ["vitamin C", "potassium", "folate"], tags: ["vitamin-c", "carb"] },
  { id: "grapes", name: "Grapes", group: "fruits", serving: "1 cup", calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 1, nutrients: ["polyphenols", "vitamin K", "water"], tags: ["carb", "hydrating"] },
  { id: "pineapple", name: "Pineapple", group: "fruits", serving: "1 cup", calories: 80, protein: 1, carbs: 22, fat: 0, fiber: 2, nutrients: ["vitamin C", "manganese", "bromelain"], tags: ["vitamin-c", "carb"] },
  { id: "mango", name: "Mango", group: "fruits", serving: "1 cup", calories: 100, protein: 1, carbs: 25, fat: 1, fiber: 3, nutrients: ["vitamin C", "vitamin A", "folate"], tags: ["vitamin-c", "carb"] },
  { id: "kiwi", name: "Kiwi", group: "fruits", serving: "2 fruit", calories: 90, protein: 2, carbs: 22, fat: 1, fiber: 4, nutrients: ["vitamin C", "vitamin K", "potassium"], tags: ["vitamin-c", "fiber"] },
  { id: "avocado-fruit", name: "Avocado", group: "fruits", serving: "1/2 medium", calories: 120, protein: 1, carbs: 6, fat: 11, fiber: 5, nutrients: ["monounsaturated fat", "potassium", "folate"], tags: ["healthy-fat", "fiber"] },
  { id: "watermelon", name: "Watermelon", group: "fruits", serving: "2 cups", calories: 90, protein: 2, carbs: 23, fat: 0, fiber: 1, nutrients: ["water", "lycopene", "vitamin C"], tags: ["hydrating", "carb"] },
  { id: "cherries", name: "Cherries", group: "fruits", serving: "1 cup", calories: 95, protein: 2, carbs: 25, fat: 0, fiber: 3, nutrients: ["anthocyanins", "potassium", "vitamin C"], tags: ["color", "carb"] },

  { id: "oats", name: "Oats", group: "grains", serving: "1 cup cooked", calories: 155, protein: 6, carbs: 27, fat: 3, fiber: 4, nutrients: ["beta-glucan fiber", "manganese", "magnesium"], tags: ["whole-grain", "carb", "fiber"] },
  { id: "brown-rice", name: "Brown Rice", group: "grains", serving: "1 cup cooked", calories: 215, protein: 5, carbs: 45, fat: 2, fiber: 4, nutrients: ["manganese", "magnesium", "selenium"], tags: ["whole-grain", "carb"] },
  { id: "quinoa", name: "Quinoa", group: "grains", serving: "1 cup cooked", calories: 220, protein: 8, carbs: 39, fat: 4, fiber: 5, nutrients: ["magnesium", "manganese", "folate"], tags: ["whole-grain", "carb", "plant-protein"] },
  { id: "whole-wheat-bread", name: "Whole-Wheat Bread", group: "grains", serving: "2 slices", calories: 160, protein: 8, carbs: 28, fat: 2, fiber: 4, nutrients: ["fiber", "B vitamins", "iron"], tags: ["whole-grain", "carb"] },
  { id: "whole-grain-pita", name: "Whole-Grain Pita", group: "grains", serving: "1 medium", calories: 170, protein: 6, carbs: 35, fat: 2, fiber: 5, nutrients: ["fiber", "B vitamins", "iron"], tags: ["whole-grain", "carb"] },
  { id: "sweet-potato", name: "Sweet Potato", group: "grains", serving: "1 medium", calories: 115, protein: 2, carbs: 27, fat: 0, fiber: 4, nutrients: ["beta carotene", "potassium", "vitamin C"], tags: ["carb", "fiber", "color"] },
  { id: "potatoes", name: "Potatoes", group: "grains", serving: "1 medium", calories: 160, protein: 4, carbs: 37, fat: 0, fiber: 4, nutrients: ["potassium", "vitamin C", "B6"], tags: ["carb", "potassium"] },
  { id: "barley", name: "Barley", group: "grains", serving: "1 cup cooked", calories: 195, protein: 4, carbs: 44, fat: 1, fiber: 6, nutrients: ["beta-glucan fiber", "selenium", "manganese"], tags: ["whole-grain", "fiber"] },
  { id: "farro", name: "Farro", group: "grains", serving: "1 cup cooked", calories: 200, protein: 8, carbs: 40, fat: 2, fiber: 5, nutrients: ["magnesium", "zinc", "B vitamins"], tags: ["whole-grain", "carb"] },
  { id: "corn-tortilla", name: "Corn Tortillas", group: "grains", serving: "2 small", calories: 120, protein: 3, carbs: 24, fat: 2, fiber: 3, nutrients: ["magnesium", "fiber", "calcium"], tags: ["carb"] },
  { id: "whole-grain-pasta", name: "Whole-Grain Pasta", group: "grains", serving: "1 cup cooked", calories: 175, protein: 7, carbs: 37, fat: 1, fiber: 6, nutrients: ["fiber", "manganese", "B vitamins"], tags: ["whole-grain", "carb"] },
  { id: "buckwheat", name: "Buckwheat", group: "grains", serving: "1 cup cooked", calories: 155, protein: 6, carbs: 34, fat: 1, fiber: 5, nutrients: ["magnesium", "manganese", "rutin"], tags: ["whole-grain", "carb"] },

  { id: "greek-yogurt", name: "Greek Yogurt", group: "dairy", serving: "3/4 cup plain", calories: 130, protein: 18, carbs: 7, fat: 3, fiber: 0, nutrients: ["calcium", "B12", "probiotics"], tags: ["protein", "calcium", "recovery"] },
  { id: "cottage-cheese", name: "Cottage Cheese", group: "dairy", serving: "1/2 cup", calories: 110, protein: 14, carbs: 5, fat: 4, fiber: 0, nutrients: ["casein protein", "calcium", "selenium"], tags: ["protein", "calcium"] },
  { id: "milk", name: "Milk", group: "dairy", serving: "1 cup", calories: 120, protein: 8, carbs: 12, fat: 5, fiber: 0, nutrients: ["calcium", "vitamin D", "B12"], tags: ["protein", "calcium"] },
  { id: "kefir", name: "Kefir", group: "dairy", serving: "1 cup plain", calories: 110, protein: 9, carbs: 12, fat: 2, fiber: 0, nutrients: ["probiotics", "calcium", "B12"], tags: ["calcium", "probiotic"] },
  { id: "cheddar", name: "Cheddar Cheese", group: "dairy", serving: "1 oz", calories: 115, protein: 7, carbs: 1, fat: 9, fiber: 0, nutrients: ["calcium", "phosphorus", "vitamin A"], tags: ["calcium", "fat"] },
  { id: "mozzarella", name: "Mozzarella", group: "dairy", serving: "1 oz", calories: 85, protein: 6, carbs: 1, fat: 6, fiber: 0, nutrients: ["calcium", "phosphorus", "B12"], tags: ["calcium", "protein"] },
  { id: "soy-milk", name: "Fortified Soy Milk", group: "dairy", serving: "1 cup", calories: 100, protein: 7, carbs: 8, fat: 4, fiber: 2, nutrients: ["calcium", "vitamin D", "B12"], tags: ["plant-protein", "calcium"] },
  { id: "almond-milk", name: "Fortified Almond Milk", group: "dairy", serving: "1 cup", calories: 40, protein: 1, carbs: 2, fat: 3, fiber: 1, nutrients: ["calcium", "vitamin D", "vitamin E"], tags: ["calcium"] },

  { id: "olive-oil", name: "Olive Oil", group: "fats", serving: "1 tbsp", calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0, nutrients: ["monounsaturated fat", "polyphenols", "vitamin E"], tags: ["healthy-fat", "fat-soluble"] },
  { id: "almonds", name: "Almonds", group: "fats", serving: "1 oz", calories: 165, protein: 6, carbs: 6, fat: 14, fiber: 4, nutrients: ["vitamin E", "magnesium", "monounsaturated fat"], tags: ["healthy-fat", "fiber"] },
  { id: "walnuts", name: "Walnuts", group: "fats", serving: "1 oz", calories: 185, protein: 4, carbs: 4, fat: 18, fiber: 2, nutrients: ["ALA omega-3", "magnesium", "polyphenols"], tags: ["healthy-fat"] },
  { id: "peanut-butter", name: "Peanut Butter", group: "fats", serving: "2 tbsp", calories: 190, protein: 8, carbs: 7, fat: 16, fiber: 2, nutrients: ["niacin", "magnesium", "healthy fats"], tags: ["healthy-fat", "protein"] },
  { id: "chia-seeds", name: "Chia Seeds", group: "fats", serving: "2 tbsp", calories: 140, protein: 5, carbs: 12, fat: 9, fiber: 10, nutrients: ["ALA omega-3", "fiber", "magnesium"], tags: ["healthy-fat", "fiber"] },
  { id: "flaxseed", name: "Ground Flaxseed", group: "fats", serving: "2 tbsp", calories: 75, protein: 3, carbs: 4, fat: 6, fiber: 4, nutrients: ["ALA omega-3", "lignans", "fiber"], tags: ["healthy-fat", "fiber"] },
  { id: "pumpkin-seeds", name: "Pumpkin Seeds", group: "fats", serving: "1 oz", calories: 160, protein: 8, carbs: 5, fat: 14, fiber: 2, nutrients: ["magnesium", "zinc", "iron"], tags: ["healthy-fat", "plant-iron"] },
  { id: "tahini", name: "Tahini", group: "fats", serving: "1 tbsp", calories: 90, protein: 3, carbs: 3, fat: 8, fiber: 1, nutrients: ["calcium", "copper", "sesame lignans"], tags: ["healthy-fat"] },
  { id: "olives", name: "Olives", group: "fats", serving: "1/4 cup", calories: 40, protein: 0, carbs: 2, fat: 4, fiber: 1, nutrients: ["monounsaturated fat", "vitamin E", "polyphenols"], tags: ["healthy-fat"] },

  { id: "water", name: "Water", group: "hydration", serving: "12 oz", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, nutrients: ["hydration"], tags: ["hydrating"] },
  { id: "sparkling-water", name: "Sparkling Water", group: "hydration", serving: "12 oz", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, nutrients: ["hydration"], tags: ["hydrating"] },
  { id: "unsweet-tea", name: "Unsweetened Tea", group: "hydration", serving: "12 oz", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, nutrients: ["polyphenols", "fluid"], tags: ["hydrating"] },
  { id: "coffee", name: "Coffee", group: "hydration", serving: "8 oz black", calories: 5, protein: 0, carbs: 0, fat: 0, fiber: 0, nutrients: ["caffeine", "polyphenols", "fluid"], tags: ["hydrating"] },
  { id: "coconut-water", name: "Coconut Water", group: "hydration", serving: "1 cup", calories: 45, protein: 0, carbs: 11, fat: 0, fiber: 0, nutrients: ["potassium", "fluid", "carbohydrate"], tags: ["hydrating", "carb"] }
];

export const FOOD_PAIRINGS = [
  { id: "oats-yogurt-berries", name: "Oats + Greek Yogurt + Blueberries", foods: ["oats", "greek-yogurt", "blueberries"], reason: "Whole-grain carbs, protein, and fiber make a strong breakfast or post-training bowl." },
  { id: "salmon-potato-asparagus", name: "Salmon + Sweet Potato + Asparagus", foods: ["salmon", "sweet-potato", "asparagus"], reason: "Protein and omega-3 fats pair with training carbs and fiber-rich vegetables." },
  { id: "lentils-pepper", name: "Lentils + Bell Pepper", foods: ["lentils", "bell-pepper"], reason: "Vitamin C-rich peppers help round out a plant-iron, high-fiber meal." },
  { id: "spinach-strawberries-walnuts", name: "Spinach + Strawberries + Walnuts", foods: ["spinach", "strawberries", "walnuts"], reason: "Vitamin C, leafy greens, and fats create a nutrient-dense salad pairing." },
  { id: "chicken-quinoa-broccoli", name: "Chicken + Quinoa + Broccoli", foods: ["chicken-breast", "quinoa", "broccoli"], reason: "Lean protein, complex carbs, and vegetables cover recovery basics." },
  { id: "rice-beans-avocado", name: "Brown Rice + Black Beans + Avocado", foods: ["brown-rice", "black-beans", "avocado-fruit"], reason: "Grain plus beans improves the meal's amino acid spread; avocado adds satisfying fats." },
  { id: "eggs-toast-tomatoes", name: "Eggs + Whole-Wheat Toast + Tomatoes", foods: ["eggs", "whole-wheat-bread", "tomatoes"], reason: "Protein, whole-grain carbs, and vitamin C-rich produce work well together." },
  { id: "cottage-pineapple", name: "Cottage Cheese + Pineapple", foods: ["cottage-cheese", "pineapple"], reason: "Slow-digesting dairy protein pairs with fruit carbohydrate for a simple snack." },
  { id: "tofu-rice-bok-choy", name: "Tofu + Brown Rice + Bok Choy", foods: ["tofu", "brown-rice", "bok-choy"], reason: "Plant protein, whole-grain carbs, and calcium-rich greens make a balanced plate." },
  { id: "banana-peanut-butter", name: "Banana + Peanut Butter", foods: ["banana", "peanut-butter"], reason: "Quick carbohydrate plus fat and protein works as a small pre-workout snack." },
  { id: "hummus-pita-carrots", name: "Chickpeas + Whole-Grain Pita + Carrots", foods: ["chickpeas", "whole-grain-pita", "carrots"], reason: "Beans, grains, and colorful vegetables give fiber and steady energy." },
  { id: "yogurt-almonds-kiwi", name: "Greek Yogurt + Almonds + Kiwi", foods: ["greek-yogurt", "almonds", "kiwi"], reason: "Protein, healthy fats, and vitamin C make a compact recovery snack." },
  { id: "beef-potato-brussels", name: "Lean Beef + Potatoes + Brussels Sprouts", foods: ["lean-beef", "potatoes", "brussels-sprouts"], reason: "Iron-rich protein pairs with potassium-rich carbs and vitamin C vegetables." },
  { id: "sardines-crackers-cucumber", name: "Sardines + Whole-Grain Pita + Cucumber", foods: ["sardines", "whole-grain-pita", "cucumber"], reason: "Omega-3 protein, whole-grain carbohydrate, and hydrating crunch pair cleanly." },
  { id: "edamame-orange-rice", name: "Edamame + Orange + Brown Rice", foods: ["edamame", "orange", "brown-rice"], reason: "Plant protein and carbohydrate pair with vitamin C for a portable meal." }
];

export const WORK_ACTIVITY_LEVELS = [
  { id: "desk", label: "Desk / mostly seated", met: 1.5 },
  { id: "standing", label: "Standing / light errands", met: 2.3 },
  { id: "walking", label: "Walking / active shift", met: 3 },
  { id: "labor", label: "Manual labor", met: 4.5 },
  { id: "heavy", label: "Heavy labor", met: 6 }
];

export const EXERCISE_ACTIVITY_LEVELS = [
  { id: "mobility", label: "Stretching / mobility", met: 2.3 },
  { id: "walking", label: "Brisk walk", met: 3.5 },
  { id: "strength", label: "Strength training", met: 5 },
  { id: "cardio", label: "Moderate cardio", met: 7 },
  { id: "hiit", label: "Running / HIIT", met: 10 }
];

export function getFood(id) {
  return FOODS.find((food) => food.id === id);
}
