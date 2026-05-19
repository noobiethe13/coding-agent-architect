---
title: "Phase 1: Knowledge Skills & Path-Scoped Rules"
description: "Adds project-specific reference content via on-demand Skills and always-on or path-scoped Rules."
tool: "claude-code"
type: "setup"
author: "noobiethe13"
verified_version: "2.1.143"
recommended_model: "Opus 4.7"
tags: ["existing-repo", "skills", "rules", "knowledge"]
---

## What this does

This phase adds reference-knowledge content that loads intelligently rather than cluttering your main `CLAUDE.md`. It generates two types of artifacts based on your project's needs:

- **Skills** (in `.claude/skills/<name>/SKILL.md`): Rich reference material that loads when Claude invokes them or when you type `/<name>`. They can use `paths:` to load automatically when matching files are touched, and can run in subagent contexts.
- **Rules** (in `.claude/rules/*.md`): Simpler, always-on or path-scoped markdown files that Claude reads as project instructions. Best for short conventions.

## Prerequisites & Execution

- **Prerequisites:** - The global behavioral guidelines marker (`# CLAUDE-PROMPTS-PHASE-0-INSTALLED`) must exist in `~/.claude/CLAUDE.md`.
  - The project `CLAUDE.md` must contain Lessons Learned and skills/agents index sections (set up by an earlier phase).
- **When to skip:** If the built-in `/init` command already produced all the skills and rules your team needs, you can skip this phase.
- **Token cost:** Medium-high. Reads the codebase and relies heavily on interactive `AskUserQuestion` menus.

## The Prompt

Copy the text below and paste it directly into your Claude Code terminal.

````text
You are adding project-specific knowledge skills and path-scoped rules to a
codebase that has already been through /init. /init proposed some skills and
hooks; you're filling in what /init missed and what the team specifically
asked for.

PRE-FLIGHT — VERIFY PREREQUISITES

Step 1: Global behavioral guidelines marker check at ~/.claude/CLAUDE.md.
If the marker `# CLAUDE-PROMPTS-PHASE-0-INSTALLED` is missing, post this
notice and pause:

"Heads up: I don't see the global behavioral guidelines installed at
~/.claude/CLAUDE.md. Without them, Claude will not have universal
think-before-coding / simplicity-first / surgical-changes guardrails
across every session. Recommended: install the global guidelines in a
separate session first, then come back here. Or, if you want to proceed
without them for now, say 'continue without the global guidelines'."

Wait for user response. If they install the guidelines and return,
re-check the marker before proceeding. If they say continue, proceed.

Step 2: Project CLAUDE.md augmentation check. Look at ./CLAUDE.md (or
./.claude/CLAUDE.md). It should contain three sections an earlier setup
phase adds:
- a `## Lessons Learned` heading (the accumulating-corrections section)
- a `## Skills available in this project` heading (skills index)
- a `## Agents available in this project` heading (agents index)

If any of these headings are missing, post:

"The project CLAUDE.md is missing the augmentation sections (Lessons
Learned, Skills available, Agents available). Run the CLAUDE.md
augmentation phase first, then come back here. Or, if you want to
proceed without it, say 'continue without the augmentation'."

Wait for user response.

SELF-VERIFICATION

Before writing any frontmatter, verify against current Claude Code docs:
- https://code.claude.com/docs/en/skills — confirm SKILL.md location pattern
  (.claude/skills/<name>/SKILL.md) and the full set of frontmatter fields
- https://code.claude.com/docs/en/memory — confirm .claude/rules/ format and
  paths: frontmatter for path-scoping

Document any schema differences from this prompt and follow the docs. If you
cannot fetch, tell the user and ask whether to proceed with this prompt's
schema.

Also check what bundled skills already exist by listing the /skills menu in
your reasoning (without invoking it as a tool — just recall): /simplify,
/batch, /debug, /loop, /claude-api are bundled. Do not propose duplicates.

TURN 1 — INVENTORY EXISTING SKILLS AND RULES

Read what /init (or prior work) already produced:
- List .claude/skills/ contents — for each skill, read its SKILL.md frontmatter
  and note name, description, and a one-line summary
- List .claude/rules/ contents — same
- Note skills referenced from CLAUDE.md indexes
- Note .claude/session/findings.md if it exists (red-flag findings from
  an earlier setup phase, marked for the code-review skill — these will
  inform proposed skills)

Post a brief inventory in chat (no proposals yet):
"Existing skills: [list]. Existing rules: [list]. Red-flag findings.md:
[summary or 'none']. Ready to discuss what to add."

TURN 2 — ELICIT WHAT THE TEAM NEEDS

Use AskUserQuestion to figure out what knowledge skills and rules the team
needs. Don't propose a fixed list — let the user steer.

Ask in a single call with three multi-select questions (batching keeps the
soft-nudge property while staying within the 2-4 options per question cap):

