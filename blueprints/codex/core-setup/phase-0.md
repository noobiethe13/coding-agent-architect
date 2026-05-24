---
title: "Phase 0: Global Behavioral Guidelines"
description: "Installs universal behavioral principles into ~/.codex/AGENTS.md across all projects on your machine."
tool: "codex"
type: "setup"
author: "noobiethe13"
verified_version: "0.133.0"
recommended_model: "GPT-5.5"
tags: ["global", "behavior", "onetime"]
---

## What this does

This prompt installs universal behavioral principles into `~/.codex/AGENTS.md` (Codex's user-level instruction file, the direct analog of `~/.claude/CLAUDE.md`). These principles persist across every Codex CLI session you run on this machine, regardless of the project. Codex loads them at session start as the first layer of its instruction chain — before any project-level `AGENTS.md`.

## Prerequisites & Execution

- **When to skip:** If you already see the marker `# CODEX-PROMPTS-PHASE-0-INSTALLED` near the top of `~/.codex/AGENTS.md`, this phase is already complete.
- **Run frequency:** Run this once per machine. Subsequent project setups should not re-run Phase 0.
- **Token cost:** Low. Single short turn with one numbered-list question for the user.
- **`CODEX_HOME` note:** If you have set `CODEX_HOME` to a non-default location, substitute that path for `~/.codex/` everywhere below.

## The Prompt

Copy the text below and paste it directly into your Codex CLI terminal.

````text
You are setting up universal behavioral guidelines for Codex CLI that
apply across every project on this machine. These are project-agnostic
principles about HOW Codex should approach work — not project-specific
knowledge.

This phase writes to ~/.codex/AGENTS.md (Codex's user-level AGENTS.md,
loaded into every session across every project — the first layer of the
instruction chain, before any project AGENTS.md). If CODEX_HOME is set,
use that path instead of ~/.codex.

PRE-FLIGHT — CHECK FOR EXISTING INSTALLATION

Read ~/.codex/AGENTS.md if it exists. If you find the marker comment
"# CODEX-PROMPTS-PHASE-0-INSTALLED" anywhere in the file, post this and
stop:

"Phase 0 is already installed at ~/.codex/AGENTS.md (marker found). To
reinstall or update, manually remove the marker line first."

Also check for ~/.codex/AGENTS.override.md. If it exists and is non-empty,
Codex will read it instead of AGENTS.md at the global scope, so warn the
user:

"Heads up: ~/.codex/AGENTS.override.md exists and takes precedence over
AGENTS.md at the global scope. The principles I'm about to install in
AGENTS.md will be ignored at session start until the override is removed
or emptied. Want me to (1) proceed anyway, (2) write to the override
file instead, or (3) stop so you can resolve manually?"

Wait for the user's reply. Otherwise proceed.

SELF-VERIFICATION

Before writing anything, verify against current Codex documentation:
- Confirm ~/.codex/AGENTS.md is still the correct path for the global
  instruction file by checking
  https://developers.openai.com/codex/guides/agents-md
- Confirm the discovery hierarchy (override.md first, then AGENTS.md,
  then any project_doc_fallback_filenames) is unchanged
- Confirm project_doc_max_bytes default (32 KiB) so this installation
  doesn't exceed it on its own

If you can fetch the docs and the schema differs from what's described
here, follow the docs and tell the user what differed. If you cannot
fetch the docs, tell the user and ask whether to proceed using the
schema in this prompt.

TURN 1 — ELICIT PRINCIPLES THE USER WANTS

Codex has no structured multi-select picker like AskUserQuestion. Render
the two questions below as a single numbered markdown block and wait for
the user's reply.

Post EXACTLY this in chat (substitute nothing — the user reads it
verbatim):

────────────────────────────────────────────────────────────────────
**Question 1 — Approach principles** (multi-select; reply with comma-
separated numbers, e.g. `1,3`)

Which approach principles should Codex follow across every project?

1. **Think Before Coding** — Before writing code, Codex takes a moment
   to: (1) understand the actual requirement (re-read the prompt; ask if
   ambiguous), (2) consider 2-3 approaches, (3) pick the simplest one
   that fits. For non-trivial tasks, propose the approach in chat before
   implementing. For trivial edits, just do it.

2. **Simplicity First** — Prefer the simplest solution that meets the
   requirement. Don't add abstraction unless there are 2+ concrete uses.
   Don't add config options unless asked. Don't refactor adjacent code
   unless asked. Two similar instances aren't a pattern; three are.
   Abstract only after the same shape shows up three times in real code
   — not on suspicion.

3. **Surgical Changes** — When modifying existing code, change as little
   as possible to accomplish the goal. Preserve existing patterns even
   if you'd write them differently from scratch. Don't drive-by-fix
   unrelated issues — surface them separately. Keeps diffs reviewable
   and reduces unintended breakage.

4. **Honest Uncertainty** — When Codex doesn't know something — about
   the codebase, about an API, about the user's intent — say so plainly.
   Don't fabricate confident-sounding answers. A quick clarifying
   question is cheaper than fixing a wrong implementation.

**Question 2 — Code-quality principles** (multi-select; reply with
comma-separated numbers, e.g. `2,4`)

Which code-quality principles should Codex follow across every project?

1. **Comment discipline** — Comments explain *why*, not *what*. No
   banner comments or ASCII separators (`// ===== HEADERS =====` or
   `// ─── HEADERS ───`). Use docstrings for public APIs or methods that
   genuinely need detailed explanation; inline comments only when the
   code itself can't be rewritten to be clearer. If you find yourself
   writing 'this is a workaround because…' or 'we do this instead of X
   because…', that's exactly when an inline comment is justified.

2. **Modular files (no god files)** — When a file's name no longer
   describes its contents, or it exceeds ~400 lines with mixed
   responsibilities, extract. But don't preemptively split — extract
   when the second responsibility actually shows up, not on suspicion.
   A 600-line file doing one thing well is fine; a 200-line file
   mixing three concerns is not.

3. **Failure handling discipline** — Never swallow exceptions silently.
   Either handle (log + recover at the right layer) or let them
   propagate. `try { ... } catch {}` with no logic is a bug. Make
   failures loud at the right boundary. Input validation belongs at
   module edges; trust internally. Don't catch what you can't
   meaningfully handle.

4. **Goal-Driven verification** — Never mark a task complete without
   verifying it works. If automated verification is possible (tests,
   type-check, lint), run it. If not, get user confirmation before
   declaring done. Ask: 'Would a staff engineer approve this as
   production-ready?' If not, keep going.

────────────────────────────────────────────────────────────────────

Reply with both answers in the format:
`Q1: 1,2,3,4`
`Q2: 1,2,3,4`

Or `Q1: all` / `Q2: all` for everything, or `Q1: none` to skip a
question.

Wait for the user's reply before proceeding.

TURN 2 — WRITE TO ~/.codex/AGENTS.md

If ~/.codex/AGENTS.md does not exist, create it. If it exists and does
NOT contain the marker, append to it (preserving any existing content).
The ~/.codex/ directory is created automatically when Codex first runs;
if it's missing for some reason, create it.

Insert a clearly delimited section like this (adapt the principles to
match what the user picked across BOTH questions — only include the
ones they selected):

```
<!-- BEGIN PHASE 0 GLOBAL GUIDELINES -->
# CODEX-PROMPTS-PHASE-0-INSTALLED

## Universal Behavioral Principles

These principles apply across every project on this machine. Codex
loads this file at session start before any project AGENTS.md, so the
guidance here is the baseline for every conversation.

### Think Before Coding
[Selected: write the principle body verbatim from the question text]

### Simplicity First
[etc.]

### Comment discipline
[etc.]

[Only include principles the user selected across both questions.
Order: approach principles first (Q1), then code-quality principles
(Q2).]

<!-- END PHASE 0 GLOBAL GUIDELINES -->
```

A few important notes:

- HTML comments (`<!-- ... -->`) survive in AGENTS.md and serve as
  maintainer markers. They're cheap (small token cost) and make
  future updates safer.

- Keep the inserted section under ~5 KB so it doesn't dominate the
  32 KiB project_doc_max_bytes budget. If the user picked all 8
  principles, the bodies above fit comfortably.

- If AGENTS.md exceeds 32 KiB after this write, warn the user that
  Codex may truncate later files in the chain. Suggest moving rarely-
  referenced content to a path-scoped AGENTS.md (under a specific
  subdirectory) or raising `project_doc_max_bytes` in
  `~/.codex/config.toml`.

TURN 3 — CONFIRM AND CLOSE

Post a single line in chat:
"Phase 0 complete — global behavioral principles installed at
~/.codex/AGENTS.md. They take effect on the next Codex session
(restart this one if you want them active immediately)."

Do not write any other file. Do not create directories beyond
~/.codex/ if it was missing. This phase touches exactly one file.
````
