import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";

export const metadata: Metadata = {
  title: "Med Spa Near Norge | Williamsburg Med Spa",
  description:
    "Norge residents can reach Williamsburg Med Spa in minutes for PRP therapies, fillers, and personalized aesthetic care.",
  alternates: { canonical: "/locations/norge-va" },
};

export default function NorgePage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Norge"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Norge</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Close, convenient aesthetic and PRP care just down Richmond Road.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          From Norge, it&apos;s an easy trip to Williamsburg Med Spa for regenerative PRP treatments, skin rejuvenation, and
          filler services focused on natural results. Many local patients appreciate our clear communication, gentle
          approach, and emphasis on realistic expectations.
        </p>
        <h2>Getting Here</h2>
        <p>
          Head toward Williamsburg via Richmond Road, then connect to Route 199 and Monticello Avenue to reach
          Powhatan Parkway. Our clinic entrance is near the main parking lot.
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
