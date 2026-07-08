---
# Half Full Design System — Machine-Readable Token Spec
# Conforms to W3C Design Tokens Community Group format
# AI agents: read this file before generating any UI

tokens:
  color:
    foreground:
      dark:  "hsl(0, 0%, 100%)"
      light: "hsl(0, 0%, 0%)"
      type: color
      role: "Primary text, borders, icons"
    background:
      dark:  "hsl(0, 0%, 15%)"
      light: "hsl(0, 0%, 95%)"
      type: color
      role: "Page/app background"
    alt-background:
      dark:  "hsl(280, 50%, 30%)"
      light: "hsl(280, 35%, 75%)"
      type: color
      role: "Secondary panels, notification backgrounds"
    alt-foreground:
      dark:  "hsl(280, 75%, 75%)"
      light: "hsl(280, 100%, 30%)"
      type: color
      role: "Secondary text, separator lines"
    accent:
      dark:  "hsl(280, 75%, 50%)"
      light: "hsl(280, 100%, 35%)"
      type: color
      role: "ALL interactive elements: buttons, focus rings, active borders, checked states"
    alt-accent:
      dark:  "hsl(280, 75%, 90%)"
      light: "hsl(280, 100%, 75%)"
      type: color
      role: "Hover states on accent-colored elements"
    alt-background-neutral:
      dark:  "hsl(0, 0%, 30%)"
      light: "hsl(0, 0%, 75%)"
      type: color
      role: "Input fields, secondary button backgrounds, neutral surfaces"
    alt-foreground-neutral:
      dark:  "hsl(0, 0%, 75%)"
      light: "hsl(0, 0%, 30%)"
      type: color
      role: "Placeholder text, disabled text, de-emphasized labels"

  typography:
    font-family:
      value: '"Courier New", "JetBrains Mono", "Roboto Mono", "Source Code Pro", monospace'
      type: fontFamily
    font-size-base:
      value: "16px"
      type: fontSize
    font-weight-normal:
      value: 400
      type: fontWeight
    font-weight-semibold:
      value: 600
      type: fontWeight
    font-weight-bold:
      value: 700
      type: fontWeight
    line-height-base:
      value: 1.2
      type: lineHeight
    line-height-tight:
      value: 1
      type: lineHeight
    letter-spacing:
      value: "0px"
      type: letterSpacing

  spacing:
    space-1:  "2px"
    space-2:  "4px"
    space-3:  "5px"
    space-4:  "6px"
    space-5:  "8px"
    space-6:  "10px"
    space-7:  "12px"
    space-8:  "15px"
    space-9:  "16px"
    space-10: "20px"
    space-11: "24px"

  borderRadius:
    sm:   "6px"
    md:   "8px"
    lg:   "10px"
    pill: "100px"
    full: "50%"

  shadow:
    float:  "0 4px 10px rgba(0, 0, 0, 0.2)"
    picker: "0 1.25em 1.25em -0.9375em rgba(0, 0, 0, 0.3)"

  zIndex:
    base:         1
    particles:    5
    sticky:       10
    tray:         50
    modal:        100
    tooltipDesc:  200
    notification: 300
    upsell:       500

  transition:
    fast:   "0.15s ease"
    base:   "0.25s ease"
    slow:   "0.3s ease-in-out"

  modal:
    border-radius: "10px"
    padding:       "24px"
    border-width:  "2px"

  checkbox:
    size: "16px"
---

# Half Full Design System

> **For AI agents:** Before generating any UI, read this document completely. Every visual decision must reference a token defined in the YAML above or `tokens.css`. Do not invent values.

---

## 1. Core Philosophy

This design language prioritizes **user experience above all else**, followed by clean, sleek, functional aesthetics. The system is intentionally restrained:

- Every visual element must have a functional purpose
- Fewer elements is always better
- Consistency is more important than creativity on a per-screen basis
- The interface must be immediately recognizable as belonging to this design family

---

## 2. Color System

Eight semantic CSS variables handle all color. They adapt automatically to dark/light themes. You must never use hardcoded hex, rgb, or hsl values in component code — only these variables.

