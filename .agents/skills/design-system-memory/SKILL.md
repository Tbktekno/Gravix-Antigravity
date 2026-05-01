# SKILL: Design System Memory

## Purpose
Maintains the single source of truth for all visual design decisions.
Ensures every frontend component uses consistent tokens for color, typography, spacing,
borders, and animation. Prevents random or duplicated styling from entering the codebase.

---

## When To Use
- At the start of any frontend task.
- Before generating any new UI component.
- When a design token change is requested.
- When `ui-consistency-enforcer` finds raw values.
- When adding a new component pattern to the shared library.

---

## Resources
- Token definitions: `.agents/memory/design-system.md`

---

## Execution Steps

### Step 1 — Load Design System
1. Always read `.agents/memory/design-system.md` in full before any frontend work.
2. Internalize all defined tokens before generating CSS or styled components.

### Step 2 — Apply Tokens
When generating styles:
- Use `var(--token-name)` syntax for all CSS values.
- Never write a raw hex color, pixel spacing, or font-size without first checking if a token exists.

Token lookup order:
1. Is there a direct token? → Use it.
2. Is there a close token? → Use the closest one, note deviation.
3. No token fits? → Request a new token be added to `design-system.md`.

### Step 3 — Register New Tokens (If Needed)
If a new design decision is made that is not in `design-system.md`:
1. Define the new token with a name following the existing naming convention.
2. Add it to the correct section (color / typography / spacing / shape).
3. Document its intended use.
4. Update `.agents/memory/design-system.md`.

### Step 4 — Register New Component Patterns (If Needed)
When a new shared component pattern is finalized:
1. Add it to the `Component Baseline Styles` section of `design-system.md`.
2. Define: background, border, padding, radius, hover state.
3. Document any variants.

### Step 5 — Enforce Token Usage
When reviewing generated code:
1. Scan for any inline `color:`, `background:`, `font-size:`, `padding:`, `margin:` values.
2. Flag any value not using a CSS variable.
3. Replace with the correct token or log as a new token request.

---

## Rules

1. **Tokens first, always** — No raw values in production CSS.
2. **Design system is the authority** — Do not invent one-off styles for a single component.
3. **Naming convention** — All tokens follow `--[category]-[scale/variant]` pattern.
4. **Update on change** — Any approved design change must be reflected in `design-system.md` immediately.
5. **Consistency over creativity** — Prefer using an existing token over introducing a new one.

---

## Token Naming Conventions

| Category | Pattern | Example |
| :--- | :--- | :--- |
| Color | `--color-[name]` | `--color-primary`, `--color-danger` |
| Font size | `--font-size-[scale]` | `--font-size-sm`, `--font-size-2xl` |
| Font weight | `--font-weight-[name]` | `--font-weight-bold` |
| Spacing | `--space-[number]` | `--space-4`, `--space-8` |
| Border radius | `--radius-[scale]` | `--radius-base`, `--radius-lg` |
| Shadow | `--shadow-[scale]` | `--shadow-sm`, `--shadow-base` |
| Transition | `--transition-[speed]` | `--transition-fast`, `--transition-base` |

---

## Anti-Patterns

- ❌ Writing `color: #4F6EF7` instead of `color: var(--color-primary)`.
- ❌ Writing `padding: 16px` instead of `padding: var(--space-4)`.
- ❌ Inventing a new shade like `#3A4BC1` for a hover state without adding a token.
- ❌ Using inline `style={{}}` props in React components for colors or spacing.
- ❌ Ignoring the design system for "quick" fixes.

---

## Component Pattern Registration Format

```markdown
### [Component Name]
- Background: `var(--color-[name])`
- Border: `1px solid var(--color-border)` (or none)
- Radius: `var(--radius-[scale])`
- Padding: `var(--space-[n]) var(--space-[n])`
- Text color: `var(--color-text)`
- Hover: [description of hover state using tokens]
- Variants: [list if applicable]
```

---

## Interconnections

| This Skill → | When |
| :--- | :--- |
| `ui-consistency-enforcer` | Provides token definitions for auditing |
| `fullstack-module-generator` | Provides styling rules for generated components |
| `frontend-memory-generator` | Provides design linkage metadata |
