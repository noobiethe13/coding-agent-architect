---
title: "Phase 3: Multi-Session Continuity Infrastructure"
description: "Sets up native session resume + the manual 3-file pattern, backlog file scaffolding, and config.toml profiles for multi-session work."
tool: "codex"
type: "setup"
author: "noobiethe13"
verified_version: "0.133.0"
recommended_model: "GPT-5.5"
tags: ["existing-repo", "session-continuity", "backlog", "permissions"]
---

## What this does

This phase sets up the infrastructure that lets multi-session work survive across separate Codex sessions. Codex has stronger native support than most agents — `codex resume`, `codex fork`, Chronicle memory, and the `/memories` system — so this phase covers BOTH:

1. **Native session flow** — how to use `codex resume --last`, `/memories`, and `codex exec resume --output-schema` for structured handoffs.
2. **Manual 3-file pattern** — a universal `session` skill defining `plan.md` / `context.md` / `tasks.md` in `.codex/session/` for important multi-week work that needs to survive `/clear`, machine moves, and teammate handoffs.

Additionally, this phase:

- Scaffolds the backlog files (`.codex/known-issues.md`, `.codex/security-findings.md`) if an earlier phase set up agents that need them.
- Ensures `.gitignore` covers session working state.
- Scaffolds a permissions profile in `~/.codex/config.toml` (or project `.codex/config.toml`) based on a selected sensitivity level.

> Ecosystem health is handled by the manually-invoked `/ecosystem-review` skill (if set up by Phase 2), not by an automatic hook.

## Prerequisites & Execution

- **Prerequisites:**
  - The global behavioral guidelines marker (`# CODEX-PROMPTS-PHASE-0-INSTALLED`) should exist in `~/.codex/AGENTS.md` (warning if missing).
  - The project `AGENTS.md` must contain Lessons Learned and skills/agents index sections (set up by Phase 0).
  - Depending on what earlier phases produced, this prompt will dynamically scaffold the necessary backlog files.
- **Token cost:** Low-medium. Mostly file construction and one approval question.

## The Prompt

Copy the text below and paste it directly into your Codex CLI terminal.

````text
You are setting up multi-session continuity infrastructure for this
project: native-resume guidance, the universal session-continuity
skill, backlog file scaffolding, .gitignore entries, and a permissions
profile in config.toml.

PRE-FLIGHT — VERIFY PREREQUISITES

- Read ~/.codex/AGENTS.md and confirm the marker
  `# CODEX-PROMPTS-PHASE-0-INSTALLED` is present (universal behavioral
  guidelines installed at user-level AGENTS.md).
- Read the project AGENTS.md (./AGENTS.md) and confirm it contains the
  headings `## Lessons Learned`, `## Skills available in this project`,
  and `## Agents available in this project` (added by Phase 0).
- List .agents/skills/, .codex/agents/, and any path-scoped AGENTS.md
  files to note what earlier phases produced — this informs the
  inventory and which backlog files need scaffolding.

If either of the first two checks fails, surface a clear notice
describing what's missing and pause for user direction (offer to
proceed without it, or to install the missing piece first).

SELF-VERIFICATION

Verify against current Codex docs:
- https://developers.openai.com/codex/skills — confirm SKILL.md
  location and format hasn't changed
- https://developers.openai.com/codex/config-reference — confirm the
  permissions profile schema (`permissions.<name>.filesystem`,
  `permissions.<name>.network.enabled`,
  `permissions.<name>.workspace_roots`) and the global
  `approval_policy` and `sandbox_mode` keys
- Confirm `codex resume --last`, `codex fork`, and `/memories` are
  still the current native-resume primitives

If you can't fetch docs, tell the user and ask permission to proceed.

