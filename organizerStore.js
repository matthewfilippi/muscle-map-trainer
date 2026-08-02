.organizer-menu {
  width: 220px;
  grid-template-columns: 1fr;
}

.organizer-menu button {
  min-height: 40px;
  border: 1px solid #dfe6e1;
  border-radius: 6px;
  background: #fff;
  color: #26342e;
  font-weight: 800;
  text-align: left;
}

.organizer-menu button:hover,
.organizer-menu button.is-active {
  border-color: var(--green);
  background: #f1f8f3;
  color: var(--green-dark);
}

.organizer-page {
  min-height: calc(100vh - 72px);
  padding: clamp(18px, 3vw, 36px);
  overflow-x: hidden;
  background:
    linear-gradient(135deg, rgba(240, 189, 57, 0.09), transparent 34%),
    #f4f7f4;
}

.organizer-page button,
.organizer-page input,
.organizer-page select,
.organizer-page textarea,
.organizer-dialog button,
.organizer-dialog input,
.organizer-dialog select,
.organizer-dialog textarea {
  letter-spacing: 0;
}

.organizer-page button:focus-visible,
.organizer-page input:focus-visible,
.organizer-page select:focus-visible,
.organizer-page textarea:focus-visible,
.organizer-dialog button:focus-visible,
.organizer-dialog input:focus-visible,
.organizer-dialog select:focus-visible,
.organizer-dialog textarea:focus-visible {
  outline: 3px solid rgba(53, 120, 191, 0.35);
  outline-offset: 2px;
}

.organizer-page-header {
  max-width: 1500px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin: 0 auto 22px;
}

.organizer-section-nav {
  width: 100%;
  max-width: 1500px;
  display: flex;
  gap: 6px;
  margin: -8px auto 16px;
  padding-bottom: 2px;
  overflow-x: auto;
}

.organizer-section-nav a {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  padding: 0 12px;
  border-bottom: 3px solid transparent;
  color: #526059;
  font-size: 0.8rem;
  font-weight: 850;
  text-decoration: none;
}

.organizer-section-nav a:hover,
.organizer-section-nav a.is-active {
  border-color: var(--green);
  color: var(--green-dark);
}

.organizer-page-header > div {
  max-width: 760px;
}

.organizer-page-header h1,
.organizer-page-header p,
.organizer-page-header span {
  margin: 0;
}

.organizer-page-header h1 {
  color: #1c2b25;
  font-size: clamp(1.9rem, 3vw, 3rem);
  line-height: 1.05;
}

.organizer-page-header > div > span {
  display: block;
  margin-top: 8px;
  color: var(--ink-soft);
  line-height: 1.55;
}

.organizer-eyebrow {
  margin-bottom: 6px !important;
  color: var(--green-dark);
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
}

.organizer-button {
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #fff;
  color: #28352f;
  font-weight: 850;
}

.organizer-button:hover {
  border-color: var(--green);
  color: var(--green-dark);
}

.organizer-button-primary {
  border-color: var(--green);
  background: var(--green);
  color: #fff;
}

.organizer-button-primary:hover {
  background: var(--green-dark);
  color: #fff;
}

.organizer-button-quiet {
  background: #f7faf7;
}

.organizer-button-danger {
  border-color: #c94545;
  background: #fff7f7;
  color: #a92f2f;
}

.records-layout,
.grocery-layout,
.inventory-layout,
.task-layout {
  width: 100%;
  max-width: 1500px;
  display: grid;
  grid-template-columns: minmax(230px, 0.28fr) minmax(0, 1fr);
  gap: 18px;
  margin: 0 auto;
}

.grocery-layout {
  grid-template-columns: minmax(230px, 0.24fr) minmax(0, 1fr);
}

.inventory-layout {
  grid-template-columns: minmax(250px, 0.27fr) minmax(0, 1fr);
}

.task-layout {
  grid-template-columns: minmax(0, 1fr) minmax(240px, 0.24fr);
}

.organizer-sidebar {
  min-width: 0;
  align-self: start;
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
}

