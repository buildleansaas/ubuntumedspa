import Image from "next/image";

import { Card } from "components/ui/card";
import type { ProcedureTestimonial } from "data";

type Props = {
  procedureName: string;
  items?: ProcedureTestimonial[];
};

export default function ProcedureTestimonials({ procedureName, items }: Props) {
  const testimonials = items ?? [];
  if (!testimonials.length) return null;
  const sectionDescription = `See real patient experiences with ${procedureName} at Williamsburg Med Spa. These outcomes reflect our focus on safe, personalized care and natural-looking results.`;

  const gridClassName =
    testimonials.length === 1
      ? "grid grid-cols-1 gap-8 mb-12 justify-items-center"
      : testimonials.length === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 justify-items-center"
      : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12 justify-items-center";

  return (
    <section className="text-center" aria-labelledby="testimonials-heading" id="testimonials">
      <h3
        id="testimonials-heading"
        className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light"
      >
        <span className="font-bold">{procedureName}</span> Testimonials
      </h3>
      <p className="text-xl lg:text-2xl mb-8 font-light">{sectionDescription}</p>

      <div className={gridClassName}>
        {testimonials.map((t) => {
          const altText = `${t.quote}${t.attribution ? ` - ${t.attribution}` : ""}`.trim();
          return (
            <Card
              key={t.id}
              className="w-full max-w-[520px] bg-base-100 text-base-content border-4 border-base-200 shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="relative w-full aspect-[10/11] overflow-hidden rounded-md bg-base-200">
                  <Image
                    src={t.imageSrc}
                    alt={altText}
                    fill
                    sizes="(min-width: 1280px) 420px, (min-width: 768px) 45vw, 100vw"
                    className="object-contain p-3"
                    draggable="false"
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
