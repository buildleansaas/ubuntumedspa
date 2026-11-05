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
  RUNELS_CAPTION,
  RUNELS_PHOTO,
  PRP_TUBE_CAPTION,
  PRP_TUBE_PHOTO,
  PICCIRILLO_PHOTO,
  CARPAL_TUNNEL_PHOTO,
} from "./clinic-photos";

const ROOT = process.cwd();

/** Reads a WebP's pixel size from its header (VP8X, VP8 lossy, or VP8L lossless). */
const webpSize = (file: string): [number, number] => {
  const b = readFileSync(file);
  const chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (chunk === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  if (chunk === "VP8L") {
    const bits = b.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }
  throw new Error(`${file}: unknown WebP chunk ${chunk}`);
};
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");
const allPhotos = [
  ...CROWS_FEET_PAIRS.flatMap((pair) => [pair.before, pair.after]),
  ...HYPERHIDROSIS_STEPS.map((step) => step.photo),
  JENNY_TREATING_UNDERARM,
  ...EAR_PIERCING_PHOTOS.map((item) => item.photo),
  RUNELS_PHOTO,
  PRP_TUBE_PHOTO,
  PICCIRILLO_PHOTO,
  CARPAL_TUNNEL_PHOTO,
];

test("every clinic photo exists in public/, is a small webp, and has alt text", () => {
  for (const photo of allPhotos) {
    const file = join(ROOT, "public", photo.src);
    assert.ok(existsSync(file), photo.src);
    assert.match(photo.src, /^\/clinic\/[a-z0-9-]+\.webp$/);
    assert.ok(statSync(file).size < 200 * 1024, `${photo.src} is over 200 KB`);
    assert.ok(photo.alt.length > 20, photo.src);
    assert.deepEqual(webpSize(file), [photo.width, photo.height], `${photo.src} declared size does not match the file`);
  }
  assert.equal(new Set(allPhotos.map((photo) => photo.src)).size, allPhotos.length);
});

test("results captions are honest: same patient, not retouched, lighting noted, results vary; no outcome promises", () => {
  assert.match(RESULTS_CAPTION, /Same patient, photos not retouched\./);
  assert.match(RESULTS_CAPTION, /Lighting, expression, and camera distance differ/);
  assert.match(RESULTS_CAPTION, /Results vary\.$/);
  assert.match(HYPERHIDROSIS_STEPS_NOTE, /Results vary\./);
  const copy = read("src/config/clinic-photos.ts") + read("src/components/clinic-photos.tsx");
  assert.doesNotMatch(copy.replace(/\/\*[\s\S]*?\*\//g, ""), /\b(guarantee|permanent|cure|best|dramatic|erase|no more sweat)/i);
  // Underarm photos show process only; there is no sweating before/after.
  assert.doesNotMatch(HYPERHIDROSIS_STEPS.map((step) => step.title + step.caption).join(" "), /before|after/i);
});

test("Dr. Runels caption states only the confirmed facts (Fairhope, CMA training)", () => {
  assert.equal(
    RUNELS_CAPTION,
    "Jenny with Dr. Charles Runels in Fairhope, Alabama, during her Cellular Medicine Association training."
  );
  assert.doesNotMatch(RUNELS_CAPTION, /endorse|recommend|partner|founder/i);
  // His name is spelled Runels (cellularmedicineassociation.org; the site's OH-Shot article).
  const all = read("src/config/clinic-photos.ts") + read("src/components/clinic-photos.tsx");
  assert.doesNotMatch(all, /Runnels/);
});

test("no photo copy claims the photos were taken at the clinic (several were not)", () => {
  assert.doesNotMatch(read("src/components/clinic-photos.tsx"), /from our clinic|in our clinic|at the clinic/i);
});

test("ear piercing captions never name a location (the photos were taken at home)", () => {
  for (const item of EAR_PIERCING_PHOTOS) assert.doesNotMatch(item.caption + item.photo.alt, /clinic|office|Powhatan|Williamsburg/i);
});

test("photos are placed on the right pages", () => {
  const hub = read("src/app/procedures/[slug]/page.tsx");
  assert.match(hub, /\(procedure\.slug === "botox" \|\| procedure\.slug === "xeomin"\) && <CrowsFeetResults \/>/);
  assert.match(hub, /procedure\.slug === "hyperhidrosis-treatment" && <HyperhidrosisSteps \/>/);
  assert.match(hub, /procedure\.slug === "blomdahl-ear-piercing" && <EarPiercingPhotos \/>/);
  assert.match(hub, /procedure\.slug === "oh-shot" && \([\s\S]{0,300}<RunelsTraining \/>/);
  assert.match(read("src/views/xeomin-cluster-page.tsx"), /page\.slug === "crows-feet" && <CrowsFeetResults \/>/);
  assert.match(read("src/views/service-satellite-page.tsx"), /page\.slug === "underarm-sweating" && <HyperhidrosisSteps \/>/);
  assert.match(read("src/app/page.tsx"), /<HomeRealPhotos \/>/);
  assert.match(hub, /procedure\.slug === "joint-restoration" && \([\s\S]{0,300}<JointPhotos \/>/);
  assert.match(read("src/components/clinic-photos.tsx"), /export function JointPhotos[\s\S]*?<PiccirilloTraining \/>/);
  assert.match(read("src/app/staff/jenny-brady/page.tsx"), /<PiccirilloTraining \/>/);
  assert.match(hub, /\["prp-facial", "prp-hair-restoration", "joint-restoration"\]\.includes\(procedure\.slug\) && <PrpTubePhoto \/>/);
  assert.doesNotMatch(PRP_TUBE_CAPTION, /clinic|Williamsburg/i);
  assert.match(read("src/app/staff/jenny-brady/page.tsx"), /<RunelsTraining \/>/);
});
