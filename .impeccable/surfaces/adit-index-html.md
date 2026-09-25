---
version: 1
slug: "adit-index-html"
primary_target: "adit/index.html"
related_targets: ["adit/src/App.tsx","adit/src/app.css","adit/src/shell/Shell.tsx","adit/src/data/world.ts"]
---

## Surface

**ADIT 7.4, the whole application shell and its sections**, in the data-ops console world. Mode: **Operate** (the User Manual route inside it is **Read**). Primary target `adit/index.html`; the app is `adit/src/`. Audience: the expert users of an invented mineral-exploration product (Kestrel Range Resources' seven named staff), judged by a careful non-expert. Task: plan, staff, budget, drill, assay, evaluate, approve and close out exploration projects across five commodities; read a forecast back to the assay it rests on. Content: everything is authored synthetic data generated from a fixed seed. Constraints: `DESIGN.md` as written (near-black console, hairlines not shadows, Sometype Mono figures, blue for interactive state and positive money, red for negative money, categorical hues in charts only, 12px floor, L1 along the top, L2 column at left, one column on the phone, light theme behind a toggle); WCAG 2.2 AA; hash routing under the Pages base path; no AI assistant; the environment chip says the data is synthetic once, nowhere else; nothing in copy, markup or data refers to why the mock exists.

## Direction contract

THESIS: The portfolio is a **stage board**. The home reads left to right as the pipeline every project moves through (Reconnaissance → Target generation → Drilling → Resource definition → Scoping → Decision), each column holding its projects as tickets with the money and metres at stake in that stage; what needs attention (approvals overdue, tenure expiring, QAQC failures, programmes over budget) is a ledger beneath, and the register is last. It refuses the KPI-card row over a chart stack and the "recent activity" feed.

OWN-WORLD: the console, unchanged: `ground` page, `panel` surfaces with `hairline` borders, `panel-2` tickets, `well` recesses; system sans prose at 13–14px, Sometype Mono tabular figures with the unit as a sans word beside them; `blue` only on the current tab, the primary button, focus, and positive money; `red` on negative money; five commodities in `cat-0`…`cat-4` with a legend; status as neutral chips told apart by fill, dash and weight.

STORY: An exploration manager opens ADIT, sees where every project sits in the pipeline and what is stuck, opens the thing that is stuck, acts on it (approves, assigns, comments, decides), and the notification and audit trail record it. A newcomer opens the manual in a second tab and reads how.

FIRST VIEWPORT: The 48px topbar: brand ADIT with the module mark, nine L1 sections, at right the environment chip, search, notifications with a count, the user menu, Help (opens the manual in a new tab), theme. The L2 column at left lists the home's shapes (By stage, By commodity, By jurisdiction) and the watch list. Content: the page head (`Portfolio · Kestrel Range Resources`, the fiscal year and as-of date as mono meta), then the stage board spanning the width, six columns, each headed by its stage name, its count and its committed spend, holding tickets (project id in mono, name, commodity chip, the stage's live figure); then the attention ledger; then the projects register.

FORM: Structure 4 of the ranked seven ("the stage board"; the deal was indices 4, 5, 6 of the grounded list and index 4 led). Seed key `8e1cc7d9`. Code-led: no image generation exists in this harness, so the comp round is skipped by contract and the ambition rides in FIRST VIEWPORT and the signature interaction, which is the stage board itself: a ticket opens its project, a column head opens the register cut to that stage.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Stated decisions

- **Sections (L1):** Portfolio, Projects, Programmes, Drilling, Assays, Resources, Approvals, Optimiser, Admin. Each user's own settings hang off the user menu. The manual is a route (`#/manual`) with its own Read layout, opened with `target="_blank"`.
- **Five commodities**: gold (Au g/t), lithium (Li₂O %), potash (KCl %), copper (Cu %), nickel (Ni %); each keeps its own units, hole types and forecast method.
- **Every action is real in the browser**: approvals, assignments, comments, settings and the optimiser change state that persists in `localStorage`; Admin can reset the tenant to its seed.
- **The environment chip** in the topbar reads `DEMO` with the title "Demonstration tenant · synthetic data"; nothing else on any screen says the figures are invented.

## Unresolved

- The vendor, product and tenant names are invented and may be renamed by Alejandro.
- Whether a backend ever exists.
