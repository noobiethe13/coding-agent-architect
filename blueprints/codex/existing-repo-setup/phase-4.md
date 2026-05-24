---
title: "Phase 4: CONTRIBUTING-AI.md & Wiring Validation"
description: "Generates a human-facing onboarding doc (CONTRIBUTING-AI.md) and performs a wiring-only validation pass of the setup."
tool: "codex"
type: "setup"
author: "noobiethe13"
verified_version: "0.133.0"
recommended_model: "GPT-5.5"
tags: ["existing-repo", "documentation", "validation", "onboarding"]
---

## What this does

This phase performs two final tasks to close out your Codex setup:

1. **Generate `CONTRIBUTING-AI.md`:** Creates a human-facing onboarding document at the repo root that explains how human teammates should use the project's Codex setup.
2. **Wiring Validation:** Performs a structural validation pass to ensure everything is plumbed correctly (files exist, references resolve, TOML is valid, scripts are executable, MCP servers are reachable). It explicitly does *not* validate the quality of the AI outputs — only the infrastructure.

## Prerequisites & Execution

- **Prerequisites:**
  - The global behavioral guidelines marker (`# CODEX-PROMPTS-PHASE-0-INSTALLED`) should exist in `~/.codex/AGENTS.md` (warning if missing).
  - The project `AGENTS.md` must contain Lessons Learned and skills/agents index sections (set up by Phase 0).
  - All other earlier phases are optional; this phase will dynamically adapt to document and validate whatever was actually set up.
- **Token cost:** Low-medium. Mostly inspection, synthesis, and one approval question.

## The Prompt

Copy the text below and paste it directly into your Codex CLI terminal.

````text
You are closing out the Codex setup with a CONTRIBUTING-AI.md guide
for human teammates and a wiring-only validation pass.

PRE-FLIGHT — VERIFY PREREQUISITES

- Read ~/.codex/AGENTS.md and confirm the marker
  `# CODEX-PROMPTS-PHASE-0-INSTALLED` is present (universal
  behavioral guidelines installed at user-level AGENTS.md).
- Read the project AGENTS.md (./AGENTS.md) and confirm it contains
  the headings `## Lessons Learned`,
  `## Skills available in this project`, and
  `## Agents available in this project` (added by Phase 0).
- Other earlier phases may or may not have run; this phase adapts to
  what exists.

If either of the first two checks fails, surface a clear notice
describing what's missing and pause for user direction.

SELF-VERIFICATION

Verify against current Codex docs:
- Confirm the `/skills`, `/agent`, `/hooks`, `/mcp`, `/status` slash
  commands work the way this prompt assumes (they list what's
  configured)
