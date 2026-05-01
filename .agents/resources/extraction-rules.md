# Extraction Rules

These rules govern how the auto-memory-generator and frontend-memory-generator scan and extract information from a project.

---

## RULE 1: Architecture Detection

### Backend Architecture Signals
| Signal | Inferred Architecture |
| :--- | :--- |
| `/services/` + `/controllers/` + `/repositories/` | Clean Architecture |
| `/routes/` + `/models/` (flat) | MVC |
| `/src/[domain]/` nested modules | Domain-Driven |
| No discernible structure | Unstructured |

### Frontend Architecture Signals
| Signal | Inferred Pattern |
| :--- | :--- |
| `/pages/` + `/components/` + `/hooks/` + `/services/` | Modular React |
| `/screens/` + `/navigation/` | React Native / Mobile |
| `/views/` flat | Simple SPA |

---

## RULE 2: Module Detection

A module is identified when a directory contains ALL of the following:
- At least one main entity/model file
- At least one service or handler file
- At least one entry point (controller, route, or page)

### Backend Module Signals
- `*.controller.ts` / `*.handler.ts`
- `*.service.ts`
- `*.repository.ts`
- `*.entity.ts` / `*.model.ts`
- `*.dto.ts`

### Frontend Module Signals
- `*Page.tsx` / `*View.tsx`
- `use*.ts` (custom hook)
- `*.service.ts` / `*api.ts`
- `*.component.tsx` / `*Component.tsx`

---

## RULE 3: Protocol Detection

### gRPC Signals
- `/protos/*.proto` files exist
- `@grpc/grpc-js` in package.json dependencies
- `loadPackageDefinition` in service files

### REST/Express Signals
- `express` in package.json
- `/routes/` or `Router()` usage
- `.get()`, `.post()`, `.put()`, `.delete()` route definitions

### Database Signals
| Signal | Database |
| :--- | :--- |
| `better-sqlite3` / `sqlite3` in package.json | SQLite |
| `pg` / `typeorm` with postgres config | PostgreSQL |
| `mongoose` / `mongodb` | MongoDB |

---

## RULE 4: Merge Strategy

When updating any memory file:
1. **Read the existing file first**.
2. **Do not overwrite** existing module rows.
3. **Append new modules** to existing table.
4. **Mark stale entries** as `[outdated]` if module folder no longer exists.
5. **Update timestamps** in the Identity section.
6. **Preserve notes and assumptions** in the Notes section.

---

## RULE 5: Exclusion Rules

Skip the following during scans:
- `node_modules/`
- `dist/` or `build/` or `.next/`
- `*.test.ts` or `*.spec.ts`
- `*.d.ts` type declaration files
- Hidden directories (`.git/`, `.vscode/`)

---

## RULE 6: Confidence Levels

When an inferred value is uncertain, mark it with a confidence indicator:
- `[HIGH]` — Multiple strong signals confirm it.
- `[MEDIUM]` — One clear signal; no contradiction.
- `[LOW]` — Inferred from indirect evidence.
- `[UNKNOWN]` — Insufficient evidence; requires manual input.