| Variable | Role |
|---|---|
| `--foreground` | Primary text, default borders, icons |
| `--background` | App background |
| `--alt-background` | Secondary surfaces (notifications, panels, elevated cards) |
| `--alt-foreground` | Secondary text, separator lines, de-emphasized content |
| `--accent` | Every interactive element — buttons, focus, checkboxes, active states |
| `--alt-accent` | Hover states on accent-colored interactive elements |
| `--alt-background-neutral` | Neutral surfaces — inputs, secondary buttons, non-prominent containers |
| `--alt-foreground-neutral` | Placeholder, disabled, and tertiary text |

**Accent color is the single source of interactivity signal.** A user can identify anything clickable because it either uses `--accent` or transitions to `--accent` on interaction.

---

## 3. Typography

Font family: **monospace only.**

```css
font-family: "Courier New", "JetBrains Mono", "Roboto Mono", "Source Code Pro", monospace;
```

This is non-negotiable. The monospace identity is what makes the interface feel like a precision tool.

### Font Size Scale

| Size | Use Case |
|---|---|
| 12px | Compact badges, start-trial label |
| 14px | Dense secondary data, filter items |
| **16px** | **Default — body, buttons, inputs, task titles** |
| 18px | Day headers, form labels, notification text |
| 20px | Modal titles |
| 24px | Modal subtitle paragraphs |
| 25px | Header navigation buttons, month bars |
| 38px | Modal close button (×) |
| 50px | App title (H1) |
| 80px | Splash screen only |

### Font Weight

- **400** — form labels, dropdown text, general body
- **600** — task titles, day headers, modal titles, tab buttons, card titles, semibold emphasis
- **700** — current-date highlights, critical callouts, datepicker month/year

### Rules

- Line height: `1.2` globally; `1` for task title inputs (tight packing)
- Letter spacing: `0px` always
- Text alignment: left by default; center only in contained pill/tab components
- No text-transform, no decorative text effects

---

## 4. Spacing

Use only these canonical values. Do not introduce intermediate values.

```
2px   micro offsets, border adjustments
5px   label-to-input gap, task inner padding
6px   input vertical padding, small inner padding
8px   button padding, notification padding
10px  menu item padding, small element margins
12px  section bottom padding
15px  context menu margins, list padding
16px  button horizontal padding, component gaps
20px  container horizontal padding, between-option spacing
24px  modal padding (--modal-padding)
```

**Proximity principle:** spacing within a group < spacing between groups. A label is 5px from its input; that input group is 20px from the next group.

---

## 5. Border Radius

| Value | Applied To |
|---|---|
| 6px | Inputs, task cards, checkboxes, dropdowns |
| 8px | Action buttons (primary/secondary) |
| 10px | Modals, floating cards, notifications, tooltips, description boxes |
| 100px | Pill-style tasks (header tasks, label badges) |
| 50% | Circular elements (radio buttons, particle effects) |

Do not mix sharp and rounded on a single component. A component's inner elements should use a smaller radius than the outer container.

---

## 6. Borders

| Style | When to Use |
|---|---|
| `1px solid var(--foreground)` | Default resting state: task cards, day columns, menus, containers |
| `2px solid var(--accent)` | Active/focus/accent: focused days, pattern tray border, week highlight |
| `2px solid var(--foreground)` | Modal containers, section-level cards |
| `1px solid var(--alt-background)` | Internal dividers within menus and lists |
| No border | Inputs and buttons use background contrast instead |

---

## 7. Elevation & Shadows

Shadow indicates that an element **floats above the document plane**. Do not apply shadows to resting-state elements.

| Elevation | Shadow | Used For |
|---|---|---|
| Floating | `0 4px 10px rgba(0,0,0,0.2)` | Dropdown trays, pattern lists |
| Picker | `0 1.25em 1.25em -0.9375em rgba(0,0,0,0.3)` | Date picker |
| Overlay backdrop | `backdrop-filter: blur(2px)` | Modal overlays, login container |
| Heavy backdrop | `backdrop-filter: blur(5px)` | Full-screen overlays (subscription, import) |

---

## 8. Animations

Every interactive element must have these two micro-animations. No exceptions.

```css
/* On :hover */
animation: pulsate 0.25s ease both;

/* On :active */
animation: click-press 0.25s ease both;
```

These animations are defined in `tokens.css`. They reinforce that the element is interactive and responsive.

