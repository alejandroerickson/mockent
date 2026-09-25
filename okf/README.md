---
type: Bundle Guide
title: Mockent OKF bundle guide
description: What this bundle is, how it is laid out, and how to keep it accurate.
tags: [guide, okf]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: stable
---

# The OKF bundle

An [Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf)-style
bundle: plain Markdown with YAML frontmatter, ordinary cross-links, and
provenance. It holds **stable reference knowledge** about the repository:
what it is for, the durable decisions, and the invented world of the app.

It is **not** a memory or a log. This repository is public, so session
history, requests, handoff notes and to-do lists are kept privately, outside
it (see `AGENTS.md`).

## Layout

- [project/](project/index.md): the [charter](project/charter.md).
- [decisions/](decisions/index.md): durable choices, each with what it constrains.
- [domain/](domain/adit-mock-world.md): the invented world of the app.
- [ontology.md](ontology.md): concept types, frontmatter, editing rules.
- [tools/](tools/index.md): the validator.

## Keeping it accurate

When a change makes a concept untrue, correct the concept in place and bump
its `generated.at`. Prefer correcting a concept to adding a near-duplicate.

## Validating

```sh
python3 okf/tools/validate_okf.py
```

Missing frontmatter, unknown types, broken links inside the bundle and
concepts no index links to fail; links out of the bundle that do not resolve
warn.

## Trust

Everything here is agent-written unless a line attributes it to Alejandro, with
a date. Inferences are marked as inferences. `status: draft` means an agent
wrote it and nobody has confirmed it.
