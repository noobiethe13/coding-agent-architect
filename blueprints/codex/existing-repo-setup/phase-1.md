---
title: "Phase 1: Knowledge Skills & Path-Scoped AGENTS.md"
description: "Adds project-specific reference content via on-demand Skills and always-on or path-scoped AGENTS.md files."
tool: "codex"
type: "setup"
author: "noobiethe13"
verified_version: "0.133.0"
recommended_model: "GPT-5.5"
tags: ["existing-repo", "skills", "rules", "knowledge"]
---

## What this does

This phase adds reference-knowledge content that loads intelligently rather than cluttering your main `AGENTS.md`. It generates two types of artifacts based on your project's needs:

- **Skills** (in `.agents/skills/<name>/SKILL.md`): Rich reference material that loads when Codex implicitly chooses to invoke them, when you explicitly type `$skill-name`, or when you pick from `/skills`. Can include supporting scripts, references, and assets.
- **Path-scoped AGENTS.md** (in subdirectories like `services/payments/AGENTS.md`): Simpler markdown files that Codex auto-loads when working below that directory, replacing what other tools call "rules". Closer files override parents in Codex's concatenated instruction chain.

> Codex has no dedicated `.codex/rules/` folder — its idiomatic rules mechanism is path-scoped `AGENTS.md` files that ride the same hierarchical discovery as the project root file.

## Prerequisites & Execution

- **Prerequisites:**
  - The global behavioral guidelines marker (`# CODEX-PROMPTS-PHASE-0-INSTALLED`) should exist in `~/.codex/AGENTS.md` (warning issued if missing).
  - The project `AGENTS.md` must contain Lessons Learned and skills/agents index sections (set up by Phase 0).
- **When to skip:** If `/init` already produced all the skills your team needs, you can skip this phase.
- **Token cost:** Medium-high. Reads the codebase and relies on multiple numbered-question turns.

## The Prompt

Copy the text below and paste it directly into your Codex CLI terminal.

````text
You are adding project-specific knowledge skills and path-scoped
AGENTS.md files to a codebase that has already been through /init plus
Phase 0 augmentation. /init proposed some skills; you're filling in
what /init missed and what the team specifically asked for.

PRE-FLIGHT — VERIFY PREREQUISITES

Step 1: Global behavioral guidelines marker check at
~/.codex/AGENTS.md. If the marker
`# CODEX-PROMPTS-PHASE-0-INSTALLED` is missing, post this notice and
pause:

"Heads up: I don't see the global behavioral guidelines installed at
~/.codex/AGENTS.md. Without them, Codex will not have universal
think-before-coding / simplicity-first / surgical-changes guardrails
across every session. Recommended: install the global guidelines in a
separate session first (see the core-setup phase), then come back
here. Or, if you want to proceed without them for now, reply with
'continue without the global guidelines'."

Wait for user response. If they install the guidelines and return,
re-check the marker before proceeding. If they say continue, proceed.

Step 2: Project AGENTS.md augmentation check. Look at ./AGENTS.md (or
./AGENTS.override.md if it takes precedence). It should contain three
sections an earlier setup phase adds:
- a `## Lessons Learned` heading (the accumulating-corrections section)
- a `## Skills available in this project` heading (skills index)
- a `## Agents available in this project` heading (agents index)

If any of these headings are missing, post:

"The project AGENTS.md is missing the augmentation sections (Lessons
Learned, Skills available, Agents available). Run the AGENTS.md
augmentation phase first, then come back here. Or, if you want to
proceed without it, reply with 'continue without the augmentation'."

Wait for user response.

SELF-VERIFICATION

Before writing any frontmatter, verify against current Codex docs:
- https://developers.openai.com/codex/skills — confirm SKILL.md
  location pattern (`.agents/skills/<name>/SKILL.md` — note: the
  folder is `.agents/skills/`, NOT `.codex/skills/`, since the spec is
  shared across agent tools)
