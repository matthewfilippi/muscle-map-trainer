import "./styles.css";
import { BodyScene } from "./bodyScene.js";
import { BODY_SYSTEMS } from "./bodySystems.js";
import {
  EXERCISE_ACTIVITY_LEVELS,
  FOOD_GROUPS,
  FOOD_PAIRINGS,
  FOODS,
  LEVELS,
  MUSCLES,
  SPLITS,
  STRETCH_ROUTINE,
  WORK_ACTIVITY_LEVELS,
  getActiveSplits,
  getCompatibleSplitIds,
  getEquipmentIdsForMuscles,
  getEquipmentOptions,
  getExercisePool,
  getFood,
  getMuscle
} from "./data.js";
import { FOOD_NUTRIENT_PROFILES, SPECIAL_NUTRIENT_GUIDANCE } from "./foodNutrition.js";
import {
  NUTRIENT_CATEGORIES,
  NUTRIENTS,
  getDriGroup,
  getNutrientTarget,
  normalizeNutritionProfile
} from "./nutrition.js";
import { renderOrganizerPage } from "./organizerPages.js";
import {
  CUSTOM_ROUTINE_STORAGE_KEY,
  analyzeRoutine,
  createRoutineItem,
  getDefaultCustomRoutine,
  normalizeCustomRoutine
} from "./routineBuilder.js";
import { choosePairingCounterSuggestion } from "./pairingSuggestions.js";

const PAGES = new Set([
  "body",
  "muscles",
  "routine",
  "stretches",
  "food",
  "pairings",
  "nutrients",
  "grocery",
  "records",
  "inventory",
  "tasks"
]);
const ORGANIZER_PAGES = new Set(["grocery", "records", "inventory", "tasks"]);
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const NUTRIENT_LOG_KEY = "wellness-map-nutrient-log";
const NUTRITION_PROFILE_KEY = "wellness-map-nutrition-profile";
const FOOD_PLATE_KEY = "wellness-map-food-plate";
const DEFAULT_PLATE = ["chicken-breast", "quinoa", "broccoli"];
const DEFAULT_PAIRING_FOODS = ["lentils", "bell-pepper", "olive-oil"];
const PAIRING_GOALS = [
  { id: "absorption", label: "Absorption", cue: "maximize usable micronutrients" },
  { id: "bloodSugar", label: "Blood sugar", cue: "smooth carbohydrate entry" },
  { id: "gut", label: "Gut microbiome", cue: "feed and diversify gut microbes" },
  { id: "recovery", label: "Recovery", cue: "combine protein, carbs, and anti-inflammatory support" },
  { id: "antiNutrients", label: "Anti-nutrients", cue: "reduce mineral-binding effects" },
  { id: "bioactives", label: "Bioactives", cue: "stack helpful plant compounds" }
];
const PAIRING_PREP_OPTIONS = [
  { id: "standard", label: "Standard prep" },
  { id: "soaked", label: "Soaked or rinsed" },
  { id: "fermented", label: "Fermented" },
  { id: "cooked", label: "Cooked" },
  { id: "acid", label: "Acid added" }
];
const PAIRING_ORDER_OPTIONS = [
  { id: "balanced", label: "Mixed meal" },
  { id: "fiberFirst", label: "Fiber first" },
  { id: "carbsFirst", label: "Carbs first" }
];
const EXERCISE_GUIDES = {
  "Glute Bridge": {
    src: "./exercise-guides/glute-bridge-technique-anatomy.webp",
    alt: "Glute Bridge technique and anatomy guide"
  },
  "Step-Up": {
    src: "./exercise-guides/step-up-technique-anatomy.webp",
    alt: "Step-Up technique and anatomy guide"
  },
  "Barbell Hip Thrust": {
    src: "./exercise-guides/barbell-hip-thrust-technique-anatomy.webp",
    alt: "Barbell Hip Thrust technique and anatomy guide"
  },
  "Bulgarian Split Squat": {
    src: "./exercise-guides/bulgarian-split-squat-technique-anatomy.webp",
    alt: "Bulgarian Split Squat technique and anatomy guide"
  }
};

function renderExerciseGuideDetails(exercise, muscle) {
  const level = LEVELS[exercise.level] ?? LEVELS.beginner;
  return `
    <section class="exercise-guide-summary" aria-label="Exercise summary">
      <div><span>Primary area</span><strong>${muscle.name}</strong></div>
      <div><span>Level</span><strong>${level.label}</strong></div>
      <div><span>Equipment</span><strong>${exercise.equipment}</strong></div>
      <div><span>Workout position</span><strong>${muscle.region}</strong></div>
    </section>
    <div class="exercise-guide-detail-grid">
      <section>
        <p>Technique</p>
        <h3>Form check</h3>
        <ul>
          <li>${exercise.cue}</li>
          <li>Use a stable setup and a range of motion you can control.</li>
          <li>Keep the working joints aligned and finish each repetition without momentum.</li>
          <li>Match breathing to the movement and avoid holding your breath unnecessarily.</li>
        </ul>
      </section>
      <section>
        <p>Programming</p>
        <h3>${level.sets} sets · ${level.reps} reps</h3>
        <dl>
          <div><dt>Effort</dt><dd>${level.note}</dd></div>
          <div><dt>Rest</dt><dd>${level.rest}</dd></div>
          <div><dt>Frequency</dt><dd>Count total weekly work for ${muscle.name.toLowerCase()} and allow recovery before repeating hard sessions.</dd></div>
        </dl>
      </section>
      <section>
        <p>Scale it</p>
        <h3>Adjust one variable</h3>
        <dl>
          <div><dt>Regress</dt><dd>Reduce resistance or range, slow the movement, or add stable support.</dd></div>
          <div><dt>Progress</dt><dd>Add load, repetitions, range, or tempo only while the same form remains repeatable.</dd></div>
          <div><dt>Substitute</dt><dd>Choose another ${muscle.name.toLowerCase()} exercise that fits your equipment and movement tolerance.</dd></div>
        </dl>
      </section>
      <section>
        <p>Safety</p>
        <h3>Know when to adjust</h3>
        <ul>
          <li>Stop for sharp pain, new numbness, faintness, chest pain, or unusual shortness of breath.</li>
          <li>Reduce the challenge when alignment, balance, breathing, or control begins to break down.</li>
          <li>Use a spotter or safety equipment whenever the setup or load makes an uncontrolled failure hazardous.</li>
        </ul>
      </section>
      <section class="exercise-guide-track">
        <p>Track</p>
        <h3>Record the repeatable details</h3>
        <div class="exercise-track-fields">
          <span>Load or resistance</span><span>Sets and reps</span><span>Range of motion</span><span>Tempo</span><span>RPE / reps in reserve</span><span>Form or symptom notes</span>
        </div>
      </section>
    </div>
  `;
}

