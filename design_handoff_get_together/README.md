# Handoff — Get Together redesign

## Overview

Full visual redesign of **Get Together** (Rails + Tailwind + Hotwire). The redesign pushes the existing warm-sand + forest-green + ember-orange palette into a more **editorial, playful** direction using display serif typography, boarding-pass motifs, and a more expressive results page. No change to routes, models, or business logic is required.

## About the design files

The files in this bundle are **design references created in HTML/React** — prototypes showing the intended look and behavior, **not production code to copy directly**. Your task is to **recreate these designs in the existing Rails + Tailwind + Hotwire codebase**, using ERB partials, Tailwind utility classes, and Stimulus controllers — following the patterns already established in `DESIGN_SYSTEM.md` and extending them where noted below.

- `Get Together — Redesign.html` — the root prototype; open it in a browser to click through all screens. Use the **Tweaks** panel (bottom right) to switch screen, hero variant, accent, and device.
- `src/tokens.jsx` — color + font tokens
- `src/bits.jsx` — shared atoms (logo, buttons, chips, avatar, globe, stamp, plane, pin)
- `src/landing.jsx` — landing page + nav + footer + search widget + hero variants
- `src/new-trip.jsx` — new trip wizard
- `src/screens.jsx` — dashboard (trip show) + waiting + results
- `src/mobile.jsx` — mobile variants (landing + results)

## Fidelity

**High-fidelity.** Exact colors, typography scale, spacing, and layout. Recreate pixel-perfectly using Tailwind utilities and the existing `gt-*` color tokens from `tailwind.config.js`. Extend the design system with the new display font and additional tokens listed below.

## Target screens → Rails views mapping

| Design screen | Current Rails view | Controller action |
|---|---|---|
| Landing (3 hero variants) | `app/views/pages/home.html.erb` *(new)* or `trips#index` empty state | `pages#home` |
| New trip | `app/views/trips/new.html.erb` | `trips#new` + `trips#create` |
| Trip dashboard | `app/views/trips/show.html.erb` | `trips#show` |
| Waiting | `app/views/trips/waiting.html.erb` | `trips#waiting` |
| Results | `app/views/trips/results.html.erb` | `trips#results` |

No routing changes required — all of these actions exist in `config/routes.rb`.

---

## Design tokens — additions to `tailwind.config.js`

Keep all existing `gt-*` colors. Add:

```js
// tailwind.config.js → theme.extend
fontFamily: {
  display: ['"Fraunces"', '"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
  sans:    ['"Inter"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
  mono:    ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
},
colors: {
  // keep existing gt-* and add:
  'gt-ink':      '#181512',
  'gt-ink-soft': '#3D3A35',
  'gt-line':     '#E8DFD0',
  // alt accents (exposed as runtime theme later; default stays gt-orange)
  'gt-tangelo':  '#F28D3D',
  'gt-coral':    '#E85D5D',
  'gt-plum':     '#7A3F8F',
  'gt-sky':      '#3A7FB2',
},
borderRadius: {
  'gt-pill': '9999px',
  'gt-card': '18px',
  'gt-hero': '22px',
},
```

**Load Fraunces + Inter + JetBrains Mono** in `app/views/layouts/application.html.erb` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Set body default: `class="font-sans text-gt-ink bg-gt-sand"`.

---

## Typography system

| Role | Tailwind | Notes |
|---|---|---|
| Hero display | `font-display text-[88px] leading-[0.95] tracking-[-0.03em] font-normal text-gt-forest` | Use **italic** on the accent word: `<em class="italic text-gt-orange">all of you</em>`. Scale down to `text-[56px]` on mobile. |
| Page title | `font-display text-[56px] leading-[1] tracking-[-0.025em] font-normal text-gt-forest` | On New trip, Results (winner uses 140px). |
| Section title | `font-display text-[44px] tracking-[-0.02em] font-normal text-gt-forest` | |
| Card title | `font-display text-[22px] tracking-[-0.01em] text-gt-forest` | |
| Display number/price | `font-display italic text-[22px]–[44px] text-gt-orange` | Used everywhere for prices, stats. |
| Body | `font-sans text-[15px] leading-[1.55] text-gt-ink-soft` | |
| Small body | `font-sans text-[13px] text-gt-ink-soft` | |
| Label / meta | `font-mono text-[11px] tracking-[0.1em] uppercase text-gt-muted` | **Critical for the editorial feel** — used on section headings, card headers, badges. |
| Button | `font-sans text-[15px] font-medium` | Never heavier than 500. |

