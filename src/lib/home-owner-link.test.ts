import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  HOME_OWNER_ANCHOR,
  HOME_OWNER_LINK_POSTS,
  HOME_OWNER_LINK_PROCEDURES,
} from "../components/home-owner-link";

// ScaleSleek finding f_majveah6ld: pages that split "med spa williamsburg va" link to / with those words.
const STATIC_PAGES = [
  "events",
  "consult",
  "locations",
  "locations/williamsburg-va",
  "locations/yorktown-va",
  "locations/james-city-county-va",
  "locations/newport-news-va",
  "procedures",
  "products",
  "blog",
];

test("home owner link uses the exact search as its text", () => {
  assert.equal(HOME_OWNER_ANCHOR, "med spa williamsburg va");
  const source = readFileSync("src/components/home-owner-link.tsx", "utf8");
  assert.match(source, /<Link href="\/"/);
});

test("every competing static page renders the home owner link", () => {
  for (const page of STATIC_PAGES) {
    const source = readFileSync(`src/app/${page}/page.tsx`, "utf8");
    assert.match(source, /<HomeOwnerLink\b/, `/${page} is missing the link to /`);
  }
});

test("competing procedure and blog pages render the home owner link", () => {
  assert.deepEqual([...HOME_OWNER_LINK_PROCEDURES].sort(), ["blomdahl-ear-piercing", "botox", "xeomin"]);
  assert.deepEqual([...HOME_OWNER_LINK_POSTS].sort(), [
    "coolsculpting-alternatives-in-williamsburg-va",
    "kybella-alternatives-in-williamsburg-va",
  ]);
  for (const slug of HOME_OWNER_LINK_POSTS) {
    readFileSync(`src/markdown/${slug}.mdx`, "utf8");
  }
  assert.match(readFileSync("src/app/procedures/[slug]/page.tsx", "utf8"), /HOME_OWNER_LINK_PROCEDURES\.has\(procedure\.slug\) && <HomeOwnerLink/);
  assert.match(readFileSync("src/app/blog/[slug]/page.tsx", "utf8"), /HOME_OWNER_LINK_POSTS\.has\(params\.slug\) && <HomeOwnerLink/);
});
