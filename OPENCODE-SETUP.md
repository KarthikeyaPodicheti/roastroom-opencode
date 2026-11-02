# OpenCode setup

This repository runs the Roast Room council in OpenCode. This page explains how the pieces are wired, in case you fork it, update it from upstream, or want to debug a seat that does not load.

## What runs where

| Piece | Path | Runtime |
|---|---|---|
| Council skill | `.claude/skills/roast-room/SKILL.md` | Discovered by OpenCode |
| New advisor skill | `.claude/skills/newroaster/SKILL.md` | Discovered by OpenCode |
| Seat subagents | `.opencode/agents/council-<key>.md` | OpenCode |
| Claude Code originals | `.claude/agents/council-<key>.md` | Source for regeneration |
| Roster and default board | `.claude/skills/roast-room/roster.json` | Both |
| Brains | `.claude/skills/roast-room/brains/<slug>/` | Both |
| Room (web UI) | `npm start` → http://localhost:4730 | Node 20 or newer |

OpenCode discovers skills in both `.claude/skills` and `.opencode/skills`. This repo keeps the skill in `.claude/skills` so the same files work in Claude Code and OpenCode. If you prefer, move the folder to `.opencode/skills` and update the paths in `AGENTS.md` and the skill files.

## Use it

```bash
git clone https://github.com/KarthikeyaPodicheti/roastroom-opencode.git
cd roastroom-opencode
npm start          # leave the room open at http://localhost:4730
opencode           # in this folder
```

Then type `/roast-room` and the decision, or ask for one seat at a time.

## How the seats were converted

`.opencode/agents/council-*.md` were generated from `.claude/agents/council-*.md`:

| Claude Code field | OpenCode |
|---|---|
| `tools: Read, Grep, Glob` | `permissions:` allow `read`/`glob`/`grep`, deny `edit`/`shell`/`webfetch`/`websearch`/`subagent` |
| `maxTurns: 12` | `steps: 12` |
| `name: council-<key>` | dropped; the filename is the agent ID |
| none | `mode: subagent` (required to be launchable) |

The skill text is runtime-neutral: `AskUserQuestion` becomes the `question` tool, and seats are launched as one `subagent` call per seat. The skill names both agent paths (`.opencode/agents` and `.claude/agents`), so either runtime works.

Regenerate the seats after editing the originals:

```bash
node .opencode/convert-agents.mjs
```

## Updating from upstream

Upstream (`nateherkai/roast-room`) does not ship `.opencode/agents/` or the OpenCode wording, so a pull can revert the skill text and leave the seat files stale. After a pull:

```bash
node .opencode/convert-agents.mjs
```

Then check that `.claude/skills/roast-room/SKILL.md` and `references/round-prompts.md` still name both runtimes and the `subagent` call pattern.

## Not wired up

- **API mode** (`COUNCIL_RUNNER=api` plus `ANTHROPIC_API_KEY` in `.env`) works without OpenCode or Claude Code. It bills your Anthropic account, about 25 calls per full council. Override the model IDs with `SEAT_MODEL` and `CHAIR_MODEL` if the defaults are rejected.
- **Portraits** for new seats need `KIE_AI_API_KEY` and Python `opencv-python`. A new seat still works without a portrait and shows a placeholder.
