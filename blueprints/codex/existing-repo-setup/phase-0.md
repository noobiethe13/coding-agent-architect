---
title: "Phase 0: AGENTS.md Augmentation"
description: "Augments an existing project AGENTS.md with a Lessons Learned section, structural red-flag review, and index placeholders."
tool: "codex"
type: "setup"
author: "noobiethe13"
verified_version: "0.133.0"
recommended_model: "GPT-5.5"
tags: ["existing-repo", "agents-md", "red-flags", "lessons-learned"]
---

## What this does

This phase adds structured advanced infrastructure on top of what Codex's built-in `/init` command already provides. It writes directly to your project's `AGENTS.md` to add:

1. A **Lessons Learned** section — a place where corrections accumulate over time.
2. A **Structural Red-Flag Review** — reads the codebase and identifies architectural anti-patterns or technical debt that Codex should know about.
3. **Index sections** — placeholder lists of skills and agents that get populated as later phases run.

## Prerequisites & Execution

- **Prerequisites:**
  - `/init` must be run on this repository first (or an `AGENTS.md` must already exist at the repo root).
  - The global behavioral guidelines marker (`# CODEX-PROMPTS-PHASE-0-INSTALLED`) should exist in `~/.codex/AGENTS.md`. If not, you'll be warned but can proceed.
- **Token cost:** Medium. Reads the codebase and uses 2-3 interactive numbered-question turns.

## The Prompt

Copy the text below and paste it directly into your Codex CLI terminal.

````text
You are augmenting an existing project AGENTS.md with structured advanced
content that /init does not produce: a Lessons Learned section, a
structural red-flag review of the codebase, and index sections that
future phases will populate.

PRE-FLIGHT — VERIFY PREREQUISITES

Step 1: Check that ~/.codex/AGENTS.md contains
"# CODEX-PROMPTS-PHASE-0-INSTALLED". If the marker is missing, post this
notice and pause:

"Heads up: I don't see the global behavioral guidelines installed at
~/.codex/AGENTS.md. Without them, Codex will not have universal
think-before-coding / simplicity-first / surgical-changes guardrails
across every session. Recommended: install the global behavioral
guidelines in a separate session first (see the core-setup phase),
then come back here. Or, if you want to proceed without them for now,
reply with 'continue without the global guidelines'."

Wait for user response. If they install the guidelines and return,
re-check the marker before proceeding. If they say continue, proceed.

Step 2: Locate the project AGENTS.md. Check (in this order):
  - ./AGENTS.md
  - ./AGENTS.override.md
  - ./.codex/AGENTS.md (uncommon but valid if the team chose this)

If none exists, post this and pause:

"This phase assumes /init has run and AGENTS.md exists. I don't see
one at the project root. Please run /init first, then return to this
phase. Alternatively, if you have AGENTS.md elsewhere, tell me the
path."

Wait for user response.

Step 3: Check whether ./AGENTS.override.md exists. If it does AND has
content, warn the user that Codex reads the override file in place of
AGENTS.md at this directory level, so any augmentation to AGENTS.md
will be invisible until the override is removed or emptied. Ask whether
to (1) augment the override instead, (2) augment AGENTS.md anyway, or
(3) stop so they can decide manually.

SELF-VERIFICATION

Before writing anything, verify against current Codex documentation:
- Read https://developers.openai.com/codex/guides/agents-md to confirm
  AGENTS.md discovery hierarchy and the 32 KiB project_doc_max_bytes
  default
- Confirm that path-scoped subdirectory AGENTS.md files are still the
  idiomatic way to express path-specific rules (since Codex has no
  dedicated rules folder)

If you can't fetch the docs, tell the user and ask permission to
proceed using the schemas in this prompt.

TURN 1 — READ AND ORIENT

Read the existing AGENTS.md fully. Note its current structure and what
/init already captured. Then explore the codebase at a high level:
- Top-level directory layout
- Manifest files (package.json, Cargo.toml, pyproject.toml, go.mod,
  etc.)
- Build/test scripts
- Existing .agents/skills/, .codex/agents/, and any path-scoped
  AGENTS.md files in subdirectories
- README.md, CONTRIBUTING.md, ARCHITECTURE.md (if present)
- Recent commit messages (last 20-30) for any patterns the team cares
  about

