// Design tokens for the Get Together redesign.
// Extends the existing system (forest + orange + sand) with display type
// and editorial rhythm. Accent is tweakable at runtime.

const GT = {
  // brand
  orange:       '#E8632A',
  orangeLight:  '#FDF0E8',
  orangeDark:   '#B54A1A',
  forest:       '#2D4A3E',
  forestLight:  '#4A7A65',
  night:        '#1A1F2E',
  // neutral
  sand:         '#F5F0E8',
  sandDark:     '#E8E0D0',
  muted:        '#8A8070',
  ink:          '#181512',
  inkSoft:      '#3D3A35',
  white:        '#FEFCF8',
  line:         '#E8DFD0',
  // alt accents (exposed via Tweaks)
  accentAlts: {
    Ember:   '#E8632A', // default
    Tangelo: '#F28D3D',
    Coral:   '#E85D5D',
    Plum:    '#7A3F8F',
    Sky:     '#3A7FB2',
  },
};

const FONT_DISPLAY = "'Fraunces', 'Cormorant Garamond', ui-serif, Georgia, serif";
const FONT_TEXT    = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_MONO    = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

window.GT = GT;
window.FONT_DISPLAY = FONT_DISPLAY;
window.FONT_TEXT = FONT_TEXT;
window.FONT_MONO = FONT_MONO;
