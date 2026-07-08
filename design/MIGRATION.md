# Half Full Design System — Agent Migration Guide

> **You are an AI agent.** This document instructs you, step by step, on how to apply the Half Full design system to any existing codebase. Read it completely before writing a single line of code.

---

## Before You Begin: Read the Design Folder

The `design/` folder contains everything you need. You must read these files before doing anything else:

| File | What it tells you |
|---|---|
| `DESIGN.md` | Every visual rule: colors, spacing, typography, component blueprints, theme system, contrast requirements |
| `AGENTS.md` | Hard behavioral rules for generating UI — read this as a constraint checklist |
| `branding.md` | Color palette, typography, iconography, prohibited patterns |
| `tokens.css` | The canonical CSS variable definitions with all values |
| `showcase/index.html` | Open this in a browser to see what the correct output looks like |

Do not proceed until you have read all five. If a rule in `AGENTS.md` conflicts with something in the existing codebase, the design system wins.

---

## Step 1: Analyze the Codebase

Before touching any code, spend time understanding what you are dealing with. This analysis determines everything that follows.

### 1.1 — Map all style locations

Run a comprehensive search. Do not assume style only lives in CSS files. Style can be hiding in:

- Dedicated CSS/SCSS/LESS/Sass files
- Inline `style="..."` attributes in HTML/JSX/TSX/XML templates
- CSS-in-JS (styled-components, Emotion, JSS, Tailwind utility classes)
- JavaScript/TypeScript files that call `.style.setProperty()`, `.style.color =`, `.classList.add()`, or construct style strings
- Platform-specific style files (Android XML drawables, iOS `Assets.xcassets`, Flutter `ThemeData`)
- Theme files, constant files, or configuration files that define color values
- Third-party component library overrides or theme customizations
- Dynamic class toggling based on state (e.g., `isDark ? 'dark-class' : 'light-class'`)

Search your codebase exhaustively for the following patterns and compile a complete list of every file that contains them:

- Any hex color literal: `#[0-9a-fA-F]{3,8}`
- Any `rgb(` or `rgba(` or `hsl(` occurrence
- Any `color:`, `background:`, `background-color:`, `border-color:`, `fill:`, `stroke:` in any file type
- Any `fontSize`, `fontFamily`, `fontWeight`, `lineHeight` in non-CSS files
- Any `padding:`, `margin:`, `borderRadius:`, `border-radius:` in non-CSS files
- Any hardcoded pixel values inside component/screen definitions
- The words `theme`, `color`, `palette`, `style`, `dark`, `light` in constant or config filenames

This search should result in a list of files. Call this your **Style Surface**.

### 1.2 — Assess structural complexity

Answer these questions about the codebase:

1. How many files are in the Style Surface?
2. Is styling centralized (one or two theme/style files) or distributed (inline, in components, in logic files)?
3. Does the app have a theme system already? If so, how does it work?
4. Are colors defined as variables or constants anywhere, or are they mostly hardcoded?
5. Does JavaScript/TypeScript code directly manipulate styles at runtime?
6. Does the app target desktop only, mobile only, or both?
7. Are there platform-specific style files (native iOS, native Android) that must also be updated?

---

## Step 2: Make the Go / Plan Decision

Based on your analysis, you must choose one of two paths before writing any code.

### Path A — Direct Execution

Choose this path only if **all** of the following are true:

- The Style Surface contains **fewer than ~15 files**
- Styling is mostly centralized (e.g., one or two CSS files, one theme object)
- There is no significant JavaScript-driven style manipulation scattered across many files
- The app targets a single platform (not simultaneously desktop + mobile + native)

If you choose Path A, proceed to Step 3 and execute the migration directly.

### Path B — Step Plan First

Choose this path if **any** of the following is true:

- The Style Surface contains **15 or more files**
- Styles are heavily distributed across components, pages, or logic files
- There is significant JS-driven styling (runtime color changes, dynamic class generation, inline style objects)
- The app targets multiple platforms that each require separate style implementations
- The codebase uses a component library whose theme layer must also be overridden

