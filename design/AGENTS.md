# Half Full Design System — Agent Behavioral Contract

This file governs how AI coding agents must behave when generating UI for any project that adopts the Half Full design system. It is a hard constraint document, not a suggestion list.

**Read `DESIGN.md` and `tokens.css` before writing any UI code. Then follow the rules below.**

---

## Setup: How to Use This Design System

1. Copy the `design/` folder into the target project's root
2. Add to the project's main CSS entry point:
   ```css
   @import url('./design/tokens.css');
   ```
   Or in HTML:
   ```html
   <link rel="stylesheet" href="./design/tokens.css">
   ```
3. Reference `DESIGN.md` component blueprints for every component you build
4. Use `design/showcase/index.html` to verify visual output matches the reference

---

## Mandatory Rules

### Colors

- **Never hardcode a color value.** No hex, no `rgb()`, no `hsl()`. Always use a CSS variable.
- The 8 valid color variables are: `--foreground`, `--background`, `--alt-background`, `--alt-foreground`, `--accent`, `--alt-accent`, `--alt-background-neutral`, `--alt-foreground-neutral`.
- There are no other valid colors. If a design calls for a color not in this set, use the closest semantic match.
- `--accent` is the single interactive color. Anything clickable must use it or transition to it.

### Typography

- **Always use the monospace font stack.** No exceptions, no overrides for "display" text.
  ```css
  font-family: var(--font-family); /* or: "Courier New", monospace */
  ```
- Do not set `font-family` to anything that doesn't include a monospace fallback.
- Use only the font sizes defined in the scale (12/14/16/18/20/24/25/38/50/80px).
- Do not use `text-transform: uppercase` or `text-transform: lowercase`.

### Interactions

- **Every interactive element must have both animations:**
  ```css
  element:hover  { animation: pulsate 0.25s ease both; }
  element:active { animation: click-press 0.25s ease both; }
  ```
- These animations are defined in `tokens.css`. If `tokens.css` is imported, they are available globally.
- No animation may exceed `0.5s` duration.
- Border transitions use: `transition: border 0.25s;`

### Color Contrast

- **All text must meet WCAG AA: 4.5:1 for normal text, 3:1 for large text.**
- **NEVER use `var(--background)` as text on `var(--accent)` backgrounds.** This fails in dark mode (~2.6:1). Use `var(--foreground)` instead.
- `--alt-foreground-neutral` on `--alt-background-neutral` is borderline (4.1:1). Use font-size ≥ 18px or font-weight ≥ 600 for that pairing.
- After generating any new screen, mentally check every text/background pair against the verified pairs table in `DESIGN.md § 13.1`.
- When switching themes (`two-tone` especially), verify accent contrast has not dropped.

### Focus

- Every focusable element must show:
  ```css
  :focus-visible { outline: 2px solid var(--accent); }
  ```
- This is set globally in `tokens.css`. Do not override it to `outline: none` without replacing it with an equally visible focus indicator using `--accent`.
- Programmatic focus (not user-initiated) should use `data-programmatic-focus` attribute to suppress the ring.

### Spacing

- Use only these values: `2px, 4px, 5px, 6px, 8px, 10px, 12px, 15px, 16px, 20px, 24px`
- Do not invent intermediate values (e.g., no `7px`, `9px`, `11px`, `13px`, `17px`)
- Modal padding is always `24px` (`var(--modal-padding)`)
- Container horizontal padding is always `20px`

### Borders

- Default resting border: `1px solid var(--foreground)`
- Active/accent border: `2px solid var(--accent)`
- Modal border: `2px solid var(--foreground)` (stored in `--border-modal`)
- Do not add borders to elements that use background contrast for definition (inputs, neutral buttons)

### Shadows

- **Do not apply `box-shadow` to resting elements** (cards, task items, inputs, buttons in default state)
- Shadow is reserved for floating elements: `box-shadow: 0 4px 10px rgba(0,0,0,0.2)`
- Modal overlays use backdrop blur, not a dark div: `backdrop-filter: blur(2px)`

### Theme System

