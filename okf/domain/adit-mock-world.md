---
type: Domain Concept
title: ADIT and Kestrel Range Resources — the invented product, vendor, tenant and domain
description: What the mock enterprise app is, who its invented users are, what records it holds and how the synthetic data is made; all invented on 2026-09-21.
tags: [domain, adit, mock-world, mining-exploration]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: draft
---

# ADIT and Kestrel Range Resources

**Everything here is invented**: a generalized remote mining exploration app,
highly specialized, built for experts, not self-explanatory, believable to a
non-expert, with a vendor's user manual. Any of the names may be renamed.

## The product

**ADIT Exploration Management System, release 7.4** (shown as "ADIT EMS 7.4",
build 7.4.2 in the footer), by the vendor **Brannock Geosystems**. Support
line and email are `.example` addresses. The tenant is **Kestrel Range
Resources** (code `KRR`), a mid-tier explorer with projects in Canada, the
United States, Australia, Chile, Finland and Argentina. The top bar carries a
dashed `DEMO` chip whose title says "Demonstration tenant · synthetic data";
that is the only place the app says its figures are invented.

## The record chain (the app's thesis)

project → tenements and programmes → drillholes → sample batches → samples
and grades → intercepts → resource estimates → value under a price deck, with
approvals gating spend and a stage-gate decision ending each stage. The manual
says this in its first section; every screen is built to let a figure be
traced back down the chain.

## Five commodities

| Code | Name | Deposit style | Grade | Metal unit | Price unit |
|---|---|---|---|---|---|
| Au | Gold | orogenic vein / Carlin-style | Au g/t | oz | USD/oz |
| Li | Lithium | LCT pegmatite (and one brine, closed) | Li₂O % | t Li₂O | USD/t SC6 |
| K | Potash | evaporite (sylvinite) | KCl % | t KCl | USD/t KCl |
| Cu | Copper | porphyry Cu-Mo | Cu % | t Cu | USD/lb |
| Ni | Nickel | magmatic Ni-Cu sulphide | Ni % | t Ni | USD/t |

Each has its own assay method, hole types, cut-off, grade range and secondary
elements. Diamonds are deliberately not among them.

## Stages, statuses and workflows

Pipeline stages: Reconnaissance → Target generation → Drilling → Resource
definition → Scoping study → Stage-gate decision. Project status: active,
on-hold, closed (outcome advanced / relinquished / divested). Programme
phases: draft → scoped → costed → approved → mobilising → in-progress →
demobilising → complete (or cancelled). Hole statuses: planned, drilling,
completed, abandoned, logged, sampled, assayed. Batch statuses: submitted,
in-prep, analysing, received, qaqc-hold, accepted, rejected. Estimate
statuses: draft, internal-review, qp-review, released, superseded. Eight
approval workflows, each a sequence of role-owned steps with SLAs (programme,
budget variance, stage gate, land access, permit, resource release, tenement
renewal, purchase order).

## People

Seven active ADIT users with distinct roles (exploration manager, senior
project geologist, database geologist, field logistics coordinator, finance
controller, tenure and permitting officer, system administrator), one more
project geologist, one deactivated geologist (a deliberate vacancy on Cerro
Azufre), and twelve field staff who appear on crew rotations but do not sign
in. Roles carry permission codes (`gate.decide`, `qaqc.review`, …) that gate
the actions each screen offers. "Sign in" is a user switcher in the account
menu.

## The fourteen projects

Eleven active across the six stages (Wolverine Creek, Bellamy Ridge, Tarrant
Hills, Mount Aster, Lorimer, Dunmore Flats, Cerro Azufre, Copper Hollow, Kettle
Lake, Hjalmar Belt, Sable Dome), one on hold (Orrin Creek, awaiting land
access), two closed (Pinnacle Salar advanced to pre-feasibility; Marrow Gulch
relinquished). Ids `PRJ-0351`…`PRJ-0468`. Drillhole ids take a two-letter
project prefix (`WC-DDH-014`).

## How the data is made

`adit/src/data/world.ts` builds the whole tenant from a seeded PRNG (seed
7401) at load: about 273 holes, 113 batches, 19,700 samples with QAQC
insertions and failures against the tenant's tolerances, 330 intercepts, 8
estimates, 44 approvals, notifications per user, an audit trail. Older
programmes are sampled selectively (mineralised zones plus shoulders) to keep
the sample count down. The tenant's "now" is fixed at 2026-09-21 14:32 UTC and
advances a minute or so per user action. Every user action (approve, comment,
assign, decide, edit settings, run the optimiser) changes state that persists
in `localStorage`; Admin → System settings can reset the tenant. Samples are
never persisted; they are regenerated from the seed.

## What is deliberately absent

No AI assistant (Alejandro). No backend. No mention anywhere in the app of
why the mock exists. No real company, person or dataset.