.records-overview,
.inventory-locations,
.task-detail-panel {
  position: sticky;
  top: 90px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
}

.organizer-sidebar-heading,
.organizer-section-heading,
.record-list-header,
.organizer-toolbar,
.inventory-title-row,
.task-calendar-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.organizer-sidebar-heading > button,
.inventory-location-actions button,
.inventory-container-actions > button,
.organizer-item-actions button,
.organizer-reorder button,
.task-calendar-toolbar > div button {
  min-height: 32px;
  padding: 0 9px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: #fff;
  color: #3c4943;
  font-size: 0.74rem;
  font-weight: 850;
}

.organizer-sidebar-heading > button:hover,
.inventory-location-actions button:hover,
.inventory-container-actions > button:hover,
.organizer-item-actions button:hover,
.organizer-reorder button:hover,
.task-calendar-toolbar > div button:hover {
  border-color: var(--green);
  background: #f3f8f4;
}

.organizer-item-actions button.is-danger,
.inventory-location-actions button.is-danger,
.inventory-container-actions button.is-danger {
  color: #a92f2f;
}

.organizer-search,
.organizer-field,
.organizer-inline-field {
  min-width: 0;
  display: grid;
  gap: 6px;
  color: #4c5953;
  font-size: 0.76rem;
  font-weight: 850;
}

.organizer-search input,
.organizer-field input,
.organizer-field select,
.organizer-field textarea,
.organizer-inline-field select {
  width: 100%;
  min-width: 0;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #fff;
  color: #20242a;
}

.organizer-field textarea {
  min-height: 86px;
  resize: vertical;
}

.organizer-toggle,
.organizer-checkbox-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4b5852;
  font-size: 0.78rem;
  font-weight: 800;
}

.organizer-toggle input,
.organizer-checkbox-field input,
.task-check input {
  width: 18px;
  height: 18px;
  accent-color: var(--green);
}

.organizer-workspace {
  min-width: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
}

.organizer-empty {
  min-height: 180px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  padding: 28px;
  color: var(--ink-soft);
  text-align: center;
}

.organizer-empty strong {
  color: #2c3933;
  font-size: 1.05rem;
}

.organizer-empty p {
  max-width: 480px;
  margin: 0;
  line-height: 1.5;
}

.organizer-meta,
.inventory-flags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
}

.organizer-meta > span,
.inventory-flag,
.organizer-sync-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 3px 7px;
  border-radius: 999px;
  background: #eef3f0;
  color: #53615a;
  font-size: 0.68rem;
  font-weight: 850;
}

.organizer-sync-badge {
  border: 1px solid rgba(53, 120, 191, 0.28);
  background: #edf5fd;
  color: #275d92;
}

.inventory-flag.is-warning {
  background: #fff6dd;
  color: #765812;
}

.inventory-flag.is-danger {
  background: #fff0f0;
  color: #9b3030;
}

.organizer-reorder {
  display: inline-flex;
  gap: 4px;
}

.organizer-item-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.organizer-toast {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 100;
  max-width: min(420px, calc(100vw - 36px));
  padding: 12px 16px;
  border: 1px solid var(--green);
  border-radius: 7px;
  background: #f0faf4;
  color: var(--green-dark);
  box-shadow: 0 18px 48px rgba(31, 43, 38, 0.2);
  font-weight: 850;
}

.organizer-toast-error {
  border-color: #c94545;
  background: #fff2f2;
  color: #982d2d;
}

.organizer-dialog {
  width: min(760px, calc(100vw - 24px));
  max-height: calc(100vh - 24px);
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
  color: #20242a;
  overflow: auto;
  box-shadow: 0 24px 80px rgba(24, 33, 29, 0.28);
}

.organizer-dialog::backdrop {
  background: rgba(24, 33, 29, 0.52);
  backdrop-filter: blur(3px);
}

.organizer-dialog-form {
  display: grid;
}

.organizer-dialog-form header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid var(--border);
}

