import type { Metadata } from "next";
import NAP from "components/nap";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";
import { TreatmentRoomPhotos } from "components/clinic-photos";
import HomeOwnerLink, { XeominHubLink } from "components/home-owner-link";
import { AFTER_HEADER, BandCta, BUTTON_ROW, BUTTON_ROW_CENTER, CARD, CARD_GRID, CARD_GRID_2, CARD_TITLE, H1, INTRO, Section, SectionHeader } from "components/layout";

export const metadata: Metadata = buildPageMetadata({
  title: "Medical Spa in Williamsburg, VA | Hours, Directions & Services",
  description:
    "Hours and directions for Williamsburg Med Spa, 3900 Powhatan Parkway: Xeomin® (a Botox® alternative), PRP, hyperhidrosis care, and Blomdahl ear piercing.",
  canonical: "/locations/williamsburg-va",
});

export default function WilliamsburgLocationPage() {
  return (
    <>
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Williamsburg, VA"]} />
      <StructuredData
        type="FAQ"
        faqs={[
          {
            question: "Where is Williamsburg Med Spa located?",
            answer:
              "Our clinic is located at 3900 Powhatan Parkway, Williamsburg, VA 23188, with on-site parking directly outside the entrance.",
          },
          {
            question: "Where do I park?",
            answer:
              "Free on-site parking is available directly in front of the clinic entrance on Powhatan Parkway.",
          },
          {
            question: "What are your clinic hours?",
            answer:
              "Current hours are Monday through Friday from 6:00pm to 8:00pm and Saturday through Sunday from 10:00am to 6:00pm.",
          },
          {
            question: "Do you accept walk-ins?",
            answer:
              "Please book a consultation online or call ahead so we can prepare the right time and resources for your visit.",
          },
          {
            question: "What areas do you serve?",
            answer:
              "We serve Williamsburg, James City County, Yorktown, Newport News, Toano, Norge, Lightfoot, New Town, Kingsmill, and Ford’s Colony.",
          },
        ]}
      />

      <Section tight labelledBy="williamsburg-heading">
        <div className="max-w-3xl">
          <h1 id="williamsburg-heading" className={H1}>Medical Spa in Williamsburg, VA</h1>
          <p className={`mt-6 ${INTRO}`}>
            Use this page for clinic hours, parking, directions, and nearby neighborhoods served. Patients visit Jenny
            Brady for{" "}
            <Link href="/procedures/xeomin" className="link link-primary">
              Xeomin
            </Link>{" "}
            (our wrinkle relaxer and a Botox® alternative), PRP treatments, hyperhidrosis care, OH-Shot services, and{" "}
            <Link href="/procedures/blomdahl-ear-piercing" className="link link-primary">
              nurse-led Blomdahl medical ear piercing
            </Link>{" "}
            near New Town, William & Mary, and James City County.
          </p>
        </div>
      </Section>

      <Section label="Clinic address, phone, hours and map">
        <NAP
          name="Williamsburg Med Spa"
          addressLines={["3900 Powhatan Parkway", "Williamsburg, VA 23188"]}
          phone={"+1 (804) 738-9483"}
          hours={["Mon–Fri 6:00pm–8:00pm", "Sat–Sun 10:00am–6:00pm"]}
          showMap={true}
          mapsQuery="3900 Powhatan Parkway, Williamsburg, VA 23188"
          latitude={37.2729739}
          longitude={-76.7635887}
        />
      </Section>

      {/* The shared photo block brings its own <section> and heading; the band supplies the spacing and heading scale. */}
      <Section className="[&>section]:py-0 md:[&_h2]:text-[2.75rem]">
        <TreatmentRoomPhotos />
      </Section>

      <Section labelledBy="parking-directions">
        <SectionHeader id="parking-directions" title="Parking & Directions" />
        <div className="mt-6 max-w-[62ch] space-y-4 text-lg leading-relaxed text-base-content/80">
          <p>
            We&apos;re located near New Town and William & Mary with convenient on-site parking. From Richmond Road, take
            Monticello Avenue toward New Town, then turn onto Powhatan Parkway. Our entrance is clearly marked, and the
            main lot sits directly outside the clinic.
          </p>
          <p>If you need accessibility assistance, call when you arrive and we&apos;ll help you into the clinic.</p>
        </div>
      </Section>

      <Section labelledBy="med-spa-near-me">
        <SectionHeader
          id="med-spa-near-me"
          title="If You Searched “Med Spa Near Me” in Williamsburg"
          intro={
            <>
              Start with the specific treatment question, not a generic spa menu. Jenny Brady sees patients for
              consultation-led Xeomin, PRP treatments, hyperhidrosis care, OH-Shot consultations, and nurse-led Blomdahl
              medical ear piercing at the Williamsburg clinic.
            </>
          }
        />
        <div className={`${AFTER_HEADER} ${CARD_GRID}`}>
          <div className={CARD}>
            <h3 className={CARD_TITLE}>Injectables</h3>
            <p className="mt-3 text-base leading-relaxed text-base-content/75">Xeomin is our wrinkle relaxer. If you searched for Botox, compare Xeomin by movement lines, dosing, onset, and natural-looking goals. We do not offer Botox® brand.</p>
          </div>
          <div className={CARD}>
            <h3 className={CARD_TITLE}>Regenerative care</h3>
            <p className="mt-3 text-base leading-relaxed text-base-content/75">Use PRP pages to understand skin, hair, and joint questions before deciding whether to book.</p>
          </div>
          <div className={CARD}>
            <h3 className={CARD_TITLE}>Family-friendly piercing</h3>
            <p className="mt-3 text-base leading-relaxed text-base-content/75">Review Blomdahl medical ear piercing for children, teens, adults, sensitive ears, and aftercare.</p>
          </div>
        </div>
      </Section>

      <Section labelledBy="popular-treatment-pages">
        <SectionHeader
          id="popular-treatment-pages"
          title="Popular Treatment Pages"
          intro="Review the services Williamsburg patients most often ask about before scheduling with Jenny."
        />
        <div className={`${AFTER_HEADER} ${BUTTON_ROW}`}>
          <Button asChild size="lg">
            <Link href="/consult">Book a Consultation</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures/botox">Botox alternative in Williamsburg</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures/xeomin">Xeomin in Williamsburg</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures/prp-facial">PRP Facial</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures/prp-hair-restoration">PRP Hair Restoration</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures/oh-shot">OH-Shot</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures/blomdahl-ear-piercing">Medical Ear Piercing</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures/blomdahl-ear-piercing/near/williamsburg-va">Williamsburg piercing visit notes</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures/hyperhidrosis-treatment">Hyperhidrosis Treatment</Link>
          </Button>
        </div>
      </Section>

      <Section labelledBy="piercing-visits">
        <SectionHeader
          id="piercing-visits"
          title="Piercing visits start on the Blomdahl page"
          intro={
            <>
              Families who find the clinic while searching for ear piercing in Williamsburg can start with the main
              Blomdahl service page. Jenny Brady, MSN, RN, CPNP, PMHS uses sterile single-use cassettes and hypoallergenic
              starter earrings for children, teens, and adults who want a more clinical appointment than mall-style
              piercing.
            </>
          }
        />
        <div className={`${AFTER_HEADER} ${BUTTON_ROW}`}>
          <Button asChild size="lg">
            <Link href="/procedures/blomdahl-ear-piercing">Blomdahl Ear Piercing</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures/blomdahl-ear-piercing/for/children">Infant &amp; Kids Ear Piercing</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures/blomdahl-ear-piercing#pricing">Ear Piercing Cost</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/blog/medical-ear-piercing-vs-mall-piercing">Medical vs. Mall Piercing</Link>
          </Button>
        </div>
      </Section>

      <Section labelledBy="before-your-visit">
        <SectionHeader id="before-your-visit" title="Before Your Visit" />
        <div className={`${AFTER_HEADER} ${CARD_GRID_2}`}>
          <div className={`${CARD} text-lg leading-relaxed text-base-content/80`}>
            Plan to arrive a few minutes early so we can review your goals, medical history, and any questions before the
            appointment starts.
          </div>
          <div className={`${CARD} text-lg leading-relaxed text-base-content/80`}>
            For ear-piercing visits or family appointments, feel free to call ahead if you want help choosing timing,
            aftercare supplies, or what to bring.
          </div>
        </div>
      </Section>

      <Section labelledBy="neighborhoods">
        <SectionHeader
          id="neighborhoods"
          title="Neighborhoods We Serve"
          intro={
            <>
              Williamsburg, James City County, Yorktown, Newport News, Toano, Norge, Lightfoot, New Town, Kingsmill,
              Ford&apos;s Colony
            </>
          }
        />
        <div className="mt-6 max-w-[62ch] space-y-3 text-base leading-relaxed text-base-content/75">
          <p>
            If you searched for a medical spa near Williamsburg, VA, the most relevant starting points are{" "}
            <Link href="/procedures/xeomin" className="link link-primary">
              Xeomin
            </Link>
            , with support for{" "}
            <Link href="/procedures/blomdahl-ear-piercing" className="link link-primary">
              Blomdahl ear piercing
            </Link>
            .
          </p>
          <p>
            View all service areas on our{" "}
            <Link href="/locations" className="link link-primary">
              locations page
            </Link>
            .
          </p>
        </div>
        <HomeOwnerLink className="mt-8" />
        <XeominHubLink className="mt-2" />
      </Section>

      <BandCta headingId="ready-to-book" title="Ready to Book?">
        <p className={`mx-auto mt-4 ${INTRO}`}>
          Book a consultation if you want help choosing the right treatment, or open directions if you already have an
          appointment scheduled.
        </p>
        <div className={`mt-8 ${BUTTON_ROW_CENTER}`}>
          <Button asChild size="lg">
            <Link href="/consult">Book a Consultation</Link>
          </Button>
          <DirectionsButton address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2729739} longitude={-76.7635887} variant="outline" size="lg" />
        </div>
      </BandCta>
    </>
  );
}
