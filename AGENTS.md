# AGENTS.md

Instructions for OpenCode and any other coding agent working in this repository.

## What this project is

The Roast Room runs a board meeting on one business decision. A council of simulated advisors, each built from a person's public work, argues over three rounds. The Chair runs the room, scores the options, and writes a verdict to `sessions/<date>-<slug>/verdict.md`.

The project is optimized for OpenCode. The council skill and the seat subagents are already wired for it.

## Where things live

| Path | What it is |
|---|---|
| `.claude/skills/roast-room/SKILL.md` | The council protocol. OpenCode discovers skills in `.claude/skills` and `.opencode/skills`. |
| `.claude/skills/roast-room/roster.json` | Every advisor, the default board, and how the board is picked |
| `.claude/skills/roast-room/brains/<slug>/` | One brain per advisor |
| `.opencode/agents/council-<key>.md` | The seat subagents OpenCode launches |
| `.claude/agents/council-<key>.md` | The Claude Code originals, used as the source for regeneration |
| `.opencode/convert-agents.mjs` | Regenerates `.opencode/agents` from `.claude/agents` |
| `.claude/skills/newroaster/` | The `/newroaster` skill and its scripts |
| `app/` | The room: a zero-dependency Node server and the web page |
| `sessions/` | One folder per council. Personal sessions are gitignored; the examples ship with the repo |

## Commands

```bash
npm start                                   # the room on http://localhost:4730
node .opencode/convert-agents.mjs           # regenerate seat subagents after editing .claude/agents
python3 .claude/skills/roast-room/scripts/check_quotes.py sessions/<folder>   # verify every quote
```

## Rules for agents

- When the user brings a business decision ("should I...", pricing, hiring, raising money, a new product, a pivot), run the `roast-room` skill. For one advisor, run a single-seat consult with that seat.
- Every advisor and the default board live in `roster.json`. When the user wants a new advisor, run `newroaster`. When they want to change the default board, run the `roast-room` skill with `board`.
- If the user asks to start the room, run `npm start` in the background and tell them to open http://localhost:4730. It needs Node 20 or newer and nothing else.
- Follow `.claude/skills/roast-room/references/live-room.md` exactly when writing session files, so the room can play them live.
- The seats are simulations built from public work. Never present a seat's words as something the real person said unless it is a verbatim quote with a source id from that seat's brain.
- Write the Chair's parts in plain English: short sentences, no hype, no filler, no em dashes. Keep the chat verdict short enough to decide from at a glance; the full report goes in `verdict.md`.
- Never commit a user's business context, a personal session folder, API keys, or `.env`.
