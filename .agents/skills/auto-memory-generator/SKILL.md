# SKILL: Auto Memory Generator (Backend)

## Purpose
Scans the backend project structure, detects architecture patterns, protocols, and modules,
then generates or updates `.agents/memory/backend-context.md` with accurate, up-to-date context.

---

## When To Use
- When a new backend module is created.
- When an existing backend module is significantly modified.
- When `backend-context.md` is missing or stale.
- When the system type is first detected.
- After running `fullstack-module-generator`.

---

## Resources
- Extraction rules: `.agents/resources/extraction-rules.md`
- Memory template: `.agents/resources/memory-template.md`
- Output target: `.agents/memory/backend-context.md`

---

## Execution Steps

### Step 1 — Read Existing Memory
1. Read `.agents/memory/backend-context.md` (if it exists).
2. Note all existing module entries, architecture, and notes.
3. Do NOT overwrite — only append and update.

### Step 2 — Read Extraction Rules
1. Open `.agents/resources/extraction-rules.md`.
2. Internalize all detection signals and merge strategies before scanning.

### Step 3 — Scan Backend Structure
Inspect the workspace for:

**Architecture signals:**
- `/services/*/` with `controller`, `service`, `repository` files → Clean Architecture
- `/routes/` + flat model files → MVC
- `/src/[domain]/` nested → Domain-Driven

**Protocol signals:**
- `/protos/*.proto` files → gRPC confirmed
- `express` + `Router()` usage → REST/Express

**Database signals:**
- `better-sqlite3` or `sqlite3` in `package.json` → SQLite
- `pg` or `typeorm` → PostgreSQL

**Module signals:**
- Each `/services/[name]/` directory with controller + service + repository = one module

### Step 4 — Detect Domain Modules
For each detected module folder, extract:
- Module name
- File paths of each layer
- Status (active / incomplete)
- Proto file (if gRPC)
- API Gateway route file (if Express)

### Step 5 — Generate / Merge backend-context.md
Using the memory template structure:
1. Update `Architecture` section with detected patterns + confidence levels.
2. Update `Infrastructure` section with detected protocol and DB.
3. **Append** new module rows to the `Domain Modules` table.
4. Mark any previously listed modules that no longer exist as `[outdated]`.
5. Update `Last Updated` timestamp.
6. Add notes for any ambiguous or incomplete modules.

### Step 6 — Verify Output
Confirm the updated `backend-context.md`:
- Contains all detected modules.
- Has no duplicate rows.
- Has accurate architecture and infrastructure fields.
- Preserves all previous non-stale data.

---

## Rules

1. **Read before write** — Always load the existing file before generating output.
2. **Merge, never overwrite** — Append new modules; never delete existing valid entries.
3. **Use confidence levels** — All inferred values must be tagged `[HIGH]`, `[MEDIUM]`, `[LOW]`, or `[UNKNOWN]`.
4. **Follow extraction-rules.md** — Do not invent detection logic outside of defined signals.
5. **Skip test and dist files** — Honor exclusion rules from extraction-rules.md.

---

## Anti-Patterns

- ❌ Overwriting the entire `backend-context.md` with a fresh file.
- ❌ Assuming architecture from the user's description without scanning files.
- ❌ Missing gRPC detection when `.proto` files exist.
- ❌ Listing modules from `node_modules/` or `dist/`.
- ❌ Leaving confidence levels blank.

---

## Output: backend-context.md Shape

```markdown
# Backend Context

## Identity
- Last Updated: [ISO timestamp]
- Generator: auto-memory-generator

## Architecture
- Pattern: Clean Architecture [HIGH]
- Layers: Controller, Service, Repository, Entity, DTO
- Entry Point: /src/main.ts

## Infrastructure
- Protocol: gRPC [HIGH]
- API Gateway: Express.js [HIGH]
- Database: SQLite (better-sqlite3) [HIGH]
- Auth: JWT via gateway middleware [MEDIUM]

## Domain Modules
| Module | Location | Status | Proto |
| :--- | :--- | :--- | :--- |
| user | /services/user | active | /protos/user.proto |
| inventory | /services/inventory | active | /protos/inventory.proto |

## API Gateway Routes
- GET/POST/PUT/DELETE /api/users → user service
- GET/POST/PUT/DELETE /api/inventory → inventory service

## Notes
- Auth middleware applied globally in api-gateway/app.ts
```
