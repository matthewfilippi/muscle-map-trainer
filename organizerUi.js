export const RECORD_TEMPLATES = [
  "Dreams",
  "Ideas",
  "Memories",
  "Questions",
  "Groceries",
  "Inventory",
  "Reminders",
  "Notes",
  "Blank List",
  "Custom Title"
];

export const RECORD_STYLES = [
  { id: "plain", label: "Plain list" },
  { id: "checklist", label: "Checklist" },
  { id: "numbered", label: "Numbered list" },
  { id: "journal", label: "Journal entries" },
  { id: "cards", label: "Cards" }
];

export const GROCERY_CATEGORIES = [
  "Produce",
  "Meat and seafood",
  "Dairy",
  "Grains and bread",
  "Pantry",
  "Frozen",
  "Drinks",
  "Snacks",
  "Condiments",
  "Other"
];

export const INVENTORY_SECTION_TEMPLATES = [
  "Bedroom",
  "Living Room",
  "Bathroom",
  "Pantry",
  "Garage",
  "Car",
  "Custom Section",
  "Other"
];

export const INVENTORY_CONTAINER_TEMPLATES = [
  "Drawer",
  "Shelf",
  "Basket",
  "Cabinet",
  "Fridge",
  "Closet",
  "Box",
  "Bin",
  "Freezer",
  "Counter",
  "Trunk",
  "Glove Compartment",
  "Storage Unit",
  "Custom Container"
];

export const INVENTORY_CONDITIONS = [
  "New",
  "Good",
  "Fair",
  "Damaged",
  "Needs repair",
  "Missing",
  "Discarded"
];

export const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"];
export const TASK_CATEGORIES = [
  "Exercise",
  "Food",
  "Grocery",
  "Inventory",
  "Health",
  "Work",
  "Personal",
  "Reminder",
  "Other"
];

function now() {
  return new Date().toISOString();
}

function clean(value, fallback = "") {
  const trimmed = String(value ?? "").replace(/\s+/g, " ").trim();
  return trimmed || fallback;
}

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function dateOrNull(value) {
  const normalized = clean(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null;
}

function nextPosition(items, predicate = () => true) {
  return items.filter(predicate).reduce((highest, item) => Math.max(highest, Number(item.position) || 0), -1) + 1;
}

function sortByPosition(items) {
  return [...items].sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || a.createdAt.localeCompare(b.createdAt));
}

function moveInCollection(items, id, direction, predicate = () => true) {
  const ordered = sortByPosition(items.filter(predicate));
  const index = ordered.findIndex((item) => item.id === id);
  const targetIndex = index + direction;
  if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return;
  const current = ordered[index];
  const target = ordered[targetIndex];
  const currentPosition = current.position;
  current.position = target.position;
  target.position = currentPosition;
}

function belongsTo(user, id, collectionName) {
  const item = user[collectionName].find((candidate) => candidate.id === id && candidate.userId === user.id);
  if (!item) throw new Error(`The requested ${collectionName} item is unavailable.`);
  return item;
}

function itemLinks(user, sourceId) {
  return user.syncRelationships.filter((relationship) =>
    relationship.sourceType === "RECORD_ITEM" && relationship.sourceId === sourceId
  );
}

function listConnection(user, listId) {
  return user.syncRelationships.find((relationship) =>
    relationship.sourceType === "RECORD_LIST" && relationship.sourceId === listId
  );
}

function destinationMatches(connection, type, destinationId) {
  if (connection.destinationType !== type) return false;
  return connection.destinationId === destinationId;
}

function removeWhere(array, predicate) {
  for (let index = array.length - 1; index >= 0; index -= 1) {
    if (predicate(array[index])) array.splice(index, 1);
  }
}

function futureDate(date, recurrenceRule) {
  const next = new Date(`${date}T12:00:00`);
  if (recurrenceRule === "daily") next.setDate(next.getDate() + 1);
  if (recurrenceRule === "weekly") next.setDate(next.getDate() + 7);
  if (recurrenceRule === "monthly") next.setMonth(next.getMonth() + 1);
  return next.toISOString().slice(0, 10);
}

export class OrganizerService {
  constructor(repository) {
    this.repository = repository;
  }

