---
title: "Phase 0: CLAUDE.md Augmentation"
description: "Augments an existing project CLAUDE.md with a Lessons Learned section, structural red-flag review, and index placeholders."
tool: "claude-code"
type: "setup"
author: "noobiethe13"
verified_version: "2.1.143"
recommended_model: "Opus 4.7"
tags: ["existing-repo", "claude-md", "red-flags", "lessons-learned"]
---

## Overview

This phase adds structured advanced infrastructure on top of what the built-in `/init` command already provides. It writes directly to your project's `CLAUDE.md` to add:

1. A **Lessons Learned** section — a place where corrections accumulate over time.
2. A **Structural Red-Flag Review** — reads the codebase and identifies architectural anti-patterns or technical debt that Claude should know about.
3. **Index sections** — placeholder lists of skills and agents that get populated as later phases run.

## Prerequisites & Execution

- **Prerequisites:** - `/init CLAUDE_CODE_NEW_INIT=1` must be run on this repository first (or a `CLAUDE.md` must already exist).
  - The Global Setup (`~/.claude/CLAUDE.md`) must be installed on your machine.
- **Token cost:** Medium. Reads the codebase and utilizes 2-3 user-interactive turns via `AskUserQuestion`.

## The Prompt

Copy the text below and paste it directly into your Claude Code terminal.

````text
You are augmenting an existing project CLAUDE.md with structured advanced
content that /init does not produce: a Lessons Learned section, a structural
red-flag review of the codebase, and index sections that future phases will
populate.

PRE-FLIGHT — VERIFY PREREQUISITES

Step 1: Check that ~/.claude/CLAUDE.md contains "# CLAUDE-PROMPTS-PHASE-0-INSTALLED".
If the marker is missing, post this notice and pause:

"Heads up: I don't see the global behavioral guidelines installed at
~/.claude/CLAUDE.md. Without them, Claude will not
have universal think-before-coding / simplicity-first / surgical-changes
guardrails across every session. Recommended: run Phase 0 of core-setup in a separate
session first, then come back here. Or, if you want to proceed without it
for now, say 'continue without core-setup'."

Wait for user response. If they install Phase 0 of core-setup and return, re-check the
marker before proceeding. If they say continue, proceed.

Step 2: Locate the project CLAUDE.md. Check (in this order):
  - ./CLAUDE.md
  - ./.claude/CLAUDE.md

If neither exists, post this and pause:

"This phase assumes /init has run and CLAUDE.md exists. I don't see one at
./CLAUDE.md or ./.claude/CLAUDE.md. Please run /init first (recommended:
/init CLAUDE_CODE_NEW_INIT=1 for the interactive multi-phase flow), then
return to this phase. Alternatively, if you have CLAUDE.md elsewhere, tell
me the path."

Wait for user response.

SELF-VERIFICATION

Before writing anything, verify against current Claude Code documentation:
- Read https://code.claude.com/docs/en/memory to confirm CLAUDE.md location,
  size guidance (target under 200 lines), and import/include syntax
- Confirm .claude/rules/ format and that path-scoped rules use a `paths:`
  YAML frontmatter field

If you can't fetch the docs, tell the user and ask permission to proceed
using the schemas in this prompt.

TURN 1 — READ AND ORIENT

Read the existing CLAUDE.md fully. Note its current structure and what /init
already captured. Then explore the codebase at a high level:
- Top-level directory layout
- Manifest files (package.json, Cargo.toml, pyproject.toml, go.mod, etc.)
- Build/test scripts
- Existing .claude/rules/, .claude/skills/, .claude/agents/ if any
- README.md, CONTRIBUTING.md, ARCHITECTURE.md (if present)
- Recent commit messages (last 20-30) for any patterns the team cares about

Your goal: form a picture of what /init captured, what it missed, and what
structural red flags the user might want surfaced.

Post a brief summary in chat (5-10 lines max) of what /init's CLAUDE.md
covers and what gaps you noticed. Don't propose anything yet.

TURN 2 — STRUCTURAL RED-FLAG REVIEW

Identify structural red flags in the codebase. These are patterns that:
- Look like architectural anti-patterns (god classes, mixed concerns,
  layering violations, missing abstractions where there are clearly 3+
  similar implementations)
