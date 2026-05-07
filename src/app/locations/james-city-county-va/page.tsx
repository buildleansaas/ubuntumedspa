import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Medical Spa Serving James City County | Fillers, PRP & Piercing",
  description:
    "A short drive from James City County: dermal fillers, Botox, Xeomin, PRP therapies, and Blomdahl medical ear piercing with Jenny Coleman.",
  canonical: "/locations/james-city-county-va",
});

export default function JamesCityCountyPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "James City County"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Serving James City County</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Conveniently located near New Town and William & Mary — minutes from James City County.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          Looking for a trusted medical spa close to home? Williamsburg Med Spa blends regenerative PRP therapies, dermal
          fillers, Botox, Xeomin, Blomdahl medical ear piercing, and advanced aesthetic treatments with a warm,
          patient-first approach. Our clinic is a quick hop from
          neighborhoods across James City County — including Norge, Toano, Lightfoot, and Greensprings — with easy access
          via Monticello Avenue and Route 199.
        </p>
        <p>
          Patients choose us for thoughtful consultations, natural‑looking results, and clear explanations of risks,
          benefits, and expected timelines. Whether you’re exploring PRP for joint pain, improving skin texture with a PRP
          Facial, or enhancing features with filler, we tailor every plan to your goals and comfort level.
        </p>
        <p>
          When you arrive, you’ll find convenient on‑site parking and a calm, welcoming space. If you have accessibility
          needs or prefer a quieter time of day, let us know when booking — we’re happy to accommodate.
        </p>
        <h2>Getting Here</h2>
        <p>
          From most parts of James City County, take Route 199 to Monticello Avenue and head toward New Town. Turn onto
          Powhatan Parkway and follow signs for Williamsburg Med Spa. Look for our entrance near the main parking area.
        </p>
        <h2>Popular Services from James City County Patients</h2>
        <ul>
          <li>PRP for Joints — knees, shoulders, and soft‑tissue concerns</li>
          <li>PRP Facial — support collagen and smoother skin texture</li>
          <li>Filler — natural contouring for cheeks, lips, and under‑eyes</li>
          <li>Blomdahl Medical Ear Piercing — sterile, gentle, hypoallergenic</li>
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href="/consult">Book a Consultation</Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link href="/locations/williamsburg-va">Williamsburg Location Details</Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link href="/procedures/filler">Dermal Fillers</Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link href="/procedures/blomdahl-ear-piercing/near/james-city-county-va">Ear Piercing Near James City County</Link>
        </Button>
        <DirectionsButton size="sm" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2707} longitude={-76.7075} />
      </div>
    </div>
  );
}
