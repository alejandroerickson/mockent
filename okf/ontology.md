---
type: Ontology
title: Concept types and editing rules
description: The concept types this bundle uses, the frontmatter each concept carries, and the rules for editors.
tags: [ontology, okf]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: stable
---

# Ontology

Ordinary Markdown links are the graph. The structure on top is deliberately
small so that a session actually updates it.

## Frontmatter

| Key | Meaning |
|---|---|
| `type` | One of the concept types below. Required. |
| `title` | A sentence, not a filename. |
| `description` | One line: what a reader gets from this file. |
| `tags` | A short list for grep. |
| `generated` | `{by: agent:<name>, at: <ISO date>}`: who wrote it and when it last changed. |
| `status` | `draft` (agent-written, unreviewed), `stable` (settled), `deprecated` (superseded, say by what). |
| `sources` | Where a claim came from, when outside the bundle. Each entry: `id`, `title`, `resource`. |

## Concept types

| Type | Used for |
|---|---|
| `Index` | A map of a directory. |
| `Bundle Guide` | This bundle's operating manual (`README.md`). |
| `Ontology` | This file. |
| `Charter` | What the repo is and is not. The authority on intent. |
| `Decision` | A durable choice: context, the choice, consequences, what it constrains. |
| `Process` | A rule for how agents or the project work. |
| `Tooling` | A script in this bundle and how to run it. |
| `Domain Concept` | Knowledge about the mock enterprise's world (`domain/`). |
| `System Concept` | How a part of the app actually works. |

A new type gets its row here, and in `tools/validate_okf.py`, the same
session it is first used.

## Rules for editors

- **Say where a claim comes from**: observed in the code, decided by Alejandro (dated), or inferred; never a record of what was said in a session.
- **Correct in place, and date the correction.** Mark a wholly wrong concept `deprecated`, and never leave two concepts silently disagreeing.
- **Do not write a proposal as though it were decided.**
- **Link, do not copy.** Code and design records stay where they are.
- **The charter governs.** If you think it is wrong, that is a conversation with Alejandro, not an edit.
- **Short beats complete.** A concept nobody updates is worse than three accurate sentences.
