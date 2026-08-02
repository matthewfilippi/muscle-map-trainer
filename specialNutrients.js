export function escapeOrganizerHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

export function selectOptions(options, selected = "", includeBlank = false, blankLabel = "None") {
  const normalized = options.map((option) =>
    typeof option === "string"
      ? { value: option, label: option }
      : { value: option.value ?? option.id ?? option.label, label: option.label ?? option.value ?? option.id }
  );
  return [
    ...(includeBlank ? [{ value: "", label: blankLabel }] : []),
    ...normalized
  ].map((option) => `
    <option value="${escapeOrganizerHtml(option.value)}"${String(option.value) === String(selected) ? " selected" : ""}>
      ${escapeOrganizerHtml(option.label)}
    </option>
  `).join("");
}

function renderField(field, values) {
  const value = values[field.name] ?? field.value ?? "";
  const required = field.required ? " required" : "";
  const helper = field.help ? `<small>${escapeOrganizerHtml(field.help)}</small>` : "";
  const attributes = [
    field.min !== undefined ? `min="${escapeOrganizerHtml(field.min)}"` : "",
    field.max !== undefined ? `max="${escapeOrganizerHtml(field.max)}"` : "",
    field.step !== undefined ? `step="${escapeOrganizerHtml(field.step)}"` : "",
    field.placeholder ? `placeholder="${escapeOrganizerHtml(field.placeholder)}"` : ""
  ].filter(Boolean).join(" ");

  if (field.type === "checkbox") {
    return `
      <label class="organizer-checkbox-field">
        <input name="${escapeOrganizerHtml(field.name)}" type="checkbox"${value ? " checked" : ""}>
        <span>${escapeOrganizerHtml(field.label)}</span>
      </label>
      ${helper}
    `;
  }

  if (field.type === "select") {
    return `
      <label class="organizer-field">
        <span>${escapeOrganizerHtml(field.label)}</span>
        <select name="${escapeOrganizerHtml(field.name)}"${required}>
          ${selectOptions(field.options || [], value, field.includeBlank, field.blankLabel)}
        </select>
        ${helper}
      </label>
    `;
  }

  if (field.type === "textarea") {
    return `
      <label class="organizer-field organizer-field-wide">
        <span>${escapeOrganizerHtml(field.label)}</span>
        <textarea name="${escapeOrganizerHtml(field.name)}" rows="${field.rows || 3}" ${attributes}${required}>${escapeOrganizerHtml(value)}</textarea>
        ${helper}
      </label>
    `;
  }

  return `
    <label class="organizer-field${field.wide ? " organizer-field-wide" : ""}">
      <span>${escapeOrganizerHtml(field.label)}</span>
      <input name="${escapeOrganizerHtml(field.name)}" type="${escapeOrganizerHtml(field.type || "text")}" value="${escapeOrganizerHtml(value)}" ${attributes}${required}>
      ${helper}
    </label>
  `;
}

export function showOrganizerForm({
  title,
  description = "",
  submitLabel = "Save",
  fields,
  values = {}
}) {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.className = "organizer-dialog";
    dialog.innerHTML = `
      <form method="dialog" class="organizer-dialog-form">
        <header>
          <div>
            <p>Wellness Map</p>
            <h2>${escapeOrganizerHtml(title)}</h2>
            ${description ? `<span>${escapeOrganizerHtml(description)}</span>` : ""}
          </div>
          <button class="organizer-icon-button" type="button" data-dialog-close aria-label="Close">x</button>
        </header>
        <div class="organizer-form-grid">
          ${fields.map((field) => renderField(field, values)).join("")}
        </div>
        <p class="organizer-form-error" data-form-error role="alert" hidden></p>
        <footer>
          <button class="organizer-button organizer-button-quiet" type="button" data-dialog-close>Cancel</button>
          <button class="organizer-button organizer-button-primary" type="submit">${escapeOrganizerHtml(submitLabel)}</button>
        </footer>
      </form>
    `;
    document.body.append(dialog);
    const form = dialog.querySelector("form");
    let finished = false;

    function finish(result) {
      if (finished) return;
      finished = true;
      dialog.close();
      dialog.remove();
      resolve(result);
    }

    dialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
      button.addEventListener("click", () => finish(null));
    });
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      finish(null);
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = {};
      fields.forEach((field) => {
        const control = form.elements.namedItem(field.name);
        data[field.name] = field.type === "checkbox" ? control.checked : control.value.trim();
      });
      finish(data);
    });
    dialog.showModal();
    const firstControl = form.querySelector("input:not([type='checkbox']), select, textarea");
    firstControl?.focus();
  });
}

export function showOrganizerChoice({
  title,
  message,
  choices,
  danger = false
}) {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.className = "organizer-dialog organizer-choice-dialog";
    dialog.innerHTML = `
      <section class="organizer-dialog-form">
        <header>
          <div>
            <p>Confirm action</p>
            <h2>${escapeOrganizerHtml(title)}</h2>
            <span>${escapeOrganizerHtml(message)}</span>
          </div>
        </header>
        <footer>
          ${choices.map((choice, index) => `
            <button
              class="organizer-button ${choice.primary ? (danger ? "organizer-button-danger" : "organizer-button-primary") : "organizer-button-quiet"}"
              type="button"
              data-choice="${escapeOrganizerHtml(choice.value)}"
              ${index === 0 ? "autofocus" : ""}
            >${escapeOrganizerHtml(choice.label)}</button>
          `).join("")}
        </footer>
      </section>
    `;
    document.body.append(dialog);
    let finished = false;
    function finish(value) {
      if (finished) return;
      finished = true;
      dialog.close();
      dialog.remove();
      resolve(value);
    }
    dialog.querySelectorAll("[data-choice]").forEach((button) => {
      button.addEventListener("click", () => finish(button.dataset.choice));
    });
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      finish("cancel");
    });
    dialog.showModal();
  });
}

export function showOrganizerToast(message, tone = "success") {
  document.querySelector(".organizer-toast")?.remove();
  const toast = document.createElement("div");
  toast.className = `organizer-toast organizer-toast-${tone}`;
  toast.setAttribute("role", tone === "error" ? "alert" : "status");
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 2800);
}

export function organizerEmptyState(title, message, actionLabel = "", action = "") {
  return `
    <section class="organizer-empty">
      <strong>${escapeOrganizerHtml(title)}</strong>
      <p>${escapeOrganizerHtml(message)}</p>
      ${actionLabel ? `<button class="organizer-button organizer-button-primary" type="button" data-action="${escapeOrganizerHtml(action)}">${escapeOrganizerHtml(actionLabel)}</button>` : ""}
    </section>
  `;
}

export function syncIndicator(label) {
  return `<span class="organizer-sync-badge" title="${escapeOrganizerHtml(label)}">${escapeOrganizerHtml(label)}</span>`;
}

export function reorderButtons(id, type) {
  return `
    <span class="organizer-reorder" aria-label="Reorder controls">
      <button type="button" data-reorder-type="${escapeOrganizerHtml(type)}" data-reorder-id="${escapeOrganizerHtml(id)}" data-direction="-1" aria-label="Move up">Up</button>
      <button type="button" data-reorder-type="${escapeOrganizerHtml(type)}" data-reorder-id="${escapeOrganizerHtml(id)}" data-direction="1" aria-label="Move down">Down</button>
    </span>
  `;
}
