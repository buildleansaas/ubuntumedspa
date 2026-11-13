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

// `merged`: the homepage places this under the local-care intro (injection photo beside it), so it drops its own
// portrait and section border. Same words either way.
export default function ProviderCallout({ merged = false }: { merged?: boolean }) {
  return (
    <>
      <StructuredData type="Person" />
      <section
        className={merged ? "scroll-mt-28 pt-14 md:pt-16" : "scroll-mt-28 border-t border-base-300 py-16 md:py-24"}
        aria-labelledby="provider-callout-heading"
      >
        <div
          className={
            merged ? "max-w-3xl" : "grid items-start gap-8 md:grid-cols-[minmax(11rem,16rem)_minmax(0,1fr)] md:gap-12 lg:gap-16"
          }
        >
          {!merged && (
          <figure className="mx-auto w-full max-w-[16rem] md:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-base-200">
              <Image
                src="/jenny.jpg"
                alt="Our aesthetic nurse practitioner"
                fill
                sizes="(max-width: 768px) 70vw, 256px"
                className="object-cover object-[center_18%]"
              />
            </div>
          </figure>
          )}
          <div className="max-w-2xl">
            <p className="eyebrow">Provider</p>
            <h2
              id="provider-callout-heading"
              className="mt-3 text-3xl leading-tight tracking-tight text-base-content md:text-[2.2rem]"
            >
              Meet Our Aesthetic Nurse Practitioner
            </h2>
            <p className="mt-4 text-lg text-base-content/80">Jenny Brady, MSN, RN, CPNP, PMHS</p>
            <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5" aria-label="Jenny Brady credentials and certifications">
              {CREDENTIALS.map((credential) => (
                <li key={credential} className="text-sm text-base-content/60 after:ml-2 after:text-base-content/30 after:content-['·'] last:after:content-none">
                  {credential}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-base-content/75 md:text-lg">
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
