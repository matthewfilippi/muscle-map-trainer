# Organizer Architecture

## Existing application

- **Framework:** Vanilla JavaScript modules built with Vite.
- **Routing:** Hash routes rendered by `src/main.js`.
- **Styling:** Plain CSS with shared design tokens in `src/styles.css`.
- **State management:** Module-level page state and browser `localStorage`.
- **Database/backend:** None. The deployed worker serves static assets and the single-page shell.
- **Authentication/user model:** No sign-in system exists. Existing nutrition data is local to the browser.

The organizer expansion preserves those choices. It does not introduce a second framework or replace existing wellness features.

## Organizer modules

- `src/organizerStore.js` owns schema versioning, the local user partition, persistence, subscriptions, and transactions.
- `src/organizerModel.js` owns domain validation and mutations for Records, Grocery, Inventory, Tasks, recurrence, and synchronization.
- `src/organizerUi.js` contains shared dialogs, forms, empty states, reordering controls, sync indicators, and safe HTML output.
- `src/organizer/recordsPage.js` renders Records navigation, list styles, item actions, templates, and connection controls.
- `src/organizer/groceryPage.js` renders Foods I Have and Foods I Want.
- `src/organizer/inventoryPage.js` renders the section, container, and item hierarchy.
- `src/organizer/tasksPage.js` renders month, week, day, and list calendar views.
- `src/organizer.css` provides mobile-first responsive layout and accessible interaction states.

## Data ownership and persistence

Every organizer entity contains a `userId`. The repository stores each user's arrays in a separate partition and model operations verify ownership before mutation. In the current static app, the active user is a stable, randomly generated local profile ID.

Organizer state uses the `wellness-map-organizer-v1` local-storage key. Transactions clone the active user state, apply one domain operation, and persist the completed state once. This keeps synchronized mutations atomic within the browser.

## Synchronization

Synchronization is always user initiated. A Records list may connect to:

- Grocery: Foods I Have
- Grocery: Foods I Want
- One Inventory container

List and item relationships use unique IDs in `syncRelationships`. Names are never used as identifiers. Item edits propagate through explicit mappings, and creation uses a `skipSync` boundary so it cannot loop back and duplicate itself. Reordering remains view-specific.

Disconnecting removes relationship records and can keep both copies, keep only Records, or keep only the destination. Deleting a synchronized item can remove it everywhere or only from the current view.

## Backend migration

`createOrganizerRepository()` is the persistence boundary. A future authenticated backend can replace it with a repository that:

1. Resolves `userId` from the server session.
2. Sends transactions to server routes.
3. Validates ownership from the session rather than request data.
4. Stores the existing entity shapes in indexed database tables.
5. Uses database transactions for synchronized writes.
6. Stores inventory images in object storage and saves only the resulting URL.

The page controllers and `OrganizerService` can remain unchanged if the replacement repository preserves `getUser()` and `transact()` semantics, or they can move to asynchronous equivalents with a narrow controller update.
