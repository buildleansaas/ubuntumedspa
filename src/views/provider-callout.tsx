import Image from "next/image";
import { INTRO, SPLIT, Section, SectionHeader } from "components/layout";
import StructuredData from "components/structured-data";

const CREDENTIALS = [
  "Master of Science in Nursing",
  "Registered Nurse",
  "Certified Pediatric Nurse Practitioner",
  "Pediatric Mental Health Specialist",
  "CMA-certified OH-Shot provider",
  "Certified Blomdahl provider",
] as const;

export default function ProviderCallout() {
  return (
    <>
      <StructuredData type="Person" />
      <Section labelledBy="provider-callout-heading">
        <div className={`${SPLIT} items-center`}>
          <div className="lg:col-span-7">
            <SectionHeader id="provider-callout-heading" eyebrow="Provider" title="Meet Our Aesthetic Nurse Practitioner" />
            <p className="mt-4 text-lg text-base-content/85">Jenny Brady, MSN, RN, CPNP, PMHS</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Jenny Brady credentials and certifications">
              {CREDENTIALS.map((credential) => (
                <li key={credential} className="rounded-full border border-base-300 px-3 py-1 text-sm text-base-content/75">
                  {credential}
                </li>
              ))}
            </ul>
            <p className={`mt-6 ${INTRO}`}>
              With 26 years in medicine and six years dedicated to aesthetics, Jenny blends primary care and mental
              health expertise with a holistic, patient-first approach. She combines regenerative PRP therapies,
              advanced injection techniques, and practical wellness counseling to help you look and feel your best,
              naturally.
            </p>
          </div>
          <figure className="w-full max-w-xs lg:col-span-4 lg:col-start-9 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-base-200">
              <Image
                src="/jenny.jpg"
                alt="Our aesthetic nurse practitioner"
                fill
                sizes="(max-width: 1024px) 320px, 400px"
                className="object-cover object-[center_18%]"
              />
            </div>
          </figure>
        </div>
      </Section>
    </>
  );
}
