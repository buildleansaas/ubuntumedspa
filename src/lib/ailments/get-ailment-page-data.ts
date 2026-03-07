import { procedures } from "data";
import { cache } from "react";

type Procedure = (typeof procedures)[number];
type Ailment = Procedure["ailments"][number];

export type AilmentPageStep = {
  title: string;
  description: string;
};

export type AilmentPageFAQ = {
  question: string;
  answer: string;
};

export type AilmentPageMetadata = {
  title: string;
  description: string;
  procedureSlug: string;
  ailmentSlug: string;
  heroHeadline: string;
  heroSubheadline: string;
  painHeading: string;
  painParagraphs: string[];
  mechanismHeading: string;
  mechanismParagraphs: string[];
  mechanismImage: string;
  mechanismImageAlt: string;
  expectationsHeading: string;
  expectationsSteps: AilmentPageStep[];
  faqHeading: string;
  faqs: AilmentPageFAQ[];
  seoTitle: string;
  seoDescription: string;
};

type AilmentPageModule = {
  metadata: AilmentPageMetadata;
};

export type PublishedAilmentEntry = {
  procedureSlug: string;
  ailmentSlug: string;
};

const getAilmentModule = cache(async (procedureSlug: string, ailmentSlug: string): Promise<AilmentPageModule | null> => {
  try {
    return (await import(`markdown/ailments/${procedureSlug}/${ailmentSlug}.mdx`)) as AilmentPageModule;
  } catch {
    return null;
  }
});

export const hasAilmentPageContent = async (procedureSlug: string, ailmentSlug: string) => {
  const ailmentModule = await getAilmentModule(procedureSlug, ailmentSlug);
  return Boolean(ailmentModule?.metadata);
};

export const getPublishedAilmentEntries = cache(async (): Promise<PublishedAilmentEntry[]> => {
  const entries = await Promise.all(
    procedures.flatMap((procedure) =>
      (procedure.ailments || []).map(async (ailment) => {
        const hasContent = await hasAilmentPageContent(procedure.slug, ailment.slug);
        if (!hasContent) return null;

        return {
          procedureSlug: procedure.slug,
          ailmentSlug: ailment.slug,
        } satisfies PublishedAilmentEntry;
      })
    )
  );

  return entries.filter((entry): entry is PublishedAilmentEntry => Boolean(entry));
});

export const getAilmentPageData = cache(async (procedureSlug: string, ailmentSlug: string) => {
  const procedure = procedures.find((item) => item.slug === procedureSlug);
  if (!procedure) return null;

  const ailment = (procedure.ailments || []).find((item) => item.slug === ailmentSlug);
  if (!ailment) return null;

  const ailmentModule = await getAilmentModule(procedureSlug, ailmentSlug);
  const metadata = ailmentModule?.metadata;
  if (!metadata) return null;

  if (metadata.procedureSlug !== procedureSlug || metadata.ailmentSlug !== ailmentSlug) {
    return null;
  }

  const relatedAilments = (procedure.ailments || []).filter((item) => item.slug !== ailment.slug).slice(0, 3);

  return {
    procedure,
    ailment: ailment as Ailment,
    metadata,
    relatedAilments,
  };
});
