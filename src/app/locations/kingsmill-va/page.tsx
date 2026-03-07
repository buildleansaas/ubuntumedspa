import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";

export const metadata: Metadata = {
  title: "Med Spa Near Kingsmill | Williamsburg Med Spa",
  description:
    "Kingsmill residents can visit Williamsburg Med Spa for PRP therapies, fillers, and supportive aesthetic care.",
  alternates: { canonical: "/locations/kingsmill-va" },
};

export default function KingsmillPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Kingsmill"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Kingsmill</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          A short trip from Kingsmill&apos;s riverfront community to our Williamsburg clinic.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          From Kingsmill, it&apos;s a quick drive to Williamsburg Med Spa for regenerative PRP treatments, aesthetic
          injections, and gentle, education‑focused care. Many patients appreciate being able to combine appointments
          with errands or time in nearby New Town.
        </p>
        <h2>Getting Here</h2>
        <p>
          Travel toward Route 199 and Monticello Avenue, then follow signs to Powhatan Parkway. Parking is available
          on‑site near our entrance.
        </p>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href="/consult">Book a Consultation</Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link href="/locations/williamsburg-va">Williamsburg Location Details</Link>
        </Button>
        <DirectionsButton
          size="sm"
          address="3900 Powhatan Parkway, Williamsburg, VA 23188"
          latitude={37.2707}
          longitude={-76.7075}
        />
      </div>
    </div>
  );
}
