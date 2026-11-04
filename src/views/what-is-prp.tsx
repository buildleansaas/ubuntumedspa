"use client";

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import CtaButtons from "components/cta-buttons";

export default function WhatIsPRP() {
  const steps = [
    {
      title: "Preparation",
      description:
        "Learn about our perfected PRP protocols ensuring the highest quality and safety standards for your treatment.",
    },
    {
      title: "Procedure",
      description:
        "The PRP process combines preparation, processing, and precise injection, all performed seamlessly for optimal results.",
    },
    {
      title: "Recovery",
      description:
        "Initial recovery might involve mild discomfort, which quickly diminishes as your body begins to heal.",
    },
    {
      title: "Long Term Benefits",
      description:
        "Enjoy lasting results as PRP helps to naturally rejuvenate and strengthen the treated area, enhancing your body's own healing capabilities.",
    },
  ];

  return (
    <div className="scroll-mt-28 border-t border-base-300 py-16 text-left md:py-24 max-w-3xl px-4" id="prp-info">
      <h2 className="text-2xl md:text-4xl font-bold leading-tight pb-4">What is Platelet Rich Plasma (PRP)?</h2>
      <p className="text-xl lg:text-2xl mb-8 font-light">
        Discover the power of PRP, a therapeutic approach that harnesses your body&apos;s natural growth factors to heal
        and rejuvenate.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {steps.map(({ title, description }) => (
          <Card key={title} className="text-left border border-base-300 bg-base-100 text-base-content">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
      <p className="text-lg font-light mb-8">
        Our team is dedicated to providing a comfortable and effective treatment experience, ensuring that each step of
        the process is as smooth as possible.
      </p>
      <CtaButtons />
    </div>
  );
}