function getCurrentWeekKey() {
  const monday = new Date();
  const dayIndex = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - dayIndex);
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const day = String(monday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadNutrientLog() {
  try {
    const stored = JSON.parse(localStorage.getItem(NUTRIENT_LOG_KEY));
    return stored?.week === getCurrentWeekKey() && stored.values && typeof stored.values === "object"
      ? stored.values
      : {};
  } catch {
    return {};
  }
}

function loadNutritionProfile() {
  try {
    return normalizeNutritionProfile(JSON.parse(localStorage.getItem(NUTRITION_PROFILE_KEY)) || {});
  } catch {
    return normalizeNutritionProfile({});
  }
}

function loadFoodPlate() {
  try {
    const stored = JSON.parse(localStorage.getItem(FOOD_PLATE_KEY));
    const selectedFoods = Array.isArray(stored?.foods)
      ? stored.foods.filter((id) => getFood(id))
      : DEFAULT_PLATE;
    const foodServings = Object.fromEntries(selectedFoods.map((id) => [
      id,
      Math.min(20, Math.max(0.05, Number(stored?.servings?.[id]) || 1))
    ]));
    return { selectedFoods, foodServings };
  } catch {
    return { selectedFoods: DEFAULT_PLATE, foodServings: Object.fromEntries(DEFAULT_PLATE.map((id) => [id, 1])) };
  }
}

function loadCustomRoutine() {
  try {
    return normalizeCustomRoutine(JSON.parse(localStorage.getItem(CUSTOM_ROUTINE_STORAGE_KEY)) || {});
  } catch {
    return getDefaultCustomRoutine();
  }
}

function saveCustomRoutine() {
  const routine = {
    name: appState.routineName,
    level: appState.level,
    targetMuscles: appState.selectedRoutineMuscles,
    selectedEquipment: appState.selectedEquipment,
    items: appState.routineItems
  };
  localStorage.setItem(CUSTOM_ROUTINE_STORAGE_KEY, JSON.stringify(normalizeCustomRoutine(routine)));
}

const savedPlate = loadFoodPlate();
const savedCustomRoutine = loadCustomRoutine();

const appState = {
  page: "body",
  selectedMuscle: "chest",
  visibleBodySystems: ["muscular"],
  routineName: savedCustomRoutine.name,
  selectedRoutineMuscles: savedCustomRoutine.targetMuscles,
  selectedEquipment: savedCustomRoutine.selectedEquipment,
  level: savedCustomRoutine.level,
  routineItems: savedCustomRoutine.items,
  routineSearch: "",
  completedStretches: [],
  foodGroup: "all",
  foodSearch: "",
  pairingSearch: "",
  selectedPairingFoods: DEFAULT_PAIRING_FOODS,
  pairingGoal: "absorption",
  pairingPrep: "standard",
  pairingOrder: "balanced",
  selectedFoods: savedPlate.selectedFoods,
  foodServings: savedPlate.foodServings,
  calorieWeight: 180,
  workHours: 8,
  workActivity: "desk",
  exerciseMinutes: 45,
  exerciseActivity: "strength",
  nutrientCategory: "all",
  selectedNutrient: "protein",
  nutrientLog: loadNutrientLog(),
  nutritionProfile: loadNutritionProfile()
};

let bodyScene = null;

const app = document.querySelector("#app");

function muscleName(id) {
  return getMuscle(id)?.name ?? id;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function routeFromHash() {
  const hash = window.location.hash.replace("#", "");

  if (hash.startsWith("muscles/")) {
    const muscleId = hash.split("/")[1];
    if (getMuscle(muscleId)) {
      appState.selectedMuscle = muscleId;
      return "muscles";
    }
  }

  return PAGES.has(hash) ? hash : "body";
}

function setPage(page) {
  appState.page = page;
  window.location.hash = page;
  render();
}

function setMusclePage(id) {
  if (!getMuscle(id)) return;
  appState.page = "muscles";
  appState.selectedMuscle = id;
  window.location.hash = `muscles/${id}`;
  render();
}

function selectMuscle(id) {
  appState.selectedMuscle = id;
  setMusclePage(id);
}

function getAvailableRoutineEquipmentIds() {
  return getEquipmentIdsForMuscles(appState.selectedRoutineMuscles, appState.level);
}

function pruneUnavailableEquipment() {
  const availableEquipmentIds = getAvailableRoutineEquipmentIds();
  appState.selectedEquipment = appState.selectedEquipment.filter((equipmentId) => availableEquipmentIds.has(equipmentId));
  return availableEquipmentIds;
}

function buildShell() {
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="#body" aria-label="Wellness Map home">
          <span class="brand-mark"></span>
          <span>Wellness Map</span>
        </a>
        <nav class="main-nav" aria-label="Primary">
          <button class="nav-button" data-page="body" type="button">Body Map</button>
          <div class="nav-dropdown">
            <button class="nav-button" data-page="muscles" type="button">Muscles</button>
            <div class="muscle-menu" aria-label="Muscle pages">
              ${MUSCLES.map((muscle) => `
                <a href="#muscles/${muscle.id}" data-muscle-link="${muscle.id}">
                  <span class="swatch" style="--swatch: ${muscle.color}"></span>
                  <span>${muscle.name}</span>
                </a>
              `).join("")}
            </div>
          </div>
          <button class="nav-button" data-page="routine" type="button">Routine Builder</button>
          <button class="nav-button" data-page="stretches" type="button">Stretches</button>
          <button class="nav-button" data-page="food" type="button">Food</button>
          <button class="nav-button" data-page="pairings" type="button">Pairings</button>
          <button class="nav-button" data-page="nutrients" type="button">Nutrients</button>
          <div class="nav-dropdown organizer-nav-dropdown">
            <button class="nav-button" data-page="records" data-page-group="organizer" type="button">Organize</button>
            <div class="muscle-menu organizer-menu" aria-label="Organizer pages">
              <button type="button" data-page="grocery">Grocery</button>
              <button type="button" data-page="records">Records</button>
              <button type="button" data-page="inventory">Inventory</button>
              <button type="button" data-page="tasks">Tasks</button>
            </div>
          </div>
        </nav>
      </header>
      <main id="pageRoot"></main>
    </div>
  `;

  app.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.page === "muscles") {
        setMusclePage(appState.selectedMuscle);
        return;
      }
      setPage(button.dataset.page);
    });
  });

  app.querySelectorAll("[data-muscle-link]").forEach((link) => {
    link.addEventListener("click", () => {
      appState.selectedMuscle = link.dataset.muscleLink;
    });
  });
}

function render() {
  if (!app.querySelector(".app-shell")) {
    buildShell();
  }

  appState.page = routeFromHash();
  app.querySelectorAll(".nav-button").forEach((button) => {
    const isOrganizerGroup = button.dataset.pageGroup === "organizer" && ORGANIZER_PAGES.has(appState.page);
    button.classList.toggle("is-active", button.dataset.page === appState.page || isOrganizerGroup);
  });
  app.querySelectorAll(".organizer-menu [data-page]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.page === appState.page);
  });

  if (bodyScene) {
    bodyScene.destroy();
    bodyScene = null;
  }
  document.querySelector("#pageRoot").onclick = null;

  if (ORGANIZER_PAGES.has(appState.page)) {
    renderOrganizerPage(appState.page, document.querySelector("#pageRoot"));
  } else if (appState.page === "routine") {
    renderRoutinePage();
  } else if (appState.page === "muscles") {
    renderMusclePage();
  } else if (appState.page === "stretches") {
    renderStretchesPage();
  } else if (appState.page === "food") {
    renderFoodPage();
  } else if (appState.page === "pairings") {
    renderPairingsPage();
  } else if (appState.page === "nutrients") {
    renderNutrientsPage();
  } else {
    renderBodyPage();
  }
}

function renderAnatomyTooltip(tooltip, part) {
  if (!tooltip) return;

  if (!part) {
    tooltip.hidden = true;
    tooltip.innerHTML = "";
    return;
  }

  tooltip.className = `anatomy-tooltip${part.isMuscle ? " is-muscle" : ""}`;
  tooltip.style.setProperty("--tooltip-color", part.color || "#2f7650");
  tooltip.innerHTML = part.isMuscle
    ? `<strong>${escapeHtml(part.name)}</strong>`
    : `
      <span>${escapeHtml(part.systemLabel)}</span>
      <strong>${escapeHtml(part.name)}</strong>
      <p>${escapeHtml(part.description)}</p>
    `;
  tooltip.hidden = false;

  const parentRect = tooltip.parentElement.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const x = Math.min(parentRect.width - tooltipRect.width - 12, Math.max(12, part.x + 16));
  const y = Math.min(parentRect.height - tooltipRect.height - 12, Math.max(12, part.y + 16));
  tooltip.style.transform = `translate(${x}px, ${y}px)`;
}

function renderBodyPage() {
  const pageRoot = app.querySelector("#pageRoot");
  pageRoot.innerHTML = `
    <section class="body-page body-map-page">
      <div class="model-area">
        <div class="model-toolbar" aria-label="View controls">
          <button class="icon-button" data-view="front" type="button" aria-label="Front view" title="Front view">
            <span aria-hidden="true">F</span>
          </button>
          <button class="icon-button" data-view="back" type="button" aria-label="Back view" title="Back view">
            <span aria-hidden="true">B</span>
          </button>
        </div>
        <div class="system-panel" aria-label="Body systems">
          <div class="system-panel-heading">
            <p>Body Map</p>
            <h1>Systems</h1>
          </div>
          <div class="system-toggle-grid">
            ${BODY_SYSTEMS.map((system) => `
              <label class="system-toggle" style="--system-color: ${system.theme}">
                <input type="checkbox" data-system="${system.id}" ${appState.visibleBodySystems.includes(system.id) ? "checked" : ""} />
                <span></span>
                <strong>${system.label}</strong>
              </label>
            `).join("")}
          </div>
        </div>
        <div class="muscle-scene" data-testid="muscle-scene"></div>
        <div class="anatomy-tooltip" id="anatomyTooltip" hidden></div>
      </div>
    </section>
  `;

  const anatomyTooltip = pageRoot.querySelector("#anatomyTooltip");
  bodyScene = new BodyScene(pageRoot.querySelector(".muscle-scene"), {
    selectedId: appState.selectedMuscle,
    visibleSystems: appState.visibleBodySystems,
    onSelect: selectMuscle,
    onHover: (part) => renderAnatomyTooltip(anatomyTooltip, part)
  });
  bodyScene.setSelected(appState.selectedMuscle);

  pageRoot.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => bodyScene.setView(button.dataset.view));
  });

  pageRoot.querySelectorAll("[data-system]").forEach((input) => {
    input.addEventListener("change", () => {
      const selectedSystems = [...pageRoot.querySelectorAll("[data-system]:checked")].map((field) => field.dataset.system);
      appState.visibleBodySystems = selectedSystems;
      renderAnatomyTooltip(anatomyTooltip, null);
      bodyScene.setVisibleSystems(selectedSystems);
    });
  });
}

function renderMusclePage() {
  const pageRoot = app.querySelector("#pageRoot");
  const muscle = getMuscle(appState.selectedMuscle) ?? MUSCLES[0];
  const exercisesByLevel = Object.entries(LEVELS).map(([levelId, level]) => ({
    id: levelId,
    label: level.label,
    exercises: muscle.exercises.filter((exercise) => exercise.level === levelId)
  }));

  pageRoot.innerHTML = `
    <section class="muscle-page wellness-page" style="--muscle-color: ${muscle.color}">
      <div class="wellness-hero muscle-page-hero">
        <div>
          <p>${muscle.region}</p>
          <h1>${muscle.name}</h1>
          <p class="hero-copy">${muscle.role}</p>
        </div>
        <div class="progress-card">
          <span>${muscle.exercises.length}</span>
          <strong>exercise options</strong>
        </div>
      </div>

      <div class="muscle-page-layout">
        <aside class="muscle-directory" aria-label="Muscle directory">
          <div class="panel-heading">
            <div>
              <p>Muscles</p>
              <h2>Directory</h2>
            </div>
          </div>
          <div class="muscle-directory-list">
            ${MUSCLES.map((item) => `
              <button class="muscle-directory-button ${item.id === muscle.id ? "is-active" : ""}" type="button" data-muscle-page="${item.id}" style="--swatch: ${item.color}">
                <span class="swatch"></span>
                <span>${item.name}</span>
              </button>
            `).join("")}
          </div>
        </aside>

        <div class="muscle-exercise-library">
          ${exercisesByLevel.map((group) => `
            <section class="muscle-level-section">
              <div class="panel-heading">
                <div>
                  <p>${group.exercises.length} exercises</p>
                  <h2>${group.label}</h2>
                </div>
              </div>
              <div class="muscle-exercise-grid">
                ${group.exercises.map((exercise) => {
                  const guide = EXERCISE_GUIDES[exercise.name];
                  const hasGuide = Boolean(guide);
                  return `
                  <article class="exercise-card muscle-exercise-card">
                    ${hasGuide ? `
                      <button class="exercise-guide-preview" type="button" data-exercise-guide="${escapeHtml(exercise.name)}" aria-label="Open the ${escapeHtml(exercise.name)} visual guide" title="Open visual guide">
                        <img src="${guide.src}" alt="${guide.alt}" loading="lazy" />
                      </button>
                    ` : ""}
                    <div class="exercise-card-body">
                      <div>
                        <h3>${exercise.name}</h3>
                        <p>${exercise.cue}</p>
                      </div>
                      <div class="exercise-card-footer">
                        <span>${exercise.equipment}</span>
                        ${hasGuide ? `<button class="exercise-guide-button" type="button" data-exercise-guide="${escapeHtml(exercise.name)}">View visual guide</button>` : ""}
                      </div>
                    </div>
                  </article>
                `;
                }).join("")}
              </div>
            </section>
          `).join("")}
        </div>
      </div>
    </section>
    <dialog class="exercise-guide-dialog" id="exerciseGuideDialog" aria-labelledby="exerciseGuideTitle">
      <div class="exercise-guide-dialog-header">
        <div>
          <p>Exercise visual guide</p>
          <h2 id="exerciseGuideTitle"></h2>
        </div>
        <button class="exercise-guide-close" type="button" aria-label="Close visual guide" title="Close">&times;</button>
      </div>
      <div class="exercise-guide-content">
        <figure class="exercise-guide-visual" id="exerciseGuideVisual"></figure>
        <div class="exercise-guide-details" id="exerciseGuideDetails"></div>
      </div>
    </dialog>
  `;

  pageRoot.querySelectorAll("[data-muscle-page]").forEach((button) => {
    button.addEventListener("click", () => setMusclePage(button.dataset.musclePage));
  });

  const guideDialog = pageRoot.querySelector("#exerciseGuideDialog");
  const guideTitle = pageRoot.querySelector("#exerciseGuideTitle");
  const guideVisual = pageRoot.querySelector("#exerciseGuideVisual");
  const guideDetails = pageRoot.querySelector("#exerciseGuideDetails");
  pageRoot.querySelectorAll("[data-exercise-guide]").forEach((button) => {
    button.addEventListener("click", () => {
      const exerciseName = button.dataset.exerciseGuide;
      const guide = EXERCISE_GUIDES[exerciseName];
      const exercise = muscle.exercises.find((item) => item.name === exerciseName);
      guideTitle.textContent = exerciseName;
      guideVisual.innerHTML = `<img src="${guide.src}" alt="${guide.alt}" />`;
      guideDetails.innerHTML = renderExerciseGuideDetails(exercise, muscle);
      guideDialog.showModal();
    });
  });
  guideDialog.querySelector(".exercise-guide-close").addEventListener("click", () => guideDialog.close());
  guideDialog.addEventListener("click", (event) => {
    if (event.target === guideDialog) guideDialog.close();
  });
}

function renderRoutinePage() {
  const pageRoot = app.querySelector("#pageRoot");
  pageRoot.innerHTML = `
    <section class="routine-page">
      <div class="routine-builder">
        <div class="builder-header">
          <div>
            <p>Exercise library</p>
            <h1>Build Your Routine</h1>
          </div>
        </div>
        <div class="level-control" role="radiogroup" aria-label="Workout level">
          ${Object.entries(LEVELS).map(([id, level]) => `
            <button class="level-button" type="button" role="radio" aria-checked="${appState.level === id}" data-level="${id}">
              ${level.label}
            </button>
          `).join("")}
        </div>
        <div class="split-summary" id="splitSummary"></div>
        <div class="routine-muscles" id="routineMuscles"></div>
        <div class="equipment-filter" id="equipmentFilter"></div>
        <div class="routine-library" id="routineLibrary"></div>
      </div>
      <div class="routine-result" id="routineResult" aria-live="polite"></div>
    </section>
  `;

  pageRoot.querySelectorAll(".level-button").forEach((button) => {
    button.addEventListener("click", () => {
      appState.level = button.dataset.level;
      pruneUnavailableEquipment();
      saveCustomRoutine();
      renderRoutinePage();
    });
  });

  renderRoutineMuscles();
  renderEquipmentFilter();
  renderSplitSummary();
  renderRoutineLibrary();
  renderRoutineResult();
}

function renderRoutineMuscles() {
  const root = app.querySelector("#routineMuscles");
  if (!root) return;

  const selected = appState.selectedRoutineMuscles;
  root.innerHTML = `
    <div class="routine-section-heading">
      <div>
        <p>Targets</p>
        <h2>Muscle Groups</h2>
      </div>
      <div class="routine-heading-actions">
        <span>${selected.length} selected</span>
        <button class="text-button" type="button" id="clearRoutineMuscles" ${selected.length === 0 ? "disabled" : ""}>Clear all</button>
      </div>
    </div>
    <div class="routine-grid">
      ${MUSCLES.map((muscle) => {
        const checked = selected.includes(muscle.id);
        return `
          <button
            class="routine-toggle ${checked ? "is-selected" : ""}"
            type="button"
            data-muscle="${muscle.id}"
            aria-pressed="${checked}"
          >
            <span class="swatch" style="--swatch: ${muscle.color}"></span>
            <span>${muscle.name}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;

  root.querySelectorAll(".routine-toggle").forEach((button) => {
    button.addEventListener("click", () => toggleRoutineMuscle(button.dataset.muscle));
  });

  root.querySelector("#clearRoutineMuscles").addEventListener("click", () => {
    appState.selectedRoutineMuscles = [];
    pruneUnavailableEquipment();
    saveCustomRoutine();
    renderRoutinePage();
  });
}

function renderEquipmentFilter() {
  const root = app.querySelector("#equipmentFilter");
  if (!root) return;

  const equipmentOptions = getEquipmentOptions();
  const availableEquipmentIds = pruneUnavailableEquipment();
  const selected = appState.selectedEquipment;
  root.innerHTML = `
    <div class="filter-heading">
      <div>
        <p>Filters</p>
        <h2>Equipment Filters</h2>
      </div>
      <button class="text-button" type="button" id="clearEquipment" ${selected.length === 0 ? "disabled" : ""}>All Equipment</button>
    </div>
    <div class="equipment-grid">
      ${equipmentOptions.map((equipment) => {
        const isSelected = selected.includes(equipment.id);
        const isAvailable = availableEquipmentIds.has(equipment.id);
        return `
        <button
          class="equipment-toggle ${isSelected ? "is-selected" : isAvailable ? "is-highlighted" : ""}"
          type="button"
          data-equipment="${equipment.id}"
          aria-pressed="${isSelected}"
          ${isAvailable ? "" : "disabled"}
          title="${isAvailable ? `${equipment.label} is used by the selected muscle groups` : equipment.label}"
        >
          ${equipment.label}
        </button>
      `;
      }).join("")}
    </div>
  `;

  root.querySelector("#clearEquipment").addEventListener("click", () => {
    appState.selectedEquipment = [];
    saveCustomRoutine();
    renderRoutinePage();
  });

  root.querySelectorAll(".equipment-toggle").forEach((button) => {
    button.addEventListener("click", () => toggleEquipment(button.dataset.equipment));
  });
}

function toggleEquipment(id) {
  if (!getAvailableRoutineEquipmentIds().has(id)) return;

  if (appState.selectedEquipment.includes(id)) {
    appState.selectedEquipment = appState.selectedEquipment.filter((equipmentId) => equipmentId !== id);
  } else {
    appState.selectedEquipment = [...appState.selectedEquipment, id];
  }

  pruneUnavailableEquipment();
  saveCustomRoutine();
  renderRoutinePage();
}

function toggleRoutineMuscle(id) {
  const selected = appState.selectedRoutineMuscles;
  if (selected.includes(id)) {
    appState.selectedRoutineMuscles = selected.filter((muscleId) => muscleId !== id);
  } else {
    appState.selectedRoutineMuscles = [...selected, id];
  }

  pruneUnavailableEquipment();
  saveCustomRoutine();
  renderRoutinePage();
}

function renderSplitSummary() {
  const root = app.querySelector("#splitSummary");
  if (!root) return;

  const selected = appState.selectedRoutineMuscles;
  const activeSplits = getActiveSplits(selected);
  const splitNames = activeSplits.map((split) => split.name).join(" / ");
  const compatibleIds = getCompatibleSplitIds(selected);
  const isSpecific = selected.length > 0 && compatibleIds.length === 1;
  const isMixed = selected.length > 1 && compatibleIds.length === 0;

  root.innerHTML = `
    <div class="split-line">
      <span>${selected.length || 0} selected</span>
      <strong>${isMixed ? "Mixed focus" : splitNames || "Choose a group"}</strong>
    </div>
    <p>${isMixed
      ? "You can build this combination. The routine review will flag when splitting the focus may be worth considering."
      : isSpecific
        ? activeSplits[0].description
        : "Select the muscles you intend to train in this sitting."}</p>
  `;
}

function renderRoutineLibrary() {
  const root = app.querySelector("#routineLibrary");
  if (!root) return;

  const query = appState.routineSearch.trim().toLowerCase();
  const selectedKeys = new Set(appState.routineItems.map((item) => `${item.muscleId}:${item.exerciseName}`));
  const groups = appState.selectedRoutineMuscles.map((muscleId) => {
    const muscle = getMuscle(muscleId);
    const exercises = getExercisePool(muscleId, appState.level, appState.selectedEquipment)
      .filter((exercise) => !query || `${exercise.name} ${exercise.equipment} ${exercise.cue}`.toLowerCase().includes(query));
    return { muscle, exercises };
  }).filter((group) => group.exercises.length > 0);
  const resultCount = groups.reduce((sum, group) => sum + group.exercises.length, 0);

  root.innerHTML = `
    <div class="routine-library-toolbar">
      <div>
        <p>Available exercises</p>
        <h2>${resultCount} Options</h2>
      </div>
      <label class="routine-search">
        <span class="sr-only">Search exercises</span>
        <input type="search" value="${escapeHtml(appState.routineSearch)}" placeholder="Search exercises" data-routine-search>
      </label>
    </div>
    <div class="routine-library-groups">
      ${appState.selectedRoutineMuscles.length === 0
        ? `<div class="routine-library-empty"><strong>Choose a target muscle</strong></div>`
        : groups.length === 0
          ? `<div class="routine-library-empty"><strong>No exercises match these filters</strong></div>`
          : groups.map(({ muscle, exercises }) => `
            <section class="routine-library-group">
              <div class="routine-library-group-heading">
                <span class="swatch" style="--swatch: ${muscle.color}"></span>
                <h3>${muscle.name}</h3>
              </div>
              <div class="routine-library-list">
                ${exercises.map((exercise) => {
                  const key = `${muscle.id}:${exercise.name}`;
                  const isAdded = selectedKeys.has(key);
                  return `
                    <article class="routine-library-item${isAdded ? " is-added" : ""}">
                      <div>
                        <strong>${escapeHtml(exercise.name)}</strong>
                        <span>${escapeHtml(exercise.equipment)} · ${LEVELS[exercise.level].label}</span>
                      </div>
                      <button
                        type="button"
                        class="routine-add-button"
                        data-add-exercise="${escapeHtml(exercise.name)}"
                        data-add-muscle="${muscle.id}"
                        aria-label="${isAdded ? `${escapeHtml(exercise.name)} is already added` : `Add ${escapeHtml(exercise.name)}`}"
                        title="${isAdded ? "Already added" : "Add exercise"}"
                        ${isAdded ? "disabled" : ""}
                      >${isAdded ? "Added" : "+"}</button>
                    </article>
                  `;
                }).join("")}
              </div>
            </section>
          `).join("")}
    </div>
  `;

  root.querySelector("[data-routine-search]")?.addEventListener("input", (event) => {
    appState.routineSearch = event.target.value;
    renderRoutineLibrary();
  });

  root.querySelectorAll("[data-add-exercise]").forEach((button) => {
    button.addEventListener("click", () => {
      const muscle = getMuscle(button.dataset.addMuscle);
      const exercise = muscle?.exercises.find((candidate) => candidate.name === button.dataset.addExercise);
      if (!exercise) return;
      appState.routineItems = [...appState.routineItems, createRoutineItem(muscle.id, exercise, appState.level)];
      saveCustomRoutine();
      renderRoutinePage();
    });
  });
}

function renderRoutineResult() {
  const root = app.querySelector("#routineResult");
  if (!root) return;
  const routine = {
    name: appState.routineName,
    level: appState.level,
    targetMuscles: appState.selectedRoutineMuscles,
    selectedEquipment: appState.selectedEquipment,
    items: appState.routineItems
  };
  const review = analyzeRoutine(routine);
  const hasCautions = review.cautionCount > 0;
  const reviewTitle = appState.routineItems.length === 0
    ? "Routine needs exercises"
    : hasCautions
      ? `${review.cautionCount} item${review.cautionCount === 1 ? "" : "s"} to review`
      : "No cautions found";

  root.innerHTML = `
    <div class="custom-routine-header">
      <label class="routine-name-field">
        <span>Routine name</span>
        <input type="text" maxlength="80" value="${escapeHtml(appState.routineName)}" data-routine-name>
      </label>
      <div class="routine-header-actions">
        <span>Saved on this device</span>
        <button type="button" class="text-button is-danger" data-clear-routine ${appState.routineItems.length === 0 ? "disabled" : ""}>Clear</button>
      </div>
    </div>
    <div class="routine-metrics" aria-label="Routine totals">
      <div><strong>${review.totalExercises}</strong><span>Exercises</span></div>
      <div><strong>${review.totalSets}</strong><span>Working sets</span></div>
      <div><strong>${review.estimatedMinutes}</strong><span>Est. minutes</span></div>
      <div><strong>${appState.selectedRoutineMuscles.length}</strong><span>Target groups</span></div>
    </div>
    <section class="routine-review ${hasCautions ? "has-cautions" : "is-clear"}" aria-labelledby="routineReviewTitle">
      <div class="routine-review-heading">
        <span class="routine-review-icon" aria-hidden="true">!</span>
        <div>
          <p>Routine review</p>
          <h2 id="routineReviewTitle">${reviewTitle}</h2>
        </div>
      </div>
      ${review.findings.length > 0 ? `
        <div class="routine-review-list">
          ${review.findings.map((finding) => `
            <article class="routine-review-item ${finding.tone}">
              <span aria-hidden="true">!</span>
              <div><strong>${escapeHtml(finding.title)}</strong><p>${escapeHtml(finding.message)}</p></div>
            </article>
          `).join("")}
        </div>
      ` : `<p class="routine-review-clear">The current session stays within the app's general volume and coverage checks.</p>`}
      <p class="routine-review-source">General reference points: <a href="https://www.acsm.org/docs/default-source/files-for-resource-library/resistance-training-for-health.pdf" target="_blank" rel="noreferrer">ACSM resistance training guidance</a> and <a href="https://www.cdc.gov/physical-activity-basics/adding-adults/what-counts.html" target="_blank" rel="noreferrer">CDC activity guidance</a>. Individual needs vary.</p>
    </section>
    <section class="routine-coverage" aria-labelledby="routineCoverageTitle">
      <div class="routine-result-section-heading">
        <div><p>Direct working sets</p><h2 id="routineCoverageTitle">Target Coverage</h2></div>
      </div>
      <div class="routine-coverage-grid">
        ${appState.selectedRoutineMuscles.length > 0 ? appState.selectedRoutineMuscles.map((muscleId) => {
          const muscle = getMuscle(muscleId);
          const sets = review.setsByMuscle[muscleId] ?? 0;
          return `
            <div class="routine-coverage-item">
              <span class="swatch" style="--swatch: ${muscle.color}"></span>
              <strong>${muscle.name}</strong>
              <span>${sets} set${sets === 1 ? "" : "s"}</span>
            </div>
          `;
        }).join("") : `<p>No target muscles selected.</p>`}
      </div>
    </section>
    <div class="routine-result-section-heading routine-exercise-heading">
      <div><p>Session order</p><h2>Exercises</h2></div>
      <span>${LEVELS[appState.level].label}</span>
    </div>
    <ol class="routine-list">
      ${appState.routineItems.map((item, index) => {
        const muscle = getMuscle(item.muscleId);
        return `
          <li class="routine-item">
            <div class="routine-item-main">
              <span class="color-chip" style="--chip-color: ${muscle.color}"></span>
              <div>
                <h3>${escapeHtml(item.exerciseName)}</h3>
                <p>${muscle.name} · ${escapeHtml(item.equipment)}</p>
                <span>${escapeHtml(item.cue)}</span>
              </div>
            </div>
            <div class="routine-prescription">
              <label><span>Sets</span><input type="number" min="1" max="12" value="${item.sets}" data-routine-field="sets" data-routine-id="${item.id}"></label>
              <label><span>Reps</span><input type="number" min="1" max="100" value="${item.reps}" data-routine-field="reps" data-routine-id="${item.id}"></label>
              <label><span>Rest sec</span><input type="number" min="0" max="600" step="15" value="${item.restSeconds}" data-routine-field="restSeconds" data-routine-id="${item.id}"></label>
            </div>
            <div class="routine-item-actions" aria-label="Actions for ${escapeHtml(item.exerciseName)}">
              <button type="button" data-routine-action="up" data-routine-id="${item.id}" aria-label="Move ${escapeHtml(item.exerciseName)} up" title="Move up" ${index === 0 ? "disabled" : ""}>↑</button>
              <button type="button" data-routine-action="down" data-routine-id="${item.id}" aria-label="Move ${escapeHtml(item.exerciseName)} down" title="Move down" ${index === appState.routineItems.length - 1 ? "disabled" : ""}>↓</button>
              <button type="button" data-routine-action="remove" data-routine-id="${item.id}" aria-label="Remove ${escapeHtml(item.exerciseName)}" title="Remove" class="is-danger">×</button>
            </div>
          </li>
        `;
      }).join("") || `
        <li class="empty-state routine-empty-state">
          <h3>No exercises added</h3>
          <p>Choose exercises from the library to start this session.</p>
        </li>
      `}
    </ol>
    <p class="safety-note">Cautions are planning prompts, not a diagnosis or a substitute for individualized coaching or medical care.</p>
  `;

  root.querySelector("[data-routine-name]")?.addEventListener("input", (event) => {
    appState.routineName = event.target.value.slice(0, 80);
    saveCustomRoutine();
  });

  root.querySelector("[data-clear-routine]")?.addEventListener("click", () => {
    if (!window.confirm("Clear every exercise from this routine?")) return;
    appState.routineItems = [];
    saveCustomRoutine();
    renderRoutinePage();
  });

  root.querySelectorAll("[data-routine-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const item = appState.routineItems.find((candidate) => candidate.id === input.dataset.routineId);
      if (!item) return;
      const limits = input.dataset.routineField === "sets"
        ? [1, 12]
        : input.dataset.routineField === "reps"
          ? [1, 100]
          : [0, 600];
      const value = Number.parseInt(input.value, 10);
      item[input.dataset.routineField] = Number.isFinite(value)
        ? Math.min(limits[1], Math.max(limits[0], value))
        : limits[0];
      saveCustomRoutine();
      renderRoutinePage();
    });
  });

  root.querySelectorAll("[data-routine-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = appState.routineItems.findIndex((item) => item.id === button.dataset.routineId);
      if (index < 0) return;
      if (button.dataset.routineAction === "remove") {
        appState.routineItems.splice(index, 1);
      } else {
        const offset = button.dataset.routineAction === "up" ? -1 : 1;
        const destination = index + offset;
        if (destination < 0 || destination >= appState.routineItems.length) return;
        [appState.routineItems[index], appState.routineItems[destination]] = [appState.routineItems[destination], appState.routineItems[index]];
      }
      saveCustomRoutine();
      renderRoutinePage();
    });
  });
}

function getStretchId(phase, stretch) {
  return `${phase.id}-${stretch.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function renderStretchesPage() {
  const pageRoot = app.querySelector("#pageRoot");
  const allStretches = STRETCH_ROUTINE.flatMap((phase) => phase.stretches.map((stretch) => getStretchId(phase, stretch)));
  const completedCount = allStretches.filter((id) => appState.completedStretches.includes(id)).length;
  const totalMinutes = STRETCH_ROUTINE.reduce((sum, phase) => {
    const firstNumber = Number.parseInt(phase.time, 10);
    return sum + (Number.isNaN(firstNumber) ? 0 : firstNumber);
  }, 0);

  pageRoot.innerHTML = `
    <section class="stretches-page wellness-page">
      <div class="wellness-hero stretch-hero">
        <div>
          <p>Daily Mobility</p>
          <h1>Full-Body Stretch Routine</h1>
          <p class="hero-copy">A practical daily outline that covers the neck, shoulders, spine, hips, legs, calves, feet, and ankles.</p>
        </div>
        <div class="progress-card">
          <span>${completedCount}/${allStretches.length}</span>
          <strong>stretches checked</strong>
          <button class="text-button" type="button" id="resetStretches" ${completedCount === 0 ? "disabled" : ""}>Reset</button>
        </div>
      </div>
      <div class="stretch-summary">
        <article>
          <span>${STRETCH_ROUTINE.length}</span>
          <p>routine phases</p>
        </article>
        <article>
          <span>${totalMinutes}-${totalMinutes + 8}</span>
          <p>estimated minutes</p>
        </article>
        <article>
          <span>30 sec</span>
          <p>typical static hold</p>
        </article>
      </div>
      <div class="stretch-timeline">
        ${STRETCH_ROUTINE.map((phase, phaseIndex) => `
          <section class="stretch-phase">
            <div class="phase-heading">
              <div>
                <p>Step ${phaseIndex + 1} - ${phase.time}</p>
                <h2>${phase.phase}</h2>
              </div>
              <span>${phase.stretches.length} moves</span>
            </div>
            <p class="routine-note">${phase.intent}</p>
            <div class="stretch-grid">
              ${phase.stretches.map((stretch) => {
                const stretchId = getStretchId(phase, stretch);
                const checked = appState.completedStretches.includes(stretchId);
                return `
                  <article class="stretch-card ${checked ? "is-complete" : ""}">
                    <label>
                      <input type="checkbox" data-stretch="${stretchId}" ${checked ? "checked" : ""} />
                      <span>${stretch.name}</span>
                    </label>
                    <dl>
                      <div><dt>Area</dt><dd>${stretch.area}</dd></div>
                      <div><dt>Time</dt><dd>${stretch.hold}</dd></div>
                    </dl>
                    <p>${stretch.steps}</p>
                  </article>
                `;
              }).join("")}
            </div>
          </section>
        `).join("")}
      </div>
      <p class="safety-note">Warm up first, stretch both sides, and keep every stretch in a tension-not-pain range.</p>
    </section>
  `;

  pageRoot.querySelector("#resetStretches").addEventListener("click", () => {
    appState.completedStretches = [];
    renderStretchesPage();
  });

  pageRoot.querySelectorAll("[data-stretch]").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        appState.completedStretches = [...new Set([...appState.completedStretches, input.dataset.stretch])];
      } else {
        appState.completedStretches = appState.completedStretches.filter((id) => id !== input.dataset.stretch);
      }
      renderStretchesPage();
    });
  });
}

function getFoodGroup(id) {
  return FOOD_GROUPS.find((group) => group.id === id);
}

function getFilteredFoods() {
  const query = appState.foodSearch.trim().toLowerCase();
  const matchingNutrientIds = NUTRIENTS
    .filter((nutrient) => nutrient.name.toLowerCase().includes(query))
    .map((nutrient) => nutrient.id);
  return FOODS.filter((food) => {
    const groupMatches = appState.foodGroup === "all" || food.group === appState.foodGroup;
    const queryMatches = !query
      || food.name.toLowerCase().includes(query)
      || food.nutrients.some((nutrient) => nutrient.toLowerCase().includes(query))
      || matchingNutrientIds.some((id) => Number(FOOD_NUTRIENT_PROFILES[food.id]?.values?.[id]) > 0)
      || matchingNutrientIds.some((id) => SPECIAL_NUTRIENT_GUIDANCE[id]?.sourceFoodIds?.includes(food.id));
    return groupMatches && queryMatches;
  });
}

function getSelectedFoods() {
  return appState.selectedFoods.map(getFood).filter(Boolean);
}

function getFoodServings(foodId) {
  return Math.min(20, Math.max(0.05, Number(appState.foodServings[foodId]) || 1));
}

function getPairingFoods() {
  return appState.selectedPairingFoods.map(getFood).filter(Boolean);
}

function getFoodSearchText(food) {
  return [
    food.name,
    food.group,
    food.serving,
    ...(food.nutrients ?? []),
    ...(food.tags ?? [])
  ].join(" ").toLowerCase();
}

function foodHas(food, terms) {
  const text = getFoodSearchText(food);
  return terms.some((term) => text.includes(term));
}

function getFilteredPairingFoods() {
  const query = appState.pairingSearch.trim().toLowerCase();
  return FOODS.filter((food) => !query || getFoodSearchText(food).includes(query)).slice(0, 72);
}

function getPairingTotals(foods) {
  return foods.reduce((totals, food) => ({
    calories: totals.calories + food.calories,
    protein: totals.protein + food.protein,
    carbs: totals.carbs + food.carbs,
    fat: totals.fat + food.fat,
    fiber: totals.fiber + food.fiber,
    addedSugar: totals.addedSugar + (food.addedSugar ?? 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, addedSugar: 0 });
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreLabel(score) {
  if (score >= 78) return "strong";
  if (score >= 58) return "moderate";
  if (score >= 38) return "developing";
  return "limited";
}

function scoreTone(score) {
  if (score >= 78) return "high";
  if (score >= 58) return "medium";
  if (score >= 38) return "low";
  return "quiet";
}

function joinFoodNames(foods) {
  return foods.map((food) => food.name).join(" + ");
}

function getPairingFeatures(foods) {
  const totals = getPairingTotals(foods);
  const groups = new Set(foods.map((food) => food.group));
  const has = (terms) => foods.some((food) => foodHas(food, terms));
  const count = (terms) => foods.filter((food) => foodHas(food, terms)).length;
  const plantProteinFoods = foods.filter((food) => foodHas(food, ["plant-protein", "lentil", "beans", "chickpeas", "tofu", "tempeh", "edamame"]));
  const grainFoods = foods.filter((food) => food.group === "grains" || foodHas(food, ["whole-grain"]));
  const animalProteinFoods = foods.filter((food) => food.group === "protein" && !foodHas(food, ["plant-protein", "tofu", "tempeh", "edamame", "lentil", "beans", "chickpeas"]));
  const phytateFoods = foods.filter((food) => food.group === "grains" || foodHas(food, ["beans", "lentils", "chickpeas", "seeds", "almonds", "walnuts", "whole-grain", "plant-protein"]));
  const prepMitigation = ["soaked", "fermented", "acid", "cooked"].includes(appState.pairingPrep);
  const acidPresent = appState.pairingPrep === "acid" || has(["citric acid", "citrus", "lemon", "lime", "vinegar"]);

  return {
    totals,
    groupCount: groups.size,
    hasVitaminC: has(["vitamin c", "citrus"]),
    hasAcid: acidPresent,
    hasPlantIron: has(["plant-iron", "iron"]),
    hasHemeIron: has(["lean beef", "beef", "turkey", "chicken", "sardines", "tuna", "shrimp"]),
    hasCalcium: has(["calcium"]),
    hasVitaminD: has(["vitamin d"]),
    hasZinc: has(["zinc"]),
    hasFat: totals.fat >= 5 || has(["healthy-fat", "monounsaturated", "omega-3", "olive oil", "avocado", "nuts", "seeds"]),
    hasFatSoluble: has(["vitamin a", "vitamin d", "vitamin e", "vitamin k", "beta carotene", "lycopene", "carotenoids"]),
    hasPrebiotic: has(["prebiotic", "pectin", "beta-glucan", "fiber"]),
    hasProbiotic: has(["probiotic", "kefir", "yogurt"]),
    hasPolyphenols: has(["polyphenols", "anthocyanins", "flavonoids", "quercetin", "rutin", "lignans", "curcumin", "piperine", "gingerols", "cinnamaldehyde", "eugenol", "rosmarinic"]),
    hasOmega3: has(["omega-3", "ala omega-3"]),
    hasSpiceBioactive: has(["curcumin", "piperine", "capsaicin", "gingerols", "cinnamaldehyde", "eugenol", "carvacrol", "thymol", "safranal", "crocin"]),
    hasTurmeric: has(["turmeric", "curcumin"]),
    hasBlackPepper: has(["black pepper", "piperine"]),
    hasTomato: has(["tomatoes", "lycopene"]),
    hasOliveOil: has(["olive oil", "olive-oil"]),
    vitaminCFoods: count(["vitamin c", "citrus"]),
    polyphenolFoods: count(["polyphenols", "anthocyanins", "flavonoids", "quercetin", "rutin", "lignans", "curcumin", "piperine", "gingerols", "cinnamaldehyde", "eugenol"]),
    plantProteinFoods,
    grainFoods,
    animalProteinFoods,
    phytateFoods,
    prepMitigation
  };
}

function getPairingAnalysis(foods) {
  const features = getPairingFeatures(foods);
  const { totals } = features;
  const mealCountBonus = foods.length >= 2 ? 8 : 0;
  const orderBonus = appState.pairingOrder === "fiberFirst" ? 8 : appState.pairingOrder === "carbsFirst" ? -8 : 0;
  const carbLoad = totals.carbs + totals.addedSugar;
  const carbBuffers = totals.fiber * 4 + totals.protein * 1.4 + totals.fat * 1.1 + orderBonus;
  const complementaryPlants = features.plantProteinFoods.length > 0 && features.grainFoods.length > 0;
  const proteinScore = totals.protein < 5
    ? 18 + totals.protein * 4
    : 34 + Math.min(totals.protein * 1.5, 32)
      + (features.animalProteinFoods.length ? 18 : 0)
      + (complementaryPlants ? 18 : 0);
  const absorptionScore = 28 + mealCountBonus
    + (features.hasPlantIron && (features.hasVitaminC || features.hasAcid) ? 24 : 0)
    + (features.hasCalcium && features.hasVitaminD ? 18 : 0)
    + (features.hasFatSoluble && features.hasFat ? 18 : 0)
    + (features.hasHemeIron ? 8 : 0)
    + (features.phytateFoods.length && !features.prepMitigation && !features.hasVitaminC ? -12 : 0);
  const digestionScore = 26 + Math.min(totals.fiber * 3.5, 26) + Math.min(totals.protein * 0.8, 20) + Math.min(totals.fat * 1.1, 18) + orderBonus;
  const bloodSugarScore = carbLoad <= 8
    ? 76 + Math.min(totals.protein * 0.35 + totals.fiber * 1.5 + totals.fat * 0.3, 24)
    : 30 + Math.min(carbBuffers, 44)
      + Math.min(totals.fiber * 0.8, 12)
      + Math.min(totals.protein * 0.25, 8)
      - Math.max(0, totals.addedSugar - 8) * 1.6;
  const hormoneScore = 30 + Math.min(totals.protein * 1.2, 26) + Math.min(totals.fiber * 2.4, 22) + Math.min(totals.fat * 0.9, 16) - Math.max(0, totals.addedSugar - 8) * 1.8;
  const gutScore = 25 + Math.min(totals.fiber * 3.2, 30) + (features.hasPrebiotic ? 14 : 0) + (features.hasProbiotic ? 16 : 0) + Math.min(features.polyphenolFoods * 6, 18) + Math.min(features.groupCount * 3, 12);
  const antioxidantScore = 22 + Math.min(features.polyphenolFoods * 10, 36) + Math.min(features.vitaminCFoods * 12, 24) + (features.hasFat && features.hasFatSoluble ? 10 : 0) + (features.hasSpiceBioactive ? 10 : 0);
  const antiNutrientScore = features.phytateFoods.length === 0
    ? 72 + (features.hasVitaminC ? 8 : 0) + (features.hasAcid ? 6 : 0) + (features.prepMitigation ? 4 : 0)
    : 30 + (features.prepMitigation ? 22 : 0) + (features.hasVitaminC ? 14 : 0) + (features.hasAcid ? 8 : 0) + (features.hasHemeIron ? 8 : 0);
  const matrixScore = 28 + Math.min(features.groupCount * 9, 28) + Math.min(foods.filter((food) => food.group !== "sweeteners").length * 5, 20) + (features.hasFat && (features.hasFatSoluble || features.hasPolyphenols) ? 14 : 0) + (appState.pairingPrep === "cooked" ? 6 : 0);
  const immuneScore = 24 + (features.hasOmega3 ? 18 : 0) + (features.hasVitaminC ? 16 : 0) + (features.hasProbiotic ? 14 : 0) + Math.min(features.polyphenolFoods * 6, 18) + Math.min(totals.fiber * 1.2, 12) - Math.max(0, totals.addedSugar - 12);
  const bioactiveScore = 22 + Math.min(features.polyphenolFoods * 7, 26) + (features.hasTurmeric && features.hasBlackPepper ? 20 : 0) + (features.hasTurmeric && features.hasFat ? 12 : 0) + (features.hasTomato && features.hasOliveOil ? 18 : 0) + (features.hasPrebiotic && features.hasProbiotic ? 16 : 0) + (features.hasPlantIron && features.hasVitaminC ? 10 : 0);

  const scores = {
    absorption: clampScore(absorptionScore),
    digestion: clampScore(digestionScore),
    protein: clampScore(proteinScore),
    bloodSugar: clampScore(bloodSugarScore),
    hormones: clampScore(hormoneScore),
    microbiome: clampScore(gutScore),
    antioxidants: clampScore(antioxidantScore),
    antiNutrients: clampScore(antiNutrientScore),
    matrix: clampScore(matrixScore),
    immune: clampScore(immuneScore),
    bioactives: clampScore(bioactiveScore)
  };

  return {
    foods,
    features,
    totals,
    scores,
    overall: clampScore(Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length)
  };
}

function mechanismCards(analysis) {
  const { features, totals, scores } = analysis;
  const cards = [
    {
      id: "absorption",
      title: "Nutrient absorption",
      score: scores.absorption,
      body: features.hasPlantIron && (features.hasVitaminC || features.hasAcid)
        ? "Vitamin C or acidity can help keep non-heme iron easier to absorb from plant foods."
        : "Pair vitamin C-rich foods or acid with plant iron, and fat with fat-soluble nutrients.",
      test: "Try adding citrus, bell pepper, tomatoes, or a small amount of healthy fat and watch this score change."
    },
    {
      id: "digestion",
      title: "Digestion pace",
      score: scores.digestion,
      body: "Fiber, protein, and fat can slow stomach emptying and make the meal move more gradually through the gut.",
      test: "Compare a carb-only food with the same food plus yogurt, nuts, beans, avocado, or olive oil."
    },
    {
      id: "protein",
      title: "Protein quality",
      score: scores.protein,
      body: features.animalProteinFoods.length
        ? "Animal proteins usually provide a complete amino acid pattern; pairing them with plants adds fiber and micronutrients."
        : "Grain plus legume or seed pairings can improve the amino acid spread of plant meals.",
      test: "Pair beans or lentils with rice, pita, corn tortillas, quinoa, seeds, or dairy and compare the protein score."
    },
    {
      id: "bloodSugar",
      title: "Blood sugar regulation",
      score: scores.bloodSugar,
      body: carbLoadDescription(totals, appState.pairingOrder),
      test: "Use the meal-order control to compare mixed meal, fiber first, and carbs first patterns."
    },
    {
      id: "hormones",
      title: "Hormonal responses",
      score: scores.hormones,
      body: "Protein, fiber, and fat can support satiety signals and reduce the need for a sharp insulin response to isolated carbohydrate.",
      test: "Add protein or fat to a fruit, grain, or sweetener and compare the satiety and insulin-demand estimate."
    },
    {
      id: "microbiome",
      title: "Gut microbiome effects",
      score: scores.microbiome,
      body: features.hasPrebiotic && features.hasProbiotic
        ? "This pairing combines fermentable fibers with probiotic foods, a useful prebiotic-plus-probiotic pattern."
        : "Fiber, resistant starch, prebiotics, fermented foods, and polyphenol variety can support microbial diversity.",
      test: "Try adding kefir or yogurt to oats, berries, chia, flaxseed, apples, onions, asparagus, or legumes."
    },
    {
      id: "antioxidants",
      title: "Antioxidant interactions",
      score: scores.antioxidants,
      body: "Colorful plants and spices bring different antioxidant families; pairing colors usually broadens the compound mix.",
      test: "Add berries, leafy greens, tomatoes, herbs, spices, tea, or citrus and compare the antioxidant score."
    },
    {
      id: "antiNutrients",
      title: "Anti-nutrient reduction",
      score: scores.antiNutrients,
      body: features.phytateFoods.length
        ? "Grains, legumes, nuts, and seeds can contain phytates. Soaking, fermentation, cooking, and vitamin C pairings can reduce their mineral-binding impact."
        : "This meal has fewer obvious phytate-heavy foods, so anti-nutrient pressure is lower.",
      test: "Use the preparation control to compare standard prep with soaked, fermented, cooked, or acid-added versions."
    },
    {
      id: "matrix",
      title: "Food matrix effects",
      score: scores.matrix,
      body: "The physical food matrix changes how nutrients are released. Whole foods with fiber, protein, water, and fat often behave differently than isolated nutrients.",
      test: "Compare whole fruit with honey, or a whole-grain meal with a refined/sweet pairing."
    },
    {
      id: "immune",
      title: "Immune and inflammatory support",
      score: scores.immune,
      body: "Omega-3 fats, vitamin C, probiotics, fiber, and polyphenols can support immune resilience and inflammatory balance in different ways.",
      test: "Add salmon, sardines, berries, leafy greens, citrus, kefir, yogurt, flaxseed, chia, or herbs."
    },
    {
      id: "bioactives",
      title: "Bioactive compound synergy",
      score: scores.bioactives,
      body: bioactiveDescription(features),
      test: "Try turmeric plus black pepper and fat, tomatoes plus olive oil, or probiotic foods plus prebiotic fiber."
    }
  ];
  const goalOrder = {
    absorption: ["absorption", "antiNutrients", "matrix"],
    bloodSugar: ["bloodSugar", "digestion", "hormones"],
    gut: ["microbiome", "matrix", "immune"],
    recovery: ["protein", "bloodSugar", "immune"],
    antiNutrients: ["antiNutrients", "absorption", "matrix"],
    bioactives: ["bioactives", "antioxidants", "immune"]
  }[appState.pairingGoal] ?? [];
  return cards.sort((a, b) => {
    const aIndex = goalOrder.includes(a.id) ? goalOrder.indexOf(a.id) : 99;
    const bIndex = goalOrder.includes(b.id) ? goalOrder.indexOf(b.id) : 99;
    return aIndex - bIndex || b.score - a.score;
  });
}

function carbLoadDescription(totals, order) {
  if (totals.carbs <= 8) return "This pairing is naturally low in carbohydrate, so the glucose estimate is mainly shaped by protein, fat, and fiber.";
  if (order === "fiberFirst") return "Starting with fiber-rich foods may flatten the expected glucose rise compared with eating carbohydrate first.";
  if (order === "carbsFirst") return "Eating carbohydrate first can make the expected glucose rise sharper when the meal is not buffered by enough fiber, protein, or fat.";
  return "Protein, fat, and fiber can buffer carbohydrate digestion and may support a steadier glucose curve.";
}

function bioactiveDescription(features) {
  if (features.hasTurmeric && features.hasBlackPepper && features.hasFat) {
    return "Turmeric, black pepper, and fat create a classic bioactive stack: piperine and fat can improve curcumin availability.";
  }
  if (features.hasTomato && features.hasOliveOil) {
    return "Tomatoes plus olive oil are a useful matrix pairing because fat can support carotenoid availability.";
  }
  if (features.hasPrebiotic && features.hasProbiotic) {
    return "Prebiotic fiber plus probiotic food creates a synbiotic-style pairing for gut ecology.";
  }
  return "Bioactive synergy rises when herbs, spices, colorful plants, healthy fats, fermented foods, and complementary nutrients appear together.";
}

function pairingCounterSuggestionMarkup(card, suggestion, compact = false) {
  if (!suggestion) {
    return card.score === 100
      ? `<p class="counter-score-complete">This counter is at the current model ceiling.</p>`
      : "";
  }

  return `
    <button
      class="counter-food-button${compact ? " is-compact" : ""}"
      type="button"
      data-counter-food-suggestion="${suggestion.food.id}"
      aria-label="Add ${suggestion.food.name} to the test plate"
    >
      <span>Add ${suggestion.food.name}</span>
      <b>+${suggestion.gain}</b>
    </button>
  `;
}

function digestiveJourney(analysis) {
  const { totals, features, scores } = analysis;
  return [
    {
      phase: "Mouth and stomach",
      title: totals.fiber + totals.protein + totals.fat > 28 ? "Slower release" : "Faster release",
      body: "Food structure, chewing, protein, fat, and fiber influence how quickly the meal leaves the stomach."
    },
    {
      phase: "Small intestine",
      title: scores.absorption >= 70 ? "Better absorption setup" : "Absorption can be improved",
      body: features.hasFat && features.hasFatSoluble
        ? "Fat-soluble compounds have a fat source available for uptake."
        : "Add fat for carotenoids or vitamins A, D, E, and K; add vitamin C or acid for plant iron."
    },
    {
      phase: "Bloodstream",
      title: scores.bloodSugar >= 70 ? "Steadier entry" : "Sharper entry possible",
      body: carbLoadDescription(totals, appState.pairingOrder)
    },
    {
      phase: "Colon and microbiome",
      title: scores.microbiome >= 70 ? "Microbe-friendly" : "Add fermentable diversity",
      body: features.hasPrebiotic || totals.fiber >= 8
        ? "Fiber and plant compounds can become fuel for gut microbes."
        : "Add legumes, oats, berries, apples, onions, asparagus, chia, flaxseed, or fermented foods."
    }
  ];
}

function pairingTestIdeas(analysis) {
  const { features, totals } = analysis;
  return [
    {
      title: "Absorption A/B test",
      body: features.hasPlantIron
        ? "Compare this meal as-is against the same meal with citrus, bell pepper, tomatoes, or acid-added prep."
        : "Add a plant-iron food such as lentils, beans, tofu, spinach, or pumpkin seeds, then pair it with vitamin C."
    },
    {
      title: "Glucose curve test",
      body: totals.carbs > 10
        ? "Compare carbs first with fiber first. Then add protein or fat and watch the blood sugar score shift."
        : "Add a grain, fruit, potato, or honey to see how fiber, protein, and fat buffer carbohydrate movement."
    },
    {
      title: "Microbiome test",
      body: features.hasProbiotic
        ? "Add prebiotic fiber such as oats, berries, apple, onions, asparagus, lentils, chia, or flaxseed."
        : "Add yogurt or kefir, then pair it with a fiber-rich plant food to test a synbiotic-style meal."
    },
    {
      title: "Bioactive test",
      body: "Try tomato plus olive oil, turmeric plus black pepper plus fat, or herbs and spices with colorful plants."
    }
  ];
}

function pairingSelectButton(food) {
  const group = getFoodGroup(food.group);
  const selected = appState.selectedPairingFoods.includes(food.id);
  return `
    <button class="pairing-food-button ${selected ? "is-selected" : ""}" type="button" data-pairing-food="${food.id}" style="--food-color: ${group.theme}">
      <span class="food-dot"></span>
      <strong>${food.name}</strong>
      <small>${group.label} - ${food.calories} cal - ${food.protein}g protein - ${food.fiber}g fiber</small>
    </button>
  `;
}

function saveFoodPlate() {
  try {
    localStorage.setItem(FOOD_PLATE_KEY, JSON.stringify({
      foods: appState.selectedFoods,
      servings: appState.foodServings
    }));
  } catch {
    // The plate remains usable for the current session if storage is unavailable.
  }
}

function saveNutritionProfile() {
  appState.nutritionProfile = normalizeNutritionProfile(appState.nutritionProfile);
  try {
    localStorage.setItem(NUTRITION_PROFILE_KEY, JSON.stringify(appState.nutritionProfile));
  } catch {
    // Profile changes remain usable for the current session if storage is unavailable.
  }
}

function getFoodTotals() {
  return getSelectedFoods().reduce(
    (totals, food) => {
      const servings = getFoodServings(food.id);
      return {
        calories: totals.calories + (food.calories * servings),
        protein: totals.protein + (food.protein * servings),
        carbs: totals.carbs + (food.carbs * servings),
        fat: totals.fat + (food.fat * servings),
        fiber: totals.fiber + (food.fiber * servings),
        addedSugar: totals.addedSugar + ((food.addedSugar ?? 0) * servings)
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, addedSugar: 0 }
  );
}

function getPlateNutrientTotals() {
  const selectedFoods = getSelectedFoods();
  return Object.fromEntries(NUTRIENTS.map((nutrient) => {
    let value = 0;
    let reportedFoods = 0;
    selectedFoods.forEach((food) => {
      const amount = FOOD_NUTRIENT_PROFILES[food.id]?.values?.[nutrient.id];
      if (Number.isFinite(amount)) {
        value += amount * getFoodServings(food.id);
        reportedFoods += 1;
      }
    });
    return [nutrient.id, {
      value: reportedFoods ? value : null,
      reportedFoods,
      totalFoods: selectedFoods.length,
      complete: reportedFoods === selectedFoods.length
    }];
  }));
}

function getNutrientStatus(nutrient, amount) {
  const target = getNutrientTarget(nutrient.id, appState.nutritionProfile);
  if (amount.value === null) return { state: "unavailable", label: "No plate estimate", percent: 0 };
  if (nutrient.id === "sodium") {
    const percent = (amount.value / target.limit) * 100;
    return amount.value <= target.limit
      ? { state: "covered", label: `${formatNutrientNumber(amount.value)} / ${formatNutrientNumber(target.limit)} ${nutrient.unit} limit`, percent }
      : { state: "over", label: `${formatNutrientNumber(amount.value - target.limit)} ${nutrient.unit} over limit`, percent };
  }
  const percent = (amount.value / target.value) * 100;
  return {
    state: percent >= 100 ? "covered" : "partial",
    label: `${formatNutrientNumber(amount.value)} / ${formatNutrientNumber(target.value)} ${nutrient.unit}`,
    percent
  };
}

function nutritionProfileMarkup() {
  const group = getDriGroup(appState.nutritionProfile);
  const lifeStageEnabled = group.sex === "female" && group.age >= 14 && group.age <= 50;
  return `
    <div class="nutrition-profile-form">
      <label>
        <span>Age</span>
        <input id="nutritionAge" type="number" min="4" max="120" value="${group.age}" />
      </label>
      <label>
        <span>Sex used by DRI table</span>
        <select id="nutritionSex">
          <option value="female" ${group.sex === "female" ? "selected" : ""}>Female</option>
          <option value="male" ${group.sex === "male" ? "selected" : ""}>Male</option>
        </select>
      </label>
      <label>
        <span>Life stage</span>
        <select id="nutritionLifeStage" ${lifeStageEnabled ? "" : "disabled"}>
          <option value="none" ${group.lifeStage === "none" ? "selected" : ""}>Not pregnant or breastfeeding</option>
          <option value="pregnant" ${group.lifeStage === "pregnant" ? "selected" : ""}>Pregnant</option>
          <option value="lactating" ${group.lifeStage === "lactating" ? "selected" : ""}>Breastfeeding</option>
        </select>
      </label>
    </div>
    <p class="profile-reference-label">Using DRI reference group: <strong>${group.label}</strong></p>
  `;
}

function bindNutritionProfileControls(pageRoot, rerender) {
  pageRoot.querySelector("#nutritionAge")?.addEventListener("change", (event) => {
    appState.nutritionProfile.age = event.target.value;
    saveNutritionProfile();
    rerender();
  });
  pageRoot.querySelector("#nutritionSex")?.addEventListener("change", (event) => {
    appState.nutritionProfile.sex = event.target.value;
    saveNutritionProfile();
    rerender();
  });
  pageRoot.querySelector("#nutritionLifeStage")?.addEventListener("change", (event) => {
    appState.nutritionProfile.lifeStage = event.target.value;
    saveNutritionProfile();
    rerender();
  });
}

function estimateActivityCalories(met, minutes, weightLb) {
  const weightKg = Math.max(Number(weightLb) || 0, 1) / 2.205;
  const totalCalories = (met * 3.5 * weightKg * minutes) / 200;
  const restingCalories = (1 * 3.5 * weightKg * minutes) / 200;
  return Math.max(0, Math.round(totalCalories - restingCalories));
}

function getActivityEstimate() {
  const work = WORK_ACTIVITY_LEVELS.find((item) => item.id === appState.workActivity) ?? WORK_ACTIVITY_LEVELS[0];
  const exercise = EXERCISE_ACTIVITY_LEVELS.find((item) => item.id === appState.exerciseActivity) ?? EXERCISE_ACTIVITY_LEVELS[0];
  const workMinutes = Math.max(Number(appState.workHours) || 0, 0) * 60;
  const exerciseMinutes = Math.max(Number(appState.exerciseMinutes) || 0, 0);
  const workCalories = estimateActivityCalories(work.met, workMinutes, appState.calorieWeight);
  const exerciseCalories = estimateActivityCalories(exercise.met, exerciseMinutes, appState.calorieWeight);
  const activeCalories = workCalories + exerciseCalories;
  const baselineReference = Math.round(Math.max(Number(appState.calorieWeight) || 0, 1) * 11);

  return {
    activeCalories,
    exerciseCalories,
    workCalories,
    roughDailyReference: baselineReference + activeCalories
  };
}

function foodCardMarkup(food, selected = false) {
  const group = getFoodGroup(food.group);
  const profile = FOOD_NUTRIENT_PROFILES[food.id];
  return `
    <article class="food-card ${selected ? "is-on-plate" : ""}">
      <div class="food-card-head">
        <span class="food-dot" style="--food-color: ${group.theme}"></span>
        <div>
          <p>${group.label}</p>
          <h3>${food.name}</h3>
        </div>
      </div>
      <p class="serving-line">${food.serving}</p>
      <div class="macro-row">
        <span>${food.calories} cal</span>
        <span>${food.protein}g protein</span>
        <span>${food.carbs}g carbs</span>
        <span>${food.fat}g fat</span>
        ${food.addedSugar ? `<span>${food.addedSugar}g added sugar</span>` : ""}
      </div>
      <div class="nutrient-tags">
        ${food.nutrients.map((nutrient) => `<span>${nutrient}</span>`).join("")}
      </div>
      ${selected ? `
        <label class="food-serving-control">
          <span>Number of servings</span>
          <input type="number" min="0.05" max="20" step="0.25" value="${getFoodServings(food.id)}" data-food-servings="${food.id}" />
        </label>
      ` : ""}
      ${!profile?.source ? `<p class="data-availability-note">Detailed USDA profile unavailable; macros only.</p>` : ""}
      <button class="secondary-button" type="button" data-food="${food.id}">
        ${selected ? "Remove from plate" : "Add to plate"}
      </button>
    </article>
  `;
}

function renderPairingsPage() {
  const pageRoot = app.querySelector("#pageRoot");
  const pairingFoods = getPairingFoods();
  const filteredFoods = getFilteredPairingFoods();
  const analysis = getPairingAnalysis(pairingFoods);
  const cards = mechanismCards(analysis);
  const goal = PAIRING_GOALS.find((item) => item.id === appState.pairingGoal) ?? PAIRING_GOALS[0];
  const primaryCards = cards.slice(0, 4);
  const secondaryCards = cards.slice(4);
  const journey = digestiveJourney(analysis);
  const tests = pairingTestIdeas(analysis);
  const selectedIds = pairingFoods.map((food) => food.id);
  const counterSuggestions = Object.fromEntries(cards.map((card) => [
    card.id,
    choosePairingCounterSuggestion(card.id, pairingFoods, getFood, getPairingAnalysis)
  ]));

  pageRoot.innerHTML = `
    <section class="pairings-page wellness-page">
      <div class="wellness-hero pairings-hero">
        <div>
          <p>Food Pairing Lab</p>
          <h1>Test how foods work together</h1>
          <p class="hero-copy">Select foods, change preparation and meal order, and compare how the pairing may affect absorption, digestion, protein quality, blood sugar, gut ecology, and bioactive synergy.</p>
        </div>
        <div class="progress-card">
          <span>${analysis.overall}</span>
          <strong>${scoreLabel(analysis.overall)} pairing score</strong>
        </div>
      </div>

      <div class="pairing-lab-layout">
        <aside class="pairing-builder-panel">
          <section class="pairing-tool-card">
            <div class="panel-heading">
              <div>
                <p>Build a pairing</p>
                <h2>${pairingFoods.length} selected</h2>
              </div>
              <button class="text-button" type="button" id="clearPairingFoods" ${pairingFoods.length === 0 ? "disabled" : ""}>Clear</button>
            </div>
            <label class="search-field">
              <span>Search foods, nutrients, or compounds</span>
              <input id="pairingSearch" type="search" value="${escapeHtml(appState.pairingSearch)}" placeholder="Try iron, citrus, yogurt, turmeric..." />
            </label>
            <div class="selected-pairing-chips" aria-label="Selected pairing foods">
              ${pairingFoods.length
                ? pairingFoods.map((food) => `<button type="button" data-remove-pairing-food="${food.id}">${food.name}</button>`).join("")
                : `<p class="food-empty-state">Choose at least two foods to compare pairing effects.</p>`}
            </div>
            <div class="pairing-food-list">
              ${filteredFoods.map((food) => pairingSelectButton(food)).join("")}
            </div>
          </section>
        </aside>

        <main class="pairing-results-panel">
          <section class="pairing-tool-card">
            <div class="panel-heading">
              <div>
                <p>Current meal question</p>
                <h2>${pairingFoods.length ? joinFoodNames(pairingFoods) : "No foods selected"}</h2>
              </div>
            </div>
            <div class="pairing-control-grid">
              <label>
                <span>Goal to test</span>
                <select id="pairingGoal">
                  ${PAIRING_GOALS.map((item) => `<option value="${item.id}" ${item.id === appState.pairingGoal ? "selected" : ""}>${item.label}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>Preparation</span>
                <select id="pairingPrep">
                  ${PAIRING_PREP_OPTIONS.map((item) => `<option value="${item.id}" ${item.id === appState.pairingPrep ? "selected" : ""}>${item.label}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>Meal order</span>
                <select id="pairingOrder">
                  ${PAIRING_ORDER_OPTIONS.map((item) => `<option value="${item.id}" ${item.id === appState.pairingOrder ? "selected" : ""}>${item.label}</option>`).join("")}
                </select>
              </label>
            </div>
            <p class="pairing-goal-note">Testing for <strong>${goal.label.toLowerCase()}</strong>: ${goal.cue}. These scores are educational estimates, not medical predictions.</p>
            <div class="pairing-macro-strip">
              <article><span>${formatNutrientNumber(analysis.totals.calories)}</span><p>calories</p></article>
              <article><span>${formatNutrientNumber(analysis.totals.protein)}g</span><p>protein</p></article>
              <article><span>${formatNutrientNumber(analysis.totals.carbs)}g</span><p>carbs</p></article>
              <article><span>${formatNutrientNumber(analysis.totals.fat)}g</span><p>fat</p></article>
              <article><span>${formatNutrientNumber(analysis.totals.fiber)}g</span><p>fiber</p></article>
            </div>
          </section>

          <section class="pairing-score-grid">
            ${primaryCards.map((card) => `
              <article class="pairing-score-card is-${scoreTone(card.score)}">
                <div>
                  <p>${scoreLabel(card.score)}</p>
                  <h3>${card.title}</h3>
                </div>
                <span>${card.score}</span>
                <div class="pairing-score-bar"><i style="width: ${card.score}%"></i></div>
                <p>${card.body}</p>
                <small>${card.test}</small>
                ${pairingCounterSuggestionMarkup(card, counterSuggestions[card.id])}
              </article>
            `).join("")}
          </section>

          <section class="pairing-tool-card">
            <div class="panel-heading">
              <div>
                <p>Movement through the body</p>
                <h2>Meal pathway</h2>
              </div>
            </div>
            <div class="digestive-journey">
              ${journey.map((step, index) => `
                <article>
                  <span>${index + 1}</span>
                  <div>
                    <p>${step.phase}</p>
                    <h3>${step.title}</h3>
                    <small>${step.body}</small>
                  </div>
                </article>
              `).join("")}
            </div>
          </section>

          <section class="pairing-tool-card">
            <div class="panel-heading">
              <div>
                <p>All mechanisms</p>
                <h2>What changed and why</h2>
              </div>
            </div>
            <div class="mechanism-list">
              ${secondaryCards.map((card) => `
                <article>
                  <div>
                    <strong>${card.title}</strong>
                    <p>${card.body}</p>
                    <small>${card.test}</small>
                    ${pairingCounterSuggestionMarkup(card, counterSuggestions[card.id], true)}
                  </div>
                  <span>${card.score}</span>
                </article>
              `).join("")}
            </div>
          </section>
        </main>

        <aside class="pairing-test-panel">
          <section class="pairing-tool-card">
            <div class="panel-heading">
              <div>
                <p>Preset experiments</p>
                <h2>Try a known pattern</h2>
              </div>
            </div>
            <div class="pairing-preset-list">
              ${FOOD_PAIRINGS.map((pairing) => {
                const active = pairing.foods.every((id) => selectedIds.includes(id)) && pairing.foods.length === selectedIds.length;
                return `
                  <button class="${active ? "is-active" : ""}" type="button" data-pairing-preset="${pairing.id}">
                    <strong>${pairing.name}</strong>
                    <span>${pairing.reason}</span>
                  </button>
                `;
              }).join("")}
            </div>
          </section>

          <section class="pairing-tool-card">
            <div class="panel-heading">
              <div>
                <p>How to test it</p>
                <h2>Pairing experiments</h2>
              </div>
            </div>
            <div class="pairing-experiment-list">
              ${tests.map((test) => `
                <article>
                  <h3>${test.title}</h3>
                  <p>${test.body}</p>
                </article>
              `).join("")}
            </div>
            <div class="pairing-action-row">
              <button class="secondary-button" type="button" id="usePairingAsPlate" ${pairingFoods.length === 0 ? "disabled" : ""}>Use as food plate</button>
              <button class="secondary-button" type="button" id="importPlatePairing" ${appState.selectedFoods.length === 0 ? "disabled" : ""}>Import current plate</button>
            </div>
          </section>

          <section class="pairing-tool-card pairing-source-card">
            <div class="panel-heading">
              <div>
                <p>Reference anchors</p>
                <h2>What this is based on</h2>
              </div>
            </div>
            <p>Use this page to learn patterns. Actual responses vary by portion size, health status, medications, gut microbiome, training load, and total diet.</p>
            <div>
              <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noreferrer">USDA FoodData Central</a>
              <a href="https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/" target="_blank" rel="noreferrer">NIH iron absorption</a>
              <a href="https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/" target="_blank" rel="noreferrer">NIH zinc and phytates</a>
              <a href="https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/" target="_blank" rel="noreferrer">NIH vitamin D and calcium</a>
              <a href="https://www.cdc.gov/diabetes/healthy-eating/diabetes-meal-planning.html" target="_blank" rel="noreferrer">CDC balanced meals and blood sugar</a>
              <a href="https://pubmed.ncbi.nlm.nih.gov/36921903/" target="_blank" rel="noreferrer">Dietary fat and carotenoid absorption trial</a>
            </div>
          </section>
        </aside>
      </div>
      <p class="safety-note">General nutrition education only. This page cannot diagnose conditions, predict individual glucose response, replace food labels, or replace care from a clinician or registered dietitian.</p>
    </section>
  `;

  pageRoot.querySelector("#pairingSearch").addEventListener("input", (event) => {
    appState.pairingSearch = event.target.value;
    renderPairingsPage();
    const search = pageRoot.querySelector("#pairingSearch");
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
  });

  ["pairingGoal", "pairingPrep", "pairingOrder"].forEach((id) => {
    pageRoot.querySelector(`#${id}`).addEventListener("change", (event) => {
      appState[id] = event.target.value;
      renderPairingsPage();
    });
  });

  pageRoot.querySelectorAll("[data-pairing-food]").forEach((button) => {
    button.addEventListener("click", () => {
      if (appState.selectedPairingFoods.includes(button.dataset.pairingFood)) {
        appState.selectedPairingFoods = appState.selectedPairingFoods.filter((id) => id !== button.dataset.pairingFood);
      } else {
        appState.selectedPairingFoods = [...appState.selectedPairingFoods, button.dataset.pairingFood].slice(-10);
      }
      renderPairingsPage();
    });
  });

  pageRoot.querySelectorAll("[data-remove-pairing-food]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.selectedPairingFoods = appState.selectedPairingFoods.filter((id) => id !== button.dataset.removePairingFood);
      renderPairingsPage();
    });
  });

  pageRoot.querySelectorAll("[data-counter-food-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      const foodId = button.dataset.counterFoodSuggestion;
      if (!getFood(foodId) || appState.selectedPairingFoods.includes(foodId)) return;
      appState.selectedPairingFoods = [...appState.selectedPairingFoods, foodId];
      renderPairingsPage();
    });
  });

  pageRoot.querySelectorAll("[data-pairing-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const pairing = FOOD_PAIRINGS.find((item) => item.id === button.dataset.pairingPreset);
      if (!pairing) return;
      appState.selectedPairingFoods = pairing.foods;
      appState.pairingSearch = "";
      renderPairingsPage();
    });
  });

  pageRoot.querySelector("#clearPairingFoods").addEventListener("click", () => {
    appState.selectedPairingFoods = [];
    renderPairingsPage();
  });

  pageRoot.querySelector("#usePairingAsPlate").addEventListener("click", () => {
    appState.selectedFoods = appState.selectedPairingFoods.filter((id) => getFood(id));
    appState.foodServings = Object.fromEntries(appState.selectedFoods.map((id) => [id, appState.foodServings[id] ?? 1]));
    saveFoodPlate();
  });

  pageRoot.querySelector("#importPlatePairing").addEventListener("click", () => {
    appState.selectedPairingFoods = appState.selectedFoods.filter((id) => getFood(id));
    renderPairingsPage();
  });
}

