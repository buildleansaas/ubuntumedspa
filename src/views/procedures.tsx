import { ProcedureCard } from "components/procedure-card";
import { procedures } from "data";

export default function Procedures() {
  return (
    <>
      <div className="text-center" id="services">
        <h2 className="text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
          Certified Procedures and Services
        </h2>
        <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto">
          Explore Williamsburg Med Spa's restorative treatments designed to enhance your natural healing and wellness.
          From innovative PRP therapies to precision Blohmdahl ear piercing, our certified procedures support your
          journey to holistic health and rejuvenation.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-10 mt-8 lg:my-12 xl:my-16 grid-cols-1 sm:grid-cols-2  lg:grid-cols-4">
        {procedures.map((procedure, i) => (
          <ProcedureCard key={i} product={{ ...procedure, slug: procedure.name.replaceAll(" ", "-").toLowerCase() }} />
        ))}
      </div>
    </>
  );
}
