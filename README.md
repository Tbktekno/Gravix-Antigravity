# Antigravity Global Software Intelligence System

## Overview

This repository contains a structured intelligence system designed to be used by an AI coding agent (Antigravity) across any software project. The system gives the agent long-term memory, architecture awareness, domain knowledge, and the ability to generate consistent, production-ready fullstack modules regardless of project type.

The system is organized into two parts: skills and memory. Skills are instruction sets that tell the agent how to behave. Memory is a set of files that accumulate project-specific knowledge over time.

---

## What Problem This Solves

Without this system, an AI agent starts every session with no awareness of:

- What architecture the project uses
- What modules already exist
- What design tokens are in use
- What business rules apply to specific domains

This causes repeated mistakes, inconsistent code generation, and architectural drift over time.

This system solves that by giving the agent a persistent, structured knowledge base that it reads at the start of every task and updates at the end of every task.

---

## Folder Structure

```
.agents/
    skills/
        global-system-core/         Master orchestrator skill
        auto-memory-generator/      Scans and updates backend context
        frontend-memory-generator/  Scans and updates frontend context
        fullstack-module-generator/ Generates aligned backend and frontend modules
        ui-consistency-enforcer/    Audits and normalizes UI patterns
        design-system-memory/       Manages design tokens and component styles
        erp-domain/                 Domain rules for ERP systems
        saas-domain/                Domain rules for SaaS systems
        mobile-domain/              Domain rules for mobile applications

    memory/
        system-context.md           Global system type and active skill registry
        backend-context.md          Backend architecture, modules, and API contracts
        frontend-context.md         Frontend modules, hooks, services, and layout
        design-system.md            Design tokens and component baseline styles

    resources/
        memory-template.md          Template used by memory generators
        extraction-rules.md         Rules for detecting architecture and modules
        backend-template.md         Code template for a complete backend module
        frontend-template.md        Code template for a complete frontend module
```

---

## How It Works

### Skills

Each folder inside `.agents/skills/` contains a `SKILL.md` file. A skill is a detailed instruction document that tells the agent:

- When to activate itself
- What steps to execute
- What rules to follow
- What anti-patterns to avoid
- How it connects to other skills

The agent reads the relevant skill files before performing a task. This makes its behavior predictable, consistent, and architecture-aware.

### Memory

Each file inside `.agents/memory/` stores accumulated knowledge about the project. The agent reads these files at the start of every task and writes back to them after every task that adds or changes something significant.

Memory files are never blindly overwritten. The agent merges new information into the existing content.

### Resources

Files inside `.agents/resources/` are shared references used by multiple skills. The backend and frontend templates are production-ready code scaffolds. The extraction rules define exactly how the agent detects architecture patterns from file structure. The memory template defines the standard format for all memory files.

---

## How To Use

### Step 1 — Install the system into a project

Copy the entire `.agents/` folder into the root of any project:

```
your-project/
    .agents/
    src/
    package.json
    ...
```

### Step 2 — Update system-context.md

Open `.agents/memory/system-context.md` and fill in the known details about your project:

```markdown
- System Type: ERP
- Architecture: Clean Architecture (gRPC + Express)
- Frontend Framework: React + Vite
- Database: SQLite
```

If you do not know all the details yet, leave the fields as `[UNKNOWN]`. The agent will detect and fill them in during the first scan.

### Step 3 — Tell the agent to use the system

At the start of any task, instruct the agent with one of the following:

```
Read .agents/memory/system-context.md and proceed with the task.
```

```
Use the global-system-core skill to plan and execute this task.
```

```
Generate a new [module name] module using the fullstack-module-generator skill.
```

The agent will load the relevant memory files and skill instructions before doing anything else.

### Step 4 — Add a new fullstack module

To generate a complete new module (backend + frontend), use:

```
Generate a new [module] module. Backend uses gRPC + Clean Architecture. Frontend uses React + tab-based UI.
```

The agent will:

1. Read system, backend, and frontend context.
2. Generate all backend files: controller, service, repository, entity, dto, proto, gateway route.
3. Generate all frontend files: page, table, modal, hook, service.
4. Register the module in the gateway and router.
5. Update all memory files.

### Step 5 — Scan an existing project

If you are adding this system to an already-existing project, instruct the agent to scan:

```
Use auto-memory-generator to scan the backend and update backend-context.md.
Use frontend-memory-generator to scan the frontend and update frontend-context.md.
```

The agent will detect the architecture, list all existing modules, and populate the memory files.

