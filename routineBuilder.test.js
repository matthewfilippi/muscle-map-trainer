import assert from "node:assert/strict";
import test from "node:test";
import { OrganizerService, ordered } from "../src/organizerModel.js";
import {
  ORGANIZER_STORAGE_KEY,
  createMemoryStorage,
  createOrganizerRepository
} from "../src/organizerStore.js";

function setup(userId = "test-user", storage = createMemoryStorage()) {
  const repository = createOrganizerRepository({ storage, userId });
  return { service: new OrganizerService(repository), repository, storage };
}

test("Records lists support templates, editing, deletion, and practical unlimited creation", () => {
  const { service } = setup();
  const ideasId = service.createRecordList({ title: "Ideas", listStyle: "cards" });
  service.updateRecordList(ideasId, { title: "Product Ideas", description: "Things to build" });
  for (let index = 0; index < 150; index += 1) {
    service.createRecordList({ title: `List ${index + 1}` });
  }
  let user = service.snapshot();
  assert.equal(user.recordLists.length, 151);
  assert.equal(user.recordLists.find((list) => list.id === ideasId).title, "Product Ideas");
  assert.equal(user.recordLists.find((list) => list.id === ideasId).listStyle, "cards");
  service.deleteRecordList(ideasId);
  user = service.snapshot();
  assert.equal(user.recordLists.some((list) => list.id === ideasId), false);
});

test("Records lists and items reorder without using titles as identifiers", () => {
  const { service } = setup();
  const first = service.createRecordList({ title: "Same title" });
  const second = service.createRecordList({ title: "Same title" });
  const third = service.createRecordList({ title: "Third" });
  service.moveRecordList(third, -1);
  assert.deepEqual(ordered(service.snapshot().recordLists).map((list) => list.id), [first, third, second]);

  const one = service.createRecordItem(first, { content: "One" });
  const two = service.createRecordItem(first, { content: "Two" });
  service.moveRecordItem(two, -1);
  assert.deepEqual(
    ordered(service.snapshot().recordItems.filter((item) => item.recordListId === first)).map((item) => item.id),
    [two, one]
  );
});

test("Grocery items create, edit, move between Have and Want, copy, and delete", () => {
  const { service } = setup();
  const id = service.createGroceryItem({
    name: "Bananas",
    groceryStatus: "WANT",
    quantity: 4,
    unit: "pieces",
    category: "Produce"
  });
  service.updateGroceryItem(id, { notes: "Choose ripe fruit" });
  service.moveGroceryItem(id, "HAVE");
  const copyId = service.duplicateGroceryItem(id);
  let user = service.snapshot();
  assert.equal(user.groceryItems.find((item) => item.id === id).groceryStatus, "HAVE");
  assert.equal(user.groceryItems.find((item) => item.id === id).notes, "Choose ripe fruit");
  assert.ok(user.groceryItems.find((item) => item.id === copyId));
  service.deleteGroceryItem(copyId);
  user = service.snapshot();
  assert.equal(user.groceryItems.some((item) => item.id === copyId), false);
});

test("Inventory sections, containers, moves, quantities, and status fields persist", () => {
  const { service } = setup();
  const pantry = service.createInventorySection("Pantry");
  const cabinet = service.createInventoryContainer(pantry, "Cabinet");
  const garage = service.createInventorySection("Garage");
  const shelf = service.createInventoryContainer(garage, "Shelf");
  const itemId = service.createInventoryItem({
    name: "Air filter",
    sectionId: garage,
    containerId: shelf,
    quantity: 2,
    condition: "Good",
    lowStockThreshold: 1
  });
  service.updateInventoryItem(itemId, { sectionId: pantry, containerId: cabinet, condition: "Needs repair" });
  service.adjustInventoryQuantity(itemId, -1);
  const item = service.snapshot().inventoryItems.find((candidate) => candidate.id === itemId);
  assert.equal(item.sectionId, pantry);
  assert.equal(item.containerId, cabinet);
  assert.equal(item.quantity, 1);
  assert.equal(item.condition, "Needs repair");
});

test("Tasks create, edit, move, and complete without recurrence", () => {
  const { service } = setup();
  const id = service.createTask({
    title: "Plan workout",
    date: "2026-07-20",
    category: "Exercise",
    priority: "High"
  });
  service.updateTask(id, { date: "2026-07-21", description: "Choose lower body movements" });
  service.completeTask(id);
  const task = service.snapshot().tasks.find((candidate) => candidate.id === id);
  assert.equal(task.date, "2026-07-21");
  assert.equal(task.completed, true);
  assert.equal(service.snapshot().tasks.length, 1);
});

test("Completing a recurring task creates exactly one next occurrence", () => {
  const { service } = setup();
  const id = service.createTask({
    title: "Weekly meal plan",
    date: "2026-07-20",
    recurrenceRule: "weekly"
  });
  service.completeTask(id);
  service.completeTask(id);
  const tasks = service.snapshot().tasks;
  assert.equal(tasks.length, 2);
  assert.equal(tasks.find((task) => task.id !== id).date, "2026-07-27");
  assert.equal(tasks.find((task) => task.id !== id).completed, false);
});