function renderFoodPage() {
  const pageRoot = app.querySelector("#pageRoot");
  const filteredFoods = getFilteredFoods();
  const selectedFoods = getSelectedFoods();
  const totals = getFoodTotals();
  const estimate = getActivityEstimate();
  const plateNutrients = getPlateNutrientTotals();
  const nutrientStatuses = Object.fromEntries(NUTRIENTS.map((nutrient) => [
    nutrient.id,
    getNutrientStatus(nutrient, plateNutrients[nutrient.id])
  ]));
  const metNutrients = NUTRIENTS.filter((nutrient) => nutrientStatuses[nutrient.id].state === "covered").length;
  const unavailableNutrients = NUTRIENTS.filter((nutrient) => nutrientStatuses[nutrient.id].state === "unavailable").length;
  const selectedIds = selectedFoods.map((food) => food.id);
  const availableFoods = filteredFoods.filter((food) => !selectedIds.includes(food.id));
  const pairingMatches = FOOD_PAIRINGS
    .filter((pairing) => pairing.foods.some((foodId) => selectedIds.includes(foodId)))
    .slice(0, 12);
  const visiblePairings = [
    ...pairingMatches,
    ...FOOD_PAIRINGS.filter((pairing) => !pairingMatches.includes(pairing))
  ].slice(0, 12);

  pageRoot.innerHTML = `
    <section class="food-page wellness-page">
      <div class="wellness-hero food-hero">
        <div>
          <p>Nutrition Builder</p>
          <h1>Food Pairing and Calorie Planner</h1>
          <p class="hero-copy">Browse food groups, inspect nutrients, build pairings, and compare plate calories with work and exercise output.</p>
        </div>
        <div class="progress-card">
          <span>${FOODS.length}</span>
          <strong>foods in library</strong>
        </div>
      </div>

      <div class="food-layout">
        <section class="food-library">
          <div class="food-controls">
            <label class="search-field">
              <span>Search foods or nutrients</span>
              <input id="foodSearch" type="search" value="${escapeHtml(appState.foodSearch)}" placeholder="Try protein, potassium, blueberries..." />
            </label>
            <label class="food-group-select">
              <span>Food group</span>
              <select id="foodGroupSelect">
                <option value="all" ${appState.foodGroup === "all" ? "selected" : ""}>All food groups</option>
                ${FOOD_GROUPS.map((group) => `<option value="${group.id}" ${appState.foodGroup === group.id ? "selected" : ""}>${group.label}</option>`).join("")}
              </select>
            </label>
            <p class="food-result-count">${availableFoods.length} foods available</p>
          </div>

          <div class="food-grid">
            ${availableFoods.length > 0
              ? availableFoods.map((food) => foodCardMarkup(food)).join("")
              : `<p class="food-empty-state">No available foods match this search and food group.</p>`}
          </div>
        </section>

        <section class="food-workspace">
          <section class="nutrient-checklist-card">
            <div class="panel-heading">
              <div>
                <p>Personal Daily Targets</p>
                <h2>${metNutrients} of ${NUTRIENTS.length} on target</h2>
              </div>
            </div>
            ${nutritionProfileMarkup()}
            <p class="nutrient-estimate-note">Estimates use the serving counts below. ${unavailableNutrients ? `${unavailableNutrients} nutrients require label or manual data.` : "All nutrients have a plate estimate."}</p>
            <div class="food-nutrient-checklist">
              ${NUTRIENTS.map((nutrient) => {
                const status = nutrientStatuses[nutrient.id];
                const category = getNutrientCategory(nutrient.category);
                return `
                  <div class="food-nutrient-item is-${status.state}" style="--nutrient-color: ${category.theme}">
                    <span class="nutrient-status-mark" aria-hidden="true"></span>
                    <span>
                      <strong>${nutrient.name}</strong>
                      <small>${status.label}${plateNutrients[nutrient.id].complete ? "" : " (partial data)"}</small>
                    </span>
                    <span class="food-nutrient-progress"><i style="width: ${Math.min(status.percent, 100)}%"></i></span>
                  </div>
                `;
              }).join("")}
            </div>
          </section>

          <section class="plate-card">
            <div class="panel-heading">
              <div>
                <p>Selected Plate</p>
                <h2>${selectedFoods.length} foods</h2>
              </div>
              <button class="text-button" type="button" id="clearPlate" ${selectedFoods.length === 0 ? "disabled" : ""}>Clear</button>
            </div>
            <div class="plate-totals">
              <article><span>${formatNutrientNumber(totals.calories)}</span><p>calories</p></article>
              <article><span>${formatNutrientNumber(totals.protein)}g</span><p>protein</p></article>
              <article><span>${formatNutrientNumber(totals.carbs)}g</span><p>carbs</p></article>
              <article><span>${formatNutrientNumber(totals.fat)}g</span><p>fat</p></article>
              <article><span>${formatNutrientNumber(totals.fiber)}g</span><p>fiber</p></article>
              <article><span>${formatNutrientNumber(totals.addedSugar)}g</span><p>added sugar</p></article>
            </div>
            <div class="selected-plate-grid">
              ${selectedFoods.length === 0
                ? `<p class="food-empty-state">Add foods from the library and their cards will move here.</p>`
                : selectedFoods.map((food) => foodCardMarkup(food, true)).join("")}
            </div>
          </section>
        </section>

        <aside class="nutrition-panel">
          <section class="calorie-card">
            <div class="panel-heading">
              <div>
                <p>Activity Compare</p>
                <h2>Calories vs Work Done</h2>
              </div>
            </div>
            <div class="calorie-form">
              <label>
                <span>Body weight (lb)</span>
                <input type="number" min="80" max="500" id="calorieWeight" value="${appState.calorieWeight}" />
              </label>
              <label>
                <span>Work hours</span>
                <input type="number" min="0" max="16" step="0.5" id="workHours" value="${appState.workHours}" />
              </label>
              <label>
                <span>Work type</span>
                <select id="workActivity">
                  ${WORK_ACTIVITY_LEVELS.map((item) => `<option value="${item.id}" ${item.id === appState.workActivity ? "selected" : ""}>${item.label}</option>`).join("")}
                </select>
              </label>
              <label>
                <span>Exercise minutes</span>
                <input type="number" min="0" max="240" step="5" id="exerciseMinutes" value="${appState.exerciseMinutes}" />
              </label>
              <label>
                <span>Exercise type</span>
                <select id="exerciseActivity">
                  ${EXERCISE_ACTIVITY_LEVELS.map((item) => `<option value="${item.id}" ${item.id === appState.exerciseActivity ? "selected" : ""}>${item.label}</option>`).join("")}
                </select>
              </label>
            </div>
            <div class="activity-results">
              <article><span>${estimate.workCalories}</span><p>work calories</p></article>
              <article><span>${estimate.exerciseCalories}</span><p>exercise calories</p></article>
              <article><span>${estimate.activeCalories}</span><p>movement total</p></article>
              <article><span>${formatNutrientNumber(totals.calories - estimate.activeCalories)}</span><p>plate minus movement</p></article>
            </div>
            <p class="routine-note">Rough daily reference with baseline: ${estimate.roughDailyReference} calories. Food labels and individual needs vary.</p>
          </section>

          <section class="pairing-card">
            <div class="panel-heading">
              <div>
                <p>Pairing Ideas</p>
                <h2>Foods That Work Together</h2>
              </div>
            </div>
            <div class="pairing-list">
              ${visiblePairings.map((pairing) => `
                <article>
                  <h3>${pairing.name}</h3>
                  <p>${pairing.reason}</p>
                  <button class="text-button" type="button" data-pairing="${pairing.id}">Use pairing</button>
                </article>
              `).join("")}
            </div>
          </section>
        </aside>
      </div>
      <p class="safety-note">General nutrition information only. For medical conditions, allergies, pregnancy, eating disorders, or prescribed diets, work with a qualified clinician or dietitian.</p>
    </section>
  `;

  pageRoot.querySelector("#foodSearch").addEventListener("input", (event) => {
    appState.foodSearch = event.target.value;
    renderFoodPage();
    const search = pageRoot.querySelector("#foodSearch");
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
  });

  pageRoot.querySelector("#foodGroupSelect").addEventListener("change", (event) => {
    appState.foodGroup = event.target.value;
    renderFoodPage();
  });

  pageRoot.querySelectorAll("[data-food]").forEach((button) => {
    button.addEventListener("click", () => {
      if (appState.selectedFoods.includes(button.dataset.food)) {
        appState.selectedFoods = appState.selectedFoods.filter((id) => id !== button.dataset.food);
      } else {
        appState.selectedFoods = [...appState.selectedFoods, button.dataset.food];
        appState.foodServings = { ...appState.foodServings, [button.dataset.food]: 1 };
      }
      saveFoodPlate();
      renderFoodPage();
    });
  });

  pageRoot.querySelectorAll("[data-food-servings]").forEach((input) => {
    input.addEventListener("input", (event) => {
      appState.foodServings = {
        ...appState.foodServings,
        [event.target.dataset.foodServings]: Math.min(20, Math.max(0.05, Number(event.target.value) || 1))
      };
      saveFoodPlate();
    });
    input.addEventListener("change", (event) => {
      appState.foodServings = {
        ...appState.foodServings,
        [event.target.dataset.foodServings]: Math.min(20, Math.max(0.05, Number(event.target.value) || 1))
      };
      saveFoodPlate();
      renderFoodPage();
    });
  });

  pageRoot.querySelector("#clearPlate").addEventListener("click", () => {
    appState.selectedFoods = [];
    appState.foodServings = {};
    saveFoodPlate();
    renderFoodPage();
  });

  pageRoot.querySelectorAll("[data-pairing]").forEach((button) => {
    button.addEventListener("click", () => {
      const pairing = FOOD_PAIRINGS.find((item) => item.id === button.dataset.pairing);
      if (!pairing) return;
      appState.selectedFoods = pairing.foods;
      appState.foodServings = Object.fromEntries(pairing.foods.map((id) => [id, 1]));
      saveFoodPlate();
      renderFoodPage();
    });
  });

  ["calorieWeight", "workHours", "workActivity", "exerciseMinutes", "exerciseActivity"].forEach((id) => {
    const field = pageRoot.querySelector(`#${id}`);
    const updateCalculator = (event) => {
      appState[id] = event.target.value;
      renderFoodPage();
    };

    field.addEventListener("input", updateCalculator);
    field.addEventListener("change", updateCalculator);
  });

  bindNutritionProfileControls(pageRoot, renderFoodPage);
}

