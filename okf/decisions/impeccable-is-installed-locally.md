---
type: Decision
title: impeccable is installed locally, not committed; its hook manifests are committed
description: The impeccable skill copies and subagents are gitignored and installed with npx impeccable install; the project-relative hook manifests are committed and inert until the skill is installed; buildPath is comp.
tags: [decision, impeccable, design, hooks]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: stable
sources:
  - id: impeccable
    title: impeccable, the design skill (Apache-2.0)
    resource: https://github.com/pbakaus/impeccable
---

# impeccable is installed locally, not committed

**Decided by Alejandro, 2026-09-25.** impeccable is third-party code with its
own licence and installer; the repository keeps only its records and hooks.

## The choice

- **Not committed.** `npx impeccable install` writes the skill copies
  (`.agents/skills/impeccable/`, `.claude/skills/impeccable/`,
  `.cursor/skills/impeccable/`) and the subagents (`.claude/agents/`,
  `.cursor/agents/`); all are gitignored, as is the per-platform binary the
  launcher downloads on first run.
- **The hook manifests are committed**: `.claude/settings.json`,
  `.codex/hooks.json`, `.cursor/hooks.json`. Their paths are
  project-relative, and each command checks that the skill's launcher exists
  before running it, so a clone without the skill is unaffected.
- **Do not run `/impeccable hooks on`**: it would write a second manifest into
  the gitignored `.claude/settings.local.json` and fire the detector twice.
- `.impeccable/config.json` records `buildPath: comp` (an image sets the bar
  before code) and `hook.enabled: true`.
- **impeccable's records are committed**: `PRODUCT.md`, `DESIGN.md`,
  `.impeccable/design.json`, `.impeccable/surfaces/`. Session scratch under
  `.impeccable/` is gitignored.

## Consequences

- A fresh clone needs `npx impeccable install` once before design work.
- Updating the skill is `npx impeccable update`; nothing to commit.
