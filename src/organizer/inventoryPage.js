import {
  GROCERY_CATEGORIES,
  INVENTORY_CONDITIONS,
  INVENTORY_CONTAINER_TEMPLATES,
  INVENTORY_SECTION_TEMPLATES,
  getInventoryFlags,
  ordered
} from "../organizerModel.js";
import {
  escapeOrganizerHtml,
  organizerEmptyState,
  reorderButtons,
  selectOptions,
  showOrganizerChoice,
  showOrganizerForm,
  showOrganizerToast,
  syncIndicator
} from "../organizerUi.js";

let inventorySearch = "";
let inventoryCondition = "";
let inventoryCategory = "";
let inventoryFlag = "";

function inventoryItemLink(user, id) {
  return user.syncRelationships.find((relationship) =>
    relationship.destinationType === "INVENTORY_ITEM" && relationship.destinationId === id
  );
}

function locationLabel(user, item) {
  const section = user.inventorySections.find((candidate) => candidate.id === item.sectionId);
  const container = user.inventoryContainers.find((candidate) => candidate.id === item.containerId);
  return `${section?.title || "Unknown"} -> ${container?.title || "Unknown"}`;
}

function inventoryBadges(item) {
  const flags = getInventoryFlags(item);
  return [
    flags.low ? '<span class="inventory-flag is-warning">Low stock</span>' : "",
    flags.expired ? '<span class="inventory-flag is-danger">Expired</span>' : "",
    flags.expiring ? '<span class="inventory-flag is-warning">Expires soon</span>' : "",
    flags.replacement ? '<span class="inventory-flag is-warning">Replace soon</span>' : "",
    flags.missing ? '<span class="inventory-flag is-danger">Missing</span>' : "",
    flags.repair ? '<span class="inventory-flag is-warning">Needs repair</span>' : ""
  ].join("");
}

function safeImageUrl(value) {
  return /^https?:\/\//i.test(value || "") ? value : "";
}

function renderInventoryItem(item, user) {
  const linked = inventoryItemLink(user, item.id);
  const imageUrl = safeImageUrl(item.imageUrl);
  return `
    <article class="inventory-item" data-inventory-item="${escapeOrganizerHtml(item.id)}">
      ${imageUrl ? `<img src="${escapeOrganizerHtml(imageUrl)}" alt="${escapeOrganizerHtml(item.name)}">` : ""}
      <div class="inventory-item-copy">
        <div class="inventory-title-row">
          <strong>${escapeOrganizerHtml(item.name)}</strong>
          <span>${escapeOrganizerHtml(String(item.quantity))}${item.unit ? ` ${escapeOrganizerHtml(item.unit)}` : ""}</span>
        </div>
        <p class="inventory-location">${escapeOrganizerHtml(locationLabel(user, item))}</p>
        <div class="inventory-flags">${inventoryBadges(item)}${linked ? syncIndicator("Synced") : ""}</div>
        <dl class="inventory-item-details">
          <div><dt>Condition</dt><dd>${escapeOrganizerHtml(item.condition)}</dd></div>
          ${item.category ? `<div><dt>Category</dt><dd>${escapeOrganizerHtml(item.category)}</dd></div>` : ""}
          ${item.expirationDate ? `<div><dt>Expires</dt><dd>${escapeOrganizerHtml(item.expirationDate)}</dd></div>` : ""}
          ${item.replacementDate ? `<div><dt>Replace</dt><dd>${escapeOrganizerHtml(item.replacementDate)}</dd></div>` : ""}
          ${item.estimatedValue !== null ? `<div><dt>Value</dt><dd>$${escapeOrganizerHtml(Number(item.estimatedValue).toFixed(2))}</dd></div>` : ""}
        </dl>
        ${item.notes ? `<p>${escapeOrganizerHtml(item.notes)}</p>` : ""}
      </div>
      <div class="inventory-quantity-controls" aria-label="Quantity controls">
        <button type="button" data-action="quantity-down" data-id="${escapeOrganizerHtml(item.id)}" aria-label="Decrease ${escapeOrganizerHtml(item.name)} quantity">-</button>
        <strong>${escapeOrganizerHtml(String(item.quantity))}</strong>
        <button type="button" data-action="quantity-up" data-id="${escapeOrganizerHtml(item.id)}" aria-label="Increase ${escapeOrganizerHtml(item.name)} quantity">+</button>
      </div>
      <div class="organizer-item-actions">
        ${reorderButtons(item.id, "inventory-item")}
        <button type="button" data-action="edit-inventory-item" data-id="${escapeOrganizerHtml(item.id)}">Edit / Move</button>
        <button type="button" data-action="copy-inventory-item" data-id="${escapeOrganizerHtml(item.id)}">Copy</button>
        <button type="button" data-action="mark-missing" data-id="${escapeOrganizerHtml(item.id)}">Missing</button>
        <button type="button" data-action="mark-discarded" data-id="${escapeOrganizerHtml(item.id)}">Discarded</button>
        <button type="button" data-action="shop-inventory-item" data-id="${escapeOrganizerHtml(item.id)}">Add to Grocery</button>
        <button type="button" data-action="replace-inventory-item" data-id="${escapeOrganizerHtml(item.id)}">Replacement task</button>
        <button type="button" data-action="delete-inventory-item" data-id="${escapeOrganizerHtml(item.id)}" class="is-danger">Delete</button>
      </div>
    </article>
  `;
}

