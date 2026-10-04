---
type: Decision
title: impeccable is installed locally, not committed; its hook manifests are committed
description: impeccable is installed once per machine (npx impeccable install --global), not in the repo; the committed hook manifests call that machine-wide copy and are inert without it; buildPath is comp.
tags: [decision, impeccable, design, hooks]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: stable
sources:
  - id: impeccable
    title: impeccable, the design skill (Apache-2.0)
    resource: https://github.com/pbakaus/impeccable
---

# impeccable is installed locally, not committed

**Decided by Alejandro, 2026-09-25; revised 2026-10-04** to a machine-wide
install instead of a per-repo one. impeccable is third-party code with its
own licence and installer; the repository keeps only its records and hooks.

## The choice

- **Not in the repo.** `npx impeccable install --global` installs the skill
  and subagents once per machine, under `~/.claude/`, `~/.agents/` and
  `~/.cursor/`. The old per-repo paths stay gitignored.
- **The hook manifests are committed**: `.claude/settings.json`,
  `.codex/hooks.json`, `.cursor/hooks.json`. They call the machine-wide
  launcher under `$HOME`, and each command checks that it exists first, so a
  machine without impeccable is unaffected.
- **Do not run `/impeccable hooks on`**: it would write a second manifest into
  the gitignored `.claude/settings.local.json` and fire the detector twice.
- `.impeccable/config.json` records `buildPath: comp` (an image sets the bar
  before code) and `hook.enabled: true`.
- **impeccable's records are committed**: `PRODUCT.md`, `DESIGN.md`,
  `.impeccable/design.json`, `.impeccable/surfaces/`. Session scratch under
  `.impeccable/` is gitignored.

## Consequences

- A new machine needs `npx impeccable install --global` once before design work.
- Updating the skill is `npx impeccable update --global`; nothing to commit.
