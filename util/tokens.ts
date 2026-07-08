import { Platform } from 'react-native';

export const tokens = {
  // 8 color tokens — dark theme defaults (Half Full Design System)
  foreground:            '#FFFFFF',   // hsl(0, 0%, 100%)  — primary text, borders, icons
  background:            '#262626',   // hsl(0, 0%, 15%)   — page/app background
  altBackground:         '#3D1A5C',   // hsl(280, 50%, 30%) — secondary panels
  altForeground:         '#CF8FEF',   // hsl(280, 75%, 75%) — secondary text
  accent:                '#9B30F5',   // hsl(280, 75%, 50%) — interactive elements
  altAccent:             '#EDD9FB',   // hsl(280, 75%, 90%) — hover states on accent
  altBackgroundNeutral:  '#4D4D4D',   // hsl(0, 0%, 30%)   — input/button backgrounds
  altForegroundNeutral:  '#BFBFBF',   // hsl(0, 0%, 75%)   — placeholder, disabled text

  // Spacing scale
  space1: 2,   space2: 4,   space3: 5,   space4: 6,   space5: 8,
  space6: 10,  space7: 12,  space8: 15,  space9: 16,  space10: 20,
  space11: 24, space12: 32, space13: 40,

  // Border radius
  radiusSm:   6,    // inputs, tasks, checkboxes
  radiusMd:   8,    // buttons
  radiusLg:   10,   // modals, cards
  radiusPill: 100,
  radiusFull: 9999, // circular elements (CSS 50% → large number in RN)

  // Font sizes
  fontSizeXs:   12,
  fontSizeSm:   14,
  fontSizeBase: 16,
  fontSizeMd:   18,
  fontSizeLg:   20,
  fontSizeXl:   24,
  fontSize2xl:  25,
  fontSize3xl:  38,
  fontSize4xl:  50,
  fontSizeHero: 80,

  // Z-index scale
  zBase:         1,
  zParticles:    5,
  zSticky:       10,
  zTray:         50,
  zModal:        100,
  zTooltipDesc:  200,
  zNotification: 300,
  zUpsell:       500,
} as const;

export const fontFamily = Platform.select({
  ios:     'Courier New',
  android: 'monospace',
  default: '"Courier New", monospace',
}) ?? 'monospace';
