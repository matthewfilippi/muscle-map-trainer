import { MUSCLES } from "./data.js";

const selectedEquipment = new Set();
const filterId = "equipmentFilter";
const styleId = "equipment-filter-fallback-style";

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

function slugifyEquipment(label) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getExerciseEquipmentTypes(equipment) {
  return equipment
    .split(/\s+or\s+|,|\/|\+/i)
    .map(normalizeEquipmentLabel)
    .filter(Boolean)
    .map((label) => ({
      id: slugifyEquipment(label),
      label
    }));
}

function getEquipmentOptions() {
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

function injectStyles() {
  if (document.querySelector(`#${styleId}`)) return;

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .equipment-filter {
      margin: 0 0 24px;
      padding: 14px;
      border: 1px solid var(--border);
      border-top: 4px solid var(--blue);
      border-radius: 8px;
      background: #f7fbff;
    }

    .filter-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 12px;
    }

    .filter-heading p {
      margin: 0 0 3px;
      color: var(--blue);
      font-size: 0.74rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0;
    }

    .filter-heading h2 {
      margin: 0;
      font-size: 1.14rem;
    }

    .text-button {
      min-height: 32px;
      padding: 0 10px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #ffffff;
      color: var(--green-dark);
      font-size: 0.82rem;
      font-weight: 900;
    }

    .text-button:disabled {
      cursor: not-allowed;
      color: #9aa39f;
      background: #eef2ee;
    }

    .equipment-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .equipment-toggle {
      min-height: 34px;
      padding: 0 10px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #ffffff;
      color: #334039;
      font-size: 0.84rem;
      font-weight: 850;
    }

    .equipment-toggle.is-selected {
      border-color: var(--green-dark);
      background: var(--green-dark);
      color: #ffffff;
    }

    .equipment-filter-note {
      margin-bottom: 18px;
      padding: 12px 14px;
      border-left: 4px solid var(--blue);
      background: #f7fbff;
      color: var(--ink-soft);
      line-height: 1.5;
    }
  `;
  document.head.appendChild(style);
}

function renderFilter(root) {
  const options = getEquipmentOptions();
  const selected = [...selectedEquipment];

  root.innerHTML = `
    <div class="filter-heading">
      <div>
        <p>Filters</p>
        <h2>Equipment Filters</h2>
      </div>
      <button class="text-button" type="button" id="clearEquipment" ${selected.length === 0 ? "disabled" : ""}>All Equipment</button>
    </div>
    <div class="equipment-grid">
      ${options.map((equipment) => `
        <button
          class="equipment-toggle ${selectedEquipment.has(equipment.id) ? "is-selected" : ""}"
          type="button"
          data-equipment="${equipment.id}"
          aria-pressed="${selectedEquipment.has(equipment.id)}"
        >
          ${equipment.label}
        </button>
      `).join("")}
    </div>
  `;

  root.querySelector("#clearEquipment").addEventListener("click", () => {
    selectedEquipment.clear();
    renderFilter(root);
    applyFilters();
  });

  root.querySelectorAll(".equipment-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const equipmentId = button.dataset.equipment;
      if (selectedEquipment.has(equipmentId)) {
        selectedEquipment.delete(equipmentId);
      } else {
        selectedEquipment.add(equipmentId);
      }

      renderFilter(root);
      applyFilters();
    });
  });
}

function ensureFilter() {
  const existingFilter = document.querySelector(`#${filterId}`);
  if (existingFilter && existingFilter.dataset.fallback !== "true") {
    return;
  }

  const levelControl = document.querySelector(".routine-builder .level-control");
  if (!levelControl) return;

  const filter = existingFilter ?? document.createElement("div");
  filter.id = filterId;
  filter.className = "equipment-filter";
  filter.dataset.fallback = "true";

  if (!existingFilter) {
    levelControl.insertAdjacentElement("afterend", filter);
  }

  renderFilter(filter);
  applyFilters();
}

function getItemEquipmentIds(item) {
  const detailText = item.querySelector("p")?.textContent ?? "";
  const equipment = detailText.split(" - ")[1] ?? "";
  return getExerciseEquipmentTypes(equipment).map((type) => type.id);
}

function applyFilters() {
  const selected = [...selectedEquipment];
  const items = [...document.querySelectorAll(".routine-item")];
  const note = document.querySelector(".equipment-filter-note") ?? document.createElement("div");
  const result = document.querySelector(".routine-result");

  if (!result) return;

  note.className = "equipment-filter-note";
  note.textContent = selected.length === 0
    ? "Equipment: all available options"
    : `Equipment: ${getEquipmentOptions()
      .filter((option) => selectedEquipment.has(option.id))
      .map((option) => option.label)
      .join(", ")}`;

  const resultHeader = result.querySelector(".result-header");
  if (resultHeader && !note.parentElement) {
    resultHeader.insertAdjacentElement("afterend", note);
  }

  items.forEach((item) => {
    const itemEquipmentIds = getItemEquipmentIds(item);
    const shouldShow = selected.length === 0 || itemEquipmentIds.some((id) => selectedEquipment.has(id));
    item.hidden = !shouldShow;
  });
}

let pendingRender = false;
function scheduleRender() {
  if (pendingRender) return;
  pendingRender = true;
  window.requestAnimationFrame(() => {
    pendingRender = false;
    injectStyles();
    ensureFilter();
  });
}

new MutationObserver(scheduleRender).observe(document.querySelector("#app"), {
  childList: true,
  subtree: true
});

scheduleRender();
