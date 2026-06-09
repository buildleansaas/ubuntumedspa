import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Near Norge, VA | Botox, Fillers, PRP & Piercing",
  description:
    "Norge residents can reach Williamsburg Med Spa for Botox, Xeomin, dermal fillers, PRP therapies, hyperhidrosis care, and Blomdahl medical ear piercing.",
  canonical: "/locations/norge-va",
});

const serviceLinks = [
  { label: "Botox treatment planning", href: "/procedures/botox", copy: "For expression lines and provider-led wrinkle relaxer planning." },
  { label: "Dermal filler treatment planning", href: "/procedures/filler", copy: "For volume, lips, cheeks, and facial balance goals." },
  { label: "Xeomin treatment planning", href: "/procedures/xeomin", copy: "For patients comparing wrinkle relaxer choices." },
  { label: "Medical ear piercing near Norge", href: "/procedures/blomdahl-ear-piercing/near/norge-va", copy: "For sterile Blomdahl piercing for children or adults." },
];

export default function NorgePage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Norge"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Norge, VA</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Close, practical aesthetic and medical ear piercing care for Norge patients traveling down Richmond Road.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          From Norge, Williamsburg Med Spa is a nearby option when you are searching for a med spa near me but want a clinical setting, clear explanation, and natural-looking aesthetic planning.
        </p>
        <p>
          Patients visit for Botox and Xeomin questions, dermal filler planning, PRP therapies, hyperhidrosis care, and Blomdahl medical ear piercing. The goal is to make the visit understandable before anything is done.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-base-content/10 bg-base-100 p-5 md:p-7">
        <h2 className="text-2xl font-light">Quick read for Norge patients</h2>
        <ul className="mt-4 grid gap-3 text-sm text-base-content/75 md:grid-cols-3">
          <li>Useful for Norge and Croaker patients who want a nearby Williamsburg med spa option.</li>
          <li>Treatment planning stays conservative, with risks, aftercare, and expected results explained clearly.</li>
          <li>Piercing visits can include starter jewelry, placement, sensitivity history, and cleaning instructions.</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-light">Procedure-specific local starting points</h2>
        <p className="mt-2 text-sm text-base-content/65">
          If you searched for a med spa near me, start with the treatment family that matches your goal, then schedule a consultation if you want help choosing.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {serviceLinks.map((link) => (
            <Link key={link.label} href={link.href} className="rounded-2xl border border-base-content/10 bg-base-100 p-4 transition hover:border-primary/40 hover:bg-primary/5">
              <span className="block text-sm font-semibold text-base-content">{link.label}</span>
              <span className="mt-1 block text-sm text-base-content/65">{link.copy}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="prose prose-neutral max-w-none text-base-content/90">
          <h2>Getting here from Norge</h2>
          <p>
            Head toward Williamsburg via Richmond Road, then connect to Route 199 and Monticello Avenue to reach Powhatan Parkway. Lightfoot and New Town errands can pair with the trip if the appointment timing still feels calm.
          </p>
          <h2>How to plan the visit</h2>
          <ul>
            <li>Bring any allergy or sensitivity history before an ear piercing appointment.</li>
            <li>If you are considering injectables, share prior treatment dates and what you liked or disliked.</li>
            <li>Do not treat the page as a diagnosis. Use it to choose the right consultation starting point.</li>
          </ul>
        </div>
        <aside className="rounded-3xl border border-base-content/10 bg-base-100 p-5">
          <h2 className="text-xl font-light">Nearby areas this page helps</h2>
          <ul className="mt-3 space-y-2 text-sm text-base-content/70">
            <li>Norge</li>
            <li>Croaker</li>
            <li>Lightfoot</li>
            <li>Richmond Road corridor</li>
          </ul>
        </aside>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="sm"><Link href="/consult">Book a Consultation</Link></Button>
        <Button asChild size="sm" variant="secondary"><Link href="/locations/williamsburg-va">Williamsburg Location Details</Link></Button>
        <DirectionsButton size="sm" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2707} longitude={-76.7075} />
      </div>
    </div>
  );
}
