---
title: "Phase 2: Specialist Agents & Workflow Skills"
description: "Adds specialist custom agents (TOML) with persistent memory and their paired workflow skills."
tool: "codex"
type: "setup"
author: "noobiethe13"
verified_version: "0.133.0"
recommended_model: "GPT-5.5"
tags: ["existing-repo", "agents", "skills", "workflows"]
---

## What this does

This phase adds specialist subagents (defined as TOML files in `.codex/agents/`, which Codex spawns on request with their own role config) and their paired workflow skills (the `/<name>` slash commands you invoke).

It provides soft-nudge candidates that you can choose from, or you can describe your own custom needs. Example pairings include:

- **Quality Pair:** `code-quality-auditor` + `/audit` and `code-quality-remediator` + `/remediate`
- **Security & Ecosystem:** `security-auditor` + `/security-audit` and `ecosystem-reviewer` + `/ecosystem-review`
- **Review & Debugging:** `code-reviewer` + `/pr-review` and `bug-investigator` + `/rca`
- **Feature Work:** A multi-session `/feature` skill that uses `codex resume` and the 3-file session pattern

## Prerequisites & Execution

- **Prerequisites:**
  - The global behavioral guidelines marker (`# CODEX-PROMPTS-PHASE-0-INSTALLED`) should exist in `~/.codex/AGENTS.md` (warning if missing).
  - The project `AGENTS.md` must contain Lessons Learned and skills/agents index sections (set up by Phase 0).
  - *(Note: Phase 1 is optional. If it ran, this phase will augment its outputs, not replace them.)*
- **Token cost:** High. This is the most reasoning-heavy phase. It reads the codebase, runs multiple interactive turns, and drafts complex TOML + SKILL.md content for each selected agent and skill.

## The Prompt

Copy the text below and paste it directly into your Codex CLI terminal.

````text
You are setting up specialist subagents and their paired workflow
skills for this project. Subagents in Codex are defined as TOML files
under .codex/agents/ (or ~/.codex/agents/ for personal scope). The
user spawns them on request via natural-language prompts or via skills
that name them. Workflow skills (under .agents/skills/<name>/SKILL.md)
are how the user invokes coordinated workflows via /skill-name or
$skill-name.

PRE-FLIGHT — VERIFY PREREQUISITES

Step 1: Read ~/.codex/AGENTS.md and confirm the marker
`# CODEX-PROMPTS-PHASE-0-INSTALLED` is present. This marker
indicates the universal behavioral guidelines
(think-before-coding, simplicity-first, surgical-changes, etc.)
are installed at the user-level AGENTS.md.

Step 2: Read the project AGENTS.md (./AGENTS.md) and confirm it
contains these three headings (added by Phase 0):
- `## Lessons Learned`
- `## Skills available in this project`
- `## Agents available in this project`

Step 3: List .agents/skills/, .codex/agents/, and any path-scoped
AGENTS.md files. Phase 1 may or may not have already added
knowledge skills and rules here. Note what exists; this phase will
add to them, not replace.

If Step 1 or Step 2 fails, surface a clear notice describing
what's missing and pause for user direction (offer to proceed
without it, or to install the missing piece first).

SELF-VERIFICATION

Before writing any TOML or frontmatter, verify against current
Codex docs:

- https://developers.openai.com/codex/subagents — confirm the
  custom-agent TOML schema. Required fields: `name`, `description`,
  `developer_instructions`. Optional: `nickname_candidates`,
  `model`, `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`,
  `skills.config`. Global agent settings live under `[agents]` in
  config.toml (`max_threads` default 6, `max_depth` default 1,
  `job_max_runtime_seconds` default 1800).

- https://developers.openai.com/codex/skills — confirm SKILL.md
  required fields (`name`, `description`) and the optional
  `agents/openai.yaml` metadata layout (interface.*, policy.*,
  dependencies.tools). Skills live at .agents/skills/<name>/.

- https://developers.openai.com/codex/cli/slash-commands — confirm
  which built-in commands exist so you don't propose duplicates.

Built-in agents available: `default` (general-purpose), `worker`
(execution-focused), `explorer` (read-heavy exploration).
Reference these in skill bodies where useful. Custom agents you
define are spawned on user request alongside these built-ins.

Built-in commands NOT to duplicate: /review (branch-diff PR scope
— different from project-aware /pr-review), /plan, /plan-mode,
/memories, /skills, /agent, /hooks, /mcp, /status, /resume, /fork,
/new, /side. Bundled skills NOT to duplicate: `$imagegen`, web
search.

If you cannot fetch docs, tell the user and ask whether to proceed
with this prompt's schemas. Flag any TOML or frontmatter you write
as "unverified — please double-check against current docs".

