import React from "react";

import { articles as slugs } from "app/sitemap";
import { Metadata } from "components/ArticleHeader";

import NextLink from "next/link";
import { procedures } from "procedures";

import { ProcedureCard } from "components/ProcedureCard";
import Image from "next/image";
import CtaFooter from "components/CtaFooter";

export default async function Page() {
  const articles = (await Promise.all(slugs.map((slug) => import(`markdown/${slug}.mdx`))))
    .map<Metadata>(({ metadata }, index) => ({ ...metadata, slug: slugs[index] }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 z-10">
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

      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <div className="my-16 sm:my-24 lg:my-32">
          <h1 className="sm:text-center text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-bold tracking-tight text-white">
            Ubuntu Med Spa Blog
          </h1>
          <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto">
            Explore the Ubuntu Med Spa Blog to unravel the science behind Plasma Rich Platelet (PRP) therapy. Our
            insightful posts are here to help you understand PRP benefits and procedures, guiding you on your journey to
            improved health and wellness.
          </p>
        </div>
        <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
          {articles.map((article) => (
            <article key={article.slug} className="relative isolate flex flex-col gap-8 lg:flex-row">
              <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0 bg-gray-50">
                <Image src={article.image} alt="" fill className="object-cover" />
                <div className="absolute inset-0 shadow-inner bg-gradient-to-br from-white/20" />
              </div>
              <div className="py-4">
                <div className="flex flex-wrap items-center text-xs">
                  <time
                    dateTime={new Date(article.date).toISOString()}
                    className="w-full sm:w-auto text-white mr-6 mb-2"
                  >
                    {new Date(article.date).toLocaleDateString("en-GB", {
                      dateStyle: "long",
                    })}
                  </time>
                  {article.tags.map((tag) => (
                    <div key={tag} className="rounded-lg px-2 py-1 bg-white text-black -ml-1 mr-3 mb-2">
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="group relative max-w-xl">
                  <h2 className="mt-3 text-lg/snug sm:text-xl/snug md:text-2xl/snug font-semibold text-white-900 group-hover:text-gray-200">
                    <NextLink
                      href={`/blog/${article.slug}`}
                      className="rounded-lg focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-200"
                    >
                      <span className="absolute inset-0" />
                      {article.title}
                    </NextLink>
                  </h2>
                  <p className="mt-5 text-sm leading-6 text-white">{article.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <CtaFooter />
      </div>
    </div>
  );
}
