# Half Full — Branding & Visual Identity Guide

This document defines the complete visual identity of the Half Full design language. It is intended for humans reviewing the design system and for AI agents needing a concise reference. The machine-executable token values live in `tokens.css`; the component-level rules live in `DESIGN.md`.

---

## Design Philosophy

This system prioritizes **function over form**. Every visual decision is justified by user experience, not aesthetics. When in doubt, ask: *does this make the interface clearer or faster to use?* If not, remove it.

The second priority is **clean, sleek, unified**. The interface should feel immediately recognizable — any new screen built with this system should be identifiable as belonging to the same family as the original app without explanation.

**The three rules:**
1. Clarity first — the user should never be confused about what is interactive, where they are, or what to do next
2. Restraint — fewer visual elements is always better; add only when it improves clarity
3. Consistency — every component uses the same tokens; there are no one-off values

---

## Color System

### Primary Palette (Dark Theme — default)

| Token | HSL Value | Approximate HEX | Role |
|---|---|---|---|
| `--foreground` | `hsl(0, 0%, 100%)` | `#FFFFFF` | Primary text, borders, icons |
| `--background` | `hsl(0, 0%, 15%)` | `#262626` | App/page background |
| `--alt-background` | `hsl(280, 50%, 30%)` | `#361852` | Secondary panels, notification backgrounds, alt-background cards |
| `--alt-foreground` | `hsl(280, 75%, 75%)` | `#C987F5` | Secondary text, separator lines, de-emphasized labels |
| `--accent` | `hsl(280, 75%, 50%)` | `#9B30F5` | All interactive elements: buttons, focus rings, active borders, checkboxes |
| `--alt-accent` | `hsl(280, 75%, 90%)` | `#E4C2FB` | Hover states, soft highlights on accent elements |
| `--alt-background-neutral` | `hsl(0, 0%, 30%)` | `#4D4D4D` | Input fields, secondary button backgrounds, tray surfaces |
| `--alt-foreground-neutral` | `hsl(0, 0%, 75%)` | `#BFBFBF` | Placeholder text, disabled text, metadata labels |

### Primary Palette (Light Theme)

| Token | HSL Value | Approximate HEX | Role |
|---|---|---|---|
| `--foreground` | `hsl(0, 0%, 0%)` | `#000000` | Primary text, borders |
| `--background` | `hsl(0, 0%, 95%)` | `#F2F2F2` | App/page background |
| `--alt-background` | `hsl(280, 35%, 75%)` | `#C9AADF` | Secondary panels |
| `--alt-foreground` | `hsl(280, 100%, 30%)` | `#6600CC` | Secondary text |
| `--accent` | `hsl(280, 100%, 35%)` | `#7700E0` | Interactive elements |
| `--alt-accent` | `hsl(280, 100%, 75%)` | `#BF66FF` | Hover states |
| `--alt-background-neutral` | `hsl(0, 0%, 75%)` | `#BFBFBF` | Input/button backgrounds |
| `--alt-foreground-neutral` | `hsl(0, 0%, 30%)` | `#4D4D4D` | Placeholder text |

### Alternate Palettes (Unused — for reference only)

These were explored during early development and are preserved as alternates. Do NOT use them in production unless intentionally adopting a different palette variant.

| Variant | Color | HEX | Notes |
|---|---|---|---|
| Cyan accent | Teal | `#8CD5DD` | Cool, lighter feeling — less authoritative |
| Mint accent | Mint green | `#CAE5D8` | Soft, earthy — less contrast |
| Blue-gray foreground | Dark blue-gray | `#40434F` | Light mode only |
| Sky blue accent | Sky | `#68B2FB` | Light mode only |
| Steel blue alt-accent | Steel | `#416AB2` | Light mode only |

### Color Usage Rules

