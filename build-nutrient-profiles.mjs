import { GROCERY_CATEGORIES, ordered } from "../organizerModel.js";
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

let grocerySearch = "";
let groceryCategory = "";

function groceryItemLink(user, id) {
  return user.syncRelationships.find((relationship) =>
    relationship.destinationType === "GROCERY_ITEM" && relationship.destinationId === id
  );
}

function quantityLabel(item) {
  if (item.quantity === null || item.quantity === undefined) return "";
  return `${item.quantity}${item.unit ? ` ${item.unit}` : ""}`;
}

function renderGroceryItem(item, user) {
  const linked = groceryItemLink(user, item.id);
  return `
    <article class="grocery-item" data-grocery-item="${escapeOrganizerHtml(item.id)}">
      <div class="grocery-item-main">
        <span class="grocery-category-mark" aria-hidden="true">${escapeOrganizerHtml((item.category || "Other").slice(0, 1).toUpperCase())}</span>
        <div>
          <strong>${escapeOrganizerHtml(item.name)}</strong>
          <div class="organizer-meta">
            ${quantityLabel(item) ? `<span>${escapeOrganizerHtml(quantityLabel(item))}</span>` : ""}
            ${item.category ? `<span>${escapeOrganizerHtml(item.category)}</span>` : ""}
            ${linked ? syncIndicator("Synced") : ""}
          </div>
          ${item.notes ? `<p>${escapeOrganizerHtml(item.notes)}</p>` : ""}
        </div>
      </div>
      <div class="organizer-item-actions">
        ${reorderButtons(item.id, "grocery-item")}
        <button type="button" data-action="edit-grocery" data-id="${escapeOrganizerHtml(item.id)}">Edit</button>
        <button type="button" data-action="move-grocery" data-id="${escapeOrganizerHtml(item.id)}">${item.groceryStatus === "WANT" ? "Obtained" : "Used up"}</button>
        <button type="button" data-action="copy-grocery" data-id="${escapeOrganizerHtml(item.id)}">Copy</button>
        <button type="button" data-action="task-grocery" data-id="${escapeOrganizerHtml(item.id)}">Add to Tasks</button>
        <button type="button" data-action="record-grocery" data-id="${escapeOrganizerHtml(item.id)}">Link to Records</button>
        <button type="button" data-action="delete-grocery" data-id="${escapeOrganizerHtml(item.id)}" class="is-danger">Delete</button>
      </div>
    </article>
  `;
}

async function groceryForm(service, status, item, rerender) {
  const values = await showOrganizerForm({
    title: item ? "Edit grocery item" : `Add to Foods I ${status === "HAVE" ? "Have" : "Want"}`,
    submitLabel: item ? "Save changes" : "Add item",
    fields: [
      { name: "name", label: "Food", required: true, wide: true },
      { name: "quantity", label: "Quantity", type: "number", min: 0, step: 0.01 },
      { name: "unit", label: "Unit", placeholder: "lb, cans, bunches" },
      { name: "category", label: "Category", type: "select", options: GROCERY_CATEGORIES, includeBlank: true, blankLabel: "No category" },
      { name: "notes", label: "Notes", type: "textarea" }
    ],
    values: item || { groceryStatus: status }
  });
  if (!values) return;
  try {
    if (item) service.updateGroceryItem(item.id, values);
    else service.createGroceryItem({ ...values, groceryStatus: status });
    rerender();
  } catch (error) {
    showOrganizerToast(error.message, "error");
  }
}

