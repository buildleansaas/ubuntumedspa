import { readFileSync } from "node:fs";

const FILES = [
  "src/app/page.tsx",
  "src/views/jumbotron.tsx",
  "src/app/procedures/[slug]/page.tsx",
  "src/data.ts",
  "src/config/commerce-catalog.ts",
];
const banned = [
  { label: "em dash", pattern: /—/g },
  { label: "guaranteed outcome", pattern: /\b(guaranteed fix|guaranteed results|permanent results|lifetime for some|safe and effective way)\b/gi },
  { label: "surgical-equivalent claim", pattern: /\b(replaces surgery|same as surgery|without the need for surgery)\b/gi },
];
const allowedFragments = [
  "no procedure guarantees a specific outcome",
  "not breast augmentation, does not replace implant surgery or a surgical lift",
  "not a hair transplant, does not create new follicles",
];

const hits = [];
for (const file of FILES) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");
  for (const rule of banned) {
    for (const match of text.matchAll(rule.pattern)) {
      const line = text.slice(0, match.index).split("\n").length;
      const sourceLine = lines[line - 1] ?? "";
      if (allowedFragments.some((fragment) => sourceLine.includes(fragment))) continue;
      hits.push(`${file}:${line}: ${rule.label}: ${match[0]}`);
    }
  }
}

if (hits.length) {
  console.error("Public-copy audit failed:\n" + hits.join("\n"));
  process.exit(1);
}
console.log("Public-copy audit passed.");
