import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { FORM_INPUTS } from "../data";
import { CONSULT_CONCERNS, NO_SELECTION_ERROR, normalizeConsultConcerns, resolveConsultSelections } from "./consult-concerns";

const ROOT = join(__dirname, "..", "..");
const read = (path: string) => readFileSync(join(ROOT, path), "utf8");
const interestOptions = FORM_INPUTS.find((input) => input.id === "interests")?.options ?? [];

test("the concern question comes first and lists Jenny's approved concerns", () => {
  const ids = FORM_INPUTS.map((input) => input.id);
  assert.ok(ids.indexOf("concerns") < ids.indexOf("interests"));
  const concerns = FORM_INPUTS.find((input) => input.id === "concerns");
  assert.equal(concerns?.label, "What would you like help with?");
  assert.deepEqual(concerns?.options, CONSULT_CONCERNS.map((concern) => concern.label));
  assert.equal(FORM_INPUTS.find((input) => input.id === "interests")?.label, "Already know the treatment?");
});

test("every concern maps only to treatments the form offers", () => {
  for (const concern of CONSULT_CONCERNS) {
    for (const interest of concern.interests) assert.ok(interestOptions.includes(interest), `${concern.label} -> ${interest}`);
  }
});

test("concerns alone are enough, and they fill in the likely treatments", () => {
  assert.deepEqual(resolveConsultSelections({ concerns: ["Thinning hair", "Tired or uneven skin"] }), {
    concerns: ["Thinning hair", "Tired or uneven skin"],
    interests: ["Hair Restoration", "PRP Facial", "Microneedling with PRP"],
  });
  assert.deepEqual(resolveConsultSelections({ concerns: ["Not sure yet"] }), { concerns: ["Not sure yet"], interests: [] });
});

test("treatments alone still work, legacy names still map, and nothing at all is refused", () => {
  assert.deepEqual(resolveConsultSelections({ interests: ["Botox"] }), { concerns: [], interests: ["Xeomin (Botox alternative)"] });
  assert.deepEqual(resolveConsultSelections({}), { error: NO_SELECTION_ERROR });
  assert.deepEqual(resolveConsultSelections({ concerns: ["made up"], interests: [] }), { error: NO_SELECTION_ERROR });
});

test("unknown concern values are dropped and duplicates collapse", () => {
  assert.deepEqual(normalizeConsultConcerns(["Joint pain", "<script>", "Joint pain"]), ["Joint pain"]);
});

test("concern answers never reach analytics; the API stores and emails them", () => {
  const analytics = read("src/lib/analytics.ts");
  assert.doesNotMatch(analytics, /concern/i);
  const form = read("src/app/consult/consult-form.tsx");
  assert.doesNotMatch(form, /track\w*\([^)]*concern/i);
  const route = read("src/app/api/consult/route.ts");
  assert.match(route, /resolveConsultSelections\(\{ concerns, interests \}\)/);
  assert.match(route, /concerns: normalizedConcerns/);
  assert.match(route, /wants help with:/);
});

test("the privacy policy no longer says we process no sensitive information", () => {
  const policy = read("src/markdown/policies/privacy.mdx");
  assert.doesNotMatch(policy, /We do not process sensitive information/);
  assert.match(policy, /do not sell it or share it with advertising or analytics providers/);
});
