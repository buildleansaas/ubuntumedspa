import Image from "next/image";
import StructuredData from "components/structured-data";

export default function ProviderCallout() {
  return (
    <>
      <StructuredData type="Person" />
      <section className="mb-14 md:mb-20" aria-labelledby="provider-callout-heading">
      <div className="mx-auto max-w-3xl md:max-w-4xl rounded-2xl border border-base-300 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-7">
          <div className="relative w-24 h-24 md:w-36 md:h-36 shrink-0">
            <Image
              src="/jenny.jpg"
              alt="Our aesthetic nurse practitioner"
              fill
            sizes="(max-width: 768px) 96px, 144px"
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-left w-full">
            <h2 id="provider-callout-heading" className="text-2xl md:text-3xl font-light text-base-content mb-1">
              Meet Our Aesthetic Nurse Practitioner
            </h2>
            <p className="text-base md:text-lg text-base-content/70 mb-2">Jenny Brady — MSN, RN, CPNP, PMHS</p>
            <p className="text-sm md:text-base text-base-content/80 leading-relaxed">
              With 26 years in medicine and six years dedicated to aesthetics, Jenny blends primary care and mental
              health expertise with a holistic, patient‑first approach. She combines regenerative PRP therapies,
              advanced injection techniques, and practical wellness counseling to help you look and feel your best—
              naturally.
            </p>
          </div>
        </div>
      </div>
      </section>
    </>
  );
}
