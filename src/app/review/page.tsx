import type { Metadata } from "next";

import { buildPageMetadata } from "lib/metadata";
import { BOOKING_PHONE_DISPLAY, bookingTelHref } from "lib/text-to-book";

import { ReviewButton } from "./review-button";

// Landing page for review requests (QR codes, texts). Not linked from the site, disallowed in robots.txt,
// left out of the sitemap, and noindex. Google policy and the FTC rule (16 CFR 465) apply: every visitor
// sees the same Google review button, nothing is offered in return, and no one is steered toward a rating.
export const metadata: Metadata = buildPageMetadata({
  title: "Leave a Review | Williamsburg Med Spa",
  description: "Share your honest review of Williamsburg Med Spa on Google.",
  canonical: "/review",
  robots: { index: false, follow: true },
});

const STEPS = [
  "Tap the button above. Google opens our review page.",
  "Pick your stars.",
  "Write a sentence or two about your visit, like what you came in for and how it went.",
] as const;

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-xl py-12 md:py-20">
      <h1 className="text-3xl font-light leading-tight md:text-4xl">Thank you for visiting Williamsburg Med Spa</h1>
      <p className="mt-4 text-lg text-base-content/80">
        Your honest review helps other families in Williamsburg find a nurse-led clinic.
      </p>

      <div className="mt-8">
        <ReviewButton />
      </div>

      <h2 className="mt-12 text-xl font-semibold">How it works</h2>
      <ol className="mt-4 space-y-3">
        {STEPS.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/40 text-sm font-medium text-primary">
              {index + 1}
            </span>
            <span className="pt-0.5 text-base-content/80">{step}</span>
          </li>
        ))}
      </ol>

      <p className="mt-12 border-t border-base-300 pt-6 text-base-content/70">
        Questions or concerns? Text or call Jenny at{" "}
        <a href={bookingTelHref} className="underline underline-offset-4">
          {BOOKING_PHONE_DISPLAY}
        </a>
        .
      </p>
    </div>
  );
}