**Fonts never go above 600 weight** — keeps the editorial softness.

---

## Shared components (build as partials)

### Nav — `app/views/shared/_navbar.html.erb`

Transparent on landing, `bg-gt-white border-b border-gt-line` elsewhere.

```erb
<nav class="flex items-center justify-between px-16 py-5">
  <div class="flex items-center gap-3 font-display text-gt-forest text-[22px] tracking-tight">
    <div class="w-7 h-7 rounded-full bg-gt-orange flex items-center justify-center text-white font-display italic text-[20px]">g</div>
    Get Together
  </div>
  <div class="flex items-center gap-2">
    <a class="px-3 py-2 text-sm text-gt-ink-soft">How it works</a>
    <a class="px-3 py-2 text-sm text-gt-ink-soft">Popular cities</a>
    <%= link_to "Sign in", new_user_session_path, class: "px-3 py-2 text-sm text-gt-ink-soft" %>
    <%= link_to "Plan a trip", new_trip_path, class: "px-[18px] py-[10px] rounded-full bg-gt-orange text-white text-[13px] font-medium shadow-[0_8px_24px_rgba(232,99,42,0.2)]" %>
  </div>
</nav>
```

On non-landing screens, add a breadcrumb after the logo: `<span class="text-gt-muted">/</span> <span class="text-gt-ink-soft font-medium">Eurotrip / Spring</span>`.

### Button — primary

```
class="px-[22px] py-[14px] rounded-full bg-gt-orange text-white text-[15px] font-medium
       inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(232,99,42,0.2)]
       hover:bg-gt-orange-dark transition-colors"
```

### Button — ghost

```
class="px-[18px] py-3 rounded-full border border-gt-forest/20 text-gt-forest text-sm font-medium
       inline-flex items-center gap-2 hover:bg-gt-forest/5 transition-colors"
```

### Chip (pill tag)

```erb
<!-- ember -->
<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gt-orange-light text-gt-orange-dark text-xs font-medium tracking-wide">◉ Now booking · Spring 2026</span>

<!-- white -->
<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gt-white border border-gt-line text-gt-forest text-xs font-medium">3,840 groups met this month</span>

<!-- dark (on gradient headers) -->
<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2b2d35] text-white text-xs font-medium">● Gathering inputs</span>
```

### Avatar (initials)

```erb
<div class="w-9 h-9 rounded-full bg-gt-orange-light text-gt-orange-dark
            flex items-center justify-center text-[13px] font-semibold
            border-2 border-gt-white">TM</div>
```

Tone variants: ember (orange-light/orange-dark), forest (`bg-[#DDE7E1] text-gt-forest`), sky (`bg-[#DCE8F1] text-[#3A6B92]`), plum (`bg-[#EADCF0] text-gt-plum`), sand (`bg-gt-sand-dark text-gt-ink-soft`).

### Card / panel

```
class="bg-gt-white border border-gt-line rounded-[18px] p-[22px]"
```

Panel header pattern (mono uppercase label + optional count/right-aligned meta):

```erb
<div class="flex items-baseline justify-between mb-3.5">
  <div class="font-mono text-[11px] tracking-[0.1em] uppercase text-gt-muted">
    Your crew <span class="text-gt-forest ml-1">· 4</span>
  </div>
  <span class="text-xs text-gt-muted">3 of 4 ready</span>
</div>
```

### Stamp (decorative, used on results)