function getNutrientCategory(id) {
  return NUTRIENT_CATEGORIES.find((category) => category.id === id);
}

function getSelectedNutrient() {
  return NUTRIENTS.find((nutrient) => nutrient.id === appState.selectedNutrient) ?? NUTRIENTS[0];
}

function getNutrientWeekValues(nutrientId) {
  const values = appState.nutrientLog[nutrientId];
  return WEEK_DAYS.map((_, index) => Math.max(Number(values?.[index]) || 0, 0));
}

function formatNutrientNumber(value) {
  const numeric = Number(value) || 0;
  const absolute = Math.abs(numeric);
  const digits = absolute > 0 && absolute < 0.01 ? 4 : absolute < 1 ? 2 : 1;
  return numeric.toLocaleString(undefined, { maximumFractionDigits: digits });
}

function saveNutrientLog() {
  try {
    localStorage.setItem(NUTRIENT_LOG_KEY, JSON.stringify({
      week: getCurrentWeekKey(),
      values: appState.nutrientLog
    }));
  } catch {
    // Tracking still works for the current session if storage is unavailable.
  }
}

function getNutrientProgress(nutrient) {
  const todayIndex = (new Date().getDay() + 6) % 7;
  const values = getNutrientWeekValues(nutrient.id);
  const today = values[todayIndex];
  const weekly = values.reduce((sum, value) => sum + value, 0);
  const target = getNutrientTarget(nutrient.id, appState.nutritionProfile);
  const dailyReference = nutrient.id === "sodium" ? target.limit : target.value;
  const weeklyTarget = dailyReference * 7;

  return {
    target,
    dailyReference,
    today,
    todayIndex,
    todayPercent: (today / dailyReference) * 100,
    weekly,
    weeklyTarget,
    weeklyPercent: (weekly / weeklyTarget) * 100,
    remaining: Math.max(weeklyTarget - weekly, 0),
    values
  };
}

