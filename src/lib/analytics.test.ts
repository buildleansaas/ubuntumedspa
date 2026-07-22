import assert from "node:assert/strict";
import test from "node:test";

import {
  createOnceTracker,
  trackConsultStart,
  trackConsultSubmitSuccess,
  trackPhoneClick,
  type AnalyticsEventCall,
} from "./analytics";

function captureAnalytics(run: (calls: AnalyticsEventCall[]) => void) {
  const calls: AnalyticsEventCall[] = [];
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      gtag: (...args: AnalyticsEventCall) => {
        calls.push(args);
      },
    },
    writable: true,
  });

  try {
    run(calls);
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
}

function assertNoPii(calls: AnalyticsEventCall[]) {
  const payloads = calls.map(([, , parameters]) => parameters);
  const serializedPayloads = JSON.stringify(payloads).toLowerCase();
  const serializedCalls = JSON.stringify(calls).toLowerCase();
  const forbiddenKeys = ["name", "email", "phone", "comments"];
  const piiSentinels = ["jane patient", "jane@example.com", "8045550199", "private medical details"];

  for (const forbiddenKey of forbiddenKeys) {
    assert.equal(serializedPayloads.includes(forbiddenKey), false, `analytics payload must not include ${forbiddenKey}`);
  }

  for (const piiSentinel of piiSentinels) {
    assert.equal(serializedCalls.includes(piiSentinel), false, `analytics output must not include ${piiSentinel}`);
  }
}

test("consult_start emits exactly once on the first meaningful interaction", () => {
  captureAnalytics((calls) => {
    const trackFirstInteraction = createOnceTracker(trackConsultStart);

    trackFirstInteraction();
    trackFirstInteraction();
    trackFirstInteraction();

    assert.deepEqual(calls, [
      ["event", "consult_start", { form_id: "consultation", page_path: "/consult" }],
    ]);
    assertNoPii(calls);
  });
});

test("consult_submit_success emits the allowlisted conversion context", () => {
  captureAnalytics((calls) => {
    trackConsultSubmitSuccess();

    assert.deepEqual(calls, [
      ["event", "consult_submit_success", { form_id: "consultation", page_path: "/consult" }],
    ]);
    assertNoPii(calls);
  });
});

test("primary phone actions emit one phone_click each with placement only", () => {
  captureAnalytics((calls) => {
    trackPhoneClick("jumbotron");
    trackPhoneClick("site_cta");
    trackPhoneClick("footer_location");
    trackPhoneClick("location_nap");

    assert.deepEqual(calls, [
      ["event", "phone_click", { cta_location: "jumbotron" }],
      ["event", "phone_click", { cta_location: "site_cta" }],
      ["event", "phone_click", { cta_location: "footer_location" }],
      ["event", "phone_click", { cta_location: "location_nap" }],
    ]);
    assertNoPii(calls);
  });
});
