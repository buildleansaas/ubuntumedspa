"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { normalizeIntimacyProcedureSlug } from "lib/intimacy-aliases";

type CartItem = {
  slug: string;
  kind: "product" | "procedure";
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  isCartOpen: boolean;
  addItem: (item: CartItem) => void;
  replaceItems: (items: CartItem[]) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const STORAGE_KEY = "wms-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

const sanitizeQuantity = (quantity: number) => Math.max(0, Math.floor(Number(quantity) || 0));
const persistCartItems = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const clampQuantityForSlug = (slug: string, quantity: number) => {
  const normalizedSlug = normalizeIntimacyProcedureSlug(slug);
  const safeQuantity = sanitizeQuantity(quantity);
  if (safeQuantity === 0) return 0;

  const catalogItem = getCatalogConfigBySlug(normalizedSlug);
  if (!catalogItem) return safeQuantity;

  return Math.min(Math.max(safeQuantity, catalogItem.minQuantity), catalogItem.maxQuantity);
};

const normalizeCartItems = (rawItems: unknown): CartItem[] => {
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setItems(normalizeCartItems(parsed));
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistCartItems(items);
  }, [hydrated, items]);

  useEffect(() => {
    setIsCartOpen(false);
  }, [pathname]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalCount: items.reduce((sum, item) => sum + sanitizeQuantity(item.quantity), 0),
      isCartOpen,
      addItem: (item) => {
        setItems((current) => {
          const normalizedSlug = normalizeIntimacyProcedureSlug(item.slug);
          const existing = current.find((entry) => entry.slug === normalizedSlug);
          if (!existing) {
            return [
              ...current,
              {
                ...item,
                slug: normalizedSlug,
                quantity: clampQuantityForSlug(normalizedSlug, item.quantity),
              },
            ];
          }

          return current.map((entry) =>
            entry.slug === normalizedSlug
              ? { ...entry, quantity: clampQuantityForSlug(entry.slug, entry.quantity + item.quantity) }
              : entry
          );
        });
      },
      replaceItems: (nextItems) => {
        const normalizedItems = normalizeCartItems(nextItems);
        setItems(normalizedItems);
        persistCartItems(normalizedItems);
      },
      removeItem: (slug) => {
        setItems((current) => current.filter((item) => item.slug !== slug));
      },
      setQuantity: (slug, quantity) => {
        const nextQuantity = clampQuantityForSlug(slug, quantity);
        setItems((current) =>
          current
            .map((item) => (item.slug === slug ? { ...item, quantity: nextQuantity } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      clearCart: () => {
        setItems([]);
      },
      openCart: () => {
        setIsCartOpen(true);
      },
      closeCart: () => {
        setIsCartOpen(false);
      },
      toggleCart: () => {
        setIsCartOpen((current) => !current);
      },
    }),
    [isCartOpen, items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider.");
  return context;
};