.organizer-dialog-form header p,
.organizer-dialog-form header h2,
.organizer-dialog-form header span {
  margin: 0;
}

.organizer-dialog-form header p {
  color: var(--green-dark);
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
}

.organizer-dialog-form header h2 {
  margin-top: 4px;
  font-size: 1.35rem;
}

.organizer-dialog-form header span {
  display: block;
  margin-top: 6px;
  color: var(--ink-soft);
  line-height: 1.45;
}

.organizer-icon-button {
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #fff;
  font-weight: 900;
}

.organizer-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding: 20px;
}

.organizer-field-wide,
.organizer-checkbox-field + small {
  grid-column: 1 / -1;
}

.organizer-field small {
  color: var(--ink-soft);
  font-weight: 500;
}

.organizer-dialog-form footer {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--border);
  background: #f7faf7;
}

.organizer-choice-dialog {
  width: min(620px, calc(100vw - 24px));
}

.organizer-choice-dialog footer {
  justify-content: flex-start;
}

.records-list-picker,
.inventory-section-list {
  display: grid;
  gap: 6px;
}

.record-list-picker {
  min-width: 0;
  min-height: 50px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #303c36;
  text-align: left;
}

.record-list-picker > span {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: #e8f1eb;
  color: var(--green-dark);
  font-weight: 900;
}

.record-list-picker small {
  color: var(--ink-soft);
}

.record-list-picker:hover,
.record-list-picker.is-active {
  border-color: #bfd5c7;
  background: #f1f7f3;
}

.record-list-header {
  align-items: flex-start;
  padding: 20px;
  border-bottom: 1px solid var(--border);
}

.record-list-header p,
.record-list-header h2,
.record-list-header span,
.organizer-section-heading p,
.organizer-section-heading h2 {
  margin: 0;
}

.record-list-header p,
.organizer-section-heading p {
  color: var(--green-dark);
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
}

.record-list-header h2,
.organizer-section-heading h2 {
  margin-top: 4px;
  color: #213029;
  font-size: 1.55rem;
}

.record-list-header > div > span {
  display: block;
  margin-top: 7px;
  color: var(--ink-soft);
}

.organizer-header-actions {
  max-width: 560px;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 6px;
}

.organizer-toolbar {
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  background: #fafcfb;
}

.organizer-toolbar .organizer-search {
  flex: 1 1 260px;
}

.organizer-inline-field {
  grid-template-columns: auto minmax(110px, 1fr);
  align-items: center;
}

.record-items,
.grocery-items,
.inventory-items,
.task-list {
  display: grid;
}

.record-item,
.grocery-item,
.inventory-item,
.task-card {
  min-width: 0;
  display: grid;
  align-items: start;
  gap: 12px;
  padding: 15px 20px;
  border-bottom: 1px solid #e1e7e3;
  background: #fff;
}

.record-item:last-child,
.grocery-item:last-child,
.inventory-item:last-child,
.task-card:last-child {
  border-bottom: 0;
}

.record-item {
  grid-template-columns: auto minmax(0, 1fr);
}

.record-item-copy strong,
.grocery-item strong,
.inventory-item strong,
.task-card strong {
  overflow-wrap: anywhere;
}

.record-item-copy p,
.grocery-item p,
.inventory-item p,
.task-card p {
  margin: 7px 0 0;
  color: var(--ink-soft);
  line-height: 1.45;
}

.record-item .organizer-item-actions {
  grid-column: 2;
}

.record-item-cards {
  margin: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.record-item-journal {
  padding-top: 22px;
  padding-bottom: 22px;
}

.record-item.is-complete .record-item-copy strong,
.task-card.is-complete .task-copy strong {
  color: var(--ink-soft);
  text-decoration: line-through;
}

.record-number {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #edf4ef;
  color: var(--green-dark);
  font-size: 0.75rem;
  font-weight: 900;
}

.grocery-status-switch,
.task-view-switch {
  width: 100%;
  max-width: 1500px;
  display: flex;
  gap: 6px;
  margin: 0 auto 14px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #eaf1ec;
}

.grocery-status-switch button,
.task-view-switch button {
  min-height: 42px;
  flex: 1;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #435048;
  font-weight: 850;
}

.grocery-status-switch button span {
  display: inline-grid;
  min-width: 24px;
  min-height: 24px;
  place-items: center;
  margin-left: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.74);
}