Your goal: form a picture of what /init captured, what it missed, and
what structural red flags the user might want surfaced.

Post a brief summary in chat (5-10 lines max) of what /init's
AGENTS.md covers and what gaps you noticed. Don't propose anything
yet.

TURN 2 — STRUCTURAL RED-FLAG REVIEW

Identify structural red flags in the codebase. These are patterns
that:
- Look like architectural anti-patterns (god classes, mixed concerns,
  layering violations, missing abstractions where there are clearly
  3+ similar implementations)
- Suggest technical debt the team has accumulated and lives with
- Show conventions that differ from language defaults
- Indicate fragile coupling, missing tests for critical paths, or
  load-bearing comments
- Reveal intentional or unintentional duplication

Be specific and concrete. Cite files and line numbers when possible.

For each red flag, the user will choose one of four handlings:
  (a) Accepted as-is — Codex should know about this and NOT disrupt
      it. Documented in AGENTS.md so Codex doesn't try to "fix"
      working code.
  (b) Flag in code review — Future PRs should mention this pattern
      when it appears so it doesn't spread. Goes into a code-review
      skill (set up in a later phase).
  (c) Track for remediation — Belongs in the team's known-issues
      backlog. Goes into .codex/known-issues.md (set up in a later
      phase).
  (d) Skip — not actually a concern.

If you find no significant red flags after a real attempt, say so
honestly and skip to Turn 3. Don't manufacture concerns.

Codex has no structured picker. Render each red flag as a numbered
question in chat and wait for the user's batched reply. Group up to 4
red flags per batch to keep the user in one flow per batch.

Format (one batch at a time):

────────────────────────────────────────────────────────────────────
**Red-flag triage** (reply with one letter per number, e.g.
`1a, 2b, 3d, 4c`)

For each red flag, pick handling: **a** (accept), **b** (flag in code
review), **c** (track for remediation), or **d** (skip).

**Red flag #1:** [one-line summary, e.g., 'AuthService mixes UI logic
with token handling in src/auth/AuthService.ts:45-180']
- (a) Accept as-is — documented in AGENTS.md; Codex won't try to
      refactor it.
- (b) Flag in code review — added to code-review skill; future PRs
      surface the pattern. Existing instances stay.
- (c) Track for remediation — added to .codex/known-issues.md; the
      /remediate workflow (later phase) works through it.
- (d) Skip — not actually a concern.

**Red flag #2:** [one-line summary]
- (a) Accept as-is — [brief restatement]
- (b) Flag in code review — [brief restatement]
- (c) Track for remediation — [brief restatement and a short suggested
      remediation approach]
- (d) Skip — not actually a concern.

[... up to 4 red flags per batch]
────────────────────────────────────────────────────────────────────

Wait for the user's reply (e.g. `1a, 2c, 3b, 4d`). Then issue the next
batch if more red flags remain.

TURN 3 — PROPOSE AUGMENTATION PLAN

Synthesize what you'll add to AGENTS.md. The plan covers four areas:

1. **Lessons Learned section** — an empty templated section where
   corrections accumulate over time. Format:

   ```
   ## Lessons Learned

   When Codex makes a recurring mistake on this codebase, the team
   adds a line here so it doesn't happen again. Add entries as
   factual statements, not narrative. Keep entries concise.

   The `/ecosystem-review` skill (if a later phase set it up) may
   also propose entries when run — it spots patterns worth recording
   (a recurring correction across recent commits, a non-obvious
   gotcha visible in the codebase). Codex surfaces those proposals
   to you for approval before appending; nothing lands in this
   section without your sign-off.

   <!-- Example: "API responses are camelCase on the wire,
   snake_case in internal types — convert at the boundary in
   src/api/client.ts" -->
   ```

2. **Structural notes from accepted (option a) red flags** — added
   under a new section in AGENTS.md called "Architectural notes — work
   with these, not against them". Each note is 1-3 lines, factual.

3. **Files to be written by later phases that go into intermediate
   session storage**:
   - `.codex/session/findings.md` — option (b) red flags. A later
     phase will consume this when designing the code-reviewer agent /
     /pr-review skill.
   - `.codex/known-issues.md` (committed file at project root) —
     option (c) red flags. A later phase sets up the /remediate
     workflow that consumes this.

