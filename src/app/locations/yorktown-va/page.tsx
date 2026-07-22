import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Near Yorktown, VA | Botox, Fillers, PRP & Piercing",
  description:
    "Visit Williamsburg Med Spa from Yorktown for Botox, Xeomin, fillers, PRP therapies, hyperhidrosis care, and Blomdahl medical ear piercing near Williamsburg.",
  canonical: "/locations/yorktown-va",
});

const serviceLinks = [
  {
    label: "Botox treatment planning",
    href: "/procedures/botox",
    copy: "For expression lines, dosing questions, and a consult-first plan.",
  },
  {
    label: "Dermal filler treatment planning",
    href: "/procedures/filler",
    copy: "For lips, cheeks, facial balance, and natural-looking volume support.",
  },
  {
    label: "Xeomin treatment planning",
    href: "/procedures/xeomin",
    copy: "For patients comparing wrinkle relaxer options.",
  },
  {
    label: "Medical ear piercing near Yorktown",
    href: "/procedures/blomdahl-ear-piercing/near/yorktown-va",
    copy: "For children and adults who want sterile Blomdahl piercing.",
  },
];

export default function YorktownPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Yorktown"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Yorktown, VA</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Consult-led aesthetic, regenerative, and medical ear piercing care for Yorktown patients willing to make a planned Williamsburg visit.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          If you are in Yorktown searching for a med spa near me, Williamsburg Med Spa is a nearby option for natural-looking injectables, PRP therapies, hyperhidrosis care, and appointment-based Blomdahl medical ear piercing.
        </p>
        <p>
          This page is built for Yorktown patients comparing a calm clinical visit against retail or rushed alternatives. Expect a provider-led consultation, clear discussion of risks and aftercare, and treatment planning based on your goals rather than a one-size-fits-all package.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-base-content/10 bg-base-100 p-5 md:p-7">
        <h2 className="text-2xl font-light">Quick read for Yorktown patients</h2>
        <ul className="mt-4 grid gap-3 text-sm text-base-content/75 md:grid-cols-3">
          <li>Best for Yorktown patients who want a quieter Williamsburg clinic visit rather than a high-volume retail setting.</li>
          <li>Useful starting point for Botox, Xeomin, dermal filler, PRP, hyperhidrosis, and medical ear piercing questions.</li>
          <li>Families planning first earrings can review sterile equipment, hypoallergenic starter jewelry, placement, and aftercare before booking.</li>
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
          <h2>Getting here from Yorktown</h2>
          <p>
            From Yorktown, many patients use the Colonial Parkway or I-64 toward Williamsburg, then connect through Route 199 and Monticello Avenue toward Powhatan Parkway. Build in traffic buffer around school, bridge, and commuter times.
          </p>
          <h2>How to plan the visit</h2>
          <ul>
            <li>Bring current medications, skin history, and prior injectable history if relevant.</li>
            <li>Avoid scheduling a first piercing immediately before swimming, sports, or a rushed evening.</li>
            <li>If you are unsure which treatment fits, book the consultation first rather than guessing from a menu.</li>
          </ul>
        </div>
        <aside className="rounded-3xl border border-base-content/10 bg-base-100 p-5">
          <h2 className="text-xl font-light">Nearby areas this page helps</h2>
          <ul className="mt-3 space-y-2 text-sm text-base-content/70">
            <li>Yorktown</li>
            <li>Tabb</li>
            <li>Grafton</li>
            <li>Lower Peninsula</li>
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
