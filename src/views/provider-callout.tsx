import Image from "next/image";
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
      <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-24" aria-labelledby="provider-callout-heading">
        <div className="grid items-start gap-8 md:grid-cols-[minmax(11rem,16rem)_minmax(0,1fr)] md:gap-12 lg:gap-16">
          <figure className="mx-auto w-full max-w-[16rem] md:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden border border-base-300 bg-base-200">
              <Image
                src="/jenny.jpg"
                alt="Our aesthetic nurse practitioner"
                fill
                sizes="(max-width: 768px) 70vw, 256px"
                className="object-cover object-[center_18%]"
              />
            </div>
          </figure>
          <div className="max-w-2xl">
            <p className="eyebrow">Provider</p>
            <h2
              id="provider-callout-heading"
              className="mt-3 text-4xl leading-[1.12] tracking-tight text-base-content md:text-5xl"
            >
              Meet Our Aesthetic Nurse Practitioner
            </h2>
            <p className="mt-4 text-lg text-base-content/85">Jenny Coleman, MSN, RN, CPNP, PMHS</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Jenny Coleman credentials and certifications">
              {CREDENTIALS.map((credential) => (
                <li key={credential} className="border border-base-300 px-3 py-1 text-sm text-base-content/85">
                  {credential}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-base-content/85 md:text-lg">
              With 26 years in medicine and six years dedicated to aesthetics, Jenny blends primary care and mental
              health expertise with a holistic, patient-first approach. She combines regenerative PRP therapies,
              advanced injection techniques, and practical wellness counseling to help you look and feel your best,
              naturally.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
