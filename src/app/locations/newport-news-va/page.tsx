import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";
import { cardPriceLabel, formatUsdShort } from "lib/price";
import HomeOwnerLink from "components/home-owner-link";

const xeominCash = formatUsdShort(25000);
const xeominCard = cardPriceLabel(25000);

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Newport News | Xeomin, a Botox Alternative",
  description:
    `Med spa Newport News patients typically drive 25–35 minutes to our Williamsburg clinic for Xeomin® (a Botox® alternative, ${formatUsdShort(25000)} cash), PRP, and ear piercing.`,
  canonical: "/locations/newport-news-va",
});

const serviceLinks = [
  { href: "/procedures/xeomin/near/newport-news-va", label: "Xeomin near Newport News", note: "Our wrinkle relaxer for frown lines, forehead lines, and crow's feet, with a natural, measured plan." },
  { href: "/procedures/blomdahl-ear-piercing", label: "Blomdahl ear piercing", note: "Sterile single-use cassettes and hypoallergenic starter earrings at the Williamsburg clinic." },
  { href: "/procedures/blomdahl-ear-piercing/for/children", label: "Infant and kids ear piercing", note: "For parents planning a baby's or child's first earrings." },
  { href: "/procedures/blomdahl-ear-piercing/near/newport-news-va", label: "Newport News visit notes", note: "Driving notes for a Williamsburg piercing appointment." },
];

const faqs = [
  {
    question: "Does Williamsburg Med Spa serve patients from Newport News?",
    answer:
      "Yes. Newport News patients visit our appointment-based clinic at 3900 Powhatan Parkway in Williamsburg for injectables, PRP therapies, hyperhidrosis treatment, and medical ear piercing.",
  },
  {
    question: "Do you offer Botox for Newport News patients?",
    answer:
      "No. Williamsburg Med Spa uses Xeomin, a wrinkle relaxer in the same category as Botox, and does not offer Botox® brand. Units are not interchangeable, so your consultation compares the full Xeomin plan with any prior treatment you have had.",
  },
  {
    question: "Where is the appointment located?",
    answer:
      "Appointments take place at Williamsburg Med Spa, 3900 Powhatan Parkway, Williamsburg, VA 23188. The clinic is reached from Newport News by taking I-64 west toward Route 199 and New Town.",
  },
  {
    question: "Can I book a consultation before choosing a treatment?",
    answer:
      "Yes. You can book a consultation first, explain what you want to improve, and review the appropriate treatment options before making a treatment decision.",
  },
];

