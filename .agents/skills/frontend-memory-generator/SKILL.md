# SKILL: Frontend Memory Generator

## Purpose
Scans the frontend project structure, detects UI patterns, routing, hooks, components, and services,
then generates or updates `.agents/memory/frontend-context.md` with accurate, structured context.

---

## When To Use
- When a new frontend page or component is created.
- When the frontend structure is significantly refactored.
- When `frontend-context.md` is missing or stale.
- After running `fullstack-module-generator` for any new module.
- After running `ui-consistency-enforcer`.

---

## Resources
- Extraction rules: `.agents/resources/extraction-rules.md`
- Memory template: `.agents/resources/memory-template.md`
- Output target: `.agents/memory/frontend-context.md`

---

## Execution Steps

### Step 1 — Read Existing Memory
1. Open `.agents/memory/frontend-context.md` (if it exists).
2. Note all existing module/component entries.
3. Do NOT overwrite — only append and update.

### Step 2 — Read Extraction Rules
1. Open `.agents/resources/extraction-rules.md`.
2. Apply frontend architecture detection signals and merge rules.

### Step 3 — Scan Frontend Structure
Inspect the workspace for:

**Framework signals:**
- `vite.config.ts` or `vite.config.js` → Vite/React
- `next.config.js` → Next.js
- `App.tsx` with `NavigationContainer` → React Native

**Navigation style signals:**
- Tab-based: multiple `<TabPanel>` or `data-tab` elements in layout
- Sidebar: persistent `<aside>` or `Sidebar` component
- Screen-based: `<Stack.Screen>` or `<Tab.Screen>` (React Native)

**State management signals:**
- `createContext` / `useContext` → Context API
- `createStore` / `redux` → Redux
- `create()` from `zustand` → Zustand

**Module signals per directory:**
- `/src/pages/[Module]/[Module]Page.tsx` → one UI module
- `/src/hooks/use[Module].ts` → custom hook for module
- `/src/services/[module].service.ts` → API service layer
- `/src/components/[Module]/` → module components

### Step 4 — Detect Layout Structure
Identify:
- Main layout file path and its composition.
- Shared layout components (Header, Sidebar, Footer, TabBar).
- Global styles location.
- Router definition file.

### Step 5 — Generate / Merge frontend-context.md
Using the memory template structure:
1. Update `UI Architecture` section.
2. **Append** new module rows to `Module Registry` table.
3. Update `Layout Structure` section.
4. Update `Shared Hooks` and `Shared Components` lists.
5. Mark removed modules as `[outdated]`.
6. Update `Last Updated` timestamp.

### Step 6 — Verify Output
Confirm the updated `frontend-context.md`:
- Lists all active pages/modules.
- Correctly identifies the framework and navigation style.
- Hooks and services are cross-referenced.

---

## Rules

1. **Read before write** — Always load existing `frontend-context.md` before generating.
2. **Merge, never replace** — Append new modules; preserve all valid existing entries.
3. **Use confidence levels** — All inferred values must be tagged.
4. **Cross-reference hooks with services** — Every `use[Module].ts` should point to a `[module].service.ts`.
5. **Document design system linkage** — If design tokens are referenced in CSS/style files, note them.

---

## Anti-Patterns

- ❌ Overwriting the entire `frontend-context.md`.
- ❌ Treating `node_modules/` or `dist/` components as modules.
- ❌ Missing `use[Module]` hooks that exist but have no page paired.
- ❌ Ignoring the design system integration.
- ❌ Failing to detect tab-based UI when `data-tab` pattern is in use.

---

## Output: frontend-context.md Shape

```markdown
# Frontend Context

## Identity
- Last Updated: [ISO timestamp]
- Generator: frontend-memory-generator

## UI Architecture
- Framework: React + Vite [HIGH]
- Navigation Style: Tab-based [HIGH]
- State Management: Context API [MEDIUM]

## Layout Structure
- Main Layout: /src/components/Layout/AppLayout.tsx
- Sidebar: /src/components/Sidebar/Sidebar.tsx
- Global Styles: /src/index.css

## Module Registry
| Module | Page Path | Hook | Service |
| :--- | :--- | :--- | :--- |
| Dashboard | /src/pages/Dashboard/DashboardPage.tsx | useDashboard | dashboard.service.ts |
| Inventory  | /src/pages/Inventory/InventoryPage.tsx  | useInventory | inventory.service.ts |

## Shared Hooks
- useAuth → /src/hooks/useAuth.ts
- useToast → /src/hooks/useToast.ts

## Shared Components
- DataTable → /src/components/common/DataTable.tsx
- Modal     → /src/components/common/Modal.tsx
- Button    → /src/components/common/Button.tsx

## Notes
- Tab navigation driven by URL hash in AppLayout
```
