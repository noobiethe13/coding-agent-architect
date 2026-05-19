---
title: "Phase 0: Global Behavioral Guidelines"
description: "Installs universal behavioral principles into ~/.claude/CLAUDE.md across all projects on your machine."
tool: "claude-code"
type: "setup"
author: "noobiethe13"
verified_version: "2.1.143"
recommended_model: "Opus 4.7"
tags: ["global", "behavior", "onetime"]
---

## What this does

This prompt installs universal behavioral principles into `~/.claude/CLAUDE.md` (the User-level memory). These principles persist across every Claude Code session you run on this machine, regardless of the project.

## Prerequisites & Execution

- **When to skip:** If you already see the marker `# CLAUDE-PROMPTS-PHASE-0-INSTALLED` near the top of `~/.claude/CLAUDE.md`, this phase is already complete.
- **Run frequency:** Run this once per machine. Subsequent project setups should not re-run Phase 0.
- **Token cost:** Low. Single short turn with one `AskUserQuestion` interaction.

## The Prompt

Copy the text below and paste it directly into your Claude Code terminal.

````text
You are setting up universal behavioral guidelines for Claude Code that apply
across every project on this machine. These are project-agnostic principles
about HOW Claude should approach work — not project-specific knowledge.

This phase writes to ~/.claude/CLAUDE.md (the User-level CLAUDE.md, loaded
into every session across every project).

PRE-FLIGHT — CHECK FOR EXISTING INSTALLATION

Read ~/.claude/CLAUDE.md if it exists. If you find the marker comment
"# CLAUDE-PROMPTS-PHASE-0-INSTALLED" anywhere in the file, post this and stop:

"Phase 0 is already installed at ~/.claude/CLAUDE.md (marker found). To reinstall or update, manually remove
the marker line first."

Otherwise proceed.

SELF-VERIFICATION

Before writing anything, verify against current Claude Code documentation:
- Confirm ~/.claude/CLAUDE.md is still the correct path for User-level memory
  by checking https://code.claude.com/docs/en/memory
- Confirm CLAUDE.md files load via the documented walk-up-the-tree mechanism

If you can fetch the docs and the schema differs from what's described here,
follow the docs and tell the user what differed. If you cannot fetch the
docs, tell the user and ask whether to proceed using the schema in this
prompt.

TURN 1 — ELICIT PRINCIPLES THE USER WANTS

Use the AskUserQuestion tool to find out which behavioral principles the user
wants installed globally. Do NOT post the questions as chat text — use the
tool so the user gets a proper interactive picker.

The two questions below are issued in ONE AskUserQuestion call (the tool
supports 1-4 questions per call, each with 2-4 options).

AskUserQuestion with:
- questions: [
    {
      question: "Which approach principles should Claude follow across every project?",
      header: "Approach",
      multiSelect: true,
      options: [
        {
          label: "Think Before Coding",
          preview: "**Think Before Coding**\n\nBefore writing code, Claude takes a moment to: (1) understand the actual requirement (re-read the prompt; ask if ambiguous), (2) consider 2-3 approaches, (3) pick the simplest one that fits.\n\nFor non-trivial tasks, propose the approach in chat before implementing. For trivial edits, just do it."
        },
        {
          label: "Simplicity First",
          preview: "**Simplicity First**\n\nPrefer the simplest solution that meets the requirement. Don't add abstraction unless there are 2+ concrete uses. Don't add config options unless asked. Don't refactor adjacent code unless asked.\n\nTwo similar instances aren't a pattern; three are. Abstract only after the same shape shows up three times in real code — not on suspicion."
        },
        {
          label: "Surgical Changes",
          preview: "**Surgical Changes**\n\nWhen modifying existing code, change as little as possible to accomplish the goal. Preserve existing patterns even if you'd write them differently from scratch. Don't drive-by-fix unrelated issues — surface them separately.\n\nThis keeps diffs reviewable and reduces unintended breakage."
        },
        {
          label: "Honest Uncertainty",
          preview: "**Honest Uncertainty**\n\nWhen Claude doesn't know something — about the codebase, about an API, about the user's intent — say so plainly. Don't fabricate confident-sounding answers.\n\nA quick clarifying question is cheaper than fixing a wrong implementation."
        }
      ]
    },
    {
      question: "Which code-quality principles should Claude follow across every project?",
      header: "Code quality",
      multiSelect: true,
      options: [
        {
          label: "Comment discipline",
          preview: "**Comment discipline**\n\nComments explain *why*, not *what*. No banner comments or ASCII separators (`// ===== HEADERS =====` OR `// ─── HEADERS ───`). Use docstrings for public APIs or any other methods that might need detailed explanation; inline comments only when the code itself can't be rewritten to be clearer.\n\nIf you find yourself writing 'this is a workaround because…' or 'we do this instead of X because…', that's exactly when an inline comment is justified."
        },
        {
          label: "Modular files (no god files)",
          preview: "**Modular files**\n\nWhen a file's name no longer describes its contents, or it exceeds ~400 lines with mixed responsibilities, extract.\n\nBut don't preemptively split — extract when the second responsibility actually shows up, not on suspicion. A 600-line file doing one thing well is fine; a 200-line file mixing three concerns is not."
        },
        {
          label: "Failure handling discipline",
          preview: "**Failure handling discipline**\n\nNever swallow exceptions silently. Either handle (log + recover at the right layer) or let them propagate. `try { ... } catch {}` with no logic is a bug.\n\nMake failures loud at the right boundary. Input validation belongs at module edges; trust internally. Don't catch what you can't meaningfully handle."
        },
        {
          label: "Goal-Driven verification",
          preview: "**Goal-Driven verification**\n\nNever mark a task complete without verifying it works. If automated verification is possible (tests, type-check, lint), run it. If not, get user confirmation before declaring done.\n\nAsk: 'Would a staff engineer approve this as production-ready?' If not, keep going."
        }
      ]
    }
  ]

Wait for the user's responses.

TURN 2 — WRITE TO ~/.claude/CLAUDE.md

If ~/.claude/CLAUDE.md does not exist, create it. If it exists and does NOT
contain the marker, append to it (preserving any existing content).

Insert a clearly delimited section like this (adapt the principles to match
what the user picked across BOTH questions):

```
<!-- BEGIN PHASE 0 GLOBAL GUIDELINES -->
# CLAUDE-PROMPTS-PHASE-0-INSTALLED

## Universal Behavioral Principles

These principles apply across every project on this machine.

### Think Before Coding
[Selected: write the principle body verbatim from the preview shown to the user]

### Simplicity First
[etc.]

### Comment discipline
[etc.]

[Only include principles the user selected across both questions.
Order: approach principles first, then code-quality principles.]

[etc. — only include principles the user selected]

<!-- END PHASE 0 GLOBAL GUIDELINES -->
```

Use HTML-style block comments to delimit the section (per the docs, block-level
HTML comments are stripped before injection into Claude's context, so they
serve as maintainer markers without consuming tokens at runtime).

TURN 3 — CONFIRM AND CLOSE

Post a single line in chat:
"Phase 0 complete — global behavioral principles installed at ~/.claude/CLAUDE.md."

Do not write any other file. Do not create directories. This phase touches
exactly one file.
````
