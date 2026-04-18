# Get Together — Design System

## Vision
Warm & adventure aesthetic. Think Airbnb meets travel planning.
Dark forest green + warm orange as signature colors. Feels alive, not corporate.

---

## Color Tokens

```css
/* Brand */
--gt-orange:        #E8632A;   /* Primary CTA, accents, active states */
--gt-orange-light:  #FDF0E8;   /* Orange backgrounds, badges */
--gt-orange-dark:   #B54A1A;   /* Orange hover states */

--gt-forest:        #2D4A3E;   /* Headings, logo, hero backgrounds */
--gt-forest-light:  #4A7A65;   /* Secondary scores, muted accents */
--gt-night:         #1A1F2E;   /* Hero gradient start */

/* Neutral */
--gt-sand:          #F5F0E8;   /* Page background */
--gt-sand-dark:     #E8E0D0;   /* Rank 2 badges */
--gt-muted:         #8A8070;   /* Muted text */
--gt-white:         #FEFCF8;   /* Card / nav background */
```

### Tailwind Custom Config (tailwind.config.js)
```js
colors: {
  'gt-orange':       '#E8632A',
  'gt-orange-light': '#FDF0E8',
  'gt-orange-dark':  '#B54A1A',
  'gt-forest':       '#2D4A3E',
  'gt-forest-light': '#4A7A65',
  'gt-night':        '#1A1F2E',
  'gt-sand':         '#F5F0E8',
  'gt-sand-dark':    '#E8E0D0',
  'gt-muted':        '#8A8070',
  'gt-white':        '#FEFCF8',
}
```

---

## Typography

- Font: system default (no custom font needed at MVP stage)
- Weights: 400 (body), 500 (headings, labels, CTA)
- Never use 600 or 700 — too heavy

| Element         | Size  | Weight | Color         |
|----------------|-------|--------|---------------|
| Page title      | 20px  | 500    | gt-forest     |
| Section heading | 22px  | 500    | gt-forest     |
| Hero h1         | 38px  | 500    | white         |
| Card title      | 15px  | 500    | text-primary  |
| Body            | 14px  | 400    | text-primary  |
| Label / meta    | 12px  | 400    | text-muted    |
| Micro label     | 11px  | 500    | text-muted, uppercase + tracking-wide |

---

## Border Radius

| Context         | Value  | Tailwind class  |
|----------------|--------|-----------------|
| Cards, panels   | 14px   | `rounded-[14px]` |
| Buttons, inputs | 8px    | `rounded-[8px]`  |
| Badges, pills   | 20px   | `rounded-full`   |
| Avatars         | 50%    | `rounded-full`   |

---

## Spacing Rhythm

- Page padding: `px-6 py-4` (1.5rem / 1rem)
- Card padding: `p-5` (1.25rem)
- Panel inner padding: `p-4` (1rem)
- Gap between grid cards: `gap-3` (12px)
- Gap between form elements: `mb-3` (12px)
- Section vertical spacing: `mt-6` (1.5rem)

---

## Components

### Navigation (`layouts/_navbar.html.erb`)
```html
<nav class="flex items-center justify-between px-6 py-4 bg-gt-white border-b border-gray-100">
  <!-- Logo -->
  <div class="flex items-center gap-2 font-medium text-gt-forest">
    <div class="w-7 h-7 rounded-full bg-gt-orange flex items-center justify-center">
      <!-- pin SVG icon, white fill -->
    </div>
    Get Together
  </div>
  <!-- Links -->
  <div class="flex items-center gap-2">
    <!-- ghost link: px-3 py-1.5 rounded-[8px] text-sm text-gray-500 hover:bg-gray-100 -->
    <!-- primary btn: px-4 py-2 rounded-[8px] text-sm font-medium bg-gt-orange text-white hover:bg-gt-orange-dark -->
  </div>
</nav>
```

### Primary Button
```html
<button class="px-4 py-2 rounded-[8px] text-sm font-medium bg-gt-orange text-white hover:bg-gt-orange-dark transition-colors">
  Label
</button>
```

### Secondary Button
```html
<button class="px-4 py-2 rounded-[8px] text-sm font-medium bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
  Label
</button>
```

### Card
```html
<div class="bg-gt-white rounded-[14px] border border-gray-100 overflow-hidden">
  <!-- content -->
</div>
```

### Panel (inner section card)
```html
<div class="bg-gt-white rounded-[14px] border border-gray-100 p-4">
  <p class="text-[11px] font-medium uppercase tracking-wider text-gt-muted mb-3">Panel Title</p>
  <!-- content -->
</div>
```

### Badge — orange
```html
<span class="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-gt-orange-light text-gt-orange-dark">
  Label
</span>
```

### Badge — green (success)
```html
<span class="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-700">
  Label
</span>
```

### Badge — gray (neutral/pending)
```html
<span class="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500">
  Label
</span>
```

