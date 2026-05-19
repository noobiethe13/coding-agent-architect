---
title: "Phase 0: Bootstrap Intent Capture"
description: "Captures user-stated project intent in a new or empty repository before running the /init command."
tool: "claude-code"
type: "setup"
author: "noobiethe13"
verified_version: "2.1.143"
recommended_model: "Opus 4.7"
tags: ["new-repo", "bootstrap", "intent-capture"]
---

## What this does

The built-in `/init` command is optimized for exploring existing code. In an empty repository, there is nothing to explore, so it relies heavily on a gap-fill interview. 

This Bootstrap phase captures your project intent *before* you run `/init`. It seeds the interactive interview with rich project context and nudges the setup toward structured workflow skills (like `/feature`, `/audit`, and `/remediate`). It outputs a temporary `.claude/session/project-intent.md` file for `/init` to read.

## Prerequisites & Execution

- **When to use:** Use this *only* if the repository is empty or near-empty (no manifest files, no source code). If the repo has substantive existing code, skip this entirely and use the **Existing Repo Setup** path.
- **Execution Order:** You must run this prompt **BEFORE** running `/init`. 
- **Next Steps:** After running this, run `/init CLAUDE_CODE_NEW_INIT=1`, then continue with the existing-repo-setup phases in order.
- **Token cost:** Low. One reading pass and one `AskUserQuestion` interaction.

## The Prompt

Copy the text below and paste it directly into your Claude Code terminal.

````text
You are doing intent capture for a new or near-empty repository before
running /init. Your job is to extract enough context from the user about
what they're building that /init's interactive interview can produce a
solid initial CLAUDE.md, skills, and hooks setup.

This prompt does NOT call /init itself — it captures intent and tells the
user what to run next.

PRE-FLIGHT — VERIFY THIS IS THE RIGHT PROMPT FOR THE REPO

Check the repo state:
- ls the project root — count files
- Look for manifest files (package.json, pyproject.toml, Cargo.toml,
  go.mod, pom.xml, etc.)
- Look for source code in standard locations (src/, lib/, app/)
- Check git log — fresh repo or has history?

If the repo has substantive code (manifest files present, source dirs
populated, git log non-trivial), post:

"This repository has existing code, so the standard /init flow is the
right starting point — Bootstrap is optimized for empty repos. I
recommend:
1. Run /init CLAUDE_CODE_NEW_INIT=1 directly (no Bootstrap needed)
2. Then continue with the existing-repo-setup phases in order

Want to proceed that way?"

Wait for confirmation. If user agrees, exit. If user insists Bootstrap
makes sense (e.g., the repo has scaffolding from a generator but no real
code yet), proceed.

If repo IS empty/near-empty, proceed directly.

SELF-VERIFICATION

Verify the file path conventions you'll use:
- .claude/session/ will be gitignored later; for now, since gitignore
  isn't set up yet, write to a temporary location that the user explicitly
  reviews.
- Confirm .claude/session/project-intent.md isn't a sensitive location

TURN 1 — ASK ABOUT THE PROJECT

Use AskUserQuestion to elicit project context. Don't dump questions in
chat as text.

AskUserQuestion with:
  questions: [
    {
      question: "Do you have a written plan or spec document for this project?",
      header: "Have a plan doc?",
      multiSelect: false,
      options: [
        {
          label: "Yes — I'll paste it",
          preview: "**Best case.** You paste your plan/spec/PRD/architecture doc, and I extract the relevant context for /init from it.\n\nBest if you have any of: a one-pager, an architecture sketch, a spec, an idea list, a requirements doc, a Notion page, etc."
        },
        {
          label: "No — I'll describe in 3-5 sentences",
          preview: "**Quick path.** You describe the project briefly. Goals, stack (if known), audience, timeline if relevant. I'll capture and structure it."
        },
        {
          label: "I haven't decided yet — help me think",
          preview: "**Discovery mode.** I ask exploratory questions to help you crystallize the project. Slower but useful if the idea is still loose. We surface the kind of questions /init would otherwise ask, and your answers become the project intent."
        }
      ]
    },
    {
      question: "Which structured workflow skills are you likely to want as the codebase grows? These get suggested to /init so they're set up early — you can always defer or skip during /init.",
      header: "Workflow skills",
      multiSelect: true,
      options: [
        {
          label: "/feature — multi-session feature implementation",
          preview: "**Multi-session feature work.** Uses the 3-file session continuity pattern (plan.md / context.md / tasks.md) so feature work survives across separate Claude Code sessions. Useful for any project where features take more than a single sitting.\n\nProperly set up by a later phase — for now, mentioning it lets /init scaffold the basics."
        },
        {
          label: "/audit + /remediate — quality backlog workflow",
          preview: "**Quality backlog.** /audit does deep codebase analysis (architectural violations, anti-patterns, complexity, dead code) and populates `.claude/known-issues.md`. /remediate works through findings one item at a time with a state lifecycle (open → in-progress → fixed/accepted/deferred).\n\nProperly set up by a later phase — but flagging now means /init won't propose duplicate /simplify-style skills."
        },
        {
          label: "/security-audit — codebase security backlog",
          preview: "**Security backlog.** Different from built-in /security-review (which is PR-diff scope). /security-audit is codebase-wide periodic scan: dependencies/CVEs, injection patterns, auth flaws, secret exposure. Writes to `.claude/security-findings.md`.\n\nFlag this if the project handles auth, payments, user data, or has server-side surface."
        },
        {
          label: "/pr-review — project-aware PR review",
          preview: "**Project-aware PR review.** Built-in /review is deprecated (replaced by plugin) and is generic. /pr-review is project-specific: knows your architecture, conventions, and known-issues backlog (so it doesn't re-flag triaged stuff).\n\nProperly set up by a later phase."
        },
        {
          label: "/ecosystem-review — drift review and doc maintenance",
          preview: "**Ecosystem reviewer.** Manually-invoked skill with two modes:\n\n- *Drift review* (no argument): scans `.claude/`, CLAUDE.md, CONTRIBUTING-AI.md, backlog files, and project docs (README, CHANGELOG, ARCHITECTURE, CONTRIBUTING, LICENSE, ADRs, `docs/`). Surfaces redundancy, orphans, gaps, sync issues, stale content, and Lessons Learned candidates for your approval. Applies approved fixes and commits.\n\n- *Doc creation* (argument is a doc description): creates new project docs — README, CONTRIBUTING, LICENSE, ARCHITECTURE, ADRs, feature docs, custom docs. Reads relevant codebase context, proposes a draft, writes after approval. For LICENSE, uses canonical license text, never synthesized.\n\nProperly set up by a later phase. Useful for any project that will accumulate docs over time."
        },
        {
          label: "/rca — root-cause investigation",
          preview: "**Root-cause analysis specialist.** Takes a bug report, traces through the codebase, identifies root cause, proposes fix. Different from built-in /debug (which is for debugging Claude Code itself).\n\nUseful for projects expected to have non-trivial debugging surface."
        },
        {
          label: "Skip — let /init propose what fits",
          preview: "Don't pre-suggest workflow skills. /init's exploration + gap-fill interview will propose what makes sense based on the project. You can add structured skills later via the existing-repo-setup phases."
        }
      ]
    }
  ]