```erb
<div class="inline-flex items-center gap-1.5 px-2.5 py-1
            border border-dashed border-gt-orange text-gt-orange
            rounded font-mono text-[10px] font-semibold tracking-[0.12em] uppercase
            rotate-[-8deg]">Cheapest for the group</div>
```

### Globe loader (SVG, used on Waiting + Dashboard CTA)

Extract `src/bits.jsx` → `Globe` component. Lift the inline SVG into `app/javascript/components/globe.svg.erb` or render inline in the ERB view. Keyframes: `gt-spin` (8s linear), `gt-drift` (8s linear, translateX -200px), `gt-pulse` (3.2s ease-in-out, opacity 0.2→0.6→0.2). Defined in `application.tailwind.css`.

---

## Screen-by-screen specs

### 1 · Landing (`pages#home`)

Page background `bg-gt-sand`. Sections top to bottom:

1. **Nav** (transparent, 22px vertical padding, 64px horizontal)
2. **Hero** — one of three variants (ship *Keynote* as default):
   - **Keynote:** left-aligned. Two chips → 88px Fraunces headline with italic-orange accent word → 19px body → `SearchWidget` (pill shape, 4 fields separated by 1px vertical dividers, orange circular search button) → 3 metric pills (`200+ destinations`, `~30s`, `Free`). Decorative `MiniTicket` rotated +6° in top-right.
   - **Boarding pass:** two-column, headline + copy + two CTAs on left, 3 overlapping rotated `MiniTicket` cards on right.
   - **Globe:** centered. Chip, 92px centered headline, 220px animated globe, `SearchWidget`.
3. **How it works** (`bg-gt-white`, top+bottom border `border-gt-line`, 72px vertical padding). Section header with italic accent. Grid of 3 cards (`bg-gt-sand`, border, `rounded-[18px]`, 28px padding): big italic orange number (52px) → title (24px Fraunces) → body.
4. **Popular meet-ups** — 6 aspect-3/4 cards. First card is full orange gradient (winner), rest are `bg-gt-white`. Each has a diagonal stripe placeholder pattern (`repeating-linear-gradient(135deg, ...)`) for the real image — **replace with real destination photos** when you have them.
5. **Footer** (`bg-gt-night text-white`, 40px padding, logo + copyright).

### Search widget detail

```erb
<div class="bg-white rounded-full border border-gt-line flex items-center p-1.5
            shadow-[0_14px_40px_rgba(24,21,18,0.08)] max-w-[720px]">
  <!-- Field: Friends -->
  <div class="flex-1 px-5.5 py-3.5 relative">
    <div class="font-sans text-[11px] font-semibold tracking-[0.05em] uppercase text-gt-muted">Friends</div>
    <div class="text-sm text-gt-ink mt-0.5">4 people</div>
    <div class="absolute right-0 top-3 bottom-3 w-px bg-gt-line"></div>
  </div>
  <!-- Field: From (flex-[1.4]) -->
  <!-- Field: When (no right divider) -->
  <!-- Round orange search button 52x52 -->
  <button class="w-13 h-13 rounded-full bg-gt-orange grid place-items-center shadow-[0_8px_20px_rgba(232,99,42,0.27)]">
    <!-- magnifying glass SVG -->
  </button>
</div>
```

### 2 · New trip (`trips#new`)

- Compact nav with breadcrumb "New trip" and a "Draft · GT-0481" stamp (forest color).
- Kicker label (`Step 1 of 2 — Your crew`) + 56px italic-accent display headline.
- Two-column grid (`1.2fr 1fr`, 20px gap):
  - **Left col:** Trip name card (big underlined input, `text-[26px] font-display`, border-bottom only) + preset chips; Travelers card with `PersonRow`s + `AddPersonRow` (dashed border, `+` circle, email/name input, "COPY LINK" mono hint).
  - **Right col:** When card (two `DateBox`es — padded sand block with DOW + big italic day + italic month); Candidate cities card (rows with country code in a rounded-10 square + city name + × icon) + inline-add row (dashed border, pin icon, "⏎ ADD" hint).