  snapshot() {
    return this.repository.getUser();
  }

  updatePreferences(changes) {
    this.repository.transact((user) => {
      user.preferences = { ...user.preferences, ...changes };
    });
  }

  createRecordList(data = {}) {
    const title = clean(data.title, "Untitled");
    let id;
    this.repository.transact((user) => {
      id = this.repository.createId("record-list");
      user.recordLists.push({
        id,
        userId: user.id,
        title,
        description: clean(data.description),
        listStyle: RECORD_STYLES.some((style) => style.id === data.listStyle) ? data.listStyle : "plain",
        icon: clean(data.icon),
        position: nextPosition(user.recordLists),
        archived: false,
        createdAt: now(),
        updatedAt: now()
      });
      user.preferences.activeRecordListId = id;
    });
    return id;
  }

  updateRecordList(id, changes) {
    this.repository.transact((user) => {
      const list = belongsTo(user, id, "recordLists");
      if ("title" in changes) list.title = clean(changes.title, "Untitled");
      if ("description" in changes) list.description = clean(changes.description);
      if ("icon" in changes) list.icon = clean(changes.icon);
      if ("listStyle" in changes && RECORD_STYLES.some((style) => style.id === changes.listStyle)) {
        list.listStyle = changes.listStyle;
      }
      if ("archived" in changes) list.archived = Boolean(changes.archived);
      list.updatedAt = now();
    });
  }

  duplicateRecordList(id) {
    let newId;
    this.repository.transact((user) => {
      const source = belongsTo(user, id, "recordLists");
      newId = this.repository.createId("record-list");
      user.recordLists.push({
        ...source,
        id: newId,
        title: `${source.title} copy`,
        position: nextPosition(user.recordLists),
        archived: false,
        createdAt: now(),
        updatedAt: now()
      });
      sortByPosition(user.recordItems.filter((item) => item.recordListId === id)).forEach((item) => {
        user.recordItems.push({
          ...item,
          id: this.repository.createId("record-item"),
          recordListId: newId,
          position: nextPosition(user.recordItems, (candidate) => candidate.recordListId === newId),
          createdAt: now(),
          updatedAt: now()
        });
      });
      user.preferences.activeRecordListId = newId;
    });
    return newId;
  }

  deleteRecordList(id) {
    this.repository.transact((user) => {
      belongsTo(user, id, "recordLists");
      const itemIds = new Set(user.recordItems.filter((item) => item.recordListId === id).map((item) => item.id));
      removeWhere(user.recordLists, (list) => list.id === id);
      removeWhere(user.recordItems, (item) => item.recordListId === id);
      removeWhere(user.syncRelationships, (relationship) =>
        (relationship.sourceType === "RECORD_LIST" && relationship.sourceId === id) ||
        (relationship.sourceType === "RECORD_ITEM" && itemIds.has(relationship.sourceId))
      );
      user.preferences.activeRecordListId = user.recordLists.find((list) => !list.archived)?.id ?? null;
    });
  }

  moveRecordList(id, direction) {
    this.repository.transact((user) => moveInCollection(user.recordLists, id, direction));
  }

  createRecordItem(recordListId, data = {}, { skipSync = false } = {}) {
    const content = clean(data.content);
    if (!content) throw new Error("Enter an item name.");
    let id;
    this.repository.transact((user) => {
      belongsTo(user, recordListId, "recordLists");
      id = this.repository.createId("record-item");
      const item = {
        id,
        userId: user.id,
        recordListId,
        content,
        notes: clean(data.notes),
        completed: Boolean(data.completed),
        position: nextPosition(user.recordItems, (candidate) => candidate.recordListId === recordListId),
        date: dateOrNull(data.date),
        reminderAt: clean(data.reminderAt) || null,
        createdAt: now(),
        updatedAt: now()
      };
      user.recordItems.push(item);
      if (!skipSync) this.syncRecordItemToDestination(user, item);
    });
    return id;
  }