- Suggest technical debt the team has accumulated and lives with
- Show conventions that differ from language defaults
- Indicate fragile coupling, missing tests for critical paths, or
  load-bearing comments
- Reveal intentional or unintentional duplication

Be specific and concrete. Cite files and line numbers when possible.

For each red flag, the user will choose one of three handlings:
  (a) Accepted as-is — Claude should know about this and NOT disrupt it.
      Documented in CLAUDE.md so Claude doesn't try to "fix" working code.
  (b) Flag in code review — Future PRs should mention this pattern when it
      appears so it doesn't spread. Goes into a code-review skill (set up
      in a later phase).
  (c) Track for remediation — Belongs in the team's known-issues backlog.
      Goes into .claude/known-issues.md (set up in a later phase).

If you find no significant red flags after a real attempt, say so honestly
and skip to Turn 3. Don't manufacture concerns.

For each red flag found, use AskUserQuestion. Surface as many as you found
worth raising — don't manufacture concerns to hit a number, and don't trim
real ones to fit. Quality of triage beats quantity.

The AskUserQuestion tool supports 1-4 questions per call. Batch red flags
in groups of up to 4 per call; if you have more than 4, issue sequential
calls. Wait for each batch's responses before issuing the next call so the
user processes them in one flow per batch.

Each red flag is one question with these four options (the same option set
applies to every red flag):

AskUserQuestion with:
  questions: [
    {
      question: "Red flag #N: [one-line summary, e.g., 'AuthService mixes UI logic with token handling in src/auth/AuthService.ts:45-180']",
      header: "Red flag #N",
      multiSelect: false,
      options: [
        {
          label: "Accept as-is — document",
          preview: "**Documented in CLAUDE.md.** Claude will know about this and won't try to refactor it. Useful when the pattern works, the team accepts it, and disruption isn't worth the cost.\n\n[brief restatement of the red flag and what 'accepting' means here]"
        },
        {
          label: "Flag in code review",
          preview: "**Added to code-review skill.** When this pattern appears in future PRs, Claude flags it. Existing instances stay as-is; the goal is to stop the pattern from spreading.\n\n[brief restatement]"
        },
        {
          label: "Track for remediation",
          preview: "**Added to .claude/known-issues.md** (the persistent backlog set up in Phase 3). The /remediate command (also set up in Phase 3) will work through these items one at a time, with state lifecycle (open/in-progress/fixed/accepted/deferred).\n\n[brief restatement and a short suggested remediation approach]"
        },
        {
          label: "Skip — not actually a concern",
          preview: "Drop this from the review. You disagree it's a red flag, or it's already being tracked elsewhere."
        }
      ]
    }
    // ... up to 3 more red flags in the same call (max 4 questions per call)
  ]

Wait for responses, then issue the next batch if more red flags remain.

TURN 3 — PROPOSE AUGMENTATION PLAN

Synthesize what you'll add to CLAUDE.md. The plan covers four areas:

1. **Lessons Learned section** — an empty templated section where corrections
   accumulate over time. Format:

   ```
   ## Lessons Learned

   When Claude makes a recurring mistake on this codebase, the team adds a
   line here so it doesn't happen again. Add entries as factual statements,
   not narrative. Keep entries concise.

   The `/ecosystem-review` skill (set up in Phase 2 if the team selected
   it) may also propose entries when run — it spots patterns worth
   recording (a recurring correction across recent commits, a non-obvious
   gotcha visible in the codebase). Claude surfaces those proposals to
   you for approval before appending; nothing lands in this section
   without your sign-off.

   <!-- Example: "API responses are camelCase on the wire, snake_case in
   internal types — convert at the boundary in src/api/client.ts" -->
   ```

2. **Structural notes from accepted (option a) red flags** — added under a
   new section in CLAUDE.md called "Architectural notes — work with these,
   not against them". Each note is 1-3 lines, factual.

3. **Files to be written by later phases that go into intermediate session
   storage**:
   - `.claude/session/findings.md` — option (b) red flags. Phase 2 (custom
     skills) will consume this when designing the code-review skill.
   - `.claude/known-issues.md` (committed file at project root) — option (c)
     red flags. Phase 3 sets up the /remediate workflow that consumes this.

