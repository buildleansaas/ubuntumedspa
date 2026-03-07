import { articles as slugs } from "app/sitemap";
import { procedures } from "data";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";

import CtaFooter from "components/cta-footer";
import StructuredData from "components/structured-data";
import { twMerge } from "tailwind-merge";
import CtaButtons from "components/cta-buttons";
import { notFound } from "next/navigation";
import ProcedureTestimonials from "components/procedure-testimonials";

const ailmentsSortOrder = { common: 1, uncommon: 2, experimental: 3 };

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params) {
  const { title, description } = procedures.find((med) => med.slug === params.slug)?.seo ?? {
    title: "Procedure",
    description: "",
  };

  const withLocation = /williamsburg/i.test(title) ? title : `${title} in Williamsburg, VA`;
  const canonical = `/procedures/${params.slug}`;

  return {
    title: withLocation,
    description,
    alternates: { canonical },
    openGraph: {
      title: withLocation,
      description,
      url: canonical,
      siteName: "Williamsburg Med Spa",
      images: [
        {
          url: `${canonical}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: withLocation,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: withLocation,
      description,
      images: [`${canonical}/twitter-image`],
    },
  };
}

export default async function ProcedurePage({ params: { slug } }: { params: { slug: string } }) {
  const procedure = procedures.find((procedure) => procedure.slug === slug);
  if (!procedure) return notFound();

  const articles = (await Promise.all(slugs?.map((slug) => import(`markdown/${slug}.mdx`))))
    .map(({ metadata }, index) => ({ ...metadata, slug: slugs[index] }))
    .filter(({ tags }) => tags?.includes(procedure.name))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Procedures", procedure.name]} />
      <StructuredData
        type="Service"
        service={{ name: procedure.name, description: procedure.description, areaServed: "Williamsburg, VA" }}
      />
      <StructuredData type="FAQ" faqs={procedure.faqs} />
      <div className="max-w-7xl mx-auto py-16">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl mx-auto leading-tight pb-4">
            <span className="font-bold">{procedure.name}</span> by Williamsburg Med Spa
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-5xl mx-auto font-light">{procedure.headline}</p>
          <p className="text-lg max-w-4xl mx-auto">{procedure.description}</p>
          <div className="flex space-x-4 mx-auto my-8 justify-center">
            <Button asChild>
              <Link href="/consult">Book a Consultation</Link>
            </Button>
            {Boolean(articles.length) && (
              <Button asChild variant="secondary">
                <Link href="#benefits">Explore Benefits</Link>
              </Button>
            )}
          </div>
          <p className="text-sm md:text-base text-base-content/70 max-w-3xl mx-auto">
            Serving patients from Williamsburg, James City County, Yorktown, Newport News, and nearby communities.
            {" "}
            <Link href="/locations/williamsburg-va" className="link link-primary">
              View our Williamsburg location
            </Link>
            .
          </p>
        </div>

        <div className="my-32 text-center max-w-5xl mx-auto" id="benefits">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
            <span className="font-bold">{procedure.name}</span> Benefits
          </h2>
          <p className="text-xl lg:text-2xl mb-8 font-light">{procedure.benefitsHeadline}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {procedure.benefits.map(({ emoji, benefit, description }) => (
              <Card key={benefit} className="text-left bg-primary text-primary-content border-4 border-primary">
                <CardHeader>
                  <CardTitle>
                    {emoji} {benefit}
                  </CardTitle>
                </CardHeader>
                <CardContent>{description}</CardContent>
              </Card>
            ))}
          </div>
          {Boolean(procedure.testimonials?.length) && (
            <ProcedureTestimonials procedureName={procedure.name} items={procedure.testimonials} />
          )}
          <CtaButtons />
        </div>

        <div className="my-32 text-center max-w-7xl mx-auto" id="applications">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
            How can{" "}
            {[
              "Feminine Intimacy PRP Protocols",
              "Male Intimacy PRP Protocols",
              "PRP Face Lift",
              "PRP Facial",
              "PRP Breast Lift",
            ].includes(procedure.name) && "the "}
            <span className="font-bold">{procedure.name}</span> help me?
          </h2>
          <p className="text-xl lg:text-2xl mb-8 font-light text-justify">{procedure.ailmentsHeadline}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {procedure.ailments
              ?.sort((a, b) => ailmentsSortOrder[a.tag] - ailmentsSortOrder[b.tag])
              .map(({ title, tag, description, slug: ailmentSlug }) => (
                <Card
                  key={title}
                  className={twMerge(
                    "text-left border-4",
                    tag === "common" && "bg-primary border-primary text-primary-content",
                    tag === "uncommon" && "bg-purple-500 border-purple-400 text-white",
                    tag === "experimental" && "bg-rose-500 border-rose-400 text-white"
                  )}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {title}{" "}
                      <Badge>
                        {tag === "common" && "Commonly Treated with PRP"}
                        {tag === "uncommon" && "Uncommonly Treated with PRP"}
                        {tag === "experimental" && "Ask About our Clinical Trials"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{description}</CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href={`/procedures/${procedure.slug}/for/${ailmentSlug}`}>Learn More</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
          <CtaButtons />
        </div>

        <div className="my-32 text-center max-w-5xl mx-auto" id="faqs">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
            Frequently Asked Questions about <span className="font-bold">{procedure.name}</span>
          </h2>
          <h2 className="text-xl lg:text-2xl mb-8 font-light">{procedure.faqHeadline}</h2>
          <Accordion type="single" collapsible className="text-left mb-12">
            {procedure.faqs.map(({ question, answer }) => (
              <AccordionItem key={question} value={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <CtaButtons />
        </div>

        {Boolean(articles.length) && (
          <div className="my-32" id="posts">
            <div className="mb-16">
              <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
                More About <span className="font-semibold">{procedure.name}</span>
              </h2>
              <p className="text-lg lg:text-xl max-w-5xl mx-auto text-center">{procedure.blogHeadline}</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {articles.map((article) => (
                <article key={article.slug} className="relative isolate flex flex-col gap-8 lg:flex-row">
                  <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0 bg-base-200">
                    <Image src={article.image} alt="" fill className="object-cover" />
                    <div className="absolute inset-0 shadow-inner bg-gradient-to-br from-white/20" />
                  </div>
                  <div className="py-4">
                    <div className="flex flex-wrap items-center text-xs gap-2">
                      <Badge className="bg-purple-500 hover:bg-purple-600">
                        {new Date(article.date).toLocaleDateString("en-GB", {
                          dateStyle: "long",
                        })}
                      </Badge>
                      {article.tags.map((tag) => (
                        <Badge key={tag} className="bg-primary hover:bg-primary-focus">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="group relative max-w-xl">
                      <h2 className="mt-3 text-lg/snug sm:text-xl/snug md:text-2xl/snug font-semibold text-base-content hover:text-base-content/80">
                        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-primary-content">{article.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        <CtaFooter />
      </div>
    </>
  );
}
