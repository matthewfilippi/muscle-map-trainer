import "./organizer.css";
import { createOrganizerRepository } from "./organizerStore.js";
import { OrganizerService } from "./organizerModel.js";
import { renderRecordsPage } from "./organizer/recordsPage.js";
import { renderGroceryPage } from "./organizer/groceryPage.js";
import { renderInventoryPage } from "./organizer/inventoryPage.js";
import { renderTasksPage } from "./organizer/tasksPage.js";

const repository = createOrganizerRepository();
const service = new OrganizerService(repository);

export function renderOrganizerPage(page, pageRoot) {
  const rerender = () => renderOrganizerPage(page, pageRoot);
  if (page === "records") renderRecordsPage(pageRoot, service, rerender);
  if (page === "grocery") renderGroceryPage(pageRoot, service, rerender);
  if (page === "inventory") renderInventoryPage(pageRoot, service, rerender);
  if (page === "tasks") renderTasksPage(pageRoot, service, rerender);

  const pageElement = pageRoot.querySelector(".organizer-page");
  const pageHeader = pageElement?.querySelector(".organizer-page-header");
  if (pageElement && pageHeader) {
    const navigation = document.createElement("nav");
    navigation.className = "organizer-section-nav";
    navigation.setAttribute("aria-label", "Organizer");
    navigation.innerHTML = [
      ["grocery", "Grocery"],
      ["records", "Records"],
      ["inventory", "Inventory"],
      ["tasks", "Tasks"]
    ].map(([route, label]) => `
      <a href="#${route}"${route === page ? ' aria-current="page" class="is-active"' : ""}>${label}</a>
    `).join("");
    pageHeader.insertAdjacentElement("afterend", navigation);
  }
}

export { service as organizerService };
