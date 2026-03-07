import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";

export const metadata: Metadata = {
  title: "Med Spa Near Newport News | Williamsburg Med Spa",
  description:
    "Visit Williamsburg Med Spa from Newport News for PRP therapies, fillers, and supportive aesthetic care focused on comfort and clarity.",
  alternates: { canonical: "/locations/newport-news-va" },
};

export default function NewportNewsPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Newport News"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Newport News</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Straightforward drive to Williamsburg for regenerative PRP, fillers, and gentle, evidence‑based care.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          Many Newport News patients visit us for conservative, regenerative options and approachable aesthetic care. We
          focus on clear explanations, realistic timelines, and natural‑looking results. Your consultation is a space to
          ask questions, explore options, and decide what feels right for you.
        </p>
        <p>
          From PRP for joint concerns to collagen‑supporting facial treatments and refined filler work, we provide
          thoughtful planning and attentive follow‑up. You’ll find on‑site parking and a welcoming atmosphere designed to
          make your visit easy and comfortable.
        </p>
        <h2>Getting Here</h2>
        <p>
          Most patients take I‑64 to Route 199, then head toward New Town via Monticello Avenue. Turn onto Powhatan
          Parkway; our entrance is near the main lot.
        </p>
        <h2>Popular Services for Newport News Patients</h2>
        <ul>
          <li>PRP for Joints — support for common knee and shoulder complaints</li>
          <li>PRP Facial — texture, tone, and glow with a regenerative approach</li>
          <li>Filler — balanced feature enhancement with subtle results</li>
          <li>Blohmdahl Ear Piercing — sterile, gentle, hypoallergenic system</li>
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="sm">
          <Link href="/consult">Book a Consultation</Link>
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link href="/locations/williamsburg-va">Williamsburg Location Details</Link>
        </Button>
        <DirectionsButton size="sm" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2707} longitude={-76.7075} />
      </div>
    </div>
  );
}