export function renderGroceryPage(root, service, rerender) {
  const user = service.snapshot();
  const status = user.preferences.groceryStatus === "HAVE" ? "HAVE" : "WANT";
  const query = grocerySearch.toLowerCase();
  const items = ordered(user.groceryItems.filter((item) =>
    item.groceryStatus === status &&
    (!groceryCategory || item.category === groceryCategory) &&
    (!query || `${item.name} ${item.category} ${item.notes}`.toLowerCase().includes(query))
  ));
  const counts = {
    HAVE: user.groceryItems.filter((item) => item.groceryStatus === "HAVE").length,
    WANT: user.groceryItems.filter((item) => item.groceryStatus === "WANT").length
  };
  const categories = [...new Set(user.groceryItems.map((item) => item.category).filter(Boolean))].sort();

  root.innerHTML = `
    <section class="organizer-page grocery-page">
      <header class="organizer-page-header">
        <div>
          <p class="organizer-eyebrow">Plan, shop, use</p>
          <h1>Grocery</h1>
          <span>Keep what is in your kitchen and what belongs on your next shopping trip in one place.</span>
        </div>
        <button class="organizer-button organizer-button-primary" type="button" data-action="add-grocery">Add food</button>
      </header>
      <div class="grocery-status-switch" role="tablist" aria-label="Grocery lists">
        <button type="button" role="tab" data-grocery-status="HAVE" aria-selected="${status === "HAVE"}" class="${status === "HAVE" ? "is-active" : ""}">
          Foods I Have <span>${counts.HAVE}</span>
        </button>
        <button type="button" role="tab" data-grocery-status="WANT" aria-selected="${status === "WANT"}" class="${status === "WANT" ? "is-active" : ""}">
          Foods I Want <span>${counts.WANT}</span>
        </button>
      </div>
      <div class="grocery-layout">
        <aside class="organizer-sidebar grocery-filters">
          <strong>Find food</strong>
          <label class="organizer-search">
            <span>Search current list</span>
            <input type="search" value="${escapeOrganizerHtml(grocerySearch)}" placeholder="Food, category, or note" data-grocery-search>
          </label>
          <label class="organizer-field">
            <span>Category</span>
            <select data-grocery-category>${selectOptions(categories, groceryCategory, true, "All categories")}</select>
          </label>
          <div class="grocery-quick-summary">
            <span><strong>${counts.HAVE}</strong> on hand</span>
            <span><strong>${counts.WANT}</strong> wanted</span>
          </div>
        </aside>
        <section class="organizer-workspace grocery-list-panel">
          <header class="organizer-section-heading">
            <div>
              <p>${status === "HAVE" ? "Kitchen and pantry" : "Shopping list"}</p>
              <h2>Foods I ${status === "HAVE" ? "Have" : "Want"}</h2>
            </div>
            <button class="organizer-button organizer-button-primary" type="button" data-action="add-grocery">Add item</button>
          </header>
          <div class="grocery-items">
            ${items.length
              ? items.map((item) => renderGroceryItem(item, user)).join("")
              : organizerEmptyState(
                grocerySearch || groceryCategory ? "No matching foods" : `Foods I ${status === "HAVE" ? "Have" : "Want"} is empty`,
                grocerySearch || groceryCategory ? "Clear a filter or try another search." : "Add an item here or move one from the other grocery list.",
                grocerySearch || groceryCategory ? "" : "Add food",
                "add-grocery"
              )}
          </div>
        </section>
      </div>
    </section>
  `;

  root.querySelectorAll("[data-grocery-status]").forEach((button) => {
    button.addEventListener("click", () => {
      service.updatePreferences({ groceryStatus: button.dataset.groceryStatus });
      grocerySearch = "";
      groceryCategory = "";
      rerender();
    });
  });
  root.querySelector("[data-grocery-search]")?.addEventListener("input", (event) => {
    grocerySearch = event.target.value;
    rerender();
  });
  root.querySelector("[data-grocery-category]")?.addEventListener("change", (event) => {
    groceryCategory = event.target.value;
    rerender();
  });
  root.querySelectorAll("[data-reorder-type='grocery-item']").forEach((button) => {
    button.addEventListener("click", () => {
      service.moveGroceryItemPosition(button.dataset.reorderId, Number(button.dataset.direction));
      rerender();
    });
  });
  root.onclick = async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const item = button.dataset.id ? user.groceryItems.find((candidate) => candidate.id === button.dataset.id) : null;
    if (action === "add-grocery") await groceryForm(service, status, null, rerender);
    if (action === "edit-grocery" && item) await groceryForm(service, status, item, rerender);
    if (action === "move-grocery" && item) {
      service.moveGroceryItem(item.id, item.groceryStatus === "WANT" ? "HAVE" : "WANT");
      showOrganizerToast(item.groceryStatus === "WANT" ? "Moved to Foods I Have." : "Moved to Foods I Want.");
      rerender();
    }
    if (action === "copy-grocery" && item) {
      service.duplicateGroceryItem(item.id);
      rerender();
    }
    if (action === "task-grocery" && item) {
      service.createTaskFromEntity(
        item.groceryStatus === "WANT" ? `Buy ${item.name}` : `Use ${item.name}`,
        "Grocery",
        "GROCERY_ITEM",
        item.id
      );
      showOrganizerToast("Task added.");
    }
    if (action === "record-grocery" && item) {
      const lists = ordered(user.recordLists.filter((list) => !list.archived));
      if (!lists.length) {
        showOrganizerToast("Create a Records list first.", "error");
        return;
      }
      const values = await showOrganizerForm({
        title: "Add this food to Records",
        submitLabel: "Add to list",
        fields: [{
          name: "recordListId",
          label: "Records list",
          type: "select",
          options: lists.map((list) => ({ value: list.id, label: list.title }))
        }]
      });
      if (values) {
        service.addGroceryToRecord(item.id, values.recordListId);
        showOrganizerToast("Added to Records.");
      }
    }
    if (action === "delete-grocery" && item) {
      const linked = groceryItemLink(user, item.id);
      const choice = await showOrganizerChoice({
        title: `Delete ${item.name}?`,
        message: linked ? "This item is synchronized. Choose where it should be removed." : "This cannot be undone.",
        danger: true,
        choices: linked ? [
          { value: "everywhere", label: "Delete it everywhere", primary: true },
          { value: "local", label: "Remove only from Grocery" },
          { value: "cancel", label: "Cancel" }
        ] : [
          { value: "everywhere", label: "Delete item", primary: true },
          { value: "cancel", label: "Cancel" }
        ]
      });
      if (choice !== "cancel") {
        service.deleteGroceryItem(item.id, choice);
        rerender();
      }
    }
  };
}
