import { COMMERCE_CATALOG_BY_SLUG, type CatalogItemConfig } from "config/commerce-catalog";

type RecommendationDefinition = {
  slug: CatalogItemConfig["slug"];
  reason: string;
  priority: number;
};

type RecommendationCandidate = RecommendationDefinition & {
  matchCount: number;
};

export type CartRecommendation = CatalogItemConfig & {
  reason: string;
  learnMoreHref: string;
};

const CART_RECOMMENDATION_MAP: Partial<Record<CatalogItemConfig["slug"], RecommendationDefinition[]>> = {
  xeomin: [
    {
      slug: "co2-lift",
      reason: "Co2 Lift, a cosmetic carboxytherapy gel you can pick up at the office.",
      priority: 2,
    },
    {
      slug: "definage-clinical-power-trio-pro",
      reason: "Definage Clinical Power Trio Pro, a skincare set you can pick up at the office.",
      priority: 3,
    },
  ],
  "prp-facial": [
    {
      slug: "co2-lift",
      reason: "Co2 Lift, a cosmetic carboxytherapy gel you can pick up at the office.",
      priority: 1,
    },
    {
      slug: "definage-clinical-power-trio-pro",
      reason: "Definage Clinical Power Trio Pro, a skincare set you can pick up at the office.",
      priority: 2,
    },
    {
      slug: "prp-face-lift",
      reason: "An in-office PRP Face Lift visit. Book a consult to ask Jenny about it.",
      priority: 3,
    },
  ],
  "prp-face-lift": [
    {
      slug: "prp-facial",
      reason: "Often paired conceptually when patients want to talk through both overall lift and surface skin quality.",
      priority: 1,
    },
    {
      slug: "co2-lift",
      reason: "Co2 Lift, a cosmetic carboxytherapy gel you can pick up at the office.",
      priority: 2,
    },
    {
      slug: "definage-clinical-power-trio-pro",
      reason: "Definage Clinical Power Trio Pro, a skincare set you can pick up at the office.",
      priority: 3,
    },
  ],
  "co2-v-lift-for-women": [
    {
      slug: "co2-lift",
      reason: "Co2 Lift, a cosmetic carboxytherapy gel you can pick up at the office.",
      priority: 2,
    },
  ],
  "co2-lift": [
    {
      slug: "prp-facial",
      reason: "An in-office PRP facial. Book a consult to ask Jenny about it.",
      priority: 1,
    },
    {
      slug: "xeomin",
      reason: "An in-office Xeomin visit. Book a consult to ask Jenny about it.",
      priority: 3,
    },
  ],
  "definage-clinical-power-trio-pro": [
    {
      slug: "xeomin",
      reason: "An in-office Xeomin visit. Book a consult to ask Jenny about it.",
      priority: 1,
    },
    {
      slug: "prp-facial",
      reason: "An in-office PRP facial. Book a consult to ask Jenny about it.",
      priority: 3,
    },
  ],
};

const CART_RECOMMENDATION_FALLBACKS: RecommendationDefinition[] = [
  {
    slug: "xeomin",
    reason: "A common next step for patients looking to soften movement-related lines.",
    priority: 1,
  },
  {
    slug: "prp-facial",
    reason: "A natural-feeling skin refresh patients often explore between bigger aesthetic treatments.",
    priority: 3,
  },
  {
    slug: "co2-lift",
    reason: "Co2 Lift, a cosmetic carboxytherapy gel you can pick up at the office.",
    priority: 4,
  },
];

const candidateToRecommendation = (candidate: RecommendationCandidate): CartRecommendation | null => {
  const catalogItem = COMMERCE_CATALOG_BY_SLUG[candidate.slug];
  if (!catalogItem) return null;

  return {
    ...catalogItem,
    reason: candidate.reason,
    learnMoreHref: catalogItem.kind === "procedure" ? `/procedures/${catalogItem.slug}` : `/products/${catalogItem.slug}`,
  };
};

const sortCandidates = (left: RecommendationCandidate, right: RecommendationCandidate) =>
  right.matchCount - left.matchCount || left.priority - right.priority || left.slug.localeCompare(right.slug);

const balanceRecommendationMix = (recommendations: CartRecommendation[], limit: number) => {
  const initial = recommendations.slice(0, limit);
  if (initial.length < 2) return initial;

  const kinds = new Set(initial.map((item) => item.kind));
  if (kinds.size > 1) return initial;

  const neededKind = initial[0].kind === "product" ? "procedure" : "product";
  const replacement = recommendations.slice(limit).find((item) => item.kind === neededKind);
  if (!replacement) return initial;

  return [...initial.slice(0, -1), replacement];
};

export const getCartRecommendations = (cartSlugs: string[], limit = 4): CartRecommendation[] => {
  const uniqueCartSlugs = Array.from(new Set(cartSlugs)).filter((slug) => Boolean(COMMERCE_CATALOG_BY_SLUG[slug]));
  const cartSet = new Set(uniqueCartSlugs);
  const candidates = new Map<string, RecommendationCandidate>();

  for (const cartSlug of uniqueCartSlugs) {
    const definitions = CART_RECOMMENDATION_MAP[cartSlug] ?? [];

    for (const definition of definitions) {
      if (cartSet.has(definition.slug)) continue;

      const existing = candidates.get(definition.slug);
      if (existing) {
        existing.matchCount += 1;
        if (definition.priority < existing.priority) {
          existing.priority = definition.priority;
          existing.reason = definition.reason;
        }
        continue;
      }

      candidates.set(definition.slug, {
        ...definition,
        matchCount: 1,
      });
    }
  }

  for (const fallback of CART_RECOMMENDATION_FALLBACKS) {
    if (cartSet.has(fallback.slug) || candidates.has(fallback.slug)) continue;

    candidates.set(fallback.slug, {
      ...fallback,
      matchCount: 0,
    });
  }

  const ranked = Array.from(candidates.values())
    .sort(sortCandidates)
    .map(candidateToRecommendation)
    .filter((item): item is CartRecommendation => Boolean(item));

  return balanceRecommendationMix(ranked, limit);
};