  syncRecordItemToDestination(user, item) {
    const connection = listConnection(user, item.recordListId);
    if (!connection) return;
    const createdAt = now();
    let destinationItemId;

    if (connection.destinationType === "GROCERY_HAVE" || connection.destinationType === "GROCERY_WANT") {
      destinationItemId = this.repository.createId("grocery");
      user.groceryItems.push({
        id: destinationItemId,
        userId: user.id,
        name: item.content,
        groceryStatus: connection.destinationType === "GROCERY_HAVE" ? "HAVE" : "WANT",
        quantity: null,
        unit: "",
        category: "",
        notes: item.notes,
        position: nextPosition(user.groceryItems, (candidate) =>
          candidate.groceryStatus === (connection.destinationType === "GROCERY_HAVE" ? "HAVE" : "WANT")
        ),
        createdAt,
        updatedAt: createdAt
      });
    } else if (connection.destinationType === "INVENTORY_CONTAINER") {
      const container = belongsTo(user, connection.destinationId, "inventoryContainers");
      destinationItemId = this.repository.createId("inventory-item");
      user.inventoryItems.push({
        id: destinationItemId,
        userId: user.id,
        sectionId: container.sectionId,
        containerId: container.id,
        name: item.content,
        quantity: 1,
        unit: "",
        category: "",
        condition: "Good",
        purchaseDate: null,
        expirationDate: null,
        replacementDate: null,
        estimatedValue: null,
        lowStockThreshold: null,
        notes: item.notes,
        imageUrl: "",
        position: nextPosition(user.inventoryItems, (candidate) => candidate.containerId === container.id),
        createdAt,
        updatedAt: createdAt
      });
    }

    if (destinationItemId) {
      user.syncRelationships.push({
        id: this.repository.createId("sync"),
        userId: user.id,
        sourceType: "RECORD_ITEM",
        sourceId: item.id,
        destinationType: connection.destinationType === "INVENTORY_CONTAINER" ? "INVENTORY_ITEM" : "GROCERY_ITEM",
        destinationId: destinationItemId,
        syncMode: "TWO_WAY",
        createdAt,
        updatedAt: createdAt
      });
    }
  }

  updateRecordItem(id, changes) {
    this.repository.transact((user) => {
      const item = belongsTo(user, id, "recordItems");
      if ("content" in changes) {
        const content = clean(changes.content);
        if (!content) throw new Error("Enter an item name.");
        item.content = content;
      }
      if ("notes" in changes) item.notes = clean(changes.notes);
      if ("completed" in changes) item.completed = Boolean(changes.completed);
      if ("date" in changes) item.date = dateOrNull(changes.date);
      if ("reminderAt" in changes) item.reminderAt = clean(changes.reminderAt) || null;
      item.updatedAt = now();

      itemLinks(user, id).forEach((relationship) => {
        if (relationship.destinationType === "GROCERY_ITEM") {
          const destination = user.groceryItems.find((candidate) => candidate.id === relationship.destinationId);
          if (destination) {
            destination.name = item.content;
            destination.notes = item.notes;
            destination.updatedAt = now();
          }
        }
        if (relationship.destinationType === "INVENTORY_ITEM") {
          const destination = user.inventoryItems.find((candidate) => candidate.id === relationship.destinationId);
          if (destination) {
            destination.name = item.content;
            destination.notes = item.notes;
            destination.updatedAt = now();
          }
        }
      });
    });
  }

  duplicateRecordItem(id) {
    const user = this.snapshot();
    const item = belongsTo(user, id, "recordItems");
    return this.createRecordItem(item.recordListId, { ...item, content: `${item.content} copy` });
  }

  transferRecordItem(id, targetListId, mode = "move") {
    const snapshot = this.snapshot();
    const item = belongsTo(snapshot, id, "recordItems");
    const newId = this.createRecordItem(targetListId, item);
    if (mode === "move") this.deleteRecordItem(id, "everywhere");
    return newId;
  }

  moveRecordItem(id, direction) {
    this.repository.transact((user) => {
      const item = belongsTo(user, id, "recordItems");
      moveInCollection(user.recordItems, id, direction, (candidate) => candidate.recordListId === item.recordListId);
    });
  }

