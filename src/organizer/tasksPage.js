import { TASK_CATEGORIES, TASK_PRIORITIES } from "../organizerModel.js";
import {
  escapeOrganizerHtml,
  organizerEmptyState,
  selectOptions,
  showOrganizerChoice,
  showOrganizerForm,
  showOrganizerToast
} from "../organizerUi.js";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let taskSearch = "";
let taskCategory = "";

function parseDate(date) {
  return new Date(`${date}T12:00:00`);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date, amount) {
  const next = new Date(date);
  next.setDate(1);
  next.setMonth(next.getMonth() + amount);
  return next;
}

function startOfWeek(date) {
  return addDays(date, -date.getDay());
}

function longDate(date) {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date);
}

function monthLabel(date) {
  return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(date);
}

function taskMatches(task, showCompleted) {
  const query = taskSearch.toLowerCase();
  return (showCompleted || !task.completed) &&
    (!taskCategory || task.category === taskCategory) &&
    (!query || `${task.title} ${task.description} ${task.category}`.toLowerCase().includes(query));
}

function relatedLabel(task, user) {
  if (!task.relatedEntityType || !task.relatedEntityId) return "";
  if (task.relatedEntityType === "GROCERY_ITEM") {
    const item = user.groceryItems.find((candidate) => candidate.id === task.relatedEntityId);
    return item ? `Grocery: ${item.name}` : "Grocery item unavailable";
  }
  if (task.relatedEntityType === "INVENTORY_ITEM") {
    const item = user.inventoryItems.find((candidate) => candidate.id === task.relatedEntityId);
    return item ? `Inventory: ${item.name}` : "Inventory item unavailable";
  }
  if (task.relatedEntityType === "RECORD_LIST") {
    const list = user.recordLists.find((candidate) => candidate.id === task.relatedEntityId);
    return list ? `Records: ${list.title}` : "Records list unavailable";
  }
  if (task.relatedEntityType === "RECORD_ITEM") {
    const item = user.recordItems.find((candidate) => candidate.id === task.relatedEntityId);
    return item ? `Records: ${item.content}` : "Records item unavailable";
  }
  return task.relatedEntityType.replaceAll("_", " ").toLowerCase();
}

function taskCard(task, user, compact = false) {
  const relation = relatedLabel(task, user);
  return `
    <article class="task-card task-priority-${escapeOrganizerHtml(task.priority.toLowerCase())}${task.completed ? " is-complete" : ""}${compact ? " is-compact" : ""}" data-task="${escapeOrganizerHtml(task.id)}">
      <label class="task-check">
        <input type="checkbox" data-task-complete="${escapeOrganizerHtml(task.id)}"${task.completed ? " checked" : ""}>
        <span class="sr-only">Mark ${escapeOrganizerHtml(task.title)} complete</span>
      </label>
      <div class="task-copy">
        <strong>${escapeOrganizerHtml(task.title)}</strong>
        <div class="organizer-meta">
          <span>${task.allDay || !task.time ? "All day" : escapeOrganizerHtml(task.time)}</span>
          <span>${escapeOrganizerHtml(task.category)}</span>
          <span>${escapeOrganizerHtml(task.priority)}</span>
          ${task.recurrenceRule !== "none" ? `<span>Repeats ${escapeOrganizerHtml(task.recurrenceRule)}</span>` : ""}
        </div>
        ${!compact && task.description ? `<p>${escapeOrganizerHtml(task.description)}</p>` : ""}
        ${!compact && relation ? `<button class="task-related-link" type="button" data-related-type="${escapeOrganizerHtml(task.relatedEntityType)}" data-related-id="${escapeOrganizerHtml(task.relatedEntityId)}">${escapeOrganizerHtml(relation)}</button>` : ""}
      </div>
      ${!compact ? `
        <div class="organizer-item-actions">
          <button type="button" data-action="task-day-back" data-id="${escapeOrganizerHtml(task.id)}" aria-label="Move task back one day">Previous day</button>
          <button type="button" data-action="edit-task" data-id="${escapeOrganizerHtml(task.id)}">Edit</button>
          <button type="button" data-action="task-day-forward" data-id="${escapeOrganizerHtml(task.id)}" aria-label="Move task forward one day">Next day</button>
          <button type="button" data-action="delete-task" data-id="${escapeOrganizerHtml(task.id)}" class="is-danger">Delete</button>
        </div>
      ` : ""}
    </article>
  `;
}

function tasksForDate(tasks, date, showCompleted) {
  return tasks
    .filter((task) => task.date === date && taskMatches(task, showCompleted))
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99") || a.title.localeCompare(b.title));
}