- Every app using this design system **must include a theme switcher** in the Appearance tab of its settings page.
- The switcher requires two controls: `themeType` (accent/complement/two-tone/light) and `hue` (red/orange/yellow/green/blue/indigo/violet).
- Implement the `applyTheme(themeType, hue)` function from `DESIGN.md § 12.5` and call it when either setting changes.
- The 8 CSS color variables must be applied via `document.documentElement.style.setProperty()` — never hard-set them in a static stylesheet for production themes.
- The default boot state (from `tokens.css`) is `accent` + `violet`.

### Radio Buttons

- Radio buttons in this system are **NOT** rendered as circles with labels. They are a horizontal row of button-style boxes (a segmented control).
- Each option is a `div` with `background: var(--alt-background)` unselected / `var(--alt-foreground)` selected and `border-radius: 6px`.
- Do NOT render `<input type="radio">` with `::before` circle indicators. Use the button-row pattern from `DESIGN.md § 10.5a`.

### Buttons

- There are exactly three button types. Use the correct one:
  1. **Primary** — solid `--accent` background, inverted `--background` text, `8px` radius. One per context.
  2. **Secondary** — `--alt-background-neutral` background, `16px/6px` padding, `8px` radius.
  3. **Tertiary** — text only, no background, no border. Used for nav links and cancel actions.
- A context area must have **at most one primary button**.

### Modals

- Overlay: `position: fixed`, `z-index: 100`, `backdrop-filter: blur(2px)`
- Content: `border: 2px solid var(--foreground)`, `border-radius: 10px`, `padding: 24px`, `margin: 10vh auto`
- Entrance animation: `animation: slideIn 0.3s ease-out`
- Always include a close button (`×`) at `font-size: 38px` with `pulsate` on hover

### Forms / Settings

- Use `flex-direction: column-reverse` for all label+input pairs
- Labels use `color: var(--alt-foreground-neutral)`, `font-size: 18px`
- Inputs are constrained in width (300–500px max in structured forms)
- Never use full-width inputs in settings pages

### Z-Index

- Only use values from the z-index scale defined in `tokens.css`
- Do not assign arbitrary z-index values outside the scale

---

### Settings Pages

- Every settings page **must display a version number** at the bottom of the panel.
- Style it with `color: var(--alt-foreground-neutral)`, `font-size: 12px`, `text-align: center`.

## Component Generation Checklist

When generating any UI component, verify:

- [ ] All colors use CSS variables from the 8-token palette
- [ ] Font family is monospace
- [ ] Font size is from the defined scale
- [ ] Interactive element has `pulsate` on hover
- [ ] Interactive element has `click-press` on active
- [ ] Focus state uses `outline: 2px solid var(--accent)`
- [ ] Border radius matches the component type (sm/md/lg/pill/full)
- [ ] No `box-shadow` on resting-state elements
- [ ] No hardcoded color values
- [ ] Primary button text uses `var(--foreground)`, NOT `var(--background)`
- [ ] All text/background pairs meet WCAG AA (4.5:1 normal text, 3:1 large)
- [ ] Radio buttons are button-row style, not circle+label
- [ ] Settings page includes a version number
- [ ] Appearance settings include themeType + hue + fontFamily selectors

---

## Recognizing This Design Language

A UI correctly implementing this system will have:

- A dark near-black background (`hsl(0,0%,15%)`)
- Purple accent elements (`hsl(280,75%,50%)`)
- Monospace text throughout — every label, button, heading, input
- Subtle scale-down animation on every hover (0.25s)
- Slightly deeper scale-down on click
- Minimal decoration — no gradients, no images as backgrounds, no drop shadows on cards
- Rectangular elements with small radii (6–10px), never fully rounded except pill badges
- A blurred backdrop behind modals
- Border-based separation (not shadow-based)

If a generated screen doesn't have all of the above, it has drifted from the design language. Fix it before delivering.

---

## File Reference

| File | Purpose |
|---|---|
| `design/tokens.css` | Drop-in CSS variables, animations, and global resets |
| `design/DESIGN.md` | This spec — token values + component blueprints |
| `design/AGENTS.md` | This file — behavioral rules for agents |
| `design/branding.md` | Color palette, typography specimens, iconography rules |
| `design/showcase/index.html` | Live visual reference — open in browser to verify |