async function createSection(service, rerender) {
  const template = await showOrganizerForm({
    title: "Add inventory section",
    submitLabel: "Continue",
    fields: [{
      name: "template",
      label: "Section template",
      type: "select",
      options: INVENTORY_SECTION_TEMPLATES
    }],
    values: { template: "Pantry" }
  });
  if (!template) return;
  let title = template.template;
  if (["Custom Section", "Other"].includes(title)) {
    const custom = await showOrganizerForm({
      title: "Name this section",
      submitLabel: "Create section",
      fields: [{ name: "title", label: "Section title", required: true }]
    });
    if (!custom) return;
    title = custom.title;
  }
  service.createInventorySection(title);
  rerender();
}

async function createContainer(service, sectionId, rerender) {
  const template = await showOrganizerForm({
    title: "Add container",
    submitLabel: "Continue",
    fields: [{
      name: "template",
      label: "Container template",
      type: "select",
      options: INVENTORY_CONTAINER_TEMPLATES
    }],
    values: { template: "Shelf" }
  });
  if (!template) return;
  let title = template.template;
  if (title === "Custom Container") {
    const custom = await showOrganizerForm({
      title: "Name this container",
      submitLabel: "Create container",
      fields: [{ name: "title", label: "Container title", required: true }]
    });
    if (!custom) return;
    title = custom.title;
  }
  service.createInventoryContainer(sectionId, title);
  rerender();
}

async function inventoryItemForm(service, user, item, activeSectionId, activeContainerId, rerender) {
  if (!user.inventoryContainers.length) {
    showOrganizerToast("Create a section and container before adding an item.", "error");
    return;
  }
  const containerOptions = ordered(user.inventoryContainers).map((container) => {
    const section = user.inventorySections.find((candidate) => candidate.id === container.sectionId);
    return { value: container.id, label: `${section?.title || "Unknown"} -> ${container.title}` };
  });
  const values = await showOrganizerForm({
    title: item ? "Edit or move inventory item" : "Add inventory item",
    submitLabel: item ? "Save changes" : "Add item",
    fields: [
      { name: "name", label: "Item name", required: true, wide: true },
      { name: "quantity", label: "Quantity", type: "number", min: 0, step: 0.01 },
      { name: "unit", label: "Unit", placeholder: "pieces, bottles, lb" },
      { name: "containerId", label: "Location", type: "select", options: containerOptions },
      { name: "category", label: "Category", type: "select", options: GROCERY_CATEGORIES, includeBlank: true, blankLabel: "No category" },
      { name: "condition", label: "Condition", type: "select", options: INVENTORY_CONDITIONS },
      { name: "purchaseDate", label: "Purchase date", type: "date" },
      { name: "expirationDate", label: "Expiration date", type: "date" },
      { name: "replacementDate", label: "Replacement date", type: "date" },
      { name: "estimatedValue", label: "Estimated value", type: "number", min: 0, step: 0.01 },
      { name: "lowStockThreshold", label: "Low-stock threshold", type: "number", min: 0, step: 0.01 },
      { name: "imageUrl", label: "Image URL", type: "url", placeholder: "https://..." },
      { name: "notes", label: "Notes", type: "textarea" }
    ],
    values: item || { quantity: 1, condition: "Good", containerId: activeContainerId || containerOptions[0]?.value }
  });
  if (!values) return;
  const selectedContainer = user.inventoryContainers.find((container) => container.id === values.containerId);
  if (!selectedContainer) {
    showOrganizerToast("Choose a valid inventory location.", "error");
    return;
  }
  try {
    const payload = { ...values, sectionId: selectedContainer.sectionId };
    if (item) service.updateInventoryItem(item.id, payload);
    else service.createInventoryItem(payload);
    service.updatePreferences({
      activeInventorySectionId: selectedContainer.sectionId,
      activeInventoryContainerId: selectedContainer.id
    });
    rerender();
  } catch (error) {
    showOrganizerToast(error.message, "error");
  }
}