function renderMonthView(tasks, activeDate, user, showCompleted) {
  const first = new Date(activeDate.getFullYear(), activeDate.getMonth(), 1, 12);
  const start = addDays(first, -first.getDay());
  const days = Array.from({ length: 42 }, (_, index) => addDays(start, index));
  return `
    <div class="task-calendar-month">
      ${DAY_LABELS.map((label) => `<div class="task-weekday">${label}</div>`).join("")}
      ${days.map((date) => {
        const dateKey = isoDate(date);
        const dayTasks = tasksForDate(tasks, dateKey, showCompleted);
        const outside = date.getMonth() !== activeDate.getMonth();
        return `
          <section class="task-calendar-day${outside ? " is-outside" : ""}${dateKey === isoDate(new Date()) ? " is-today" : ""}">
            <button type="button" class="task-date-button" data-open-date="${dateKey}" aria-label="Open ${escapeOrganizerHtml(longDate(date))}">
              ${date.getDate()}
            </button>
            <div class="task-calendar-day-items">
              ${dayTasks.slice(0, 3).map((task) => taskCard(task, user, true)).join("")}
              ${dayTasks.length > 3 ? `<button type="button" data-open-date="${dateKey}" class="task-more-button">+${dayTasks.length - 3} more</button>` : ""}
              ${dayTasks.length ? `<button type="button" data-open-date="${dateKey}" class="task-mobile-count">${dayTasks.length} task${dayTasks.length === 1 ? "" : "s"}</button>` : ""}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderWeekView(tasks, activeDate, user, showCompleted) {
  const start = startOfWeek(activeDate);
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  return `
    <div class="task-calendar-week">
      ${days.map((date) => {
        const dateKey = isoDate(date);
        const dayTasks = tasksForDate(tasks, dateKey, showCompleted);
        return `
          <section class="task-week-column${dateKey === isoDate(new Date()) ? " is-today" : ""}">
            <button type="button" class="task-week-heading" data-open-date="${dateKey}">
              <span>${DAY_LABELS[date.getDay()]}</span>
              <strong>${date.getDate()}</strong>
            </button>
            <div>${dayTasks.map((task) => taskCard(task, user, true)).join("") || "<p class='task-day-empty'>No tasks</p>"}</div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function renderDayView(tasks, activeDate, user, showCompleted) {
  const dateKey = isoDate(activeDate);
  const dayTasks = tasksForDate(tasks, dateKey, showCompleted);
  return `
    <section class="task-day-view">
      <header>
        <p>${escapeOrganizerHtml(longDate(activeDate))}</p>
        <h2>${dayTasks.length} task${dayTasks.length === 1 ? "" : "s"}</h2>
      </header>
      <div class="task-list">
        ${dayTasks.length ? dayTasks.map((task) => taskCard(task, user)).join("") : organizerEmptyState("Nothing scheduled", "Add a task or choose another date.", "Add task", "add-task")}
      </div>
    </section>
  `;
}

function renderListView(tasks, user, showCompleted) {
  const matching = tasks
    .filter((task) => taskMatches(task, showCompleted))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || "99:99").localeCompare(b.time || "99:99"));
  const groups = new Map();
  matching.forEach((task) => {
    if (!groups.has(task.date)) groups.set(task.date, []);
    groups.get(task.date).push(task);
  });
  return `
    <div class="task-list-view">
      ${groups.size ? [...groups.entries()].map(([date, dayTasks]) => `
        <section>
          <header><strong>${escapeOrganizerHtml(longDate(parseDate(date)))}</strong><span>${dayTasks.length}</span></header>
          <div class="task-list">${dayTasks.map((task) => taskCard(task, user)).join("")}</div>
        </section>
      `).join("") : organizerEmptyState("No matching tasks", "Add a task or clear your filters.", "Add task", "add-task")}
    </div>
  `;
}

