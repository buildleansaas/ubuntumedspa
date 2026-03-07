import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Jenny Brady — Aesthetic Nurse Practitioner | Williamsburg Med Spa",
  description: "Learn about Jenny Brady, MSN, RN, CPNP, PMHS — blending regenerative PRP therapies and evidence-based aesthetic care in Williamsburg, VA.",
  canonical: "/staff/jenny-brady",
});

export default function JennyBradyPage() {
  return (
    <div className="max-w-xl md:max-w-4xl mx-auto py-12 md:py-16">
      <StructuredData type="Person" />
      <h1 className="text-3xl md:text-5xl font-light mb-4">Jenny Brady</h1>
      <p className="text-base md:text-lg text-base-content/70 mb-6">MSN, RN, CPNP, PMHS</p>
      <p className="text-base md:text-lg text-base-content/80 leading-relaxed">
        With over two decades in medicine and a specialized focus on aesthetics, Jenny blends primary care and mental
        health expertise with a holistic, patient‑first approach. She provides regenerative PRP therapies, advanced
        injection techniques, and practical wellness counseling to help patients look and feel their best — naturally.
      </p>
    </div>
  );
}