.grocery-status-switch button.is-active,
.task-view-switch button.is-active {
  background: var(--green);
  color: #fff;
}

.grocery-quick-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.grocery-quick-summary span {
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #f7faf7;
  color: var(--ink-soft);
  font-size: 0.72rem;
}

.grocery-quick-summary strong {
  display: block;
  color: #26332d;
  font-size: 1.15rem;
}

.organizer-section-heading {
  align-items: flex-start;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}

.grocery-item {
  grid-template-columns: minmax(0, 1fr);
}

.grocery-item-main {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 10px;
}

.grocery-category-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: #fff3ce;
  color: #745811;
  font-weight: 900;
}

.inventory-alert-strip {
  width: 100%;
  max-width: 1500px;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 7px;
  margin: 0 auto 14px;
}

.inventory-alert-strip button {
  min-height: 48px;
  padding: 7px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #fff;
  color: #526059;
  font-size: 0.7rem;
  font-weight: 850;
}

.inventory-alert-strip button strong {
  display: block;
  color: #23312a;
  font-size: 1rem;
}

.inventory-alert-strip button:hover,
.inventory-alert-strip button.is-active {
  border-color: var(--sun);
  background: #fff9e8;
}

.inventory-section-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 5px;
  padding: 4px;
  border: 1px solid transparent;
  border-radius: 6px;
}

.inventory-section-row.is-active {
  border-color: #bfd5c7;
  background: #f1f7f3;
}

.inventory-section-row > button {
  min-width: 0;
  display: grid;
  gap: 2px;
  padding: 7px;
  border: 0;
  background: transparent;
  color: #2f3d36;
  text-align: left;
}

.inventory-section-row small {
  color: var(--ink-soft);
}

.inventory-section-row .organizer-reorder {
  flex-direction: column;
}

.inventory-location-actions,
.inventory-container-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.inventory-container-tabs {
  display: flex;
  gap: 6px;
  padding: 10px 20px;
  overflow-x: auto;
  border-bottom: 1px solid var(--border);
}

.inventory-container-tabs button {
  min-height: 36px;
  flex: 0 0 auto;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #fff;
  color: #445149;
  font-weight: 850;
}

.inventory-container-tabs button.is-active {
  border-color: var(--blue);
  background: #eff6fd;
  color: #285f95;
}

.inventory-container-actions {
  padding: 10px 20px;
}

.inventory-filter-toolbar {
  flex-wrap: wrap;
}

.inventory-item {
  grid-template-columns: minmax(0, 1fr) auto;
}

.inventory-item > img {
  width: 100%;
  max-height: 260px;
  grid-column: 1 / -1;
  object-fit: contain;
  border-radius: 6px;
  background: #f2f5f3;
}

.inventory-item-details {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 10px 0 0;
}

.inventory-item-details div {
  display: grid;
  gap: 2px;
}

.inventory-item-details dt {
  color: var(--ink-soft);
  font-size: 0.65rem;
  font-weight: 850;
  text-transform: uppercase;
}

.inventory-item-details dd {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 800;
}

.inventory-location {
  color: #2e6d9f !important;
  font-size: 0.78rem;
  font-weight: 850;
}

.inventory-quantity-controls {
  display: grid;
  grid-template-columns: 34px 42px 34px;
  align-items: center;
}

.inventory-quantity-controls button {
  width: 34px;
  height: 34px;
  border: 1px solid var(--border);
  background: #fff;
  color: #25342c;
  font-size: 1.05rem;
  font-weight: 900;
}

.inventory-quantity-controls strong {
  text-align: center;
}

.inventory-item .organizer-item-actions {
  grid-column: 1 / -1;
}

