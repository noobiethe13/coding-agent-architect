# Contributing

Thanks for considering a contribution. The bar for new content is simple: does it help someone else, and is it accurate?

Useful ways to contribute:

1. Add a new blueprint for an existing tool.
2. Improve an existing blueprint (clearer prompt, updated for a new tool version, better defaults).
3. Add support for a new tool (Cursor, Copilot, Windsurf, Codex, or anything else).

If you're not sure where your idea fits, open an issue first.

## Before you start

- Test your blueprint against the tool version listed in `verified_version`. If it hasn't run end-to-end on a real machine, it shouldn't ship.
- Don't copy a prompt you haven't read. Every line is something an agent will execute, so treat it like code.
- One blueprint per file. If a setup needs multiple phases, split them (`phase-0.md`, `phase-1.md`, etc.) and link them in the prose.

## Repository layout

Every blueprint lives at:

```
blueprints/<tool>/<folder>/<file>.md
```

- `<tool>` matches the `tool` field in frontmatter (`claude-code`, `cursor`, `copilot`, `windsurf`). Kebab-case.
- `<folder>` is either a **goal folder** or a **type folder** (see below). Kebab-case.
- `<file>` depends on which kind of folder you're in.

### Two kinds of folders

**Goal folders** hold multi-phase setup flows. Examples that exist today: `core-setup/`, `existing-repo-setup/`, `new-repo-setup/`. The community can add a new goal folder (e.g. `migrate-to-monorepo/`) any time a setup workflow is worth standardizing. Inside a goal folder:

- Files must be named `phase-0.md`, `phase-1.md`, `phase-2.md`, etc.
- Numbering is sequential, starts at `phase-0`, and has no gaps.
- Every phase file uses `type: setup` in its frontmatter.
- Phases are intended to be run top to bottom, so each one should explain what the user should have completed before running it.

**Type folders** hold standalone, single-file artifacts. There are three, and the names are fixed:

- `agents/` for sub-agent definitions (frontmatter `type: agent`).
- `skills/` for packaged skills (frontmatter `type: skill`).
- `rules/` for project rules (frontmatter `type: rule`).

Inside a type folder, filenames are kebab-case and describe the artifact (e.g. `code-reviewer.md`). They don't need ordering.

Both kinds are validated automatically. See [Validating structure](#validating-structure) below.

If you're adding a tool that isn't in the enum yet, see [Adding a new tool](#adding-a-new-tool) below.

## Blueprint anatomy

Every blueprint is a markdown file with YAML frontmatter, prose, and a fenced prompt block.

### Frontmatter schema

Defined in [`site/src/content.config.ts`](site/src/content.config.ts). All fields are validated at build time.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string (3–100) | yes | Shows up in the docs sidebar. |
| `description` | string (10–300) | yes | One-line summary. Shown in listings and search. |
| `tool` | enum | yes | `claude-code` \| `cursor` \| `copilot` \| `windsurf`. |
| `type` | enum | yes | `agent` \| `skill` \| `rule` \| `setup`. |
| `author` | string (1–100) | yes | Your GitHub handle. |
| `verified_version` | string | yes | Version of the tool you tested against, e.g. `2.1.143`. |
| `recommended_model` | string (≤80) | no | E.g. `Opus 4.7`. |
| `tags` | string[] | no | Up to 10, lowercase kebab-case. |

Example frontmatter:

```yaml
---
title: "Phase 0: Global Behavioral Guidelines"
description: "Installs universal behavioral principles into ~/.claude/CLAUDE.md across all projects on your machine."
tool: "claude-code"
type: "setup"
author: "your-github-handle"
verified_version: "2.1.143"
recommended_model: "Opus 4.7"
tags: ["global", "behavior", "onetime"]
---
```

### Prose section

After the frontmatter, write the human-facing docs using these headings in order:

1. `## What this does` — what the blueprint does and when to use it.
2. `## Prerequisites & Execution` — state the user should be in, markers, idempotency checks.
3. `## The Prompt` — the prompt itself, in a fenced `text` block containing the literal text to paste.

> **Do not use `## Overview` as a heading.** Starlight auto-generates an "Overview" entry at the top of every page's table of contents. Using that heading yourself creates a duplicate. The linter (`npm run lint:structure`) will flag it.

Look at [`blueprints/claude-code/core-setup/phase-0.md`](blueprints/claude-code/core-setup/phase-0.md) as the reference shape.

### Prompt-block conventions

The fenced block is what the user copies. A few things that make prompts reliable:

- State the goal in the first paragraph. Don't bury it.
- Include a pre-flight check when the prompt is idempotent (a marker comment in the target file, a check for existing state). The user should be able to run it twice without breakage.
- Use the agent's native tools by name (e.g. `AskUserQuestion`, `Read`, `Edit`). Don't say "ask the user" when you mean a structured tool call.
- Avoid hard-coded paths that vary by OS. Use `~` or environment variables and let the agent resolve them.
- End with a single confirmation line the agent should print on success. Makes it obvious the prompt completed.

## Adding a new tool

The schema enum in [`site/src/content.config.ts`](site/src/content.config.ts) lists which tools are supported. To add a new one (say, Codex):

1. Add the tool slug to the `z.enum([...])` in the schema.
2. Create `blueprints/<tool>/` and add whichever folders you need. At least one goal folder (with a `phase-0.md`) or one of `agents/` / `skills/` / `rules/` with a real artifact inside.
3. Update the README roadmap section.
4. Run `npm run lint` and `npm run dev` to confirm structure and schema are both clean.

Open the PR with all the changes together. Reviewers will want to see at least one usable blueprint before the new tool slug ships.

## Validating structure

```sh
cd site
npm install
npm run lint
```

`npm run lint` runs two checks:

- `lint:structure` ([`site/validate-blueprints.mjs`](site/validate-blueprints.mjs)) walks `blueprints/` and enforces the folder rules above: kebab-case names, `phase-N.md` sequencing inside goal folders, flat layout inside type folders.
- `lint:md` runs `markdownlint` over every blueprint using [`.markdownlint.json`](.markdownlint.json).

Run them individually as `npm run lint:structure` or `npm run lint:md` while iterating. Fix anything they flag before opening a PR.

## Testing locally

```sh
cd site
npm install
npm run dev
```

Open `localhost:4321`, find your blueprint in the sidebar, and confirm it renders without schema errors. If the frontmatter is wrong, the build fails with a useful message.

## PR checklist

- [ ] Blueprint lives in the right folder: a goal folder (`phase-N.md`) for setup flows, or `agents/` / `skills/` / `rules/` for standalone artifacts.
- [ ] If it's a phase file, numbering is sequential, starts at `phase-0`, and has no gaps.
- [ ] If it's a standalone artifact, the filename is kebab-case and describes the artifact.
- [ ] Frontmatter passes the schema (run `npm run dev` and check the build).
- [ ] `verified_version` reflects the tool version you actually tested with.
- [ ] You've run the prompt end-to-end on a real machine.
- [ ] `npm run lint` is clean (covers both structure and markdown).
- [ ] If you're adding a new tool, the schema enum is updated in the same PR.

## Style notes

- Plain English over jargon. Write the way you'd explain it to a teammate.
- No emoji in blueprint prose unless it carries information.
- Headings are sentence case.
- Prompt blocks use `text` fences, not `markdown`. They're literal.

## Code of conduct

Be kind, assume good faith, and if you see something off, open an issue.
