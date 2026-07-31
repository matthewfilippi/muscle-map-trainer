export const ORGANIZER_STORAGE_KEY = "wellness-map-organizer-v1";
export const ORGANIZER_SCHEMA_VERSION = 1;
export const LOCAL_USER_KEY = "wellness-map-local-user";

function createId(prefix = "item") {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}_${globalThis.crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function createEmptyUser(userId) {
  return {
    id: userId,
    recordLists: [],
    recordItems: [],
    groceryItems: [],
    inventorySections: [],
    inventoryContainers: [],
    inventoryItems: [],
    tasks: [],
    syncRelationships: [],
    preferences: {
      groceryStatus: "WANT",
      activeRecordListId: null,
      activeInventorySectionId: null,
      activeInventoryContainerId: null,
      taskView: "month",
      taskDate: new Date().toISOString().slice(0, 10),
      showCompletedTasks: true
    }
  };
}

function createEmptyState() {
  return {
    schemaVersion: ORGANIZER_SCHEMA_VERSION,
    users: {}
  };
}

function ensureUserShape(candidate, userId) {
  const empty = createEmptyUser(userId);
  if (!candidate || candidate.id !== userId) return empty;

  return {
    ...empty,
    ...candidate,
    id: userId,
    recordLists: Array.isArray(candidate.recordLists) ? candidate.recordLists : [],
    recordItems: Array.isArray(candidate.recordItems) ? candidate.recordItems : [],
    groceryItems: Array.isArray(candidate.groceryItems) ? candidate.groceryItems : [],
    inventorySections: Array.isArray(candidate.inventorySections) ? candidate.inventorySections : [],
    inventoryContainers: Array.isArray(candidate.inventoryContainers) ? candidate.inventoryContainers : [],
    inventoryItems: Array.isArray(candidate.inventoryItems) ? candidate.inventoryItems : [],
    tasks: Array.isArray(candidate.tasks) ? candidate.tasks : [],
    syncRelationships: Array.isArray(candidate.syncRelationships) ? candidate.syncRelationships : [],
    preferences: { ...empty.preferences, ...(candidate.preferences || {}) }
  };
}

function parseState(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== ORGANIZER_SCHEMA_VERSION || typeof parsed.users !== "object") {
      return createEmptyState();
    }
    return parsed;
  } catch {
    return createEmptyState();
  }
}

function clone(value) {
  return globalThis.structuredClone
    ? globalThis.structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

export function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    }
  };
}

export function getOrCreateLocalUserId(storage = globalThis.localStorage) {
  try {
    const existing = storage.getItem(LOCAL_USER_KEY);
    if (existing) return existing;
    const userId = createId("user");
    storage.setItem(LOCAL_USER_KEY, userId);
    return userId;
  } catch {
    return "local-user";
  }
}

export function createOrganizerRepository({
  storage = globalThis.localStorage,
  userId = getOrCreateLocalUserId(storage)
} = {}) {
  let state = parseState(storage?.getItem?.(ORGANIZER_STORAGE_KEY));
  state.users[userId] = ensureUserShape(state.users[userId], userId);
  const listeners = new Set();

  function persist() {
    storage?.setItem?.(ORGANIZER_STORAGE_KEY, JSON.stringify(state));
  }

  function notify() {
    const snapshot = getUser();
    listeners.forEach((listener) => listener(snapshot));
  }

  function getUser() {
    return clone(ensureUserShape(state.users[userId], userId));
  }

  function transact(mutator) {
    const draft = getUser();
    const result = mutator(draft);
    draft.id = userId;
    state = {
      ...state,
      users: {
        ...state.users,
        [userId]: ensureUserShape(draft, userId)
      }
    };
    persist();
    notify();
    return result;
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function exportState() {
    return clone(state);
  }

  persist();

  return {
    userId,
    createId,
    getUser,
    transact,
    subscribe,
    exportState
  };
}
