---
title: "Phase 3: Multi-Session Continuity Infrastructure"
description: "Sets up the universal session skill (3-file pattern), backlog file scaffolding, and gitignore entries for multi-session work."
tool: "claude-code"
type: "setup"
author: "noobiethe13"
verified_version: "2.1.143"
recommended_model: "Opus 4.7"
tags: ["existing-repo", "session-continuity", "backlog", "permissions"]
---

## Overview

This phase sets up the infrastructure that lets multi-session work survive across separate Claude Code sessions. It creates a universal `session` skill that defines the 3-file pattern (`plan.md`, `context.md`, `tasks.md` in `.claude/session/`). This pattern is used for any long-running task, such as feature work, multi-session remediation, complex bug investigation, or architectural overhauls.

Additionally, this phase:
- Scaffolds the backlog files (`.claude/known-issues.md`, `.claude/security-findings.md`) if an earlier phase set up agents that need them.
- Ensures `.gitignore` covers session working state.
- Scaffolds `.claude/settings.json` permissions based on a selected profile.

*Note: This phase does NOT set up an automatic ecosystem hook. Ecosystem health is handled by the manually invoked `/ecosystem-review` skill (if set up by an earlier phase).*

## Prerequisites & Execution

- **Prerequisites:** - The global behavioral guidelines marker (`# CLAUDE-PROMPTS-PHASE-0-INSTALLED`) must exist in `~/.claude/CLAUDE.md`.
  - The project `CLAUDE.md` must contain Lessons Learned and skills/agents index sections (set up by an earlier phase).
  - Depending on what earlier phases produced, this prompt will dynamically scaffold the necessary backlog files.
- **Token cost:** Low-medium. Mostly file construction and one `AskUserQuestion` for approval.

## The Prompt

Copy the text below and paste it directly into your Claude Code terminal.

````text
You are setting up multi-session continuity infrastructure for this
project: the universal session-continuity skill, backlog file
scaffolding, and a .gitignore entry for session working state.

PRE-FLIGHT — VERIFY PREREQUISITES

- Read ~/.claude/CLAUDE.md and confirm the marker
  `# CLAUDE-PROMPTS-PHASE-0-INSTALLED` is present (universal behavioral
  guidelines installed at User-level CLAUDE.md).
- Read the project CLAUDE.md (./CLAUDE.md or ./.claude/CLAUDE.md) and
  confirm it contains the headings `## Lessons Learned`,
  `## Skills available in this project`, and
  `## Agents available in this project` (added by an earlier setup phase).
- List .claude/skills/, .claude/agents/, and .claude/rules/ to note what
  earlier phases produced — this informs the inventory and which backlog
  files need scaffolding.

If either of the first two checks fails, surface a clear notice
describing what's missing and pause for user direction (offer to proceed
without it, or to install the missing piece first).

SELF-VERIFICATION

Verify against current Claude Code docs:
- https://code.claude.com/docs/en/skills — confirm SKILL.md location
  pattern and that the format hasn't changed

If you can't fetch docs, tell the user and ask permission to proceed.

Built-in /loop, /batch, /simplify, /debug, /claude-api are bundled —
don't duplicate.

TURN 1 — INVENTORY

Read existing setup:
- .claude/skills/session/SKILL.md — does session skill already exist
  (e.g., from /init)? If yes, you'll augment, not replace.
- .gitignore — does it already gitignore .claude/session/?
- .claude/known-issues.md — exists? (Typically created by an earlier
  CLAUDE.md augmentation phase or by /audit if available.)
- .claude/security-findings.md — exists? (Created if security-auditor
  was set up by an earlier phase.)
- .claude/agents/ contents — note which agents exist; informs whether
  backlog files need scaffolding (e.g., security-findings.md only
  needed if security-auditor exists)

Post a brief inventory.

TURN 2 — DRAFT THE COMPONENTS

Component 1: Session continuity skill

If .claude/skills/session/ already exists (from /init), read it and
propose augmentations rather than overwriting. Otherwise create:

`.claude/skills/session/SKILL.md`:

```
---
description: Universal 3-file session continuity pattern for any work spanning multiple Claude Code sessions. Use when starting a feature, a multi-session remediation, a complex bug investigation, or an architectural overhaul. Sets up plan.md / context.md / tasks.md in .claude/session/ so work can be resumed across separate sessions.
when_to_use: When the user starts work that plausibly extends beyond one session — features, large refactors, multi-day investigations, architectural overhauls. Or when the user runs /feature, /remediate, /rca on a complex item.
---

# Session Continuity

This is the UNIVERSAL pattern for multi-session work in this project.
Any agent or workflow skill that takes on work spanning multiple
sessions should create the 3-file set BEFORE starting work.

## The 3 files

All in `.claude/session/` (gitignored — local working state, not
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
- Patterns/conventions discovered (especially anything Claude tripped
  on)
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

When starting a new session on existing work, read all three files
first. Then continue from the next unchecked task in tasks.md, with
context already in mind.

## Updating during work

- Mark tasks done as you complete them (don't batch updates at end)
- Add to context.md when you discover something non-obvious
- Update plan.md only when the plan itself changes (re-scoping, new
  phase added, approach change)
- Don't write to these files just to seem productive — every entry
  should be something a future session would actually read.

## When to retire the files

When the work is complete and committed:
- The 3 files are no longer needed (their purpose was preserving state
  for future sessions; that future is now)
- Delete them, OR
- If parts of context.md captured generalizable lessons, move those to
  CLAUDE.md's Lessons Learned section first, then delete

## Multi-session work types this applies to

- /feature — implementing a feature
- /remediate — multi-session refactors from .claude/known-issues.md
- /rca — complex root-cause investigation that spans sessions
- /ecosystem-review — when used in Mode A on a large codebase or in
  Mode B for a long-form doc that won't fit one session
- Architectural overhauls
- Large planned changes

NOT for: simple single-session work (the 3-file overhead isn't worth
it).

## .gitignore

Ensure .claude/session/ is gitignored. The files are working state,
not team artifacts.
```

Component 2: .gitignore entries

Append to .gitignore (creating if needed):
```
# Claude Code session working state (3-file continuity pattern)
.claude/session/
```

```
# Personal settings overrides (not shared with team)
.claude/settings.local.json

(If the team chose to keep agent memory project-local rather than committed,
also add `.claude/agent-memory-local/` here. Default: agent memory at
`.claude/agent-memory/` is committable.)
```

Component 3: Backlog file scaffolding

If .claude/known-issues.md already exists, leave it alone. If it doesn't
and a quality pair (auditor + remediator) exists in `.claude/agents/`,
create it now with this format:

```
# Known Issues — Remediation Backlog
#
# This file tracks codebase issues that are known but not yet fixed.
# Use /remediate (if available) to work through these one at a time.
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

(Leave the file with only the header and no ISSUE entries if there are
no existing issues to seed — the auditor agent will append entries later
using the next available ISSUE-NNN identifier.)

If .claude/security-findings.md doesn't exist and a security-auditor was
set up by an earlier phase, create:

`.claude/security-findings.md`:

```
# Security Findings — Tracked Backlog

This file tracks security findings from /security-audit. Findings are
addressed deliberately by humans (no auto-fix), via /feature work or
direct edits as appropriate.

States: open | in-progress | fixed | accepted | deferred

---

