---
type: Decision
title: main takes direct pushes but cannot be force-pushed or deleted
description: A repository ruleset on main blocks force-pushes and deletion only; ordinary pushes, including agents' pushes, go straight to main.
tags: [decision, git, github, branch-protection]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: stable
---

# main takes direct pushes but cannot be force-pushed or deleted

**Alejandro's standing rule:** protect `main` from deletion and
force-pushing, but not from pushing.

Implemented as a GitHub **repository ruleset** named `main`, targeting the
default branch, with two rules: `deletion` and `non_fast_forward`. No bypass
list, no required reviews, no required status checks.

## Consequences

- `main` is both the working branch and the live site. The Pages workflow's tests gate the deploy, not the push.
- Never rewrite published history. A bad commit is fixed with a new commit or a `git revert`.
- Two devices push to the same `main`, so every session starts with `git pull --rebase --autostash` (`AGENTS.md`).
