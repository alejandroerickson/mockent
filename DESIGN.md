---
name: ADIT
description: A data-ops console for a mineral-exploration record chain
colors:
  ground: "#0a0a0b"
  chrome: "#101012"
  panel: "#141416"
  panel-2: "#1a1a1d"
  well: "#0e0e10"
  hairline: "#26262a"
  hairline-2: "#1f1f22"
  edge: "#35353b"
  ink: "#f4f4f5"
  ink-strong: "#fdfdfd"
  body: "#d4d4d7"
  muted: "#a0a0a6"
  faint: "#8b8b92"
  dim: "#5c5c63"
  link-line: "#4a4a52"
  blue: "#5fa8ef"
  blue-tint: "#152738"
  blue-deep: "#14222f"
  blue-hover: "#1b3247"
  red: "#ee6a63"
  active: "#1c1c20"
  hover: "#151518"
  backdrop: "rgba(0, 0, 0, 0.74)"
  cat-0: "#d9a648"
  cat-1: "#5fb49c"
  cat-2: "#a98fda"
  cat-3: "#d4707f"
  cat-4: "#8fbc63"
  cat-5: "#c98f5e"
  cat-6: "#64b5d9"
  cat-7: "#9aa3ad"
typography:
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  section-label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.08em"
  figure:
    fontFamily: "'Sometype Mono', ui-monospace, 'Cascadia Mono', Consolas, monospace"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.2
  figure-hero:
    fontFamily: "'Sometype Mono', ui-monospace, 'Cascadia Mono', Consolas, monospace"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.2
  figure-count:
    fontFamily: "'Sometype Mono', ui-monospace, 'Cascadia Mono', Consolas, monospace"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.1
  mono-meta:
    fontFamily: "'Sometype Mono', ui-monospace, 'Cascadia Mono', Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  manual-body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  manual-headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
rounded:
  inner: "3px"
  panel: "4px"
  float: "6px"
  pill: "12px"
spacing:
  s1: "4px"
  s2: "8px"
  s3: "12px"
  s4: "16px"
  s5: "24px"
  s6: "32px"
  s7: "48px"
components:
  topbar:
    backgroundColor: "{colors.chrome}"
    textColor: "{colors.ink}"
    height: "48px"
    padding: "0 12px 0 20px"
  env-chip:
    textColor: "{colors.faint}"
    typography: "{typography.section-label}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "22px"
  nav-l1:
    textColor: "{colors.muted}"
    typography: "{typography.body}"
    padding: "0 12px"
  nav-l1-active:
    backgroundColor: "{colors.active}"
    textColor: "{colors.ink}"
  topbar-button:
    textColor: "{colors.muted}"
    rounded: "{rounded.panel}"
    padding: "0 9px"
    height: "30px"
  topbar-search:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.panel}"
    padding: "0 8px"
    height: "30px"
    width: "220px"
  nav-l2-item:
    textColor: "{colors.body}"
    typography: "{typography.body}"
    padding: "5px 8px 5px 10px"
  nav-l2-item-active:
    backgroundColor: "{colors.active}"
    textColor: "{colors.ink}"
  button:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.body}"
    typography: "{typography.body-small}"
    rounded: "{rounded.panel}"
    padding: "6px 12px"
  button-hover:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.ink}"
  button-primary:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.blue}"
    typography: "{typography.body-small}"
    rounded: "{rounded.panel}"
    padding: "6px 12px"
  button-primary-hover:
    backgroundColor: "{colors.blue-hover}"
    textColor: "{colors.blue}"
  button-small:
    typography: "{typography.label}"
    padding: "3px 9px"
  button-quiet:
    textColor: "{colors.muted}"
  button-pressed:
    backgroundColor: "{colors.active}"
    textColor: "{colors.ink}"
  button-danger:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.red}"
  input:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.panel}"
    padding: "6px 10px"
    height: "32px"
  filter-pill:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.body}"
    typography: "{typography.label}"
    rounded: "{rounded.panel}"
    padding: "4px 10px"
  filter-pill-checked:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.blue}"
  chip-status:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 9px"
    height: "20px"
  chip-status-soft:
    backgroundColor: "{colors.active}"
    textColor: "{colors.muted}"
  chip-status-strong:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
  chip-object:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
    typography: "{typography.mono-meta}"
    rounded: "{rounded.panel}"
    padding: "3px 10px"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.body}"
    rounded: "{rounded.panel}"
    padding: "12px 16px 16px"
  authority-strip:
    backgroundColor: "{colors.well}"
    textColor: "{colors.muted}"
    typography: "{typography.mono-meta}"
    rounded: "{rounded.inner}"
    padding: "6px 10px"
  filter-bar:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
    padding: "10px 16px 12px"
  column-head:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    padding: "8px 10px"
  stage-ticket:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.body}"
    rounded: "{rounded.panel}"
    padding: "8px 10px 9px"
  ticket:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.body}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
  ticket-lead:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.body}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
  table-header:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.faint}"
    typography: "{typography.label}"
    padding: "7px 10px"
  figure-profit:
    textColor: "{colors.blue}"
    typography: "{typography.figure}"
  figure-loss:
    textColor: "{colors.red}"
    typography: "{typography.figure}"
  tray:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.body}"
    rounded: "{rounded.float}"
    width: "420px"
  account-menu:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.body}"
    rounded: "{rounded.float}"
    padding: "6px"
    width: "260px"
  dialog:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.body}"
    rounded: "{rounded.float}"
    padding: "16px"
    width: "560px"
  toast:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.float}"
    padding: "8px 16px"
  avatar:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
    size: "24px"
  manual-nav:
    backgroundColor: "{colors.chrome}"
    textColor: "{colors.body}"
    typography: "{typography.body-small}"
    padding: "24px 20px"
    width: "260px"
  manual-body:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.body}"
    typography: "{typography.manual-body}"
    padding: "40px 56px 96px"
