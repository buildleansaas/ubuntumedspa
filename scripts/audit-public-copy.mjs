import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src/app", "src/views", "src/data.ts", "src/config/commerce-catalog.ts"];
const EXTENSIONS = new Set([".ts", ".tsx", ".md", ".mdx"]);
const banned = [
  { label: "em dash", pattern: /—/g },
  { label: "guaranteed outcome", pattern: /\b(guarantee|guaranteed|permanent results|lifetime for some|safe and effective way)\b/gi },
  { label: "surgical-equivalent claim", pattern: /\b(replaces surgery|alternative to surgery|same as surgery|without the need for surgery)\b/gi },
];
const allowedFragments = [
  "Em dash intentionally appears in non-public tooling",
];

function ext(path) {
  const match = path.match(/\.[^.]+$/);
  return match ? match[0] : "";
}

function files(path) {
  const st = statSync(path);
  if (st.isFile()) return EXTENSIONS.has(ext(path)) ? [path] : [];
  return readdirSync(path).flatMap((name) => files(join(path, name)));
}

const hits = [];
for (const root of ROOTS) {
  for (const file of files(root)) {
    const text = readFileSync(file, "utf8");
    if (allowedFragments.some((fragment) => text.includes(fragment))) continue;
    for (const rule of banned) {
      for (const match of text.matchAll(rule.pattern)) {
        const line = text.slice(0, match.index).split("\n").length;
        hits.push(`${file}:${line}: ${rule.label}: ${match[0]}`);
      }
    }
  }
}

if (hits.length) {
  console.error("Public-copy audit failed:\n" + hits.join("\n"));
  process.exit(1);
}
console.log("Public-copy audit passed.");
