---
title: "Phase 0: Bootstrap Intent Capture"
description: "Captures user-stated project intent in a new or empty repository before running Codex's /init command."
tool: "codex"
type: "setup"
author: "noobiethe13"
verified_version: "0.133.0"
recommended_model: "GPT-5.5"
tags: ["new-repo", "bootstrap", "intent-capture"]
---

## What this does

Codex's built-in `/init` command generates an `AGENTS.md` scaffold by exploring the repo and asking gap-fill questions. In an empty repository, there is nothing to explore, so `/init` leans entirely on the interview.

This Bootstrap phase captures your project intent *before* you run `/init`. It seeds the interactive interview with rich project context and nudges the setup toward structured workflow skills (like `/feature`, `/audit`, and `/remediate`). It outputs a temporary `.codex/session/project-intent.md` file for `/init` to read.

## Prerequisites & Execution

- **When to use:** Use this *only* if the repository is empty or near-empty (no manifest files, no source code). If the repo has substantive existing code, skip this entirely and use the **Existing Repo Setup** path.
- **Execution Order:** You must run this prompt **BEFORE** running `/init`.
- **Next Steps:** After running this, run `/init`, then continue with the existing-repo-setup phases in order.
- **Token cost:** Low. One reading pass and one numbered-list question for the user.

## The Prompt

Copy the text below and paste it directly into your Codex CLI terminal.

````text
You are doing intent capture for a new or near-empty repository before
running /init. Your job is to extract enough context from the user about
what they're building that Codex's /init interview can produce a solid
initial AGENTS.md and recommended skills setup.

This prompt does NOT call /init itself — it captures intent and tells
the user what to run next.

PRE-FLIGHT — VERIFY THIS IS THE RIGHT PROMPT FOR THE REPO

Check the repo state:
- List the project root and count files (excluding .git and dotfiles
  like .gitignore)
- Look for manifest files (package.json, pyproject.toml, Cargo.toml,
  go.mod, pom.xml, build.gradle, etc.)
- Look for source code in standard locations (src/, lib/, app/, pkg/,
  internal/, cmd/)
- Check git log — fresh repo or has history?
- Check whether AGENTS.md already exists at the repo root (if so, /init
  has likely already run)

If the repo has substantive code (manifest files present, source dirs
populated, git log non-trivial), OR an AGENTS.md already exists, post:

"This repository has existing code (or AGENTS.md already exists), so
the standard /init flow is the right starting point — Bootstrap is
optimized for empty repos. I recommend:

1. Run /init directly (no Bootstrap needed) — it will explore what's
   there and produce an AGENTS.md.
2. Then continue with the existing-repo-setup phases in order.

Want to proceed that way?"

Wait for confirmation. If user agrees, exit. If user insists Bootstrap
makes sense (e.g., the repo has scaffolding from a generator but no
real code yet), proceed.

If repo IS empty/near-empty, proceed directly.

SELF-VERIFICATION

Verify the file path conventions you'll use:
- .codex/session/ will be gitignored later; for now, since gitignore
  isn't set up yet, write to a temporary location that the user
  explicitly reviews
- Confirm .codex/session/project-intent.md isn't a sensitive location
  (it shouldn't be — but check there's no existing file there with
  unrelated content)
- Confirm that Codex's /init command still reads the working directory
  for context (per https://developers.openai.com/codex/cli when
  reachable). If /init's behavior has changed materially, surface that
  before continuing.

TURN 1 — ASK ABOUT THE PROJECT

Codex has no structured picker tool. Render the two questions below as a
numbered markdown block and wait for the user's reply.

Post EXACTLY this in chat:

────────────────────────────────────────────────────────────────────
**Question 1 — Plan source** (single-select; reply with one number)

Do you have a written plan or spec document for this project?

1. **Yes — I'll paste it.** *Best case.* You paste your plan / spec /
   PRD / architecture doc, and I extract the relevant context for /init
   from it. Best if you have any of: a one-pager, an architecture
   sketch, a spec, an idea list, a requirements doc, a Notion page,
   etc.

