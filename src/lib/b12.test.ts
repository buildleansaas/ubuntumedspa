import assert from "node:assert/strict";
import test from "node:test";

import { getCatalogConfigBySlug } from "../config/commerce-catalog";
import { FORM_INPUTS, procedures } from "../data";
import { getProcedureInterests } from "./consult-procedure-interests";
import { cardPriceCents } from "./price";

const procedure = procedures.find((item) => item.slug === "b12-injections");

test("B-12 catalog price is $25 cash and the computed card price ($26.06)", () => {
  const item = getCatalogConfigBySlug("b12-injections");
  assert.ok(item);
  assert.equal(item.kind, "procedure");
  assert.equal(item.fulfillment, "appointment");
  assert.equal(item.requiresScheduling, true);
  assert.equal(item.cashAmountCents, 2500);
  assert.equal(cardPriceCents(2500), 2606);
  assert.equal(item.unitAmountCents, cardPriceCents(2500));
  assert.ok(item.displayPrice.startsWith("$25"), item.displayPrice);
  assert.equal(item.displayPrice, "$25 per injection cash · $26.06 card/online");
  assert.equal(/fee|surcharge/i.test(item.displayPrice), false);
});

test("B-12 page title and meta are as specified, cash first", () => {
  assert.ok(procedure);
  assert.equal(procedure.seo.title, "Vitamin B-12 Injections in Williamsburg, VA | $25 Cash");
  assert.ok(procedure.seo.description.length <= 160, `meta is ${procedure.seo.description.length} characters`);
  assert.match(procedure.seo.description, /\$25 .*cash.*\$26\.06/);
  assert.match(procedure.seo.description, /Nurse-led/);
  assert.equal(procedure.price, "$25 per injection cash · $26.06 card/online");
});

test("B-12 page copy makes no outcome claims and says it is not a weight-loss treatment", () => {
  assert.ok(procedure);
  const copy = JSON.stringify(procedure);
  const notWeightLoss = "B-12 injections are not a weight-loss treatment.";
  assert.ok(copy.includes(notWeightLoss));
  const withoutAllowedLine = copy.split(notWeightLoss).join("");
  const banned = /energy|fatigue|tired|feel better|improv|weight loss(?! treatment)|metabolism|boost|immunity|anti-aging|best/i;
  assert.equal(banned.test(withoutAllowedLine), false, `banned wording: ${withoutAllowedLine.match(banned)?.[0]}`);
  assert.equal(/weight[- ]loss/i.test(withoutAllowedLine.replace(/a weight-loss treatment/g, "")), false);
  assert.equal(/cyanocobalamin|methylcobalamin|\bfees?\b|surcharge/i.test(copy), false);
  assert.ok(copy.includes("Jenny sets the schedule based on your history and any lab results."));
});

test("B-12 is in the consult interests and maps from ?procedure=b12-injections", () => {
  const interests = FORM_INPUTS.find((input) => input.id === "interests")?.options ?? [];
  assert.ok(interests.includes("Vitamin B-12 Injections"));
  assert.deepEqual(getProcedureInterests("b12-injections"), ["Vitamin B-12 Injections"]);
});

test("B-12 is one injection per order, the copy agrees, and a decline is refunded", () => {
  const item = getCatalogConfigBySlug("b12-injections");
  assert.ok(item);
  assert.equal(item.maxQuantity, 1);
  const copy = JSON.stringify(procedures.find((p) => p.slug === "b12-injections"));
  assert.doesNotMatch(copy, /up to \d+ injections/i);
  assert.match(copy, /your payment is refunded/);
  assert.match(item.customerNote ?? "", /your payment is refunded/);
});