If you choose Path B, do not start rewriting anything. Instead, create a series of Markdown files in a `design/migration-plan/` folder. Each file represents one discrete step, small enough to complete in a single AI session. See the format instructions below.

---

## Step 2b: Writing the Step Plan (Path B only)

If you chose Path B, create `design/migration-plan/` and populate it with numbered step files: `step-01.md`, `step-02.md`, etc.

### Rules for writing step files

- **One focus per step.** Each step must address a single, clearly bounded area of the codebase. No step should overlap with another.
- **Steps must be sequenced correctly.** Each step should not depend on work from a step that hasn't been completed yet. The token/variable foundation always comes first.
- **Each step must be completable in one session.** If a step feels too large, split it further.
- **Each step must include a verification checklist** so the agent executing it can confirm it is fully done before moving to the next step.
- **Each step file must be self-contained.** The agent executing step 3 should not need to re-read step 1 to understand what to do.

### Recommended step sequence

The following is a starting template. Adapt it to the actual codebase you found:

| Step | Focus |
|---|---|
| `step-01.md` | Establish the token/variable foundation — create or update the central style definition file so all color, spacing, font, and radius values are defined as variables in one place |
| `step-02.md` | Update global/base styles — body, typography resets, focus states, scrollbar, layout containers |
| `step-03.md` | Update primary interactive components — buttons, inputs, dropdowns, checkboxes, radio groups |
| `step-04.md` | Update overlay and modal components — modals, dialogs, sheets, popovers, tooltips, notifications |
| `step-05.md` | Update navigation and settings — nav bars, tab bars, settings pages, context menus; ensure version number appears in settings |
| `step-06.md` | Update JavaScript/runtime-driven styles — any code that sets styles programmatically, toggles classes, or builds style objects dynamically |
| `step-07.md` | Implement the theme switcher — wire up the themeType + hue + fontFamily settings and make all variables respond to changes |
| `step-08.md` | Final sweep and verification — search the entire codebase again for any remaining hardcoded values or untouched style locations |

Do not collapse steps together. If step 3 would cover too many components, split it into step-03a and step-03b.

Each step file should include:

```
# Step N: [Focus Area]

## What you are doing
[One paragraph describing the scope of this step]

## Files you will touch
[List of specific files or patterns, e.g. "src/components/Button.*", "all files matching *.style.ts"]

## What to change
[Specific instructions for this step, referencing the relevant sections of DESIGN.md]

## What NOT to change in this step
[Explicitly list anything that is out of scope, to prevent scope creep]

## Verification checklist
- [ ] [Specific thing to check]
- [ ] [Another thing to check]
- [ ] No hardcoded color values remain in the files touched in this step
```

---

## Step 3: Core Migration Principles (Apply to All Stacks)

Regardless of platform, every migration must follow these principles. Do not skip any of them.

### 3.1 — Create a single source of truth for tokens

Before changing any component, establish one file or one section of code that defines all design values as named variables. Every other style in the codebase must reference these variables — no other file should contain raw color, spacing, or font values.

The token definitions come directly from `design/tokens.css`. Translate them into whatever variable system the target platform uses (CSS custom properties, a JS/TS constants object, a platform theme file, etc.), but keep the names semantically identical to the tokens in `tokens.css` where possible.

### 3.2 — Never hardcode visual values

After the migration, there must be zero hardcoded hex colors, RGB values, pixel spacings, or font sizes anywhere outside the single token source. If you find `color: #9B30F5` or `backgroundColor: '#262626'` scattered through component files, that is a failure state that must be corrected.

To locate all remaining hardcoded values after your work, search for hex literals, `rgb(`, and numeric pixel values in style contexts. Every hit is a bug to fix.

### 3.3 — Make themes dynamic, not static

The design system has a live theme switcher (4 types × 7 hues). The implementation must be dynamic: changing the theme updates variables at the root level, and all components respond automatically because they reference variables, not hardcoded values.

Do not create separate "dark theme stylesheet" and "light theme stylesheet" that swap out wholesale. Instead, update the 8 root-level color variables and let everything cascade. This is true regardless of platform.