2. **No — I'll describe in 3-5 sentences.** *Quick path.* You describe
   the project briefly. Goals, stack (if known), audience, timeline if
   relevant. I'll capture and structure it.

3. **I haven't decided yet — help me think.** *Discovery mode.* I ask
   exploratory questions to help you crystallize the project. Slower
   but useful if the idea is still loose. We surface the kind of
   questions /init would otherwise ask, and your answers become the
   project intent.

**Question 2 — Workflow skills to suggest** (multi-select; reply with
comma-separated numbers; `none` to skip)

Which structured workflow skills are you likely to want as the codebase
grows? These get suggested to /init so they're set up early — you can
always defer or skip during /init.

1. **/feature — multi-session feature implementation.** Uses Codex's
   session resume (`codex resume`) plus a manual 3-file pattern
   (plan / context / tasks in `.codex/session/`) so feature work
   survives across separate Codex sessions, /clear, and machine moves.
   Useful for any project where features take more than a single
   sitting.

2. **/audit + /remediate — quality backlog workflow.** /audit does deep
   codebase analysis (architectural violations, anti-patterns,
   complexity, dead code) and populates `.codex/known-issues.md`.
   /remediate works through findings one at a time with a state
   lifecycle (open → in-progress → fixed/accepted/deferred).

3. **/security-audit — codebase security backlog.** Different from
   built-in /review (which is PR-diff scope). /security-audit is
   codebase-wide periodic scan: dependencies / CVEs, injection
   patterns, auth flaws, secret exposure. Writes to
   `.codex/security-findings.md`. Flag this if the project handles
   auth, payments, user data, or has server-side surface.

