import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";

export const metadata: Metadata = {
  title: "Med Spa Near Ford's Colony | Williamsburg Med Spa",
  description:
    "Ford's Colony residents can access PRP therapies, fillers, and aesthetic treatments at nearby Williamsburg Med Spa.",
  alternates: { canonical: "/locations/fords-colony-va" },
};

export default function FordsColonyPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Ford's Colony"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Ford&apos;s Colony</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          A nearby option for regenerative PRP and aesthetic care.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          Living in Ford&apos;s Colony, you&apos;re only a short drive from Williamsburg Med Spa. Our clinic offers regenerative
          PRP therapies, fillers, and aesthetic treatments with a focus on natural‑looking results and clear, honest
          guidance.
        </p>
        <h2>Getting Here</h2>
        <p>
          Take local routes toward Route 199 and Monticello Avenue, then continue to Powhatan Parkway. You&apos;ll find
          on‑site parking close to our entrance.
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