  deleteRecordItem(id, scope = "everywhere") {
    this.repository.transact((user) => {
      belongsTo(user, id, "recordItems");
      const links = itemLinks(user, id);
      if (scope === "everywhere") {
        links.forEach((relationship) => {
          if (relationship.destinationType === "GROCERY_ITEM") {
            removeWhere(user.groceryItems, (item) => item.id === relationship.destinationId);
          }
          if (relationship.destinationType === "INVENTORY_ITEM") {
            removeWhere(user.inventoryItems, (item) => item.id === relationship.destinationId);
          }
        });
      }
      removeWhere(user.recordItems, (item) => item.id === id);
      removeWhere(user.syncRelationships, (relationship) =>
        relationship.sourceType === "RECORD_ITEM" && relationship.sourceId === id
      );
    });
  }

  createGroceryItem(data = {}, { skipSync = false } = {}) {
    const name = clean(data.name);
    if (!name) throw new Error("Enter a food name.");
    const groceryStatus = data.groceryStatus === "HAVE" ? "HAVE" : "WANT";
    let id;
    this.repository.transact((user) => {
      id = this.repository.createId("grocery");
      const item = {
        id,
        userId: user.id,
        name,
        groceryStatus,
        quantity: numberOrNull(data.quantity),
        unit: clean(data.unit),
        category: clean(data.category),
        notes: clean(data.notes),
        position: nextPosition(user.groceryItems, (candidate) => candidate.groceryStatus === groceryStatus),
        createdAt: now(),
        updatedAt: now()
      };
      user.groceryItems.push(item);
      if (!skipSync) this.syncDestinationItemToRecords(user, item, groceryStatus === "HAVE" ? "GROCERY_HAVE" : "GROCERY_WANT");
    });
    return id;
  }

  syncDestinationItemToRecords(user, destinationItem, destinationType) {
    const destinationId = destinationType === "INVENTORY_CONTAINER"
      ? destinationItem.containerId
      : destinationType;
    user.syncRelationships
      .filter((relationship) =>
        relationship.sourceType === "RECORD_LIST" &&
        destinationMatches(relationship, destinationType, destinationId)
      )
      .forEach((connection) => {
        const recordItemId = this.repository.createId("record-item");
        user.recordItems.push({
          id: recordItemId,
          userId: user.id,
          recordListId: connection.sourceId,
          content: destinationItem.name,
          notes: destinationItem.notes || "",
          completed: false,
          position: nextPosition(user.recordItems, (candidate) => candidate.recordListId === connection.sourceId),
          date: null,
          reminderAt: null,
          createdAt: now(),
          updatedAt: now()
        });
        user.syncRelationships.push({
          id: this.repository.createId("sync"),
          userId: user.id,
          sourceType: "RECORD_ITEM",
          sourceId: recordItemId,
          destinationType: destinationType.startsWith("GROCERY") ? "GROCERY_ITEM" : "INVENTORY_ITEM",
          destinationId: destinationItem.id,
          syncMode: "TWO_WAY",
          createdAt: now(),
          updatedAt: now()
        });
      });
  }

  updateGroceryItem(id, changes) {
    this.repository.transact((user) => {
      const item = belongsTo(user, id, "groceryItems");
      if ("name" in changes) {
        const name = clean(changes.name);
        if (!name) throw new Error("Enter a food name.");
        item.name = name;
      }
      if ("quantity" in changes) item.quantity = numberOrNull(changes.quantity);
      if ("unit" in changes) item.unit = clean(changes.unit);
      if ("category" in changes) item.category = clean(changes.category);
      if ("notes" in changes) item.notes = clean(changes.notes);
      if ("groceryStatus" in changes) item.groceryStatus = changes.groceryStatus === "HAVE" ? "HAVE" : "WANT";
      item.updatedAt = now();

      user.syncRelationships
        .filter((relationship) => relationship.destinationType === "GROCERY_ITEM" && relationship.destinationId === id)
        .forEach((relationship) => {
          const recordItem = user.recordItems.find((candidate) => candidate.id === relationship.sourceId);
          if (recordItem) {
            recordItem.content = item.name;
            recordItem.notes = item.notes;
            recordItem.updatedAt = now();
          }
        });
    });
  }

  moveGroceryItem(id, status) {
    this.updateGroceryItem(id, { groceryStatus: status });
  }

  duplicateGroceryItem(id) {
    const item = belongsTo(this.snapshot(), id, "groceryItems");
    return this.createGroceryItem({ ...item, name: `${item.name} copy` });
  }