4. **Index section in CLAUDE.md** — placeholder for skills and agents that
   later phases will populate. Looks like:

   ```
   ## Skills available in this project

   <!-- This section can be kept current by occasional /ecosystem-review
        runs (set up in Phase 2, if the team chose it). It lists the
        skills in .claude/skills/ and their purpose. -->

   _No skills yet — populated in Phase 1 and Phase 2._

   ## Agents available in this project

   <!-- Same as above — auto-maintained. -->

   _No agents yet — populated in Phase 2._
   ```

Show this plan via AskUserQuestion's `preview` field, NOT as separate chat
text (the dialog overlays preceding output, hiding it).

AskUserQuestion with:
  questions: [
    {
      question: "Apply this CLAUDE.md augmentation plan?",
      header: "Apply plan",
      multiSelect: false,
      options: [
        {
          label: "Apply as proposed",
          preview: "[Full plan as a markdown preview: the additions to CLAUDE.md verbatim, the contents of findings.md, the contents of known-issues.md if any option-c items, line counts so user can see the post-change CLAUDE.md will stay under 200 lines]"
        },
        {
          label: "Apply but skip Lessons Learned section",
          preview: "[Same as above minus the Lessons Learned section, in case the user prefers to handle corrections differently]"
        },
        {
          label: "Show me an interactive edit",
          preview: "I'll iterate on specific items with you before writing. Useful if you want to tweak wording or scope."
        }
      ]
    }
  ]

If user picks "interactive edit", iterate via additional AskUserQuestion
calls until they approve.

Self-critique before writing:
  - Is post-augmentation CLAUDE.md still under 200 lines? (Per docs, target
    is under 200 lines for adherence.) If not, propose moving content into
    .claude/rules/ as path-scoped rule files.
  - Is every line in the new sections something that, if removed, would
    cause Claude to make a real mistake? If a line is "nice to have" but
    not load-bearing, cut it.
  - Did you avoid duplicating anything /init already wrote?

If self-critique surfaces issues, mention them in chat before implementing
and let the user decide.

TURN 4 — IMPLEMENT (after user approval)

Write the changes:

1. Update CLAUDE.md with the new sections (Lessons Learned, Architectural
   notes, Skills/Agents indexes). Preserve everything /init already wrote.

2. If any red flags were marked option (b), write
   .claude/session/findings.md with this format:

   ```
   # Setup Findings — for next phases to consume
   #
   # Phase 2 (custom skills) reads this and incorporates into the
   # code-review skill. After Phase 2 implements, this file is deleted.

   ## Red flags marked for code-review skill (option b)
   - [path or pattern]: [description of the issue]
   - [path or pattern]: [description of the issue]
   ```

3. If any red flags were marked option (c), append to
   .claude/known-issues.md (creating it if it doesn't exist) with this
   format:

   ```
   # Known Issues — Remediation Backlog
   #
   # This file tracks codebase issues that are known but not yet fixed.
   # Use /remediate (set up in Phase 3) to work through these one at a time.
   #
   # States: open | in-progress | fixed | accepted | deferred

   ---

   ## ISSUE-001: [Short title]
   **State**: open
   **Identified**: YYYY-MM-DD (Phase 0 setup)
   **Path**: [file path or pattern]
   **Issue**: [what's wrong, 1-3 sentences]
   **Suggested approach**: [remediation idea, may be multi-session]
   ```

   When appending new issues later (Phase 2, /audit runs), use the next
   available ISSUE-NNN identifier.

4. Commit the changes with a clear message: "chore(claude): Phase 0 —
   augment CLAUDE.md with Lessons Learned, structural notes, and indexes".

5. Delete .claude/session/phase-0-plan.md if it exists (the plan-file
   scaffolding is no longer needed; the git commit is the audit trail).

   Note: keep findings.md — Phase 2 will consume and delete it. Keep
   known-issues.md — it's a permanent committed file.

6. Post a final line in chat:
   "Phase 0 complete — CLAUDE.md augmented. Next: Phase 1 (knowledge skills
   & path-scoped rules) or Phase 2 (specialist agents & workflow skills),
   depending on what your project needs."
````