AskUserQuestion with:
  questions: [
    {
      question: "Which architecture & API knowledge should Claude know? Pick all that apply.",
      header: "Architecture & API",
      multiSelect: true,
      options: [
        {
          label: "Architecture & layering",
          preview: "**Architecture & layering** — module boundaries, dependency direction, what should never import what, the canonical 'where does X go' answer.\n\nExamples: 'API handlers live in src/api/handlers/, business logic in src/domain/, no UI imports from src/db'."
        },
        {
          label: "API design patterns",
          preview: "**API design patterns** — request/response shapes, error formats, validation conventions, versioning approach.\n\nUseful when the project has consistent API patterns Claude should follow when adding new endpoints."
        },
        {
          label: "Testing conventions",
          preview: "**Testing conventions** — test naming, fixture conventions, mocking patterns, what 'good coverage' looks like for this team.\n\nUseful when test style varies meaningfully from language defaults."
        },
        {
          label: "External integrations",
          preview: "**External integrations** — how the team integrates with vendors, gotchas with specific APIs, retry/timeout policies.\n\nUseful when integrations have non-obvious quirks."
        }
      ]
    },
    {
      question: "Which data & convention knowledge should Claude know? Pick all that apply.",
      header: "Data & conventions",
      multiSelect: true,
      options: [
        {
          label: "State management",
          preview: "**State management patterns** — for frontend: how state is structured (Redux/Zustand/TanStack Query/etc.), data flow direction. For backend: session handling, cache layers, transaction boundaries.\n\nUseful when Claude often needs to add state-touching code."
        },
        {
          label: "Data modeling & schemas",
          preview: "**Data modeling & schemas** — naming conventions for tables/types, relationship patterns, migration policies, validation library choices.\n\nUseful for projects with significant database or schema work."
        },
        {
          label: "Stack-specific anti-patterns",
          preview: "**Stack-specific anti-patterns** — things this team has decided NOT to do (e.g., 'don't use useEffect for data fetching, use TanStack Query', 'never use barrel files', 'avoid abstract base classes').\n\nUseful for capturing 'lessons the team learned the hard way'."
        },
        {
          label: "Other (I'll describe)",
          preview: "Free-text option — describe areas not in this list. Common additions: domain-specific business rules, deployment/ops conventions, accessibility standards, performance budgets."
        }
      ]
    },
    {
      question: "How should knowledge be scoped?",
      header: "Scope strategy",
      multiSelect: false,
      options: [
        {
          label: "Path-scoped where possible (recommended)",
          preview: "**Path-scoped where possible**\n\nKnowledge that only applies to certain file paths gets `paths:` frontmatter so it loads automatically when those files are touched, not on every session. Saves context, improves adherence.\n\nE.g., API conventions only load when files in src/api/** are open."
        },
        {
          label: "Always-on (load every session)",
          preview: "**Always-on**\n\nKnowledge loads at session start regardless of which files are touched. Simpler but uses more context tokens.\n\nFine for small projects; not recommended for large codebases with many domains."
        },
        {
          label: "Mix — let Claude decide per-skill",
          preview: "**Mix**\n\nFor each proposed skill/rule, Claude proposes a scope (path-scoped or always-on) based on the content. You review the choices in Turn 3."
        }
      ]
    }
  ]

If the user picks "Other (I'll describe)" in Q2, follow up with a free-text
request: "Please describe what other knowledge areas should be captured."

TURN 3 — EXPLORE AND PROPOSE

For each selected knowledge area, explore the relevant parts of the codebase
to gather concrete details. Don't ask the user questions you can answer by
reading code (e.g., don't ask "what testing library do you use" if
package.json shows it).

Spawn one or more Explore subagents for parallel codebase investigation if
the areas warrant it. Use the Explore subagent (built-in, Haiku, read-only)
via the Agent tool. Pass each subagent a focused prompt.

Then synthesize a proposal: for each area, decide if it should be a skill
or a rule, and whether to scope it by path.

DECISION GUIDE:

Use a **rule** (.claude/rules/<name>.md) when:
- Content is short (under ~50 lines)
- It's a simple list of conventions, not a procedure
- No arguments, no tool restrictions, no model override needed
- Always-on or path-scoped via simple `paths:` frontmatter

Use a **skill** (.claude/skills/<name>/SKILL.md) when:
- Content is richer (reference docs, multiple sections, examples)
- It's procedural ("when adding an API endpoint, do X then Y then Z")
- Needs arguments or supporting files
- Could benefit from running in a subagent (`context: fork`)
- Needs path-scoping AND additional behaviors

For each proposed item, draft full frontmatter + body. Examples:

A path-scoped rule for API conventions:

```
---
description: API design patterns and error format conventions
paths:
  - "src/api/**/*.ts"
  - "src/handlers/**/*.ts"
---

# API Conventions

When writing or modifying API endpoints in this codebase:

- All endpoints return responses matching the `ApiResponse<T>` shape in
  src/api/types.ts (success: T | error: { code, message, details? })
- Validation uses Zod schemas defined in src/api/schemas/, never inline
- Errors throw `AppError` subclasses, never bare `Error` (handlers catch
  AppError and produce error responses; bare Error becomes 500)
- All endpoints have an OpenAPI annotation comment above the handler
```

A skill for architecture context:

```
---
name: architecture
description: How this codebase is structured, layered, and what depends on what. Use when adding new modules, refactoring across boundaries, or deciding where new code should live.
---

# Architecture

[Detailed layered architecture description, dependency direction, naming
conventions, the answer to "where does X go" for common cases. Includes
examples from the actual codebase referenced by path.]

## Module boundaries
...

## Dependency direction
...

## Where things go
...
```

When findings.md from an earlier red-flag review exists, incorporate
option-(b) red flags into the proposed code-review skill draft (or note
them as candidates if no code-review skill is being proposed in this
phase — they'll be picked up when that skill is set up by a later phase).

Self-critique before showing the proposal:
  - For each proposed skill: does this duplicate a bundled skill? (/simplify,
    /batch, /debug, /loop, /claude-api). If so, drop it and use the bundled.
  - For each proposed rule: is this short enough to be a rule, or should it
    be a skill?
  - For path-scoped items: are the glob patterns correct? Will they actually
    match the intended files?
  - Is each item minimal — would removing it cause Claude to make mistakes,
    not just produce slightly worse output?

Show the proposal via AskUserQuestion's `preview` field. The dialog overlays
preceding chat output, so chat-text proposals get hidden.

AskUserQuestion with:
  questions: [
    {
      question: "Apply this proposed set of skills and rules?",
      header: "Apply proposal",
      multiSelect: false,
      options: [
        {
          label: "Apply all as proposed",
          preview: "[Markdown preview showing each proposed file: path, frontmatter, body summary. Compact — one block per item. Note total file count and target directories.]"
        },
        {
          label: "Apply but drop specific items",
          preview: "I'll list each item and you can drop individual ones in a follow-up. Useful when most are good but one or two miss the mark."
        },
        {
          label: "Iterate on details",
          preview: "Walk through each proposed item, refine wording, scope, and frontmatter before writing. Slower but produces tighter output."
        },
        {
          label: "Skip this phase entirely",
          preview: "Don't add any skills or rules right now. /init's existing output is sufficient. You can run this phase later if needs change."
        }
      ]
    }
  ]

Iterate via additional AskUserQuestion calls if user chose to drop specific
items or refine details.

TURN 4 — IMPLEMENT (after approval)

For each approved skill, create the directory structure and SKILL.md:

```
.claude/skills/<skill-name>/SKILL.md
```

Use full frontmatter with only the fields you actually need. Required:
- `description` (recommended by docs — Claude uses this to decide when to
  invoke the skill)

Optional fields to consider per-skill:
- `name` — defaults to directory name; only set if it should differ
- `paths` — for path-scoped knowledge. List or comma-separated string of
  globs.
- `allowed-tools` — pre-approve tools while skill is active (e.g., for
  skills that run shell commands)
- `model` — override the session model (e.g., `haiku` for cheap reference
  lookups)
- `effort` — override session effort (e.g., `low` for simple references)

Do NOT use these unless genuinely needed:
- `disable-model-invocation` — only for workflow skills with side effects
  (this phase is about knowledge skills; that flag belongs to workflow
  skills set up by a later phase)
- `context: fork` — only when the skill should run in an isolated subagent
- `arguments` / `argument-hint` — only for parameterized skills

For each approved rule, create:

```
.claude/rules/<rule-name>.md
```

With YAML frontmatter (required: `description`; optional: `paths`).

After writing all files:

1. Update CLAUDE.md's "Skills available in this project" and "Agents
   available in this project" indexes (left as placeholders by an
   earlier phase) to list the newly-created skills. Keep entries to one
   line each: `- /skill-name — short purpose`. (Agents are populated by
   a later phase.)

   The /ecosystem-review skill (if set up by a later phase) can keep this
   index current going forward. For now, just write the current state.

2. If findings.md was incorporated into a code-review skill that was
   proposed and approved, delete .claude/session/findings.md.
   If findings.md was NOT consumed (e.g., user deferred the code-review
   skill), keep findings.md so a later phase can read it.

3. Commit with a clear message: "chore(claude): Phase 1 — add knowledge
   skills and path-scoped rules". Use multi-line commit body listing each
   file.

4. Delete .claude/session/phase-1-plan.md if you wrote one.

5. Post a final line in chat:
   "Phase 1 complete — added [N] skills and [M] rules. You can now run
   the next setup phase whenever you're ready."
````