Do not add a color, theme, or font switcher unless it already exists.

### 3.4 — Apply animations to all interactive elements

Every element the user can click, tap, press, or focus must have the pulsate (hover/focus-in) and click-press (active/pressed) micro-animations. These are defined in `tokens.css`. Do not implement them as transitions on individual components — apply them globally by default and override only when necessary.

On mobile, map these to the equivalent press feedback (e.g., scale transform on tap). The timing and scale values are the same as desktop.

### 3.5 — Update JavaScript-driven styles too

If you find code that looks like this — setting style properties directly, building style objects in JS, toggling classes that apply colors, constructing inline style strings — that code must also be updated to reference the token variable system, not hardcoded values. This is especially common in:

- Theme toggle logic that sets CSS variables
- Components that change color to indicate state (error, success, active, disabled)
- Animated transitions driven by JS (opacity, color, transform changes timed with setInterval or requestAnimationFrame)
- Any component that receives a "color" or "variant" prop and maps it to a raw hex value

### 3.6 — Preserve semantic structure, replace only visual style

You are redesigning the visual layer, not the functionality. Do not rename functions, change APIs, alter business logic, or restructure component trees. Change CSS, style objects, theme definitions, and color constants only. If a structural change is genuinely required to support the new design pattern (e.g., wrapping an input in a label-container div), make the minimum structural change needed and document it.

---

## Step 4: Tech Stack–Specific Guidance

### 4.1 — Electron (Desktop)

**Where styles live:** Electron apps render web content, so styles are standard HTML/CSS. Look for CSS files in `src/`, `src/css/`, `src/styles/`, or imported directly in renderer JS/TS entry points. Inline styles in HTML templates and JS-constructed DOM elements are common.

**Recommended structure after migration:**
```
src/
  design/
    tokens.css          ← copy from this design folder, or link to it
  css/
    base.css            ← global resets, typography, focus states
    components.css      ← reusable element classes (buttons, inputs, etc.)
    [feature].css       ← per-feature styles referencing tokens only
  js/
    themes.js           ← applyTheme(themeType, hue) function
```

**Key considerations:**
- The main process cannot access CSS. All theme application happens in the renderer process.
- Use `ipcRenderer` for anything that needs to inform the main process of a theme change (e.g., updating the title bar color). See `themes.js` in this repository for a reference implementation.
- Electron supports `prefers-color-scheme` media queries, but defer to the explicit theme setting rather than relying on OS detection, since the user should be able to override it.
- The drag region (`-webkit-app-region: drag`) must be preserved — do not remove it from the header when restructuring.

---

### 4.2 — Vanilla JavaScript (Browser / No Framework)

**Where styles live:** Typically one or more external CSS files, plus any inline styles applied via `.style` property in JS. Config or constant files may define color strings.

**Recommended structure after migration:**
```
css/
  tokens.css            ← all custom properties on :root
  base.css              ← global styles, resets
  components.css        ← reusable classes
js/
  theme.js              ← theme switcher function
```

**Key considerations:**
- CSS custom properties (`--variable-name`) work in all modern browsers. Use them.
- When JS sets styles directly (`element.style.color = '#fff'`), replace the hardcoded value with a `getComputedStyle(document.documentElement).getPropertyValue('--foreground')` call, or better, apply a semantic class and let CSS handle the color.
- For dark/light mode detection: `window.matchMedia('(prefers-color-scheme: dark)')` works, but only use it as a default — always let the user override via the settings theme switcher.
- Inline style attributes in HTML must be removed and replaced with CSS classes.

---

### 4.3 — Node.js (Server-Rendered / Express / Templating Engines)

**Where styles live:** In template files (Handlebars, EJS, Pug, Nunjucks) as inline styles or class references, in served static CSS files, and sometimes as style strings constructed in route handlers.