- Bottom bar: muted note left ("By continuing, we'll fetch live fares from Duffel.") + ghost "Save as draft" + primary "Find the fair city →".

Hotwire: auto-save draft on blur, Turbo Frame for adding participants so the page doesn't reload.

### 3 · Trip dashboard (`trips#show`)

- **Trip header** — full-width gradient card (`linear-gradient(160deg, #1A1F2E 0%, #2D4A3E 100%)`), 22px radius, 36px padding, inside 32px page margin. Absolute 220×220 radial-gradient orange glow, top-right, partially off-screen. Two dark chips, then 56px white Fraunces title with italic-orange accent word. Right side shows mono date range + italic meta ("4 people · 5 cities").
- **Body grid** (`1.3fr 1fr`, 20px gap):
  - Left: `PeoplePanel` (2×2 grid of person cards, small status dot — green if ready, muted if pending) + `SharePanel` (dashed sand input with copy-link mono text + orange Copy button).
  - Right: `CandidatesPanel` (city rows with score bar — `accent` for rank 1, `gt-forest-light` for others) + `GoPanel` (dark gradient card with 160px globe in the bottom-right at 35% opacity, kicker + "Price all 20 flights now?" headline with italic accent + copy + primary button).

### 4 · Waiting (`trips#waiting`)

Polling action already exists (`optimization_poll_controller.js`). Keep the polling logic, redesign the view:

- Compact nav with "Pricing…" crumb.
- Centered column, max 720px.
- Animated 220px globe, centered.
- Mono kicker "Pricing 20 routes · Duffel".
- 56px italic-accent display headline ("Scouring the skies for *the fair answer…*").
- Body copy.
- 4×2 grid of route chips — each chip is mono text, done rows have white bg + solid border + orange price, pending rows have sand bg + dashed border + `…` and reduced opacity. Animate pending → done as prices come in via Turbo Stream.

### 5 · Results (`trips#results`)

- Compact nav with "Eurotrip / Results" crumb.
- **WinnerCard** — full-width, 24px radius, `linear-gradient(150deg, #1A1F2E 0%, #2D4A3E 65%, #4A7A65 100%)`, 44×48 padding. 320×320 orange radial glow top-right. Stamp (`rotate(8deg)`) top-right. Two dark chips. Mono "Meet in" kicker. **140px Fraunces "Lisbon." with orange italic period.** 22px italic subtitle ("Portugal · LIS"). 4 stats in a row (mono label + italic display number; the first one is 44px big). Two buttons: primary "Book it on Google Flights →" + white-bordered ghost "Share results".
- **Below** — 1.3fr / 1fr grid:
  - **Fare breakdown** panel: 5-col grid per row (`44px 1.1fr 1fr 70px 70px`) — avatar / name+airport / city / duration / italic-orange price. Dashed dividers. Bottom total row with large italic price.
  - **Runners-up** panel: rank # + city + orange-dark diff + italic price.
  - **Vote panel** ("But also — what do you want?"): per-city rows with N segmented blocks (filled = accent for leader, forest-light others; unfilled = sand-dark). "+ Add your vote" dashed pill button below.

Vote panel already has a matching controller (`VotesController`) — wire up the Turbo Stream replacement pattern it already uses.

---

## Interactions & behavior

- **Hover:** buttons dim to `gt-orange-dark`, ghost buttons get `bg-gt-forest/5`. Cards do **not** lift or shadow — this is a flat, editorial UI.
- **Focus:** form inputs → `focus:ring-2 focus:ring-gt-orange/20 focus:border-gt-orange`.
- **Globe animations:** CSS keyframes (above) loop continuously. Respect `prefers-reduced-motion` — pause animations when set.
- **Polling (waiting):** keep `optimization_poll_controller.js` logic; only swap the template. Route chips in the grid animate from pending → done by replacing the chip element via Turbo Stream as each `RouteQuote` saves.
- **Voting (results):** existing `votes_controller.rb` already uses Turbo Streams to replace `votes-section-#{trip.id}`. The vote panel markup must use that same DOM id.
- **Share link copy:** small Stimulus controller `copy_to_clipboard_controller.js` (2 lines) — write text, flash the button label to "Copied!" for 2s.