### Avatar (initials circle)
```html
<div class="w-8 h-8 rounded-full bg-gt-orange-light flex items-center justify-center text-[12px] font-medium text-gt-orange-dark">
  TM
</div>
```
Avatar color variants: orange (self), green (bg-green-50 text-green-700), blue (bg-blue-50 text-blue-700), purple (bg-purple-50 text-purple-700).

### Score Bar
```html
<div class="h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
  <div class="h-full bg-gt-orange rounded-full" style="width: 91%"></div>
</div>
```
Rank 1: `bg-gt-orange`. Rank 2: `bg-gt-forest-light`. Rank 3+: `bg-gray-300`.

### Tabs
```html
<div class="flex border-b border-gray-100 bg-gt-white px-6 gap-0">
  <button class="px-4 py-3 text-sm text-gt-orange border-b-2 border-gt-orange font-medium">Active</button>
  <button class="px-4 py-3 text-sm text-gray-400 border-b-2 border-transparent">Inactive</button>
</div>
```

### Form Input
```html
<div class="mb-3">
  <label class="block text-[13px] font-medium mb-1.5">Label</label>
  <input type="text"
    class="w-full px-3 py-2 rounded-[8px] border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gt-orange/20 focus:border-gt-orange transition-colors"
    placeholder="..." />
</div>
```

---

## Page Backgrounds

| Context               | Background          |
|----------------------|---------------------|
| Page / body          | `bg-gt-sand`        |
| Nav, cards, panels   | `bg-gt-white`       |
| Hero sections        | dark gradient (see below) |
| Metric cards         | `bg-gt-sand-dark`   |

### Hero gradient (dark)
```css
background: linear-gradient(160deg, #1A1F2E 0%, #2D4A3E 100%);
```
Use for: landing hero, trip show header, winner card in results.

### Hero glow overlay (optional, landing only)
```css
background-image:
  radial-gradient(circle at 20% 80%, rgba(232,99,42,0.15) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, rgba(74,122,101,0.20) 0%, transparent 50%);
```

---

## Layout Patterns

### Two-column panel grid (trip/show)
```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
  <!-- panel left -->
  <!-- panel right -->
</div>
```

### Trips index grid
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
  <!-- trip cards -->
  <!-- + new trip card: dashed border, no background -->
</div>
```

### Results grid (runner-up cities)
```html
<div class="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-4">
  <!-- result cards -->
</div>
```

---

## View-specific Notes

### Landing page (`pages#home`)
- Full-width hero with dark gradient + glow overlay
- Orange em tag on hero h1 keyword
- Stat bar (200+ destinations / ~30s / Gratuit) below CTA
- 3-column "how it works" steps below hero (white background section)

### Trips index (`trips#index`)
- Page header: title left + "+" primary button right
- Trip card has a colored gradient header (varies per trip — use gt-forest gradient)
- Show participant count + city count as meta icons
- Status badge (green/orange/gray)
- Empty state / new trip card: dashed border, centered "+" icon

### Trip show (`trips#show`)
- Dark gradient header showing trip name + participant count
- Tabs: Aperçu / Participants / Résultats (Hotwire/Turbo frames)
- Two panels side by side: participants list + candidate cities with score bars
- "Copy invite link" secondary button at bottom of participants panel
- "Voir les résultats" primary CTA at bottom of cities panel

### Results (`trips#results` or `optimization_results#show`)
- Winner card: dark gradient, orange label, large city name, 3 stats inline
- Orange glow circle (absolute, top-right corner of winner card)
- Runner-up grid below (2–3 col)
- Fare breakdown table: per-participant rows with origin→destination + price + Google Flights deep link
- "Partager les résultats" secondary button at bottom

### Auth (Devise views)
- Centered card on gt-sand background (max-w-sm)
- Logo at top of card
- Clean form inputs
- Link to sign up / sign in below submit button

---

## Icon Usage
Use inline SVG only. No icon library needed.
Key icons (all `fill="currentColor"`, 14–16px):
- Pin / location: used in logo, city names
- Group / people: participant count
- Airplane: trip header, results

---

## Dos and Don'ts

**Do:**
- Use `gt-forest` for all headings and brand elements
- Use `gt-orange` only for primary CTAs, active states, rank-1 accents
- Keep cards on `gt-white`, page on `gt-sand`
- Use dark gradient headers for hero moments (landing, trip show, winner)
- Keep borders at `border-gray-100` (subtle) or `border-gray-200` (forms)

**Don't:**
- Don't use Tailwind default blues/indigos anywhere
- Don't use font-semibold or font-bold — max is font-medium (500)
- Don't use drop shadows — borders only
- Don't use rounded-xl everywhere — reserve 14px for cards, 8px for buttons
- Don't mix background colors randomly — sand for page, white for cards, dark for heroes
