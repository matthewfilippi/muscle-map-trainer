import "./styles.css";
import { BodyScene } from "./bodyScene.js";
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
  getAllowedMuscleIds,
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

const PAGES = new Set(["body", "routine", "stretches", "food", "nutrients"]);
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const NUTRIENT_LOG_KEY = "wellness-map-nutrient-log";
const NUTRITION_PROFILE_KEY = "wellness-map-nutrition-profile";
const FOOD_PLATE_KEY = "wellness-map-food-plate";
const DEFAULT_PLATE = ["chicken-breast", "quinoa", "broccoli"];

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

const savedPlate = loadFoodPlate();

const appState = {
  page: "body",
  selectedMuscle: "chest",
  selectedRoutineMuscles: ["chest", "shoulders", "triceps"],
  selectedEquipment: [],
  level: "beginner",
  generatedRoutine: [],
  unmatchedMuscles: [],
  completedStretches: [],
  foodGroup: "all",
  foodSearch: "",
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
  const page = window.location.hash.replace("#", "");
  return PAGES.has(page) ? page : "body";
}

function setPage(page) {
  appState.page = page;
  window.location.hash = page;
  render();
}

function selectMuscle(id) {
  appState.selectedMuscle = id;
  bodyScene?.setSelected(id);
  renderBodyDetails();
  updateMuscleButtons();
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
          <button class="nav-button" data-page="routine" type="button">Routine Generator</button>
          <button class="nav-button" data-page="stretches" type="button">Stretches</button>
          <button class="nav-button" data-page="food" type="button">Food</button>
          <button class="nav-button" data-page="nutrients" type="button">Nutrients</button>
        </nav>
      </header>
      <main id="pageRoot"></main>
    </div>
  `;

  app.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => setPage(button.dataset.page));
  });
}

function render() {
  if (!app.querySelector(".app-shell")) {
    buildShell();
  }

  appState.page = routeFromHash();
  app.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.page === appState.page);
  });

  if (bodyScene) {
    bodyScene.destroy();
    bodyScene = null;
  }

  if (appState.page === "routine") {
    renderRoutinePage();
  } else if (appState.page === "stretches") {
    renderStretchesPage();
  } else if (appState.page === "food") {
    renderFoodPage();
  } else if (appState.page === "nutrients") {
    renderNutrientsPage();
  } else {
    renderBodyPage();
  }
}

function renderBodyPage() {
  const pageRoot = app.querySelector("#pageRoot");
  pageRoot.innerHTML = `
    <section class="body-page">
      <div class="model-area">
        <div class="model-toolbar" aria-label="View controls">
          <button class="icon-button" data-view="front" type="button" aria-label="Front view" title="Front view">
            <span aria-hidden="true">F</span>
          </button>
          <button class="icon-button" data-view="back" type="button" aria-label="Back view" title="Back view">
            <span aria-hidden="true">B</span>
          </button>
        </div>
        <div class="muscle-scene" data-testid="muscle-scene"></div>
      </div>
      <aside class="details-panel" aria-live="polite">
        <div id="muscleDetails"></div>
        <div class="muscle-list" id="muscleList"></div>
      </aside>
    </section>
  `;

  bodyScene = new BodyScene(pageRoot.querySelector(".muscle-scene"), {
    selectedId: appState.selectedMuscle,
    onSelect: selectMuscle
  });
  bodyScene.setSelected(appState.selectedMuscle);

  pageRoot.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => bodyScene.setView(button.dataset.view));
  });

  renderBodyDetails();
  renderMuscleButtons();
}

function renderBodyDetails() {
  const detailsRoot = app.querySelector("#muscleDetails");
  if (!detailsRoot) return;

  const muscle = getMuscle(appState.selectedMuscle);
  const exerciseItems = muscle.exercises
    .map(
      (exercise) => `
        <article class="exercise-card">
          <div>
            <h4>${exercise.name}</h4>
            <p>${exercise.cue}</p>
          </div>
          <span>${exercise.equipment}</span>
        </article>
      `
    )
    .join("");

  detailsRoot.innerHTML = `
    <div class="muscle-heading">
      <span class="color-chip" style="--chip-color: ${muscle.color}"></span>
      <div>
        <p>${muscle.region}</p>
        <h1>${muscle.name}</h1>
      </div>
    </div>
    <p class="muscle-role">${muscle.role}</p>
    <p class="routine-note">${muscle.exercises.length} exercise options</p>
    <div class="exercise-stack">${exerciseItems}</div>
  `;
}

function renderMuscleButtons() {
  const list = app.querySelector("#muscleList");
  if (!list) return;

  list.innerHTML = `
    <h2>Muscles</h2>
    <div class="muscle-button-grid">
      ${MUSCLES.map((muscle) => `
        <button class="muscle-button" type="button" data-muscle="${muscle.id}">
          <span class="swatch" style="--swatch: ${muscle.color}"></span>
          <span>${muscle.name}</span>
        </button>
      `).join("")}
    </div>
  `;

  list.querySelectorAll(".muscle-button").forEach((button) => {
    button.addEventListener("click", () => selectMuscle(button.dataset.muscle));
  });

  updateMuscleButtons();
}

function updateMuscleButtons() {
  app.querySelectorAll(".muscle-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.muscle === appState.selectedMuscle);
  });
}

function renderRoutinePage() {
  const pageRoot = app.querySelector("#pageRoot");
  pageRoot.innerHTML = `
    <section class="routine-page">
      <div class="routine-builder">
        <div class="builder-header">
          <div>
            <p>Generator</p>
            <h1>Workout Routine</h1>
          </div>
          <button class="primary-button" type="button" id="generateRoutine">Generate</button>
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
      </div>
      <div class="routine-result" id="routineResult" aria-live="polite"></div>
    </section>
  `;

  pageRoot.querySelector("#generateRoutine").addEventListener("click", generateRoutine);
  pageRoot.querySelectorAll(".level-button").forEach((button) => {
    button.addEventListener("click", () => {
      appState.level = button.dataset.level;
      pruneUnavailableEquipment();
      generateRoutine();
      renderRoutinePage();
    });
  });

  renderRoutineMuscles();
  renderEquipmentFilter();
  renderSplitSummary();
  if (appState.generatedRoutine.length === 0) {
    generateRoutine();
  } else {
    renderRoutineResult();
  }
}

function renderRoutineMuscles() {
  const root = app.querySelector("#routineMuscles");
  if (!root) return;

  const selected = appState.selectedRoutineMuscles;
  const allowed = getAllowedMuscleIds(selected);
  root.innerHTML = `
    <h2>Muscle Groups</h2>
    <div class="routine-grid">
      ${MUSCLES.map((muscle) => {
        const checked = selected.includes(muscle.id);
        const disabled = !checked && !allowed.has(muscle.id);
        return `
          <button
            class="routine-toggle ${checked ? "is-selected" : ""}"
            type="button"
            data-muscle="${muscle.id}"
            aria-pressed="${checked}"
            ${disabled ? "disabled" : ""}
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
    generateRoutine();
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
  generateRoutine();
  renderRoutinePage();
}

function toggleRoutineMuscle(id) {
  const selected = appState.selectedRoutineMuscles;
  if (selected.includes(id)) {
    appState.selectedRoutineMuscles = selected.filter((muscleId) => muscleId !== id);
  } else {
    const allowed = getAllowedMuscleIds(selected);
    if (!allowed.has(id)) return;
    appState.selectedRoutineMuscles = [...selected, id];
  }

  pruneUnavailableEquipment();
  generateRoutine();
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

  root.innerHTML = `
    <div class="split-line">
      <span>${selected.length || 0} selected</span>
      <strong>${splitNames || "Choose a group"}</strong>
    </div>
    <p>${isSpecific ? activeSplits[0].description : "Available selections stay inside compatible training splits."}</p>
  `;
}

function generateRoutine() {
  const selected = appState.selectedRoutineMuscles;
  if (selected.length === 0) {
    appState.generatedRoutine = [];
    appState.unmatchedMuscles = [];
    renderRoutineResult();
    return;
  }

  const level = LEVELS[appState.level];
  const routine = [];
  const unmatchedMuscles = [];

  selected.forEach((muscleId, muscleIndex) => {
    const pool = getExercisePool(muscleId, appState.level, appState.selectedEquipment);
    if (pool.length === 0) {
      unmatchedMuscles.push(muscleId);
      return;
    }

    const count = Math.min(level.exerciseCount, pool.length);
    for (let index = 0; index < count; index += 1) {
      const offset = Math.floor(Math.random() * pool.length);
      routine.push({
        muscleId,
        exercise: pool[(index + muscleIndex + offset) % pool.length],
        sets: level.sets,
        reps: level.reps,
        rest: level.rest
      });
    }
  });

  appState.generatedRoutine = routine;
  appState.unmatchedMuscles = unmatchedMuscles;
  renderRoutineResult();
}

function renderRoutineResult() {
  const root = app.querySelector("#routineResult");
  if (!root) return;

  if (appState.generatedRoutine.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <h2>No Routine Yet</h2>
        <p>${appState.selectedRoutineMuscles.length === 0 ? "Select a compatible muscle group to build a session." : "No exercises match the current equipment filters."}</p>
      </div>
    `;
    return;
  }

  const level = LEVELS[appState.level];
  const selectedNames = appState.selectedRoutineMuscles.map(muscleName).join(" + ");
  const equipmentOptions = getEquipmentOptions();
  const selectedEquipmentNames = appState.selectedEquipment
    .map((equipmentId) => equipmentOptions.find((equipment) => equipment.id === equipmentId)?.label)
    .filter(Boolean)
    .join(", ");
  const totalSets = appState.generatedRoutine.reduce((sum, item) => sum + Number.parseInt(item.sets, 10), 0);
  const estimatedMinutes = Math.max(25, appState.generatedRoutine.length * (appState.level === "expert" ? 8 : 6));
  const unmatchedNotice = appState.unmatchedMuscles.length > 0
    ? `<div class="routine-warning">No matching ${level.label.toLowerCase()} exercises for ${appState.unmatchedMuscles.map(muscleName).join(", ")} with the current equipment filters.</div>`
    : "";

  root.innerHTML = `
    <div class="result-header">
      <div>
        <p>${level.label}</p>
        <h2>${selectedNames}</h2>
      </div>
      <div class="metrics">
        <span>${estimatedMinutes} min</span>
        <span>${totalSets}+ sets</span>
      </div>
    </div>
    <div class="routine-note">${selectedEquipmentNames ? `Equipment: ${selectedEquipmentNames}` : "Equipment: all available options"}</div>
    ${unmatchedNotice}
    <div class="routine-note">${level.note}</div>
    <ol class="routine-list">
      ${appState.generatedRoutine.map((item, index) => {
        const muscle = getMuscle(item.muscleId);
        return `
          <li class="routine-item">
            <span class="color-chip" style="--chip-color: ${muscle.color}"></span>
            <div>
              <h3>${item.exercise.name}</h3>
              <p>${muscle.name} - ${item.exercise.equipment} - ${item.exercise.cue}</p>
            </div>
            <dl>
              <div><dt>Sets</dt><dd>${item.sets}</dd></div>
              <div><dt>Reps</dt><dd>${item.reps}</dd></div>
              <div><dt>Rest</dt><dd>${item.rest}</dd></div>
            </dl>
          </li>
        `;
      }).join("")}
    </ol>
    <p class="safety-note">General fitness information only; adjust for pain, injury history, and professional guidance.</p>
  `;

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
    .slice(0, 6);
  const visiblePairings = [
    ...pairingMatches,
    ...FOOD_PAIRINGS.filter((pairing) => !pairingMatches.includes(pairing))
  ].slice(0, 6);

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
