import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Near Yorktown, VA | Fillers, PRP & Ear Piercing",
  description:
    "Visit Williamsburg Med Spa from Yorktown for Xeomin, dermal fillers, PRP therapies, hyperhidrosis care, and Blomdahl medical ear piercing.",
  canonical: "/locations/yorktown-va",
});

export default function YorktownPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Yorktown"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Yorktown</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          A short drive over the Colonial Parkway or I‑64 to Williamsburg Med Spa.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          If you’re in Yorktown and looking for a medical spa that emphasizes safety, education, and subtle, natural
          outcomes, we’d love to meet you. Our clinic combines regenerative PRP therapies with modern aesthetic
          treatments and clear aftercare guidance so you can feel confident every step of the way.
        </p>
        <p>
          We welcome patients seeking joint support with PRP, collagen‑supporting facial treatments, or balanced filler
          enhancements. Expect a friendly consult, honest expectations, and personalized planning — never a one‑size‑fits‑all approach.
        </p>
        <p>
          Yorktown families also visit for Blomdahl medical ear piercing when they want hypoallergenic starter jewelry,
          sterile disposable piercing cassettes, and an appointment-based alternative to a rushed retail piercing visit.
        </p>
        <h2>Getting Here</h2>
        <p>
          From Yorktown, many patients take the Colonial Parkway toward Williamsburg or I‑64 to Route 199. Continue to
          Monticello Avenue toward New Town, then turn onto Powhatan Parkway. Parking is available on‑site.
        </p>
        <h2>Popular Services for Yorktown Patients</h2>
        <ul>
          <li>PRP for Joints — conservative, regenerative option for common joint issues</li>
          <li>PRP Facial — glow and texture support with your body’s own platelets</li>
          <li>Filler — refined, natural‑looking results tailored to your features</li>
          <li>Blomdahl Ear Piercing — medical‑grade, hypoallergenic system</li>
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
          <Link href="/procedures/blomdahl-ear-piercing/near/yorktown-va">Ear Piercing Near Yorktown</Link>
        </Button>
        <DirectionsButton size="sm" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2707} longitude={-76.7075} />
      </div>
    </div>
  );
}