export function renderInventoryPage(root, service, rerender) {
  const user = service.snapshot();
  const sections = ordered(user.inventorySections);
  let activeSection = sections.find((section) => section.id === user.preferences.activeInventorySectionId) || sections[0];
  const containers = activeSection
    ? ordered(user.inventoryContainers.filter((container) => container.sectionId === activeSection.id))
    : [];
  let activeContainer = containers.find((container) => container.id === user.preferences.activeInventoryContainerId) || containers[0];
  const query = inventorySearch.toLowerCase();
  const items = ordered(user.inventoryItems.filter((item) => {
    const flags = getInventoryFlags(item);
    const matchesLocation = query || inventoryFlag || !activeContainer || item.containerId === activeContainer.id;
    const matchesSearch = !query || `${item.name} ${item.category} ${item.notes} ${locationLabel(user, item)}`.toLowerCase().includes(query);
    const matchesCondition = !inventoryCondition || item.condition === inventoryCondition;
    const matchesCategory = !inventoryCategory || item.category === inventoryCategory;
    const matchesFlag = !inventoryFlag || Boolean(flags[inventoryFlag]);
    return matchesLocation && matchesSearch && matchesCondition && matchesCategory && matchesFlag;
  }));
  const categories = [...new Set(user.inventoryItems.map((item) => item.category).filter(Boolean))].sort();
  const allFlags = user.inventoryItems.reduce((totals, item) => {
    const flags = getInventoryFlags(item);
    Object.keys(totals).forEach((key) => {
      if (flags[key]) totals[key] += 1;
    });
    return totals;
  }, { low: 0, expired: 0, expiring: 0, replacement: 0, missing: 0, repair: 0 });

  root.innerHTML = `
    <section class="organizer-page inventory-page">
      <header class="organizer-page-header">
        <div>
          <p class="organizer-eyebrow">Know what you own</p>
          <h1>Inventory</h1>
          <span>Track possessions by location, container, condition, quantity, and important dates.</span>
        </div>
        <button class="organizer-button organizer-button-primary" type="button" data-action="add-inventory-item">Add item</button>
      </header>
      <div class="inventory-alert-strip">
        <button type="button" data-inventory-flag="low" class="${inventoryFlag === "low" ? "is-active" : ""}"><strong>${allFlags.low}</strong> Low stock</button>
        <button type="button" data-inventory-flag="expired" class="${inventoryFlag === "expired" ? "is-active" : ""}"><strong>${allFlags.expired}</strong> Expired</button>
        <button type="button" data-inventory-flag="expiring" class="${inventoryFlag === "expiring" ? "is-active" : ""}"><strong>${allFlags.expiring}</strong> Expiring soon</button>
        <button type="button" data-inventory-flag="replacement" class="${inventoryFlag === "replacement" ? "is-active" : ""}"><strong>${allFlags.replacement}</strong> Replace</button>
        <button type="button" data-inventory-flag="missing" class="${inventoryFlag === "missing" ? "is-active" : ""}"><strong>${allFlags.missing}</strong> Missing</button>
        <button type="button" data-inventory-flag="repair" class="${inventoryFlag === "repair" ? "is-active" : ""}"><strong>${allFlags.repair}</strong> Repair</button>
      </div>
      <div class="inventory-layout">
        <aside class="organizer-sidebar inventory-locations">
          <div class="organizer-sidebar-heading">
            <strong>Locations</strong>
            <button type="button" data-action="add-section" aria-label="Add inventory section">Add</button>
          </div>
          <div class="inventory-section-list">
            ${sections.map((section) => `
              <div class="inventory-section-row${activeSection?.id === section.id ? " is-active" : ""}">
                <button type="button" data-select-section="${escapeOrganizerHtml(section.id)}">
                  <strong>${escapeOrganizerHtml(section.title)}</strong>
                  <small>${user.inventoryItems.filter((item) => item.sectionId === section.id).length} items</small>
                </button>
                ${reorderButtons(section.id, "inventory-section")}
              </div>
            `).join("") || organizerEmptyState("No locations", "Add a room, pantry, car, or other section.", "Add section", "add-section")}
          </div>
          ${activeSection ? `
            <div class="inventory-location-actions">
              <button type="button" data-action="rename-section">Rename</button>
              <button type="button" data-action="delete-section" class="is-danger">Delete</button>
            </div>
          ` : ""}
        </aside>
        <section class="organizer-workspace inventory-workspace">
          ${activeSection ? `
            <header class="organizer-section-heading">
              <div>
                <p>${escapeOrganizerHtml(activeSection.title)}</p>
                <h2>${escapeOrganizerHtml(activeContainer?.title || "Choose a container")}</h2>
              </div>
              <button class="organizer-button organizer-button-quiet" type="button" data-action="add-container">Add container</button>
            </header>
            <div class="inventory-container-tabs" role="tablist" aria-label="Inventory containers">
              ${containers.map((container) => `
                <button type="button" role="tab" aria-selected="${activeContainer?.id === container.id}" class="${activeContainer?.id === container.id ? "is-active" : ""}" data-select-container="${escapeOrganizerHtml(container.id)}">
                  ${escapeOrganizerHtml(container.title)}
                </button>
              `).join("")}
            </div>
            ${activeContainer ? `
              <div class="inventory-container-actions">
                ${reorderButtons(activeContainer.id, "inventory-container")}
                <button type="button" data-action="rename-container">Rename container</button>
                <button type="button" data-action="delete-container" class="is-danger">Delete container</button>
              </div>
              <div class="organizer-toolbar inventory-filter-toolbar">
                <label class="organizer-search">
                  <span>Search entire inventory</span>
                  <input type="search" value="${escapeOrganizerHtml(inventorySearch)}" placeholder="Item, category, note, or location" data-inventory-search>
                </label>
                <label class="organizer-inline-field"><span>Category</span><select data-inventory-category>${selectOptions(categories, inventoryCategory, true, "All")}</select></label>
                <label class="organizer-inline-field"><span>Condition</span><select data-inventory-condition>${selectOptions(INVENTORY_CONDITIONS, inventoryCondition, true, "All")}</select></label>
                <button class="organizer-button organizer-button-primary" type="button" data-action="add-inventory-item">Add item</button>
              </div>
              <div class="inventory-items">
                ${items.length
                  ? items.map((item) => renderInventoryItem(item, user)).join("")
                  : organizerEmptyState(
                    inventorySearch || inventoryCategory || inventoryCondition || inventoryFlag ? "No matching inventory" : "This container is empty",
                    inventorySearch || inventoryCategory || inventoryCondition || inventoryFlag ? "Clear a filter or choose another location." : "Add the first item to this container.",
                    inventorySearch || inventoryCategory || inventoryCondition || inventoryFlag ? "" : "Add item",
                    "add-inventory-item"
                  )}
              </div>
            ` : organizerEmptyState("No containers yet", "Add a drawer, shelf, cabinet, or another container.", "Add container", "add-container")}
          ` : organizerEmptyState("Build your inventory map", "Start by adding a location such as Bedroom, Pantry, Garage, or Car.", "Add section", "add-section")}
        </section>
      </div>
    </section>
  `;

  root.querySelectorAll("[data-select-section]").forEach((button) => {
    button.addEventListener("click", () => {
      const sectionContainers = ordered(user.inventoryContainers.filter((container) => container.sectionId === button.dataset.selectSection));
      service.updatePreferences({
        activeInventorySectionId: button.dataset.selectSection,
        activeInventoryContainerId: sectionContainers[0]?.id ?? null
      });
      inventoryFlag = "";
      rerender();
    });
  });
  root.querySelectorAll("[data-select-container]").forEach((button) => {
    button.addEventListener("click", () => {
      service.updatePreferences({ activeInventoryContainerId: button.dataset.selectContainer });
      inventoryFlag = "";
      rerender();
    });
  });
  root.querySelector("[data-inventory-search]")?.addEventListener("input", (event) => {
    inventorySearch = event.target.value;
    rerender();
  });
  root.querySelector("[data-inventory-category]")?.addEventListener("change", (event) => {
    inventoryCategory = event.target.value;
    rerender();
  });
  root.querySelector("[data-inventory-condition]")?.addEventListener("change", (event) => {
    inventoryCondition = event.target.value;
    rerender();
  });
  root.querySelectorAll("[data-inventory-flag]").forEach((button) => {
    button.addEventListener("click", () => {
      inventoryFlag = inventoryFlag === button.dataset.inventoryFlag ? "" : button.dataset.inventoryFlag;
      inventorySearch = "";
      inventoryCategory = "";
      inventoryCondition = "";
      rerender();
    });
  });
  root.querySelectorAll("[data-reorder-type]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.direction);
      if (button.dataset.reorderType === "inventory-section") service.moveInventorySection(button.dataset.reorderId, direction);
      if (button.dataset.reorderType === "inventory-container") service.moveInventoryContainer(button.dataset.reorderId, direction);
      if (button.dataset.reorderType === "inventory-item") service.moveInventoryItemPosition(button.dataset.reorderId, direction);
      rerender();
    });
  });
  root.onclick = async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const item = button.dataset.id ? user.inventoryItems.find((candidate) => candidate.id === button.dataset.id) : null;
    if (action === "add-section") await createSection(service, rerender);
    if (action === "rename-section" && activeSection) {
      const values = await showOrganizerForm({
        title: "Rename section",
        submitLabel: "Save",
        fields: [{ name: "title", label: "Section title", required: true }],
        values: activeSection
      });
      if (values) {
        service.updateInventorySection(activeSection.id, values.title);
        rerender();
      }
    }
    if (action === "delete-section" && activeSection) {
      const choice = await showOrganizerChoice({
        title: `Delete ${activeSection.title}?`,
        message: "Every container and inventory item in this section will be deleted.",
        danger: true,
        choices: [{ value: "delete", label: "Delete section", primary: true }, { value: "cancel", label: "Cancel" }]
      });
      if (choice === "delete") {
        service.deleteInventorySection(activeSection.id);
        rerender();
      }
    }
    if (action === "add-container" && activeSection) await createContainer(service, activeSection.id, rerender);
    if (action === "rename-container" && activeContainer) {
      const values = await showOrganizerForm({
        title: "Rename container",
        submitLabel: "Save",
        fields: [{ name: "title", label: "Container title", required: true }],
        values: activeContainer
      });
      if (values) {
        service.updateInventoryContainer(activeContainer.id, values.title);
        rerender();
      }
    }
    if (action === "delete-container" && activeContainer) {
      const choice = await showOrganizerChoice({
        title: `Delete ${activeContainer.title}?`,
        message: "Every inventory item in this container will be deleted.",
        danger: true,
        choices: [{ value: "delete", label: "Delete container", primary: true }, { value: "cancel", label: "Cancel" }]
      });
      if (choice === "delete") {
        service.deleteInventoryContainer(activeContainer.id);
        rerender();
      }
    }
    if (action === "add-inventory-item") {
      await inventoryItemForm(service, user, null, activeSection?.id, activeContainer?.id, rerender);
    }
    if (action === "edit-inventory-item" && item) {
      await inventoryItemForm(service, user, item, activeSection?.id, activeContainer?.id, rerender);
    }
    if (action === "copy-inventory-item" && item) {
      service.duplicateInventoryItem(item.id);
      rerender();
    }
    if (action === "quantity-down" && item) {
      service.adjustInventoryQuantity(item.id, -1);
      rerender();
    }
    if (action === "quantity-up" && item) {
      service.adjustInventoryQuantity(item.id, 1);
      rerender();
    }
    if (action === "mark-missing" && item) {
      service.updateInventoryItem(item.id, { condition: "Missing" });
      rerender();
    }
    if (action === "mark-discarded" && item) {
      service.updateInventoryItem(item.id, { condition: "Discarded" });
      rerender();
    }
    if (action === "shop-inventory-item" && item) {
      service.createGroceryItem({
        name: item.name,
        quantity: item.lowStockThreshold || 1,
        unit: item.unit,
        category: item.category,
        notes: `Restock for ${locationLabel(user, item)}`,
        groceryStatus: "WANT"
      });
      showOrganizerToast("Added to Foods I Want.");
    }
    if (action === "replace-inventory-item" && item) {
      service.createTaskFromEntity(`Replace ${item.name}`, "Inventory", "INVENTORY_ITEM", item.id, item.replacementDate || undefined);
      showOrganizerToast("Replacement task added.");
    }
    if (action === "delete-inventory-item" && item) {
      const linked = inventoryItemLink(user, item.id);
      const choice = await showOrganizerChoice({
        title: `Delete ${item.name}?`,
        message: linked ? "This item is synchronized. Choose where it should be removed." : "This cannot be undone.",
        danger: true,
        choices: linked ? [
          { value: "everywhere", label: "Delete it everywhere", primary: true },
          { value: "local", label: "Remove only from Inventory" },
          { value: "cancel", label: "Cancel" }
        ] : [
          { value: "everywhere", label: "Delete item", primary: true },
          { value: "cancel", label: "Cancel" }
        ]
      });
      if (choice !== "cancel") {
        service.deleteInventoryItem(item.id, choice);
        rerender();
      }
    }
  };
}