test("Records connection to Grocery synchronizes existing and newly added items", () => {
  const { service } = setup();
  const listId = service.createRecordList({ title: "Shopping" });
  const existingId = service.createRecordItem(listId, { content: "Apples", notes: "Six" });
  service.connectRecordList(listId, "GROCERY_WANT", "GROCERY_WANT");
  let user = service.snapshot();
  assert.equal(user.groceryItems.length, 1);
  assert.equal(user.groceryItems[0].name, "Apples");
  assert.equal(user.syncRelationships.some((link) => link.sourceId === existingId && link.destinationType === "GROCERY_ITEM"), true);

  service.createRecordItem(listId, { content: "Milk" });
  user = service.snapshot();
  assert.deepEqual(user.groceryItems.map((item) => item.name).sort(), ["Apples", "Milk"]);
});

test("Adding and editing a synchronized Grocery item updates Records without loops", () => {
  const { service } = setup();
  const listId = service.createRecordList({ title: "Shopping" });
  service.connectRecordList(listId, "GROCERY_WANT", "GROCERY_WANT");
  const groceryId = service.createGroceryItem({ name: "Tuna", groceryStatus: "WANT" });
  let user = service.snapshot();
  assert.equal(user.recordItems.length, 1);
  assert.equal(user.groceryItems.length, 1);
  service.updateGroceryItem(groceryId, { name: "Canned tuna", notes: "In water" });
  user = service.snapshot();
  assert.equal(user.recordItems[0].content, "Canned tuna");
  assert.equal(user.recordItems[0].notes, "In water");
  assert.equal(user.recordItems.length, 1);
});

test("Records connection to Inventory synchronizes from both sides", () => {
  const { service } = setup();
  const pantry = service.createInventorySection("Pantry");
  const cabinet = service.createInventoryContainer(pantry, "Cabinet");
  const listId = service.createRecordList({ title: "Pantry inventory" });
  service.connectRecordList(listId, "INVENTORY_CONTAINER", cabinet);
  const recordId = service.createRecordItem(listId, { content: "Rice" });
  let user = service.snapshot();
  assert.equal(user.inventoryItems.find((item) => item.name === "Rice").containerId, cabinet);

  const inventoryId = service.createInventoryItem({
    name: "Lentils",
    sectionId: pantry,
    containerId: cabinet
  });
  user = service.snapshot();
  assert.equal(user.recordItems.some((item) => item.content === "Lentils"), true);
  assert.equal(user.syncRelationships.some((link) => link.sourceId === recordId), true);
  service.updateInventoryItem(inventoryId, { name: "Red lentils" });
  assert.equal(service.snapshot().recordItems.some((item) => item.content === "Red lentils"), true);
});

test("Removing a synchronized item from only one view keeps the other copy", () => {
  const { service } = setup();
  const listId = service.createRecordList({ title: "Shopping" });
  service.connectRecordList(listId, "GROCERY_WANT", "GROCERY_WANT");
  const groceryId = service.createGroceryItem({ name: "Lemons", groceryStatus: "WANT" });
  const recordId = service.snapshot().recordItems[0].id;
  service.deleteGroceryItem(groceryId, "local");
  const user = service.snapshot();
  assert.equal(user.groceryItems.length, 0);
  assert.equal(user.recordItems.some((item) => item.id === recordId), true);
  assert.equal(user.syncRelationships.some((link) => link.destinationId === groceryId), false);
});

test("Deleting a synchronized item everywhere removes both copies", () => {
  const { service } = setup();
  const listId = service.createRecordList({ title: "Shopping" });
  service.connectRecordList(listId, "GROCERY_WANT", "GROCERY_WANT");
  const recordId = service.createRecordItem(listId, { content: "Limes" });
  assert.equal(service.snapshot().groceryItems.length, 1);
  service.deleteRecordItem(recordId, "everywhere");
  const user = service.snapshot();
  assert.equal(user.recordItems.length, 0);
  assert.equal(user.groceryItems.length, 0);
  assert.equal(user.syncRelationships.filter((link) => link.sourceType === "RECORD_ITEM").length, 0);
});

test("Disconnecting a synchronized list can preserve independent copies", () => {
  const { service } = setup();
  const listId = service.createRecordList({ title: "Shopping" });
  service.connectRecordList(listId, "GROCERY_WANT", "GROCERY_WANT");
  service.createRecordItem(listId, { content: "Raspberries" });
  service.disconnectRecordList(listId, "keep-both");
  const user = service.snapshot();
  assert.equal(user.recordItems.length, 1);
  assert.equal(user.groceryItems.length, 1);
  assert.equal(user.syncRelationships.length, 0);
  service.updateRecordItem(user.recordItems[0].id, { content: "Blueberries" });
  assert.equal(service.snapshot().groceryItems[0].name, "Raspberries");
});

test("Organizer data persists after the repository is recreated", () => {
  const storage = createMemoryStorage();
  const first = setup("persistent-user", storage);
  first.service.createRecordList({ title: "Memories" });
  first.service.createGroceryItem({ name: "Honey", groceryStatus: "HAVE" });
  const second = setup("persistent-user", storage);
  assert.equal(second.service.snapshot().recordLists[0].title, "Memories");
  assert.equal(second.service.snapshot().groceryItems[0].name, "Honey");
  assert.ok(storage.getItem(ORGANIZER_STORAGE_KEY));
});

test("User partitions prevent one local profile from changing another profile's data", () => {
  const storage = createMemoryStorage();
  const userA = setup("user-a", storage);
  const listId = userA.service.createRecordList({ title: "Private notes" });
  const userB = setup("user-b", storage);
  assert.equal(userB.service.snapshot().recordLists.length, 0);
  assert.throws(() => userB.service.updateRecordList(listId, { title: "Changed" }), /unavailable/);
  assert.equal(userA.service.snapshot().recordLists[0].title, "Private notes");
});