- Confirm SKILL.md frontmatter fields (required: `name`,
  `description`; optional metadata via `agents/openai.yaml` for
  display name, icons, brand color, `policy.allow_implicit_invocation`,
  `dependencies.tools`)
- https://developers.openai.com/codex/guides/agents-md — confirm that
  path-scoped subdirectory AGENTS.md files still work the way this
  prompt assumes (closer-to-CWD files appear later in the
  concatenated chain, so they override parents)

Document any schema differences from this prompt and follow the docs.
If you cannot fetch, tell the user and ask whether to proceed with
this prompt's schema.

Also note bundled skills that already ship with Codex (do not
duplicate): image generation (`$imagegen`), web search. Check `/skills`
inside Codex to see the current list before proposing additions.

TURN 1 — INVENTORY EXISTING SKILLS AND PATH-SCOPED AGENTS.md FILES

Read what /init (or prior work) already produced:
- List .agents/skills/ contents — for each skill, read its SKILL.md
  frontmatter and note name, description, and a one-line summary. Also
  walk up to $HOME/.agents/skills/ (user-scoped) if it exists.
- Find any path-scoped AGENTS.md files: anywhere below the repo root
  there's a directory containing an AGENTS.md (or AGENTS.override.md).
  List each with its path and a one-line summary.
- Note skills referenced from AGENTS.md's "Skills available" index.
- Note .codex/session/findings.md if it exists (red-flag findings from
  Phase 0, marked for the code-review skill — these will inform
  proposed skills).

Post a brief inventory in chat (no proposals yet):
"Existing skills (project + user scope): [list]. Existing path-scoped
AGENTS.md files: [list]. Red-flag findings.md: [summary or 'none'].
Ready to discuss what to add."

TURN 2 — ELICIT WHAT THE TEAM NEEDS

Codex has no structured picker. Render the questions below as a
numbered markdown block and wait for the user's batched reply.

Post EXACTLY this in chat:

────────────────────────────────────────────────────────────────────
**Question 1 — Architecture & API knowledge** (multi-select; reply
with comma-separated numbers; `none` to skip)

Which architecture & API knowledge should Codex know about? Pick all
that apply.

1. **Architecture & layering** — module boundaries, dependency
   direction, what should never import what, the canonical 'where does
   X go' answer. Examples: 'API handlers live in src/api/handlers/,
   business logic in src/domain/, no UI imports from src/db'.

2. **API design patterns** — request/response shapes, error formats,
   validation conventions, versioning approach. Useful when the
   project has consistent API patterns Codex should follow when
   adding new endpoints.

3. **Testing conventions** — test naming, fixture conventions, mocking
   patterns, what 'good coverage' looks like for this team. Useful
   when test style varies meaningfully from language defaults.

4. **External integrations** — how the team integrates with vendors,
   gotchas with specific APIs, retry/timeout policies. Useful when
   integrations have non-obvious quirks.

**Question 2 — Data & convention knowledge** (multi-select; reply
with comma-separated numbers; `none` to skip)

Which data & convention knowledge should Codex know about?

1. **State management** — for frontend: how state is structured
   (Redux / Zustand / TanStack Query / etc.), data flow direction. For
   backend: session handling, cache layers, transaction boundaries.
   Useful when Codex often needs to add state-touching code.

2. **Data modeling & schemas** — naming conventions for
   tables / types, relationship patterns, migration policies,
   validation library choices. Useful for projects with significant
   database or schema work.

