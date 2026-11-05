import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  CROWS_FEET_PAIRS,
  EAR_PIERCING_PHOTOS,
  HYPERHIDROSIS_STEPS,
  HYPERHIDROSIS_STEPS_NOTE,
  JENNY_TREATING_UNDERARM,
  RESULTS_CAPTION,
  RUNNELS_CAPTION,
  RUNNELS_PHOTO,
} from "./clinic-photos";

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");
const allPhotos = [
  ...CROWS_FEET_PAIRS.flatMap((pair) => [pair.before, pair.after]),
  ...HYPERHIDROSIS_STEPS.map((step) => step.photo),
  JENNY_TREATING_UNDERARM,
  ...EAR_PIERCING_PHOTOS.map((item) => item.photo),
  RUNNELS_PHOTO,
];

test("every clinic photo exists in public/, is a small webp, and has alt text", () => {
  for (const photo of allPhotos) {
    const file = join(ROOT, "public", photo.src);
    assert.ok(existsSync(file), photo.src);
    assert.match(photo.src, /^\/clinic\/[a-z0-9-]+\.webp$/);
    assert.ok(statSync(file).size < 200 * 1024, `${photo.src} is over 200 KB`);
    assert.ok(photo.alt.length > 20, photo.src);
    assert.ok(photo.width > 0 && photo.height > 0);
  }
  assert.equal(new Set(allPhotos.map((photo) => photo.src)).size, allPhotos.length);
});

test("results captions are honest: same patient, not retouched, lighting noted, results vary; no outcome promises", () => {
  assert.match(RESULTS_CAPTION, /Same patient, photos not retouched\./);
  assert.match(RESULTS_CAPTION, /Lighting differs/);
  assert.match(RESULTS_CAPTION, /Results vary\.$/);
  assert.match(HYPERHIDROSIS_STEPS_NOTE, /Results vary\./);
  const copy = read("src/config/clinic-photos.ts") + read("src/components/clinic-photos.tsx");
  assert.doesNotMatch(copy.replace(/\/\*[\s\S]*?\*\//g, ""), /\b(guarantee|permanent|cure|best|dramatic|erase|no more sweat)/i);
  // Underarm photos show process only; there is no sweating before/after.
  assert.doesNotMatch(HYPERHIDROSIS_STEPS.map((step) => step.title + step.caption).join(" "), /before|after/i);
});

test("Dr. Runnels caption states only the confirmed facts (Fairhope, CMA training)", () => {
  assert.equal(
    RUNNELS_CAPTION,
    "Jenny with Dr. Charles Runnels, founder of the Cellular Medicine Association, in Fairhope, Alabama, during her CMA training."
  );
  assert.doesNotMatch(RUNNELS_CAPTION, /endorse|recommend|partner/i);
});

test("ear piercing captions never name a location (the photos were taken at home)", () => {
  for (const item of EAR_PIERCING_PHOTOS) assert.doesNotMatch(item.caption + item.photo.alt, /clinic|office|Powhatan|Williamsburg/i);
});

test("photos are placed on the right pages", () => {
  const hub = read("src/app/procedures/[slug]/page.tsx");
  assert.match(hub, /\(procedure\.slug === "botox" \|\| procedure\.slug === "xeomin"\) && <CrowsFeetResults \/>/);
  assert.match(hub, /procedure\.slug === "hyperhidrosis-treatment" && <HyperhidrosisSteps \/>/);
  assert.match(hub, /procedure\.slug === "blomdahl-ear-piercing" && <EarPiercingPhotos \/>/);
  assert.match(hub, /procedure\.slug === "oh-shot" && \(/);
  assert.match(read("src/views/xeomin-cluster-page.tsx"), /page\.slug === "crows-feet" && <CrowsFeetResults \/>/);
  assert.match(read("src/views/service-satellite-page.tsx"), /page\.slug === "underarm-sweating" && <HyperhidrosisSteps \/>/);
  assert.match(read("src/app/page.tsx"), /<HomeRealPhotos \/>/);
  assert.match(read("src/app/staff/jenny-brady/page.tsx"), /<RunnelsTraining \/>/);
});
