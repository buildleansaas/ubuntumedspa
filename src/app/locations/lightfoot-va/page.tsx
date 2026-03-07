import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";

export const metadata: Metadata = {
  title: "Med Spa Near Lightfoot | Williamsburg Med Spa",
  description:
    "Lightfoot and upper Williamsburg residents can visit Williamsburg Med Spa for PRP therapies, fillers, and aesthetic care.",
  alternates: { canonical: "/locations/lightfoot-va" },
};

export default function LightfootPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Lightfoot"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Lightfoot</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Easy access from Lightfoot shopping and residential areas to our Williamsburg clinic.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          If you&apos;re in Lightfoot, our clinic is a short drive toward New Town. We offer regenerative PRP therapies,
          fillers, and aesthetic treatments with a focus on comfort, safety, and natural‑looking outcomes.
        </p>
        <h2>Getting Here</h2>
        <p>
          Travel toward Williamsburg via Route 60 or I‑64, connect to Route 199, then take Monticello Avenue toward New
          Town and turn onto Powhatan Parkway. On‑site parking is available near the entrance.
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
