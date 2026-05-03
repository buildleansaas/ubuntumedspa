import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Jenny Coleman — Aesthetic Nurse Practitioner | Williamsburg Med Spa",
  description: "Learn about Jenny Coleman, MSN, RN, CPNP, PMHS — blending regenerative PRP therapies and evidence-based aesthetic care in Williamsburg, VA.",
  canonical: "/staff/jenny-coleman",
});

export default function JennyColemanPage() {
  return (
    <div className="max-w-xl md:max-w-4xl mx-auto py-12 md:py-16">
      <StructuredData type="Person" />
      <h1 className="text-3xl md:text-5xl font-light mb-4">Jenny Coleman</h1>
      <p className="text-base md:text-lg text-base-content/70 mb-6">MSN, RN, CPNP, PMHS</p>
      <p className="text-base md:text-lg text-base-content/80 leading-relaxed">
        With over two decades in medicine and a specialized focus on aesthetics, Jenny blends primary care and mental
        health expertise with a holistic, patient‑first approach. She provides regenerative PRP therapies, advanced
        injection techniques, and practical wellness counseling to help patients look and feel their best — naturally.
      </p>
      <section className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-5 md:p-6">
        <h2 className="text-xl md:text-2xl font-light mb-3">Related pediatric education projects</h2>
        <p className="text-base text-base-content/80 leading-relaxed">
          Jenny&apos;s pediatric teaching style also informs PedsCalc, a clinician-oriented pediatric calculation and
          reference project, and Dear Pediatrician, a parent-facing guide library for everyday child health questions.
          These education projects are separate from med spa treatment planning.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
          <a href="https://pedscalc.com" target="_blank" rel="noopener noreferrer" className="link link-primary">
            Visit PedsCalc
          </a>
          <a href="https://dearpediatrician.com" target="_blank" rel="noopener noreferrer" className="link link-primary">
            Visit Dear Pediatrician
          </a>
        </div>
      </section>
    </div>
  );
}