TURN 1 — INVENTORY AND ORIENT

Read existing setup:

- .codex/agents/ contents — list any custom agents already defined
- .agents/skills/ contents — list any workflow skills already
  defined
- .codex/known-issues.md — does the team already have a remediation
  backlog file? If yes, /audit and /remediate (if proposed) need to
  preserve and extend, not overwrite.
- AGENTS.md — note any references to existing /audit, /remediate,
  or similar commands

Also do a quick scan of the codebase to inform agent design:

- Languages used (matters for agent prompts — auditor for a Rust
  project flags different things than auditor for a Python project)
- Surface area characteristics (handles auth? payments? user
  data? — these inform whether security-auditor is worth
  proposing)
- Test setup (informs feature-implementer's verification step)

Post a brief inventory in chat (no proposals yet).

TURN 2 — ELICIT WHAT THE TEAM NEEDS

Codex has no structured picker. Render the questions below as a
single numbered markdown block and wait for the user's batched
reply.

The starting candidates below are SUGGESTIONS — the user can pick
any combination, drop all of them, or describe custom needs.

────────────────────────────────────────────────────────────────────
**Question 1 — Quality & review tooling** (multi-select; reply with
comma-separated numbers; `none` to skip)

1. **Quality pair: auditor + remediator** *(recommended for
   non-trivial codebases)*
   Two paired agents:
   - `code-quality-auditor` (deep codebase analysis —
     architectural violations, anti-patterns, complexity hotspots,
     dead code, separation-of-concerns issues, stack-specific bad
     practices). Appends new findings to .codex/known-issues.md,
     skipping items already in accepted/deferred state. No
     persistent memory: the backlog file already captures its
     learning surface.
   - `code-quality-remediator` (works through
     .codex/known-issues.md one item at a time; state lifecycle
     open → in-progress → fixed/accepted/deferred; only removes
     items after user confirms fix). Uses persistent memory at
     `.codex/agent-memory/code-quality-remediator/MEMORY.md` to
     accumulate cross-session learning about which fix approaches
     worked.

   Paired workflow skills: `/audit` and `/remediate [issue-id]`
   (one item per invocation).

2. **PR reviewer + /pr-review**
   Built-in /review is branch-diff scope and generic. /pr-review
   uses a project-specific `code-reviewer` agent that knows:
   - Your architecture from AGENTS.md
   - Your team's PR conventions from AGENTS.md
   - The known-issues backlog (so it doesn't re-flag triaged stuff)
   - Project-specific patterns from path-scoped AGENTS.md files

   If .codex/session/findings.md exists from a Phase 0 red-flag
   review, the option-(b) red flags get incorporated into the
   reviewer's checklist.

3. **Bug investigator + /rca**
   Root-cause analysis specialist. Takes a bug report (error
   message, repro steps, or just a symptom), traces it through the
   codebase, identifies root cause, proposes fix.

   Spawns as a read-only `explorer`-style agent for non-destructive
   investigation. Doesn't apply fixes itself — surfaces findings
   and proposed fix for human review.

4. **None of these** — Skip the quality/review cluster. /init's
   setup + bundled /review may be sufficient. You can come back
   later.

**Question 2 — Security & ecosystem tooling** (multi-select;
reply with comma-separated numbers; `none` to skip)

1. **Security auditor + /security-audit**
   *(recommended if project handles auth/payments/user
   data/server-side code)*

   Different scope from built-in /review (which is branch-diff PR
   scope). This is codebase-wide periodic scan:
   - Vulnerable dependencies and known CVEs
   - Injection patterns (SQL, command, template, NoSQL, path
     traversal)
   - Authentication / authorization flaws and missing access
     checks
   - Secret exposure beyond hardcoded literals (token logging,
     weak crypto, insecure storage)
   - Insecure defaults, permissive CORS, missing security headers
   - Stack-specific security anti-patterns

   Writes findings to .codex/security-findings.md with severity
   (critical/high/medium/low). Skips already-accepted/deferred
   items. NO paired auto-fix — security work needs human judgment
   about priority and blast radius.

2. **Ecosystem reviewer + /ecosystem-review** *(recommended)*
   Manually-invoked drift detection and doc maintenance, with two
   modes:

   *Mode A (no argument or 'review'):* scans .codex/ infrastructure,
   .agents/skills/, AGENTS.md, CONTRIBUTING-AI.md, backlog files,
   README/CHANGELOG/ARCHITECTURE/CONTRIBUTING/LICENSE/ADRs/docs/
   for drift. Surfaces findings (redundancy, orphans, gaps, sync
   issues, stale project docs, Lessons Learned candidates) for
   your approval, then applies the approved fixes and commits.

   *Mode B (argument is a doc description):* creates a new project
   doc — README, CONTRIBUTING, LICENSE, ARCHITECTURE, an ADR, a
   feature doc, or any custom doc you describe. Reads relevant
   codebase context, proposes a draft for your approval, writes
   the file, commits.

   Explicit-invocation only (`policy.allow_implicit_invocation:
   false` in agents/openai.yaml). Uses persistent memory at
   `.codex/agent-memory/ecosystem-reviewer/MEMORY.md` to
   accumulate the team's documentation conventions.

3. **Feature implementer skill (multi-session)**
   A workflow skill for multi-session feature work. Uses Codex's
   native `codex resume` plus the 3-file session continuity
   pattern (plan.md / context.md / tasks.md in `.codex/session/`)
   so feature work survives across separate sessions and /clear.

   Flow: takes a feature description, creates the 3 files, plans
   the work in chunks, executes one chunk per session, updates
   context as it goes, marks tasks done as it completes them.

   The session continuity infrastructure itself is set up by Phase
   3 — this option just adds the /feature skill that uses it.

4. **None of these** — Skip the security/ecosystem cluster.

**Question 3 — Custom additions** (single-select; reply with one
number)

1. **Custom agent — I'll describe** (free-text option in a
   follow-up turn).
   Examples teams have built:
   - /design-review (UI/UX consistency check)
   - /accessibility-audit
   - /perf-profile (runs profiler, summarizes hotspots)
   - /docs-update (rewrites docs for changed code)
   - /onboarding (project-specific 'how do I get started'
     walkthrough)

2. **No custom additions** — Stick with the selections from the
   prior two questions.
────────────────────────────────────────────────────────────────────

Reply with:
`Q1: 1,2`
`Q2: 1,2`
`Q3: 2`

If user picks "Custom agent — I'll describe" on Q3, follow up
with a free-text request asking them to describe each custom
agent: what it does, when to use it, what tools / MCP servers it
needs, whether it should run with restricted sandbox.

If the user picked "None of these" on BOTH of the first two
questions AND "No custom additions" on the third, post "Phase 2
skipped." and stop.

TURN 3 — DRAFT FULL TOML + FRONTMATTER FOR EACH SELECTED ITEM

For each agent and skill the user picked, draft the full file
contents. Reference the docs you fetched in self-verification for
exact field names and behaviors.

GENERAL PRINCIPLES (apply to all):

- **Detailed prompts modeled on built-in quality.** Look at how
  built-in /review, /plan, and the `explorer` agent are
  structured: phased work, explicit exclusions, severity tiers,
  false-positive filtering, output format specs. Aim for that
  level of rigor in agent `developer_instructions`.

- **Subagents reference skills, never duplicate them inline.**
  Use the `skills.config` array in the agent TOML to enable
  specific skills, or just let the agent invoke skills via the
  /skills picker during execution.

- **Use persistent memory deliberately, not by default.** Persistent
  agent-specific notes live at
  `.codex/agent-memory/<agent-name>/MEMORY.md` (separate from
  Codex's `/memories` feature, which auto-generates from session
  transcripts). It earns its place on agents that genuinely
  accumulate cross-session learning — the remediator (what fix
  approaches worked vs got reverted), the code-reviewer (the
  team's persistent review nits), the ecosystem-reviewer (the
  team's documentation conventions and tolerance for noise). Skip
  it on the auditor and security-auditor: their findings already
  persist in .codex/known-issues.md and .codex/security-findings.md
  respectively, so memory duplicates the surface.

  The agent's `developer_instructions` is responsible for telling
  the agent WHEN to read and update its memory file — Codex
  doesn't auto-load it into context.

- **For custom agents the user describes, treat memory as an
  explicit decision, not a default.** See the per-agent memory
  question in the custom-agent path below.

- **Use `sandbox_mode = "read-only"` for investigation-only agents.**
  Auditors, bug-investigators, security-auditors should run
  read-only by default. Remediators and feature-implementers need
  `workspace-write`. Use `danger-full-access` only for agents that
  truly need it.

- **Use `model_reasoning_effort` deliberately.** Set `high` or
  `xhigh` for agents whose value is deep reasoning (security
  auditor, bug investigator, code reviewer on complex PRs). Set
  `low` or `medium` for execution-focused agents (remediator
  doing mechanical fixes).

- **For workflow skills with side effects, set
  `policy.allow_implicit_invocation: false` in the skill's
  `agents/openai.yaml`.** /audit, /remediate, /security-audit,
  /feature should NOT auto-trigger from prompt content — the user
  invokes them explicitly via /skills or $skill-name.

LESSONS LEARNED — STANDARD TERMINAL TURN (apply to every workflow
skill)

Every workflow skill (/audit, /remediate, /pr-review, /rca,
/security-audit, /feature, /ecosystem-review, any custom) ends
with a Lessons Learned candidate-surfacing turn before commit /
wrap-up. This is fixed behavior, not per-skill optional.

Codex subagents run with their own context and can't directly
prompt the user. Pattern:

1. The subagent's `developer_instructions` instructs it to end its
   output with a section titled "## Lessons Learned candidates"
   listing candidate entries (one per line, factual, in the
   established AGENTS.md format).

2. The skill body (which the user invokes) reads the agent's
   output, parses that section, dedupes against the existing
   AGENTS.md Lessons Learned section, and surfaces the
   candidates in chat as a numbered question for the user to
   accept/edit/reject.

3. Approved candidates get appended to AGENTS.md's Lessons
   Learned section before the skill's final commit. The AGENTS.md
   update goes into the same commit as the skill's other outputs.

Before proposing any candidate, the skill reads AGENTS.md's
existing Lessons Learned section and DEDUPES. Only propose
candidates that aren't already captured.

If nothing surfaced from this run, say so plainly in chat ("no
Lesson candidates from this run") and skip the candidate question
— don't manufacture lessons to look productive.

When candidates exist, present in chat:

────────────────────────────────────────────────────────────────────
**Lessons Learned candidates** (reply with one letter per number)

For each candidate, pick: **a** (append as-is), **b** (edit and
append — tell me the new wording), **c** (skip — not a lesson).

1. "[factual one-liner candidate]"
2. "[factual one-liner candidate]"
[... up to 4 per batch]
────────────────────────────────────────────────────────────────────

After approval, append accepted lessons to AGENTS.md's Lessons
Learned section in the established format.

EXAMPLE — quality pair (adapt to actual project):

`.codex/agents/code-quality-auditor.toml`:

```toml
name = "code-quality-auditor"
description = "Deep codebase analysis specialist. Spawn when the user runs /audit or asks to audit code quality across the codebase. Looks for architectural violations, anti-patterns, complexity hotspots, dead code, and stack-specific bad practices. Writes findings to .codex/known-issues.md."
model_reasoning_effort = "high"
sandbox_mode = "workspace-write"   # needs write for known-issues.md only

developer_instructions = """
You are a senior staff engineer conducting a deep code-quality audit
of this codebase.

OBJECTIVE
Identify HIGH-CONFIDENCE quality issues with concrete remediation
paths. Quality issues that warrant a finding:
- Architectural violations (layering breaks, dependency cycles,
  missing abstractions where 3+ similar implementations exist)
- Anti-patterns specific to this language/stack
- Complexity hotspots (functions/files clearly outside team norms
  for size)
- Dead code (unreferenced exports, unused parameters, dead
  branches)
- Separation-of-concerns issues (UI mixed with logic, business
  mixed with persistence)
- Comments that signal known issues ("FIXME", "HACK",
  "TODO: refactor")

NOT quality issues for this audit:
- Style/formatting (lint catches these — different concern)
- Subjective preferences without team consensus
- Things the team has explicitly accepted (check Architectural
  notes section in AGENTS.md)
- Things already in .codex/known-issues.md with state accepted or
  deferred — DO NOT re-add these

PHASE 1 — REPOSITORY CONTEXT
[Read AGENTS.md (root + path-scoped subdirectory files), sample
of test files, recent commit history. Build a model of "what
this team values" before judging code.]

PHASE 2 — DISCOVERY
[Look for the listed quality issues systematically using the
unified shell tool and read access. Cite specific files and line
numbers.]

PHASE 3 — TRIAGE
[For each finding, score severity (critical/high/medium/low) and
confidence (0-10 scale; only report 7+). Drop findings the team
has accepted or deferred per .codex/known-issues.md.]

PHASE 4 — APPEND TO KNOWN-ISSUES.MD
For each finding that survives triage, append to
.codex/known-issues.md in the existing format (state: open,
identified date, path, issue, suggested approach). Use the next
available ISSUE-NNN identifier.

OUTPUT
Report a summary to the parent session:
- Total findings: N (M new, K skipped as already-tracked)
- By severity: critical: A, high: B, medium: C, low: D
- A bullet list of finding titles for quick scan
- Path to .codex/known-issues.md for full details

CONFIDENCE FLOOR
Better to miss low-confidence findings than to flood the backlog
with false positives. Each finding the team has to triage costs
time. Only report what a senior engineer would confidently raise
in a review. .codex/known-issues.md is your persistent learning
surface — items the team has already moved to `accepted` or
`deferred` are signals to skip that pattern in future runs, so
respect those states.

LESSONS LEARNED CANDIDATES
Before returning your findings, scan this run for patterns worth
recording in AGENTS.md's Lessons Learned section: recurring
corrections, non-obvious gotchas, conventions the codebase
enforces that aren't yet documented.

End your output with:

## Lessons Learned candidates
[one factual one-liner per candidate, in AGENTS.md Lessons
Learned format]

If nothing surfaced, write:
## Lessons Learned candidates
_None this run._

The parent session reads this section and surfaces approved
candidates to the user before committing.
"""
```

`.agents/skills/audit/SKILL.md`:

```
---
name: audit
description: Run a deep code-quality audit of this codebase. Spawns the code-quality-auditor agent. Appends new findings to .codex/known-issues.md. Use on team cadence (monthly, before releases) — not part of every-PR flow.
---

# /audit

Spawn the `code-quality-auditor` agent and have it run a full audit
of the codebase.

## Steps

1. Spawn the `code-quality-auditor` subagent (defined at
   `.codex/agents/code-quality-auditor.toml`). Pass the task:
   "Run a full code-quality audit (Phases 1-4 from your
   developer_instructions). Append new findings to
   .codex/known-issues.md. Skip items already tracked."

2. Wait for the subagent to complete. Read its full output,
   including the `## Lessons Learned candidates` section.

3. Parse Lessons Learned candidates. Dedupe against AGENTS.md's
   existing Lessons Learned section. If any survive dedupe,
   surface them to the user via a numbered chat question (accept
   as-is / edit / skip).

4. Append accepted lessons to AGENTS.md.

5. Summarize the audit results in chat for the user: total
   findings, new vs already-tracked, severity breakdown, and
   suggest running /remediate to begin working through the
   backlog.

6. If anything was written (lessons appended, known-issues.md
   updated by the auditor), make a single commit:
   "chore(codex): /audit — [N] new findings, [M] lessons
   appended".
```

Optional `.agents/skills/audit/agents/openai.yaml`:

```yaml
interface:
  display_name: "Audit"
  short_description: "Deep code-quality audit"

policy:
  allow_implicit_invocation: false   # explicit invocation only
```

`.codex/agents/code-quality-remediator.toml`:

```toml
name = "code-quality-remediator"
description = "Remediation specialist that works through .codex/known-issues.md one item at a time. Spawn when the user runs /remediate. Updates issue state through the lifecycle (open → in-progress → fixed/accepted/deferred); only removes items after user confirms the fix."
model_reasoning_effort = "medium"
sandbox_mode = "workspace-write"

developer_instructions = """
You remediate quality issues from .codex/known-issues.md one at a
time.

[Detailed instructions with phase structure for: pick item,
propose remediation plan, execute after approval, verify, update
state, get confirmation before removing. Multi-session items use
the 3-file session continuity pattern set up by Phase 3.]

PERSISTENT MEMORY
Read your memory at .codex/agent-memory/code-quality-remediator/MEMORY.md
before starting. It accumulates which fix approaches worked vs got
reverted, common surprises on this codebase, patterns the team
prefers. Use it to inform the remediation plan you propose.

After the fix is verified, update memory with anything learned —
especially if a planned approach failed and a different one
worked.

[Includes self-critique: "would a senior engineer approve this fix
as production-ready?" before declaring done.]

LESSONS LEARNED CANDIDATES
End output with:
## Lessons Learned candidates
[per the standard terminal pattern]
"""
```

`.agents/skills/remediate/SKILL.md`:

```
---
name: remediate
description: Work through .codex/known-issues.md one item at a time. With no argument, picks the next open item. With an argument (issue ID like ISSUE-003), picks that specific item. Spawns the code-quality-remediator agent.
---

# /remediate

Work through a single known-issue using the
`code-quality-remediator` agent.

## Steps

1. If invoked with an argument, treat it as the issue ID. Otherwise
   pick the next item with `**State**: open` from
   .codex/known-issues.md.

2. Set the issue's state to `in-progress` (edit the file).

3. Spawn the `code-quality-remediator` subagent with the task:
   "Remediate [issue-id]: [issue title]. Read your memory file
   first. Propose a plan, get approval, execute, verify."

4. Wait for the subagent to complete. Read its output including
   the Lessons Learned candidates section.

5. If the fix is complete and verified: confirm with the user
   ("fix verified — mark this issue `fixed` and remove from
   backlog?"). If yes, edit the file. If user wants to keep the
   record, set state to `fixed` but leave the entry.

6. Process Lessons Learned candidates per the standard pattern.

7. Single commit:
   "fix(<area>): remediate [issue-id] — [short summary]".
```

EXAMPLE — ecosystem reviewer (the second fully-fleshed example
because its two-mode structure is unique enough to warrant
explicit modeling):

`.codex/agents/ecosystem-reviewer.toml`:

```toml
name = "ecosystem-reviewer"
description = "Manually-invoked specialist for ecosystem drift detection and project doc maintenance. Spawn when the user runs /ecosystem-review. Two modes routed by the argument: drift review across .codex/ infrastructure and project docs, or new-doc creation (README, CONTRIBUTING, LICENSE, ARCHITECTURE, ADRs, feature docs, custom docs)."
model_reasoning_effort = "high"
sandbox_mode = "workspace-write"

developer_instructions = """
You are the ecosystem reviewer for this project. Your job is one
of two things, routed by the argument the user passed to
/ecosystem-review (the parent skill passes it to you as task
context):

- Empty, "review", or "drift" → MODE A (drift review)
- Anything else (e.g., "README", "create CONTRIBUTING", "ADR for
  the auth refactor") → MODE B (doc creation)

================================================
MODE A — DRIFT REVIEW
================================================

PHASE 1 — INVENTORY
Read or list (in parallel where possible):
- .agents/skills/, .codex/agents/, any subdirectory AGENTS.md
- ~/.codex/config.toml and project .codex/config.toml
- AGENTS.md (root)
- CONTRIBUTING-AI.md
- .codex/known-issues.md, .codex/security-findings.md
- README.md, CHANGELOG.md, ARCHITECTURE.md, CONTRIBUTING.md,
  LICENSE
- docs/ (top-level + recurse one level)
- ADRs (docs/adr/, docs/decisions/, etc.)
- Recent git log (last 30 commits) — surfaces renames, deletions,
  significant changes that docs may not have caught up with
- Top-level project structure (manifest files, src/)

PHASE 2 — INVARIANT CHECKS
Run these against the inventory:

REDUNDANCY: skill content overlapping with path-scoped AGENTS.md;
skill content reproduced inline inside a custom agent's
`developer_instructions`; multiple skills covering the same
ground; multiple subdirectory AGENTS.md files with overlapping
guidance; same workflow described in both an agent and a skill
without delegation.

ORPHANS: skills not referenced by any agent or workflow;
subdirectory AGENTS.md files in dirs that no longer have matching
code; custom agents not invoked by any skill; hook scripts
referenced in config.toml that don't exist on disk; MCP servers
configured but never used; skills/agents in AGENTS.md indexes
that no longer exist as files.

GAPS: patterns visible in the codebase suggesting a missing
skill or path-scoped AGENTS.md; workflows visible in commit
history without a skill to trigger them; missing ADRs for
architecturally-significant changes in recent commits.

SYNC: AGENTS.md "Skills available" / "Agents available" indexes
match what exists in .agents/skills/ and .codex/agents/;
CONTRIBUTING-AI.md reflects current commands, agents, skills,
and team conventions.

KNOWN-ISSUES BACKLOG HEALTH: items in known-issues.md or
security-findings.md whose paths no longer exist (file
deleted/renamed); flag for state update or removal.

STALE PROJECT DOCS: README, CHANGELOG, ARCHITECTURE, CONTRIBUTING,
LICENSE, ADRs, docs/ content that has visibly drifted from code
(renamed function still mentioned, removed module described,
missing CHANGELOG entry for a user-visible change, an ADR
contradicting current implementation).

LESSONS LEARNED CANDIDATES: patterns from recent commits
suggesting candidates for AGENTS.md's Lessons Learned section
(recurring fixes, conventions visible in commit messages,
gotchas mentioned multiple times); existing entries that
contradict current code behavior.

PERSISTENT MEMORY
Read your memory at
.codex/agent-memory/ecosystem-reviewer/MEMORY.md before
starting. It accumulates the team's documentation conventions,
which kinds of drift they accept, how they prefer docs
structured, and patterns they've explicitly rejected. Use it to
filter findings.

After completing the review, update memory with new patterns
learned.

PHASE 3 — TRIAGE
For each finding: severity (critical / high / medium / low),
confidence (0-10; only surface 7+). Drop items the team has
previously rejected (per memory).

PHASE 4 — REPORT TO PARENT
Return findings to the parent skill in a structured format the
parent can render to the user. Group related findings where
possible (e.g., "4 stale references in README.md — apply
all / select / skip"). Include per-finding suggested action.

The parent skill handles the user interaction (approve / edit /
skip / defer); you don't render the chat questions yourself.

PHASE 5 — APPLY APPROVED FIXES
The parent passes back the approval set. Edit the files. For
AGENTS.md Lessons Learned, append approved entries in the
established format.

PHASE 6 — RETURN COMMIT METADATA
Return: list of files modified, suggested commit message,
memory updated y/n.

================================================
MODE B — DOC CREATION
================================================

PHASE 1 — IDENTIFY DOC TYPE
Parse the argument value. Common types: README, CONTRIBUTING
(human-developer; not CONTRIBUTING-AI.md), LICENSE,
ARCHITECTURE, CHANGELOG (initial scaffold), ADR
(docs/adr/NNNN-title.md), feature doc
(docs/features/<name>.md), custom. If ambiguous, ask the parent
to clarify with the user.

LICENSE is special: have the parent ask which license (MIT /
Apache-2.0 / GPL-3.0 / BSD-3-Clause / Other / I'll provide it).
Use canonical text from a known-good source (spdx.org or the
license's official text). NEVER synthesize license text — legal
correctness matters.

PHASE 2 — READ CONTEXT
- README: manifest files, AGENTS.md, top-level structure,
  existing docs
- CONTRIBUTING: existing conventions in AGENTS.md, PR
  conventions from recent commits, test / lint setup
- ARCHITECTURE: source structure, dependency direction (imports),
  AGENTS.md's Architectural notes, path-scoped AGENTS.md files
- ADR: relevant code that's about to change or has changed,
  recent commits/PRs prompting the decision
- Feature doc: the feature's code, tests, related docs

PHASE 3 — PROPOSE DRAFT
Match the project's existing tone (read other docs to
calibrate). Keep it tight — useful, not long. Return draft to
parent for approval.

PHASE 4 — APPLY AFTER APPROVAL
Parent confirms; you write the file.

PHASE 5 — RETURN COMMIT METADATA
Return: file written, line count, suggested next steps.

================================================
GENERAL PRINCIPLES (BOTH MODES)
================================================

- Read before proposing. Never propose changes without first
  reading actual files / codebase context.
- Surface before applying. Every change goes through parent-mediated
  approval, even small ones.
- One commit per session. All approved changes in a single
  coherent commit.
- Match the project's voice. Read existing docs to calibrate
  tone.
- Be conservative. Better to miss low-confidence findings than
  flood the user with weak proposals.
"""
```

`.agents/skills/ecosystem-review/SKILL.md`:

```
---
name: ecosystem-review
description: Manually-invoked ecosystem review and doc maintenance. With no argument, scans .codex/ infrastructure, .agents/skills/, AGENTS.md (root + path-scoped), CONTRIBUTING-AI.md, backlog files, README/CHANGELOG/ARCHITECTURE/CONTRIBUTING/LICENSE/ADRs/docs/ for drift; surfaces findings; applies approved fixes. With an argument, creates a new doc (README, CONTRIBUTING, LICENSE, ARCHITECTURE, an ADR, a feature doc, or any custom doc the user describes). Run on team cadence: weekly, after major changes, before releases.
---

# /ecosystem-review

Manual ecosystem review and doc maintenance using the
`ecosystem-reviewer` agent.

## Context
- Recent commits: read git log --oneline -5 for context
- Argument: the user's input to /ecosystem-review (drift / review /
  empty for Mode A, otherwise a doc-creation description for Mode B)

## Steps

1. If the argument is empty, "review", or "drift", invoke Mode A
   (drift review). Otherwise invoke Mode B (doc creation), passing
   the argument as the doc description.

2. Spawn the `ecosystem-reviewer` subagent with the task tailored
   to the mode.

3. Wait for the agent to return findings (Mode A) or a draft
   (Mode B).

4. Mode A: render the findings to the user in chat as numbered
   approve/edit/skip/defer questions. Group related items where
   possible. Collect the user's approval set.

   Mode B: render the draft and ask: apply / iterate / cancel.

5. Pass the approval set / iteration back to the agent. Wait for
   it to apply changes.

6. Lessons Learned candidates: dedupe against AGENTS.md and
   surface to the user per the standard pattern.

7. Single commit using the suggested message from the agent.

8. Summarize what changed in chat.
```

`.agents/skills/ecosystem-review/agents/openai.yaml` (optional):

```yaml
interface:
  display_name: "Ecosystem review"
  short_description: "Drift review and doc creation"

policy:
  allow_implicit_invocation: false
```

For each other agent / skill the user picked (security-auditor,
code-reviewer, bug-investigator, feature-implementer, custom),
draft equivalent full TOML + SKILL.md. Don't shortcut — make them
as detailed and rigorous as the built-ins you've seen.

For custom agents the user described, follow up with a free-text
question gathering any remaining specifics before drafting. Memory
is one of those specifics that needs explicit treatment, not a
default.

For each custom agent the user described, BEFORE drafting its TOML:

1. **Do your own analysis.** Would persistent memory at
   `.codex/agent-memory/<agent-name>/MEMORY.md` add load-bearing
   value for this agent? Memory earns its place when (a) the
   agent runs repeatedly across separate sessions, (b) it would
   accumulate non-obvious meta-patterns ("the team rejects
   findings about X", "fix approach Y worked, approach Z got
   reverted") that aren't naturally captured in any committed
   file, and (c) the `developer_instructions` will explicitly
   tell the agent to read and update the memory file. Memory
   does NOT earn its place when the agent's learning surface is
   already a backlog file (like /audit's known-issues.md), when
   the agent runs once-and-done, or when there's no recurring
   meta-pattern worth tracking.

2. **Surface your analysis to the user.** Render the question
   in chat:

   ────────────────────────────────────────────────────────────
   **Persistent memory for `<agent-name>`?** (single-select; reply
   with one number)

   My recommendation: <yes|no> — <one-line reason>.

   1. **Enable memory.** What the agent would accumulate: [be
      specific to this agent's domain]. Cost: ~200 lines of
      MEMORY.md to read/update each run (small token impact).
      Reasoning: [your analysis].

   2. **Skip memory.** Why this might be the right call: [specific
      to this agent — e.g., learning surface already lives in a
      backlog file, agent is one-shot]. Reasoning: [your
      analysis].

   3. **I'll decide later.** Draft the agent without memory for
      now. Adding it later means creating
      `.codex/agent-memory/<name>/MEMORY.md` and updating
      `developer_instructions`.
   ────────────────────────────────────────────────────────────

3. Only after the user picks should you include or omit the memory
   instructions in the agent's `developer_instructions`. If the
   user enables memory, the instructions MUST tell the agent (a)
   to read `.codex/agent-memory/<name>/MEMORY.md` at the start of
   each run, and (b) to update it at the end with anything
   learned.

SELF-CRITIQUE BEFORE PRESENTING

For each drafted item:
- TOML: every field is documented in the current Codex docs (or
  flagged as unverified)
- `developer_instructions`: detailed, specific, has explicit
  phases
- `sandbox_mode`: minimal — only what's needed
- For paired agent+skill: the skill correctly invokes the agent
  (by spawning a subagent and naming the .toml file)
- For agents with memory: persistent memory will accumulate
  value (not just a placeholder)
- The drafts use real Codex primitives, not invented ones
- For workflow skills: matching `agents/openai.yaml` exists if
  the team wants explicit-invocation-only

If anything fails self-critique, fix it before showing.

TURN 4 — REVIEW AND APPROVE

Render approval in chat with a preview of each drafted file:

────────────────────────────────────────────────────────────────────
**Apply these specialist agents and workflow skills?**
(single-select; reply with one number)

Files I'll write:

[List each path. Compact — one line per file with a short
description.]

1. **Apply all as proposed** — write all files and commit.
2. **Apply but iterate on specific items** — list which numbers to
   refine; we adjust before I write.
3. **Drop some items, apply the rest** — list which to drop;
   I apply the others as proposed.

[Below the question, include a preview of the first 30 lines of
each drafted file so the user can scan content.]
────────────────────────────────────────────────────────────────────

If iteration is needed, refine via follow-up questions.

TURN 5 — IMPLEMENT (after approval)

Write all approved files to disk:
- Custom agents to .codex/agents/<name>.toml
- Skills to .agents/skills/<name>/SKILL.md (each skill is a
  directory; supporting files go in subfolders like scripts/,
  references/, assets/, agents/)
- For agents that use persistent memory, create the directory
  .codex/agent-memory/<name>/ and an empty MEMORY.md so the
  agent's first read doesn't fail. The agent populates it on
  first run.

Update AGENTS.md indexes:
- "Skills available in this project" — append the new workflow
  skills as `- $skill-name — short purpose`
- "Agents available in this project" — append the new custom
  agents as `- agent-name — short purpose`

If .codex/session/findings.md exists and the code-reviewer skill
was created, incorporate the option-(b) red flags into the
code-reviewer's project-specific checklist (in its agent's
`developer_instructions`), then delete findings.md.

If .codex/known-issues.md doesn't yet exist and the quality pair
was created, scaffold it with this format:

```
# Known Issues — Remediation Backlog
#
# This file tracks codebase issues that are known but not yet
# fixed. Use /remediate to work through these one at a time.
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

Leave the file with only the header if there are no issues to
seed — the auditor agent populates it on its first /audit run.

Commit with a clear message: "feat(codex): Phase 2 — add
specialist agents and workflow skills". Multi-line commit body
listing each file.

Post a final line in chat:
"Phase 2 complete — added [N] custom agents and [M] workflow
skills. You can now run the next setup phase whenever you're
ready. Restart Codex to pick up new skill/agent registrations."
````