Additional animations:
- **slideIn** (`0.3s ease-out`) — modal entrance from above
- **hide/show** (`0.5s linear`) — element visibility toggle with height animation
- No animation should exceed `0.5s` total duration

For border/color transitions: `transition: border 0.25s` or `transition: opacity 0.3s ease-in-out`.

---

## 9. Z-Index Scale

| Value | Layer |
|---|---|
| 1 | Base overlays (datepicker layer) |
| 5 | Particle effects |
| 10 | Sticky headers, fixed elements |
| 50 | Side trays |
| 100 | Modals, context menus |
| 200 | Tooltip descriptions |
| 300 | Notification banners |
| 500 | Full-screen upsell overlays |

---

## 10. Component Blueprints

### 10.1 Buttons

Three tiers. Only one primary button per context area.

**Primary button** — the single most important action:
```css
background-color: var(--accent);
border-radius: 8px;          /* --radius-md */
padding: 8px;                 /* --space-5 */
font-size: 12px;              /* --font-size-xs */
font-weight: 600;
color: var(--background);     /* inverted — bg color on accent surface */
border: 0;
cursor: pointer;
```
```css
:hover  { animation: pulsate 0.25s ease both; }
:active { animation: click-press 0.25s ease both; }
```

**Secondary button** — alternative action:
```css
background-color: var(--alt-background-neutral);
border-radius: 8px;           /* --radius-md */
padding: 6px 16px;            /* --space-4 / --space-9 */
font-size: 16px;              /* --font-size-base */
font-weight: 400;
color: var(--foreground);
border: 2px solid transparent;
outline-color: var(--accent);
cursor: pointer;
```

**Tertiary button / nav link** — low-priority action:
```css
background: none;
border: none;
font-size: 25px;              /* --font-size-2xl */
color: var(--foreground);
cursor: pointer;
/* No background, no border — text only */
```
```css
:hover { font-weight: bold; animation: pulsate 0.25s ease both; }
```

---

### 10.2 Text Inputs

```css
background-color: var(--alt-background-neutral);
color: var(--foreground);
border: 0;
padding: 6px 12px;            /* --space-4 / --space-7 */
border-radius: 6px;           /* --radius-sm */
font-size: 16px;              /* --font-size-base */
line-height: var(--general-line-height);
```
```css
::placeholder { color: var(--alt-foreground-neutral); }
:focus-visible { outline: 2px solid var(--accent); }
```

Max width in settings/forms: 300–500px. Full-width inputs are prohibited in structured forms.

---

### 10.3 Dropdowns / Selects

Identical base to text inputs:
```css
background: var(--alt-background-neutral);
padding: 6px 12px;
color: var(--foreground);
border-radius: 6px;           /* --radius-sm */
border-width: 0;
font-size: 16px;
display: inline-flex;
```
```css
option { color: var(--foreground); }
:hover { animation: pulsate 0.25s ease both; }
```

---

### 10.4 Label + Input (label-container pattern)

Labels are placed visually above inputs using `flex-direction: column-reverse`. The label comes after the input in the DOM (for `:has()` CSS targeting) but appears above visually.

```html
<div class="label-container">
  <input class="text-input" type="text" placeholder="Value" />
  <p>Label text</p>
</div>
```
```css
.label-container {
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  gap: 5px;                   /* --space-3 */
}
.label-container p {
  color: var(--alt-foreground-neutral);
  font-size: 18px;            /* --font-size-md */
  font-weight: 400;
  margin: 0;
}
```

---

### 10.5 Checkboxes

There are two checkbox variants with different visual styles and use cases.

**Task checkboxes** (in the main calendar grid — solid block, no label):
```css
.task-checkbox {
  width: 16px; height: 16px;  /* --checkbox-size */
  min-width: 16px; max-width: 16px;
  min-height: 16px; max-height: 16px;
  border-radius: 6px;         /* --radius-sm */
  cursor: pointer;
}
.task-checkbox-unchecked { background-color: var(--foreground); }
.task-checkbox-unchecked:hover { background-color: var(--alt-accent); animation: pulsate 0.15s ease both; }
.task-checkbox-checked { background-color: var(--accent); }
.task-checkbox-checked:hover { animation: pulsate 0.15s ease both; }
```