async function taskForm(service, user, task, date, rerender) {
  const relatedOptions = [
    ...user.recordLists.filter((list) => !list.archived).map((list) => ({
      value: `RECORD_LIST::${list.id}`,
      label: `Records list: ${list.title}`
    })),
    ...user.recordItems.map((item) => ({
      value: `RECORD_ITEM::${item.id}`,
      label: `Records item: ${item.content}`
    })),
    ...user.groceryItems.map((item) => ({
      value: `GROCERY_ITEM::${item.id}`,
      label: `Grocery: ${item.name}`
    })),
    ...user.inventoryItems.map((item) => ({
      value: `INVENTORY_ITEM::${item.id}`,
      label: `Inventory: ${item.name}`
    }))
  ];
  const relatedValue = task?.relatedEntityType && task?.relatedEntityId
    ? `${task.relatedEntityType}::${task.relatedEntityId}`
    : "";
  const values = await showOrganizerForm({
    title: task ? "Edit task" : "Create task",
    submitLabel: task ? "Save changes" : "Create task",
    fields: [
      { name: "title", label: "Task title", required: true, wide: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "time", label: "Optional time", type: "time" },
      { name: "allDay", label: "All-day task", type: "checkbox" },
      { name: "dueAt", label: "Optional due date and time", type: "datetime-local" },
      { name: "reminderAt", label: "Optional reminder", type: "datetime-local" },
      { name: "priority", label: "Priority", type: "select", options: TASK_PRIORITIES },
      { name: "category", label: "Category", type: "select", options: TASK_CATEGORIES },
      {
        name: "recurrenceRule",
        label: "Repeat",
        type: "select",
        options: [
          { value: "none", label: "Does not repeat" },
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" }
        ]
      },
      {
        name: "related",
        label: "Related app item",
        type: "select",
        options: relatedOptions,
        includeBlank: true,
        blankLabel: "No related item"
      },
      { name: "description", label: "Notes", type: "textarea" }
    ],
    values: task ? { ...task, related: relatedValue } : {
      date,
      allDay: true,
      priority: "Medium",
      category: "Personal",
      recurrenceRule: "none",
      related: ""
    }
  });
  if (!values) return;
  try {
    const [relatedEntityType, relatedEntityId] = values.related
      ? values.related.split("::")
      : [null, null];
    const payload = { ...values, relatedEntityType, relatedEntityId };
    delete payload.related;
    if (task) service.updateTask(task.id, payload);
    else service.createTask(payload);
    rerender();
  } catch (error) {
    showOrganizerToast(error.message, "error");
  }
}