.task-calendar-panel {
  overflow: hidden;
}

.task-detail-panel {
  grid-column: 2;
  grid-row: 1;
}

.task-calendar-toolbar {
  min-height: 72px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
}

.task-calendar-toolbar > div {
  display: inline-flex;
  gap: 5px;
}

.task-calendar-toolbar h2 {
  margin: 0;
  font-size: 1.15rem;
}

.task-calendar-month {
  display: grid;
  grid-template-columns: repeat(7, minmax(96px, 1fr));
  overflow-x: auto;
}

.task-weekday {
  min-height: 34px;
  display: grid;
  place-items: center;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  background: #f5f8f6;
  color: var(--ink-soft);
  font-size: 0.7rem;
  font-weight: 900;
}

.task-calendar-day {
  min-height: 138px;
  padding: 7px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: #fff;
}

.task-calendar-day.is-outside {
  background: #f5f7f5;
  color: #939b97;
}

.task-calendar-day.is-today,
.task-week-column.is-today {
  box-shadow: inset 0 0 0 2px var(--sun);
}

.task-date-button,
.task-week-heading {
  min-width: 30px;
  min-height: 30px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: inherit;
  font-weight: 900;
}

.task-date-button:hover,
.task-week-heading:hover {
  background: #eef5f0;
}

.task-calendar-day-items {
  display: grid;
  gap: 4px;
  margin-top: 4px;
}

.task-card {
  grid-template-columns: auto minmax(0, 1fr);
  border-left: 4px solid #78a889;
}

.task-card.is-compact {
  min-height: 30px;
  display: block;
  padding: 5px 6px;
  border: 0;
  border-left: 3px solid #78a889;
  border-radius: 4px;
  background: #f2f7f3;
}

.task-card.is-compact .task-check,
.task-card.is-compact .organizer-meta {
  display: none;
}

.task-card.is-compact strong {
  display: block;
  font-size: 0.68rem;
  line-height: 1.25;
}

.task-priority-high,
.task-priority-urgent {
  border-left-color: var(--coral);
}

.task-priority-low {
  border-left-color: var(--blue);
}

.task-card .organizer-item-actions {
  grid-column: 2;
}

.task-related-link {
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #275d92;
  font-size: 0.75rem;
  font-weight: 850;
  text-align: left;
}

.task-more-button {
  min-height: 26px;
  border: 0;
  background: transparent;
  color: var(--green-dark);
  font-size: 0.68rem;
  font-weight: 850;
}

.task-mobile-count {
  display: none;
}

.task-calendar-week {
  min-width: 760px;
  display: grid;
  grid-template-columns: repeat(7, minmax(108px, 1fr));
}

.task-week-column {
  min-height: 540px;
  border-right: 1px solid var(--border);
}

.task-week-heading {
  width: 100%;
  height: 58px;
  display: grid;
  place-items: center;
  align-content: center;
  border-bottom: 1px solid var(--border);
  border-radius: 0;
}

.task-week-heading span {
  color: var(--ink-soft);
  font-size: 0.66rem;
}

.task-week-column .task-card {
  margin: 5px;
}

.task-day-empty {
  margin: 16px 8px;
  color: #8a938e;
  font-size: 0.72rem;
  text-align: center;
}

.task-day-view > header {
  padding: 18px 20px;
  border-bottom: 1px solid var(--border);
}

.task-day-view > header p,
.task-day-view > header h2 {
  margin: 0;
}

.task-day-view > header p {
  color: var(--ink-soft);
}

.task-day-view > header h2 {
  margin-top: 4px;
}

.task-list-view > section > header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  background: #f7faf7;
}

.task-list-view > section + section {
  border-top: 6px solid #eef3ef;
}

.task-selected-date {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-left: 4px solid var(--sun);
  background: #fff9e9;
}

.task-selected-date p,
.task-selected-date strong,
.task-selected-date span {
  margin: 0;
}

.task-selected-date p,
.task-selected-date span {
  color: var(--ink-soft);
  font-size: 0.72rem;
}