**Settings / button-style checkboxes** (in modals, settings — with text label inside):
```css
/* Container: the clickable area with label text inside */
.checkbox {
  display: inline-flex;
  min-width: 12px; min-height: 12px;
  border-radius: 6px;
  padding: 4px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
/* State colors — applied via JavaScript */
/* Unchecked: */ background-color: var(--alt-background); /* label color: var(--foreground) */
/* Checked:   */ background-color: var(--alt-foreground); /* label color: var(--background) */
```

Key difference: task checkboxes use `--foreground`/`--accent`; settings checkboxes use `--alt-background`/`--alt-foreground`. The settings variant shows its label as text inside the block.

### 10.5a Radio Button Groups (Segmented Control)

Radio buttons are **NOT** circles with labels. They are a horizontal row of button-style checkboxes — a segmented control pattern.

```html
<div class="radio-buttons" role="radiogroup">
  <div class="radio-option" role="radio">Never</div>
  <div class="radio-option radio-option-selected" role="radio">Daily</div>
  <div class="radio-option" role="radio">Weekly</div>
</div>
```

```css
.radio-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;                  /* --space-6 */
}
.radio-option {
  display: inline-flex;
  border-radius: 6px;         /* --radius-sm */
  padding: 4px 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
}
/* Unselected */ .radio-option            { background-color: var(--alt-background); color: var(--foreground); }
/* Selected   */ .radio-option-selected   { background-color: var(--alt-foreground); color: var(--background); }
```

This matches the `createRadioButtons()` function which builds checkboxes arranged in `.radio-buttons { flex-direction: row; gap: 10px }`. Arrow keys navigate between options; clicking toggles selection.

---

### 10.6 Modals

**Overlay:**
```css
.modal-body {
  position: fixed;
  z-index: 100;               /* --z-modal */
  left: 0; top: 0;
  width: 100%; height: 100%;
  backdrop-filter: blur(2px); /* --backdrop-blur */
}
```

**Content container:**
```css
.modal-content {
  background-color: var(--background);
  margin: 10vh auto;
  padding: 24px;              /* --modal-padding */
  border: 2px solid var(--foreground); /* --border-modal */
  border-radius: 10px;        /* --modal-border-radius */
  display: flex;
  flex-direction: column;
  width: fit-content;
  max-height: 80vh;
  overflow: auto;
}
```

**Title row:**
```css
.modal-title {
  font-weight: 600;
  font-size: 20px;            /* --font-size-lg */
  display: flex;
  justify-content: space-between;
  margin: 0;
}
```

**Close button:**
```css
.modal-close {
  font-size: 38px;            /* --font-size-3xl */
  font-weight: 600;
  cursor: pointer;
  margin-left: auto;
  line-height: 1;
}
.modal-close:hover { animation: pulsate 0.25s ease both; }
.modal-close:active { animation: click-press 0.25s ease both; }
```

Modals use `slideIn` animation on entrance:
```css
animation: slideIn 0.3s ease-out;
```

---

### 10.7 Settings Pages

A settings page has three layers: tab navigation, content area, and option rows.

**Tab navigation:**
```css
.settings-tab-buttons {
  display: flex;
  justify-content: space-around;
}
.settings-tab-button {
  border-radius: 5px;
  font-size: 18px;            /* --font-size-md */
  font-weight: 600;
  padding: 5px;
  width: 115px;
  text-align: center;
  background: transparent;
  color: var(--alt-foreground);
  opacity: 0.8;
  cursor: pointer;
}
.settings-tab-button.active {
  background-color: var(--alt-background-neutral);
  color: var(--foreground);
  opacity: 1;
}
```

**Option row:**
```css
.settings-option {
  margin: 20px;               /* --space-10 */
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  white-space: nowrap;
}
.settings-option p {
  margin: 0 0 0 10px;         /* left margin only */
  font-size: 16px;
}
```

**Input within settings:**
```css
.settings-input {
  font-size: 18px;
  background-color: var(--alt-background-neutral);
  border: 0;
  border-radius: 5px;
  padding: 5px;
  width: 50px;                /* constrained — not full-width */
  outline-color: var(--accent);
}
```

**Version number** — every settings page must display the app version number. Place it at the bottom of the settings panel, visually de-emphasized:
```html
<p class="settings-version">v1.0.0</p>
```
```css
.settings-version {
  font-size: 12px;
  color: var(--alt-foreground-neutral);
  text-align: center;
  margin-top: auto;
  padding-top: 16px;
}
```

