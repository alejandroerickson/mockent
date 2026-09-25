---
type: Index
title: Mockent knowledge bundle
description: The map of the bundle; stable reference knowledge about the repository, its decisions and the invented world.
tags: [index, okf]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: stable
okf_version: "0.2"
---

# Mockent knowledge bundle

What this repository is for, what has been decided, and what the invented
world of the app is. This is reference knowledge, not a log: there is no
session history or to-do list here (see [the bundle guide](README.md)).

## Map

- [Charter](project/charter.md): what this repository is and is not.
- [Decisions](decisions/index.md): durable choices and what they constrain.
- [The mock world](domain/adit-mock-world.md): ADIT, Brannock Geosystems, Kestrel Range Resources, the five commodities, the record chain and how the data is generated.
- [Ontology](ontology.md), [bundle guide](README.md), [tools](tools/index.md).

## Outside the bundle

- Agent orientation: `AGENTS.md` at the root (`CLAUDE.md` is a symlink to it).
- Design records: `PRODUCT.md`, `DESIGN.md` and `.impeccable/design.json`, `.impeccable/surfaces/adit-index-html.md` (the direction contract), `design/` (tokens and font).
- The app: `adit/` (Vite + React + TypeScript). `adit/src/data/world.ts` is the tenant; `adit/src/pages/Manual.tsx` is the user manual.
- Deploy: `.github/workflows/pages.yml`, `scripts/build-pages.sh`, `site/`.
- Human-facing: `README.md`.