export function renderTasksPage(root, service, rerender) {
  const user = service.snapshot();
  const view = ["month", "week", "day", "list"].includes(user.preferences.taskView)
    ? user.preferences.taskView
    : "month";
  const activeDate = parseDate(user.preferences.taskDate || isoDate(new Date()));
  const showCompleted = user.preferences.showCompletedTasks !== false;
  const title = view === "month"
    ? monthLabel(activeDate)
    : view === "week"
      ? `${monthLabel(startOfWeek(activeDate))} week`
      : view === "day"
        ? longDate(activeDate)
        : "All tasks";
  const mainView = view === "month"
    ? renderMonthView(user.tasks, activeDate, user, showCompleted)
    : view === "week"
      ? renderWeekView(user.tasks, activeDate, user, showCompleted)
      : view === "day"
        ? renderDayView(user.tasks, activeDate, user, showCompleted)
        : renderListView(user.tasks, user, showCompleted);
  const selectedDayTasks = tasksForDate(user.tasks, isoDate(activeDate), showCompleted);

  root.innerHTML = `
    <section class="organizer-page tasks-page">
      <header class="organizer-page-header">
        <div>
          <p class="organizer-eyebrow">Plan and follow through</p>
          <h1>Tasks</h1>
          <span>Schedule exercise, food, inventory, health, work, and personal reminders.</span>
        </div>
        <button class="organizer-button organizer-button-primary" type="button" data-action="add-task">Add task</button>
      </header>
      <div class="task-view-switch" role="tablist" aria-label="Task views">
        ${["month", "week", "day", "list"].map((option) => `
          <button type="button" role="tab" data-task-view="${option}" aria-selected="${view === option}" class="${view === option ? "is-active" : ""}">
            ${option[0].toUpperCase()}${option.slice(1)}
          </button>
        `).join("")}
      </div>
      <div class="task-layout">
        <section class="organizer-workspace task-calendar-panel">
          <div class="task-calendar-toolbar">
            <div>
              <button type="button" data-calendar-move="-1" aria-label="Previous ${escapeOrganizerHtml(view)}">Previous</button>
              <button type="button" data-calendar-today>Today</button>
              <button type="button" data-calendar-move="1" aria-label="Next ${escapeOrganizerHtml(view)}">Next</button>
            </div>
            <h2>${escapeOrganizerHtml(title)}</h2>
            <button class="organizer-button organizer-button-primary" type="button" data-action="add-task">Add task</button>
          </div>
          ${mainView}
        </section>
        <aside class="organizer-sidebar task-detail-panel">
          <strong>Task controls</strong>
          <label class="organizer-search">
            <span>Search tasks</span>
            <input type="search" value="${escapeOrganizerHtml(taskSearch)}" placeholder="Search title, notes, category" data-task-search>
          </label>
          <label class="organizer-field">
            <span>Category</span>
            <select data-task-category>${selectOptions(TASK_CATEGORIES, taskCategory, true, "All categories")}</select>
          </label>
          <label class="organizer-toggle">
            <input type="checkbox" data-show-completed${showCompleted ? " checked" : ""}>
            <span>Show completed tasks</span>
          </label>
          <div class="task-selected-date">
            <p>Selected date</p>
            <strong>${escapeOrganizerHtml(longDate(activeDate))}</strong>
            <span>${selectedDayTasks.length} visible task${selectedDayTasks.length === 1 ? "" : "s"}</span>
          </div>
          <button class="organizer-button organizer-button-primary organizer-mobile-add" type="button" data-action="add-task">Add task</button>
        </aside>
      </div>
    </section>
  `;

  root.querySelectorAll("[data-task-view]").forEach((button) => {
    button.addEventListener("click", () => {
      service.updatePreferences({ taskView: button.dataset.taskView });
      rerender();
    });
  });
  root.querySelectorAll("[data-open-date]").forEach((button) => {
    button.addEventListener("click", () => {
      service.updatePreferences({ taskDate: button.dataset.openDate, taskView: "day" });
      rerender();
    });
  });
  root.querySelectorAll("[data-task-complete]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      service.completeTask(checkbox.dataset.taskComplete, checkbox.checked);
      rerender();
    });
  });
  root.querySelector("[data-task-search]")?.addEventListener("input", (event) => {
    taskSearch = event.target.value;
    rerender();
  });
  root.querySelector("[data-task-category]")?.addEventListener("change", (event) => {
    taskCategory = event.target.value;
    rerender();
  });
  root.querySelector("[data-show-completed]")?.addEventListener("change", (event) => {
    service.updatePreferences({ showCompletedTasks: event.target.checked });
    rerender();
  });
  root.querySelector("[data-calendar-today]")?.addEventListener("click", () => {
    service.updatePreferences({ taskDate: isoDate(new Date()) });
    rerender();
  });
  root.querySelectorAll("[data-calendar-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = Number(button.dataset.calendarMove);
      let next = activeDate;
      if (view === "month") next = addMonths(activeDate, direction);
      if (view === "week") next = addDays(activeDate, direction * 7);
      if (view === "day") next = addDays(activeDate, direction);
      if (view === "list") next = addMonths(activeDate, direction);
      service.updatePreferences({ taskDate: isoDate(next) });
      rerender();
    });
  });
  root.onclick = async (event) => {
    const related = event.target.closest("[data-related-type]");
    if (related) {
      if (related.dataset.relatedType === "RECORD_LIST") {
        service.updatePreferences({ activeRecordListId: related.dataset.relatedId });
      }
      if (related.dataset.relatedType === "RECORD_ITEM") {
        const item = user.recordItems.find((candidate) => candidate.id === related.dataset.relatedId);
        if (item) service.updatePreferences({ activeRecordListId: item.recordListId });
      }
      if (related.dataset.relatedType === "GROCERY_ITEM") {
        const item = user.groceryItems.find((candidate) => candidate.id === related.dataset.relatedId);
        if (item) service.updatePreferences({ groceryStatus: item.groceryStatus });
      }
      if (related.dataset.relatedType === "INVENTORY_ITEM") {
        const item = user.inventoryItems.find((candidate) => candidate.id === related.dataset.relatedId);
        if (item) service.updatePreferences({
          activeInventorySectionId: item.sectionId,
          activeInventoryContainerId: item.containerId
        });
      }
      const destination = related.dataset.relatedType === "GROCERY_ITEM"
        ? "grocery"
        : related.dataset.relatedType === "INVENTORY_ITEM"
          ? "inventory"
          : "records";
      window.location.hash = destination;
      return;
    }
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const task = button.dataset.id ? user.tasks.find((candidate) => candidate.id === button.dataset.id) : null;
    if (action === "add-task") await taskForm(service, user, null, isoDate(activeDate), rerender);
    if (action === "edit-task" && task) await taskForm(service, user, task, task.date, rerender);
    if (action === "task-day-back" && task) {
      service.updateTask(task.id, { date: isoDate(addDays(parseDate(task.date), -1)) });
      rerender();
    }
    if (action === "task-day-forward" && task) {
      service.updateTask(task.id, { date: isoDate(addDays(parseDate(task.date), 1)) });
      rerender();
    }
    if (action === "delete-task" && task) {
      const choice = await showOrganizerChoice({
        title: `Delete ${task.title}?`,
        message: "This task will be removed from the calendar.",
        danger: true,
        choices: [{ value: "delete", label: "Delete task", primary: true }, { value: "cancel", label: "Cancel" }]
      });
      if (choice === "delete") {
        service.deleteTask(task.id);
        rerender();
      }
    }
  };
}