Bundled built-in skills (don't duplicate): image generation, web
search. Bundled commands not to duplicate: /resume, /fork, /memories,
/compact, /new, /side — these are Codex's native session controls.

TURN 1 — INVENTORY

Read existing setup:
- .agents/skills/session/SKILL.md — does a session skill already
  exist (e.g., from /init)? If yes, you'll augment, not replace.
- .gitignore — does it already gitignore .codex/session/?
- .codex/known-issues.md — exists? (Typically created by Phase 0 or
  by /audit if available.)
- .codex/security-findings.md — exists? (Created if security-auditor
  was set up by Phase 2.)
- .codex/agents/ contents — note which custom agents exist; informs
  whether backlog files need scaffolding (e.g.,
  security-findings.md only needed if security-auditor exists).
- ~/.codex/config.toml — does it already have permissions profiles
  configured? If yes, you'll surface the additions needed, not
  overwrite.

Post a brief inventory.

TURN 2 — DRAFT THE COMPONENTS

Component 1: Session continuity skill

If .agents/skills/session/ already exists (from /init), read it and
propose augmentations rather than overwriting. Otherwise create:

`.agents/skills/session/SKILL.md`:

```
---
name: session
description: Universal 3-file session continuity pattern for any work spanning multiple Codex sessions. Use when starting a feature, a multi-session remediation, a complex bug investigation, or an architectural overhaul. Sets up plan.md / context.md / tasks.md in .codex/session/ so work can be resumed across separate sessions — complementing Codex's native `codex resume` for work that needs to survive /clear, machine moves, or teammate handoffs.
---

# Session Continuity

Codex has strong native session continuity:

- `codex resume --last` resumes the most recent conversation from the
  current directory.
- `codex resume <session-id>` resumes a specific session by ID.
- `codex fork --last` clones a conversation into a new thread to
  explore alternatives.
- `/memories` configures whether prior session knowledge gets
  injected into new sessions automatically.

Use those first. They cover most multi-session work.

This skill adds an EXPLICIT 3-file pattern on top, for work that:

- Spans many sessions (not just two)
- Needs to survive /clear, machine moves, or teammate handoffs
- Has phases the team wants to track explicitly (not just the
  conversation history)

## The 3 files

All in `.codex/session/` (gitignored — local working state, not
committed):

### plan.md
The high-level plan. What we're building, in what order, with what
constraints. Updated when the plan changes — not on every step.

Structure:
- Goal (1-2 sentences)
- Constraints (must / must not / nice-to-have)
- Approach (numbered phases)
- Open questions (items that need user input before proceeding)

### context.md
Working knowledge accumulated during the work. Things you'd otherwise
have to re-derive next session.

Structure:
- Key files touched and why
- Patterns / conventions discovered (especially anything Codex
  tripped on)
- External constraints (API quirks, dependency limitations) that
  affected the approach
- Decisions made and why (especially decisions that closed off other
  approaches)

### tasks.md
The concrete work items, with state.

Structure:
- One section per phase from plan.md
- Inside each phase: checklist of tasks (- [ ] open, - [x] done,
  - [-] skipped)
- After each task, optional 1-line note on outcome (commit hash, test
  result, blocker found)

## Resuming a session

When starting a new Codex session on existing work:

1. Try `codex resume --last` first — if Codex's session store has the
   prior conversation, use it.
2. If that's gone (machine moved, store cleared, teammate took over),
   read all three .codex/session/ files first, then continue from the
   next unchecked task in tasks.md, with context already in mind.

## Updating during work

- Mark tasks done as you complete them (don't batch updates at end)
- Add to context.md when you discover something non-obvious
- Update plan.md only when the plan itself changes (re-scoping, new
  phase added, approach change)
- Don't write to these files just to seem productive — every entry
  should be something a future session would actually read.

## When to retire the files

When the work is complete and committed:
- The 3 files are no longer needed (their purpose was preserving
  state for future sessions; that future is now)
- Delete them, OR
- If parts of context.md captured generalizable lessons, move those
  to AGENTS.md's Lessons Learned section first, then delete

## Headless / scripted hand-offs

For programmatic hand-offs between Codex sessions (e.g., CI to
follow-up review), `codex exec resume --output-schema <schema.json>`
returns a structured result you can pipe into the next invocation.
Combine that with the 3-file pattern when the structured payload
isn't enough.

## Multi-session work types this applies to

- /feature — implementing a feature
- /remediate — multi-session refactors from .codex/known-issues.md
- /rca — complex root-cause investigation that spans sessions
- /ecosystem-review — when used in drift mode on a large codebase or
  in doc mode for a long-form doc that won't fit one session
- Architectural overhauls
- Large planned changes

NOT for: simple single-session work (the 3-file overhead isn't
worth it). NOT for: short cross-session work that `codex resume`
handles cleanly.

## .gitignore

Ensure .codex/session/ is gitignored. The files are working state,
not team artifacts.
```

Component 2: .gitignore entries

Append to .gitignore (creating if needed):

```
# Codex session working state (3-file continuity pattern)
.codex/session/

# Personal config overrides (not shared with team)
.codex/config.local.toml

# Local-only agent memory (if the team chose project-local memory)
# .codex/agent-memory-local/
```

(If the team chose to keep agent memory project-local rather than
committed, uncomment the last line. Default: agent memory at
`.codex/agent-memory/` is committable.)

Component 3: Backlog file scaffolding

If .codex/known-issues.md already exists, leave it alone. If it
doesn't and a quality pair (auditor + remediator) exists in
`.codex/agents/`, create it now with this format:

```
# Known Issues — Remediation Backlog
#
# This file tracks codebase issues that are known but not yet
# fixed. Use /remediate (if available) to work through these one at
# a time.
#
# States: open | in-progress | fixed | accepted | deferred

---

## ISSUE-001: [Short title]
**State**: open
**Identified**: YYYY-MM-DD (initial scaffold)
**Path**: [file path or pattern]
**Issue**: [what's wrong, 1-3 sentences]
**Suggested approach**: [remediation idea, may be multi-session]
```

(Leave the file with only the header and no ISSUE entries if there
are no existing issues to seed — the auditor agent will append
entries later using the next available ISSUE-NNN identifier.)

If .codex/security-findings.md doesn't exist and a security-auditor
was set up by Phase 2, create:

`.codex/security-findings.md`:

```
# Security Findings — Tracked Backlog

This file tracks security findings from /security-audit. Findings
are addressed deliberately by humans (no auto-fix), via /feature
work or direct edits as appropriate.

States: open | in-progress | fixed | accepted | deferred

---

<!-- Findings populated by /security-audit; one section per
finding. -->
```

Component 4: Permissions profile in config.toml

Codex has permission profiles in `~/.codex/config.toml` (and optionally
project `.codex/config.toml` for project overrides) that pair with
`approval_policy` and `sandbox_mode` to control what Codex can do
without prompting.

Render the sensitivity question in chat (numbered list).

Profile options to surface (full preview in TURN 3):

- **Minimal** — `sandbox_mode = "workspace-write"`,
  `approval_policy = "on-request"`. Permissions profile grants
  write access to `.codex/`, `.agents/`, `.codex/agent-memory/`,
  and `.codex/session/` without prompts. No deny rules.

- **Standard (recommended)** — Minimal + permissions profile denies
  reads of `.env*`, `secrets/**`. Network access disabled by default;
  enabled only for `mcp_servers` configured explicitly.

- **Strict** — Standard + `approval_policy = "untrusted"` (most
  prompts) + `sandbox_mode = "read-only"` by default. Codex proposes
  changes only; the user approves each edit.

- **Custom — I'll edit** — write a minimal stub with comments
  pointing at the config-reference docs, let the user fill in.

For each profile, the generated config snippet adapts to what Phase 3
actually set up. If `code-quality-auditor` exists, the profile's
filesystem `write` paths include `.codex/known-issues.md`. If
`security-auditor` exists, include `.codex/security-findings.md`. If
any agent uses persistent memory under `.codex/agent-memory/`,
include that path under `write`.

VERIFY against current docs before writing — the schema may have
evolved:
- https://developers.openai.com/codex/config-reference (especially
  the `permissions.<name>` and `sandbox_*` sections)