  moveGroceryItemPosition(id, direction) {
    this.repository.transact((user) => {
      const item = belongsTo(user, id, "groceryItems");
      moveInCollection(user.groceryItems, id, direction, (candidate) => candidate.groceryStatus === item.groceryStatus);
    });
  }

  deleteGroceryItem(id, scope = "everywhere") {
    this.repository.transact((user) => {
      belongsTo(user, id, "groceryItems");
      const links = user.syncRelationships.filter((relationship) =>
        relationship.destinationType === "GROCERY_ITEM" && relationship.destinationId === id
      );
      if (scope === "everywhere") {
        const recordIds = new Set(links.map((link) => link.sourceId));
        removeWhere(user.recordItems, (item) => recordIds.has(item.id));
      }
      removeWhere(user.groceryItems, (item) => item.id === id);
      removeWhere(user.syncRelationships, (relationship) =>
        relationship.destinationType === "GROCERY_ITEM" && relationship.destinationId === id
      );
    });
  }

  createInventorySection(title) {
    const cleanTitle = clean(title, "Untitled");
    let id;
    this.repository.transact((user) => {
      id = this.repository.createId("inventory-section");
      user.inventorySections.push({
        id,
        userId: user.id,
        title: cleanTitle,
        position: nextPosition(user.inventorySections),
        createdAt: now(),
        updatedAt: now()
      });
      user.preferences.activeInventorySectionId = id;
      user.preferences.activeInventoryContainerId = null;
    });
    return id;
  }

  updateInventorySection(id, title) {
    this.repository.transact((user) => {
      const section = belongsTo(user, id, "inventorySections");
      section.title = clean(title, "Untitled");
      section.updatedAt = now();
    });
  }

  deleteInventorySection(id) {
    this.repository.transact((user) => {
      belongsTo(user, id, "inventorySections");
      const containerIds = new Set(user.inventoryContainers.filter((container) => container.sectionId === id).map((container) => container.id));
      const itemIds = new Set(user.inventoryItems.filter((item) => item.sectionId === id).map((item) => item.id));
      removeWhere(user.inventorySections, (section) => section.id === id);
      removeWhere(user.inventoryContainers, (container) => container.sectionId === id);
      removeWhere(user.inventoryItems, (item) => item.sectionId === id);
      removeWhere(user.syncRelationships, (relationship) =>
        (relationship.destinationType === "INVENTORY_CONTAINER" && containerIds.has(relationship.destinationId)) ||
        (relationship.destinationType === "INVENTORY_ITEM" && itemIds.has(relationship.destinationId))
      );
      user.preferences.activeInventorySectionId = user.inventorySections[0]?.id ?? null;
      user.preferences.activeInventoryContainerId = null;
    });
  }

  moveInventorySection(id, direction) {
    this.repository.transact((user) => moveInCollection(user.inventorySections, id, direction));
  }

  createInventoryContainer(sectionId, title) {
    const cleanTitle = clean(title, "Untitled");
    let id;
    this.repository.transact((user) => {
      belongsTo(user, sectionId, "inventorySections");
      id = this.repository.createId("inventory-container");
      user.inventoryContainers.push({
        id,
        userId: user.id,
        sectionId,
        title: cleanTitle,
        position: nextPosition(user.inventoryContainers, (container) => container.sectionId === sectionId),
        createdAt: now(),
        updatedAt: now()
      });
      user.preferences.activeInventorySectionId = sectionId;
      user.preferences.activeInventoryContainerId = id;
    });
    return id;
  }

  updateInventoryContainer(id, title) {
    this.repository.transact((user) => {
      const container = belongsTo(user, id, "inventoryContainers");
      container.title = clean(title, "Untitled");
      container.updatedAt = now();
    });
  }