4. **Index section in AGENTS.md** — placeholder for skills and agents
   that later phases will populate. Looks like:

   ```
   ## Skills available in this project

   <!-- This section can be kept current by occasional
        /ecosystem-review runs (if a later phase set it up). It lists
        the skills in .agents/skills/ and their purpose. -->

   _No skills yet — populated by later setup phases._

   ## Agents available in this project

   <!-- Same as above — auto-maintained. Lists custom agents in
        .codex/agents/. -->

   _No agents yet — populated by later setup phases._
   ```

Show the plan in chat (a clear preview block) and ask for approval:

────────────────────────────────────────────────────────────────────
**Apply this AGENTS.md augmentation plan?**

I'm proposing the following changes:

[Full plan as a markdown preview: the additions to AGENTS.md verbatim,
the contents of findings.md, the contents of known-issues.md if any
option-c items, line counts so the user can see the post-change
AGENTS.md size]

Reply with one of:
1. **Apply as proposed** — write the changes and commit.
2. **Apply but skip Lessons Learned section** — in case you prefer to
   handle corrections differently.
3. **Iterate** — tell me which sections to refine; we'll adjust before
   writing.
────────────────────────────────────────────────────────────────────

If user picks "iterate", iterate via follow-up numbered questions
until they approve.

Self-critique before writing:
  - Will post-augmentation AGENTS.md exceed 32 KiB (the
    project_doc_max_bytes default)? If yes, propose moving long
    sections into path-scoped subdirectory AGENTS.md files (e.g.,
    `services/payments/AGENTS.md`) so Codex only loads them when
    working in those directories.
  - Is every line in the new sections something that, if removed,
    would cause Codex to make a real mistake? If a line is
    "nice to have" but not load-bearing, cut it.
  - Did you avoid duplicating anything /init already wrote?

If self-critique surfaces issues, mention them in chat before
implementing and let the user decide.

TURN 4 — IMPLEMENT (after user approval)

Write the changes:

1. Update AGENTS.md with the new sections (Lessons Learned,
   Architectural notes, Skills/Agents indexes). Preserve everything
   /init already wrote.

2. If any red flags were marked option (b), write
   .codex/session/findings.md with this format:

   ```
   # Setup Findings — for next phases to consume
   #
   # A later phase reads this and incorporates the findings into the
   # code-reviewer agent / /pr-review skill, then deletes this file.

   ## Red flags marked for code-review skill (option b)
   - [path or pattern]: [description of the issue]
   - [path or pattern]: [description of the issue]
   ```

3. If any red flags were marked option (c), append to
   .codex/known-issues.md (creating it if it doesn't exist) with this
   format:

   ```
   # Known Issues — Remediation Backlog
   #
   # This file tracks codebase issues that are known but not yet
   # fixed. Use /remediate (set up by a later phase) to work through
   # these one at a time.
   #
   # States: open | in-progress | fixed | accepted | deferred

   ---

   ## ISSUE-001: [Short title]
   **State**: open
   **Identified**: YYYY-MM-DD (initial setup)
   **Path**: [file path or pattern]
   **Issue**: [what's wrong, 1-3 sentences]
   **Suggested approach**: [remediation idea, may be multi-session]
   ```

   When appending new issues later (e.g., from future /audit runs),
   use the next available ISSUE-NNN identifier.

4. Add the marker `# CODEX-PROMPTS-PHASE-0-INSTALLED` near the top of
   AGENTS.md (under any title heading but before the rest of the
   content). This marker tells later phases that augmentation has
   already happened.

5. Commit the changes with a clear message:
   "chore(codex): Phase 0 — augment AGENTS.md with Lessons Learned,
   structural notes, and indexes".

   If Codex's `features.codex_git_commit` is enabled, the commit will
   carry the configured `commit_attribution` trailer
   (`Codex <noreply@openai.com>` by default).

6. Note: keep .codex/session/findings.md — a later phase will consume
   and delete it. Keep .codex/known-issues.md — it's a permanent
   committed file.

7. Post a final line in chat:
   "Phase 0 complete — AGENTS.md augmented. You can now run the next
   setup phase whenever you're ready."
````
