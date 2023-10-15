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
          Explore the Ubuntu Med Spa Blog to unravel the science behind Plasma Rich Platelet (PRP) therapy. Our
          insightful posts are here to help you understand PRP benefits and procedures, guiding you on your journey to
          improved health and wellness.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-10 mt-8 lg:my-12 xl:my-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {procedures.map((procedure, i) => (
          <ProcedureCard key={i} product={{ ...procedure, slug: procedure.name.replaceAll(" ", "-").toLowerCase() }} />
        ))}
      </div>
    </>
  );
}
