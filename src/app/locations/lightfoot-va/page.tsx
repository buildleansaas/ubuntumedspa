import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Near Lightfoot, VA | Botox, Fillers, PRP & Piercing",
  description:
    "Lightfoot residents can visit Williamsburg Med Spa for Botox, Xeomin, dermal fillers, PRP therapies, hyperhidrosis care, and Blomdahl medical ear piercing.",
  canonical: "/locations/lightfoot-va",
});

const serviceLinks = [
  { label: "Botox treatment planning", href: "/procedures/botox", copy: "For expression lines and dosing questions." },
  { label: "Dermal filler treatment planning", href: "/procedures/filler", copy: "For natural-looking volume and facial balance questions." },
  { label: "Xeomin treatment planning", href: "/procedures/xeomin", copy: "For comparing wrinkle relaxer options." },
  { label: "Medical ear piercing near Lightfoot", href: "/procedures/blomdahl-ear-piercing/near/lightfoot-va", copy: "For sterile appointment-based piercing with Blomdahl jewelry." },
];

export default function LightfootPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Lightfoot"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Lightfoot, VA</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Nearby aesthetic, regenerative, and medical ear piercing care for Lightfoot patients.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          If you are in Lightfoot searching for a med spa near me, Williamsburg Med Spa is close enough for a planned consultation without turning the visit into a full-day trip.
        </p>
        <p>
          Lightfoot patients often compare options for wrinkle relaxers, filler, PRP, hyperhidrosis, and piercing while trying to avoid rushed decisions. We keep the visit consult-led, clear, and focused on whether the treatment fits your goals.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-base-content/10 bg-base-100 p-5 md:p-7">
        <h2 className="text-2xl font-light">Quick read for Lightfoot patients</h2>
        <ul className="mt-4 grid gap-3 text-sm text-base-content/75 md:grid-cols-3">
          <li>Close option for Lightfoot, New Town, Norge, and Richmond Road-area patients.</li>
          <li>Helpful if you want Botox, Xeomin, filler, PRP, hyperhidrosis care, or medical ear piercing near Williamsburg.</li>
          <li>Good fit for patients who want calm scheduling, aftercare guidance, and realistic expectations.</li>
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
          <h2>Getting here from Lightfoot</h2>
          <p>
            Travel toward Williamsburg via Route 60 or I-64, connect to Route 199, then take Monticello Avenue toward New Town and Powhatan Parkway. Lightfoot patients are close enough to schedule around errands, but piercing and injectable visits still deserve unhurried timing.
          </p>
          <h2>How to plan the visit</h2>
          <ul>
            <li>For younger children, schedule piercing before errands rather than after a long day.</li>
            <li>For injectables, avoid booking too close to a major event if swelling or bruising would matter.</li>
            <li>Use Williamsburg location details if you mainly need parking, address, and clinic logistics.</li>
          </ul>
        </div>
        <aside className="rounded-3xl border border-base-content/10 bg-base-100 p-5">
          <h2 className="text-xl font-light">Nearby areas this page helps</h2>
          <ul className="mt-3 space-y-2 text-sm text-base-content/70">
            <li>Lightfoot</li>
            <li>New Town</li>
            <li>Norge</li>
            <li>Richmond Road corridor</li>
          </ul>
        </aside>
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="sm"><Link href="/consult">Book a Consultation</Link></Button>
        <Button asChild size="sm" variant="secondary"><Link href="/locations/williamsburg-va">Williamsburg Location Details</Link></Button>
        <DirectionsButton size="sm" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2729739} longitude={-76.7635887} />
      </div>
    </div>
  );
}
