import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { sitemapPagePaths } from "./sitemap-pages";

const ROOT = process.cwd();
const contentDates: Record<string, string> = JSON.parse(readFileSync(join(ROOT, "src/config/content-dates.json"), "utf8"));
const { beforeArticles, afterArticles } = sitemapPagePaths({ includeOffers: true });
const paths = [...beforeArticles, ...afterArticles];

test("every non-blog sitemap page has a committed content date (run pnpm content-dates after adding a page)", () => {
  for (const path of paths) {
    assert.match(contentDates[path] ?? "", /^\d{4}-\d{2}-\d{2}$/, `${path} has no content date`);
  }
  assert.deepEqual(Object.keys(contentDates).sort(), [...new Set(paths)].sort(), "content-dates.json lists a page the sitemap does not");
});

test("content dates are real past dates, not one build-time date stamped on every page", () => {
  const today = new Date().toISOString().slice(0, 10);
  for (const [path, date] of Object.entries(contentDates)) assert.ok(date <= today, `${path} is dated in the future (${date})`);
  assert.ok(new Set(Object.values(contentDates)).size > 1, "every page has the same content date");
});

test("sitemap.ts takes lastmod from frontmatter for posts and content-dates.json for everything else", () => {
  const source = readFileSync(join(ROOT, "src/app/sitemap.ts"), "utf8");
  assert.match(source, /import contentDates from "config\/content-dates\.json"/);
  assert.match(source, /article\.dateModified \?\? article\.date/);
  assert.doesNotMatch(source, /lastModified:\s*new Date\(\)/);
});
