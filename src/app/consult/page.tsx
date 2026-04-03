import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import ConsultationForm from "./consult-form";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Book a Med Spa Consultation in Williamsburg, VA | Williamsburg Med Spa",
  description:
    "Schedule a consultation with Williamsburg Med Spa to review PRP, Botox, Xeomin, fillers, and customized treatment options.",
  canonical: "/consult",
});

export default function ConsultationPage() {
  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Consult"]} />
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.18em] text-base-content/60">Consultation</p>
        <h1 className="text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light leading-tight">
          Book a consultation
        </h1>
        <p className="mt-4 text-base md:text-lg text-base-content/70 max-w-2xl mx-auto">
          Tell us what you would like to address and we will follow up with scheduling options that fit your goals.
        </p>
        <p className="mt-4 text-sm md:text-base text-base-content/60">
          What to expect: candidacy review, risk discussion, and a personalized treatment plan.
        </p>
      </section>

      <div className="mt-10 md:mt-12">
        <ConsultationForm />
      </div>

      <p className="mt-6 text-sm text-base-content/60 text-center max-w-2xl mx-auto">
        Treatment recommendations depend on your history, examination, and goals. Outcomes vary by patient.
      </p>
    </div>
  );
}
