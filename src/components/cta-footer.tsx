"use client";
import CtaButtons from "./cta-buttons";

export default function CtaFooter({
  consultHref,
}: {
  consultHref?: string;
  variant?: "default" | "editorial";
}) {
  return (
    <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-24" id="cta" aria-labelledby="home-cta-heading">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Consultation</p>
        <h2 id="home-cta-heading" className="mt-4 text-4xl leading-[1.12] tracking-tight text-base-content md:text-5xl">
          Begin Your Journey to Restorative Wellness
        </h2>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-base-content/85">
          Review treatment options with Williamsburg Med Spa and build a plan centered on safety, comfort, and
          realistic goals.
        </p>
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/80">
          Book a consultation below and share your goals. Our team typically responds within 2 business days to help
          you plan next steps.
        </p>
        <div className="mt-8">
          <CtaButtons consultHref={consultHref} align="start" />
        </div>
      </div>
    </section>
  );
}
