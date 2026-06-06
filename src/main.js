import "./styles.css";
import { BodyScene } from "./bodyScene.js";
import {
  LEVELS,
  MUSCLES,
  SPLITS,
  getActiveSplits,
  getAllowedMuscleIds,
  getCompatibleSplitIds,
  getExercisePool,
  getMuscle
} from "./data.js";

const appState = {
  page: "body",
  selectedMuscle: "chest",
  selectedRoutineMuscles: ["chest", "shoulders", "triceps"],
  level: "beginner",
  generatedRoutine: []
};

let bodyScene = null;

const app = document.querySelector("#app");

function muscleName(id) {
  return getMuscle(id)?.name ?? id;
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
    renderRoutineResult();
    return;
  }

  const level = LEVELS[appState.level];
  const routine = [];

  selected.forEach((muscleId, muscleIndex) => {
    const pool = getExercisePool(muscleId, appState.level);
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
  renderRoutineResult();
}

function renderRoutineResult() {
  const root = app.querySelector("#routineResult");
  if (!root) return;

  if (appState.generatedRoutine.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <h2>No Routine Yet</h2>
        <p>Select a compatible muscle group to build a session.</p>
      </div>
    `;
    return;
  }

  const level = LEVELS[appState.level];
  const selectedNames = appState.selectedRoutineMuscles.map(muscleName).join(" + ");
  const totalSets = appState.generatedRoutine.reduce((sum, item) => sum + Number.parseInt(item.sets, 10), 0);
  const estimatedMinutes = Math.max(25, appState.generatedRoutine.length * (appState.level === "expert" ? 8 : 6));

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
    <div class="routine-note">${level.note}</div>
    <ol class="routine-list">
      ${appState.generatedRoutine.map((item) => {
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

window.addEventListener("hashchange", render);
render();