**Key considerations:**
- Server-rendered HTML should reference the same `tokens.css` approach, but since you cannot do live variable updates server-side, lean on CSS custom properties loaded client-side.
- Avoid generating color values on the server and injecting them as inline styles. Instead, inject a `<body data-theme="accent" data-hue="violet">` attribute and handle all visual logic in client-side CSS.
- Theme persistence: store the user's theme preference server-side (session/cookie) and render the correct `data-theme`/`data-hue` attributes on the `<html>` tag so there is no flash of wrong theme on load.
- Static asset serving: ensure `tokens.css` is part of the publicly served static directory.

---

### 4.4 — React (Web)

**Where styles live:** CSS Modules (`.module.css`), styled-components or Emotion (CSS-in-JS), Tailwind utility classes, global CSS files imported in the root component, or inline `style={{}}` props.

**Recommended structure after migration:**
```
src/
  design/
    tokens.css          ← CSS custom properties, imported once in index.css
    theme.js            ← applyTheme() function
  styles/
    global.css          ← base styles that import tokens.css
  components/
    Button/
      Button.jsx
      Button.module.css ← references var(--accent), not hardcoded colors
```

**Key considerations:**
- Import `tokens.css` once at the application root (typically `index.css` or `App.css`). Do not import it inside components.
- If using styled-components or Emotion: create a `ThemeProvider` that injects the 8 token values as theme props. Map those props to the same semantic names as in `tokens.css`. When the theme changes, update the context — do not rebuild component styles wholesale.
- If using Tailwind: use `@theme` (v4) or `extend.colors` (v3) to map the 8 tokens into Tailwind utilities. Components should reference semantic utility names, not arbitrary Tailwind color values.
- Inline `style={{color: '#fff'}}` props are a red flag. Replace them with className references.
- `useEffect` hooks that toggle styles on mount are common sources of hidden style logic — search for them.

---

### 4.5 — React Native (Mobile)

**Where styles live:** `StyleSheet.create()` objects in component files, a shared `theme.ts` or `styles.ts` constants file, or inline style props. There is no CSS — all styles are JS objects.

**Recommended structure after migration:**
```
src/
  design/
    tokens.ts           ← TypeScript object with all 8 color tokens + spacing + typography
    theme.ts            ← computeTheme(themeType, hue) function returning token values
    ThemeContext.tsx    ← React context that holds current theme values
  components/
    Button.tsx          ← imports useTheme() hook, references theme.foreground etc.
```

**Key considerations:**
- There are no CSS custom properties in React Native. Use a React Context to distribute computed theme values. Every component that needs a color should call `useTheme()` and reference `theme.accent`, `theme.foreground`, etc.
- `StyleSheet.create()` cannot reference dynamic values — move any color-dependent style properties into inline `style` props derived from the theme context. Static structural styles (flexDirection, borderRadius, padding) can remain in StyleSheet.
- Font family: import the monospace fonts via `expo-font` or direct asset linking. The font family strings differ by platform (see font loading docs for your RN version).
- The `pulsate` and `click-press` animations must be implemented with React Native's `Animated` API or `react-native-reanimated`. Use a `scale` transform from 1.0 → 0.98 on hover/focus and 1.0 → 0.95 on press. The timing (0.25s, ease) stays the same.
- Do not use `Platform.OS === 'ios' ? '#fff' : '#000'` for color decisions. All colors come from the theme context.

**Mobile-specific design adjustments for React Native (see also Section 5):**
- Minimum touch target: 44×44pt (iOS) / 48×48dp (Android). Ensure checkboxes, buttons, and any tappable element meet this minimum even if the visual size is smaller (use padding to extend the tappable area).
- Remove hover-dependent tooltip interactions — there is no hover on touch. Replace with long-press or a dedicated info button.
- Font sizes: scale all sizes from the desktop scale. The base size (`--font-size-base: 16px`) is appropriate for mobile. Do not reduce it further for "compact" layouts.
- The `backdrop-filter: blur(2px)` modal backdrop has no direct equivalent in React Native — use a semi-transparent `rgba` overlay View instead.

---

### 4.6 — Kotlin (Android Native)

