import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";

export const metadata: Metadata = {
  title: "Med Spa Near New Town | Williamsburg Med Spa",
  description:
    "Walk or drive from New Town to Williamsburg Med Spa for PRP therapies, fillers, and aesthetic treatments.",
  alternates: { canonical: "/locations/new-town-va" },
};

export default function NewTownPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "New Town"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near New Town</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Just around the corner from New Town&apos;s shops and restaurants.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          Our clinic sits close to the heart of New Town, making it easy to plan treatment around work, errands, or a
          relaxed day out. We provide PRP therapies, fillers, and aesthetic services with a focus on clear education and
          a calm, supportive atmosphere.
        </p>
        <h2>Getting Here</h2>
        <p>
          From New Town, head toward Monticello Avenue and follow local signs to Powhatan Parkway. Look for the
          Williamsburg Med Spa entrance near the main parking area.
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
