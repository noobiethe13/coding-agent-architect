---
title: "Phase 4: CONTRIBUTING-AI.md & Wiring Validation"
description: "Generates a human-facing onboarding doc (CONTRIBUTING-AI.md) and performs a wiring-only validation pass of the setup."
tool: "claude-code"
type: "setup"
author: "noobiethe13"
verified_version: "2.1.143"
recommended_model: "Opus 4.7"
tags: ["existing-repo", "documentation", "validation", "onboarding"]
---

## What this does

This phase performs two final tasks to close out your Claude Code setup:

1. **Generate `CONTRIBUTING-AI.md`:** Creates a human-facing onboarding document at the repo root that explains how human teammates should use the project's Claude Code setup.
2. **Wiring Validation:** Performs a structural validation pass to ensure everything is plumbed correctly (files exist, references resolve, JSON is valid, scripts are executable). It explicitly does *not* validate the quality of the AI outputs, only the infrastructure.

## Prerequisites & Execution

- **Prerequisites:** - The global behavioral guidelines marker (`# CLAUDE-PROMPTS-PHASE-0-INSTALLED`) must exist in `~/.claude/CLAUDE.md`.
  - The project `CLAUDE.md` must contain Lessons Learned and skills/agents index sections (set up by an earlier phase).
  - All other earlier phases are optional; this phase will dynamically adapt to document and validate whatever was actually set up.
- **Token cost:** Low-medium. Mostly involves inspection, synthesis, and one `AskUserQuestion` interaction for approval.

## The Prompt

Copy the text below and paste it directly into your Claude Code terminal.

````text
You are closing out the Claude Code setup with a CONTRIBUTING-AI.md guide
for human teammates and a wiring-only validation pass.

PRE-FLIGHT — VERIFY PREREQUISITES

- Read ~/.claude/CLAUDE.md and confirm the marker
  `# CLAUDE-PROMPTS-PHASE-0-INSTALLED` is present (universal behavioral
  guidelines installed at User-level CLAUDE.md).
- Read the project CLAUDE.md (./CLAUDE.md or ./.claude/CLAUDE.md) and
  confirm it contains the headings `## Lessons Learned`,
  `## Skills available in this project`, and
  `## Agents available in this project` (added by an earlier setup phase).
- Other earlier phases may or may not have run; this phase adapts to
  what exists.

If either of the first two checks fails, surface a clear notice
describing what's missing and pause for user direction.

SELF-VERIFICATION