---

### 10.8 Context Menus

```css
.context-menu {
  position: absolute;
  padding: 2px 5px;
  border-radius: 10px;        /* --radius-lg */
  background-color: var(--background);
  border: 1px solid var(--foreground);
  z-index: 100;               /* --z-modal */
}
.menu-item {
  padding: 5px 10px;
  color: var(--foreground);
  border-bottom: 1px solid var(--alt-background);
}
.menu-item:last-child { border-bottom: none; }
.menu-item:hover { font-weight: bold; }
.menu-item:active { animation: click-press 0.25s ease both; }
```

---

### 10.9 Notifications / Toasts

```css
.notification {
  position: absolute;
  z-index: 300;               /* --z-notification */
  top: 20px;
  right: 50%;
  transform: translate(50%, 0);
  background-color: var(--alt-background);
  padding: 8px 16px;          /* --space-5 / --space-9 */
  border-radius: 10px;        /* --radius-lg */
  max-width: 30vw;
  pointer-events: none;
  transition: opacity 1s;
}
.notification p { font-size: 18px; margin: 5px; }
.notification.hide { opacity: 0; }
```

---

### 10.10 Tooltips

```css
.tooltip {
  position: relative;
  border-radius: 25px;        /* circular */
  width: 25px; height: 25px;
  border: 1px solid var(--foreground);
  text-align: center;
}
.tooltip::after {
  content: attr(data-tip);
  position: absolute;
  background-color: var(--alt-background-neutral);
  border-radius: 10px;        /* --radius-lg */
  padding: 5px 10px;
  font-size: 16px;
  top: 15px; left: 30px;
  width: max-content;
  z-index: 100;
  opacity: 0;
  display: none;
  transition: opacity 0.3s ease-in-out;
}
.tooltip:hover::after {
  opacity: 1;
  display: block;
}
```

---

### 10.11 Task Cards

```css
.task {
  border-radius: 6px;         /* --radius-sm */
  background-color: var(--background);
  border: 1px solid var(--foreground);
  display: flex;
  color: var(--foreground);
  padding: 6px;
  font-weight: 600;
  font-size: 16px;
  line-height: 1;             /* tight — task title line height */
  cursor: grabbing;
}
.task:hover {
  border-color: var(--accent);
  animation: pulsate 0.25s ease both;
  transition: border 0.25s;
}
/* Checked state */
.task.checked { text-decoration: line-through; opacity: 0.5; }
/* Header/label variant */
.task.header { border-radius: 100px; border-width: 2px; }
```

---

### 10.12 Page Layout

```css
.container {
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
}
.header-separator {
  width: 100%;
  height: 2px;
  background-color: var(--alt-foreground);
  border: none;
}
```

---

## 11. Do's and Don'ts

### DO

- Reference only the 8 CSS color variables — never hardcode colors
- Apply `pulsate` on `:hover` and `click-press` on `:active` to every interactive element
- Use the monospace font stack exclusively
- Use `--accent` as the single signal for interactivity
- Use `backdrop-filter: blur(2px)` on all modal overlays
- Use `2px solid var(--accent)` for focus/active borders, `1px solid var(--foreground)` for resting
- Keep inputs constrained in width in forms (~300–500px max)
- Use `flex-direction: column-reverse` for label-input pairs
- Set `outline-color: var(--accent)` on all form controls
- Use `z-index: 100` for modals and context menus
- Use `var(--foreground)` as text color on `var(--accent)` backgrounds (not `var(--background)`)

### DON'T

- Use `box-shadow` on resting-state elements (cards, rows, inputs)
- Use gradients anywhere
- Use sans-serif or serif fonts
- Apply `--accent` to decorative or non-interactive text
- Create more than one primary button per context area
- Use full-width inputs in settings forms
- Invent new spacing values outside the canonical scale
- Mix different border-radius values within the same component
- Write animations longer than `0.5s`
- Omit `pulsate`/`click-press` from interactive elements
- Use `var(--background)` as text on `var(--accent)` — fails WCAG AA in dark mode
- Draw radio buttons as circles with labels — use a button-row (segmented control) instead