**Where styles live:** `res/values/colors.xml`, `res/values/themes.xml`, `res/values/styles.xml`, `res/drawable/` XML files, `res/layout/` XML layout files with inline attributes like `android:background`, `android:textColor`. Also in Kotlin/Java source files as color int literals (e.g., `Color.parseColor("#9B30F5")`) or `ContextCompat.getColor()` calls.

**Recommended structure after migration:**
```
res/
  values/
    colors.xml          ← defines base palette (the 8 tokens as color resources)
    themes.xml          ← maps semantic roles (colorPrimary, colorSurface, etc.) to palette
    dimens.xml          ← spacing scale
    fonts.xml           ← monospace font family definition
  values-night/
    themes.xml          ← dark theme overrides (same structure, different values)
  font/
    [monospace font files]
```

**Key considerations:**
- Map the 8 design tokens to Material Design color roles (`colorPrimary` → `--accent`, `colorSurface` → `--background`, `colorOnPrimary` → `--foreground`, etc.) in your `themes.xml`. Components that use Material widgets will inherit these automatically.
- The light/dark mode switch maps to `DayNight` theme variants. Do not hardcode any color in a layout XML or Kotlin file — reference `@color/token_name` or `?attr/colorPrimary` always.
- Color resources in `values/colors.xml` = your token definitions. Theme attributes in `themes.xml` = your semantic mapping. Never skip the indirection layer.
- Accent color as a hue variable: Android does not support dynamic CSS-style variables. To implement hue switching, you must either provide multiple theme variants and apply them at runtime via `setTheme()`, or use `MaterialColors` to compute dynamic color from a seed color.
- Animations: use `StateListAnimator` for press feedback, `ObjectAnimator` for scale, or `MotionLayout` for complex transitions. The 0.25s ease timing maps to Android's `fast_out_slow_in` interpolator.
- Font: declare the monospace font in `res/font/` and reference it via a `fontFamily` attribute in your text appearance styles.

---

### 4.7 — Flutter (Mobile + Desktop)

**Where styles live:** `ThemeData` in `main.dart` or a dedicated `theme.dart` file, `TextStyle` objects defined in constants, `BoxDecoration` objects in widget build methods, inline `color:` properties in widgets, and `ColorScheme` in the theme.

**Recommended structure after migration:**
```
lib/
  design/
    tokens.dart         ← all 8 color tokens + spacing + typography as Dart constants
    theme.dart          ← buildTheme(themeType, hue) → ThemeData
    theme_provider.dart ← ChangeNotifier that holds current ThemeData
  widgets/
    [component widgets] ← reference Theme.of(context).colorScheme.primary etc.
```

**Key considerations:**
- All colors must flow through `ThemeData.colorScheme`. Map the 8 tokens to the nearest `ColorScheme` roles. Never pass `Color(0xFF9B30F5)` directly to a widget — use `Theme.of(context).colorScheme.primary`.
- Implement a `ThemeNotifier` (ChangeNotifier or Riverpod provider) that rebuilds the app's `MaterialApp.theme` when `themeType` or `hue` changes. Store the selection in shared preferences.
- The `hue` axis translates to a `ColorScheme.fromSeed(seedColor: ...)` approach in Material You, or a manual color computation matching the formulas in `DESIGN.md § 12`.
- Animations: use `AnimationController` with `CurvedAnimation(curve: Curves.easeInOut)` for 250ms press feedback. Scale the widget from 1.0 → 0.98 on hover (desktop) / 1.0 → 0.95 on tap (mobile). Use `GestureDetector`'s `onTapDown`/`onTapUp` callbacks.
- Font: add the monospace font to `pubspec.yaml` under `flutter.fonts`, then reference it in `ThemeData.textTheme` as the default fontFamily.
- For desktop Flutter: hover states are available via `MouseRegion`. For mobile: use only tap/press states.

---

## Step 5: Desktop vs. Mobile Considerations

### 5.1 — What stays the same

The following design principles apply equally to desktop and mobile:

