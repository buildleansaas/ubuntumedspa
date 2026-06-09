import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Near Toano, VA | Botox, Fillers, PRP & Piercing",
  description:
    "A short drive from Toano to Williamsburg Med Spa for Botox, Xeomin, dermal fillers, PRP therapies, hyperhidrosis care, and Blomdahl medical ear piercing.",
  canonical: "/locations/toano-va",
});

const serviceLinks = [
  { label: "Botox treatment planning", href: "/procedures/botox", copy: "For softening expression lines with conservative dosing guidance." },
  { label: "Dermal filler treatment planning", href: "/procedures/filler", copy: "For facial balance, lips, cheeks, and volume questions." },
  { label: "Xeomin treatment planning", href: "/procedures/xeomin", copy: "For wrinkle relaxer comparisons and treatment fit." },
  { label: "Medical ear piercing near Toano", href: "/procedures/blomdahl-ear-piercing/near/toano-va", copy: "For sterile Blomdahl piercing with hypoallergenic starter jewelry." },
];

export default function ToanoPage() {
  return (
    <div className="max-w-xl md:max-w-5xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Toano"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near Toano, VA</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          A practical Williamsburg med spa option for Toano and upper James City County patients.
        </p>
      </header>

      <section className="prose prose-neutral max-w-none text-base-content/90">
        <p>
          If you live in Toano or nearby upper James City County and want a med spa near me, Williamsburg Med Spa offers consult-led injectables, PRP therapies, hyperhidrosis care, and medical ear piercing without a rushed retail feel.
        </p>
        <p>
          Toano patients often visit when they want a clear plan before treatment. We talk through goals, fit, aftercare, expected downtime, and whether Botox, Xeomin, filler, PRP, or piercing is reasonable for the visit you are planning.
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-base-content/10 bg-base-100 p-5 md:p-7">
        <h2 className="text-2xl font-light">Quick read for Toano patients</h2>
        <ul className="mt-4 grid gap-3 text-sm text-base-content/75 md:grid-cols-3">
          <li>Convenient for Toano, Stonehouse, and upper James City County patients traveling toward Williamsburg.</li>
          <li>Good starting page for Botox, filler, Xeomin, PRP, hyperhidrosis, and medical ear piercing local intent.</li>
          <li>Appointment-based care gives families and aesthetic patients time for questions before treatment.</li>
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
          <h2>Getting here from Toano</h2>
          <p>
            From Toano, take I-64 or Richmond Road toward Williamsburg, then follow Route 199 to Monticello Avenue and Powhatan Parkway. Patients near Stonehouse or upper James City County should allow a little extra time for local turns.
          </p>
          <h2>How to plan the visit</h2>
          <ul>
            <li>Avoid stacking treatment immediately before major events if bruising, tenderness, or aftercare would be a problem.</li>
            <li>For children getting earrings, choose a time when the drive and appointment will not feel rushed.</li>
            <li>Use the procedure links above if you already know which treatment family you want to compare.</li>
          </ul>
        </div>
        <aside className="rounded-3xl border border-base-content/10 bg-base-100 p-5">
          <h2 className="text-xl font-light">Nearby areas this page helps</h2>
          <ul className="mt-3 space-y-2 text-sm text-base-content/70">
            <li>Toano</li>
            <li>Stonehouse</li>
            <li>Upper James City County</li>
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
