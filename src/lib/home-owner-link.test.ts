import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  HOME_ALTERNATIVE_ANCHOR,
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

// ScaleSleek finding f_vh33afabed: the homepage answers "botox williamsburg", "hydrafacial williamsburg va" and
// "dermal fillers williamsburg" under their own H2s, answers the Botox search in the hero, and three pages that
// also showed for "botox williamsburg" link to / with the search's words.
test("homepage answers the Botox, Hydrafacial and dermal filler searches", () => {
  const home = readFileSync("src/app/page.tsx", "utf8");
  assert.match(home, /heading: "A Botox alternative in Williamsburg, VA: we use Xeomin®"/);
  assert.match(home, /heading: "Hydrafacial in Williamsburg, VA"/);
  assert.match(home, /heading: "Dermal fillers in Williamsburg, VA"/);
  assert.match(home, /<h2 id=\{item\.id\}/);
  assert.match(home, /does not offer Hydrafacial/);
  assert.match(home, /does not offer dermal fillers/);
  const hero = readFileSync("src/views/jumbotron.tsx", "utf8");
  const h1End = hero.indexOf("</h1>");
  const answer = hero.indexOf("Looking for Botox in Williamsburg, VA? We use");
  const background = hero.indexOf("A local med spa with Jenny Brady");
  assert.ok(h1End > 0 && answer > h1End && answer < background, "the Botox answer sits right under the H1, before the background");
  assert.equal(hero.match(/<h1\b/g)?.length, 1);
});

test("three competing pages link to / for the Botox search", () => {
  assert.equal(HOME_ALTERNATIVE_ANCHOR, "Botox alternative in Williamsburg, VA");
  for (const page of ["events", "locations/williamsburg-va", "locations/yorktown-va"]) {
    assert.match(readFileSync(`src/app/${page}/page.tsx`, "utf8"), /<HomeXeominLink\b/, `/${page} is missing the Botox link to /`);
  }
});