- The 8-token color system and all theme type/hue combinations
- Monospace font family (font availability permitting)
- The visual hierarchy: primary/secondary/tertiary button tiers
- The pulsate + click-press animation (scale values and timing)
- Borders instead of shadows for resting elements
- CSS variables / theme tokens as the single source of truth
- The label-above-input (column-reverse) pattern
- Version number in settings
- themeType + hue + fontFamily settings controls

### 5.2 — What changes on mobile

**Touch targets:** Interactive elements must meet platform minimum sizes (44pt iOS, 48dp Android). If the visual element is smaller (e.g., a 16×16 checkbox), extend the tappable area with padding or a wrapping pressable. Do not increase the visual size just to meet the minimum.

**Hover states:** There is no hover on touch screens. Any behavior or UI that only appears on hover (tooltips, style changes on mouse-over) must be adapted:
- Tooltips → long-press action or a visible info icon that opens a popover
- Hover color changes → not needed; use press/active state feedback only

**Font scale:** The desktop font scale is appropriate for mobile without reduction. Do not shrink font sizes below 14px (small text) or 16px (body) on mobile — these are already at the lower usable limit.

**Backdrop blur:** `backdrop-filter: blur(2px)` works in mobile web browsers but has no direct equivalent in React Native or native apps. Use a semi-transparent dark overlay (`rgba(0,0,0,0.5)` approximately) as the modal backdrop.

**Spacing adjustments:** On screens narrower than ~480px, consider increasing vertical spacing slightly (add 4-8px to padding values) to accommodate finger input. Horizontal spacing at 20px from `--space-10` is sufficient for most mobile viewports; do not reduce it.

**Modals and sheets:** On mobile, bottom sheets (sliding up from the bottom) are often more ergonomic than centered modals. The visual style (background color, border, padding) should remain the same; only the position and entrance animation change. Use a slide-up animation instead of `slideIn` (which is slide-down-from-top).

**Navigation:** The header nav links (tertiary buttons) work on desktop but are awkward on mobile. On mobile, replace the header nav row with a tab bar at the bottom or a hamburger/drawer menu. The visual style of the tab items (active: `--accent`, inactive: `--alt-foreground-neutral`) follows the same token system.

**`monospace` font rendering:** Monospace fonts can render slightly larger than equivalently sized sans-serif fonts on some mobile devices. Test at 16px base and adjust only if text visibly overflows containers — do not pre-emptively reduce the size.

---

## Step 6: Finding Every Last Instance of Style

This is the step where incomplete migrations happen. You must be thorough.

After completing your migration work (either directly or after executing each step plan), perform a final sweep using all of the following searches. Every result must be inspected and resolved.

### 6.1 — Hardcoded color search

Search the entire codebase (not just CSS files) for:

- Any 3, 6, or 8-character hex literal: patterns matching `#[0-9a-fA-F]{3,8}`
- Any `rgb(`, `rgba(`, `hsl(`, `hsla(` that is not inside your token definition file
- Color name strings: `'white'`, `'black'`, `'red'`, `'blue'`, `'transparent'` used as style values (transparent is allowed as a border placeholder, but flag any others)
- Platform-specific color literals: `Color(0xFF...)` in Flutter/Dart, `Color.parseColor(...)` in Android, `UIColor(red:...)` in Swift

Every hit that is not inside your token/variable definition file is a violation.

### 6.2 — Hardcoded spacing and size search

Search non-CSS files (JS, TS, JSX, TSX, Dart, Kotlin, Swift) for numeric pixel/point/dp values used in style contexts:

- Look for pattern: a numeric literal followed by `px`, `pt`, `dp`, `sp`, or followed by a closing `}` or `,` in a style object
- Specifically look inside `StyleSheet.create()` blocks (React Native), `BoxDecoration` (Flutter), `LayoutParams` (Android)

Any hardcoded size that is a layout/style value (not a logical limit or a canvas/chart dimension) should reference a spacing token instead.

### 6.3 — Font hardcoding search

Search all files for:

- `font-family:` declarations not referencing your token variable
- Font name strings like `'Arial'`, `'Helvetica'`, `'sans-serif'`, `'Georgia'` anywhere in style contexts
- `fontSize:` in non-CSS files with a raw number
- `fontWeight:` with a raw value not referencing a token

