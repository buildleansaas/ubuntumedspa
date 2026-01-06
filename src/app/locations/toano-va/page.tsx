import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";

export const metadata: Metadata = {
  title: "Med Spa Near Toano | Williamsburg Med Spa",
  description:
    "A short drive from Toano to Williamsburg Med Spa for PRP therapies, fillers, and gentle aesthetic care.",
  alternates: { canonical: "/locations/toano-va" },
};

export default function ToanoPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Toano"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Toano</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Convenient access from Toano and upper James City County to our Williamsburg clinic.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          If you live in Toano or nearby areas of upper James City County, Williamsburg Med Spa offers regenerative PRP
          therapies, fillers, and aesthetic treatments just a short drive away. Patients often visit us for joint
          support, skin rejuvenation, and confidence‑building, natural‑looking enhancements.
        </p>
        <p>
          Expect a calm environment, unhurried consultations, and clear explanations of what to expect before, during,
          and after treatment. We work with you to find options that match your goals and comfort level.
        </p>
        <h2>Getting Here</h2>
        <p>
          From Toano, take I‑64 or Richmond Road toward Williamsburg, then follow Route 199 to Monticello Avenue and
          Powhatan Parkway. Our clinic has on‑site parking near the main entrance.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="btn btn-sm btn-primary" href="/consult">Book a Consultation</Link>
        <Link className="btn btn-sm" href="/locations/williamsburg-va">Williamsburg Location Details</Link>
        <DirectionsButton
          className="btn btn-sm btn-secondary"
          address="3900 Powhatan Parkway, Williamsburg, VA 23188"
          latitude={37.2707}
          longitude={-76.7075}
        />
      </div>
    </div>
  );
}