function updateNutrientTrackerSummary() {
  const nutrient = getSelectedNutrient();
  const progress = getNutrientProgress(nutrient);
  const pageRoot = app.querySelector("#pageRoot");
  const updates = {
    "today-value": `${formatNutrientNumber(progress.today)} ${nutrient.unit}`,
    "week-value": `${formatNutrientNumber(progress.weekly)} ${nutrient.unit}`,
    "remaining-value": `${formatNutrientNumber(progress.remaining)} ${nutrient.unit}`,
    "today-percent": `${Math.round(progress.todayPercent)}% of ${nutrient.id === "sodium" ? "daily limit" : "daily target"}`,
    "week-percent": `${Math.round(progress.weeklyPercent)}% of ${nutrient.id === "sodium" ? "weekly limit" : "weekly target"}`
  };

  Object.entries(updates).forEach(([key, value]) => {
    const element = pageRoot.querySelector(`[data-nutrient-summary="${key}"]`);
    if (element) element.textContent = value;
  });

  const todayBar = pageRoot.querySelector('[data-nutrient-progress="today"]');
  const weekBar = pageRoot.querySelector('[data-nutrient-progress="week"]');
  if (todayBar) todayBar.style.width = `${Math.min(progress.todayPercent, 100)}%`;
  if (weekBar) weekBar.style.width = `${Math.min(progress.weeklyPercent, 100)}%`;
}