### 6.4 — JavaScript runtime style manipulation

Search for:

- `.style.` property access (e.g., `element.style.color =`, `element.style.backgroundColor =`)
- `getComputedStyle()` calls that read color values to then manually apply them elsewhere
- Class toggle logic that results in visually different appearances (check that the toggled classes use token variables, not hardcoded values)
- Any `document.documentElement.style.setProperty()` call that is not inside the `applyTheme()` function

### 6.5 — Theme and dark mode detection

Search for:

- `prefers-color-scheme` media query usage — verify it is only used as a fallback default, not as the sole theme mechanism
- `Appearance.getColorScheme()` (React Native), `UITraitCollection.current.userInterfaceStyle` (iOS), `UiModeManager` (Android), `MediaQuery.platformBrightness` (Flutter) — verify these are wired into the theme context properly
- `window.matchMedia(` calls that set styles directly rather than calling `applyTheme()`

---

## Step 7: Verification — You Are Not Done Until All of These Pass

Run through this checklist completely after your migration. Do not mark the migration complete if any item fails.

### Visual verification

- [ ] Open `design/showcase/index.html` in a browser and compare every component to the equivalent in the migrated app. They must match in color, shape, spacing, and animation behavior.
- [ ] Switch through all 4 theme types in the app's settings. Every screen must update completely and correctly.
- [ ] Switch through at least 3 hue options. No element should retain a previous hue's color.
- [ ] On mobile: verify touch targets are at minimum platform size.
- [ ] On mobile: verify no hover-only UI exists.

### Code verification

- [ ] The hardcoded color search (§6.1) returns zero results outside the token definition file.
- [ ] The hardcoded font search (§6.3) returns zero results outside the token definition file.
- [ ] Every interactive element (button, input, checkbox, link, tab, menu item) has the pulsate animation on hover/focus-in and click-press on active/press.
- [ ] Every focusable element shows a visible focus ring using the accent color.
- [ ] The settings page (or settings screen) shows a version number.
- [ ] The settings Appearance section contains controls for themeType, hue, and fontFamily.
- [ ] No `box-shadow` appears on any resting-state element (a card, row, or input in its default state).
- [ ] All text meets WCAG AA contrast (4.5:1 normal, 3:1 large). In particular: primary button text uses `--foreground`, not `--background`.
- [ ] The monospace font is applied globally — no element renders in a sans-serif or serif font.
- [ ] JavaScript files that previously manipulated styles directly now reference the token variable system.

### Completeness verification

- [ ] Re-run all searches from §6. Zero violations.
- [ ] Every screen and every page in the app has been visually checked against the design system. There are no screens that were missed.
- [ ] If the app has conditional UI states (error states, empty states, loading states), these have also been updated.
- [ ] If the app uses a third-party component library, its theme layer has been overridden to use the design tokens.

If any item above fails, fix it before declaring the migration complete. A half-migrated codebase is worse than an unmigrated one — inconsistency erodes user trust more than a dated-but-consistent design does.

---

## Quick Reference: Do and Don't

| Do | Don't |
|---|---|
| Reference only the 8 CSS token variables for all colors | Hardcode any color value anywhere outside the token file |
| Use monospace font everywhere, all sizes | Substitute sans-serif for "display" or "heading" text |
| Apply pulsate + click-press to every interactive element | Add animations longer than 0.5s |
| Use `var(--foreground)` as text on accent backgrounds | Use `var(--background)` as text on accent (fails contrast in dark mode) |
| Make themes dynamic — 8 variables drive everything | Create separate full stylesheets per theme |
| Keep one token source of truth per project | Spread color constants across multiple constants files |
| Adapt mobile layouts (touch targets, no hover, bottom sheets) | Use the exact same layout for desktop and mobile without adjustment |
| Display a version number in settings | Leave the settings page without a version number |
| Create a step plan if the codebase is large | Charge ahead writing code without a plan on a large codebase |
| Run the full §6 search sweep before declaring done | Call the migration complete without verifying completeness |