- Confirm precedence: deny > write > read > inherit > workspace_roots
  defaults
- Confirm syntax for filesystem paths and network domain entries

Example output for Standard profile (assuming quality + security pair
are both enabled and at least one agent uses persistent memory under
.codex/agent-memory/):

```toml
# Append to ~/.codex/config.toml — adjust for project scope if
# preferred (project .codex/config.toml can override).

approval_policy = "on-request"
sandbox_mode = "workspace-write"

[permissions.standard]
workspace_roots = [".", ".codex", ".agents"]

[permissions.standard.filesystem]
".codex/known-issues.md" = "write"
".codex/security-findings.md" = "write"
".codex/agent-memory/" = "write"
".codex/session/" = "write"
".env" = "deny"
".env.*" = "deny"
"secrets/" = "deny"

[permissions.standard.network]
enabled = false
# Enable per MCP server in [mcp_servers.<id>] instead.

default_permissions = "standard"
```

If `~/.codex/config.toml` already exists, do NOT overwrite. Read it,
diff against the proposed profile-derived rules, and surface the
*additions* needed for any specialist agents already set up to work
without prompts. The user reviews and applies.

`~/.codex/config.local.toml` is the personal-overrides file (kept out
of dotfile sync, project-specific). Don't write it unless asked — but
DO add `.codex/config.local.toml` to the project .gitignore (already
in Component 2).