function renderNutrientsPage() {
  const pageRoot = app.querySelector("#pageRoot");
  const nutrient = getSelectedNutrient();
  const category = getNutrientCategory(nutrient.category);
  const visibleNutrients = NUTRIENTS.filter((item) => (
    appState.nutrientCategory === "all" || item.category === appState.nutrientCategory
  ));
  const sourceFoods = FOODS
    .filter((food) => Number(FOOD_NUTRIENT_PROFILES[food.id]?.values?.[nutrient.id]) > 0)
    .sort((a, b) => (
      FOOD_NUTRIENT_PROFILES[b.id].values[nutrient.id] - FOOD_NUTRIENT_PROFILES[a.id].values[nutrient.id]
    ));
  const guidance = SPECIAL_NUTRIENT_GUIDANCE[nutrient.id];
  const qualitativeSourceFoods = (guidance?.sourceFoodIds ?? [])
    .map(getFood)
    .filter((food) => food && !sourceFoods.includes(food));
  const librarySourceCount = sourceFoods.length + qualitativeSourceFoods.length;
  const progress = getNutrientProgress(nutrient);
  const driGroup = getDriGroup(appState.nutritionProfile);
  const plateAmount = getPlateNutrientTotals()[nutrient.id];

  pageRoot.innerHTML = `
    <section class="nutrients-page wellness-page">
      <div class="wellness-hero nutrients-hero">
        <div>
          <p>Daily Nutrition Guide</p>
          <h1>Nutrient Targets and Weekly Tracker</h1>
          <p class="hero-copy">Choose a nutrient to see your age- and sex-specific target, compare foods by serving, and track intake across the week.</p>
        </div>
        <div class="progress-card">
          <span>${NUTRIENTS.length}</span>
          <strong>nutrients to explore</strong>
        </div>
      </div>

      <section class="nutrient-profile-card">
        <div class="panel-heading">
          <div>
            <p>Nutrition Profile</p>
            <h2>Targets for ${driGroup.label}</h2>
          </div>
        </div>
        ${nutritionProfileMarkup()}
      </section>

      <div class="nutrient-category-tabs" aria-label="Nutrient categories">
        <button class="nutrient-category-button ${appState.nutrientCategory === "all" ? "is-active" : ""}" type="button" data-nutrient-category="all">All nutrients</button>
        ${NUTRIENT_CATEGORIES.map((item) => `
          <button class="nutrient-category-button ${appState.nutrientCategory === item.id ? "is-active" : ""}" type="button" data-nutrient-category="${item.id}" style="--nutrient-color: ${item.theme}">${item.label}</button>
        `).join("")}
      </div>

      <div class="nutrient-layout">
        <aside class="nutrient-directory" aria-label="Choose a nutrient">
          <div class="panel-heading">
            <div>
              <p>Nutrient Directory</p>
              <h2>${visibleNutrients.length} options</h2>
            </div>
          </div>
          <div class="nutrient-button-list">
            ${visibleNutrients.map((item) => {
              const itemCategory = getNutrientCategory(item.category);
              return `
                <button class="nutrient-select-button ${item.id === nutrient.id ? "is-active" : ""}" type="button" data-nutrient="${item.id}" style="--nutrient-color: ${itemCategory.theme}">
                  <span>${item.name}</span>
                  <strong>${formatNutrientNumber(getNutrientTarget(item.id, appState.nutritionProfile).value)} ${item.unit} ${getNutrientTarget(item.id, appState.nutritionProfile).type}</strong>
                </button>
              `;
            }).join("")}
          </div>
        </aside>

        <div class="nutrient-detail">
          <section class="nutrient-overview" style="--nutrient-color: ${category.theme}">
            <div class="nutrient-title-row">
              <div>
                <p>${category.label}</p>
                <h2>${nutrient.name}</h2>
              </div>
              <span class="reference-badge">DRI ${progress.target.type}</span>
            </div>
            <p class="nutrient-role">${nutrient.role}</p>
            <div class="nutrient-targets">
              <article>
                <span>${formatNutrientNumber(progress.target.value)} ${nutrient.unit}</span>
                <p>daily ${progress.target.type}</p>
              </article>
              <article>
                <span>${nutrient.id === "sodium" ? formatNutrientNumber(progress.target.limit) : formatNutrientNumber(progress.weeklyTarget)} ${nutrient.unit}</span>
                <p>${nutrient.id === "sodium" ? "daily reduction limit" : "seven-day equivalent"}</p>
              </article>
              <article>
                <span>${librarySourceCount}</span>
                <p>foods in this library</p>
              </article>
            </div>
            ${guidance ? `
              <div class="nutrient-data-note">
                <strong>About these estimates</strong>
                <p>${guidance.note}</p>
                <a href="${guidance.url}" target="_blank" rel="noreferrer">${guidance.label}</a>
              </div>
            ` : ""}
          </section>

          <section class="nutrient-tracker">
            <div class="panel-heading">
              <div>
                <p>Intake Log</p>
                <h2>Track ${nutrient.name} This Week</h2>
              </div>
              <button class="text-button" type="button" id="clearNutrientWeek">Clear week</button>
            </div>
            <p class="tracker-instruction">Enter the amount from nutrition labels, meal records, or guidance from your dietitian. Values are saved on this device.</p>

            <div class="plate-import-row">
              <div>
                <span>${plateAmount.value === null ? "Unavailable" : `${formatNutrientNumber(plateAmount.value)} ${nutrient.unit}`}</span>
                <p>current Food-page plate estimate${plateAmount.complete ? "" : " (partial data)"}</p>
              </div>
              <button class="secondary-button" type="button" id="usePlateForToday" ${plateAmount.value === null ? "disabled" : ""}>Use for today</button>
            </div>

            <div class="nutrient-summary-grid">
              <article>
                <span data-nutrient-summary="today-value">${formatNutrientNumber(progress.today)} ${nutrient.unit}</span>
                <p>today</p>
              </article>
              <article>
                <span data-nutrient-summary="week-value">${formatNutrientNumber(progress.weekly)} ${nutrient.unit}</span>
                <p>logged this week</p>
              </article>
              <article>
                <span data-nutrient-summary="remaining-value">${formatNutrientNumber(progress.remaining)} ${nutrient.unit}</span>
                <p>remaining to reference</p>
              </article>
            </div>

            <div class="nutrient-progress-stack">
              <div class="nutrient-progress-label">
                <span>Today</span>
                <strong data-nutrient-summary="today-percent">${Math.round(progress.todayPercent)}% of ${nutrient.id === "sodium" ? "daily limit" : "daily target"}</strong>
              </div>
              <div class="nutrient-progress-track"><span data-nutrient-progress="today" style="width: ${Math.min(progress.todayPercent, 100)}%"></span></div>
              <div class="nutrient-progress-label">
                <span>This week</span>
                <strong data-nutrient-summary="week-percent">${Math.round(progress.weeklyPercent)}% of ${nutrient.id === "sodium" ? "weekly limit" : "weekly target"}</strong>
              </div>
              <div class="nutrient-progress-track"><span data-nutrient-progress="week" style="width: ${Math.min(progress.weeklyPercent, 100)}%"></span></div>
            </div>

            <div class="weekly-nutrient-inputs">
              ${WEEK_DAYS.map((day, index) => `
                <label class="${index === progress.todayIndex ? "is-today" : ""}">
                  <span>${day}${index === progress.todayIndex ? " (today)" : ""}</span>
                  <div>
                    <input type="number" min="0" step="any" inputmode="decimal" value="${progress.values[index] || ""}" placeholder="0" data-nutrient-day="${index}" aria-label="${day} ${nutrient.name} in ${nutrient.unit}" />
                    <strong>${nutrient.unit}</strong>
                  </div>
                </label>
              `).join("")}
            </div>
          </section>

          <section class="nutrient-foods">
            <div class="panel-heading">
              <div>
                <p>Food Sources</p>
                <h2>Foods With ${nutrient.name}</h2>
              </div>
            </div>
            <div class="nutrient-food-grid">
              ${sourceFoods.length ? sourceFoods.map((food) => {
                const group = getFoodGroup(food.group);
                return `
                  <article class="nutrient-food-card">
                    <div class="food-card-head">
                      <span class="food-dot" style="--food-color: ${group.theme}"></span>
                      <div>
                        <p>${group.label}</p>
                        <h3>${food.name}</h3>
                      </div>
                    </div>
                    <p class="serving-line">${food.serving}</p>
                    <div class="macro-row">
                      <span>${food.calories} cal</span>
                      <span>${formatNutrientNumber(FOOD_NUTRIENT_PROFILES[food.id].values[nutrient.id])} ${nutrient.unit}</span>
                    </div>
                    <button class="secondary-button" type="button" data-open-food="${food.id}">Open in Food</button>
                  </article>
                `;
              }).join("") : ""}
              ${qualitativeSourceFoods.map((food) => {
                const group = getFoodGroup(food.group);
                return `
                  <article class="nutrient-food-card is-qualitative">
                    <div class="food-card-head">
                      <span class="food-dot" style="--food-color: ${group.theme}"></span>
                      <div>
                        <p>${group.label}</p>
                        <h3>${food.name}</h3>
                      </div>
                    </div>
                    <p class="serving-line">Contains ${nutrient.name}; a dependable serving amount is unavailable.</p>
                    <button class="secondary-button" type="button" data-open-food="${food.id}">Open in Food</button>
                  </article>
                `;
              }).join("")}
              ${librarySourceCount === 0 ? `
                <p class="food-empty-state">USDA standard food records do not provide a dependable ${nutrient.name} estimate for this library. Use a product label, laboratory source, or dietitian-provided amount in the intake log.</p>
              ` : ""}
            </div>
          </section>
        </div>
      </div>

      <div class="nutrient-reference-note">
        <p><strong>How to use these numbers:</strong> Targets are U.S. Dietary Reference Intakes for healthy people age 4 and older. RDA means Recommended Dietary Allowance; AI means Adequate Intake. Seven-day equivalents are planning aids, not instructions to consume a week's amount at once.</p>
        <p>USDA food values are serving-based estimates and natural products vary. Missing composition data is shown as unavailable. Health conditions, medications, and prescribed diets can change appropriate targets.</p>
        <div>
          <a href="https://ods.od.nih.gov/HealthInformation/nutrientrecommendations.aspx" target="_blank" rel="noreferrer">NIH DRI tables</a>
          <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noreferrer">USDA FoodData Central</a>
        </div>
      </div>
    </section>
  `;

  pageRoot.querySelectorAll("[data-nutrient-category]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.nutrientCategory = button.dataset.nutrientCategory;
      if (appState.nutrientCategory !== "all" && nutrient.category !== appState.nutrientCategory) {
        appState.selectedNutrient = NUTRIENTS.find((item) => item.category === appState.nutrientCategory)?.id ?? nutrient.id;
      }
      renderNutrientsPage();
    });
  });

  pageRoot.querySelectorAll("[data-nutrient]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.selectedNutrient = button.dataset.nutrient;
      renderNutrientsPage();
    });
  });

  pageRoot.querySelectorAll("[data-nutrient-day]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const values = getNutrientWeekValues(nutrient.id);
      values[Number(event.target.dataset.nutrientDay)] = Math.max(Number(event.target.value) || 0, 0);
      appState.nutrientLog = { ...appState.nutrientLog, [nutrient.id]: values };
      saveNutrientLog();
      updateNutrientTrackerSummary();
    });
  });

  pageRoot.querySelector("#clearNutrientWeek").addEventListener("click", () => {
    appState.nutrientLog = { ...appState.nutrientLog, [nutrient.id]: WEEK_DAYS.map(() => 0) };
    saveNutrientLog();
    renderNutrientsPage();
  });

  pageRoot.querySelector("#usePlateForToday")?.addEventListener("click", () => {
    if (plateAmount.value === null) return;
    const values = getNutrientWeekValues(nutrient.id);
    values[progress.todayIndex] = plateAmount.value;
    appState.nutrientLog = { ...appState.nutrientLog, [nutrient.id]: values };
    saveNutrientLog();
    renderNutrientsPage();
  });

  pageRoot.querySelectorAll("[data-open-food]").forEach((button) => {
    button.addEventListener("click", () => {
      const food = getFood(button.dataset.openFood);
      if (!food) return;
      appState.foodGroup = "all";
      appState.foodSearch = food.name;
      setPage("food");
    });
  });

  bindNutritionProfileControls(pageRoot, renderNutrientsPage);
}

window.addEventListener("hashchange", render);
render();
