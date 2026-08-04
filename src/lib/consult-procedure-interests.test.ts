import assert from "node:assert/strict";
import test from "node:test";

import { FORM_INPUTS } from "../data";
import { getProcedureInterests } from "./consult-procedure-interests";

test("PRP Breast Lift consultation URLs map to the exact visible interest", () => {
  assert.deepEqual(getProcedureInterests("prp-breast-lift"), ["PRP Breast Lift"]);

  const interests = FORM_INPUTS.find((input) => input.id === "interests")?.options ?? [];
  assert.ok(interests.includes("PRP Breast Lift"));
  assert.ok(!interests.includes("Breast Lift"));
});
