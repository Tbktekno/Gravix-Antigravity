# Design System Memory

## Color Tokens
```css
--color-primary:        #4F6EF7;  /* Primary brand blue */
--color-primary-dark:  #3751D0;
--color-primary-light: #7B9BFF;
--color-secondary:     #7C3AED;  /* Accent purple */
--color-success:       #10B981;
--color-warning:       #F59E0B;
--color-danger:        #EF4444;
--color-info:          #3B82F6;

/* Neutrals */
--color-bg:            #0F1117;
--color-bg-surface:    #1A1D27;
--color-bg-card:       #20243A;
--color-border:        #2E3250;
--color-text:          #F1F5F9;
--color-text-muted:    #94A3B8;
--color-text-subtle:   #64748B;
```

## Typography Tokens
```css
--font-family-base:    'Inter', 'Roboto', system-ui, sans-serif;
--font-size-xs:        0.75rem;   /* 12px */
--font-size-sm:        0.875rem;  /* 14px */
--font-size-base:      1rem;      /* 16px */
--font-size-lg:        1.125rem;  /* 18px */
--font-size-xl:        1.25rem;   /* 20px */
--font-size-2xl:       1.5rem;    /* 24px */
--font-size-3xl:       1.875rem;  /* 30px */
--font-weight-normal:  400;
--font-weight-medium:  500;
--font-weight-semibold:600;
--font-weight-bold:    700;
--line-height-tight:   1.25;
--line-height-base:    1.6;
```

## Spacing Tokens
```css
--space-1:   0.25rem;  /* 4px */
--space-2:   0.5rem;   /* 8px */
--space-3:   0.75rem;  /* 12px */
--space-4:   1rem;     /* 16px */
--space-5:   1.25rem;  /* 20px */
--space-6:   1.5rem;   /* 24px */
--space-8:   2rem;     /* 32px */
--space-10:  2.5rem;   /* 40px */
--space-12:  3rem;     /* 48px */
--space-16:  4rem;     /* 64px */
```

## Border & Shape Tokens
```css
--radius-sm:   4px;
--radius-base:  8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-full: 9999px;
--shadow-sm:   0 1px 3px rgba(0,0,0,0.4);
--shadow-base: 0 4px 12px rgba(0,0,0,0.5);
--shadow-lg:   0 8px 32px rgba(0,0,0,0.6);
```

## Component Baseline Styles

### Button
| Variant | Background | Text | Border | Hover |
| :--- | :--- | :--- | :--- | :--- |
| Primary | `--color-primary` | white | none | `--color-primary-dark` |
| Secondary | transparent | `--color-primary` | `--color-primary` | alpha bg |
| Danger | `--color-danger` | white | none | darken 10% |
| Ghost | transparent | `--color-text-muted` | none | surface bg |

### Card
- Background: `--color-bg-card`
- Border: 1px solid `--color-border`
- Radius: `--radius-lg`
- Padding: `--space-6`
- Box-shadow: `--shadow-base`

### Input
- Background: `--color-bg-surface`
- Border: 1px solid `--color-border`
- Radius: `--radius-base`
- Padding: `--space-3` `--space-4`
- Focus border: `--color-primary`
- Height: 42px standard

### Table
- Header bg: `--color-bg-surface`
- Row hover: alpha overlay `--color-primary` 8%
- Border: 1px solid `--color-border`

## Animation Baseline
```css
--transition-fast:   150ms ease;
--transition-base:   250ms ease;
--transition-slow:   400ms ease;
```

## Usage Rules
- NEVER use raw hex values in component CSS — always reference tokens.
- ALWAYS use `--font-family-base` for all text.
- Spacing must use token multiples only.
- Card components MUST use `--color-bg-card` not `--color-bg-surface`.
