---
type: Decision
title: The design system is a data-ops console, recorded in DESIGN.md
description: DESIGN.md, its sidecar, the tokens and the font describe the built app (2026-09-22) and are the record.
tags: [decision, design, impeccable]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: stable
---

# The design system is a data-ops console, recorded in DESIGN.md

## The choice

- `DESIGN.md` is the written system: rules, type scale, components and named rules (The Compass Rule and the rest).
- `.impeccable/design.json` is its machine-readable sidecar.
- `design/tokens.css` holds the `:root` and `:root[data-theme="light"]` token blocks. It is the value of record for tokens.
- `design/fonts/` holds Sometype Mono, self-hosted.
- **2026-09-22:** the impeccable documenter derived `DESIGN.md` and `.impeccable/design.json` from the built app, so they describe ADIT's own components.

## Consequences

- Every surface is in the data-ops console world: near-black hue-free ground, hairlines not shadows, one functional blue, a signed blue/red pair, eight categorical hues with a legend, mono figures, 12px floor, dark by default with a light translation.
- A change to a token happens in `design/tokens.css` and `DESIGN.md` together.
