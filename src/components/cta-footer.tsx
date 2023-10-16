"use client";
import CtaButtons from "./cta-buttons";

export default function CtaFooter() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 z-10">
      <div className="text-center pt-16 sm:pt-20" id="cta">
        <h2 className="text-white text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
          Achieve Natural Results that Last
        </h2>
        <h3 className="text-white text-xl lg:text-2xl max-w-2xl mb-8 mx-auto">
          Discover the transformative power of Platelet-Rich Plasma treatments and our other treatments at Ubuntu Med
          Spa.
        </h3>
        <p className="mb-8 max-w-xl mx-auto">
          Book a consultation below and let us know what questions you have and Jenny Coleman will be back to you within
          the next 2 business days.
        </p>
        <div className="mb-32">
          <CtaButtons />
        </div>
      </div>
    </div>
  );
}