**DO:**
- Use `--accent` for every interactive element: buttons, checked checkboxes, focus outlines, active borders, links
- Use `--foreground` for all body text and default borders
- Use `--alt-foreground-neutral` for placeholder, disabled, and de-emphasized text
- Use `--alt-background-neutral` for inputs, secondary buttons, and non-prominent surfaces
- Use `--alt-background` for floating panels (notifications, tooltip backgrounds, secondary cards)

**DON'T:**
- Hardcode any color value — all colors must reference a CSS variable
- Use more than two colors in a single component
- Apply `--accent` to non-interactive text or decorative elements
- Use `--alt-background` as a primary surface (it's a secondary/elevated color)
- Introduce new colors that aren't in this palette

---

## Typography

### Font Stack

```css
font-family: "Courier New", "JetBrains Mono", "Roboto Mono", "Source Code Pro", monospace;
```

This system is **monospace-only**. The monospace font is a core part of the identity — it signals precision, functionality, and a technical aesthetic. Never substitute sans-serif or serif fonts, even for display elements.

**Why monospace?** The app is a productivity tool. Monospace fonts align all characters to a fixed grid, making structured data (tasks, times, dates) easier to scan. It also creates a distinct, recognizable visual personality.

### Font Size Scale

| Variable | Value | Use Case |
|---|---|---|
| `--font-size-xs` | 12px | Badges, compact labels (start-trial button text) |
| `--font-size-sm` | 14px | Filter item text, dense secondary data |
| `--font-size-base` | 16px | Body text, button labels, inputs, task titles, settings labels |
| `--font-size-md` | 18px | Day headers, form labels, notification text |
| `--font-size-lg` | 20px | Modal titles |
| `--font-size-xl` | 24px | Modal subtitle paragraphs |
| `--font-size-2xl` | 25px | Navigation/header buttons, month bar |
| `--font-size-3xl` | 38px | Modal close button (×) |
| `--font-size-4xl` | 50px | App title (H1) |
| `--font-size-hero` | 80px | Splash screen only |

### Font Weights

| Weight | Value | Use Case |
|---|---|---|
| Normal | 400 | Form labels, button-container text, dropdown options |
| Semibold | 600 | Task titles, day headers, modal titles, settings tabs, card titles |
| Bold | 700 | Current date highlight, month-year datepicker, critical callouts |

### Typography Rules

- **Line height:** `1.2` globally (`--general-line-height`); `1` for task titles specifically (tight packing in task cards)
- **Letter spacing:** `0px` — no tracking adjustments
- **Text alignment:** Left-align by default. Center-align only for short labels inside contained components (e.g., tab buttons, pill badges)
- **No text-transform:** Avoid uppercase or lowercase forcing — the monospace font reads well at natural case
- **No decorative text effects:** No gradients on text, no text-shadow (except the notification bell icon trick with `text-shadow: 0 0 0 var(--foreground)`)

---

## Spacing

The spacing system uses a loose grid with these canonical values. Use these values — do not invent intermediate values.

```
2px  →  --space-1   (border adjustments, micro offsets)
4px  →  --space-2   (scrollbar, tiny gaps)
5px  →  --space-3   (label-input gap, task padding, inner padding)
6px  →  --space-4   (input vertical padding, task padding)
8px  →  --space-5   (notification padding, button padding, inner margins)
10px →  --space-6   (menu item padding, filter elements)
12px →  --space-7   (container padding-bottom, between-element gaps)
15px →  --space-8   (context menu, list padding)
16px →  --space-9   (horizontal button padding, gaps)
20px →  --space-10  (container horizontal padding, between-option margin)
24px →  --space-11  (modal padding — --modal-padding)
```

**Proximity rule:** spacing within a group must always be smaller than spacing between groups. Example: 5px between a label and its input, 20px between different settings options.

---

## Border Radius

| Value | Variable | Applied To |
|---|---|---|
| 6px | `--radius-sm` | Inputs, task cards, checkboxes, dropdowns, hide-pattern buttons |
| 8px | `--radius-md` | Action buttons (primary/secondary), start-trial |
| 10px | `--radius-lg` | Modals, floating cards, notifications, tooltips, description boxes |
| 100px | `--radius-pill` | Header/label-style tasks — fully pill-shaped |
| 50% | `--radius-full` | Circular elements (particles, radio indicators) |

**Rule:** Do not mix sharp and rounded corners within a single component. If a component uses `--radius-sm` for its inputs, its containing panel should use `--radius-lg` — not a matching `6px`.

---

## Borders

| Style | Used For |
|---|---|
| `1px solid var(--foreground)` | Default state: task cards, day columns, context menus, tray, tooltips |
| `2px solid var(--accent)` | Active/focused/accent state: days-of-week header, focus borders, pattern tray, accent week |
| `2px solid var(--foreground)` | Modal containers, repeating-task-div, pattern-div |
| `1px solid var(--alt-background)` | Dividers within menus and lists |
| `0px` (no border) | Inputs, buttons in their default (non-focus) state — background contrast carries the definition |

---

## Elevation & Shadows

Shadows are used **only** for elements that break the z-axis plane (floating above the document flow). Resting elements — cards, task items, table rows — never have box-shadows.

| Level | Shadow | Used For |
|---|---|---|
| Level 1 | `0 4px 10px rgba(0,0,0,0.2)` | Floating trays, pattern lists, dropdowns |
| Level 2 | `0 1.25em 1.25em -0.9375em rgba(0,0,0,0.3)` | Date pickers |
| Backdrop | `backdrop-filter: blur(2px)` | Modal overlays, login container |
| Heavy backdrop | `backdrop-filter: blur(5px)` | Subscription expiry overlay, import calendar overlay |

---

## Iconography

### Principles

Icons in this system are functional, not decorative. They should aid comprehension, not add visual flair.

### Stroke & Style

- **Stroke-based** (not filled) — use outline/stroke style for all icons
- **Stroke weight:** 1.5–2px for consistency with the border weights used throughout the UI
- **Corner radius:** Match the UI's `--radius-sm` (6px) — use slightly rounded corners on icon paths, not sharp vertices and not fully circular
- **No drop shadows** on icons — ever

### Color

```css
color: currentColor;
```

Icons inherit color from their parent element. This ensures they automatically adapt to hover states, dark/light themes, and accent states without additional CSS.

### Sizing

| Context | Size | Variable |
|---|---|---|
| Inline within text | 16×16px | `--checkbox-size` (matches checkboxes) |
| Navigation / button | 24×24px | — |
| Feature highlight | 32×32px | — |

All icons must be constrained to a square bounding box. Use `width` + `height` + `min-width` + `min-height` + `max-width` + `max-height` to lock the size (the existing `.task-checkbox` pattern demonstrates this).

### SVG Guidelines

- ViewBox should be `0 0 24 24` for nav icons, `0 0 16 16` for inline icons
- No hardcoded `fill` or `stroke` attributes — use `currentColor`
- No embedded `<style>` tags inside SVG
- Export as standalone `.svg` files, not as data URIs in CSS

---

## Prohibited Patterns

These patterns actively undermine the design language. Do not use them.

| Pattern | Why It's Prohibited |
|---|---|
| Gradient backgrounds | Adds decoration without function; conflicts with flat, matte surfaces |
| Box-shadow on resting elements | Creates false depth; depth is reserved for floating elements only |
| Sans-serif or serif fonts | Breaks the monospace identity |
| Hardcoded color values | Makes theming impossible; always use CSS variables |
| Mixed border-radius within one component | Creates visual inconsistency |
| Animations longer than 0.5s | Feels sluggish; this is a productivity app, not a portfolio site |
| More than one primary button per context | Confuses the user's action hierarchy |
| Full-width inputs in settings forms | Forces eyes to travel; max input width ~300–500px |
| Uppercase text-transform | Reduces readability in monospace |
| Decorative dividers or ornamental lines | Every line must serve a functional separation purpose |
