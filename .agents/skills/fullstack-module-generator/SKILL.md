# SKILL: Fullstack Module Generator

## Purpose
Generates a complete, production-ready fullstack module — backend + frontend — in one coordinated
operation. Ensures the backend and frontend are aligned and all memory files are updated afterward.

---

## When To Use
- When the user requests a new domain feature or module.
- When a new ERP domain (e.g., HR, Inventory, Payroll) is being added.
- When a new SaaS feature (e.g., Billing, Team Management) is required.

---

## Resources
- Backend template: `.agents/resources/backend-template.md`
- Frontend template: `.agents/resources/frontend-template.md`
- Output: updates to `backend-context.md` and `frontend-context.md`

---

## Pre-Execution Checklist

Before generating, confirm:
- [ ] Module name is defined (e.g., `inventory`)
- [ ] Backend architecture confirmed from `backend-context.md`
- [ ] Frontend framework confirmed from `frontend-context.md`
- [ ] Design tokens confirmed from `design-system.md`
- [ ] Proto file naming conventions checked against existing protos
- [ ] API route prefix checked against existing gateway routes

---

## Execution Steps

### Step 1 — Load Context
1. Read `.agents/memory/system-context.md`
2. Read `.agents/memory/backend-context.md`
3. Read `.agents/memory/frontend-context.md`
4. Read `.agents/memory/design-system.md`

### Step 2 — Plan Module Structure

**Backend files to generate:**
| File | Location |
| :--- | :--- |
| `[module].controller.ts` | `/services/[module]/` |
| `[module].service.ts` | `/services/[module]/` |
| `[module].repository.ts` | `/services/[module]/` |
| `[module].entity.ts` | `/services/[module]/` |
| `dto/[module].dto.ts` | `/services/[module]/dto/` |
| `[module].proto` | `/protos/` |
| `[module].routes.ts` | `/api-gateway/routes/` |
| `[module].client.ts` | `/api-gateway/clients/` |
| Registration in `main.ts` | `/services/[module]/main.ts` or bootstrap |

**Frontend files to generate:**
| File | Location |
| :--- | :--- |
| `[Module]Page.tsx` | `/src/pages/[Module]/` |
| `[Module]Table.tsx` | `/src/components/[Module]/` |
| `[Module]Modal.tsx` | `/src/components/[Module]/` |
| `use[Module].ts` | `/src/hooks/` |
| `[module].service.ts` | `/src/services/` |
| Route registration | `/src/App.tsx` or router file |

### Step 3 — Generate Backend Module
Use `.agents/resources/backend-template.md` as the basis.
Replace `[MODULE]` / `[module]` with the actual module name.
Adapt fields based on the specific domain requirements provided.

Validation before writing:
- Ensure proto service name doesn't conflict with existing protos.
- Ensure SQL table name doesn't conflict with existing tables.
- Ensure API route prefix doesn't conflict with existing routes.

### Step 4 — Generate Frontend Module
Use `.agents/resources/frontend-template.md` as the basis.
Replace `[Module]` / `[module]` with the actual module name.

Validation before writing:
- Confirm API endpoint in service file matches gateway route.
- Confirm CSS class names match existing design system conventions.
- Confirm tab or navigation entry is added if tab-based UI.

### Step 5 — Register Module
Backend:
- Register gRPC handlers in the service's `main.ts`.
- Register Express route in `api-gateway/app.ts`.

Frontend:
- Add route/tab entry in the main router or layout.
- Export page from the module index if applicable.

### Step 6 — Update Memory Files
After generation:
1. Trigger `auto-memory-generator` → update `backend-context.md`.
2. Trigger `frontend-memory-generator` → update `frontend-context.md`.
3. Update `system-context.md` active modules list.

---

## Rules

1. **Backend and frontend must be aligned** — API endpoints must match exactly.
2. **Always use templates** — Never free-style generate; start from the template.
3. **Validate before write** — Check for naming conflicts before creating files.
4. **Register in all required places** — A module not registered is a broken module.
5. **Update memory after every generation** — Never leave context stale.
6. **Design system compliance** — CSS class names must use only token-based classes.

---

## Anti-Patterns

- ❌ Generating backend without checking existing proto naming conventions.
- ❌ Generating frontend service with a hardcoded URL (must use `VITE_API_URL`).
- ❌ Forgetting to add the route in the API gateway.
- ❌ Adding a new page without registering it in the router.
- ❌ Using raw hex colors in generated component styles.
- ❌ Using `&&` in terminal commands (per project rules — use separate commands).

---

## Output Summary Format

After generating a module, always return:

```
## Module Generated: [module-name]

### Backend
- [ ] services/[module]/[module].controller.ts
- [ ] services/[module]/[module].service.ts
- [ ] services/[module]/[module].repository.ts
- [ ] services/[module]/[module].entity.ts
- [ ] services/[module]/dto/[module].dto.ts
- [ ] protos/[module].proto
- [ ] api-gateway/routes/[module].routes.ts
- [ ] api-gateway/clients/[module].client.ts

### Frontend
- [ ] src/pages/[Module]/[Module]Page.tsx
- [ ] src/components/[Module]/[Module]Table.tsx
- [ ] src/components/[Module]/[Module]Modal.tsx
- [ ] src/hooks/use[Module].ts
- [ ] src/services/[module].service.ts

### Memory Updated
- [ ] backend-context.md
- [ ] frontend-context.md
- [ ] system-context.md
```
