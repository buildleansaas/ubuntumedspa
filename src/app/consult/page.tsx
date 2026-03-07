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
    <div className="max-w-3xl mx-auto py-8">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Consult"]} />
      <ConsultationForm />
      <p className="text-sm text-base-content/70 mt-4 text-center max-w-2xl mx-auto">
        Consultations include candidacy review, risk discussion, and personalized planning. Treatment outcomes vary by
        patient.
      </p>
    </div>
  );
}
