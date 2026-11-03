import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { normalizeIntimacyProcedureSlug } from "lib/intimacy-aliases";

export type CartItem = {
  slug: string;
  kind: "product" | "procedure";
  quantity: number;
};

export const sanitizeCartQuantity = (quantity: number) => Math.max(0, Math.floor(Number(quantity) || 0));

export const clampQuantityForSlug = (slug: string, quantity: number) => {
  const normalizedSlug = normalizeIntimacyProcedureSlug(slug);
  const safeQuantity = sanitizeCartQuantity(quantity);
  if (safeQuantity === 0) return 0;

  const catalogItem = getCatalogConfigBySlug(normalizedSlug);
  if (!catalogItem) return safeQuantity;

  return Math.min(Math.max(safeQuantity, catalogItem.minQuantity), catalogItem.maxQuantity);
};

/**
 * Cleans a cart read from browser storage. Items no longer in the catalog (e.g. "filler", removed 2026-11-03)
 * are dropped silently so a stale saved cart still checks out with whatever remains.
 */
export const normalizeCartItems = (rawItems: unknown): CartItem[] => {
  if (!Array.isArray(rawItems)) return [];

  const deduped = new Map<string, CartItem>();

  for (const rawItem of rawItems) {
    if (!rawItem || typeof rawItem !== "object") continue;

    const candidate = rawItem as Partial<CartItem>;
    if (typeof candidate.slug !== "string") continue;

    const normalizedSlug = normalizeIntimacyProcedureSlug(candidate.slug);
    const catalogItem = getCatalogConfigBySlug(normalizedSlug);
    if (!catalogItem) continue;

    const quantity = clampQuantityForSlug(normalizedSlug, candidate.quantity ?? 0);
    if (quantity <= 0) continue;

    const existing = deduped.get(normalizedSlug);
    if (existing) {
      existing.quantity = clampQuantityForSlug(normalizedSlug, existing.quantity + quantity);
      continue;
    }

    deduped.set(normalizedSlug, {
      slug: normalizedSlug,
      kind: catalogItem.kind,
      quantity,
    });
  }

  return Array.from(deduped.values());
};