3. **Stack-specific anti-patterns** — things this team has decided
   NOT to do (e.g., 'don't use useEffect for data fetching, use
   TanStack Query', 'never use barrel files', 'avoid abstract base
   classes'). Useful for capturing 'lessons the team learned the hard
   way'.

4. **Other** (free-text option — describe areas not in this list).
   Common additions: domain-specific business rules,
   deployment / ops conventions, accessibility standards, performance
   budgets.

**Question 3 — Scope strategy** (single-select; reply with one
number)

How should knowledge be scoped?

1. **Path-scoped where possible (recommended)** — Knowledge that only
   applies to certain file paths goes into a subdirectory AGENTS.md
   (so Codex auto-loads it only when working below that directory) or
   into a SKILL.md with `policy.allow_implicit_invocation` and a
   description that triggers when relevant. Saves context tokens.

2. **Always-on (load every session)** — Knowledge goes into the
   project-root AGENTS.md and loads at session start regardless of
   which files are touched. Simpler but uses more of the 32 KiB
   project_doc_max_bytes budget.

3. **Mix — let Codex decide per-item** — For each proposed
   skill / rule, I propose a scope (path-scoped or always-on) based
   on the content. You review the choices in Turn 3.

────────────────────────────────────────────────────────────────────

Reply with:
`Q1: 1,2,3`
`Q2: 1,3`
`Q3: 1`

If the user picks "Other (4)" in Q2, follow up with a free-text
request: "Please describe what other knowledge areas should be
captured."

TURN 3 — EXPLORE AND PROPOSE

For each selected knowledge area, explore the relevant parts of the
codebase to gather concrete details. Don't ask the user questions you
can answer by reading code (e.g., don't ask "what testing library do
you use" if package.json shows it).

If the user has the multi-agent feature enabled, you may explicitly
ask Codex to spawn a few read-only `explorer` subagents to investigate
in parallel (Codex supports parallel subagents; default `max_threads`
is 6, `max_depth` is 1). Use this when the codebase is large enough
that serial reading would burn tokens unnecessarily.

Then synthesize a proposal: for each area, decide if it should be a
skill or a path-scoped AGENTS.md, and where in the tree the path-
scoped file goes.

DECISION GUIDE:

Use a **path-scoped AGENTS.md** (in a subdirectory) when:
- Content is short (under ~50 lines)
- It's a simple list of conventions for files in that subtree
- Always-on for any session working below that path
- No need for explicit invocation, scripts, or supporting files

Use a **skill** (.agents/skills/<name>/SKILL.md) when:
- Content is richer (reference docs, multiple sections, examples)
- It's procedural ("when adding an API endpoint, do X then Y then Z")
- Needs supporting scripts, references, or assets
- Could benefit from explicit invocation via `$skill-name` or
  `/skills` picker
- The trigger condition is content-based (the user's request matches
  the skill's description) rather than path-based

For each proposed item, draft full frontmatter + body.

EXAMPLE — Path-scoped AGENTS.md for API conventions:

File: `src/api/AGENTS.md`

```
## API conventions

When writing or modifying API endpoints in this subtree:

- All endpoints return responses matching the `ApiResponse<T>` shape
  in `src/api/types.ts` (success: T | error: { code, message,
  details? })
- Validation uses Zod schemas defined in `src/api/schemas/`, never
  inline
- Errors throw `AppError` subclasses, never bare `Error` (handlers
  catch AppError and produce error responses; bare Error becomes 500)
- All endpoints have an OpenAPI annotation comment above the handler

This file is auto-loaded by Codex whenever the working directory is at
or below `src/api/`. Closer-to-CWD AGENTS.md files override parent
files at conflicting keys, so subdirectories can refine these rules.
```

EXAMPLE — Skill for architecture context:

File: `.agents/skills/architecture/SKILL.md`

```
---
name: architecture
description: How this codebase is structured, layered, and what depends on what. Trigger when the user asks about adding new modules, refactoring across boundaries, or deciding where new code should live. Also good for orienting newcomers to the codebase.
---

# Architecture

[Detailed layered architecture description, dependency direction,
naming conventions, the answer to "where does X go" for common cases.
Includes examples from the actual codebase referenced by path.]

## Module boundaries
...

## Dependency direction
...

## Where things go
...
```

Optionally pair with `.agents/skills/architecture/agents/openai.yaml`
for display metadata:

```yaml
interface:
  display_name: "Architecture"
  short_description: "Module layout, layering, and dependency rules"

policy:
  allow_implicit_invocation: true
```

(Implicit invocation lets Codex pull the skill in automatically when
the user's prompt matches the description. Set to `false` if you want
explicit-only invocation via `/skills` or `$architecture`.)

When findings.md from Phase 0 exists, incorporate option-(b) red flags
into the proposed code-review skill draft (or note them as candidates
if no code-review skill is being proposed in this phase — they'll be
picked up when that skill is set up by Phase 2).

Self-critique before showing the proposal:
  - For each proposed skill: does this duplicate a bundled Codex
    skill (`$imagegen`, web search, etc.)? If so, drop it.
  - For each proposed path-scoped AGENTS.md: is the path actually
    where the relevant code lives? Will Codex's discovery pick it up
    when the user is working in that subtree?
  - For each item: is it minimal — would removing it cause Codex to
    make mistakes, not just produce slightly worse output?
  - Total content: will it fit comfortably in the 32 KiB
    project_doc_max_bytes budget combined with the existing AGENTS.md?

Show the proposal in chat as a preview block and ask for approval:

────────────────────────────────────────────────────────────────────
**Apply this proposed set of skills and path-scoped AGENTS.md files?**

I'm proposing the following:

[Markdown preview showing each proposed file: path, frontmatter, body
summary. Compact — one block per item. Note total file count and
target directories.]

Reply with one of:
1. **Apply all as proposed** — write files and commit.
2. **Apply but drop specific items** — list which numbers to drop,
   I'll apply the rest.
3. **Iterate on details** — walk through each item, refine wording,
   scope, and frontmatter before writing.
4. **Skip this phase entirely** — /init's existing output is
   sufficient. You can run this phase later.
────────────────────────────────────────────────────────────────────

Iterate via follow-up numbered questions if user chose to drop or
refine.

TURN 4 — IMPLEMENT (after approval)

For each approved skill, create the directory structure and SKILL.md:

```
.agents/skills/<skill-name>/SKILL.md
```

Use minimal frontmatter — only the fields you actually need:

Required:
- `name` — kebab-case identifier
- `description` — used to decide when Codex implicitly invokes the
  skill; write this for the trigger condition, not as a summary

Optional supporting files in the skill folder:
- `scripts/` — for deterministic helper scripts the skill calls
- `references/` — long-form reference docs the skill points to
- `assets/` — icons, sample images, etc.
- `agents/openai.yaml` — Codex-specific display metadata and policy
  settings (display_name, short_description, icon paths, brand_color,
  default_prompt, policy.allow_implicit_invocation,
  dependencies.tools)

For each approved path-scoped AGENTS.md, write it at the chosen
subdirectory:

```
<subdir>/AGENTS.md
```

These have no frontmatter — they're plain markdown. Codex's discovery
walks from the repo root down to the CWD, concatenating each AGENTS.md
it finds.

After writing all files:

1. Update AGENTS.md's "Skills available in this project" and "Agents
   available in this project" indexes (left as placeholders by Phase
   0) to list the newly-created skills. Keep entries to one line each:
   `- $skill-name — short purpose`. (Agents are populated by Phase 2.)

   The /ecosystem-review skill (if set up by Phase 2) can keep this
   index current going forward. For now, just write the current state.

2. If findings.md was incorporated into a code-review skill that was
   proposed and approved, delete .codex/session/findings.md. If
   findings.md was NOT consumed (e.g., user deferred the code-review
   skill), keep findings.md so Phase 2 can read it.

3. Commit with a clear message: "chore(codex): Phase 1 — add knowledge
   skills and path-scoped AGENTS.md". Use multi-line commit body
   listing each file.

4. Post a final line in chat:
   "Phase 1 complete — added [N] skills and [M] path-scoped AGENTS.md
   files. You can now run the next setup phase whenever you're
   ready."
````