export default function NewportNewsPage() {
  return (
    <div className="max-w-xl md:max-w-6xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Newport News"]} />
      <StructuredData type="FAQ" faqs={faqs} />
      <header className="mb-10 max-w-3xl text-left md:mb-14">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Newport News, at Our Williamsburg Clinic</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-3">
          There is no Newport News street address. Xeomin, PRP, and ear-piercing visits are at Williamsburg Med Spa,
          3900 Powhatan Parkway, Williamsburg, VA 23188. Take I-64 west toward Route 199 and New Town.
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
            Common visit goals include softening expression lines with Xeomin, asking about PRP for joints or skin, treating excessive sweating, and choosing a more clinical ear
            piercing appointment for a child or adult with sensitive ears.
          </p>
          <div className="not-prose mt-5 flex flex-wrap items-center gap-3">
            <Button asChild size="sm"><Link href="/consult">Book a Consultation</Link></Button>
            <Link href="#compare-treatments" className="text-sm font-medium text-primary hover:underline">
              Compare treatment options
            </Link>
          </div>
        </div>
        <aside className="border border-base-300 bg-base-100 p-5">
          <h2 className="text-xl font-light mb-3">Plan your visit</h2>
          <dl className="space-y-3 text-sm text-base-content/75">
            <div>
              <dt className="font-medium text-base-content">Best for</dt>
              <dd>Newport News patients who want a provider-led consultation and a measured treatment plan.</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content">Common goals</dt>
              <dd>Expression lines, facial balance, PRP support, excessive sweating, and medical ear piercing.</dd>
            </div>
            <div>
              <dt className="font-medium text-base-content">Visit location</dt>
              <dd>Take I-64 toward Route 199, then continue toward New Town and Powhatan Parkway in Williamsburg.</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-light mb-4">Newport News Patients Usually Start Here</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {serviceLinks.map((service) => (
            <Link key={service.href} href={service.href} className="border border-base-300 p-5 transition hover:border-primary/40 hover:bg-base-200/40">
              <span className="font-medium text-base-content">{service.label}</span>
              <p className="mt-2 text-sm text-base-content/70">{service.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="wrinkle-relaxer" className="mb-10 md:mb-12 border border-base-300 p-6 md:p-8 scroll-mt-24">
        <p className="text-sm uppercase tracking-[0.18em] text-primary mb-2">Looking for Botox near Newport News?</p>
        <h2 className="text-2xl md:text-3xl font-light mb-3">Xeomin®, our wrinkle relaxer, 25–35 minutes away</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-3">
          Williamsburg Med Spa does not offer Botox® brand. We use Xeomin®, a wrinkle relaxer in the same treatment
          category, for frown lines, forehead lines, and crow&apos;s feet. It is {xeominCash} cash per credit block
          ({xeominCard} card/online). The clinic on Powhatan Parkway is typically a 25–35 minute drive from Newport News.
        </p>
        <p className="text-base text-base-content/75">
          Read about our{" "}
          <Link href="/procedures/botox" className="text-primary hover:underline">
            Botox alternative in Williamsburg
          </Link>
          , including how Xeomin compares and why units are not interchangeable.
        </p>
      </section>

      <section id="compare-treatments" className="mb-10 md:mb-12 border-y border-base-300 py-8 md:py-10 scroll-mt-24">
        <div className="max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-light mb-3">Xeomin or PRP?</h2>
          <p className="text-base md:text-lg text-base-content/80 mb-6">
            The right choice depends on what you want to change. Xeomin, our wrinkle relaxer, addresses lines caused by
            repeated muscle movement. PRP treatments focus on skin quality, texture, and tone. Your consultation can focus on one option or
            compare both before you decide.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">For movement-related lines</h3>
              <p className="text-base-content/75 mb-2">
                Start with <Link href="/procedures/xeomin" className="text-primary hover:underline">Xeomin</Link> if your
                concern is tied to facial movement, such as frown lines or forehead lines.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">For skin texture and tone</h3>
              <p className="text-base-content/75 mb-2">
                Start with the <Link href="/procedures/prp-facial" className="text-primary hover:underline">PRP facial</Link> or{" "}
                <Link href="/procedures/microneedling-with-prp" className="text-primary hover:underline">microneedling with PRP</Link>{" "}
                if your concern is dull skin, uneven texture, or fine lines rather than movement.
              </p>
            </div>
          </div>
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
        <div className="border border-base-300 p-5">
          <h2 className="text-2xl md:text-3xl font-light mb-3">Why Make the Trip?</h2>
          <ul className="space-y-2 text-base-content/80">
            <li>Talk through your goals with Jenny Brady before choosing a treatment.</li>
            <li>Receive a conservative plan focused on natural-looking changes.</li>
            <li>Leave with clear expectations, aftercare guidance, and follow-up steps.</li>
          </ul>
        </div>
      </section>

      <section className="mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-light mb-4">Planning Your Visit from Newport News</h2>
        <div className="divide-y divide-base-300 border-y border-base-300">
          {faqs.map((faq) => (
            <div key={faq.question} className="py-5">
              <h3 className="text-lg font-medium text-base-content">{faq.question}</h3>
              <p className="mt-2 max-w-4xl text-base-content/75">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 md:mb-12 border border-base-300 p-6 md:p-8">
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
      <HomeOwnerLink className="mb-10" />
    </div>
  );
}
