import "./styles.css";
import { BodyScene } from "./bodyScene.js";
import {
  LEVELS,
  MUSCLES,
  SPLITS,
  getActiveSplits,
  getAllowedMuscleIds,
  getCompatibleSplitIds,
  getEquipmentIdsForMuscles,
  getEquipmentOptions,
  getExerciseAnimation,
  getExercisePool,
  getMuscle
} from "./data.js";

const appState = {
  page: "body",
  selectedMuscle: "chest",
  selectedRoutineMuscles: ["chest", "shoulders", "triceps"],
  selectedEquipment: [],
  level: "beginner",
  generatedRoutine: [],
  unmatchedMuscles: [],
  activeAnimationIndex: null
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
  return window.location.hash === "#routine" ? "routine" : "body";
}

function setPage(page) {
  appState.page = page;
  window.location.hash = page === "routine" ? "routine" : "body";
  render();
}

function selectMuscle(id) {
  appState.selectedMuscle = id;
  bodyScene?.setSelected(id);
  renderBodyDetails();
  updateMuscleButtons();
}

function buildShell() {
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <a class="brand" href="#body" aria-label="Muscle Map Trainer home">
          <span class="brand-mark"></span>
          <span>Muscle Map Trainer</span>
        </a>
        <nav class="main-nav" aria-label="Primary">
          <button class="nav-button" data-page="body" type="button">Body Map</button>
          <button class="nav-button" data-page="routine" type="button">Routine Generator</button>
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
  const availableEquipmentIds = getEquipmentIdsForMuscles(appState.selectedRoutineMuscles, appState.level);
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
  if (appState.selectedEquipment.includes(id)) {
    appState.selectedEquipment = appState.selectedEquipment.filter((equipmentId) => equipmentId !== id);
  } else {
    appState.selectedEquipment = [...appState.selectedEquipment, id];
  }

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
    appState.activeAnimationIndex = null;
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
      routine.push({
        muscleId,
        exercise: pool[(index + muscleIndex) % pool.length],
        sets: level.sets,
        reps: level.reps,
        rest: level.rest
      });
    }
  });

  appState.generatedRoutine = routine;
  appState.unmatchedMuscles = unmatchedMuscles;
  appState.activeAnimationIndex = null;
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
            <button class="motion-button" type="button" data-animation-index="${index}" aria-label="Show animation for ${escapeHtml(item.exercise.name)}" title="Show animation">
              <span class="play-icon" aria-hidden="true"></span>
              <span>Animation</span>
            </button>
          </li>
        `;
      }).join("")}
    </ol>
    <p class="safety-note">General fitness information only; adjust for pain, injury history, and professional guidance.</p>
  `;

  root.querySelectorAll(".motion-button").forEach((button) => {
    button.addEventListener("click", () => openExerciseAnimation(button.dataset.animationIndex));
  });

  renderExerciseAnimationModal(root);
}

function openExerciseAnimation(index) {
  appState.activeAnimationIndex = Number.parseInt(index, 10);
  renderRoutineResult();
}

function closeExerciseAnimation() {
  appState.activeAnimationIndex = null;
  renderRoutineResult();
}

function motionFigure(pattern, color) {
  return `
    <svg class="motion-figure motion-${pattern}" style="--motion-color: ${color}" viewBox="0 0 320 260" role="img" aria-label="Exercise animation">
      <path class="motion-arrow" d="M78 198 C132 224 188 224 242 198" />
      <line class="floor-line" x1="64" y1="224" x2="256" y2="224" />
      <g class="motion-skeleton">
        <g class="head-group">
          <circle class="head" cx="160" cy="50" r="18" />
          <line class="neck-line" x1="160" y1="68" x2="160" y2="84" />
        </g>
        <line class="torso" x1="160" y1="84" x2="160" y2="145" />
        <g class="arms">
          <g class="left-arm">
            <line class="limb upper-arm" x1="160" y1="92" x2="126" y2="120" />
            <line class="limb forearm" x1="126" y1="120" x2="108" y2="158" />
            <circle class="weight" cx="105" cy="162" r="8" />
          </g>
          <g class="right-arm">
            <line class="limb upper-arm" x1="160" y1="92" x2="194" y2="120" />
            <line class="limb forearm" x1="194" y1="120" x2="212" y2="158" />
            <circle class="weight" cx="215" cy="162" r="8" />
          </g>
        </g>
        <g class="legs">
          <g class="left-leg">
            <line class="limb thigh" x1="160" y1="145" x2="132" y2="180" />
            <line class="limb shin" x1="132" y1="180" x2="114" y2="218" />
          </g>
          <g class="right-leg">
            <line class="limb thigh" x1="160" y1="145" x2="188" y2="180" />
            <line class="limb shin" x1="188" y1="180" x2="206" y2="218" />
          </g>
        </g>
        <ellipse class="foot left-foot" cx="108" cy="222" rx="20" ry="6" />
        <ellipse class="foot right-foot" cx="212" cy="222" rx="20" ry="6" />
      </g>
    </svg>
  `;
}

function renderExerciseAnimationModal(root) {
  const item = appState.generatedRoutine[appState.activeAnimationIndex];
  if (!item) return;

  const muscle = getMuscle(item.muscleId);
  const animation = getExerciseAnimation(item.exercise);

  root.insertAdjacentHTML("beforeend", `
    <div class="motion-modal-backdrop" data-close-animation>
      <section class="motion-modal" role="dialog" aria-modal="true" aria-labelledby="motionTitle">
        <div class="motion-modal-header">
          <div>
            <p>${escapeHtml(animation.label)}</p>
            <h2 id="motionTitle">${escapeHtml(item.exercise.name)}</h2>
          </div>
          <button class="icon-button modal-close-button" type="button" data-close-animation aria-label="Close animation">X</button>
        </div>
        <div class="motion-stage">
          ${motionFigure(animation.pattern, muscle.color)}
        </div>
        <div class="motion-copy">
          <div>
            <h3>Setup</h3>
            <p>${escapeHtml(animation.setup)}</p>
          </div>
          <div>
            <h3>Motion</h3>
            <p>${escapeHtml(animation.motion)}</p>
          </div>
          <div>
            <h3>Focus</h3>
            <p>${escapeHtml(animation.focus)}</p>
          </div>
        </div>
        <p class="motion-cue">${escapeHtml(item.exercise.cue)}</p>
      </section>
    </div>
  `);

  root.querySelectorAll("[data-close-animation]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target === element || element.classList.contains("modal-close-button")) {
        closeExerciseAnimation();
      }
    });
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && appState.activeAnimationIndex !== null) {
    closeExerciseAnimation();
  }
});

window.addEventListener("hashchange", render);
render();