---
# Design System: ADIT

> **ADIT's design record** (decision in `okf/decisions/design-system.md`). Token values are `design/tokens.css`, the font is `design/fonts/`. **Derived from the built app on 2026-09-22**: everything below is read from ADIT 7.4 as shipped (`adit/src/app.css`, `adit/src/ui/`, `adit/src/shell/`, `adit/src/pages/`). The frontmatter and the sidecar `.impeccable/design.json` carry the values in `design/tokens.css`.

## Overview

**Creative North Star: "The Lineage Console"**

ADIT is a data-ops console: a near-black, hue-free ground, panel chrome one or two fill steps lighter, hairlines where other systems put shadows, and dense grids of instrument-grade tabular figures set in Sometype Mono. Every figure on screen is a point on one record chain (tenement, programme, drillhole, batch, intercept, estimate, decision) and the chrome exists to keep that chain one click away: a ticket opens its project, a column head opens the register cut to its stage, a mark on a chart is a link, a stamp's authority strip names what the figures were read from. Nothing decorates: no texture, no drop shadows, no painted gradients, no illustration, and no costume borrowed from mining (The Compass Rule, below). The only colour that is not a neutral is doing a job the reader can name.

Density is high and deliberate. Body text is 14px, most labels and metadata are 12px (the hard floor), panel padding is 12–16px, table cells are 13px on 7px rows, and figures carry their unit as a smaller sans word beside the mono number. Sans-serif (system-ui) is for prose and labels; mono is for anything a person might compare, sort or trace: figures, ids, dates, provenance lines, page-head meta. The world ships dark by default with a complete light translation behind the topbar toggle; every token has a value in both, and the light theme is the same system re-mapped, never a second design. The one Read surface, the User Manual, forces the light theme and drops the console shell for a document layout so a reader can tell they have left the application.

Confirmed rejections, honoured by the build: the KPI-card-and-chart-stack home (the home is a stage board over an attention ledger over the register); hatch fills for chart categories; a left rail for the L1 sections; kicker and eyebrow labels above titles; any assistant or "recent activity" feed.

**Key Characteristics:**
- Near-black ground with panels one fill step up; hairlines, never shadows, mark edges.
- No costume from the trade: the domain supplies function (mono figure columns, downhole bars, a gantt), never imagery (The Compass Rule).
- One functional blue for interactive state, plus a blue/red money pair that always travels with a +/− sign.
- Five commodities in `cat-0`…`cat-4`, a legend wherever they appear; `cat-7` for the pooled "other".
- Sometype Mono tabular figures; system-ui prose; 12px floor everywhere including SVG text.
- L1 sections along the top with the environment chip, search, notifications, help, account and theme at right; L2 "in this section" column at left; one column on the phone.
- Status is a neutral chip told apart by fill, dash and weight; every stamp prints its provenance once in an authority strip.

### Named Rules
**The Compass Rule.** A compass app does not need to look like a compass, and an app about mineral exploration does not need to look like a core shed or a claim map. ADIT wears no costume from the trade: no rock or core textures, no hand-drawn map or survey lockups, no ore-colour palettes, no stamp or seal metaphors, no hatching as craft texture, no kraft, paper or parchment colours. The domain supplies function, never imagery: a mono figure column because grades are compared, a downhole bar because samples run down a hole, a gantt because programmes have dates. "Stamp" in component names (`.stamp`) names the panel of slots and its authority strip, not a device to draw.

**The Chrome Carries No Content Rule.** The topbar holds navigation and the tenant's standing condition (the `DEMO` environment chip), and nothing else. Anything about *this page's* rows (the fiscal year, the as-of date, how many projects are active, how many requests are overdue) lives in the page head's mono meta line, where the figures it describes are. A cut is named once in chrome: the L2 column offers it and the page head says which one is on; it is never re-offered as a row of pills beside the L2 that already offers it.

**The Manual Is Not The Console Rule.** The User Manual is a vendor document, not a screen of the product: it opens in a new tab, forces the light theme, and uses a 260px contents column on `chrome` beside a 78ch reading column at 15px/1.65 rather than the topbar, the L2 column and the panel grid. It keeps the console's tokens, hairlines, mono for ids and the `link-line` underline, so it is the same house in a different room. Nothing else in ADIT takes the Read layout.

## Colors

A **hue-free** charcoal ramp carries the entire interface: the greys are neutral, not blue-grey, so nothing reads as tinted. Blue, red and the categorical hues are reserved for meaning, so any colour on the page can be read as a statement. Body text runs 12.4:1 on `panel`, headings 16.6:1, 12px `faint` metadata 5.4:1.

### Primary
- **Functional Blue** (`blue`): interactive state and positive money, and nothing decorative. The active L1 underline and L2 left bar, a record tab's active underline, the primary button's text and border, the global focus ring (2px outline, 2px offset), checkbox `accent-color`, the unread dot in the notifications tray, the today line on the gantt, the "current" ring on a workflow step, the authority strip's "show method" hint, the notifications count badge. It is not the link colour (The Underline Is The Link Rule). In the light theme it deepens to `#1b5fbe` so 12–13px text on white clears 4.5:1.
- **Blue Tint** (`blue-tint`): primary button fill, checked filter pill fill, the notifications count badge fill, text selection. **Blue Hover** (`blue-hover`) is its hover step; **Blue Deep** (`blue-deep`) is the count badge's border.