### Step 6 — Enforce UI consistency

After adding several modules, run an audit:

```
Use ui-consistency-enforcer to audit the frontend and report any inconsistencies.
```

The agent will compare all existing pages against the majority pattern and flag or fix deviations.

---

## Supported System Types

### ERP

Enterprise Resource Planning systems with domains such as HR, Payroll, Inventory, Finance, Procurement, and Sales.

Key features:
- Tab-based UI within each domain
- Strong relational data with status flow enforcement
- Business rule validation in service layer

### SaaS

Software-as-a-Service systems with multi-tenancy, authentication, subscriptions, and billing.

Key features:
- Row-level tenant isolation on every query
- JWT with refresh token rotation
- Subscription plan enforcement at route level

### Mobile

Mobile applications built with React Native.

Key features:
- Screen-based navigation with Stack and Tab navigators
- Centralized Axios API client with token interceptors
- React Query for server state management
- SecureStore for sensitive data

---

## Design System

The file `.agents/memory/design-system.md` contains the full set of design tokens used across the frontend:

- Color tokens (primary, secondary, neutrals, status colors)
- Typography tokens (font family, sizes, weights, line heights)
- Spacing tokens (4px base grid)
- Border and shape tokens (radius, shadow)
- Animation tokens (transition speeds)
- Component baseline styles (button, card, input, table)

All generated frontend code references these tokens using CSS custom properties. Raw hex values, pixel spacing, and font sizes are not allowed in component styles.

---

## Updating the System

### Adding a new design token

Open `.agents/memory/design-system.md` and add the new token to the appropriate section following the naming convention:

```
--color-[name], --font-size-[scale], --space-[number], --radius-[scale]
```

### Adding a new shared component pattern

Add a new entry under the "Component Baseline Styles" section in `design-system.md` following the format defined in `design-system-memory/SKILL.md`.

### Adding a new domain

Create a new skill folder:

```
.agents/skills/[domain-name]/SKILL.md
```

Follow the structure of existing domain skills (erp-domain, saas-domain, mobile-domain). Define the domain modules, business rules, and any special patterns needed. Register the new domain in `global-system-core/SKILL.md` under the detection and activation logic.

### Extending a template

Edit the relevant file in `.agents/resources/`:

- `backend-template.md` for backend scaffolding changes
- `frontend-template.md` for frontend scaffolding changes

Changes to templates apply to all future module generation.

---

## Rules the Agent Follows

The following are the core behavioral rules enforced by this system. These are non-negotiable.

1. Always read memory files before starting any task.
2. Always update memory files after completing any task that adds or modifies a module.
3. Never overwrite existing memory entries. Merge and append only.
4. Never use raw hex, pixel, or font-size values in frontend styles. Use CSS variable tokens.
5. Never place business logic in controllers. Controllers only route calls to services.
6. Never allow cross-tenant data access in SaaS systems.
7. Never allow stock to go negative in inventory systems.
8. Always use the templates in `.agents/resources/` as the starting point for new modules.
9. Always validate naming conflicts before creating new files.
10. Always register new modules in all required places (gateway, router, proto service).

---

## Skills Reference

| Skill | File | Responsibility |
| :--- | :--- | :--- |
| global-system-core | skills/global-system-core/SKILL.md | Orchestrates all other skills |
| auto-memory-generator | skills/auto-memory-generator/SKILL.md | Scans and updates backend context |
| frontend-memory-generator | skills/frontend-memory-generator/SKILL.md | Scans and updates frontend context |
| fullstack-module-generator | skills/fullstack-module-generator/SKILL.md | Generates complete modules |
| ui-consistency-enforcer | skills/ui-consistency-enforcer/SKILL.md | Audits and normalizes UI |
| design-system-memory | skills/design-system-memory/SKILL.md | Manages design tokens |
| erp-domain | skills/erp-domain/SKILL.md | ERP business rules |
| saas-domain | skills/saas-domain/SKILL.md | SaaS patterns and tenant rules |
| mobile-domain | skills/mobile-domain/SKILL.md | Mobile screen and API patterns |

---

## Memory Files Reference

| File | Purpose | Updated By |
| :--- | :--- | :--- |
| system-context.md | System type, architecture, active skills | global-system-core |
| backend-context.md | Modules, protocols, database, routes | auto-memory-generator |
| frontend-context.md | Pages, hooks, services, layout | frontend-memory-generator |
| design-system.md | Tokens, component styles | design-system-memory |
