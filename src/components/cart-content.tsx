"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  Loader,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import { useCart } from "components/cart-provider";
import { Button } from "components/ui/button";
import { formatUsd } from "lib/price";
import { cn } from "lib/utils";

type ResolvedCartItem = {
  slug: string;
  name: string;
  kind: "product" | "procedure";
  quantity: number;
  displayPrice: string;
  lineTotalCents: number;
  minQuantity: number;
  maxQuantity: number;
  quantityLabel: string;
  requiresScheduling: boolean;
  fulfillment: "pickup" | "appointment";
  pricingMode: "fixed" | "quantity" | "increment_credit";
  imagePath?: string;
};

type ResolvedCartResponse = {
  items: ResolvedCartItem[];
  subtotalCents: number;
  requiresScheduling: boolean;
};

type Props = {
  mode?: "page" | "drawer";
  onNavigate?: () => void;
};

const surfaceCardClass = "relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm";
const surfaceAccentClass = "hidden";
const eyebrowClass = "text-[11px] uppercase tracking-[0.24em] text-base-content/60";
const softButtonClass = "rounded-md";
const homeOShotHref = "/#o-shot-callout";
const homeOShotHash = "#o-shot-callout";

function MetaPill({
  children,
  icon,
  accent = false,
}: {
  children: ReactNode;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs leading-none",
        accent ? "border-base-300 bg-base-200 text-primary" : "border-base-300 bg-base-200 text-base-content/80"
      )}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}

