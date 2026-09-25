---
type: Decision
title: The mock app is ADIT, an invented mineral-exploration management system, built in React under adit/
description: Alejandro's 2026-09-21 brief fixed the domain and the stack in outline; the names, sections and data model were invented during the build and can be renamed.
tags: [decision, product, stack]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: draft
---

# The mock app is ADIT

**Context.** Alejandro's brief (2026-09-21): a generalized remote mining exploration app for experts, five
different commodities, multiple users, notifications, workflows, admin and
user settings, logistics, results, forecasts, analytics, budgets, an
optimisation interface, approvals, stage outcomes, a vendor user manual in a
new tab, a React app, realistic ARIA, no AI assistant, and nothing in the
app about why the mock exists.

**Decision.** The specifics were left to the build:

- Vendor **Brannock Geosystems**, product **ADIT EMS 7.4**, tenant **Kestrel
  Range Resources**. Commodities gold, lithium, potash, copper, nickel.
- Stack: Vite 7 + React 19 + TypeScript, `react-router` hash routes, no
  backend, seeded in-browser data, `localStorage` persistence, Vitest tests
  (the deploy script runs `npm test`). Folder `adit/`, published at
  `alejandroerickson.com/mockent/adit/`.
- Nine top-bar sections: Portfolio, Projects, Programmes, Drilling, Assays,
  Resources, Approvals, Optimiser, Admin; account pages under the user menu;
  the manual at `#/manual` in its own layout, forced to the light theme.
- The stylesheet applies the [design system](design-system.md); `adit/src/app.css`
  imports `design/tokens.css` and adds the app's component CSS in the same
  vocabulary.

**Consequences.** The full world is described in
[the domain concept](../domain/adit-mock-world.md). Renaming vendor, product
or tenant is a find-and-replace in `adit/src/data/world.ts`, the manual and
the shell. Anything beyond the brief remains
inferred and is marked so in `PRODUCT.md`.
