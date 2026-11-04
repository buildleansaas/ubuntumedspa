export type PhoneCtaLocation =
  | "jumbotron"
  | "site_cta"
  | "footer_location"
  | "location_nap"
  | "service_page"
  | "order_booking"
  | "consult_booking"
  | "event_booking";

type ConsultEventName = "consult_start" | "consult_submit_success";
type AnalyticsEventName = ConsultEventName | "phone_click" | "text_click" | "review_click";
type ConsultEventParameters = {
  form_id: "consultation";
  page_path: "/consult";
};
type PhoneEventParameters = {
  cta_location: PhoneCtaLocation;
};
export type ReviewCtaLocation = "review_page";
type ReviewEventParameters = {
  cta_location: ReviewCtaLocation;
};
type AnalyticsEventParameters = ConsultEventParameters | PhoneEventParameters | ReviewEventParameters;

export type AnalyticsEventCall = ["event", AnalyticsEventName, AnalyticsEventParameters];
type Gtag = (...args: AnalyticsEventCall) => void;

type AnalyticsWindow = Window & {
  gtag?: Gtag;
};

const CONSULT_EVENT_CONTEXT: ConsultEventParameters = {
  form_id: "consultation",
  page_path: "/consult",
};

function emitEvent(eventName: AnalyticsEventName, parameters: AnalyticsEventParameters) {
  if (typeof window === "undefined") return;

  try {
    (window as AnalyticsWindow).gtag?.("event", eventName, parameters);
  } catch {
    // Analytics must never interrupt a conversion action.
  }
}

export function createOnceTracker(track: () => void) {
  let tracked = false;

  return () => {
    if (tracked) return;
    tracked = true;
    track();
  };
}

export function trackConsultStart() {
  emitEvent("consult_start", CONSULT_EVENT_CONTEXT);
}

export function trackConsultSubmitSuccess() {
  emitEvent("consult_submit_success", CONSULT_EVENT_CONTEXT);
}

export function trackPhoneClick(ctaLocation: PhoneCtaLocation) {
  emitEvent("phone_click", { cta_location: ctaLocation });
}

export function trackTextClick(ctaLocation: PhoneCtaLocation) {
  emitEvent("text_click", { cta_location: ctaLocation });
}

export function trackReviewClick(ctaLocation: ReviewCtaLocation) {
  emitEvent("review_click", { cta_location: ctaLocation });
}