---

## 12. Theme System

Every app using this design system must provide a theme switcher with two axes of control:

### 12.1 Theme Types

| Value | Description | Background behavior |
|---|---|---|
| `accent` | Dark greyscale background + colored accent | `hsl(0, 0%, 15%)` — neutral dark |
| `complement` | Monochromatic — bg tinted with the hue | `hsl(H, 15%, 15%)` — hue-tinted dark |
| `two-tone` | Analogous — accent at H+30, panels at H−30 | `hsl(H, 0%, 10%)` — slightly warm dark |
| `light` | Light greyscale background + colored accent | `hsl(0, 0%, 95%)` — near white |

### 12.2 Hue Options

| Name | Hue degree | HSL accent (dark) |
|---|---|---|
| `red` | 5° | `hsl(5, 75%, 50%)` |
| `orange` | 39° | `hsl(39, 75%, 50%)` |
| `yellow` | 60° | `hsl(60, 75%, 50%)` |
| `green` | 130° | `hsl(130, 75%, 50%)` |
| `blue` | 180° | `hsl(180, 75%, 50%)` |
| `indigo` | 250° | `hsl(250, 75%, 50%)` |
| `violet` | 280° | `hsl(280, 75%, 50%)` |

### 12.3 Color Computation

The 8 CSS variables are computed from `themeType + hue` and applied via `document.documentElement.style.setProperty()`. The formulas:

**`accent` and `complement` (dark):**
```
--foreground:             hsl(0, 0%, 100%)
--background:             hsl(0, 0%, 15%)          /* complement: hsl(H, 15%, 15%) */
--alt-background:         hsl(H, 50%, 30%)
--alt-foreground:         hsl(H, 75%, 75%)
--accent:                 hsl(H, 75%, 50%)
--alt-accent:             hsl(H, 75%, 90%)
--alt-background-neutral: hsl(0, 0%, 30%)
--alt-foreground-neutral: hsl(0, 0%, 75%)
```

**`two-tone`:**
```
--foreground:             hsl(0, 0%, 100%)
--background:             hsl(H, 0%, 10%)
--alt-background:         hsl(H, 50%, 35%)
--alt-foreground:         hsl(H−30, 75%, 70%)
--accent:                 hsl(H+30, 75%, 50%)
--alt-accent:             hsl(H+30, 75%, 90%)
--alt-background-neutral: hsl(0, 0%, 30%)
--alt-foreground-neutral: hsl(0, 0%, 75%)
```

**`light`:**
```
--foreground:             hsl(0, 0%, 0%)
--background:             hsl(0, 0%, 95%)
--alt-background:         hsl(H, 35%, 75%)
--alt-foreground:         hsl(H, 100%, 30%)
--accent:                 hsl(H, 100%, 35%)
--alt-accent:             hsl(H, 100%, 75%)
--alt-background-neutral: hsl(0, 0%, 75%)
--alt-foreground-neutral: hsl(0, 0%, 30%)
```

### 12.4 Settings Controls Required

The Appearance tab of every settings page must include:

1. **Theme Type** — `SELECT` with options: `accent`, `complement`, `two-tone`, `light`
2. **Accent** (hue) — `SELECT` with options: `red`, `orange`, `yellow`, `green`, `blue`, `indigo`, `violet`
3. **Font Family** — `SELECT` with options: `courier-new`, `roboto-mono`, `source-code-pro`, `jetBrains-mono`

### 12.5 Theme Switcher Implementation

