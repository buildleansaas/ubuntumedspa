"use client";
import CtaButtons from "./cta-buttons";

export default function CtaFooter() {
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
          <CtaButtons />
        </div>
      </div>
    </div>
  );
}
