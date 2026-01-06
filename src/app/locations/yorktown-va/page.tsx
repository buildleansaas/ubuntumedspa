import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";

export const metadata: Metadata = {
  title: "Med Spa Near Yorktown | Williamsburg Med Spa",
  description:
    "Minutes from Yorktown: PRP therapies, fillers, and aesthetic care with an emphasis on comfort and natural results.",
  alternates: { canonical: "/locations/yorktown-va" },
};

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
          <li>Blohmdahl Ear Piercing — medical‑grade, hypoallergenic system</li>
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link className="btn btn-sm btn-primary" href="/consult">Book a Consultation</Link>
        <Link className="btn btn-sm" href="/locations/williamsburg-va">Williamsburg Location Details</Link>
        <DirectionsButton className="btn btn-sm btn-secondary" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2707} longitude={-76.7075} />
      </div>
    </div>
  );
}
