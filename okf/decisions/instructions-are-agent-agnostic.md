---
type: Decision
title: Instructions are agent-agnostic, and session memory stays out of the repository
description: AGENTS.md is the one orientation file, CLAUDE.md a symlink to it; okf/ holds stable reference knowledge only; logs, requests and handoff notes are kept privately because the repository is public.
tags: [decision, agents, okf]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: stable
---

# Instructions are agent-agnostic; session memory stays out

The repository is public, so it holds what is true and decided about the
project, and nothing about the sessions that produced it (Alejandro, 2026-09-25).

## The choice

- `AGENTS.md` is the orientation file. `CLAUDE.md` is a symlink to it. Never two copies.
- `okf/` holds what is true and decided about the project: the charter, the decisions, the mock world. It has no log, no stage report, no open-questions list and no record of requests.
- Session history, handoff notes and requests as understood live in each agent's private memory, outside the repository. No skill or hook in the repository writes them.
- Skills we write ourselves, if any, go in `.agents/skills/<name>/` with symlinks from `.claude/skills/<name>` and `.cursor/skills/<name>`.

## Consequences

- `okf/log.md` is gitignored as a guard against an agent recreating it out of habit.
- Continuity across devices comes from the code, this bundle and the git history, plus whatever private memory each agent keeps.