.organizer-mobile-add {
  display: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1120px) {
  .records-layout,
  .grocery-layout,
  .inventory-layout,
  .task-layout {
    grid-template-columns: minmax(210px, 0.32fr) minmax(0, 1fr);
  }

  .inventory-alert-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .task-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .task-detail-panel {
    grid-column: auto;
    grid-row: auto;
    position: static;
    max-height: none;
  }
}

@media (max-width: 820px) {
  .records-layout,
  .grocery-layout,
  .inventory-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .records-overview,
  .inventory-locations {
    position: static;
    max-height: none;
  }

  .records-list-picker {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .record-list-header,
  .organizer-section-heading,
  .organizer-toolbar,
  .task-calendar-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .organizer-header-actions {
    justify-content: flex-start;
  }

  .task-calendar-toolbar h2 {
    order: -1;
  }
}

@media (max-width: 640px) {
  .app-shell {
    grid-template-columns: minmax(0, 1fr);
  }

  .topbar,
  #pageRoot {
    min-width: 0;
    max-width: 100%;
  }

  .organizer-nav-dropdown {
    flex: 1 1 calc(50% - 6px);
  }

  .organizer-nav-dropdown .nav-button {
    width: 100%;
  }

  .organizer-menu {
    right: 0;
    left: auto;
    width: min(240px, 90vw);
  }

  .organizer-page {
    min-height: calc(100vh - 122px);
    padding: 16px 12px 86px;
  }

  .organizer-page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .organizer-page-header > .organizer-button {
    display: none;
  }

  .organizer-page-header h1 {
    font-size: 2rem;
  }

  .records-list-picker,
  .organizer-form-grid,
  .inventory-alert-strip {
    grid-template-columns: minmax(0, 1fr);
  }

  .organizer-field-wide {
    grid-column: auto;
  }

  .record-list-header,
  .organizer-section-heading,
  .organizer-toolbar,
  .task-calendar-toolbar {
    padding: 14px;
  }

  .record-item,
  .grocery-item,
  .inventory-item,
  .task-card {
    padding: 13px;
  }

  .organizer-item-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .organizer-item-actions button {
    min-height: 40px;
  }

  .organizer-reorder {
    grid-column: 1 / -1;
  }

  .record-item .organizer-item-actions,
  .task-card .organizer-item-actions {
    grid-column: 1 / -1;
  }

  .inventory-item {
    grid-template-columns: minmax(0, 1fr);
  }

  .inventory-quantity-controls {
    justify-self: start;
  }

  .grocery-status-switch,
  .task-view-switch {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
  }

  .grocery-status-switch button,
  .task-view-switch button {
    flex: 0 0 112px;
    min-width: 112px;
  }

  .task-view-switch button {
    flex: 1 1 25%;
    min-width: 72px;
  }

  .tasks-page,
  .task-layout,
  .task-calendar-panel {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .task-calendar-panel {
    overflow-x: auto;
  }

  .task-calendar-month {
    min-width: 0;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .task-calendar-day {
    min-height: 88px;
    padding: 3px;
  }

  .task-calendar-day .task-card.is-compact,
  .task-calendar-day .task-more-button {
    display: none;
  }

  .task-mobile-count {
    display: block;
    width: 100%;
    min-height: 24px;
    padding: 2px;
    border: 0;
    border-radius: 4px;
    background: #edf4ef;
    color: var(--green-dark);
    font-size: 0.62rem;
    font-weight: 850;
  }

  .task-calendar-toolbar {
    min-width: 320px;
  }

  .organizer-mobile-add {
    display: block;
    position: sticky;
    bottom: 12px;
  }

  .organizer-dialog-form footer {
    display: grid;
    grid-template-columns: 1fr;
  }

  .organizer-dialog-form footer .organizer-button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .organizer-page *,
  .organizer-dialog *,
  .organizer-toast {
    scroll-behavior: auto !important;
    transition: none !important;
    animation: none !important;
  }
}