- Confirm config.toml schema if you'll be parsing it for validation
  (https://developers.openai.com/codex/config-reference)

If you can't fetch docs, proceed but flag any assumption.

TURN 1 — INVENTORY WHAT EXISTS

Build a complete inventory of the Codex setup:

1. AGENTS.md sections — read it and summarize structure. Note any
   path-scoped AGENTS.md files in subdirectories (find them by
   walking the tree).
2. .agents/skills/ — list every skill, with name and description from
   frontmatter. Include user-scope `$HOME/.agents/skills/` if it
   contributes project-relevant skills.
3. .codex/agents/ — list every custom agent .toml file, with name and
   description.
4. .codex/hooks.json (or [hooks] tables in config.toml) — list any
   configured hooks (event, type, what they do in plain language).
5. ~/.codex/config.toml — list configured MCP servers (from
   `[mcp_servers.*]`), permission profiles (from `[permissions.*]`),
   sandbox / approval defaults, profile blocks.
6. Project .codex/config.toml (if it exists) — same.
7. .codex/known-issues.md — exists? how many open items?
8. .codex/security-findings.md — exists? how many open?
9. ~/.codex/AGENTS.md — global guidelines marker present? which
   principles?
10. .gitignore — what's gitignored related to Codex?

Post the inventory in chat (compact — 30-40 lines max). The user
appreciates seeing what was set up before approving the final doc.

TURN 2 — DRAFT CONTRIBUTING-AI.md

Generate `CONTRIBUTING-AI.md` at the repo root (or update if it
already exists — preserve customizations, only add/update sections
that are missing or stale).

Tailor the contents to what was ACTUALLY set up (don't write about
/audit if /audit doesn't exist).

Target structure:

```markdown
# Contributing with Codex CLI

This project uses OpenAI Codex with a structured setup. This guide is
for human teammates — what to install, which commands exist, where
the guardrails are, and how to contribute back to the setup itself.

(For Codex's instructions, see AGENTS.md.)

## 5-minute setup

1. Install Codex CLI. On Mac/Linux:
   `curl -fsSL https://chatgpt.com/codex/install.sh | sh`
   On Windows (PowerShell):
   `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"`
   Or via npm: `npm install -g @openai/codex`
   Or via Homebrew: `brew install --cask codex`
2. Sign in: `codex login` (use your ChatGPT account if your plan
   covers it, or `--with-api-key` to pipe an API key).
3. Open this repo in your terminal.
4. Run `codex` to launch the interactive TUI. Codex auto-loads
   AGENTS.md from the repo root.
5. Run `/skills` and `/agent` inside Codex to see what's available.
6. You're ready.

## Daily workflow

| Task | Command |
|---|---|
[Populated based on what exists. Examples:]
| Implement a feature (multi-session) | `/feature <description>` |
| Quick code-quality cleanup of recent changes | `/review` (built-in) |
| PR review (project-aware) | `/pr-review [pr-number]` |
| Branch-diff review (built-in) | `/review` |
| Codebase quality audit | `/audit` |
| Work through quality backlog | `/remediate [issue-id]` |
| Codebase security audit | `/security-audit` |
| Root-cause investigation | `/rca <bug description>` |
| Ecosystem drift review or new doc | `/ecosystem-review [focus or doc-to-create]` |
| Resume previous session | `codex resume --last` |
| Fork into a side conversation | `codex fork --last` or `/side` |
| Long-running multi-session work | (read .codex/session/, continue from tasks.md) |

## Available skills (project-specific)

[List from inventory, with one-line descriptions and trigger notes.
Note explicit invocation via `$skill-name` or `/skills` picker.]

## Available custom agents (project-specific)

[List from inventory, with descriptions. Note built-in agents
(default, worker, explorer) ship with Codex.]

## Bundled tools also worth knowing about

- `/review` — branch-diff or working-tree review (built-in)
- `/plan` — enter plan mode to preview steps before execution
- `/memories` — configure persistent memory generation and injection
- `/mcp` — inspect MCP tools and resources available
- `/hooks` — inspect and trust configured lifecycle hooks
- `/status` — show model, policy, and token usage
- `$imagegen` — bundled image generation skill
- `codex resume`, `codex fork`, `codex exec`, `codex doctor` — CLI-
  level session and diagnostic commands

## Where Codex is blocked

[Summarize the active permissions profile from config.toml:
- Filesystem paths set to `deny` (e.g., `.env*`, `secrets/`)
- Filesystem paths set to `write` (the allowlist)
- Network: enabled or disabled by default, MCP servers explicitly
  enabled
- Sandbox mode default (`read-only` / `workspace-write` /
  `danger-full-access`)
- Approval policy default (`untrusted` / `on-request` / `never`)]

## How to add a Lesson Learned

Two paths populate this section:

1. **You add it directly.** When Codex makes a recurring mistake on
   this codebase, add a line to the "Lessons Learned" section in
   AGENTS.md. Keep entries factual:
   - Bad: "Codex keeps messing up the API responses lol"
   - Good: "API responses are camelCase on the wire, snake_case in
     internal types — convert at the boundary in src/api/client.ts"

2. **`/ecosystem-review` proposes one.** When you run the skill (set
   up by Phase 2, if the team chose it), it scans recent commits and
   the codebase for patterns worth recording — recurring corrections,
   non-obvious gotchas, conventions visible in commit messages. It
   surfaces each candidate for your approval before appending the
   entry to AGENTS.md. Nothing lands in this section without your
   sign-off.

3. **Any workflow skill proposes one.** `/audit`, `/remediate`,
   `/pr-review`, `/rca`, `/security-audit`, and `/feature` all end
   with a Lessons Learned candidate check. If a run surfaced
   something worth recording, Codex presents it in chat before
   committing. Nothing lands without your selection.

## How to add a known issue

[Only if .codex/known-issues.md exists]

When you find a quality issue worth tracking but not fixing now,
add an entry to `.codex/known-issues.md` (or run `/audit` to populate
it automatically). Issues progress through:
  open → in-progress → fixed (and removed) | accepted | deferred

Use `/remediate` to work through open items one at a time. Items in
`accepted` state stay in the file as a record of "we know, we chose
not to" — they don't get re-flagged by future audits.

## How to add a security finding

[Only if .codex/security-findings.md exists]

[Similar guidance for security backlog. Note: built-in /review covers
branch-diff scope; /security-audit is the codebase-wide backlog
workflow set up by Phase 2.]

## Ecosystem review and doc maintenance

[Only if /ecosystem-review was set up by Phase 2]

`/ecosystem-review` is a manually-invoked skill for two related
jobs:

1. **Drift review** (no argument): scans `.codex/` infrastructure,
   `.agents/skills/`, AGENTS.md (root + path-scoped), CONTRIBUTING-
   AI.md, backlog files, and project docs (README, CHANGELOG,
   ARCHITECTURE, CONTRIBUTING, LICENSE, ADRs, `docs/`) for
   redundancy, orphans, gaps, sync issues, stale content, and Lessons
   Learned candidates. Surfaces findings for your approval, then
   applies the approved fixes and commits.

2. **Doc creation** (argument is a doc description): creates a new
   project doc — `/ecosystem-review create a README`,
   `/ecosystem-review LICENSE`, `/ecosystem-review ADR for the auth
   refactor`, etc. Reads relevant codebase context, proposes a
   draft, writes after approval.

This replaces what an automatic hook might do. We chose manual
invocation to keep noise low: the agent runs only when you ask, has
full reasoning context, and can actually make changes (with
approval) rather than just suggesting them.

**When to run drift review:** weekly, after major refactors, before
releases. The agent uses persistent memory (under
`.codex/agent-memory/ecosystem-reviewer/`) to learn the team's
documentation conventions over time, so it gets sharper at filtering
findings the more it runs.

**When to use doc creation:** any time you'd otherwise hand-author a
new doc. The agent reads the relevant context (manifest files,
AGENTS.md, related docs) so the draft starts from real project
facts, not generic templates. For LICENSE specifically, the agent
uses canonical license text from a known-good source — never
synthesized.

## Contributing to the setup itself

The setup was built with prompts in `[link to this doc, if shared]`.
To extend it:

- Add a skill: `.agents/skills/<name>/SKILL.md` (kebab-case folder
  with required `name` and `description` in frontmatter; optional
  `agents/openai.yaml` for display metadata).
- Add a custom agent: write `.codex/agents/<name>.toml` (TOML
  format; required fields `name`, `description`,
  `developer_instructions`; optional `model`,
  `model_reasoning_effort`, `sandbox_mode`, `mcp_servers`).
- Add path-scoped rules: drop an `AGENTS.md` in the relevant
  subdirectory. Codex auto-loads it for any session below that path,
  concatenated after parent files (closer wins on conflicting
  guidance).
- Add a hook: register in `~/.codex/hooks.json` or as
  `[[hooks.<Event>]]` tables in `config.toml`. Events include
  `SessionStart`, `PreToolUse`, `PostToolUse`,
  `PermissionRequest`, `UserPromptSubmit`, `Stop`,
  `PreCompact` / `PostCompact`, `SubagentStart` / `SubagentStop`.
- Add an MCP server: `codex mcp add <name> -- <command>` or `--url
  <https-url>`; manage with `codex mcp list / get / remove`.

## Troubleshooting

- "/audit isn't picking up new files I created" — Codex's skill
  discovery walks `.agents/skills/` on session start; new skill
  folders require a restart.
- "/ecosystem-review flagged something incorrectly" — say "skip"
  and ask the agent to remember the rejection in its memory. Over
  time the agent gets sharper. If a whole category of finding is
  consistently noisy, edit the agent file at
  `.codex/agents/ecosystem-reviewer.toml` to tighten the relevant
  invariant check.
- "/ecosystem-review wants to write to a doc I'd rather hand-author"
  — pick "Skip" or "Defer" on the relevant finding. The agent
  never edits without approval.
- "AGENTS.md content seems to be ignored" — check whether an
  `AGENTS.override.md` exists at the same directory level; the
  override takes precedence. Also check whether you've exceeded
  the 32 KiB `project_doc_max_bytes` limit (raise in
  `config.toml` or split into path-scoped AGENTS.md files).
- "Token cost feels high after this setup" — check `/status` to see
  what's loading per session. Path-scoped AGENTS.md files and
  on-demand skills shouldn't load unless triggered.
  /ecosystem-review only runs when you invoke it, so it costs zero
  tokens between runs.
- "Permissions prompt every time even though I set a profile" —
  confirm `default_permissions = "<profile-name>"` is set at the
  top level of config.toml AND that the profile's `workspace_roots`
  cover the relevant paths.
- Run `codex doctor` for support-ready diagnostics across runtime,
  auth, terminal, network, config, and local state.
```

Self-critique:

- Every section reflects what actually exists in the inventory
- No mention of features/tools that weren't set up
- Daily workflow table accurately maps tasks to commands available
- "Where Codex is blocked" section reflects actual config.toml
  permissions profile

TURN 3 — WIRING VALIDATION

Run wiring-only checks. The goal is "everything plugged in
correctly", NOT "everything produces good output". Output quality is
refined by real usage; wiring breaks block the system entirely.

For each component category, run these checks:

config.toml:

- Parses as valid TOML (use Codex's own validator if available;
  otherwise a quick read-and-parse pass)
- `[permissions.<name>]` profiles reference real path patterns;
  `workspace_roots` cover the relevant project directories
- If any agents that write to .codex/known-issues.md exist: the
  active profile grants write access to that path (or no deny rule
  blocks it). Same for .codex/security-findings.md if the
  security-auditor exists.
- If any agent uses persistent memory: the active profile grants
  write access to `.codex/agent-memory/`
- `default_permissions` (if set) references an actually-defined
  profile name
- `[mcp_servers.*]` entries either have `command` (stdio) or `url`
  (HTTP) but not both
- Each `[[hooks.<Event>]].hooks[].command` script (if any
  command-type hooks) exists on disk
- Each `[[hooks.<Event>]]` event name is one of the documented
  events (SessionStart, PreToolUse, PostToolUse,
  PermissionRequest, UserPromptSubmit, Stop, PreCompact,
  PostCompact, SubagentStart, SubagentStop)
- Profile blocks (`[profiles.<name>]`) reference only valid config
  keys

Skills:

- Each .agents/skills/<name>/SKILL.md has YAML frontmatter that
  parses
- Each skill has a `name` (kebab-case) and `description`
- Each skill's optional `agents/openai.yaml` (if present) parses
  and uses only documented fields (`interface.*`, `policy.*`,
  `dependencies.tools`)
- Each skill's referenced supporting files (scripts/, references/,
  assets/) actually exist on disk
- `$imagegen` and other bundled skills are NOT duplicated in
  `.agents/skills/`

Custom agents (.codex/agents/<name>.toml):

- Each file has the required fields `name`, `description`,
  `developer_instructions`
- `model` (if set) references a real model identifier
- `sandbox_mode` (if set) is `read-only`, `workspace-write`, or
  `danger-full-access`
- `mcp_servers` (if set) references real entries in
  `[mcp_servers.*]`
- No agent name collides with the bundled `default`, `worker`, or
  `explorer` names

Path-scoped AGENTS.md files:

- Each one is valid markdown (no broken YAML pretending to be
  frontmatter — AGENTS.md has no frontmatter)
- Subdirectory paths actually exist
- Combined chain (root AGENTS.md + every subdirectory AGENTS.md on
  any common CWD path) stays under `project_doc_max_bytes` (32 KiB
  default)

AGENTS.md indexes:

- "Skills available" lists every skill in .agents/skills/, no
  extras, no missing
- "Agents available" lists every custom agent in .codex/agents/, no
  extras, no missing

Cross-references:

- Every skill the user can invoke explicitly (`$skill-name` or via
  `/skills`) has a clear description so Codex knows when to use it
- Every command described in CONTRIBUTING-AI.md daily-workflow table
  resolves to either a built-in or a skill/custom agent that exists

Do NOT validate:

- Whether /audit produces good findings
- Whether the code-quality-auditor agent's analysis is correct
- Whether /ecosystem-review's drift detection is accurate
- Any output quality

Those need real usage. Setup-time validation is plumbing only.

If wiring issues are found, list them in chat with proposed fixes.
Do NOT auto-fix — surface them to the user and ask which to
address.

TURN 4 — REVIEW AND IMPLEMENT (after approval)

Show CONTRIBUTING-AI.md draft and wiring findings in chat:

────────────────────────────────────────────────────────────────────
**Apply CONTRIBUTING-AI.md and wiring fixes?** (single-select; reply
with one number)

1. **Apply CONTRIBUTING-AI.md, no wiring issues found** — write the
   file and commit.
2. **Apply CONTRIBUTING-AI.md and fix wiring issues** — apply the
   listed fixes alongside the doc.
3. **Apply CONTRIBUTING-AI.md only — leave wiring issues for me** —
   wiring issues stay as a chat summary for you to address manually.
4. **Iterate on CONTRIBUTING-AI.md before writing** — adjust
   sections in a follow-up before I write the file.

[Below the question, include:
- A preview of CONTRIBUTING-AI.md (first ~50 lines)
- A bulleted list of wiring issues with proposed fixes (if any)]
────────────────────────────────────────────────────────────────────

After approval:

1. Write CONTRIBUTING-AI.md
2. Apply approved wiring fixes (if any)
3. Commit: "docs(codex): Phase 4 — CONTRIBUTING-AI.md and wiring
   validation"

Post a final line in chat:

"Setup complete. AGENTS.md, skills, custom agents, path-scoped
rules, hooks, MCP servers, and CONTRIBUTING-AI.md are in place.
Wiring validated.

Next steps for the team:

- Run /audit (if set up) on a quiet afternoon to populate the
  initial known-issues backlog.
- Use /pr-review on the next 2-3 PRs to refine the code-reviewer's
  checklist; iterate based on what's noisy or missed.
- Run /ecosystem-review (if set up) on your usual cadence (weekly
  or before releases). If it flags too aggressively, say "skip" on
  noisy findings so its memory learns the team's tolerance, or
  tighten the relevant invariant check in
  .codex/agents/ecosystem-reviewer.toml.
- Plan a 2-week retrospective to refine skills and custom agents
  based on what actually got used vs ignored."
````