```javascript
function convertThemeToHue(hue) {
  const hues = { red: 5, orange: 39, yellow: 60, green: 130, blue: 180, indigo: 250, violet: 280 };
  return hues[hue] ?? 280;
}

function applyTheme(themeType, hue) {
  const H = convertThemeToHue(hue);
  const themes = {
    accent:     { '--foreground': 'hsl(0,0%,100%)', '--background': 'hsl(0,0%,15%)',      '--alt-background': `hsl(${H},50%,30%)`, '--alt-foreground': `hsl(${H},75%,75%)`,    '--accent': `hsl(${H},75%,50%)`,    '--alt-accent': `hsl(${H},75%,90%)`,    '--alt-background-neutral': 'hsl(0,0%,30%)', '--alt-foreground-neutral': 'hsl(0,0%,75%)' },
    complement: { '--foreground': 'hsl(0,0%,100%)', '--background': `hsl(${H},15%,15%)`,  '--alt-background': `hsl(${H},50%,30%)`, '--alt-foreground': `hsl(${H},75%,75%)`,    '--accent': `hsl(${H},75%,50%)`,    '--alt-accent': `hsl(${H},75%,90%)`,    '--alt-background-neutral': 'hsl(0,0%,30%)', '--alt-foreground-neutral': 'hsl(0,0%,75%)' },
    'two-tone': { '--foreground': 'hsl(0,0%,100%)', '--background': `hsl(${H},0%,10%)`,   '--alt-background': `hsl(${H},50%,35%)`, '--alt-foreground': `hsl(${H-30},75%,70%)`, '--accent': `hsl(${H+30},75%,50%)`, '--alt-accent': `hsl(${H+30},75%,90%)`, '--alt-background-neutral': 'hsl(0,0%,30%)', '--alt-foreground-neutral': 'hsl(0,0%,75%)' },
    light:      { '--foreground': 'hsl(0,0%,0%)',   '--background': 'hsl(0,0%,95%)',      '--alt-background': `hsl(${H},35%,75%)`, '--alt-foreground': `hsl(${H},100%,30%)`,   '--accent': `hsl(${H},100%,35%)`,   '--alt-accent': `hsl(${H},100%,75%)`,   '--alt-background-neutral': 'hsl(0,0%,75%)', '--alt-foreground-neutral': 'hsl(0,0%,30%)' },
  };
  const t = themes[themeType] ?? themes.accent;
  Object.entries(t).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  document.documentElement.style.setProperty('background', t['--background']);
}
```

---

## 13. Color Contrast

All text and interactive elements must meet **WCAG AA** minimum contrast ratios:

- **Normal text** (< 18pt / < 14pt bold): **4.5:1 minimum**
- **Large text** (≥ 18pt / ≥ 14pt bold): **3:1 minimum**
- **Interactive component boundaries** (borders, focus indicators): **3:1 minimum**

### 13.1 Verified Contrast Pairs (Dark Mode)

| Foreground | Background | Ratio | Pass |
|---|---|---|---|
| `--foreground` (#FFF) | `--background` (#262626) | ~17:1 | ✅ |
| `--foreground` (#FFF) | `--alt-background` (dark purple ~#592673) | ~11:1 | ✅ |
| `--foreground` (#FFF) | `--alt-background-neutral` (#4D4D4D) | ~11:1 | ✅ |
| `--foreground` (#FFF) | `--accent` (medium purple ~#9F20DF) | ~5.6:1 | ✅ |
| `--alt-foreground` (light purple) | `--background` (#262626) | ~5.8:1 | ✅ |
| `--alt-foreground` (light purple) | `--alt-background` (dark purple) | ~4.5:1 | ✅ (borderline) |
| `--alt-foreground-neutral` (#BFBFBF) | `--alt-background-neutral` (#4D4D4D) | ~4.1:1 | ⚠️ large text only |
| `--background` (#262626) | `--accent` (medium purple) | ~2.6:1 | ❌ FAIL |

**Critical:** `var(--background)` as text on `var(--accent)` **fails WCAG AA** in dark mode. Always use `var(--foreground)` as text color on accent-colored surfaces.

### 13.2 Contrast Rules

1. **Primary button text** must use `color: var(--foreground)` — not `var(--background)`
2. `--alt-foreground-neutral` on `--alt-background-neutral` is borderline — use font-size ≥ 18px or font-weight ≥ 600 for these pairs
3. In `two-tone` themes, `--alt-foreground` and `--alt-accent` use shifted hues — verify contrast after any theme switch
4. Light mode generally has better contrast ratios due to deep accent at 35% lightness

### 13.3 Checking Contrast in Implementation

Before shipping any new screen:
1. Test all text/background pairs using a WCAG contrast checker (e.g., WebAIM Contrast Checker)
2. Switch to every theme type (`accent`, `complement`, `two-tone`, `light`) and verify nothing breaks
3. Test all 7 hue options — some hues (yellow, green) have different perceptual contrast properties
4. Check focus indicators (`2px solid var(--accent)`) meet 3:1 against adjacent colors