  deleteInventoryContainer(id) {
    this.repository.transact((user) => {
      belongsTo(user, id, "inventoryContainers");
      const itemIds = new Set(user.inventoryItems.filter((item) => item.containerId === id).map((item) => item.id));
      removeWhere(user.inventoryContainers, (container) => container.id === id);
      removeWhere(user.inventoryItems, (item) => item.containerId === id);
      removeWhere(user.syncRelationships, (relationship) =>
        (relationship.destinationType === "INVENTORY_CONTAINER" && relationship.destinationId === id) ||
        (relationship.destinationType === "INVENTORY_ITEM" && itemIds.has(relationship.destinationId))
      );
      if (user.preferences.activeInventoryContainerId === id) user.preferences.activeInventoryContainerId = null;
    });
  }

  moveInventoryContainer(id, direction) {
    this.repository.transact((user) => {
      const container = belongsTo(user, id, "inventoryContainers");
      moveInCollection(user.inventoryContainers, id, direction, (candidate) => candidate.sectionId === container.sectionId);
    });
  }

  createInventoryItem(data = {}, { skipSync = false } = {}) {
    const name = clean(data.name);
    if (!name) throw new Error("Enter an inventory item name.");
    let id;
    this.repository.transact((user) => {
      const section = belongsTo(user, data.sectionId, "inventorySections");
      const container = belongsTo(user, data.containerId, "inventoryContainers");
      if (container.sectionId !== section.id) throw new Error("That container is not in the selected section.");
      id = this.repository.createId("inventory-item");
      const item = {
        id,
        userId: user.id,
        sectionId: section.id,
        containerId: container.id,
        name,
        quantity: Math.max(0, numberOrNull(data.quantity) ?? 1),
        unit: clean(data.unit),
        category: clean(data.category),
        condition: INVENTORY_CONDITIONS.includes(data.condition) ? data.condition : "Good",
        purchaseDate: dateOrNull(data.purchaseDate),
        expirationDate: dateOrNull(data.expirationDate),
        replacementDate: dateOrNull(data.replacementDate),
        estimatedValue: numberOrNull(data.estimatedValue),
        lowStockThreshold: numberOrNull(data.lowStockThreshold),
        notes: clean(data.notes),
        imageUrl: clean(data.imageUrl),
        position: nextPosition(user.inventoryItems, (candidate) => candidate.containerId === container.id),
        createdAt: now(),
        updatedAt: now()
      };
      user.inventoryItems.push(item);
      if (!skipSync) this.syncDestinationItemToRecords(user, item, "INVENTORY_CONTAINER");
    });
    return id;
  }

  updateInventoryItem(id, changes) {
    this.repository.transact((user) => {
      const item = belongsTo(user, id, "inventoryItems");
      if ("name" in changes) {
        const name = clean(changes.name);
        if (!name) throw new Error("Enter an inventory item name.");
        item.name = name;
      }
      if ("sectionId" in changes || "containerId" in changes) {
        const sectionId = changes.sectionId || item.sectionId;
        const containerId = changes.containerId || item.containerId;
        const section = belongsTo(user, sectionId, "inventorySections");
        const container = belongsTo(user, containerId, "inventoryContainers");
        if (container.sectionId !== section.id) throw new Error("That container is not in the selected section.");
        item.sectionId = section.id;
        item.containerId = container.id;
      }
      if ("quantity" in changes) item.quantity = Math.max(0, numberOrNull(changes.quantity) ?? 0);
      if ("unit" in changes) item.unit = clean(changes.unit);
      if ("category" in changes) item.category = clean(changes.category);
      if ("condition" in changes && INVENTORY_CONDITIONS.includes(changes.condition)) item.condition = changes.condition;
      if ("purchaseDate" in changes) item.purchaseDate = dateOrNull(changes.purchaseDate);
      if ("expirationDate" in changes) item.expirationDate = dateOrNull(changes.expirationDate);
      if ("replacementDate" in changes) item.replacementDate = dateOrNull(changes.replacementDate);
      if ("estimatedValue" in changes) item.estimatedValue = numberOrNull(changes.estimatedValue);
      if ("lowStockThreshold" in changes) item.lowStockThreshold = numberOrNull(changes.lowStockThreshold);
      if ("notes" in changes) item.notes = clean(changes.notes);
      if ("imageUrl" in changes) item.imageUrl = clean(changes.imageUrl);
      item.updatedAt = now();

      user.syncRelationships
        .filter((relationship) => relationship.destinationType === "INVENTORY_ITEM" && relationship.destinationId === id)
        .forEach((relationship) => {
          const recordItem = user.recordItems.find((candidate) => candidate.id === relationship.sourceId);
          if (recordItem) {
            recordItem.content = item.name;
            recordItem.notes = item.notes;
            recordItem.updatedAt = now();
          }
        });
    });
  }

