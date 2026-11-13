import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";
import { cardPriceLabel, formatUsdShort } from "lib/price";
import HomeOwnerLink from "components/home-owner-link";
import {
  AFTER_HEADER,
  BandCta,
  BUTTON_ROW,
  BUTTON_ROW_CENTER,
  CARD,
  CARD_GRID_2,
  CARD_LINK,
  CARD_TITLE,
  H1,
  H2,
  INTRO,
  ROW,
  ROWS,
  SPLIT,
  SPLIT_MEDIA,
  SPLIT_TEXT,
  Section,
  SectionHeader,
  Split,
} from "components/layout";

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
    <>
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Newport News"]} />
      <StructuredData type="FAQ" faqs={faqs} />

      <Section tight labelledBy="newport-news-heading">
        <Split
          align="start"
          text={
            <div>
              <h1 id="newport-news-heading" className={H1}>Med Spa Newport News, at Our Williamsburg Clinic</h1>
              <p className={`mt-6 ${INTRO}`}>
                There is no Newport News street address. Xeomin, PRP, and ear-piercing visits are at Williamsburg Med Spa,
                3900 Powhatan Parkway, Williamsburg, VA 23188. Take I-64 west toward Route 199 and New Town.
              </p>
              <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-relaxed text-base-content/80">
                <p>
                  Patients searching for a med spa near Newport News often want two things: a real medical conversation before
                  treatment and a clinic that feels worth the drive. Williamsburg Med Spa serves Newport News patients from our
                  Williamsburg location with conservative planning, clear timelines, and careful follow-up.
                </p>
                <p>
                  Common visit goals include softening expression lines with Xeomin, asking about PRP for joints or skin, treating excessive sweating, and choosing a more clinical ear
                  piercing appointment for a child or adult with sensitive ears.
                </p>
              </div>
              <div className={`mt-8 ${BUTTON_ROW}`}>
                <Button asChild size="lg"><Link href="/consult">Book a Consultation</Link></Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#compare-treatments">Compare treatment options</Link>
                </Button>
              </div>
            </div>
          }
          media={
            <aside className={CARD}>
              <h2 className={CARD_TITLE}>Plan your visit</h2>
              <dl className={`mt-4 ${ROWS}`}>
                <div className={`${ROW} py-4 sm:flex-col sm:items-start sm:gap-1`}>
                  <dt className="font-medium text-base-content">Best for</dt>
                  <dd className="text-base-content/75">Newport News patients who want a provider-led consultation and a measured treatment plan.</dd>
                </div>
                <div className={`${ROW} py-4 sm:flex-col sm:items-start sm:gap-1`}>
                  <dt className="font-medium text-base-content">Common goals</dt>
                  <dd className="text-base-content/75">Expression lines, facial balance, PRP support, excessive sweating, and medical ear piercing.</dd>
                </div>
                <div className={`${ROW} py-4 sm:flex-col sm:items-start sm:gap-1`}>
                  <dt className="font-medium text-base-content">Visit location</dt>
                  <dd className="text-base-content/75">Take I-64 toward Route 199, then continue toward New Town and Powhatan Parkway in Williamsburg.</dd>
                </div>
              </dl>
            </aside>
          }
        />
      </Section>

      <Section labelledBy="newport-news-start-here">
        <SectionHeader id="newport-news-start-here" title="Newport News Patients Usually Start Here" />
        <div className={`${AFTER_HEADER} ${CARD_GRID_2}`}>
          {serviceLinks.map((service) => (
            <Link key={service.href} href={service.href} className={`${CARD} ${CARD_LINK}`}>
              <span className={CARD_TITLE}>{service.label}</span>
              <p className="mt-3 text-base leading-relaxed text-base-content/75">{service.note}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="wrinkle-relaxer" labelledBy="wrinkle-relaxer-heading">
        <SectionHeader
          id="wrinkle-relaxer-heading"
          eyebrow="Looking for Botox near Newport News?"
          title="Xeomin®, our wrinkle relaxer, 25–35 minutes away"
        />
        <div className="mt-6 max-w-[62ch] space-y-4">
          <p className="text-lg leading-relaxed text-base-content/80">
            Williamsburg Med Spa does not offer Botox® brand. We use Xeomin®, a wrinkle relaxer in the same treatment
            category, for frown lines, forehead lines, and crow&apos;s feet. It is {xeominCash} cash per credit block
            ({xeominCard} card/online). The clinic on Powhatan Parkway is typically a 25–35 minute drive from Newport News.
          </p>
          <p className="text-base leading-relaxed text-base-content/75">
            Read about our{" "}
            <Link href="/procedures/botox" className="link link-primary">
              Botox alternative in Williamsburg
            </Link>
            , including how Xeomin compares and why units are not interchangeable.
          </p>
        </div>
      </Section>

      <Section id="compare-treatments" labelledBy="compare-treatments-heading">
        <SectionHeader
          id="compare-treatments-heading"
          title="Xeomin or PRP?"
          intro={
            <>
              The right choice depends on what you want to change. Xeomin, our wrinkle relaxer, addresses lines caused by
              repeated muscle movement. PRP treatments focus on skin quality, texture, and tone. Your consultation can focus
              on one option or compare both before you decide.
            </>
          }
        />
        <div className={`${AFTER_HEADER} ${CARD_GRID_2}`}>
          <div className={CARD}>
            <h3 className={CARD_TITLE}>For movement-related lines</h3>
            <p className="mt-3 text-base leading-relaxed text-base-content/75">
              Start with <Link href="/procedures/xeomin" className="link link-primary">Xeomin</Link> if your
              concern is tied to facial movement, such as frown lines or forehead lines.
            </p>
          </div>
          <div className={CARD}>
            <h3 className={CARD_TITLE}>For skin texture and tone</h3>
            <p className="mt-3 text-base leading-relaxed text-base-content/75">
              Start with the <Link href="/procedures/prp-facial" className="link link-primary">PRP facial</Link> or{" "}
              <Link href="/procedures/microneedling-with-prp" className="link link-primary">microneedling with PRP</Link>{" "}
              if your concern is dull skin, uneven texture, or fine lines rather than movement.
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="newport-news-getting-here">
        <Split
          ratio="even"
          align="start"
          text={
            <div>
              <h2 id="newport-news-getting-here" className={H2}>Getting Here from Newport News</h2>
              <ol className="mt-6 list-decimal pl-5 marker:text-base-content/50">
                <li className="border-b border-base-300 py-4 pl-2 first:border-t text-base text-base-content/80">Take I-64 west toward Williamsburg.</li>
                <li className="border-b border-base-300 py-4 pl-2 first:border-t text-base text-base-content/80">Use Route 199 toward Monticello Avenue and New Town.</li>
                <li className="border-b border-base-300 py-4 pl-2 first:border-t text-base text-base-content/80">Turn onto Powhatan Parkway and look for the clinic entrance near the main lot.</li>
              </ol>
            </div>
          }
          media={
            <div className={CARD}>
              <h2 className={CARD_TITLE}>Why Make the Trip?</h2>
              <ul className={`mt-4 ${ROWS}`}>
                <li className={`${ROW} py-4 text-base text-base-content/80`}>Talk through your goals with Jenny Brady before choosing a treatment.</li>
                <li className={`${ROW} py-4 text-base text-base-content/80`}>Receive a conservative plan focused on natural-looking changes.</li>
                <li className={`${ROW} py-4 text-base text-base-content/80`}>Leave with clear expectations, aftercare guidance, and follow-up steps.</li>
              </ul>
            </div>
          }
        />
      </Section>

      <Section labelledBy="newport-news-faqs">
        <SectionHeader id="newport-news-faqs" title="Planning Your Visit from Newport News" />
        <div className={`${AFTER_HEADER} ${ROWS}`}>
          {faqs.map((faq) => (
            <article key={faq.question} className={`${SPLIT} gap-y-3 border-b border-base-300 py-8`}>
              <h3 className={`font-display text-2xl leading-snug text-base-content ${SPLIT_TEXT.wide}`}>{faq.question}</h3>
              <p className={`max-w-[62ch] text-base leading-relaxed text-base-content/85 ${SPLIT_MEDIA.wide}`}>{faq.answer}</p>
            </article>
          ))}
        </div>
      </Section>

      <BandCta headingId="newport-news-notes" title="Local Planning Notes">
        <p className={`mx-auto mt-4 ${INTRO}`}>
          If you are comparing Newport News options, start with the service that matches your question. Injectable visits
          are best planned around movement, volume, or skin texture. Ear-piercing visits are best planned around age,
          jewelry sensitivity, placement, and aftercare. PRP visits depend on the concern, medical history, and whether a
          specialist evaluation is needed first.
        </p>
        <div className={`mt-8 ${BUTTON_ROW_CENTER}`}>
          <Button asChild size="lg"><Link href="/consult">Book a Consultation</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/locations/williamsburg-va">Williamsburg Location Details</Link></Button>
          <DirectionsButton size="lg" variant="outline" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2729739} longitude={-76.7635887} />
        </div>
        <HomeOwnerLink className="mt-8" />
      </BandCta>
    </>
  );
}
