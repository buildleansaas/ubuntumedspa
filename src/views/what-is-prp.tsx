"use client";

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import CtaButtons from "components/cta-buttons";

export default function WhatIsPRP() {
  const steps = [
    {
      title: "Preparation",
      description:
        "Jenny reviews your health history and goals before any PRP treatment.",
    },
    {
      title: "Procedure",
      description:
        "The PRP process covers preparing the blood sample, separating the PRP, and the treatment itself.",
    },
    {
      title: "Recovery",
      description:
        "Some mild discomfort afterward is possible. Jenny explains aftercare and what to watch for.",
    },
    {
      title: "After Treatment",
      description:
        "Results vary from person to person. Jenny explains what to expect and when to follow up.",
    },
  ];

  return (
    <div className="scroll-mt-28 border-t border-base-300 py-16 text-left md:py-24 max-w-3xl px-4" id="prp-info">
      <h2 className="text-2xl md:text-4xl font-bold leading-tight pb-4">What is Platelet Rich Plasma (PRP)?</h2>
      <p className="text-xl lg:text-2xl mb-8 font-light">
        PRP is platelet-rich plasma, prepared from a small sample of your own blood.
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
