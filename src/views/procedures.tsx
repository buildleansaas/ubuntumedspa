import { ProcedureCard } from "components/procedure-card";
import { procedures } from "data";

type HeadingTag = "h1" | "h2";

export default function Procedures({ headingTag = "h2" }: { headingTag?: HeadingTag }) {
  const Heading = headingTag;
  const visibleProcedures = procedures.filter((procedure) => !("published" in procedure) || procedure.published !== false);

  return (
    <>
      <div className="text-center" id="services">
        <Heading className="text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
          Medical Spa Treatments in Williamsburg, VA
        </Heading>
        <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto">
          Compare Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, and Blohmdahl medical ear piercing.
          Each service page explains who the treatment may fit, which goals it is commonly used for, and what to review
          during consultation.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-10 mt-8 lg:my-12 xl:my-16 grid-cols-1 sm:grid-cols-2  lg:grid-cols-4">
        {visibleProcedures
          .slice()
          .sort((a, b) => {
            const priority = [
              "botox",
              "filler",
              "xeomin",
              "blohmdahl-ear-piercing",
              "prp-hair-restoration",
              "prp-facial",
              "o-shot",
              "p-shot",
              "joint-restoration",
              "hyperhidrosis-treatment",
            ];
            const ai = priority.indexOf(a.slug);
            const bi = priority.indexOf(b.slug);
            return (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) - (bi === -1 ? Number.MAX_SAFE_INTEGER : bi);
          })
          .map((procedure, i) => (
            <ProcedureCard key={i} product={{ ...procedure, slug: procedure.slug }} />
          ))}
      </div>
    </>
  );
}
