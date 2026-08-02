import {
  INVENTORY_CONTAINER_TEMPLATES,
  INVENTORY_SECTION_TEMPLATES,
  RECORD_STYLES,
  RECORD_TEMPLATES,
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

let recordSearch = "";
let recordOverviewSearch = "";
let showArchived = false;

function connectionLabel(user, connection) {
  if (!connection) return "";
  if (connection.destinationType === "GROCERY_HAVE") return "Connected to Foods I Have";
  if (connection.destinationType === "GROCERY_WANT") return "Connected to Foods I Want";
  const container = user.inventoryContainers.find((item) => item.id === connection.destinationId);
  const section = user.inventorySections.find((item) => item.id === container?.sectionId);
  return `Connected to Inventory: ${section?.title || "Unknown"} -> ${container?.title || "Unknown"}`;
}

function itemConnection(user, itemId) {
  return user.syncRelationships.find((relationship) =>
    relationship.sourceType === "RECORD_ITEM" && relationship.sourceId === itemId
  );
}

function renderRecordItem(item, index, list, user) {
  const isChecklist = list.listStyle === "checklist";
  const itemClass = `record-item record-item-${list.listStyle}${item.completed ? " is-complete" : ""}`;
  const date = item.date ? `<time datetime="${escapeOrganizerHtml(item.date)}">${escapeOrganizerHtml(item.date)}</time>` : "";
  const link = itemConnection(user, item.id);
  return `
    <article class="${itemClass}" data-record-item="${escapeOrganizerHtml(item.id)}">
      <div class="record-item-leading">
        ${list.listStyle === "numbered" ? `<span class="record-number">${index + 1}</span>` : ""}
        ${isChecklist ? `<input type="checkbox" data-record-complete="${escapeOrganizerHtml(item.id)}"${item.completed ? " checked" : ""} aria-label="Mark ${escapeOrganizerHtml(item.content)} complete">` : ""}
      </div>
      <div class="record-item-copy">
        <strong>${escapeOrganizerHtml(item.content)}</strong>
        ${item.notes ? `<p>${escapeOrganizerHtml(item.notes)}</p>` : ""}
        <div class="organizer-meta">${date}${item.reminderAt ? `<span>Reminder ${escapeOrganizerHtml(item.reminderAt)}</span>` : ""}${link ? syncIndicator("Synced") : ""}</div>
      </div>
      <div class="organizer-item-actions">
        ${reorderButtons(item.id, "record-item")}
        <button type="button" data-action="edit-item" data-id="${escapeOrganizerHtml(item.id)}">Edit</button>
        <button type="button" data-action="duplicate-item" data-id="${escapeOrganizerHtml(item.id)}">Copy</button>
        <button type="button" data-action="transfer-item" data-id="${escapeOrganizerHtml(item.id)}">Move</button>
        <button type="button" data-action="delete-item" data-id="${escapeOrganizerHtml(item.id)}" class="is-danger">Delete</button>
      </div>
    </article>
  `;
}

async function createList(service, rerender) {
  const template = await showOrganizerForm({
    title: "Create a Records list",
    description: "Templates provide a starting title only.",
    submitLabel: "Continue",
    fields: [
      { name: "template", label: "Title template", type: "select", options: RECORD_TEMPLATES },
      { name: "listStyle", label: "List style", type: "select", options: RECORD_STYLES }
    ],
    values: { template: "Notes", listStyle: "plain" }
  });
  if (!template) return;
  const custom = ["Custom Title", "Blank List"].includes(template.template);
  let values = { title: template.template === "Blank List" ? "Untitled" : template.template, description: "" };
  if (custom) {
    const result = await showOrganizerForm({
      title: "Name this list",
      submitLabel: "Create list",
      fields: [
        { name: "title", label: "List title", required: true, placeholder: "Untitled" },
        { name: "description", label: "Description", type: "textarea" }
      ],
      values
    });
    if (!result) return;
    values = result;
  }
  service.createRecordList({ ...values, listStyle: template.listStyle });
  rerender();
}

async function editList(service, list, rerender) {
  const values = await showOrganizerForm({
    title: "Edit list",
    submitLabel: "Save changes",
    fields: [
      { name: "title", label: "List title", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "icon", label: "Optional short icon label", placeholder: "Idea" },
      { name: "listStyle", label: "List style", type: "select", options: RECORD_STYLES }
    ],
    values: list
  });
  if (!values) return;
  service.updateRecordList(list.id, values);
  rerender();
}

async function editRecordItem(service, listId, item, rerender) {
  const values = await showOrganizerForm({
    title: item ? "Edit record item" : "Add record item",
    submitLabel: item ? "Save changes" : "Add item",
    fields: [
      { name: "content", label: "Item", required: true, wide: true },
      { name: "notes", label: "Notes", type: "textarea" },
      { name: "date", label: "Optional date", type: "date" },
      { name: "reminderAt", label: "Optional reminder", type: "datetime-local" }
    ],
    values: item || {}
  });
  if (!values) return;
  try {
    if (item) service.updateRecordItem(item.id, values);
    else service.createRecordItem(listId, values);
    rerender();
  } catch (error) {
    showOrganizerToast(error.message, "error");
  }
}

async function configureConnection(service, list, user, rerender) {
  const current = user.syncRelationships.find((relationship) =>
    relationship.sourceType === "RECORD_LIST" && relationship.sourceId === list.id
  );
  if (current) {
    const mode = await showOrganizerChoice({
      title: "Disconnect this list?",
      message: "Choose which copies should remain after the connection is removed.",
      choices: [
        { value: "keep-both", label: "Keep independent copies in both places", primary: true },
        { value: "records-only", label: "Keep only the Records version" },
        { value: "destination-only", label: "Keep only the destination version" },
        { value: "cancel", label: "Cancel" }
      ]
    });
    if (mode === "cancel") return;
    service.disconnectRecordList(list.id, mode);
    rerender();
    return;
  }

  const destination = await showOrganizerForm({
    title: "Connect this list to...",
    description: "Synchronization starts only after you select a destination.",
    submitLabel: "Continue",
    fields: [{
      name: "destination",
      label: "Destination",
      type: "select",
      options: [
        { value: "GROCERY_HAVE", label: "Grocery: Foods I Have" },
        { value: "GROCERY_WANT", label: "Grocery: Foods I Want" },
        { value: "INVENTORY_EXISTING", label: "Inventory: existing container" },
        { value: "INVENTORY_NEW", label: "Inventory: new section and container" },
        { value: "INVENTORY_UNSORTED", label: "Inventory: Unsorted Inventory" }
      ]
    }]
  });
  if (!destination) return;

  if (destination.destination.startsWith("GROCERY_")) {
    service.connectRecordList(list.id, destination.destination, destination.destination);
    rerender();
    return;
  }

  let containerId;
  if (destination.destination === "INVENTORY_EXISTING") {
    const snapshot = service.snapshot();
    const options = ordered(snapshot.inventoryContainers).map((container) => {
      const section = snapshot.inventorySections.find((item) => item.id === container.sectionId);
      return { value: container.id, label: `${section?.title || "Unknown"} -> ${container.title}` };
    });
    if (!options.length) {
      showOrganizerToast("Create an inventory section and container first.", "error");
      return;
    }
    const result = await showOrganizerForm({
      title: "Choose an inventory container",
      submitLabel: "Connect",
      fields: [{ name: "containerId", label: "Container", type: "select", options }]
    });
    if (!result) return;
    containerId = result.containerId;
  } else {
    const isUnsorted = destination.destination === "INVENTORY_UNSORTED";
    const location = isUnsorted ? { sectionTitle: "Unsorted Inventory", containerTitle: "Unsorted" } : await showOrganizerForm({
      title: "Create the inventory destination",
      submitLabel: "Create and connect",
      fields: [
        { name: "sectionTitle", label: "Section", type: "select", options: INVENTORY_SECTION_TEMPLATES },
        { name: "containerTitle", label: "Container", type: "select", options: INVENTORY_CONTAINER_TEMPLATES }
      ],
      values: { sectionTitle: "Pantry", containerTitle: "Cabinet" }
    });
    if (!location) return;
    const currentUser = service.snapshot();
    let section = currentUser.inventorySections.find((item) => item.title === location.sectionTitle);
    const sectionId = section?.id || service.createInventorySection(location.sectionTitle);
    const refreshed = service.snapshot();
    let container = refreshed.inventoryContainers.find((item) =>
      item.sectionId === sectionId && item.title === location.containerTitle
    );
    containerId = container?.id || service.createInventoryContainer(sectionId, location.containerTitle);
  }
  service.connectRecordList(list.id, "INVENTORY_CONTAINER", containerId);
  rerender();
}

export function renderRecordsPage(root, service, rerender) {
  const user = service.snapshot();
  const visibleLists = ordered(user.recordLists.filter((list) => showArchived || !list.archived));
  let activeList = visibleLists.find((list) => list.id === user.preferences.activeRecordListId) || visibleLists[0];
  if (activeList && activeList.id !== user.preferences.activeRecordListId) {
    service.updatePreferences({ activeRecordListId: activeList.id });
  }
  const overviewQuery = recordOverviewSearch.toLowerCase();
  const overviewLists = visibleLists.filter((list) => {
    if (!overviewQuery) return true;
    const itemText = user.recordItems.filter((item) => item.recordListId === list.id).map((item) => item.content).join(" ");
    return `${list.title} ${list.description} ${itemText}`.toLowerCase().includes(overviewQuery);
  });
  const listIndex = activeList ? visibleLists.findIndex((list) => list.id === activeList.id) : -1;
  const connection = activeList ? user.syncRelationships.find((relationship) =>
    relationship.sourceType === "RECORD_LIST" && relationship.sourceId === activeList.id
  ) : null;
  const query = recordSearch.toLowerCase();
  const activeItems = activeList ? ordered(user.recordItems.filter((item) =>
    item.recordListId === activeList.id &&
    (!query || `${item.content} ${item.notes}`.toLowerCase().includes(query))
  )) : [];

  root.innerHTML = `
    <section class="organizer-page records-page">
      <header class="organizer-page-header">
        <div>
          <p class="organizer-eyebrow">Personal organizer</p>
          <h1>Records</h1>
          <span>Flexible lists for ideas, memories, questions, notes, and anything else worth keeping.</span>
        </div>
        <button class="organizer-button organizer-button-primary" type="button" data-action="create-list">Add list</button>
      </header>
      <div class="records-layout">
        <aside class="organizer-sidebar records-overview" aria-label="Records list overview">
          <div class="organizer-sidebar-heading">
            <strong>All lists</strong>
            <label class="organizer-toggle"><input type="checkbox" data-show-archived${showArchived ? " checked" : ""}><span>Archived</span></label>
          </div>
          <label class="organizer-search">
            <span>Search all Records lists</span>
            <input type="search" value="${escapeOrganizerHtml(recordOverviewSearch)}" placeholder="Search lists and items" data-record-overview-search>
          </label>
          <div class="records-list-picker">
            ${overviewLists.length ? overviewLists.map((list) => {
              const count = user.recordItems.filter((item) => item.recordListId === list.id).length;
              return `
                <button type="button" class="record-list-picker${activeList?.id === list.id ? " is-active" : ""}" data-select-list="${escapeOrganizerHtml(list.id)}">
                  <span>${escapeOrganizerHtml(list.icon || list.title.slice(0, 1).toUpperCase())}</span>
                  <strong>${escapeOrganizerHtml(list.title)}</strong>
                  <small>${count} item${count === 1 ? "" : "s"}</small>
                </button>
              `;
            }).join("") : organizerEmptyState("No matching lists", "Try another search or create a new list.")}
          </div>
        </aside>
        <section class="organizer-workspace">
          ${activeList ? `
            <header class="record-list-header">
              <div>
                <p>${escapeOrganizerHtml(activeList.title)} - ${listIndex + 1} of ${visibleLists.length}</p>
                <h2>${escapeOrganizerHtml(activeList.title)}</h2>
                ${activeList.description ? `<span>${escapeOrganizerHtml(activeList.description)}</span>` : ""}
                ${connection ? syncIndicator(connectionLabel(user, connection)) : ""}
              </div>
              <div class="organizer-header-actions">
                ${reorderButtons(activeList.id, "record-list")}
                <button type="button" class="organizer-button organizer-button-quiet" data-action="edit-list">Edit</button>
                <button type="button" class="organizer-button organizer-button-quiet" data-action="duplicate-list">Duplicate</button>
                <button type="button" class="organizer-button organizer-button-quiet" data-action="archive-list">${activeList.archived ? "Restore" : "Archive"}</button>
                <button type="button" class="organizer-button organizer-button-quiet" data-action="sync-list">${connection ? "Disconnect" : "Connect"}</button>
                <button type="button" class="organizer-button organizer-button-danger" data-action="delete-list">Delete</button>
              </div>
            </header>
            <div class="organizer-toolbar">
              <label class="organizer-search">
                <span>Search within ${escapeOrganizerHtml(activeList.title)}</span>
                <input type="search" value="${escapeOrganizerHtml(recordSearch)}" placeholder="Search this list" data-record-search>
              </label>
              <label class="organizer-inline-field">
                <span>Style</span>
                <select data-list-style>${selectOptions(RECORD_STYLES, activeList.listStyle)}</select>
              </label>
              <button type="button" class="organizer-button organizer-button-primary" data-action="add-item">Add item</button>
            </div>
            <div class="record-items record-items-${escapeOrganizerHtml(activeList.listStyle)}">
              ${activeItems.length
                ? activeItems.map((item, index) => renderRecordItem(item, index, activeList, user)).join("")
                : organizerEmptyState(
                  recordSearch ? "No matching items" : "This list is empty",
                  recordSearch ? "Try another search." : "Add the first item and it will be saved automatically.",
                  recordSearch ? "" : "Add item",
                  "add-item"
                )}
            </div>
          ` : organizerEmptyState("No Records lists yet", "Start with a template or give a blank list your own title.", "Create a list", "create-list")}
        </section>
      </div>
    </section>
  `;

  root.querySelector("[data-record-overview-search]")?.addEventListener("input", (event) => {
    recordOverviewSearch = event.target.value;
    rerender();
  });
  root.querySelector("[data-record-search]")?.addEventListener("input", (event) => {
    recordSearch = event.target.value;
    rerender();
  });
  root.querySelector("[data-show-archived]")?.addEventListener("change", (event) => {
    showArchived = event.target.checked;
    rerender();
  });
  root.querySelectorAll("[data-select-list]").forEach((button) => {
    button.addEventListener("click", () => {
      service.updatePreferences({ activeRecordListId: button.dataset.selectList });
      recordSearch = "";
      rerender();
    });
  });
  root.querySelector("[data-list-style]")?.addEventListener("change", (event) => {
    service.updateRecordList(activeList.id, { listStyle: event.target.value });
    rerender();
  });
  root.querySelectorAll("[data-record-complete]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      service.updateRecordItem(checkbox.dataset.recordComplete, { completed: checkbox.checked });
      rerender();
    });
  });
  root.querySelectorAll("[data-reorder-type]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.direction);
      if (button.dataset.reorderType === "record-list") service.moveRecordList(button.dataset.reorderId, direction);
      if (button.dataset.reorderType === "record-item") service.moveRecordItem(button.dataset.reorderId, direction);
      rerender();
    });
  });
  root.onclick = async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const item = button.dataset.id ? user.recordItems.find((candidate) => candidate.id === button.dataset.id) : null;
    if (action === "create-list") await createList(service, rerender);
    if (action === "edit-list" && activeList) await editList(service, activeList, rerender);
    if (action === "duplicate-list" && activeList) {
      service.duplicateRecordList(activeList.id);
      rerender();
    }
    if (action === "archive-list" && activeList) {
      service.updateRecordList(activeList.id, { archived: !activeList.archived });
      rerender();
    }
    if (action === "sync-list" && activeList) await configureConnection(service, activeList, user, rerender);
    if (action === "delete-list" && activeList) {
      const choice = await showOrganizerChoice({
        title: `Delete ${activeList.title}?`,
        message: "The Records list and its local items will be removed. Connected destination copies remain.",
        danger: true,
        choices: [
          { value: "delete", label: "Delete list", primary: true },
          { value: "cancel", label: "Cancel" }
        ]
      });
      if (choice === "delete") {
        service.deleteRecordList(activeList.id);
        rerender();
      }
    }
    if (action === "add-item" && activeList) await editRecordItem(service, activeList.id, null, rerender);
    if (action === "edit-item" && item) await editRecordItem(service, activeList.id, item, rerender);
    if (action === "duplicate-item" && item) {
      service.duplicateRecordItem(item.id);
      rerender();
    }
    if (action === "transfer-item" && item) {
      const targets = ordered(user.recordLists.filter((list) => !list.archived && list.id !== item.recordListId));
      if (!targets.length) {
        showOrganizerToast("Create another Records list first.", "error");
        return;
      }
      const values = await showOrganizerForm({
        title: "Move or copy item",
        submitLabel: "Apply",
        fields: [
          { name: "targetListId", label: "Destination list", type: "select", options: targets.map((list) => ({ value: list.id, label: list.title })) },
          { name: "mode", label: "Action", type: "select", options: [{ value: "move", label: "Move" }, { value: "copy", label: "Copy" }] }
        ]
      });
      if (values) {
        service.transferRecordItem(item.id, values.targetListId, values.mode);
        rerender();
      }
    }
    if (action === "delete-item" && item) {
      const synced = itemConnection(user, item.id);
      const choice = await showOrganizerChoice({
        title: `Delete ${item.content}?`,
        message: synced ? "This item is synchronized. Choose where it should be removed." : "This cannot be undone.",
        danger: true,
        choices: synced ? [
          { value: "everywhere", label: "Delete it everywhere", primary: true },
          { value: "local", label: "Remove only from Records" },
          { value: "cancel", label: "Cancel" }
        ] : [
          { value: "everywhere", label: "Delete item", primary: true },
          { value: "cancel", label: "Cancel" }
        ]
      });
      if (choice !== "cancel") {
        service.deleteRecordItem(item.id, choice);
        rerender();
      }
    }
  };
}