### Secondary
- **Loss Red** (`red`): negative money (a forecast over budget, a variance against plan), the rejected step's dot in a workflow list, a field's error border and message, and the label of a destructive button (`Reject`, `Reset demonstration tenant`). The last widens the "money only" rule; it is recorded because it is what shipped, not because it is required. Red never fills a surface.

### Tertiary (categorical palette)
- **cat-0 Ochre** gold, **cat-1 Sea Green** lithium, **cat-2 Lavender** potash, **cat-3 Rose** copper, **cat-4 Leaf** nickel: the five commodities, fixed, with a legend under the stage board and in every chart that uses them. **cat-5 Copper**, **cat-6 Sky** and **cat-7 Slate** are for other chart categories (QAQC sample kinds, a series that is not a commodity), `cat-7` reserved for the pooled "other". Each has a light-theme value dark enough to read on white. Never used outside a chart, a legend swatch or a commodity chip's 9px swatch.

### Neutral
Dark values are canonical; the light column is the token-mapped variant behind `:root[data-theme="light"]`.

| Token | Role | Light |
|---|---|---|
| `ground` | page and L2 column background, hollow chart marks, the manual's page | `#f0f0f1` |
| `chrome` | topbar, phone L2 band, the manual's contents column | `#e8e8ea` |
| `panel` | panel, stamp, column head, chart, table, tray, menu, dialog, popover surfaces | `#ffffff` |
| `panel-2` | stage-board tickets, lead ticket, buttons, chips, object chips, filter pills, toast, notices, avatar, skip link | `#f5f5f6` |
| `well` | inputs, search box, authority strip, method panel, unread tray row, manual `code` | `#f8f8f9` |
| `hairline` | panel and column-head borders, topbar rule, tabs rule, dialog action rule | `#d9d9dc` |
| `hairline-2` | table row rules, L2 column edge, ledger and step rules, well borders, page footer rule | `#e6e6e8` |
| `edge` | control borders, tfoot and gantt-head rules, column-head underline, scrollbar thumb, swatch border, diverging-bar centre tick | `#bcbcc2` |
| `ink` | headings, figures, links, chart axes and ink marks, done steps, the gantt's in-field bar | `#17171a` |
| `ink-strong` | a hovered link | `#0b0b0d` |
| `body` | running text, L2 items, table cells | `#2c2c31` |
| `muted` | labels, units, L1 idle text, chart text, complete gantt bars, progress micro-bar fill | `#56565d` |
| `faint` | 12px metadata, meta lines, table headers, section labels, ids on tickets | `#5f5f67` |
| `dim` | the below-cut-off bars in the downhole profile; never text | `#9a9aa2` |
| `link-line` | the resting underline under a content link | `#b4b4bb` |
| `active` | current nav item fill, pressed button, soft chip, selected row, open topbar button | `#e6e6e9` |
| `hover` | row, nav, ticket and menu hover fill | `#efeff1` |
| `backdrop` | dialog backdrop | `rgba(240,240,241,0.82)` |

### Named Rules
**The Sign Travels Rule.** Money against a plan is blue when favourable and red when unfavourable, and the figure always carries its sign glyph (`−108,714` / `+124,827`) and, where there is room, the word. Colour never carries the sign alone, and a chart legend names each colour in words.

**The Underline Is The Link Rule.** A content link is `ink` over a 1px `link-line` underline; hover brightens the rule to `ink` and the text to `ink-strong`. The text never changes hue, because blue already means interactive state and positive money. Chrome, buttons, the L2 column, tickets and chips carry no underline; the rule applies inside tables, the ledger, the gantt, the page footer and the manual.

**The Nothing Else Is A Colour Rule.** Outside the money pair, the functional blue and chart categories, the page is neutral. Status chips, tickets, workflow steps, gantt bars and notices are distinguished by fill step, border style and type weight, never by hue.

**The State Is Not A Category Rule.** A state never borrows a categorical hue. The `cat-*` colours belong to commodities and chart categories; a reader who has learned that ochre is gold reads ochre as gold wherever it turns up. States are neutral and ordinal: `ink` for done or in the field, `muted` for complete, hollow for planned, dashed for on hold, `dim` for below cut-off.

**The Seven Plus Other Rule.** A chart draws at most seven named categories in `cat-0`…`cat-6` and pools the rest as "other" in `cat-7`; the legend names every drawn category, including the pool.

## Typography

**Figure Font:** Sometype Mono (self-hosted, weights 400 and 700; falls back to ui-monospace, Cascadia Mono, Consolas)
**Body Font:** system-ui (with -apple-system, Segoe UI, Roboto, sans-serif)
**Label/Mono Font:** Sometype Mono for ids, dates, meta lines, provenance, chart tick labels and code

**Character:** An instrument panel. Figures are heavy mono with tabular numerals so columns align and `2,900,000` reads as a reading, not a headline; the prose around them is the platform's own sans at a small, even size so it never competes. Weight 600 is the only emphasis in the sans; the mono goes to 700 for the figures that matter.

