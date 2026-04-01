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

export type AilmentProcessVisualizationStep = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type AilmentProcessVisualization = {
  heading: string;
  subheading?: string;
  cycleLabel?: string;
  steps: AilmentProcessVisualizationStep[];
};

export type AilmentPageMetadata = {
  title: string;
  description: string;
  procedureSlug: string;
  ailmentSlug: string;
  published?: boolean;
  heroHeadline: string;
  heroSubheadline: string;
  painHeading: string;
  painParagraphs: string[];
  mechanismHeading: string;
  mechanismParagraphs: string[];
  mechanismImage: string;
  mechanismImageAlt: string;
  processVisualization?: AilmentProcessVisualization;
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

export const isAilmentPagePublished = (metadata?: Pick<AilmentPageMetadata, "published"> | null) => metadata?.published === true;

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
    procedures.map(async (procedure) => {
      const ailments = await getPublishedAilmentsForProcedure(procedure.slug);

      return ailments.map(
        (ailment) =>
          ({
            procedureSlug: procedure.slug,
            ailmentSlug: ailment.slug,
          }) satisfies PublishedAilmentEntry
      );
    })
  );

  return entries.flat();
});

export const getPublishedAilmentsForProcedure = cache(async (procedureSlug: string): Promise<Ailment[]> => {
  const procedure = procedures.find((item) => item.slug === procedureSlug);
  if (!procedure) return [];

  const ailments = await Promise.all(
    (procedure.ailments || []).map(async (ailment) => {
      const ailmentModule = await getAilmentModule(procedureSlug, ailment.slug);
      const metadata = ailmentModule?.metadata;

      if (!metadata) return null;
      if (!isAilmentPagePublished(metadata)) return null;
      if (metadata.procedureSlug !== procedureSlug || metadata.ailmentSlug !== ailment.slug) return null;

      return ailment as Ailment;
    })
  );

  return ailments.filter((ailment): ailment is Ailment => Boolean(ailment));
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

  const publishedAilments = await getPublishedAilmentsForProcedure(procedureSlug);
  const relatedAilments = publishedAilments.filter((item) => item.slug !== ailment.slug).slice(0, 3);

  return {
    procedure,
    ailment: ailment as Ailment,
    metadata,
    relatedAilments,
  };
});