<!-- Findings populated by /security-audit; one section per finding. -->
```

Component 4: .claude/settings.json (permissions scaffolding)

Elicit the sensitivity profile via AskUserQuestion within this turn's
single approval call (see TURN 3). Don't write settings.json until the
profile is chosen.

Profile options to surface:

- **Minimal** — only the allow entries needed so agents can write to their
  own backlog/memory files without permission prompts. No deny rules. Best
  for projects already running in a trusted environment.

- **Standard (recommended)** — minimal + sensible deny rules (`.env`,
  `secrets/**`, destructive commands like `rm -rf`, network exfiltration
  tools `curl`/`wget`). Ask before `git push`, `rm`, `npm publish`.

- **Strict** — Standard + `defaultMode: "plan"` so non-trivial work goes
  through plan mode by default. Best for unfamiliar codebases or
  production-facing repos.

- **Custom — I'll edit** — write a minimal stub with comments pointing at
  the docs, let the user fill in.

For each profile, the generated .claude/settings.json adapts to what Phase
3 actually set up. If `code-quality-auditor` exists, include
`Edit(.claude/known-issues.md)` in allow. If `security-auditor` exists,
include `Edit(.claude/security-findings.md)`. If any agent uses
`memory: project`, include `Edit(.claude/agent-memory/**)` and
`Write(.claude/agent-memory/**)`. Always include `Write(.claude/session/**)`
and `Edit(.claude/session/**)` since the session skill is universal.

VERIFY against current docs before writing — the schema may have evolved:
- https://code.claude.com/docs/en/permissions
- Confirm `permissions.allow / ask / deny / defaultMode / additionalDirectories`
  fields are current
- Confirm rule pattern syntax (`Bash(cmd:*)`, `Edit(path)`, etc.) hasn't
  changed
- Confirm precedence: deny > allow > ask > defaultMode fallback

Example output for Standard profile, assuming the quality + security
pair are both enabled with memory-on agents (auditor's backlog write
needs explicit allow since auditor doesn't have memory):

```json
{
  "permissions": {
    "allow": [
      "Edit(.claude/known-issues.md)",
      "Edit(.claude/security-findings.md)",
      "Edit(.claude/agent-memory/**)",
      "Write(.claude/agent-memory/**)",
      "Edit(.claude/session/**)",
      "Write(.claude/session/**)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git branch:*)",
      "Bash(git rev-parse:*)"
    ],
    "ask": [
      "Bash(git push:*)",
      "Bash(rm:*)",
      "Bash(npm publish:*)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Bash(rm -rf:*)",
      "Bash(curl:*)",
      "Bash(wget:*)",
      "Bash(sudo:*)"
    ]
  }
}
```

If .claude/settings.json already exists, do NOT overwrite. Read it,
diff against the proposed profile-derived rules, and surface the
*additions* needed for any specialist agents already set up to work
without prompts. The user reviews and applies.

`.claude/settings.local.json` is the personal-overrides file (gitignored).
Don't write it unless asked — but DO add it to .gitignore in Component 2
above.

SELF-CRITIQUE BEFORE PRESENTING

- Session skill: explicit about being universal (not just for /feature
  or one specific workflow)?
- Backlog files: format matches what /audit and /security-audit will
  produce? Only created when the corresponding agent exists?
- .gitignore: doesn't gitignore committed files (.claude/known-issues.md
  and .claude/security-findings.md should NOT be gitignored — they're
  shared team backlog)?
- No reference to an automatic ecosystem hook anywhere in the components
  (ecosystem health is handled by the manually invoked /ecosystem-review
  skill, not by a hook)?

TURN 3 — REVIEW AND APPROVE

Show all components via AskUserQuestion preview.

AskUserQuestion with:
  questions: [
    {
      question: "Which permissions profile for .claude/settings.json?",
      header: "Permissions",
      multiSelect: false,
      options: [
        {
          label: "Standard (recommended)",
          preview: "**Standard**\n\nAllow: agent backlog/memory writes, session writes, read-only git commands.\nAsk: `git push`, `rm`, `npm publish`.\nDeny: `.env`/secrets reads, destructive commands (`rm -rf`, `curl`, `wget`, `sudo`).\n\n[Full settings.json shown below in apply-step preview]"
        },
        {
          label: "Minimal",
          preview: "**Minimal**\n\nJust the allow entries needed so any specialist agents already set up can write to their backlog/memory/session files without prompts. No ask/deny rules. Use when your environment is already trusted (or has external sandboxing)."
        },
        {
          label: "Strict",
          preview: "**Strict**\n\nStandard + `defaultMode: \"plan\"` so non-trivial work goes through plan mode by default. Best for unfamiliar codebases or production-facing repos."
        },
        {
          label: "Skip — I'll write it myself",
          preview: "Don't write settings.json. The agents may prompt for permission on each backlog/memory write until you set this up manually."
        }
      ]
    },
    {
      question: "Apply Phase 3 components?",
      header: "Apply",
      multiSelect: false,
      options: [
        {
          label: "Apply all as proposed",
          preview: "[Compact preview: list of files being created/modified — session skill, .gitignore entries, any backlog file scaffolding needed based on agents already in .claude/agents/, settings.json per the profile picked above.]"
        },
        {
          label: "Apply session skill only — skip backlog & settings scaffolding",
          preview: "Skip creating known-issues.md / security-findings.md / settings.json (e.g., you'll create them later or they live elsewhere). Just install the session continuity skill and .gitignore entries."
        },
        {
          label: "Iterate before writing",
          preview: "Walk through specific components; refine before I write."
        },
        {
          label: "Skip this phase",
          preview: "Don't install Phase 3 infrastructure. You can run this phase later if needs grow."
        }
      ]
    }
  ]

TURN 4 — IMPLEMENT (after approval)

Write all approved components. Update CLAUDE.md "Skills available"
index to include `session` if newly created.

Commit with message: "feat(claude): Phase 3 — session continuity
infrastructure". Multi-line body listing each file.

Delete .claude/session/phase-3-plan.md if you wrote one.

Post a final line in chat:
"Phase 3 complete — session continuity skill, backlog scaffolding, and
.gitignore in place. You can now run the next setup phase whenever
you're ready."
````