## Responsive behavior

Design is desktop-first at 1180px. Collapse rules:

- Below **1024px**: two-column body grids become single column, hero headline drops to 64px.
- Below **768px** (mobile): nav collapses to logo + hamburger + primary CTA only. All multi-column grids stack. Hero headline → 42px. Hero ticket ornament hidden. Landing destinations grid → 2 cols. Winner city name → 76px, stats wrap. Fare breakdown → simplified 2-col: avatar+name / price.

See `src/mobile.jsx` for exact mobile landing + mobile results specs.

---

## Copywriting — exact strings used

Keep these verbatim — they set the tone.

- Landing hero (Keynote): **"Where should all of you actually meet?"** — *all of you* is italic + accent. Body: **"Drop in your crew and their cities. We compare real flight prices from every door and hand you the one place that's cheapest for everyone."** — *for everyone* italic + accent.
- Landing chip: **"◉ Now booking · Spring 2026"** and **"3,840 groups met this month"**.
- Hero metrics: **"200+ destinations"**, **"~30s to a fair answer"**, **"Free, no signup needed"**.
- How it works title: **"Three steps. No spreadsheet."** — *No spreadsheet.* italic.
- How it works steps:
  - 01 **Gather your people** — One tap. One link. Everyone drops in their home airport.
  - 02 **We price every option** — Real Duffel fares, from every origin, to every candidate — simultaneously.
  - 03 **One honest answer** — The city where the total ticket cost is lowest, with a full per-person breakdown.
- New trip kicker: **"Step 1 of 2 — Your crew"** / headline **"Who's getting together?"**
- Dashboard CTA: **"Price all 20 flights now?"** body **"4 origins × 5 candidates. Takes about 30 seconds."**
- Waiting: **"Scouring the skies for the fair answer…"**
- Results stamp: **"Cheapest for the group"** / kicker: **"Meet in"** / subtitle: **"Portugal · LIS"**.
- Results buttons: **"Book it on Google Flights →"** / **"Share results"**.
- Vote panel title: **"But also — what do you want?"**

Note: existing app uses French in places — translate accordingly where the UI is French, but keep the italic-accent pattern on the same keyword (e.g. *tous ensemble*, *honnête*, *équitable*).

---

## Assets

- **Fonts:** Fraunces, Inter, JetBrains Mono (all Google Fonts, loaded via `<link>`).
- **Icons:** all inline SVG (pin, plane, magnifying glass, check, arrow). See `src/bits.jsx` for exact paths. No icon library needed.
- **Destination images:** **TODO** — the Popular strip currently uses a diagonal stripe placeholder. Source 6 photos (wide aspect-3/4), 800×1067 minimum, warm-toned. Store in `app/assets/images/destinations/{lisbon,dublin,brussels,barcelona,amsterdam,berlin}.jpg`.
- **Logo mark:** the lowercase italic "g" inside an orange circle — reproduced in pure CSS, no asset needed.

## Implementation order (suggested)

1. Add fonts + Tailwind token extensions + body class.
2. Build `_navbar`, button + chip + avatar + panel + stamp mixins/partials.
3. Landing (`pages#home`) — Keynote variant only to start.
4. Trip show (dashboard) — the core authenticated screen.
5. Waiting — reuse existing poll controller.
6. Results — the flagship page, allocate the most time here.
7. New trip form polish.
8. Responsive pass.
9. Add second + third hero variants behind a feature flag for A/B.

## Files in this bundle

- `Get Together — Redesign.html` — root prototype
- `browser-window.jsx` — Chrome frame (presentation only, don't port)
- `src/tokens.jsx` — tokens reference
- `src/bits.jsx` — component reference
- `src/landing.jsx` — landing reference
- `src/new-trip.jsx` — new trip reference
- `src/screens.jsx` — dashboard, waiting, results reference
- `src/mobile.jsx` — mobile reference
