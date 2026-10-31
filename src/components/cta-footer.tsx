"use client";
import CtaButtons from "./cta-buttons";

export default function CtaFooter({
  consultHref,
  variant = "default",
}: {
  consultHref?: string;
  variant?: "default" | "editorial";
}) {
  if (variant === "editorial") {
    return (
      <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-24" id="cta" aria-labelledby="home-cta-heading">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">Consultation</p>
          <h2
            id="home-cta-heading"
            className="font-display mt-4 text-4xl font-medium leading-[1.12] tracking-tight text-base-content md:text-5xl"
          >
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

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 z-10">
      <div className="text-center pt-16 sm:pt-20" id="cta">
        <h2 className="text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
          Begin Your Journey to Restorative Wellness
        </h2>
        <h3 className="text-base-content text-xl lg:text-2xl max-w-2xl mb-8 mx-auto">
          Review treatment options with Williamsburg Med Spa and build a plan centered on safety, comfort, and
          realistic goals.
        </h3>
        <p className="mb-8 max-w-xl mx-auto">
          Book a consultation below and share your goals. Our team typically responds within 2 business days to help
          you plan next steps.
        </p>
        <div className="mb-32">
          <CtaButtons consultHref={consultHref} />
        </div>
      </div>
    </div>
  );
}
