import React from "react";

import NextLink from "next/link";
import { procedures } from "procedures";

import { ProcedureCard } from "components/ProcedureCard";

export default function Page() {
  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-6 md:px-8 z-10">
      <div className="text-center pt-16 sm:pt-40 md:pt-64 lg:pt-80" id="procedures">
        <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mx-auto leading-tight pb-4">
          Rejuvinate Your Life
        </h2>
        <p className="text-white text-xl lg:text-2xl mb-8 max-w-2xl mx-auto">
          Experience the amazing effects of <strong>Vampire Services</strong> using <strong>Your Own Blood</strong> to
          enjoy <strong>Natural Healing</strong>, for <strong>Joints</strong>, <strong>Aesthetics</strong>,{" "}
          <strong>Sexual Health</strong> and overall <strong>Wellness</strong>.
        </p>
        <div className="mb-32">
          <div className="flex flex-col lg:flex-row lg:justify-center xl:items-center">
            <NextLink
              className="bg-blue-500 text-white py-2 px-6 text-sm lg:text-base lg:mr-4 xl:mb-4 rounded-md "
              href="/consult"
            >
              Book a Consultation
            </NextLink>
          </div>
        </div>
      </div>

      <div className="text-center" id="services">
        <h1 className="text-2xl md:text-3xl font-bold mx-auto leading-tight pb-4">Certified Procedures and Services</h1>
        <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto">
          Platelet Rich Plasma Injections, which are based on a synthesis of your own blood, provokes radical healing by
          the release of your own stem cells applicable to most of the human body. This medical technology has been
          available to professional athletes for years to treat sport injuries, and now is available for wellness,
          restoration and aesthetic procedures that you won&rsquo;t even realize are done with complimentary Lidocane
          pre treatment.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-10 mt-8 lg:mt-12 xl:mt-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {procedures.map((procedure, i) => (
          <ProcedureCard key={i} product={{ ...procedure, slug: procedure.name.replaceAll(" ", "-").toLowerCase() }} />
        ))}
      </div>
    </div>
  );
}