  adjustInventoryQuantity(id, amount) {
    const item = belongsTo(this.snapshot(), id, "inventoryItems");
    this.updateInventoryItem(id, { quantity: Math.max(0, (item.quantity || 0) + amount) });
  }

  duplicateInventoryItem(id) {
    const item = belongsTo(this.snapshot(), id, "inventoryItems");
    return this.createInventoryItem({ ...item, name: `${item.name} copy` });
  }

  moveInventoryItemPosition(id, direction) {
    this.repository.transact((user) => {
      const item = belongsTo(user, id, "inventoryItems");
      moveInCollection(user.inventoryItems, id, direction, (candidate) => candidate.containerId === item.containerId);
    });
  }

  deleteInventoryItem(id, scope = "everywhere") {
    this.repository.transact((user) => {
      belongsTo(user, id, "inventoryItems");
      const links = user.syncRelationships.filter((relationship) =>
        relationship.destinationType === "INVENTORY_ITEM" && relationship.destinationId === id
      );
      if (scope === "everywhere") {
        const recordIds = new Set(links.map((link) => link.sourceId));
        removeWhere(user.recordItems, (item) => recordIds.has(item.id));
      }
      removeWhere(user.inventoryItems, (item) => item.id === id);
      removeWhere(user.syncRelationships, (relationship) =>
        relationship.destinationType === "INVENTORY_ITEM" && relationship.destinationId === id
      );
    });
  }

  createTask(data = {}) {
    const title = clean(data.title);
    if (!title) throw new Error("Enter a task title.");
    let id;
    this.repository.transact((user) => {
      id = this.repository.createId("task");
      const date = dateOrNull(data.date) || new Date().toISOString().slice(0, 10);
      user.tasks.push({
        id,
        userId: user.id,
        title,
        description: clean(data.description),
        date,
        time: clean(data.time) || null,
        dueAt: clean(data.dueAt) || null,
        allDay: Boolean(data.allDay),
        completed: Boolean(data.completed),
        completedAt: data.completed ? now() : null,
        priority: TASK_PRIORITIES.includes(data.priority) ? data.priority : "Medium",
        category: TASK_CATEGORIES.includes(data.category) ? data.category : "Personal",
        recurrenceRule: ["none", "daily", "weekly", "monthly"].includes(data.recurrenceRule) ? data.recurrenceRule : "none",
        reminderAt: clean(data.reminderAt) || null,
        relatedEntityType: clean(data.relatedEntityType) || null,
        relatedEntityId: clean(data.relatedEntityId) || null,
        createdAt: now(),
        updatedAt: now()
      });
    });
    return id;
  }

  updateTask(id, changes) {
    this.repository.transact((user) => {
      const task = belongsTo(user, id, "tasks");
      if ("title" in changes) {
        const title = clean(changes.title);
        if (!title) throw new Error("Enter a task title.");
        task.title = title;
      }
      ["description", "time", "dueAt", "reminderAt", "relatedEntityType", "relatedEntityId"].forEach((key) => {
        if (key in changes) task[key] = clean(changes[key]) || null;
      });
      if ("date" in changes) task.date = dateOrNull(changes.date) || task.date;
      if ("allDay" in changes) task.allDay = Boolean(changes.allDay);
      if ("priority" in changes && TASK_PRIORITIES.includes(changes.priority)) task.priority = changes.priority;
      if ("category" in changes && TASK_CATEGORIES.includes(changes.category)) task.category = changes.category;
      if ("recurrenceRule" in changes && ["none", "daily", "weekly", "monthly"].includes(changes.recurrenceRule)) {
        task.recurrenceRule = changes.recurrenceRule;
      }
      task.updatedAt = now();
    });
  }

