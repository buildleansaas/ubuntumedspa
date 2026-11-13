// Writes src/config/content-dates.json: the date each non-blog sitemap page's copy last changed, taken from git.
// Blog posts are left out because their frontmatter already carries dateModified/date.
//
// A page's date is the newest commit that touched the files holding its copy: the route file plus the data or lib
// file its text comes from. For procedures and products in src/data.ts only that entry's lines count (git log -L),
// so editing one procedure does not move every procedure's date.
//
// Run after committing a content change, then commit the JSON:  pnpm content-dates
// Check without writing (exits 1 when the JSON is stale):        pnpm content-dates --check
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { sitemapPagePaths } from "../src/lib/sitemap-pages";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "src/config/content-dates.json");
const DATA_FILE = "src/data.ts";

type Source = string | { dataEntry: "procedures" | "products"; slug: string };

const git = (args: string[]) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();

const dataLines = readFileSync(path.join(ROOT, DATA_FILE), "utf8").split("\n");
const dataEntryRange = (list: "procedures" | "products", slug: string): [number, number] => {
  const listStart = dataLines.findIndex((line) => line.startsWith(`export const ${list} = [`));
  const slugLine = dataLines.findIndex((line, index) => index > listStart && line === `    slug: "${slug}",`);
  if (listStart === -1 || slugLine === -1) throw new Error(`${DATA_FILE}: no ${list} entry with slug ${slug}`);
  let start = slugLine;
  while (start > 0 && dataLines[start] !== "  {") start -= 1;
  let end = slugLine;
  while (end < dataLines.length && !/^  },?$/.test(dataLines[end])) end += 1;
  return [start + 1, end + 1];
};

const lastChanged = (source: Source): string => {
  if (typeof source === "string") {
    return git(["log", "-1", "--format=%cs", "--", source]);
  }
  const [start, end] = dataEntryRange(source.dataEntry, source.slug);
  return git(["log", "-1", "-s", "--format=%cs", `-L${start},${end}:${DATA_FILE}`]).split("\n")[0];
};

const satellite = (route: string) => [route, "src/lib/service-satellites.ts", "src/views/service-satellite-page.tsx"];
const xeominCluster = (route: string) => [route, "src/lib/xeomin-concerns.ts", "src/views/xeomin-cluster-page.tsx"];

// First matching rule wins. Every sitemap path must match one, or the script stops.
const rules: [RegExp, (match: RegExpMatchArray) => Source[]][] = [
  [
    /^\/$/,
    () => [
      "src/app/page.tsx",
      "src/views/jumbotron.tsx",
      "src/views/search-answers.tsx",
      "src/views/blomdahl-callout.tsx",
      "src/views/oh-shot-callout.tsx",
      "src/views/provider-callout.tsx",
      "src/views/home-visit.tsx",
      "src/views/botox-party-callout.tsx",
    ],
  ],
  [/^\/consult$/, () => ["src/app/consult/page.tsx", "src/app/consult/consult-form.tsx"]],
  [/^\/blog$/, () => ["src/app/blog/page.tsx"]],
  [/^\/procedures$/, () => ["src/app/procedures/page.tsx", "src/views/procedures.tsx"]],
  [/^\/products$/, () => ["src/app/products/page.tsx", "src/views/products.tsx"]],
  [/^\/prices$/, () => ["src/app/prices/page.tsx", "src/config/commerce-catalog.ts"]],
  [/^\/offers$/, () => ["src/app/offers/page.tsx", "src/config/offers.ts"]],
  [/^\/staff\/jenny-brady$/, () => ["src/app/staff/jenny-brady/page.tsx"]],
  [/^\/locations(?:\/([a-z-]+))?$/, (m) => [m[1] ? `src/app/locations/${m[1]}/page.tsx` : "src/app/locations/page.tsx"]],
  [
    /^\/procedures\/blomdahl-ear-piercing\/near\/[a-z-]+$/,
    () => ["src/app/procedures/blomdahl-ear-piercing/near/[areaSlug]/page.tsx", "src/lib/local-service-areas.ts"],
  ],
  [
    /^\/procedures\/blomdahl-ear-piercing\/for\/[a-z-]+$/,
    () => ["src/app/procedures/blomdahl-ear-piercing/for/[intentSlug]/page.tsx", "src/lib/ear-piercing-intents.ts"],
  ],
  [/^\/procedures\/hyperhidrosis-treatment\/for\/[a-z-]+$/, () => satellite("src/app/procedures/hyperhidrosis-treatment/for/[concernSlug]/page.tsx")],
  [/^\/procedures\/prp-breast-lift\/near\/[a-z-]+$/, () => satellite("src/app/procedures/prp-breast-lift/near/[areaSlug]/page.tsx")],
  [/^\/procedures\/prp-face-lift\/near\/[a-z-]+$/, () => satellite("src/app/procedures/prp-face-lift/near/[areaSlug]/page.tsx")],
  [/^\/procedures\/xeomin\/near\/[a-z-]+$/, () => satellite("src/app/procedures/xeomin/near/[areaSlug]/page.tsx")],
  [/^\/procedures\/xeomin\/for\/[a-z-]+$/, () => xeominCluster("src/app/procedures/xeomin/for/[concernSlug]/page.tsx")],
  [/^\/procedures\/xeomin\/cost$/, () => xeominCluster("src/app/procedures/xeomin/cost/page.tsx")],
  [/^\/procedures\/([a-z0-9-]+)$/, (m) => ["src/app/procedures/[slug]/page.tsx", { dataEntry: "procedures", slug: m[1] }]],
  [/^\/products\/([a-z0-9-]+)$/, (m) => ["src/app/products/[slug]/page.tsx", { dataEntry: "products", slug: m[1] }]],
  [/^\/(privacy|terms|cookies|html-sitemap)$/, (m) => [`src/app/${m[1]}/page.tsx`]],
  [/^\/events$/, () => ["src/app/events/page.tsx", "src/lib/events.ts"]],
  [/^\/events\/[a-z0-9-]+$/, () => ["src/app/events/[slug]/page.tsx", "src/lib/events.ts"]],
];

const main = async () => {
  // /offers is included even when no offer is running today, so its date is ready when it returns to the sitemap.
  const { beforeArticles, afterArticles } = sitemapPagePaths({ includeOffers: true });
  const dates: Record<string, string> = {};
  for (const pathname of [...beforeArticles, ...afterArticles]) {
    const rule = rules.find(([pattern]) => pattern.test(pathname));
    if (!rule) throw new Error(`No content-date rule for ${pathname}; add one to scripts/content-dates.ts`);
    const sources = rule[1](pathname.match(rule[0])!);
    const sourceDates = sources.map(lastChanged);
    if (sourceDates.some((date) => !/^\d{4}-\d{2}-\d{2}$/.test(date))) {
      throw new Error(`${pathname}: a source has no committed history (${JSON.stringify(sources)})`);
    }
    dates[pathname] = sourceDates.sort().at(-1)!;
  }
  const json = `${JSON.stringify(dates, null, 2)}\n`;
  if (process.argv.includes("--check")) {
    const current = readFileSync(OUTPUT, "utf8");
    if (current !== json) {
      console.error("src/config/content-dates.json is stale. Run: pnpm content-dates");
      process.exit(1);
    }
    console.log(`content-dates.json is current (${Object.keys(dates).length} pages).`);
    return;
  }
  writeFileSync(OUTPUT, json);
  console.log(`Wrote ${Object.keys(dates).length} page dates to src/config/content-dates.json`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
