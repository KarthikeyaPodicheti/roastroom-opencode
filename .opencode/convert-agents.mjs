// Regenerate OpenCode subagent definitions from the Claude Code originals.
// Run from the repo root: node .opencode/convert-agents.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, ".claude/agents");
const OUT = path.join(ROOT, ".opencode/agents");
fs.mkdirSync(OUT, { recursive: true });

const PERMS = `permissions:
  - action: read
    resource: "*"
    effect: allow
  - action: glob
    resource: "*"
    effect: allow
  - action: grep
    resource: "*"
    effect: allow
  - action: edit
    resource: "*"
    effect: deny
  - action: shell
    resource: "*"
    effect: deny
  - action: webfetch
    resource: "*"
    effect: deny
  - action: websearch
    resource: "*"
    effect: deny
  - action: subagent
    resource: "*"
    effect: deny`;

let n = 0;
for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith(".md"))) {
  const raw = fs.readFileSync(path.join(SRC, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`no frontmatter: ${file}`);
  const [, fm, body] = m;
  const desc = fm.match(/^description:\s*([\s\S]*?)(?=\n[a-zA-Z]+:|$)/m)?.[1]?.trim();
  if (!desc) throw new Error(`no description: ${file}`);

  fs.writeFileSync(
    path.join(OUT, file),
    `---\ndescription: ${desc}\nmode: subagent\nsteps: 12\n${PERMS}\n---\n\n\n${body}`,
  );
  n += 1;
}
console.log(`regenerated ${n} seat agents in .opencode/agents/`);