function QuantityControl({
  item,
  onChange,
}: {
  item: ResolvedCartItem;
  onChange: (nextQuantity: number) => void;
}) {
  const isLocked = item.minQuantity === 1 && item.maxQuantity === 1;

  if (isLocked) {
    return (
      <div className="inline-flex items-center rounded-md border border-base-300 bg-base-200 px-3 py-1.5 text-sm text-base-content/80">
        Qty 1
      </div>
    );
  }

  return (
    <div>
      <div className="inline-flex items-center overflow-hidden rounded-md border border-base-300 bg-base-100 shadow-sm">
        <button
          type="button"
          aria-label={`Decrease ${item.name} quantity`}
          disabled={item.quantity <= item.minQuantity}
          onClick={() => onChange(item.quantity - 1)}
          className="inline-flex h-10 w-10 items-center justify-center border-r border-base-300 text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="flex min-w-[3.25rem] items-center justify-center px-3 text-base font-semibold text-base-content">
          {item.quantity}
        </div>
        <button
          type="button"
          aria-label={`Increase ${item.name} quantity`}
          disabled={item.quantity >= item.maxQuantity}
          onClick={() => onChange(item.quantity + 1)}
          className="inline-flex h-10 w-10 items-center justify-center border-l border-base-300 text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-base-content/60">{item.quantityLabel}</p>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1].map((index) => (
        <div key={index} className={cn("animate-pulse p-5", surfaceCardClass)}>
          <div className={surfaceAccentClass} />
          <div className="relative flex gap-4">
            <div className="h-24 w-24 rounded-[1.2rem] bg-base-200" />
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-5 w-36 rounded-full bg-base-200" />
              <div className="h-4 w-52 rounded-full bg-base-200/70" />
              <div className="h-12 w-40 rounded-[1rem] bg-base-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CartSummaryCard({
  isDrawer,
  resolved,
  loading,
  resolveError,
  checkingOut,
  checkoutDisabled,
  onCheckout,
  onKeepShopping,
}: {
  isDrawer: boolean;
  resolved: ResolvedCartResponse | null;
  loading: boolean;
  resolveError: string | null;
  checkingOut: boolean;
  checkoutDisabled: boolean;
  onCheckout: () => void;
  onKeepShopping: () => void;
}) {
  return (
    <div className={cn(surfaceCardClass, isDrawer ? "p-5" : "p-6 sm:p-7")}>
      <div className={surfaceAccentClass} />

      <div className="relative">
        {resolved ? (
          <div>
            <p className={eyebrowClass}>Order Summary</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-base-content">
              {formatUsd(resolved.subtotalCents)}
            </p>
            <div className="mt-4 border-t border-base-300 pt-4">
              <p className="text-sm font-medium text-base-content/80">
                {resolved.requiresScheduling ? "Scheduling included" : "Pickup only"}
              </p>
              <p className="mt-1 max-w-md text-sm leading-6 text-base-content/60">
                Taxes are not calculated in this first version.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-3 w-28 rounded-full bg-base-300" />
            <div className="h-8 w-40 rounded-full bg-base-300" />
            <div className="h-4 w-52 rounded-full bg-base-300/70" />
          </div>
        ) : (
          <div>
            <p className={eyebrowClass}>Order Summary</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-base-content/70">
              {resolveError || "Checkout is unavailable until your cart validates."}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            onClick={onCheckout}
            disabled={checkoutDisabled}
            className={cn("justify-center sm:flex-1", softButtonClass)}
          >
            {checkingOut ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              <>
                Checkout with Stripe
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          {isDrawer ? (
            <Button
              variant="ghost"
              onClick={onKeepShopping}
              className="justify-center px-2 text-base-content/70 hover:bg-transparent hover:text-base-content"
            >
              Keep Shopping
            </Button>
          ) : (
            <Button asChild variant="secondary" className={cn("justify-center", softButtonClass)}>
              <Link href={homeOShotHref}>Continue Browsing</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CartContent({ mode = "page", onNavigate }: Props) {
  const router = useRouter();
  const { items, setQuantity, removeItem, closeCart } = useCart();
  const [resolved, setResolved] = useState<ResolvedCartResponse | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const isEmpty = items.length === 0;
  const isDrawer = mode === "drawer";

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!items.length) {
        setResolved(null);
        setResolveError(null);
        return;
      }

      setLoading(true);
      setResolveError(null);

      try {
        const response = await fetch("/api/cart/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Unable to resolve cart.");
        if (!cancelled) setResolved(body);
      } catch (error) {
        if (!cancelled) {
          setResolveError(error instanceof Error ? error.message : "Unable to validate cart.");
          setResolved(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [items]);

  const checkoutDisabled = useMemo(
    () => loading || checkingOut || isEmpty || !resolved || Boolean(resolveError),
    [checkingOut, isEmpty, loading, resolveError, resolved]
  );
  const showDrawerFooter = isDrawer && !isEmpty && (loading || Boolean(resolved) || Boolean(resolveError));
  const handleKeepShopping = () => {
    closeCart();

    if (typeof window !== "undefined" && window.location.pathname === "/") {
      window.requestAnimationFrame(() => {
        const element = document.getElementById("o-shot-callout");
        if (!element) {
          router.push(homeOShotHref, { scroll: true });
          return;
        }

        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", homeOShotHash);
      });
      return;
    }

    router.push(homeOShotHref, { scroll: true });
  };

  const handleCheckout = async () => {
    if (!resolved || resolveError) return;
    setCheckingOut(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to start checkout.");
      window.location.href = body.url;
    } catch (error) {
      setResolveError(error instanceof Error ? error.message : "Unable to start checkout.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (isEmpty) {
    return (
      <div
        className={cn(
          surfaceCardClass,
          "text-center",
          isDrawer ? "flex h-full flex-col justify-center px-6 py-12" : "mx-auto max-w-3xl px-8 py-16"
        )}
      >
        <div className={surfaceAccentClass} />

        <div className="relative">
          <p className={eyebrowClass}>Cart</p>
          <div className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-base-200 text-primary">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1
            className={cn(
              "mt-6 font-light tracking-tight text-base-content",
              isDrawer ? "text-[2rem]/tight" : "text-[2.6rem]/tight"
            )}
          >
            <span className="font-semibold">Your cart</span> is empty
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[0.98rem] leading-7 text-base-content/70">
            Add products or procedures from the site and they&apos;ll appear here as a clean review list before
            checkout.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild onClick={onNavigate} className={softButtonClass}>
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="secondary" onClick={onNavigate} className={softButtonClass}>
              <Link href="/procedures">Browse Procedures</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const resolvedItems = resolved?.items || [];

  return (
    <div className={cn(isDrawer ? "flex h-full min-h-0 flex-col" : "mx-auto flex max-w-5xl flex-col py-12")}>
      {!isDrawer && (
        <div className={cn("mb-8 px-8 py-7", surfaceCardClass)}>
          <div className={surfaceAccentClass} />

          <div className="relative">
            <p className={eyebrowClass}>Cart</p>
            <h1 className="mt-3 text-4xl font-light tracking-tight text-base-content">
              Review <span className="font-semibold">Your Selection</span>
            </h1>
            <p className="mt-4 max-w-3xl text-[1.02rem] leading-7 text-base-content/70">
              Products remain pickup-only. Paid procedures continue to scheduling after checkout is completed.
            </p>
          </div>
        </div>
      )}

      <div className={cn(isDrawer && "min-h-0 flex-1 overflow-y-auto pr-1")}>
        {loading && !resolved && <CartSkeleton />}

        {resolveError && !resolved && !loading && (
          <div className="flex flex-1 flex-col justify-center">
            <div className="rounded-2xl border border-error/20 bg-error/10 p-6 shadow-sm">
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-error/15 text-error">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-error/80">Cart Issue</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-base-content">
                    We couldn&apos;t validate this cart yet
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-base-content/80">{resolveError}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {isDrawer ? (
                      <Button variant="secondary" className={softButtonClass} onClick={handleKeepShopping}>
                        Keep Shopping
                      </Button>
                    ) : (
                      <Button asChild variant="secondary" className={softButtonClass}>
                        <Link href={homeOShotHref}>Keep Shopping</Link>
                      </Button>
                    )}
                    <Button asChild className={softButtonClass} onClick={onNavigate}>
                      <Link href="/cart">Open Fallback Cart</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!!resolved && (
          <>
            {resolveError && (
              <div className="mb-5 rounded-xl border border-error/20 bg-error/10 px-5 py-4 text-base-content">
                <p className="font-medium text-error">Unable to fully validate your cart.</p>
                <p className="mt-1 text-sm text-base-content/80">{resolveError}</p>
              </div>
            )}

            <div className="space-y-4">
              {resolvedItems.map((item, index) => {
                const isProcedure = item.kind === "procedure";
                const isLocked = item.minQuantity === 1 && item.maxQuantity === 1;

                return (
                  <article
                    key={item.slug}
                    className={cn("cart-item-reveal p-4", surfaceCardClass)}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className={surfaceAccentClass} />

                    <div className="relative flex gap-4 sm:gap-5">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-base-300 bg-base-200">
                        {item.imagePath ? (
                          <>
                            <Image src={item.imagePath} alt={item.name} fill className="object-cover" sizes="80px" />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                          </>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-primary">
                            {isProcedure ? <Sparkles className="h-8 w-8" /> : <ShoppingBag className="h-8 w-8" />}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-semibold text-base-content">
                              {item.name}
                            </h2>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <MetaPill
                                icon={
                                  isProcedure ? (
                                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                                  ) : (
                                    <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                                  )
                                }
                              >
                                {isProcedure ? "Procedure" : "Product"}
                              </MetaPill>
                              <MetaPill
                                icon={
                                  item.fulfillment === "appointment" ? (
                                    <CalendarClock className="h-3.5 w-3.5 text-primary" />
                                  ) : (
                                    <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                                  )
                                }
                              >
                                {item.fulfillment === "appointment" ? "Scheduling after payment" : "Pickup only"}
                              </MetaPill>
                              {item.pricingMode === "increment_credit" && <MetaPill accent>Prepaid blocks</MetaPill>}
                            </div>
                          </div>

                          <button
                            type="button"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => removeItem(item.slug)}
                            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-base-300 bg-base-100 text-base-content/70 transition-colors duration-150 hover:bg-base-200 hover:text-base-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <QuantityControl
                              item={item}
                              onChange={(nextQuantity) => setQuantity(item.slug, nextQuantity)}
                            />
                            {isLocked && (
                              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-base-content/60">
                                Fixed selection
                              </p>
                            )}
                          </div>

                          <div className="sm:text-right">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-base-content/60">
                              {item.displayPrice}
                            </p>
                            <p className="mt-1 text-2xl font-semibold tracking-tight text-base-content">
                              {formatUsd(item.lineTotalCents)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {!isDrawer && (
              <div className="mt-8">
                <CartSummaryCard
                  isDrawer={false}
                  resolved={resolved}
                  loading={loading}
                  resolveError={resolveError}
                  checkingOut={checkingOut}
                  checkoutDisabled={checkoutDisabled}
                  onCheckout={handleCheckout}
                  onKeepShopping={handleKeepShopping}
                />
              </div>
            )}
          </>
        )}
      </div>

      {showDrawerFooter && (
        <div className="-mx-5 -mb-5 mt-5 shrink-0 border-t border-base-300 bg-base-100 px-5 py-4 sm:-mx-6 sm:px-6">
          <CartSummaryCard
            isDrawer
            resolved={resolved}
            loading={loading}
            resolveError={resolveError}
            checkingOut={checkingOut}
            checkoutDisabled={checkoutDisabled}
            onCheckout={handleCheckout}
            onKeepShopping={handleKeepShopping}
          />
        </div>
      )}
    </div>
  );
}