  completeTask(id, completed = true) {
    this.repository.transact((user) => {
      const task = belongsTo(user, id, "tasks");
      task.completed = completed;
      task.completedAt = completed ? now() : null;
      task.updatedAt = now();
      if (completed && task.recurrenceRule !== "none" && !task.nextOccurrenceCreated) {
        user.tasks.push({
          ...task,
          id: this.repository.createId("task"),
          date: futureDate(task.date, task.recurrenceRule),
          completed: false,
          completedAt: null,
          nextOccurrenceCreated: false,
          createdAt: now(),
          updatedAt: now()
        });
        task.nextOccurrenceCreated = true;
      }
    });
  }

  deleteTask(id) {
    this.repository.transact((user) => removeWhere(user.tasks, (task) => task.id === id && task.userId === user.id));
  }

  connectRecordList(recordListId, destinationType, destinationId = destinationType) {
    this.repository.transact((user) => {
      belongsTo(user, recordListId, "recordLists");
      if (!["GROCERY_HAVE", "GROCERY_WANT", "INVENTORY_CONTAINER"].includes(destinationType)) {
        throw new Error("Choose a valid synchronization destination.");
      }
      if (destinationType === "INVENTORY_CONTAINER") belongsTo(user, destinationId, "inventoryContainers");
      removeWhere(user.syncRelationships, (relationship) =>
        relationship.sourceType === "RECORD_LIST" && relationship.sourceId === recordListId
      );
      user.syncRelationships.push({
        id: this.repository.createId("sync"),
        userId: user.id,
        sourceType: "RECORD_LIST",
        sourceId: recordListId,
        destinationType,
        destinationId,
        syncMode: "TWO_WAY",
        createdAt: now(),
        updatedAt: now()
      });
      user.recordItems
        .filter((item) => item.recordListId === recordListId && !itemLinks(user, item.id).length)
        .forEach((item) => this.syncRecordItemToDestination(user, item));
    });
  }

  disconnectRecordList(recordListId, mode = "keep-both") {
    this.repository.transact((user) => {
      const connection = listConnection(user, recordListId);
      if (!connection) return;
      const recordItemIds = new Set(user.recordItems.filter((item) => item.recordListId === recordListId).map((item) => item.id));
      const links = user.syncRelationships.filter((relationship) =>
        relationship.sourceType === "RECORD_ITEM" && recordItemIds.has(relationship.sourceId)
      );

      if (mode === "records-only") {
        const destinationIds = new Set(links.map((link) => link.destinationId));
        removeWhere(user.groceryItems, (item) => destinationIds.has(item.id));
        removeWhere(user.inventoryItems, (item) => destinationIds.has(item.id));
      }
      if (mode === "destination-only") {
        removeWhere(user.recordItems, (item) => recordItemIds.has(item.id));
      }

      removeWhere(user.syncRelationships, (relationship) =>
        (relationship.sourceType === "RECORD_LIST" && relationship.sourceId === recordListId) ||
        (relationship.sourceType === "RECORD_ITEM" && recordItemIds.has(relationship.sourceId))
      );
    });
  }

  createTaskFromEntity(title, category, relatedEntityType, relatedEntityId, date = new Date().toISOString().slice(0, 10)) {
    return this.createTask({ title, category, relatedEntityType, relatedEntityId, date, priority: "Medium" });
  }

  addGroceryToRecord(groceryItemId, recordListId) {
    const item = belongsTo(this.snapshot(), groceryItemId, "groceryItems");
    return this.createRecordItem(recordListId, { content: item.name, notes: item.notes });
  }
}

export function getInventoryFlags(item, referenceDate = new Date()) {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  const soon = new Date(today);
  soon.setDate(soon.getDate() + 14);
  const expiration = item.expirationDate ? new Date(`${item.expirationDate}T00:00:00`) : null;
  const replacement = item.replacementDate ? new Date(`${item.replacementDate}T00:00:00`) : null;
  return {
    low: item.lowStockThreshold !== null && item.lowStockThreshold !== undefined && Number(item.quantity) <= Number(item.lowStockThreshold),
    expired: Boolean(expiration && expiration < today),
    expiring: Boolean(expiration && expiration >= today && expiration <= soon),
    replacement: Boolean(replacement && replacement <= soon),
    missing: item.condition === "Missing",
    repair: item.condition === "Needs repair"
  };
}

export function ordered(items) {
  return sortByPosition(items);
}
