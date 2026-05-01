# SKILL: Global System Core

## Purpose
The central orchestrator of the Antigravity Global Software Intelligence System.
This skill is ALWAYS activated first on every task. It reads the system memory, determines the project type, and delegates to the appropriate specialized skills.

---

## When To Use
- At the start of EVERY task.
- When the project type is unknown or has changed.
- When multiple skills need coordination.
- When a new domain/module is being added.

---

## Execution Steps

### Step 1 — Load System Memory
1. Read `.agents/memory/system-context.md`.
2. Read `.agents/memory/backend-context.md`.
3. Read `.agents/memory/frontend-context.md`.
4. Read `.agents/memory/design-system.md`.

### Step 2 — Detect System Type
Analyze the workspace to identify the system type:

| Signals | System Type |
| :--- | :--- |
| `/hr/`, `/payroll/`, `/inventory/`, `/finance/` modules | ERP |
| `/tenants/`, `/subscriptions/`, `/billing/` modules | SaaS |
| `/screens/`, `App.tsx` with `NavigationContainer` | Mobile |
| `/pages/`, `/api/`, generic domain structure | CMS / Custom Web App |

If `system-context.md` already has a confirmed type, trust it. Only re-detect if explicitly asked.

### Step 3 — Activate Relevant Skills
Based on system type, activate the appropriate skill chain:

**ERP:**
- `erp-domain` → `fullstack-module-generator` → `auto-memory-generator` → `frontend-memory-generator` → `ui-consistency-enforcer`

**SaaS:**
- `saas-domain` → `fullstack-module-generator` → `auto-memory-generator` → `frontend-memory-generator`

**Mobile:**
- `mobile-domain` → `frontend-memory-generator`

**All types always activate:**
- `design-system-memory`
- `ui-consistency-enforcer`

### Step 4 — Orchestrate Task Execution
1. Delegate the task to the correct specialized skill.
2. Confirm architecture constraints are met.
3. After execution, trigger memory update via `auto-memory-generator` and `frontend-memory-generator`.
4. Update `system-context.md` with any new active modules.

---

## Rules

1. **Always read memory files first** — Never act without loading the full context.
2. **Never skip detection** — Even if the system type seems obvious, verify against signals.
3. **Delegate, don't duplicate** — Do not implement logic covered by specialized skills.
4. **Memory must be updated** — Every task that adds or modifies a module must end with a memory update.
5. **Consistency trumps speed** — Do not skip ui-consistency-enforcer for frontend changes.

---

## Anti-Patterns

- ❌ Starting a task without reading `system-context.md`.
- ❌ Manually guessing the system type from the user's description without scanning files.
- ❌ Forgetting to activate `design-system-memory` for any frontend change.
- ❌ Running `fullstack-module-generator` without confirming the backend architecture first.
- ❌ Leaving `system-context.md` stale after adding new modules.

---

## Interconnections

| This Skill → | When |
| :--- | :--- |
| `erp-domain` | ERP system detected |
| `saas-domain` | SaaS system detected |
| `mobile-domain` | Mobile system detected |
| `auto-memory-generator` | After any backend change |
| `frontend-memory-generator` | After any frontend change |
| `fullstack-module-generator` | When a new module is requested |
| `ui-consistency-enforcer` | After any UI change |
| `design-system-memory` | Always |