### Hierarchy
- **Headline** (600, 26px sans, 1.2, −0.01em): the page h1 (`Portfolio · Kestrel Range Resources`, a project's name) with the record id unlabelled beside it in 14px mono `muted`. 20px on the phone.
- **Title** (600, 16px sans, 1.3): h2 on every panel, dialog and tray heading, ticket titles, the column head's count figure (mono 700).
- **Body** (400, 14px sans, 1.5): running text, L1 tabs, L2 items, record tabs, chart titles (600), h3.
- **Body Small** (400, 13px sans): buttons, inputs, table cells, the ledger, dialog summaries, notices, stage-ticket names (600), workflow steps, the manual's contents.
- **Label** (400, 12px sans): slot labels, field labels, captions, crumbs, legend text, chart SVG text, units. The floor; nothing is set smaller.
- **Section Label** (600, 12px sans, 0.08em, uppercase): heads a group in the L2 column (`SHAPE`, `WATCHING`), the account menu (`SWITCH USER`), a fieldset legend, the manual's publisher line, the environment chip, and table column headers (600, uppercase, no tracking). The ledger's row-kind label (`APPROVAL OVERDUE`) is the same voice at 0.04em in `muted`. It labels the group or row beside it; it never sits above a title as an eyebrow.
- **Figure** (600, 20px mono, tabular): stamp slot figures; 16px on the phone, and 16px wrapping for a long value (a date range, a phase word). **Figure Hero** (700, 32px) for a stamp's hero slot, 26px on the phone; **Figure Count** (700, 26px, 1.1) for a work ticket's amount; the column head's count is 16px/700 and a stage ticket's figure 13px/600.
- **Mono Meta** (400, 12px mono, tabular): ids, the page-head meta line, dates in tables and steps, provenance strips, the brand mark `EMS 7.4`, L2 counts, table footers and pagers, the page footer, chart tick labels.
- **Manual Body** (400, 15px sans, 1.65) and **Manual Headline** (600, 30px): the User Manual's two sizes off the console scale, with h2 at 20px over a `hairline-2` rule and h3 at 16px. They exist only in the Read layout.

### Named Rules
**The Twelve Pixel Floor Rule.** No text, including SVG chart text and table headers, is set below 12px. The scale is 12 / 13 / 14 / 16 / 20 / 26 / 32 (`--t1`…`--t7`).

**The Unit Is A Word Rule.** A figure's unit or qualifier (`km²`, `m drilled`, `spent`, `USD`) is set in the sans at 12–13px, weight 400, `muted`, beside the mono number, never inside it.

**The Mono Means Comparable Rule.** Anything a reader might compare, sort or trace (numbers, ids, dates, provenance) is mono with `font-variant-numeric: tabular-nums`; everything else is sans.

## Layout

The shell is a 48px sticky topbar over a two-column grid: an L2 "in this section" column of `--rail` width (224px, narrowing to 200px at 1500px and 180px at 1180px) and a content column of `minmax(0, 1fr)` capped at 1480px. The L2 column is sticky under the topbar, scrolls independently and has a `hairline-2` right edge. Content padding is 16px top, 32px sides and 64px bottom at full width (24px sides at 1500px, 20px at 1180px, 16px at the phone).

The topbar holds, left to right: the brand (`ADIT`, 16px/700, with the mono `EMS 7.4` mark in `faint`), the `DEMO` environment chip, the nine L1 sections (Portfolio, Projects, Programmes, Drilling, Assays, Resources, Approvals, Optimiser, Admin) as text tabs with a 2px `blue` bottom underline when current, then at right a 220px search well, the notifications button with its count badge, Help (opens the manual in a new tab), the account button (24px avatar and chevron) and the theme toggle. Topbar buttons are 30px tall, borderless until hovered. Trays and menus open under the topbar at `top: 44px`, `right: 12px`.

A page opens with an optional breadcrumb (12px `faint`, ids in mono), then the page head: h1 with the id, a mono meta line of separated facts (`FY2026 · as of 2026-09-21 · 12 active projects`), and actions right-aligned at the baseline. A record with several aspects carries a row of tabs under its head with counts in mono. Spacing rhythm is the seven-step scale 4 / 8 / 12 / 16 / 24 / 32 / 48. Panels sit 16px apart in a `stack`; a new section opens with 24px above; inside a panel, stamp slots are 16px apart in rows and 24px across; small stacks use 2–6px. Grids are `auto-fit` with fixed minimums: stamp slots 156px, work tickets 228px, `grid--auto` cells 200px; the two-, three- and four-column grids drop to two at 1000px and one at the phone. The stage board is six columns of `minmax(168px, 1fr)` with a 12px gap, and at 1180px and below becomes six fixed 168px columns that scroll sideways. Tables scroll inside their panel with the header sticky at the top and the first column sticky at the left; charts draw at their own width (640px default, 900px for the downhole profile and gantt) and scroll sideways rather than shrink.

Breakpoints, all `max-width`: 1500px and 1180px narrow the rail and gutters; 1000px folds the manual to one column and the wide grids to two; 800px is the phone; 420px holds stamp slots at two columns. At the phone the topbar wraps to two rows (brand and buttons at 36px, then the L1 row at 38px scrolling sideways under a 24px edge fade, the search hidden), the grid becomes one column, the L2 column becomes a collapsible `<details>` band on `chrome` under the topbar (summary "In this section" with a count and a `blue` chevron, open by default above 800px), stamps drop to two columns, the ledger stacks each row into two lines, the gantt's label column narrows to 120px, and trays and dialogs span the width.

## Elevation & Depth

Flat. There are no drop shadows anywhere; depth is conveyed by fill steps (`ground` → `chrome`/`panel` → `panel-2`, with `well` as a recess inside a panel) and by 1px hairlines (`hairline` on panel edges, `hairline-2` on inner rules, `edge` on controls). Floating layers (tray, account menu, popover, toast, dialogs) are told apart from the page by a 1px `edge` border, a 6px radius and, for dialogs, the translucent `backdrop`, not by a shadow. One `box-shadow` declaration exists and it draws a hairline: the lead ticket's `inset 0 2px 0 blue` top accent. The only gradient is the mask that fades the L1 row where it scrolls on the phone.

### Named Rules
**The Hairline Not Shadow Rule.** Separate surfaces with a 1px hairline or a fill step. A `box-shadow` may only ever draw a 1–2px solid edge; it never blurs, spreads or offsets.

**The Recess Rule.** Inputs, the search well, the authority strip, the method panel under it, `kv--well` detail blocks and the unread rows of the notifications tray sit in `well`, one step darker than their surface, so the eye reads them as set-in rather than raised.

## Shapes

Rectilinear with barely softened corners. Panels, tickets, tables, column heads, buttons, inputs, filter pills, object chips, notices and empty states take 4px. Inner recesses (authority strip, method panel, `kv--well`, values-table wrap, manual `code`, menu items) take 3px. The floating layer (tray, menu, popover, toast, dialogs) takes 6px. Status chips and the environment chip are 12px full pills at 20–22px tall; the notifications count badge is a 17px pill; avatars, the chip's commodity swatch, workflow-step dots and tray unread dots are circles. Legend swatches are 11px squares at 2px; a split list's swatches 7px at 1px; gantt bars 12px tall at 2px; micro-bars in tables 3px tall at 1px. L2 items and the manual's contents items are square on the left where their 2px active bar sits and 3px on the right. Column heads are 4px on top and square below, with a 2px `edge` bottom rule that turns `blue` on hover. Borders are always 1px solid, except: the environment chip, the dashed status chip, an on-hold stage ticket, a dashed notice and an empty state, which are 1px dashed; the gantt's today line, dashed `blue`; and a chart's plan or cut-off line, a 3/3 dashed `ink` stroke.

## Components

### Buttons
Quiet, bordered, sized to their text. Character: a labelled control on an instrument, not a call to action.
- **Shape:** 4px radius, 1px border, 6px × 12px padding, 13px text, inline-flex with a 6px gap for an icon.
- **Default:** `panel-2` fill, `edge` border, `body` text. **Hover:** `hover` fill, `ink` text, `muted` border.
- **Primary:** `blue-tint` fill, `blue` border and text; hover to `blue-hover`. One per composition: the page head's main action (`Stage-gate decision`, `New programme`), a dialog's confirm.
- **Small:** 3px × 9px padding, 12px text (pagers, `Full register`, `Mark all read`, dialog close). **Quiet:** transparent fill and border, `muted` text; hover shows the `edge` border. **Danger:** the default button with `red` text (`Reject`, `Reset demonstration tenant`). **Pressed** (`aria-pressed="true"`): `active` fill, `blue` border, `ink` text (`Watching`). **Disabled:** opacity 0.5.
- **Topbar button:** 30px tall, transparent, `muted`; hover and open (`aria-expanded`) take `hover`/`active` fill with an `edge` border.
- **Focus:** the global 2px `blue` outline at 2px offset.

### Chips
Two kinds, deliberately different in shape.
- **Status chip** (`.chip`): a 12px-radius pill, 20px tall, 12px text in `muted` on `panel-2` with an `edge` border, the status word with its hyphens replaced by spaces. Three neutral variants chosen by the status word: **soft** (`active` fill and border) for a settled state (`approved`, `active`, `complete`, `accepted`, `closed`); **dashed** (no fill, dashed `edge` border) for a provisional or waiting state (`pending`, `draft`, `planned`, `submitted`, `expiring`, `qaqc hold`, `on hold`) and for an unfilled slot (`vacant`, `unfilled`); **strong** (`ink` text, weight 600) for a terminal negative (`rejected`, `lapsed`, `abandoned`, `cancelled`, `withdrawn`, `superseded`). A commodity chip carries a 9px round swatch in its `cat-*` hue before the name. Inside a page-head meta line the chip keeps the sans.
- **Environment chip** (`.env`): the one chip in the topbar, `DEMO` in 12px/600 uppercase `faint` at 0.08em, a dashed `edge` pill 22px tall, whose title says "Demonstration tenant · synthetic data". It is the only place the app says the figures are invented.
- **Object chip** (`.objchip`): a 4px-radius box, 3px × 10px padding, mono 12px, `panel-2` fill, `edge` border; the object kind (`hole`, `batch`) in `faint` before the id in `ink`; the border brightens to `muted` on hover. Used where a record links to its neighbours on the chain.

### Cards / Containers (panels, stamps, tickets)
- **Corner Style:** 4px.
- **Background:** `panel` with a `hairline` border; `panel--well` steps down to `well` with `hairline-2`; `panel--flush` drops its padding so a table can run edge to edge under a padded heading row.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Internal Padding:** 12px top, 16px sides, 16px bottom (12px all round on the phone).
- **Panel head** (`.ph`): the h2 at the baseline with a right-aligned mono 12px `faint` count or a small button (`19 items`, `all 3`, `Full register`).
- **Stamp anatomy:** a panel whose body is the `.stamp` grid of slots (label 12px `muted` above a 20px/600 mono figure with its unit as a sans word, an optional 12px `faint` sub-line; the hero slot 32px/700 spanning two columns; a long value at 16px wrapping), with the authority strip at its foot.
- **Work ticket** (`.ticket`, Approvals): title 600, amount 26px/700 mono with its currency as a 13px sans word, a 12px `faint` scope line, a dashed chip for the project pinned to the bottom. The **lead ticket** steps up to `panel-2` with an `edge` border and the 2px `blue` inset top bar. Hover takes `hover` fill and an `edge` border.
- **Key-value block** (`.kv`): a two-column `dt`/`dd` grid at 13px, labels `muted`, values `ink`, mono where the value is a date or id; `kv--well` sets it in a recess.
- **Notice:** a 13px `panel-2` strip with a `hairline` border for a fact about the record in view ("Waiting on Budget check by the Finance Controller"); the dashed variant is unfilled and `muted` for a caution. **Empty state:** 13px `muted` text centred in a dashed `edge` box.

### The stage board (signature)
The home's first view. Six columns, one per stage, each a **column head** and a stack of **stage tickets**.
- **Column head** (`.col-h`): a link on `panel` with a `hairline` border and a 2px `edge` bottom rule, 8px × 10px padding; the stage name at 13px/600 with the project count at 16px/700 mono at the right, then two mono 12px `faint` lines (`committed`, `forecast`, each with its compact figure right-aligned; the word in sans). Hover fills `hover` and turns the bottom rule `blue`. It opens the Projects register cut to that stage.
- **Stage ticket** (`.tk`): a link on `panel-2` with a `hairline` border, 8px × 10px padding. Row one: the project id in mono 12px `faint` and, at the right, a commodity chip with its swatch and code; row two: the name at 13px/600 `ink`; row three: the stage's live figure (metres drilled in Drilling, spend to date elsewhere) in mono 13px/600 with its unit as a 12px sans word at the right; row four: jurisdiction and the next gate month (or `on hold`) in 12px `faint`, ellipsised. An on-hold ticket has a dashed border. Hover fills `hover` and brightens the border to `muted`.
- An empty column shows `No projects` in a dashed `hairline` box. A commodity legend sits under the board.

### The attention ledger (signature)
A four-column grid inside a panel: the row kind (`APPROVAL OVERDUE`, `TENURE EXPIRING`, `QAQC HOLD`, `GATE DUE`, `VACANCY`) in 12px/600 uppercase `muted` at 0.04em; the record as an underlined `ink` link, ellipsised; the timing (`due yesterday`, `expires in 19 days`) in mono 12px `muted` right-aligned; and a status chip. Rows are 7px × 10px cells over `hairline-2` rules. On the phone the label and record share one line and the timing and chip the next.

### Authority strip and method panel (signature)
Every stamp prints its provenance once: a `well` strip with a `hairline-2` border, 3px radius, mono 12px `muted` text ("read from 1 tenement, 3 programmes, 19 holes and 8 batches") and, where there is a method to show, a right-aligned `blue` hint (`show method` / `hide method`). It is a button; opening it reveals a `kv--well` block directly beneath (no top border, 0 0 3px 3px radius) at 12px saying how each figure was derived. Provenance is never repeated elsewhere in the same panel.

### Figures
A figure is a mono tabular number. A **signed** figure (`Signed`) carries `+` or `−` and, where asked, a trailing sans word at 0.85 opacity; positive is `blue`, negative `red`, zero neither. A dash (`—`) in `faint` means the value does not exist for that row, not zero.

### Inputs / Fields
- **Field:** a 12px `muted` label above the control with a 4px gap, an optional 12px `faint` hint beneath; an error turns the border and message `red`.
- **Style:** `well` fill, 1px `edge` border, 4px radius, 6px × 10px padding, 32px minimum height, 13px text in `ink`, full width; placeholder in `faint`; number inputs in mono; textareas 84px minimum, resizable vertically; disabled at 0.55 opacity.
- **Focus:** the global 2px `blue` outline.
- **Checkbox:** a native 14px control with `blue` accent-color beside a 13px label.
- **Filter pills:** a fieldset whose legend is a section label and whose radio or checkbox labels are 4px-radius bordered boxes (`panel-2`, `edge`, 12px); checked becomes `blue-tint` fill with `blue` border and text. The native control is visually hidden; the label *is* the control.
- **Filter bar** (`.filters`): a `panel` box of field-labelled controls in one wrapping row, 10px × 16px padding, sitting above the table it narrows, with the row count in mono 12px `faint` right-aligned at the end. A search-shaped filter bar carries `role="search"`. A filter bar carries filters only; anything that changes what a row *stands for* is a shape in the L2 column.
- **Topbar search:** a 220px `well` box, 30px tall, with the drawn search icon and a 13px input; hidden on the phone.

### Navigation
- **L1 (topbar tabs):** 14px sans in `muted`, 12px side padding, full topbar height, transparent 2px top and bottom borders; hover `hover` fill and `ink`; current `active` fill, `ink`, 2px `blue` bottom border. Always along the top; scrolls sideways at 13px with an edge fade on the phone.
- **L2 (section column):** section labels in `faint` uppercase; items 14px `body` with a 2px transparent left bar, 5px × 8px × 5px × 10px padding, an optional mono 12px `faint` count or a status chip at the right; hover `hover`/`ink`; current `active` fill, `ink`, `blue` left bar. Groups are the section's shapes (`SHAPE`, `BY COMMODITY`, `BY STAGE`, `QUEUE`) and a watch list. On the phone it collapses into a `<details>` band on `chrome`.
- **Record tabs** (`.tabs`): 14px `muted` text with 8px × 12px padding over a `hairline` rule; a mono 12px `faint` count beside the label; hover `hover`/`ink`; current `ink` with a 2px `blue` bottom border. The address changes with the tab.
- **Breadcrumbs:** 12px `faint`; links `muted` over `link-line`; the current id in mono.
- **Page footer** (`.foot`): a mono 12px `faint` line under the content over a `hairline-2` rule, product and vendor at the left, support and the manual link at the right. It scrolls with the page; nothing is fixed to the foot.
- **Skip link:** "Skip to content" is the first focusable element, visually hidden until focused, then a bordered `panel-2` chip at the top left.

### Data tables
`panel` surface with a `hairline` border and 4px radius (border-top only when inside a panel), scrolling in both directions inside itself. 13px cells with 7px × 10px padding (4px × 8px compact) and `hairline-2` row rules; headers 12px uppercase 600 in `faint`, sticky at the top, wrapping to two lines rather than widening the column; sortable via a borderless `th-btn` with the drawn sort icon (both arrows at 0.4 opacity when unsorted) and `aria-sort`, the sortable head in `muted`; numeric columns right-aligned mono; a `wrap` column at 220px minimum; row hover `hover`; a selected row `active`; footer totals 600 `ink` above an `edge` rule. The first column is sticky on `panel` and mono. Links in cells are `ink` over `link-line`.

**Micro-bars.** A figure that is a share of something carries a 3px track in `hairline` under it, 3px below the number: the **progress bar** (`.bar`) fills from the left in `muted` (spent against budget). The **diverging bar** (`.dbar`) has a 1px `edge` centre tick and fills `blue` to the right for a favourable variance and `red` to the left for an unfavourable one, on one scale taken from the rows on screen, so the bars down the column are the same size of thing. Both are `aria-hidden`: the number is the content.

**Footer and pager** (`.tbl-foot`): a mono 12px `faint` row count (`14 rows · showing 1–10`) and, where paged, a pager of small buttons (`First`, `Previous`, `1 / 3`, `Next`, `Last`) in the sans, over a `hairline-2` rule.

### Charts and legends
An SVG inside a `figure.chart` with a 14px/600 title row (the unit in 12px `muted` after a middle dot; a right-aligned note where one is needed), the legend under it and a `Values behind this chart` disclosure under that. SVG text is 12px sans in `muted`, tick labels in mono; axes and ink-only marks stroke `ink`; grid lines `hairline-2`; a plan, threshold or cut-off line is a 3/3 dashed `ink` line and its legend mark is hollow. Categories fill `cat-*`; a hollow mark is `ground` fill with the category stroke; a mark that stands for a record is a link, with the global `blue` focus outline on its rect or circle. The legend is a wrapping list of 11px square swatches (2px radius, `edge` border) with 12px `muted` labels; a hollow legend mark is a circle. The kinds in the build:
- **Columns** (grouped or stacked, with an optional plan tick per group); **Bars** (horizontal, one per category, value printed at the bar's end, 22px rows); **Lines** (1.75px strokes with 2.5px dots, a dashed series hollow); **Scatter** (5px marks, axis labels in the corners, `role="img"`); **Downhole profile** (900px wide, one `ink` bar per sample interval above cut-off and `dim` below, the cut-off as the dashed line, depth ticks in mono); **Split list** (a 5px stacked rule with 1px gaps over one line per share: 7px swatch, label, quantity in `faint` mono, percentage in `ink` mono at the right).
- **Values table:** a compact table inside a `<details>` whose summary is 12px `muted` with a drawn 7px chevron that rotates over 150ms; the one transition in the build.

### Workflow steps and the gantt
- **Steps** (`.steps`): a list at 13px, 7px rows over `hairline-2` rules, each a 10px dot, the step name in `ink` over a 12px `faint` line (role, actor, SLA, note in italic `muted`), and a mono 12px `faint` date or state at the right. The dot is hollow `muted` for not reached, filled `ink` for done, a 2px `blue` ring for current, filled `red` for rejected or failed. The stage history on a project and the failures on a batch use the same list.
- **Gantt** (`.gantt`): an ARIA table of 220px label column (120px on the phone) and a bar column, 12px text, `hairline-2` row rules and an `edge` rule under the mono uppercase month header. Bars are 12px tall at 2px: `ink` for a programme in the field, `muted` for complete, hollow (`muted` outline) for planned; a dashed `blue` line marks today. The legend under it names all four.

### Comments
A panel of 13px entries in a 22px avatar column and a body column: author 600 `ink`, title `muted`, time in mono `faint`, the body in `body`, preserving line breaks. The form beneath, over a `hairline-2` rule, is a textarea with a `Post comment` button aligned to its foot, disabled until there is text.

### Floating layer
- **Notifications tray:** absolute under the topbar, `min(420px, 100vw − 24px)` wide, up to `min(70vh, 620px)` tall, `panel`, `edge` border, 6px radius; a heading row and a footer row over `hairline` rules; each notification a link row over `hairline-2` (13px title with a 6px `blue` dot when unread, 12px `muted` body, mono 12px `faint` kind and age), unread rows on `well`.
- **Account menu:** the same surface at 260px minimum with 6px padding; a `who` block (name 600, role 12px `muted`) over a `hairline`, 13px item links with 3px radius, a `SWITCH USER` section label, and the tenant's users as buttons with avatars, the current one on `active`.
- **Dialogs:** a native `<dialog>` on `panel`, `edge` border, 6px radius, 16px padding, `min(560px, 92vw)` (`min(820px, 94vw)` wide), `backdrop` behind; an h2 with a quiet close button at the right, a 13px `muted` summary, a form in 12px stacks, and an action row right-aligned over a `hairline` rule with an optional left-docked control. Escape and a click on the backdrop close it.
- **Toasts:** fixed, bottom-centred at 20px, stacked 8px apart, `panel-2`, `edge` border, 6px radius, 8px × 16px padding, 13px `ink`, an optional `Open` link and a drawn close button; announced through a polite live region.

### Icons
All icons are drawn inline SVGs at 12px (14px for the bell, help, sun and moon), `currentColor` strokes of 1.5 (1.4 on the sun and moon), round caps and joins, `aria-hidden`: chevron, close, bell, search, help, external, sun, moon, sort, arrow, plus, check, star (filled when on), dots, download, filter. The disclosure chevrons in the values table and the phone L2 band are CSS borders rotated 45°. No icon fonts, no Unicode glyphs standing in for icons.

### The User Manual (Read layout)
A two-column document: a sticky 260px contents column on `chrome` with a `hairline` right edge (publisher as a section label, the title at 20px/700, the release and document number in mono 12px `muted`, a numbered list of sections whose numbers are mono `faint`, the current one on `active` with a `blue` left bar, and a `← Back to ADIT` link), beside a reading column of 78ch at 15px/1.65 with 40px × 56px padding. The h1 is 30px over a mono sub-line and a `hairline` rule; h2 is 20px over a `hairline-2` rule; h3 16px. Tables are 13px with uppercase 12px `faint` headers; `code` and `kbd` are mono 13px in a `well` box; a `.note` is a 13px `panel` box; UI names are 600 `ink`; previous/next links close the section over a `hairline` rule. Below 1000px the contents column sits above the text. The route forces `data-theme="light"` while mounted and restores the reader's theme on leaving.

## Do's and Don'ts

### Do:
- **Do** set every money-against-plan figure in `blue` or `red` with a leading + or −; a chart legend names the mapping in words.
- **Do** give every chart a labelled legend using `cat-0`…`cat-7`, pool anything past the seventh category as "other" in `cat-7`, and put every plotted value in a `Values behind this chart` table beneath.
- **Do** keep the five commodities on their fixed hues (gold `cat-0`, lithium `cat-1`, potash `cat-2`, copper `cat-3`, nickel `cat-4`) everywhere they appear, with a 9px swatch in the chip and a legend under the board.
- **Do** keep all text, including SVG text and table headers, at 12px or larger, with 12px `faint` reserved for metadata on `panel` or white.
- **Do** separate surfaces with 1px hairlines and fill steps (`ground` → `panel` → `panel-2`, `well` as a recess).
- **Do** use 4px on panels and controls, 3px on recesses, 6px on the floating layer, 12px pills only for status and environment chips.
- **Do** tell states apart by fill, dash and weight (soft, dashed, strong chips; filled, hollow, ringed and red step dots; `ink`, `muted`, hollow gantt bars), never by a categorical hue.
- **Do** print provenance once per stamp in the authority strip, and open it to the method panel rather than repeating it in captions.
- **Do** put a page's own facts in its mono meta line under the h1 and its actions at the right of the head; the topbar carries navigation and the environment chip only.
- **Do** keep the L1 sections along the top, the L2 column at left, record tabs under the page head, and collapse the L2 into a details band at 800px and below.
- **Do** hold the header and first column of a table sticky and let the rest scroll inside the panel; draw charts at their own width and scroll them rather than shrinking type.
- **Do** put a micro-bar under a figure that is a share (progress in `muted`) or a variance (diverging, `blue` right and `red` left off an `edge` tick), on one scale across the rows on screen, and keep it `aria-hidden`.
- **Do** give every token a light-theme value beside its dark one; the light theme is the same system re-mapped, with blue deepened and categorical hues darkened for white.
- **Do** draw icons as inline SVG at 12–14px, `currentColor`, 1.5 stroke.
- **Do** say the tenant is a demonstration once, in the environment chip's title, and nowhere else on any screen; an empty state says what is missing, not which dataset it is missing from.
- **Do** keep the manual in its own Read layout in its own tab, forced light, so the reader can tell they have left the application.
- **Do** take function from the domain and nothing else: a mono column because grades are compared, a downhole bar because samples run down a hole, a gantt because programmes have dates.

### Don't:
- **Don't** dress the console as the trade: no rock or core textures, no map or survey lockups, no ore-colour palettes, no stamp or seal metaphors, no hatching as texture, no kraft or paper colours. The Compass Rule.
- **Don't** carry a money sign by colour alone, and don't colour a count or a date blue or red.
- **Don't** put a colour anywhere that is not interactive state, a money sign, a field error, a destructive button's label, or a chart category.
- **Don't** use drop shadows, blur, painted gradients or texture; a `box-shadow` may only draw a 1–2px solid edge, and the only gradient is the mask that fades the L1 row where it scrolls on the phone.
- **Don't** add kicker or eyebrow labels above a title; the id sits unlabelled at the right of the heading line, and uppercase section labels head groups, rows and fieldsets only.
- **Don't** move the L1 nav into a left rail, fix anything to the foot of the page, add a keyboard-shortcut strip or an assistant, or let the topbar say how many rows a page has.
- **Don't** repeat a stamp's provenance outside its authority strip, or say anywhere but the environment chip that the data is synthetic.
- **Don't** shrink chart text, table cells or chips below 12px to fit a width; scroll the container instead.
- **Don't** use Unicode glyphs or icon fonts in place of the drawn icons.
- **Don't** hatch, pattern or texture chart categories, and don't give a state (`on hold`, `planned`, `below cut-off`) a `cat-*` hue.
- **Don't** give the console the manual's 15px/30px sizes, or the manual the console's shell; the two layouts share tokens, not chrome.
