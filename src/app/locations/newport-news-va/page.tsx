import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Near Newport News, VA | Botox, Fillers, PRP & Piercing",
  description:
    "Planning a med spa visit from Newport News? Compare Botox, Xeomin, dermal fillers, PRP, hyperhidrosis care, and medical ear piercing at Williamsburg Med Spa.",
  canonical: "/locations/newport-news-va",
});

const serviceLinks = [
  { href: "/procedures/botox", label: "Botox near Newport News", note: "Expression-line consultation with a natural, measured plan." },
  { href: "/procedures/xeomin", label: "Xeomin near Newport News", note: "A neuromodulator option for frown lines and movement-related concerns." },
  { href: "/procedures/filler", label: "Dermal fillers near Newport News", note: "Lips, cheeks, under-eyes, and balanced facial support." },
  { href: "/procedures/blomdahl-ear-piercing/near/newport-news-va", label: "Medical ear piercing near Newport News", note: "Sterile Blomdahl piercing for children, teens, and adults." },
];

export default function NewportNewsPage() {
  return (
    <div className="max-w-xl md:max-w-6xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Newport News"]} />
      <header className="mb-8 md:mb-10 text-center max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.22em] text-primary mb-3">Newport News service area</p>
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Newport News, VA</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-3">
          Visit Williamsburg Med Spa from Newport News for natural-looking injectables, PRP therapies, sweating
          treatment, and nurse-led medical ear piercing in a calm appointment-based clinic.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-[1.25fr_0.75fr] mb-10 md:mb-12">
        <div className="prose prose-neutral max-w-none text-base-content/90">
          <p>
            Patients searching for a med spa near Newport News often want two things: a real medical conversation before
            treatment and a clinic that feels worth the drive. Williamsburg Med Spa serves Newport News patients from our
            Williamsburg location with conservative planning, clear timelines, and careful follow-up.
          </p>
          <p>
            Common visit goals include softening expression lines with Botox or Xeomin, restoring balance with dermal
            filler, asking about PRP for joints or skin, treating excessive sweating, and choosing a more clinical ear
            piercing appointment for a child or adult with sensitive ears.
          </p>
        </div>
        <aside className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-xl font-light mb-3">Quick read</h2>
          <dl className="space-y-3 text-sm text-base-content/75">
            <div>
              <dt className="font-medium text-base-content">Best fit</dt>
              <dd>Newport News patients who want a medical med spa consultation without a rushed spa visit.</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content">Popular searches</dt>
              <dd>Botox near me, dermal fillers near Newport News, PRP treatment, and medical ear piercing.</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content">Drive note</dt>
              <dd>Most patients take I-64 toward Route 199, then continue toward New Town and Powhatan Parkway.</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-light mb-4">Newport News Patients Usually Start Here</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {serviceLinks.map((service) => (
            <Link key={service.href} href={service.href} className="rounded-2xl border border-base-300 p-5 transition hover:border-primary/50 hover:bg-base-200/40">
              <span className="font-medium text-base-content">{service.label}</span>
              <p className="mt-2 text-sm text-base-content/70">{service.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10 md:mb-12 grid gap-5 md:grid-cols-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-light mb-3">Getting Here from Newport News</h2>
          <ol className="space-y-3 text-base-content/80 list-decimal pl-5">
            <li>Take I-64 west toward Williamsburg.</li>
            <li>Use Route 199 toward Monticello Avenue and New Town.</li>
            <li>Turn onto Powhatan Parkway and look for the clinic entrance near the main lot.</li>
          </ol>
        </div>
        <div className="rounded-2xl border border-base-300 p-5">
          <h2 className="text-2xl md:text-3xl font-light mb-3">Why Make the Trip?</h2>
          <ul className="space-y-2 text-base-content/80">
            <li>Medical-style consultation with Jenny Coleman before treatment decisions.</li>
            <li>Procedure pages that explain candidacy, visit flow, and realistic outcomes.</li>
            <li>Easy internal links for comparing injectables, PRP, ear piercing, and sweating treatment.</li>
          </ul>
        </div>
      </section>

      <section className="mb-10 md:mb-12 rounded-2xl border border-base-300 p-5 md:p-6">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Local Planning Notes</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          If you are comparing Newport News options, start with the service that matches your question. Injectable visits
          are best planned around movement, volume, or skin texture. Ear-piercing visits are best planned around age,
          jewelry sensitivity, placement, and aftercare. PRP visits depend on the concern, medical history, and whether a
          specialist evaluation is needed first.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm"><Link href="/consult">Book a Consultation</Link></Button>
          <Button asChild size="sm" variant="secondary"><Link href="/locations/williamsburg-va">Williamsburg Location Details</Link></Button>
          <DirectionsButton size="sm" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2729739} longitude={-76.7635887} />
        </div>
      </section>
    </div>
  );
}