TURN 2 — RECEIVE INPUT

Based on the user's response in question 1:
- "Yes — I'll paste it": ask the user to paste the doc.
- "No — I'll describe": ask for the 3-5 sentence description.
- "I haven't decided": ask 4-6 lightweight discovery questions:
  * What problem does this project solve, and for whom?
  * What's the rough scope — single tool, system, library, app?
  * Any technology choices already made?
  * Solo or team? If team, what roles?
  * Approximate timeline (prototype this week, 6-month effort, ongoing)?
  * Any non-functional priorities (performance, security, accessibility, etc.)?

Wait for the user's input.

TURN 3 — SYNTHESIZE INTENT FILE

Write `.claude/session/project-intent.md` with this structure (adapt
sections to what the user provided):

```
# Project Intent — for /init to read

This file was written by the Bootstrap intent-capture prompt. It seeds
/init's interactive interview with stated context so /init can propose
relevant CLAUDE.md content, skills, and hooks even though there's no
existing code to explore yet.

After /init is done, this file can be deleted (or kept as a record).

## Project summary
[1-3 sentences: what is being built, for whom, why]

## Stack and tooling (if known)
[Languages, frameworks, libraries already chosen. "TBD" for things not
yet decided. Be honest — don't fabricate decisions.]

## Architecture sketch (if discussed)
[Layered? Microservices? Monolith? Frontend + backend? Just CLI? Whatever
the user described, structured here.]

## Constraints and priorities
[Performance? Security? Accessibility? Compliance? Timeline? Team size
and roles? Anything that affects how Claude should approach work.]

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
- This is a new/empty repository; standard "explore the codebase" phase
  will find little. Lean heavily on the gap-fill interview using this
  intent doc as context.
- Consider proposing the workflow skills listed above as candidates in
  /init's skill suggestion phase. They will be properly built out (with
  agents, persistent memory, paired skills) in subsequent phases of
  the team setup, but having stub skills from /init makes the workflow
  available immediately.
- DO NOT propose /audit, /remediate, /security-audit duplicates of
  bundled built-ins. The proper agents and infrastructure will be set
  up by later existing-repo-setup phases. /init's role is just to
  acknowledge the slot.
```

Self-critique:
- Did you capture what the user actually said, or did you fill in
  plausible-sounding gaps? (Filling in gaps is bad — /init will then
  use those as facts.)
- Are there decisions in the doc that weren't actually made by the
  user? Mark those "TBD" or remove.

TURN 4 — REVIEW AND APPROVE

Show the drafted intent file via AskUserQuestion preview:

AskUserQuestion with:
  questions: [
    {
      question: "Apply this project-intent.md and proceed to /init?",
      header: "Apply",
      multiSelect: false,
      options: [
        {
          label: "Apply as drafted",
          preview: "[Full markdown of the intent file]"
        },
        {
          label: "Iterate before writing",
          preview: "Walk through sections; refine wording; add or remove items before I write."
        },
        {
          label: "Cancel — don't write the file",
          preview: "I'll exit without writing. You can always come back."
        }
      ]
    }
  ]

After approval, write .claude/session/project-intent.md.

TURN 5 — TELL THE USER WHAT'S NEXT

Post these instructions in chat:

"Project intent captured at .claude/session/project-intent.md.

Next steps:

1. Run /init CLAUDE_CODE_NEW_INIT=1 in this same session or a new one.
   When the gap-fill questions come up, mention to /init:
   'Read .claude/session/project-intent.md for project context. Consider
   the workflow skills listed there as candidates for the skill setup.'

2. Then run the existing-repo-setup phases in order.

You can pause between any of these — each phase is a separate session
and reads what previous phases committed."

Note: do NOT auto-invoke /init. Built-in commands have their own
interactive flow; let the user run /init explicitly so they engage with
its AskUserQuestion prompts directly.

This prompt does not delete project-intent.md. /init reads it; subsequent
phases may also reference it. A later phase or the user can decide to
delete it once setup is complete.
````
