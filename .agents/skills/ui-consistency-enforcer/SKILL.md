# SKILL: UI Consistency Enforcer

## Purpose
Audits the frontend codebase for inconsistent UI patterns and refactors them to match
the established majority pattern. Ensures every component aligns with the design system.

---

## When To Use
- After generating a new frontend module.
- When the user reports that a new page "looks different" from the rest.
- When doing a UI review pass.
- Periodically during large frontend refactors.
- Before any major release or demo.

---

## Resources
- Design tokens: `.agents/memory/design-system.md`
- Frontend patterns: `.agents/memory/frontend-context.md`

---

## Execution Steps

### Step 1 — Load Design System and Frontend Context
1. Read `.agents/memory/design-system.md` fully.
2. Read `.agents/memory/frontend-context.md` to understand existing structure.

### Step 2 — Define the "Majority Pattern"
Before flagging anything as inconsistent, determine the majority pattern by:
1. Scanning the 3 largest or most complete existing modules.
2. Identifying repeated patterns in:
   - Layout: how page containers are structured.
   - Table: how data tables are rendered.
   - Modals: how dialogs are opened and closed.
   - Buttons: primary / secondary / danger styling classes.
   - Forms: form-group, label, input structure.
   - Status badges: how status is displayed.

### Step 3 — Audit Each Module
For each module in the Module Registry, check:

| Check | Pass Condition |
| :--- | :--- |
| Container class | Uses `.page-container` (or established equivalent) |
| Page header | Uses `.page-header` with `.page-title` h1 |
| Primary action button | Uses `.btn .btn-primary` |
| Table wrapper | Uses `.table-wrapper` > `.data-table` |
| Modal structure | Uses `.modal-overlay` > `.modal-container` |
| Form structure | Uses `.form-group` > `label` + `.form-input` |
| Spacing | Uses CSS token variables, not hardcoded px |
| Colors | Uses CSS variable tokens, not raw hex values |
| Font size | Uses `--font-size-*` tokens |

### Step 4 — Report Inconsistencies
For each inconsistency found, produce a report entry:

```
## Inconsistency Found: [Module/File]
- Issue: [description]
- Current: [what was found]
- Expected: [what it should be]
- Severity: [low | medium | high]
- Action: [refactor | warn | ignore]
```

### Step 5 — Refactor (if instructed)
Refactor inconsistent code to match the majority pattern:
1. Update class names to match design system.
2. Replace hardcoded colors/spacing with CSS variables.
3. Normalize component structure (header → table → modal pattern).
4. Do NOT change business logic — only UI structure.

### Step 6 — Verify
After refactoring:
1. Confirm no logic was altered.
2. Confirm all class names use design system tokens.
3. Confirm all modals/tables/buttons match the majority pattern.

---

## Rules

1. **Determine majority before flagging** — Do not impose your own preference; respect what already dominates the codebase.
2. **Only refactor UI structure** — Never alter data fetching, state logic, or API calls.
3. **Preserve all functionality** — No regressions from consistency fixes.
4. **Token-only styling** — Flag any raw hex, pixel, or font-size value that isn't a token reference.
5. **One severity level per issue** — Be precise about what needs urgent fixing vs. low-priority cleanup.

---

## Severity Levels

| Level | Definition |
| :--- | :--- |
| High | Completely different layout structure or missing required wrapper |
| Medium | Wrong class name, font, or spacing that creates visual difference |
| Low | Minor deviation that doesn't visually affect the page significantly |

---

## Anti-Patterns

- ❌ Changing business logic while "fixing" UI consistency.
- ❌ Imposing a new design pattern not already present in the codebase.
- ❌ Refactoring without first scanning the majority pattern.
- ❌ Leaving hardcoded colors in a component after audit.
- ❌ Flagging third-party component internals as inconsistent.

---

## Interconnections

| This Skill → | When |
| :--- | :--- |
| `design-system-memory` | To read token definitions |
| `frontend-memory-generator` | After refactoring — update frontend context |
