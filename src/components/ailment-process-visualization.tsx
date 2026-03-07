import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";

import type { AilmentProcessVisualization } from "lib/ailments/get-ailment-page-data";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";

type AilmentProcessVisualizationProps = {
  data: AilmentProcessVisualization;
};

export default function AilmentProcessVisualization({ data }: AilmentProcessVisualizationProps) {
  if (!data.steps.length) return null;

  return (
    <div className="mt-12">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h3 className="text-xl md:text-2xl font-semibold">{data.heading}</h3>
        {data.subheading ? <p className="mt-3 text-base text-base-content/70">{data.subheading}</p> : null}
      </div>

      <ol className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {data.steps.map((step, index) => (
          <li key={`${step.title}-${index}`} className="relative">
            <Card className="h-full border-2 border-base-300 bg-base-200 overflow-hidden">
              <div className="relative aspect-[4/3] bg-base-300">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-primary text-primary-content px-3 text-sm font-semibold shadow-lg">
                  {index + 1}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl leading-tight">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-base-content/80 leading-relaxed">{step.description}</CardContent>
            </Card>

            {index < data.steps.length - 1 ? (
              <>
                <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full border border-base-300 bg-base-100 text-primary shadow-sm">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <div className="lg:hidden mt-3 flex items-center justify-center text-primary">
                  <ArrowDown className="h-5 w-5" />
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>

      {data.cycleLabel ? (
        <p className="mt-6 text-center text-sm md:text-base text-base-content/70 max-w-3xl mx-auto">{data.cycleLabel}</p>
      ) : null}
    </div>
  );
}