SELF-CRITIQUE BEFORE PRESENTING

- Session skill: explicit about being COMPLEMENTARY to
  `codex resume`, not a replacement?
- Backlog files: format matches what /audit and /security-audit will
  produce? Only created when the corresponding agent exists?
- .gitignore: doesn't gitignore committed files
  (.codex/known-issues.md and .codex/security-findings.md should
  NOT be gitignored — they're shared team backlog)?
- No reference to an automatic ecosystem hook anywhere in the
  components (ecosystem health is handled by the manually invoked
  /ecosystem-review skill)?
- config.toml profile: actually grants the writes the agents need,
  and denies the sensitive paths?

TURN 3 — REVIEW AND APPROVE

Render approval as a two-part chat question. Codex has no structured
picker; the user replies with two answers.

────────────────────────────────────────────────────────────────────
**Question 1 — Permissions profile** (single-select; reply with one
number)

Which permissions profile should I install in config.toml?

1. **Standard (recommended)** — `sandbox_mode = "workspace-write"`,
   `approval_policy = "on-request"`. Allows agent backlog/memory/
   session writes; denies `.env`/secrets reads; network disabled
   except for explicit MCP servers. Sensible default for most teams.

2. **Minimal** — Just the writes needed so specialist agents don't
   prompt on every backlog/memory operation. No deny rules. Use when
   your environment is already trusted (or has external sandboxing).

3. **Strict** — Standard + `approval_policy = "untrusted"` +
   `sandbox_mode = "read-only"` as the default. Codex proposes
   changes; you approve each edit. Best for unfamiliar codebases or
   production-facing repos.

4. **Skip — I'll write it myself** — Don't write a profile to
   config.toml. The agents may prompt for permission on each
   backlog/memory write until you configure this manually.

**Question 2 — Apply all Phase 3 components?** (single-select; reply
with one number)

1. **Apply all as proposed** — session skill, .gitignore entries,
   backlog scaffolding (only files corresponding to agents already
   in .codex/agents/), and the profile picked above.

2. **Apply session skill only — skip backlog & config scaffolding** —
   skip creating known-issues.md / security-findings.md / config.toml
   profile (e.g., you'll create them later or they live elsewhere).
   Just install the session continuity skill and .gitignore entries.

3. **Iterate before writing** — walk through specific components;
   refine before I write.

4. **Skip this phase** — don't install Phase 3 infrastructure. You
   can run this phase later if needs grow.
────────────────────────────────────────────────────────────────────

Reply with:
`Q1: 1`
`Q2: 1`

TURN 4 — IMPLEMENT (after approval)

Write all approved components. Update AGENTS.md "Skills available"
index to include `$session` if newly created.

Commit with message: "feat(codex): Phase 3 — session continuity
infrastructure". Multi-line body listing each file.

Post a final line in chat:
"Phase 3 complete — session continuity skill, backlog scaffolding,
.gitignore, and config.toml profile in place. You can now run the
next setup phase whenever you're ready. New config takes effect on
the next session — restart Codex if you want it active immediately."
````