Verify against current Claude Code docs:
- Confirm the `/agents`, `/skills`, `/hooks`, `/permissions` commands work
  the way this prompt assumes (they list what's configured)
- Confirm settings.json schema if you'll be parsing it for validation

If you can't fetch docs, proceed but flag any assumption.

TURN 1 — INVENTORY WHAT EXISTS

Build a complete inventory of the Claude Code setup:

1. CLAUDE.md sections — read it and summarize structure
2. .claude/skills/ — list every skill, with name and description from frontmatter
3. .claude/agents/ — list every agent, with name and description
4. .claude/rules/ — list every rule, with paths if path-scoped
5. .claude/hooks/ — list any custom hook scripts
6. .claude/settings.json — list configured hooks (event, type, what they do
   in plain language)
7. .claude/known-issues.md — exists? how many open items?
8. .claude/security-findings.md — exists? how many open?
9. ~/.claude/CLAUDE.md — global guidelines marker present? which
   principles?
10. .gitignore — what's gitignored related to Claude Code?

Post the inventory in chat (compact — 30-40 lines max). The user
appreciates seeing what was set up before approving the final doc.

TURN 2 — DRAFT CONTRIBUTING-AI.md

Generate `CONTRIBUTING-AI.md` at the repo root (or update if it already
exists — preserve customizations, only add/update sections that are
missing or stale).

Tailor the contents to what was ACTUALLY set up (don't write about /audit
if /audit doesn't exist).

Target structure:

```markdown
# Contributing with Claude Code

This project uses Claude Code with a structured setup. This guide is for
human teammates — what to install, which commands exist, where the
guardrails are, and how to contribute back to the setup itself.

(For Claude's instructions, see CLAUDE.md.)

## 5-minute setup

1. Install Claude Code: see https://code.claude.com/docs/en/overview
2. Open this repo in your terminal or IDE.
3. Run `/init` and let it acknowledge the existing CLAUDE.md.
4. Run `/skills` and `/agents` to see what's available.
5. You're ready.

## Daily workflow

| Task | Command |
|---|---|
[Populated based on what exists. E.g.:]
| Implement a feature (multi-session) | `/feature <description>` |
| Quick code-quality cleanup of recent changes | `/simplify` (built-in) |
| PR review (project-aware) | `/pr-review [pr-number]` |
| PR security review (branch diff) | `/security-review` (built-in) |
| Codebase quality audit | `/audit` |
| Work through quality backlog | `/remediate [issue-id]` |
| Codebase security audit | `/security-audit` |
| Root-cause investigation | `/rca <bug description>` |
| Ecosystem drift review or new doc | `/ecosystem-review [focus or doc-to-create]` |
| Resume multi-session work | (read .claude/session/, continue from tasks.md) |

## Available skills (project-specific)
[List from inventory, with one-line descriptions and trigger notes]

## Available agents (project-specific)
[List from inventory, with descriptions]

## Bundled tools also worth knowing about
- `/simplify` — review-and-fix on recently changed files
- `/batch <task>` — parallel decomposition for large migrations
- `/loop` — repeat a prompt on schedule
- `/debug` — debug a Claude Code session

## Where Claude is blocked
[Summarize relevant deny rules from .claude/settings.json:
- Bash patterns blocked (e.g., `Bash(curl *)`, `Bash(rm -rf:*)`)
- File patterns blocked (e.g., `Read(./.env)`, `Read(./secrets/**)`)
- Domains blocked (`WebFetch(domain:*)` rules)]

If sandbox is configured, mention which scope.

## How to add a Lesson Learned

Two paths populate this section:

1. **You add it directly.** When Claude makes a recurring mistake on
   this codebase, add a line to the "Lessons Learned" section in
   CLAUDE.md. Keep entries factual:
   - Bad: "Claude keeps messing up the API responses lol"
   - Good: "API responses are camelCase on the wire, snake_case in
     internal types — convert at the boundary in src/api/client.ts"

2. **`/ecosystem-review` proposes one.** When you run the skill (set
   up by an earlier phase, if the team chose it), it scans recent commits and
   the codebase for patterns worth recording — recurring corrections,
   non-obvious gotchas, conventions visible in commit messages. It
   surfaces each candidate for your approval before appending the
   entry to CLAUDE.md. Nothing lands in this section without your
   sign-off.

3. **Any workflow skill proposes one.** `/audit`, `/remediate`, `/pr-review`,
   `/rca`, `/security-audit`, and `/feature` all end with a Lessons Learned
   candidate check. If a run surfaced something worth recording, Claude
   presents it via an interactive picker before committing. Nothing lands
   without your selection.

## How to add a known issue

[Only if .claude/known-issues.md exists]

When you find a quality issue worth tracking but not fixing now, add an
entry to `.claude/known-issues.md` (or run `/audit` to populate it
automatically). Issues progress through:
  open → in-progress → fixed (and removed) | accepted | deferred

Use `/remediate` to work through open items one at a time. Items in
`accepted` state stay in the file as a record of "we know, we chose not
to" — they don't get re-flagged by future audits.

## How to add a security finding

[Only if .claude/security-findings.md exists]

[Similar guidance for security backlog]

## Ecosystem review and doc maintenance

[Only if /ecosystem-review was set up by an earlier phase]

`/ecosystem-review` is a manually-invoked skill for two related jobs:

1. **Drift review** (no argument): scans `.claude/` infrastructure,
   CLAUDE.md, CONTRIBUTING-AI.md, backlog files, and project docs
   (README, CHANGELOG, ARCHITECTURE, CONTRIBUTING, LICENSE, ADRs,
   `docs/`) for redundancy, orphans, gaps, sync issues, stale content,
   and Lessons Learned candidates. Surfaces findings for your approval,
   then applies the approved fixes and commits.

2. **Doc creation** (argument is a doc description): creates a new
   project doc — `/ecosystem-review create a README`,
   `/ecosystem-review LICENSE`, `/ecosystem-review ADR for the auth
   refactor`, etc. Reads relevant codebase context, proposes a draft,
   writes after approval.

This replaces what an automatic hook might do. We chose manual
invocation to keep noise low: the agent runs only when you ask, has
full reasoning context, and can actually make changes (with approval)
rather than just suggesting them.

**When to run drift review:** weekly, after major refactors, before
releases. The agent uses persistent memory to learn the team's
documentation conventions over time, so it gets sharper at filtering
findings the more it runs.

**When to use doc creation:** any time you'd otherwise hand-author a
new doc. The agent reads the relevant context (manifest files,
CLAUDE.md, related docs) so the draft starts from real project facts,
not generic templates. For LICENSE specifically, the agent uses
canonical license text from a known-good source — never synthesized.

## Contributing to the setup itself

The setup was built with prompts in `[link to this doc, if shared]`.
To extend it:
- Add a skill: `.claude/skills/<name>/SKILL.md`
- Add an agent: use `/agents` (interactive) or write
  `.claude/agents/<name>.md`
- Add a rule: `.claude/rules/<name>.md` (use `paths:` frontmatter for
  path-scoping)
- Add a hook: `.claude/settings.json` under `hooks` (or skill/agent
  frontmatter for component-scoped hooks)

Run `/skill-creator` (install via `/plugin install
skill-creator@claude-plugins-official`) to scaffold and refine new
skills with eval support.

## Troubleshooting

- "/audit isn't picking up new files I created" — Claude Code watches
  directories live, but new top-level skills directories require a
  restart.
- "/ecosystem-review flagged something incorrectly" — say "skip" and
  ask the agent to remember the rejection in its memory. Over time the
  agent gets sharper. If a whole category of finding is consistently
  noisy, edit the agent file at `.claude/agents/ecosystem-reviewer.md`
  to tighten the relevant invariant check.
- "/ecosystem-review wants to write to a doc I'd rather hand-author" —
  pick "Skip" or "Defer" on the relevant finding. The agent never
  edits without approval.
- "Token cost feels high after this setup" — check `/context` to see
  what's loading per session. Path-scoped rules and on-demand skills
  shouldn't load unless triggered. /ecosystem-review only runs when
  you invoke it, so it costs zero tokens between runs.
```

Self-critique:
- Every section reflects what actually exists in the inventory
- No mention of features/tools that weren't set up
- Daily workflow table accurately maps tasks to commands available
- Security/blocking section reflects actual settings.json deny rules

TURN 3 — WIRING VALIDATION

Run wiring-only checks. The goal is "everything plugged in correctly",
NOT "everything produces good output". Output quality is refined by real
usage; wiring breaks block the system entirely.

For each component category, run these checks:

settings.json:
- Parses as valid JSON: `cat .claude/settings.json | jq -e .` (if jq
  available; otherwise `python -m json.tool < .claude/settings.json`)
- `permissions.allow / ask / deny` use real tool names (Read, Edit,
  Write, Bash, WebFetch, etc.) and documented rule pattern syntax
  (`Bash(cmd:*)`, `Edit(path/glob)`)
- If any agents that write to .claude/known-issues.md exist:
  `Edit(.claude/known-issues.md)` appears in permissions.allow (or no
  rule blocks it). Same for .claude/security-findings.md if the
  security-auditor exists.
- If any agent has `memory: project`: `Edit(.claude/agent-memory/**)`
  and `Write(.claude/agent-memory/**)` appear in permissions.allow
- `defaultMode` (if set) is a documented value: `default`, `acceptEdits`,
  `plan`, `bypassPermissions`
- Each `hooks.<event>[].hooks[].command` script (if any command-type
  hooks) exists on disk
- Each `hooks.<event>[].hooks[].type` is a documented type
- .claude/settings.local.json is in .gitignore (it's a personal-overrides
  file; should not be committed)

Skills:
- Each .claude/skills/<name>/SKILL.md has YAML frontmatter that parses
- Each skill's `paths:` patterns (if present) are syntactically valid
  glob patterns
- Each skill's `agent:` field (for context: fork) references either a
  built-in (Explore, Plan, general-purpose) or a real agent in
  .claude/agents/
- Each skill's `allowed-tools:` field uses real tool names (Read, Edit,
  Write, Bash, Grep, Glob, etc. — verify by checking
  https://code.claude.com/docs/en/tools-reference if possible)

Agents:
- Each .claude/agents/<name>.md has YAML frontmatter that parses
- name and description fields present (required per docs)
- `tools:` field (if present) uses real tool names
- `skills:` field (if present) lists real skills that exist in
  .claude/skills/
- `model:` field (if present) is sonnet, opus, haiku, inherit, or a
  full model ID

Rules:
- Each .claude/rules/*.md has YAML frontmatter
- `paths:` patterns (if present) are syntactically valid

CLAUDE.md indexes:
- "Skills available" lists every skill in .claude/skills/, no extras, no
  missing
- "Agents available" lists every agent in .claude/agents/, no extras,
  no missing

Cross-references:
- Every skill the user can invoke (no `disable-model-invocation: true`)
  has a clear description so Claude knows when to use it
- Every command described in CONTRIBUTING-AI.md daily-workflow table
  resolves to either a built-in or a skill that exists

Do NOT validate:
- Whether /audit produces good findings
- Whether the code-quality-auditor agent's analysis is correct
- Whether /ecosystem-review's drift detection is accurate
- Any output quality

Those need real usage. Setup-time validation is plumbing only.

If wiring issues are found, list them in chat with proposed fixes. Do
NOT auto-fix — surface them to the user and ask which to address.

TURN 4 — REVIEW AND IMPLEMENT (after approval)

Show CONTRIBUTING-AI.md draft and wiring findings via AskUserQuestion:

AskUserQuestion with:
  questions: [
    {
      question: "Apply CONTRIBUTING-AI.md and wiring fixes?",
      header: "Apply",
      multiSelect: false,
      options: [
        {
          label: "Apply CONTRIBUTING-AI.md, no wiring issues found",
          preview: "[Preview of CONTRIBUTING-AI.md — first 50 lines or so]"
        },
        {
          label: "Apply CONTRIBUTING-AI.md and fix wiring issues",
          preview: "[List of wiring issues with proposed fixes; CONTRIBUTING-AI.md preview below]"
        },
        {
          label: "Apply CONTRIBUTING-AI.md only — leave wiring issues for me",
          preview: "Wiring issues will be left as a chat summary for you to address manually."
        },
        {
          label: "Iterate on CONTRIBUTING-AI.md before writing",
          preview: "Adjust sections in a follow-up before I write the file."
        }
      ]
    }
  ]

After approval:
1. Write CONTRIBUTING-AI.md
2. Apply approved wiring fixes (if any)
3. Commit: "docs(claude): Phase 4 — CONTRIBUTING-AI.md and wiring validation"
4. Delete .claude/session/phase-4-plan.md

Post a final line in chat:

"Setup complete. CLAUDE.md, skills, agents, rules, hooks, and
CONTRIBUTING-AI.md are in place. Wiring validated.

Next steps for the team:
- Run /audit (if set up) on a quiet afternoon to populate the initial
  known-issues backlog.
- Use /pr-review on the next 2-3 PRs to refine the code-reviewer's
  checklist; iterate based on what's noisy or missed.
- Run /ecosystem-review (if set up) on your usual cadence (weekly or
  before releases). If it flags too aggressively, say "skip" on noisy
  findings so its memory learns the team's tolerance, or tighten the
  relevant invariant check in .claude/agents/ecosystem-reviewer.md.
- Plan a 2-week retrospective to refine skills and rules based on what
  actually got used vs ignored."
````
