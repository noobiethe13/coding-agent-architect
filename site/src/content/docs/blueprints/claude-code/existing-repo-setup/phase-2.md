---
title: "Phase 2: Specialist Agents & Workflow Skills"
description: "Adds specialist subagents with persistent memory and isolated tools, along with their paired workflow skills."
tool: "claude-code"
type: "setup"
author: "noobiethe13"
verified_version: "2.1.143"
recommended_model: "Opus 4.7"
tags: ["existing-repo", "agents", "skills", "workflows"]
---

## Overview

This phase adds specialist subagents (which run in a separate context window with persistent memory and isolated tools) and their paired workflow skills (the slash commands you invoke). 

It provides soft-nudge candidates that you can choose from, or you can describe your own custom needs. Example pairings include:
- **Quality Pair:** `code-quality-auditor` + `/audit` and `code-quality-remediator` + `/remediate`
- **Security & Ecosystem:** `security-auditor` + `/security-audit` and `ecosystem-reviewer` + `/ecosystem-review`
- **Review & Debugging:** `code-reviewer` + `/pr-review` and `bug-investigator` + `/rca`
- **Feature Work:** A multi-session `feature-implementer` skill

## Prerequisites & Execution

- **Prerequisites:** - The global behavioral guidelines marker (`# CLAUDE-PROMPTS-PHASE-0-INSTALLED`) must exist in `~/.claude/CLAUDE.md`.
  - The project `CLAUDE.md` must contain Lessons Learned and skills/agents index sections (set up by an earlier phase).
  - *(Note: any earlier knowledge-skills phase is optional. If it ran, this phase will augment its outputs, not replace them).*
- **Token cost:** High. This is the most reasoning-heavy phase. It reads the codebase, utilizes multiple `AskUserQuestion` interactions, and drafts complex frontmatter for each selected agent and skill.

## The Prompt

Copy the text below and paste it directly into your Claude Code terminal.

````text
You are setting up specialist subagents and their paired workflow skills for
this project. Subagents run in their own context window with custom system
prompts, restricted tools, and (optionally) persistent memory. Workflow
skills are how the user invokes them via /skill-name.

PRE-FLIGHT — VERIFY PREREQUISITES

Step 1: Read ~/.claude/CLAUDE.md and confirm the marker
`# CLAUDE-PROMPTS-PHASE-0-INSTALLED` is present. This marker indicates
the universal behavioral guidelines (think-before-coding, simplicity-
first, surgical-changes, etc.) are installed at the User-level
CLAUDE.md.

Step 2: Read the project CLAUDE.md (./CLAUDE.md or ./.claude/CLAUDE.md)
and confirm it contains these three headings (added by an earlier
setup phase):
- `## Lessons Learned`
- `## Skills available in this project`
- `## Agents available in this project`

Step 3: List .claude/skills/ and .claude/rules/. A previous setup phase
may or may not have already added knowledge skills and path-scoped rules
here. Note what exists; this phase will add to them, not replace.

If Step 1 or Step 2 fails, surface a clear notice describing what's
missing and pause for user direction (offer to proceed without it, or
to install the missing piece first).

SELF-VERIFICATION

Before writing any frontmatter, verify against current Claude Code docs:
- https://code.claude.com/docs/en/sub-agents — confirm subagent frontmatter
  (name, description required; tools, disallowedTools, model, permissionMode,
  maxTurns, skills, mcpServers, hooks, memory, background, effort, isolation,
  color, initialPrompt all optional)
- https://code.claude.com/docs/en/skills — confirm skill frontmatter
  including disable-model-invocation, context: fork, agent, allowed-tools,
  arguments, argument-hint
- https://code.claude.com/docs/en/commands — confirm which built-ins exist
  so you don't propose duplicates

Built-in subagents available: Explore (Haiku, read-only), Plan (read-only
research), general-purpose (full tools). Reference these in `context: fork`
or `agent:` fields where useful.

Built-in commands NOT to duplicate: /review (deprecated → plugin),
/security-review (PR-diff scope), /simplify (recently-changed-files
review-and-fix), /batch (parallel decomposition), /debug (Claude Code
debugging), /loop, /claude-api.

If you cannot fetch docs, tell the user and ask whether to proceed with
this prompt's schemas. Flag any frontmatter you write as
"unverified — please double-check against current docs".

TURN 1 — INVENTORY AND ORIENT

Read existing setup:
- .claude/agents/ contents — list any custom agents already defined
- .claude/skills/ contents — list any workflow skills already defined
- .claude/known-issues.md — does the team already have a remediation
  backlog file? If yes, /audit and /remediate (if proposed) need to
  preserve and extend, not overwrite.
