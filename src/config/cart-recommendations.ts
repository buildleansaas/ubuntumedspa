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
  botox: [
    {
      slug: "filler",
      reason: "Often added when someone wants softening from Botox plus shape or volume in another area.",
      priority: 1,
    },
    {
      slug: "co2-lift",
      reason: "A simple pickup add-on for glow and skin support between injectable visits.",
      priority: 2,
    },
    {
      slug: "definage-clinical-power-trio-pro",
      reason: "A medical-grade routine patients often use to support skin quality after aesthetic treatments.",
      priority: 3,
    },
  ],
  xeomin: [
    {
      slug: "filler",
      reason: "Often explored alongside Xeomin when the goal is smoother movement lines plus a little structural support.",
      priority: 1,
    },
    {
      slug: "co2-lift",
      reason: "A pickup skincare add-on for texture, glow, and at-home support between visits.",
      priority: 2,
    },
    {
      slug: "definage-clinical-power-trio-pro",
      reason: "A stronger home-care option for patients also thinking about tone, firmness, and skin upkeep.",
      priority: 3,
    },
  ],
  filler: [
    {
      slug: "botox",
      reason: "A common companion treatment when patients want both softening and support rather than volume alone.",
      priority: 1,
    },
    {
      slug: "co2-lift",
      reason: "An easy at-home add-on for glow and hydration between filler appointments.",
      priority: 2,
    },
    {
      slug: "definage-clinical-power-trio-pro",
      reason: "A medical-grade skincare routine that pairs well with patients focused on overall skin quality.",
      priority: 3,
    },
  ],
  "prp-facial": [
    {
      slug: "co2-lift",
      reason: "A natural fit for patients who want to support glow and hydration between PRP facial visits.",
      priority: 1,
    },
    {
      slug: "definage-clinical-power-trio-pro",
      reason: "A stronger home-care option for maintenance when texture, tone, and firmness are part of the goal.",
      priority: 2,
    },
    {
      slug: "prp-face-lift",
      reason: "Sometimes explored next when someone wants a broader facial rejuvenation conversation.",
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
      reason: "A pickup skincare option for patients focused on glow, hydration, and between-visit support.",
      priority: 2,
    },
    {
      slug: "definage-clinical-power-trio-pro",
      reason: "A home-care routine that fits patients thinking about tone, firmness, and ongoing maintenance.",
      priority: 3,
    },
  ],
  "o-shot": [
    {
      slug: "co2-v-lift-for-women",
      reason: "A related pickup product for patients interested in ongoing intimate-area self-care between visits.",
      priority: 1,
    },
    {
      slug: "co2-lift",
      reason: "A simple at-home skin-support product for patients already exploring restorative care.",
      priority: 2,
    },
  ],
  "co2-v-lift-for-women": [
    {
      slug: "o-shot",
      reason: "Often explored when someone wants an in-office conversation in addition to at-home intimate care.",
      priority: 1,
    },
    {
      slug: "co2-lift",
      reason: "A related pickup product for broader skin-support and glow-focused maintenance.",
      priority: 2,
    },
  ],
  "co2-lift": [
    {
      slug: "prp-facial",
      reason: "A natural next step for patients who want to move from at-home support into in-office skin rejuvenation.",
      priority: 1,
    },
    {
      slug: "filler",
      reason: "Often explored by patients who want to pair skincare with a more structural facial refresh.",
      priority: 2,
    },
    {
      slug: "botox",
      reason: "A common next step when the goal is to soften movement-related lines beyond skincare alone.",
      priority: 3,
    },
  ],
  "definage-clinical-power-trio-pro": [
    {
      slug: "botox",
      reason: "Often explored when someone wants injectable support alongside a stronger at-home anti-aging routine.",
      priority: 1,
    },
    {
      slug: "filler",
      reason: "A common follow-up when the goal includes both skin quality and a little more facial support or contour.",
      priority: 2,
    },
    {
      slug: "prp-facial",
      reason: "A natural in-office complement for patients already investing in skin texture and glow.",
      priority: 3,
    },
  ],
};

const CART_RECOMMENDATION_FALLBACKS: RecommendationDefinition[] = [
  {
    slug: "botox",
    reason: "A common next step for patients looking to soften movement-related lines.",
    priority: 1,
  },
  {
    slug: "filler",
    reason: "Often explored when someone wants shape, balance, or a little more facial support.",
    priority: 2,
  },
  {
    slug: "prp-facial",
    reason: "A natural-feeling skin refresh patients often explore between bigger aesthetic treatments.",
    priority: 3,
  },
  {
    slug: "co2-lift",
    reason: "A pickup skincare add-on that supports glow and at-home maintenance between visits.",
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
