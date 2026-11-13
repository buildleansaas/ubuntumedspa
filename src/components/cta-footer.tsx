"use client";
import CtaButtons from "./cta-buttons";
import { BandCta } from "./layout";

// Band CTA: a full-bleed band with a centred heading and the booking buttons (components/layout).
export default function CtaFooter({
  consultHref,
}: {
  consultHref?: string;
  variant?: "default" | "editorial";
}) {
  return (
    <BandCta id="cta" headingId="home-cta-heading" eyebrow="Consultation" title="Begin Your Journey to Restorative Wellness">
      <p className="mx-auto mt-4 max-w-[62ch] text-lg leading-relaxed text-base-content/85">
        Review treatment options with Williamsburg Med Spa and build a plan centered on safety, comfort, and
        realistic goals.
      </p>
      <p className="mx-auto mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/75">
        Book a consultation below and share your goals. Our team typically responds within 2 business days to help
        you plan next steps.
      </p>
      <div className="mt-8">
        <CtaButtons consultHref={consultHref} align="center" size="lg" />
      </div>
    </BandCta>
  );
}