- CLAUDE.md — note any references to existing /audit, /remediate, or
  similar commands

Also do a quick scan of the codebase to inform agent design:
- Languages used (matters for agent prompts — auditor for a Rust project
  flags different things than auditor for a Python project)
- Surface area characteristics (handles auth? payments? user data? — these
  inform whether security-auditor is worth proposing)
- Test setup (informs feature-implementer's verification step)

Post a brief inventory in chat (no proposals yet).

TURN 2 — ELICIT WHAT THE TEAM NEEDS

Use AskUserQuestion to figure out what specialist tooling the team needs.
The starting candidates below are SUGGESTIONS — the user can pick any
combination, drop all of them, or describe custom needs.

AskUserQuestion with:
  questions: [
    {
      question: "Which quality-and-review tooling do you want? Pick all that apply.",
      header: "Quality & review",
      multiSelect: true,
      options: [
        {
          label: "Quality pair: auditor + remediator",
          preview: "**Quality pair (recommended for non-trivial codebases)**\n\nTwo paired agents:\n- `code-quality-auditor` (deep codebase analysis — architectural violations, anti-patterns, complexity hotspots, dead code, separation-of-concerns issues, stack-specific bad practices). Appends new findings to .claude/known-issues.md, skipping items already in accepted/deferred state. No persistent memory: the backlog file already captures its learning surface.\n- `code-quality-remediator` (works through .claude/known-issues.md one item at a time; state lifecycle open → in-progress → fixed/accepted/deferred; only removes items after user confirms fix). Uses `memory: project` to accumulate cross-session learning about which fix approaches worked.\n\nPaired workflow skills: `/audit` (likely with `context: fork`) and `/remediate [issue-id]` (one item per invocation)."
        },
        {
          label: "PR reviewer + /pr-review",
          preview: "**Project-aware PR reviewer**\n\nBuilt-in /review is deprecated (replaced by plugin) and is generic. /pr-review uses a project-specific code-reviewer agent that knows:\n- Your architecture from CLAUDE.md\n- Your team's PR conventions from CLAUDE.md\n- The known-issues backlog (so it doesn't re-flag triaged stuff)\n- Project-specific patterns and anti-patterns from .claude/rules/\n\nIf .claude/session/findings.md exists from an earlier red-flag review, the option-(b) red flags get incorporated into the reviewer's checklist."
        },
        {
          label: "Bug investigator + /rca",
          preview: "**Bug investigator**\n\nRoot-cause analysis specialist. Takes a bug report (error message, repro steps, or just a symptom), traces it through the codebase, identifies root cause, proposes fix.\n\nRuns in fork context (Explore subagent) for non-destructive investigation. Doesn't apply fixes itself — surfaces findings and proposed fix for human review. Different from built-in /debug (which is for debugging Claude Code itself, not user code)."
        },
        {
          label: "None of these",
          preview: "Skip the quality/review cluster. /init's setup + bundled /simplify + built-in /security-review may be sufficient. You can come back to this phase later if needs grow."
        }
      ]
    },
    {
      question: "Which security & ecosystem tooling do you want? Pick all that apply.",
      header: "Security & ecosystem",
      multiSelect: true,
      options: [
        {
          label: "Security auditor + /security-audit",
          preview: "**Security auditor (recommended if project handles auth/payments/user data/server-side code)**\n\nDifferent scope from built-in /security-review (which is branch-diff PR scope). This is codebase-wide periodic scan:\n- Vulnerable dependencies and known CVEs\n- Injection patterns (SQL, command, template, NoSQL, path traversal)\n- Authentication / authorization flaws and missing access checks\n- Secret exposure beyond hardcoded literals (token logging, weak crypto, insecure storage)\n- Insecure defaults, permissive CORS, missing security headers\n- Stack-specific security anti-patterns\n\nWrites findings to .claude/security-findings.md with severity (critical/high/medium/low). Skips already-accepted/deferred items. NO paired auto-fix — security work needs human judgment about priority and blast radius."
        },
        {
          label: "Ecosystem reviewer + /ecosystem-review",
          preview: "**Ecosystem reviewer (recommended)**\n\nManually-invoked drift detection and doc maintenance, with two modes:\n\n*Mode A (no argument or 'review'):* scans .claude/ infrastructure, CLAUDE.md, CONTRIBUTING-AI.md, backlog files, README/CHANGELOG/ARCHITECTURE/CONTRIBUTING/LICENSE/ADRs/docs/ for drift. Surfaces findings (redundancy, orphans, gaps, sync issues, stale project docs, Lessons Learned candidates) for your approval, then applies the approved fixes and commits.\n\n*Mode B (argument is a doc description):* creates a new project doc — README, CONTRIBUTING, LICENSE, ARCHITECTURE, an ADR, a feature doc, or any custom doc you describe. Reads relevant codebase context, proposes a draft for your approval, writes the file, commits.\n\nManual invocation only (`disable-model-invocation: true`). Uses `memory: project` to accumulate the team's documentation conventions."
        },
        {
          label: "Feature implementer skill (multi-session)",
          preview: "**Feature implementer**\n\nA workflow skill for multi-session feature work. Uses the 3-file session continuity pattern (plan.md / context.md / tasks.md in .claude/session/) so feature work survives across separate Claude Code sessions.\n\nFlow: takes a feature description, creates the 3 files, plans the work in chunks, executes one chunk per session, updates context as it goes, marks tasks done as it completes them.\n\nThe session continuity infrastructure itself is set up by a later phase — this option just adds the /feature skill that uses it. Not strictly necessary if /init already created a /feature skill."
        },
        {
          label: "None of these",
          preview: "Skip the security/ecosystem cluster. You can come back to this phase later if needs grow."
        }
      ]
    },
    {
      question: "Anything custom you want to add?",
      header: "Custom",
      multiSelect: false,
      options: [
        {
          label: "Custom agent — I'll describe",
          preview: "**Free-text option** — describe a specialist agent or workflow skill not in this list. Examples teams have built:\n- /design-review (UI/UX consistency check)\n- /accessibility-audit\n- /perf-profile (runs profiler, summarizes hotspots)\n- /docs-update (rewrites docs for changed code)\n- /onboarding (project-specific 'how do I get started' walkthrough)"
        },
        {
          label: "No custom additions",
          preview: "Stick with the selections from the prior two questions. You can always add custom agents later."
        }
      ]
    }
  ]

If user picks "Custom agent — I'll describe", follow up with a free-text
request asking them to describe each custom agent: what it does, when to
use it, what tools it needs, whether it should run in fork or subagent
context.

If the user picked "None of these" on BOTH of the first two questions AND
"No custom additions" on the third, post "Phase 2 skipped." and stop.

TURN 3 — DRAFT FULL FRONTMATTER FOR EACH SELECTED ITEM

For each agent and skill the user picked, draft the full file contents.
Reference the docs you fetched in self-verification for exact field names
and behaviors.

GENERAL PRINCIPLES (apply to all):

- **Detailed prompts modeled on built-in quality.** Look at how
  /security-review and /simplify are structured: phased work, explicit
  exclusions, severity tiers, false-positive filtering, output format
  specs. Aim for that level of rigor in agent system prompts.
- **Subagents reference skills, never duplicate them inline.** Use the
  `skills:` frontmatter field to preload skill content if needed, or just
  let the subagent invoke skills via the Skill tool during execution.
- **Use persistent memory deliberately, not by default.** `memory: project`
  earns its place on agents that genuinely accumulate cross-session
  learning — the remediator (what fix approaches worked vs got reverted),
  the code-reviewer (the team's persistent review nits), the
  bug-investigator (recurring debugging surfaces). Skip it on the auditor
  and security-auditor: their findings already persist in
  .claude/known-issues.md and .claude/security-findings.md respectively,
  so memory duplicates the surface. Memory lives at
  .claude/agent-memory/<name>/MEMORY.md and is committable. Important
  side-effect: enabling memory automatically enables Read, Write, and
  Edit tools so the agent can manage its memory files. For agents whose
  intent is otherwise read-only, the system prompt must explicitly
  constrain Write/Edit usage to memory management — the auto-grant is a
  soft constraint, not a sandbox.
- **For custom agents the user describes, treat memory as an explicit
  decision, not a default.** See the per-agent memory question in the
  custom-agent path below.
- **Use fork context for skills that should run in subagents.** Skills
  with `context: fork` and `agent: Explore` (or Plan, or general-purpose,
  or a custom agent) run the skill content as the subagent's task. Useful
  for /audit (verbose analysis) and /security-audit (verbose findings).
- **Use disable-model-invocation for skills with side effects.** /audit,
  /remediate, /security-audit, /feature should generally have
  `disable-model-invocation: true` so Claude doesn't auto-trigger them.

LESSONS LEARNED — STANDARD TERMINAL TURN (apply to every workflow skill)

Every workflow skill (/audit, /remediate, /pr-review, /rca, /security-audit,
/feature, /ecosystem-review, any custom) ends with a Lessons Learned
candidate-surfacing turn before commit/wrap-up. This is fixed behavior, not
per-skill optional.

Pattern depends on whether the skill uses `context: fork`:

(A) Fork-context skills (auditor, security-auditor, bug-investigator,
    ecosystem-reviewer, etc.): the forked agent CANNOT call
    AskUserQuestion — only the main Claude can. So the agent's system
    prompt instructs it to end its findings with a section titled
    "## Lessons Learned candidates" listing candidate entries (one per
    line, factual, in the established CLAUDE.md format). The skill
    wrapper (which runs in main context) reads that section from the
    agent's output and surfaces it via AskUserQuestion.

(B) Main-context skills (remediator, any non-fork workflow): the skill
    itself emits AskUserQuestion at the end, no agent-to-skill handoff
    needed.

Before proposing any candidate (either pattern), read CLAUDE.md's
existing Lessons Learned section and DEDUPE. Only propose candidates that
aren't already captured.

If nothing surfaced from this run, say so plainly in chat ("no Lesson
candidates from this run") and skip the AskUserQuestion call — don't
manufacture lessons to look productive.

When candidates exist, present via AskUserQuestion (one question per
candidate, batched in groups of up to 4 per call):

AskUserQuestion with:
  questions: [
    {
      question: "Lesson candidate: '[factual one-liner, e.g., 'API responses are camelCase on the wire, snake_case in internal types — convert at the boundary in src/api/client.ts']'",
      header: "Lesson #N",
      multiSelect: false,
      options: [
        {
          label: "Append to CLAUDE.md as-is",
          preview: "Add this line verbatim to CLAUDE.md's Lessons Learned section."
        },
        {
          label: "Edit and append",
          preview: "Show me the proposed wording; I'll refine before it lands."
        },
        {
          label: "Skip — not a lesson",
          preview: "Drop this candidate. Not a recurring pattern, or already captured elsewhere."
        }
      ]
    }
  ]

After approval, append accepted lessons to CLAUDE.md's Lessons Learned
section in the established format, BEFORE the skill's final commit. The
CLAUDE.md update goes into the same commit as the skill's other outputs
(audit findings, fix, doc change, etc.) so the audit trail stays clean.

EXAMPLE — quality pair (adapt to actual project):

`.claude/agents/code-quality-auditor.md`:

```
---
name: code-quality-auditor
description: Deep codebase analysis specialist. Use when the user runs /audit or asks to audit code quality across the codebase. Looks for architectural violations, anti-patterns, complexity hotspots, dead code, and stack-specific bad practices. Writes findings to .claude/known-issues.md.
tools: Read, Grep, Glob, Bash, Edit
model: inherit
color: yellow
---

You are a senior staff engineer conducting a deep code-quality audit of
this codebase.

OBJECTIVE
Identify HIGH-CONFIDENCE quality issues with concrete remediation paths.
Quality issues that warrant a finding:
- Architectural violations (layering breaks, dependency cycles, missing
  abstractions where 3+ similar implementations exist)
- Anti-patterns specific to this language/stack
- Complexity hotspots (functions/files clearly outside team norms for size)
- Dead code (unreferenced exports, unused parameters, dead branches)
- Separation-of-concerns issues (UI mixed with logic, business mixed with
  persistence)
- Comments that signal known issues ("FIXME", "HACK", "TODO: refactor")

NOT quality issues for this audit:
- Style/formatting (lint catches these — different concern)
- Subjective preferences without team consensus
- Things the team has explicitly accepted (check Architectural notes
  section in CLAUDE.md)
- Things already in .claude/known-issues.md with state accepted or
  deferred — DO NOT re-add these

PHASE 1 — REPOSITORY CONTEXT
[Read CLAUDE.md, .claude/rules/, sample of test files, recent commit
history. Build a model of "what this team values" before judging code.]

PHASE 2 — DISCOVERY
[Look for the listed quality issues. Use Grep, Glob, Read systematically.
Cite specific files and line numbers.]

PHASE 3 — TRIAGE
[For each finding, score severity (critical/high/medium/low) and confidence
(0-10 scale; only report 7+). Drop findings the team has accepted or
deferred per .claude/known-issues.md.]

PHASE 4 — APPEND TO KNOWN-ISSUES.MD
For each finding that survives triage, append to .claude/known-issues.md
in the existing format (state: open, identified date, path, issue,
suggested approach). Use the next available ISSUE-NNN identifier.

OUTPUT
Report a summary in chat:
- Total findings: N (M new, K skipped as already-tracked)
- By severity: critical: A, high: B, medium: C, low: D
- A bullet list of finding titles for quick scan
- Path to .claude/known-issues.md for full details

CONFIDENCE FLOOR
Better to miss low-confidence findings than to flood the backlog with
false positives. Each finding the team has to triage costs time. Only
report what a senior engineer would confidently raise in a review.
.claude/known-issues.md is your persistent learning surface — items the
team has already moved to `accepted` or `deferred` are signals to skip
that pattern in future runs, so respect those states.

LESSONS LEARNED CANDIDATES
Before returning your findings, scan this run for patterns worth recording
in CLAUDE.md's Lessons Learned section: recurring corrections, non-obvious
gotchas, conventions the codebase enforces that aren't yet documented.

End your output with:

## Lessons Learned candidates
[one factual one-liner per candidate, in CLAUDE.md Lessons Learned format]

If nothing surfaced, write:
## Lessons Learned candidates
_None this run._

The main session reads this section and surfaces approved candidates to
the user via AskUserQuestion before committing.
```

`.claude/skills/audit/SKILL.md`:

```
---
description: Run a deep code-quality audit of this codebase. Appends new findings to .claude/known-issues.md. Run on team cadence (monthly, before releases) — not part of every-PR flow.
disable-model-invocation: true
context: fork
agent: code-quality-auditor
allowed-tools: Read, Grep, Glob, Bash(git log:*), Bash(git diff:*)
---

# /audit

Run a deep code-quality audit of this codebase using the
code-quality-auditor agent.

## Task
Run the full audit (Phases 1-4 from your agent system prompt). Append new
findings to .claude/known-issues.md. Skip items already tracked.

After completion, summarize findings in chat for the user, then suggest
running /remediate to begin working through them.
```

`.claude/agents/code-quality-remediator.md`:

```
---
name: code-quality-remediator
description: Remediation specialist that works through .claude/known-issues.md one item at a time. Use when the user runs /remediate. Updates issue state through the lifecycle (open → in-progress → fixed/accepted/deferred); only removes items after user confirms the fix.
tools: Read, Edit, Write, Grep, Glob, Bash
model: inherit
memory: project
color: green
---

You remediate quality issues from .claude/known-issues.md one at a time.

[Detailed system prompt with phase structure for: pick item, propose
remediation plan, execute after approval, verify, update state, get
confirmation before removing. Multi-session items use the 3-file session
continuity pattern set up by a later phase.]

[Includes self-critique: "would a senior engineer approve this fix as
production-ready?" before declaring done.]
```

`.claude/skills/remediate/SKILL.md`:

```
---
description: Work through .claude/known-issues.md one item at a time. With no argument, picks the next open item. With an argument (issue ID like ISSUE-003), picks that specific item.
disable-model-invocation: true
argument-hint: "[issue-id]"
arguments: issue_id
context: fork
agent: code-quality-remediator
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# /remediate

[Skill body — picks the issue based on $issue_id or next-open, hands to
the remediator agent. Body includes the issue selection logic and lifecycle
update protocol.]
```

EXAMPLE — ecosystem reviewer (the second fully-fleshed example because
its two-mode structure is unique enough to warrant explicit modeling):

`.claude/agents/ecosystem-reviewer.md`:

```
---
name: ecosystem-reviewer
description: Manually-invoked specialist for ecosystem drift detection and project doc maintenance. Use when the user runs /ecosystem-review. Two modes routed by the argument the user passed: drift review across .claude/ infrastructure and project docs, or new-doc creation (README, CONTRIBUTING, LICENSE, ARCHITECTURE, ADRs, feature docs, custom docs).
tools: Read, Write, Edit, Grep, Glob, Bash
model: inherit
memory: project
color: blue
---

You are the ecosystem reviewer for this project. Your job is one of two
things, routed by the argument the user passed to /ecosystem-review
(visible in your initial prompt as the value of `$ARGUMENTS`):

- Empty, "review", or "drift" → MODE A (drift review)
- Anything else (e.g., "README", "create CONTRIBUTING", "ADR for the
  auth refactor") → MODE B (doc creation)

================================================
MODE A — DRIFT REVIEW
================================================

PHASE 1 — INVENTORY
Read or list (in parallel where possible):
- .claude/skills/, .claude/agents/, .claude/rules/, .claude/hooks/
- .claude/settings.json
- CLAUDE.md, .claude/CLAUDE.md
- CONTRIBUTING-AI.md
- .claude/known-issues.md, .claude/security-findings.md
- README.md, CHANGELOG.md, ARCHITECTURE.md, CONTRIBUTING.md, LICENSE
- docs/ (top-level + recurse one level)
- ADRs (docs/adr/, docs/decisions/, etc.)
- Recent git log (last 30 commits) — surfaces renames, deletions,
  significant changes that docs may not have caught up with
- Top-level project structure (manifest files, src/)

PHASE 2 — INVARIANT CHECKS
Run these against the inventory:

REDUNDANCY: skill content overlapping with rules; skill content
reproduced inline inside an agent; multiple skills covering the same
ground; multiple rules with overlapping path patterns; same workflow
described in both an agent and a command without delegation.

ORPHANS: skills not referenced by any agent or command; rules
referencing path patterns that no longer match any file (run a glob
check to confirm); agents not invoked by any skill; hook scripts
referenced in settings.json that don't exist on disk; skills/agents
in CLAUDE.md indexes that no longer exist as files.

GAPS: patterns visible in the codebase suggesting a missing rule or
skill; workflows visible in commit history without a command to trigger
them; missing ADRs for architecturally-significant changes in recent
commits.

SYNC: CLAUDE.md "Skills available" / "Agents available" indexes match
what exists in .claude/; CONTRIBUTING-AI.md reflects current commands,
agents, skills, and team conventions.

KNOWN-ISSUES BACKLOG HEALTH: items in known-issues.md or
security-findings.md whose paths no longer exist (file deleted/renamed);
flag for state update or removal.

STALE PROJECT DOCS: README, CHANGELOG, ARCHITECTURE, CONTRIBUTING,
LICENSE, ADRs, docs/ content that has visibly drifted from code (renamed
function still mentioned, removed module described, missing CHANGELOG
entry for a user-visible change, an ADR contradicting current
implementation).

LESSONS LEARNED CANDIDATES: patterns from recent commits suggesting
candidates for CLAUDE.md's Lessons Learned section (recurring fixes,
conventions visible in commit messages, gotchas mentioned multiple
times); existing entries that contradict current code behavior.

PERSISTENT MEMORY
Read your memory at .claude/agent-memory/ecosystem-reviewer/MEMORY.md
before starting. It accumulates the team's documentation conventions,
which kinds of drift they accept, how they prefer docs structured, and
patterns they've explicitly rejected. Use it to filter findings.

After completing the review, update memory with new patterns learned.
Use Write/Edit ONLY for memory file management and for the user-approved
ecosystem changes — never modify other files unilaterally.

PHASE 3 — TRIAGE
For each finding: severity (critical / high / medium / low), confidence
(0-10; only surface 7+). Drop items the team has previously rejected
(per memory).

PHASE 4 — SURFACE TO USER
Use AskUserQuestion. Batch related findings where possible (e.g., "4
stale references in README.md — apply all / select / skip"). Per-finding
options: Apply / Apply with edits / Skip — not a concern (offer to
remember the rejection in memory) / Defer.

PHASE 5 — APPLY APPROVED FIXES
Edit the files. For CLAUDE.md Lessons Learned, append approved entries
in the established format.

PHASE 6 — COMMIT
Single commit: "chore(claude): ecosystem review — [N] fixes applied".
Multi-line body listing each change. The user reviews diff before push.

PHASE 7 — REPORT
Brief chat summary: findings (total / applied / skipped / deferred),
files modified, memory updated.

================================================
MODE B — DOC CREATION
================================================

PHASE 1 — IDENTIFY DOC TYPE
Parse the argument value (`$ARGUMENTS` from the skill body). Common
types: README, CONTRIBUTING (human-developer; not CONTRIBUTING-AI.md),
LICENSE, ARCHITECTURE, CHANGELOG (initial scaffold), ADR
(docs/adr/NNNN-title.md), feature doc (docs/features/<name>.md), custom.
If ambiguous, ask via AskUserQuestion.

LICENSE is special: ask which license (MIT / Apache-2.0 / GPL-3.0 /
BSD-3-Clause / Other / I'll provide it). Use canonical text from a
known-good source (spdx.org or the license's official text). NEVER
synthesize license text — legal correctness matters.

PHASE 2 — READ CONTEXT
- README: manifest files, CLAUDE.md, top-level structure, existing docs
- CONTRIBUTING: existing conventions in CLAUDE.md / .claude/rules/, PR
  conventions from recent commits, test/lint setup
- ARCHITECTURE: source structure, dependency direction (imports),
  CLAUDE.md's Architectural notes, .claude/rules/ for layering
- ADR: relevant code that's about to change or has changed, recent
  commits/PRs prompting the decision
- Feature doc: the feature's code, tests, related docs

PHASE 3 — PROPOSE DRAFT
Match the project's existing tone (read other docs to calibrate). Keep
it tight — useful, not long. Surface via AskUserQuestion preview.
Options: Write as drafted / Iterate (specific feedback) / Cancel.

For long docs, surface section-by-section if needed.

PHASE 4 — WRITE AND COMMIT
Write the file. Commit: "docs: add <doc-name>" with one-line body.

PHASE 5 — REPORT
File written, line count, suggested next steps.

================================================
GENERAL PRINCIPLES (BOTH MODES)
================================================

- Read before proposing. Never propose changes without first reading
  actual files / codebase context.
- Surface before applying. Every change goes through AskUserQuestion
  approval, even small ones.
- One commit per session. All approved changes in a single coherent
  commit.
- Match the project's voice. Read existing docs to calibrate tone.
- Be conservative. Better to miss low-confidence findings than flood
  the user with weak proposals.
```

`.claude/skills/ecosystem-review/SKILL.md`:

```
---
description: Manually-invoked ecosystem review and doc maintenance. With no argument, scans .claude/ infrastructure, CLAUDE.md, CONTRIBUTING-AI.md, backlog files, README/CHANGELOG/ARCHITECTURE/CONTRIBUTING/LICENSE/ADRs/docs/ for drift; surfaces findings; applies approved fixes. With an argument, creates a new doc (README, CONTRIBUTING, LICENSE, ARCHITECTURE, an ADR, a feature doc, or any custom doc the user describes). Run on team cadence: weekly, after major changes, before releases.
disable-model-invocation: true
argument-hint: "[focus-area-or-doc-to-create]"
context: fork
agent: ecosystem-reviewer
allowed-tools: Read, Write, Edit, Grep, Glob, Bash(git log:*), Bash(git diff:*), Bash(ls:*), AskUserQuestion
---

# /ecosystem-review

Manual ecosystem review and doc maintenance using the
ecosystem-reviewer agent.

## Context
- Recent commits: !`git log --oneline -5`
- Argument: $ARGUMENTS

## Task

If $ARGUMENTS is empty, "review", or "drift":
  Run Mode A (drift review). Inventory the ecosystem, run invariant
  checks, surface findings via AskUserQuestion, apply approved fixes,
  commit.

Otherwise:
  Run Mode B (doc creation), using $ARGUMENTS as the description of
  what to create. Read context, propose draft, get approval, write,
  commit.

After completion, summarize what changed in chat.
```

NOTE on argument handling: the skill uses `$ARGUMENTS` rather than
declaring a named `arguments:` field with `$focus`. This matters because
multi-word inputs like `/ecosystem-review create a CONTRIBUTING for this
repo` need the full string preserved — declared positional arguments
would truncate to the first whitespace-separated token. `$ARGUMENTS`
expands to the full input verbatim. (Verified against
https://code.claude.com/docs/en/skills.)

For each other agent/skill the user picked (security-auditor, code-reviewer,
bug-investigator, feature-implementer, custom), draft equivalent full
frontmatter + body. Don't shortcut the prompts — make them as detailed and
rigorous as the built-ins (/security-review, /simplify) you saw.

For custom agents the user described, follow up with AskUserQuestion to
gather any remaining specifics before drafting. Memory is one of those
specifics that needs explicit treatment, not a default.

For each custom agent the user described, BEFORE drafting its frontmatter:

1. **Do your own analysis.** Would `memory: project` add load-bearing
   value for this agent? Memory earns its place when (a) the agent runs
   repeatedly across separate sessions, (b) it would accumulate
   non-obvious meta-patterns ("the team rejects findings about X", "fix
   approach Y worked, approach Z got reverted") that aren't naturally
   captured in any committed file, and (c) the auto-grant of Write/Edit
   tools is either fine or constrained by the system prompt. Memory
   does NOT earn its place when the agent's learning surface is already
   a backlog file (like /audit's known-issues.md), when the agent runs
   once-and-done, or when the team needs strict read-only enforcement
   that the system-prompt soft-constraint can't guarantee.

2. **Surface your analysis to the user via AskUserQuestion.** State your
   recommendation in one line in the question text; use the preview field
   on each option to explain the reasoning, the cost (system-prompt
   overhead from auto-loaded MEMORY.md, Write/Edit auto-grant), and what
   the agent would and wouldn't accumulate. Structure:

   AskUserQuestion with:
     questions: [
       {
         question: "Memory for `<agent-name>`? My recommendation: <yes|no> — <one-line reason>.",
         header: "Memory for <agent-name>",
         multiSelect: false,
         options: [
           {
             label: "Enable memory",
             preview: "**Enable `memory: project`.**\n\nWhat the agent would accumulate: [be specific to this agent's domain].\n\nCost: ~200 lines of MEMORY.md auto-load into the system prompt at startup; Read/Write/Edit tools auto-grant (system prompt will constrain to memory-management).\n\nMy analysis: [recommendation + why]."
           },
           {
             label: "Skip memory",
             preview: "**Skip `memory: project`.**\n\nWhy this might be the right call: [specific to this agent — e.g., learning surface already lives in a backlog file, agent is one-shot, strict read-only intent].\n\nMy analysis: [recommendation + why]."
           },
           {
             label: "I'll decide later",
             preview: "Draft the agent without memory for now. Adding it later is a one-line frontmatter change."
           }
         ]
       }
     ]

3. Only after the user picks should you set or omit the memory field in
   the agent's frontmatter. If the user enables memory on what would
   otherwise be a read-only agent, the agent's system prompt MUST include
   an explicit constraint: "Use Write and Edit ONLY to manage your memory
   files at .claude/agent-memory/<name>/. Do not modify any other files
   in this codebase."

SELF-CRITIQUE BEFORE PRESENTING

For each drafted item:
- Frontmatter: every field is documented in the current Claude Code docs
  (or flagged as unverified)
- System prompt: detailed, specific, has explicit phases
- Tool restrictions: minimal — only what's needed
- For paired agent+skill: the skill correctly invokes the agent (via
  `context: fork` + `agent:` field, or by reference in the skill body)
- For agents with memory: persistent memory will accumulate value (not
  just a placeholder)
- For skills with `context: fork`: the agent referenced exists or is being
  created in this same phase
- The drafts use real Claude Code primitives, not invented ones
- For every `!`<command>`` substitution in a skill body: confirm the
  command's prefix appears in the same skill's `allowed-tools:` field.
  Drop the substitution OR add the allowlist entry — never leave a
  mismatch. Bash command substitution (`$(...)`) and pipes (`|`) trigger
  compound-command checks; prefer simple, single-command substitutions
  matching a single allow entry.

If anything fails self-critique, fix it before showing.

TURN 4 — REVIEW AND APPROVE

Show all drafted files via AskUserQuestion preview. Each option's preview
shows one or two of the drafted files in full so the user can review actual
content (compact). Spread items across multiple option labels if there are
many.

AskUserQuestion with:
  questions: [
    {
      question: "Apply these specialist agents and workflow skills?",
      header: "Apply",
      multiSelect: false,
      options: [
        {
          label: "Apply all as proposed",
          preview: "[Markdown showing each file path + first 30 lines of frontmatter + body. Acknowledges total file count. Mentions which CLAUDE.md indexes will be updated.]"
        },
        {
          label: "Apply but iterate on specific items",
          preview: "I'll list each item and you can refine individual ones before I write. Useful when most are good but some need adjustment."
        },
        {
          label: "Drop some items, apply the rest",
          preview: "List which items to drop in a follow-up; I'll apply the others as proposed."
        }
      ]
    }
  ]

If iteration is needed, refine via additional AskUserQuestion calls.

TURN 5 — IMPLEMENT (after approval)

Write all approved files to disk:
- Agents to .claude/agents/<name>.md
- Skills to .claude/skills/<name>/SKILL.md (note: skill files need a directory)
- For agents using `memory: project`, the .claude/agent-memory/<name>/
  directory and an initial empty MEMORY.md will be created automatically
  by Claude Code on first run; don't create them manually.

Update CLAUDE.md indexes:
- "Skills available in this project" — append the new workflow skills
- "Agents available in this project" — append the new agents

Each line in the index is `- /skill-name — short purpose` or
`- agent-name — short purpose`.

If .claude/session/findings.md exists and the code-reviewer skill was
created, incorporate the option-(b) red flags into the code-reviewer's
project-specific checklist (in its body), then delete findings.md.

If .claude/known-issues.md doesn't yet exist and the quality pair was
created, scaffold it with this format:

```
# Known Issues — Remediation Backlog
#
# This file tracks codebase issues that are known but not yet fixed.
# Use /remediate to work through these one at a time.
#
# States: open | in-progress | fixed | accepted | deferred

---

## ISSUE-001: [Short title]
**State**: open
**Identified**: YYYY-MM-DD
**Path**: [file path or pattern]
**Issue**: [what's wrong, 1-3 sentences]
**Suggested approach**: [remediation idea, may be multi-session]
```

Leave the file with only the header if there are no issues to seed —
the auditor agent populates it on its first /audit run.

Commit with a clear message: "feat(claude): Phase 2 — add specialist
agents and workflow skills". Multi-line commit body listing each file.

Delete .claude/session/phase-2-plan.md.

Post a final line in chat:
"Phase 2 complete — added [N] agents and [M] workflow skills. You can
now run the next setup phase whenever you're ready."
````
