# Coding Agent Architect

A community library of blueprints that standardize how AI coding assistants behave.

Most teams using Claude Code or Cursor end up cobbling together their own setup. Someone copies a prompt from a blog post, tweaks it, and then never touches it again. The next person on the team writes their own. Six months later nobody can remember why the assistant suddenly stopped following the project's conventions.

This repo collects vetted, versioned blueprints you can drop into any project so your AI assistant behaves the same way on every machine and for every contributor. Same setup whether you're solo, on a team of three, or rolling something out across a whole engineering org.

Today it ships blueprints for Claude Code. Cursor, Copilot, Windsurf, and Codex are on the roadmap, and PRs are welcome.

## What's in here

Two kinds of blueprints live under each tool's folder.

**Goal-based flows** are multi-phase setups you run in order. Each goal gets its own folder, like `core-setup/`, `existing-repo-setup/`, or `new-repo-setup/`. Inside, files are named `phase-0.md`, `phase-1.md`, and so on. Run them top to bottom. The community can add a new goal folder for any setup workflow worth standardizing.

**Standalone artifacts** are single-file drop-ins that don't need ordering. They live in fixed type folders:

- `agents/` for sub-agent definitions.
- `skills/` for packaged capabilities a tool can call into.
- `rules/` for project-level constraints the tool follows.

Every blueprint is a single `.md` file with validated frontmatter and a prompt block ready to paste.

## Using a blueprint

1. Open the docs site, or browse the [`blueprints/`](blueprints/) directory on GitHub.
2. Pick one that matches the tool you use.
3. Copy the prompt block.
4. Paste it into your AI assistant's terminal or chat.

That's it. The assistant runs the prompt, asks any clarifying questions, and writes the resulting config to disk.

> Example: the [Phase 0 global guidelines](blueprints/claude-code/core-setup/phase-0.md) blueprint installs universal behavioral principles into `~/.claude/CLAUDE.md`. Run it once per machine.

## Repository layout

```
blueprints/
  claude-code/
    core-setup/             # goal flow: one-time global setup
    existing-repo-setup/    # goal flow: onboard the agent into an existing repo
    new-repo-setup/         # goal flow: scaffold a fresh agent-ready repo
    agents/                 # standalone sub-agent definitions
    skills/                 # standalone skills
    rules/                  # standalone project rules
site/                       # Astro + Starlight docs site
```

The docs site is a thin wrapper around the blueprints. The repo is the source of truth.

## Running the docs site locally

```sh
cd site
npm install
npm run dev
```

This symlinks `blueprints/` into `site/src/content/docs/` and serves Starlight at `localhost:4321`.

## Roadmap

PRs welcome for any of these:

- Cursor (rules, agents)
- GitHub Copilot (instructions, prompt files)
- Windsurf (workflows, rules)
- Codex (instructions, hooks)
- Any other AI coding tool worth standardizing

Each tool gets its own folder under `blueprints/`, and the community can contribute agents, skills, rules, and setup flows for it. Improvements to the core prompts are just as welcome as new ones.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the authoring spec, frontmatter schema, lint setup, and PR checklist.

## License

MIT. See [LICENSE](LICENSE).