4. **/pr-review — project-aware PR review.** Built-in /review compares
   against base branches generically. /pr-review is project-specific:
   knows your architecture, conventions, and known-issues backlog (so
   it doesn't re-flag triaged stuff).

5. **/ecosystem-review — drift review and doc maintenance.** Manually
   invoked. Two modes:
   - *Drift review* (no argument): scans `.codex/`, `.agents/skills/`,
     AGENTS.md, CONTRIBUTING-AI.md, backlog files, and project docs
     (README, CHANGELOG, ARCHITECTURE, CONTRIBUTING, LICENSE, ADRs,
     `docs/`). Surfaces redundancy, orphans, gaps, sync issues, and
     stale content for your approval; applies approved fixes; commits.
   - *Doc creation* (argument is a doc description): creates new
     project docs from real codebase context. For LICENSE, uses
     canonical text — never synthesized.

6. **/rca — root-cause investigation.** Takes a bug report, traces
   through the codebase, identifies root cause, proposes fix. Useful
   for projects expected to have non-trivial debugging surface.

7. **Skip — let /init propose what fits.** /init's gap-fill interview
   will propose what makes sense based on the project. You can add
   structured skills later via the existing-repo-setup phases.

────────────────────────────────────────────────────────────────────

Reply with both answers in the format:
`Q1: 2`
`Q2: 1,2,4,5`

Wait for the user's reply before proceeding.

TURN 2 — RECEIVE INPUT

Based on the user's response in question 1:
- "1 — Yes, I'll paste it": ask the user to paste the doc.
- "2 — No, I'll describe": ask for the 3-5 sentence description.
- "3 — I haven't decided": ask 4-6 lightweight discovery questions in
  chat:
    * What problem does this project solve, and for whom?
    * What's the rough scope — single tool, system, library, app?
    * Any technology choices already made?
    * Solo or team? If team, what roles?
    * Approximate timeline (prototype this week, 6-month effort,
      ongoing)?
    * Any non-functional priorities (performance, security,
      accessibility, etc.)?

Wait for the user's input.

TURN 3 — SYNTHESIZE INTENT FILE

Write `.codex/session/project-intent.md` with this structure (adapt
sections to what the user provided):

```
# Project Intent — for /init to read

This file was written by the Bootstrap intent-capture prompt. It seeds
Codex's /init interview with stated context so /init can propose
relevant AGENTS.md content, skills, and hooks even though there's no
existing code to explore yet.

After /init is done, this file can be deleted (or kept as a record).

## Project summary
[1-3 sentences: what is being built, for whom, why]

## Stack and tooling (if known)
[Languages, frameworks, libraries already chosen. "TBD" for things not
yet decided. Be honest — don't fabricate decisions.]

## Architecture sketch (if discussed)
[Layered? Microservices? Monolith? Frontend + backend? Just CLI?
Whatever the user described, structured here.]

## Constraints and priorities
[Performance? Security? Accessibility? Compliance? Timeline? Team
size and roles? Anything that affects how Codex should approach work.]

## Workflow skills the user wants set up
[List from question 2. Marked with brief context for each:
- /feature (multi-session feature work)
- /audit + /remediate (quality backlog)
- /security-audit (security backlog — handles user data / auth /
  payments)
- /pr-review (project-aware PR review)
- /ecosystem-review (drift review and doc creation)
- /rca (root-cause investigation)]

## Notes for /init
- This is a new/empty repository; the standard "explore the codebase"
  phase will find little. Lean heavily on the gap-fill interview
  using this intent doc as context.
- Consider proposing the workflow skills listed above as candidates
  in /init's skill suggestion phase. They will be properly built out
  (with subagents in .codex/agents/, persistent backlog files, paired
  workflow skills under .agents/skills/) in subsequent phases of
  the team setup, but having stub skill scaffolding from /init makes
  the workflow available immediately.
- DO NOT propose duplicates of bundled Codex skills (e.g., the built-
  in /review, /memories, /skills, /agent). The proper agents and
  infrastructure will be set up by later existing-repo-setup phases.
  /init's role is just to acknowledge the slot.
```

Self-critique:
- Did you capture what the user actually said, or did you fill in
  plausible-sounding gaps? (Filling in gaps is bad — /init will then
  use those as facts.)
- Are there decisions in the doc that weren't actually made by the
  user? Mark those "TBD" or remove.

TURN 4 — REVIEW AND APPROVE

Show the drafted intent file in chat and ask for approval. Render it
as a numbered question:

────────────────────────────────────────────────────────────────────
**Apply this project-intent.md and proceed to /init?**

Below is the draft I'll write to .codex/session/project-intent.md:

[Paste the full markdown of the intent file here]

Reply with one of:
1. **Apply as drafted** — I'll write the file and tell you what to do
   next.
2. **Iterate** — Tell me which sections to change; we'll refine before
   I write.
3. **Cancel** — Don't write the file. I'll exit; you can always come
   back.
────────────────────────────────────────────────────────────────────

Wait for the user's reply.

After approval, write .codex/session/project-intent.md. Codex's plan
mode (`/plan`) will show the file-write diff if the session is in plan
mode — otherwise the file is written directly with the approval policy
in effect.

TURN 5 — TELL THE USER WHAT'S NEXT

Post these instructions in chat:

"Project intent captured at .codex/session/project-intent.md.

Next steps:

1. Run /init in this same session or a new one. When the gap-fill
   questions come up, mention to Codex:
   'Read .codex/session/project-intent.md for project context.
   Consider the workflow skills listed there as candidates for the
   skill setup.'

2. Then run the existing-repo-setup phases in order. They expect
   AGENTS.md to exist (which /init will create).

You can pause between any of these — each phase is a separate session
and reads what previous phases committed. Use `codex resume --last` if
you want to pick up the same conversation again."

Note: do NOT auto-invoke /init. /init is interactive and has its own
gap-fill flow; let the user run /init explicitly so they engage with
its prompts directly.

This prompt does not delete project-intent.md. /init reads it;
subsequent phases may also reference it. A later phase or the user
can decide to delete it once setup is complete.
````
