"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, Loader, Minus, Plus, ShoppingBag, Sparkles, X } from "lucide-react";

import AddToCartButton from "components/add-to-cart-button";
import { useCart } from "components/cart-provider";
import { Button } from "components/ui/button";
import { getCartRecommendations, type CartRecommendation } from "config/cart-recommendations";
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

const surfaceCardClass = "relative overflow-hidden rounded-2xl border border-base-300 bg-base-100";
const surfaceAccentClass = "hidden";
const eyebrowClass = "text-[11px] uppercase tracking-[0.24em] text-base-content/60";
const softButtonClass = "rounded-md";
const homeOShotHref = "/#o-shot-callout";
const homeOShotHash = "#o-shot-callout";

function QuantityControl({
  item,
  onChange,
  compact = false,
  hideLabel = false,
}: {
  item: ResolvedCartItem;
  onChange: (nextQuantity: number) => void;
  compact?: boolean;
  hideLabel?: boolean;
}) {
  const isLocked = item.minQuantity === 1 && item.maxQuantity === 1;

  if (isLocked) {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-md border border-base-300 bg-base-200 text-sm text-base-content/80",
          compact ? "px-2 py-1 text-[13px] sm:px-3 sm:py-1.5 sm:text-sm" : "px-2.5 py-1.5 sm:px-3"
        )}
      >
        Qty 1
      </div>
    );
  }

  return (
    <div>
      <div className="inline-flex items-center overflow-hidden rounded-md border border-base-300 bg-base-100">
        <button
          type="button"
          aria-label={`Decrease ${item.name} quantity`}
          disabled={item.quantity <= item.minQuantity}
          onClick={() => onChange(item.quantity - 1)}
          className={cn(
            "inline-flex items-center justify-center border-r border-base-300 text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-35",
            compact ? "h-8 w-8 sm:h-10 sm:w-10" : "h-9 w-9 sm:h-10 sm:w-10"
          )}
        >
          <Minus className={cn(compact ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-4 w-4")} />
        </button>
        <div
          className={cn(
            "flex items-center justify-center font-semibold text-base-content",
            compact
              ? "min-w-[2.15rem] px-1.5 text-[13px] sm:min-w-[3.25rem] sm:px-3 sm:text-base"
              : "min-w-[2.85rem] px-2.5 text-sm sm:min-w-[3.25rem] sm:px-3 sm:text-base"
          )}
        >
          {item.quantity}
        </div>
        <button
          type="button"
          aria-label={`Increase ${item.name} quantity`}
          disabled={item.quantity >= item.maxQuantity}
          onClick={() => onChange(item.quantity + 1)}
          className={cn(
            "inline-flex items-center justify-center border-l border-base-300 text-base-content/70 transition-colors hover:bg-base-200 hover:text-base-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-35",
            compact ? "h-8 w-8 sm:h-10 sm:w-10" : "h-9 w-9 sm:h-10 sm:w-10"
          )}
        >
          <Plus className={cn(compact ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-4 w-4")} />
        </button>
      </div>
      {!hideLabel && (
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-base-content/60 sm:mt-2 sm:text-[11px] sm:tracking-[0.18em]">
          {item.quantityLabel}
        </p>
      )}
    </div>
  );
}

function CartSkeleton() {
  const rows = (
    <div className="divide-y divide-base-300">
      {[0, 1].map((index) => (
        <div key={index} className="animate-pulse px-4 py-4 sm:px-5 sm:py-5">
          <div className="relative flex gap-3 sm:gap-4">
            <div className="h-20 w-20 rounded-lg bg-base-200" />
            <div className="flex-1 space-y-2.5 pt-1 sm:space-y-3">
              <div className="h-5 w-36 rounded-full bg-base-200" />
              <div className="h-4 w-44 rounded-full bg-base-200/70" />
              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="h-10 w-28 rounded-md bg-base-200" />
                <div className="h-8 w-28 rounded-full bg-base-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return <div className={cn(surfaceCardClass, "overflow-hidden")}>{rows}</div>;
}

function CartSummaryCard({
  isDrawer,
  resolved,
  loading,
  resolveError,
  checkingOut,
  checkoutDisabled,
  onCheckout,
}: {
  isDrawer: boolean;
  resolved: ResolvedCartResponse | null;
  loading: boolean;
  resolveError: string | null;
  checkingOut: boolean;
  checkoutDisabled: boolean;
  onCheckout: () => void;
}) {
  return (
    <div className={cn(isDrawer ? "p-0" : "border-t border-base-300 px-4 py-5 sm:px-5 sm:py-6")}>
      <div className="relative">
        {resolved ? (
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-base-content/60 sm:text-[11px] sm:tracking-[0.24em]">
              Total
            </p>
            <div className="mt-2 flex items-end gap-3">
              <p className="text-[2rem] font-semibold leading-none tracking-tight text-base-content sm:text-3xl">
                {formatUsd(resolved.subtotalCents)}
              </p>
              <p className="pb-1 text-sm text-base-content/55">before taxes</p>
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

        <div className={cn(isDrawer ? "mt-4" : "mt-5")}>
          <Button
            onClick={onCheckout}
            disabled={checkoutDisabled}
            className={cn("h-11 w-full justify-center sm:h-12", softButtonClass)}
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
        </div>
      </div>
    </div>
  );
}

function CartRecommendationsSection({ recommendations }: { recommendations: CartRecommendation[] }) {
  if (!recommendations.length) return null;

  return (
    <section className="order-1 xl:order-2 xl:pl-4" aria-labelledby="cart-recommendations-heading">
      <p className={eyebrowClass}>Related products and procedures</p>
      <h2
        id="cart-recommendations-heading"
        className="mt-3 text-3xl/snug sm:text-4xl/snug xl:text-[2.5rem]/snug font-light tracking-tight text-base-content"
      >
        A few thoughtful add-ons.
      </h2>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-base-content/70">
        Based on what&apos;s in your cart and what patients often explore next.
      </p>

      <div className="mt-6 grid grid-flow-col auto-cols-[17.5rem] gap-5 overflow-x-auto pb-2 pr-4 xl:grid-flow-row xl:auto-cols-auto xl:grid-cols-1 xl:gap-8 xl:overflow-visible xl:pr-0">
        {recommendations.map((recommendation) => {
          const fulfillmentCopy =
            recommendation.fulfillment === "appointment"
              ? "Appointment after checkout"
              : "Pickup at the Williamsburg clinic";

          return (
            <article
              key={recommendation.slug}
              className="space-y-3 xl:border-t xl:border-base-300 xl:pt-8 first:xl:border-t-0 first:xl:pt-0"
            >
              <div className="relative aspect-square overflow-hidden rounded-md bg-base-200">
                {recommendation.imagePath ? (
                  <Image
                    src={recommendation.imagePath}
                    alt={recommendation.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1279px) 17.5rem, 24rem"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-primary">
                    {recommendation.kind === "procedure" ? (
                      <Sparkles className="h-8 w-8" />
                    ) : (
                      <ShoppingBag className="h-8 w-8" />
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-base-content/60">
                <span>{recommendation.kind === "procedure" ? "Procedure" : "Product"}</span>
                <span className="text-base-content/35">•</span>
                <span>{recommendation.displayPrice}</span>
              </div>

              <h3 className="text-2xl font-light tracking-tight text-base-content">{recommendation.name}</h3>
              <p className="text-sm leading-6 text-base-content/70">{recommendation.reason}</p>
              <p className="text-xs text-base-content/60">{fulfillmentCopy}</p>

              <div className="flex flex-wrap gap-2 pt-1">
                <AddToCartButton
                  slug={recommendation.slug}
                  kind={recommendation.kind}
                  quantity={recommendation.minQuantity}
                  size="sm"
                />
                <Button asChild size="sm" variant="secondary">
                  <Link href={recommendation.learnMoreHref}>Learn More</Link>
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
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
  const recommendations = useMemo(
    () => (isDrawer || isEmpty ? [] : getCartRecommendations(items.map((item) => item.slug))),
    [isDrawer, isEmpty, items]
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
    if (!isDrawer) {
      return (
        <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-20 md:px-8">
          <p className={eyebrowClass}>Cart</p>
          <h1 className="mt-4 text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light tracking-tight text-base-content">
            Your cart is ready when you are.
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed text-base-content/75">
            Add products or procedures from the site and they&apos;ll appear here as a simple review list before
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
      );
    }

    return (
      <div
        className={cn(
          surfaceCardClass,
          "text-center",
          isDrawer ? "flex h-full flex-col justify-center px-5 py-10 sm:px-6 sm:py-12" : "mx-auto max-w-3xl px-8 py-16"
        )}
      >
        <div className={surfaceAccentClass} />

        <div className="relative">
          <p className={eyebrowClass}>Cart</p>
          <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-base-200 text-primary sm:h-14 sm:w-14">
            <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <h1
            className={cn(
              "mt-6 font-light tracking-tight text-base-content",
              isDrawer ? "text-[1.8rem]/tight sm:text-[2rem]/tight" : "text-[2.6rem]/tight"
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
  const cartBody = (
    <>
      {loading && !resolved && <CartSkeleton />}

      {resolveError && !resolved && !loading && (
        <div className="flex flex-1 flex-col justify-center">
          <div className="rounded-2xl border border-error/20 bg-error/10 p-6">
            <div className="relative flex items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-error/15 text-error sm:h-12 sm:w-12">
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
            <div className="mb-4 rounded-xl border border-error/20 bg-error/10 px-4 py-3.5 text-base-content sm:mb-5 sm:px-5 sm:py-4">
              <p className="font-medium text-error">Unable to fully validate your cart.</p>
              <p className="mt-1 text-sm text-base-content/80">{resolveError}</p>
            </div>
          )}

          <div className={cn(!isDrawer && surfaceCardClass, !isDrawer && "overflow-hidden")}>
            <div className="divide-y divide-base-300">
              {resolvedItems.map((item, index) => {
                const isProcedure = item.kind === "procedure";
                const itemMeta = [
                  isProcedure ? "Procedure" : "Product",
                  item.fulfillment === "appointment" ? "Scheduling after payment" : "Pickup only",
                  item.pricingMode === "increment_credit" ? "Prepaid blocks" : null,
                ]
                  .filter(Boolean)
                  .join(" · ");

                return (
                  <article
                    key={item.slug}
                    className={cn("cart-item-reveal", isDrawer ? "py-4" : "px-4 py-4 sm:px-5 sm:py-5")}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="relative flex gap-3 sm:gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-base-300 bg-base-200 sm:h-24 sm:w-24">
                        {item.imagePath ? (
                          <>
                            <Image
                              src={item.imagePath}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 80px, 96px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                          </>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-primary">
                            {isProcedure ? <Sparkles className="h-8 w-8" /> : <ShoppingBag className="h-8 w-8" />}
                          </div>
                        )}
                      </div>

                      <div className="relative min-w-0 flex-1">
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.slug)}
                          className="absolute right-0 top-0 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-base-300 bg-base-100 text-base-content/70 transition-colors duration-150 hover:bg-base-200 hover:text-base-content focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 sm:h-9 sm:w-9"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        <div className="pr-10 sm:pr-12">
                          <h2 className="text-[1.05rem] font-semibold tracking-tight text-base-content sm:text-lg">
                            {item.name}
                          </h2>
                          <p className="mt-1.5 text-sm leading-5 text-base-content/65">{itemMeta}</p>
                        </div>

                        <div className="mt-4 flex items-end justify-between gap-4 sm:mt-5">
                          <div className="shrink-0">
                            <QuantityControl
                              item={item}
                              onChange={(nextQuantity) => setQuantity(item.slug, nextQuantity)}
                              compact
                              hideLabel
                            />
                          </div>

                          <div className="ml-auto text-right">
                            <p className="text-[1.3rem] font-semibold leading-none tracking-tight text-base-content sm:text-[1.65rem]">
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
              <CartSummaryCard
                isDrawer={false}
                resolved={resolved}
                loading={loading}
                resolveError={resolveError}
                checkingOut={checkingOut}
                checkoutDisabled={checkoutDisabled}
                onCheckout={handleCheckout}
              />
            )}
          </div>
        </>
      )}
    </>
  );

  if (isDrawer) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto sm:pr-1">{cartBody}</div>

        {showDrawerFooter && (
          <div className="-mx-4 -mb-4 mt-3 shrink-0 border-t border-base-300 bg-base-100/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:-mb-5 sm:mt-5 sm:px-6 sm:py-4">
            <CartSummaryCard
              isDrawer
              resolved={resolved}
              loading={loading}
              resolveError={resolveError}
              checkingOut={checkingOut}
              checkoutDisabled={checkoutDisabled}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16 md:px-8">
      <div className="mb-10 text-center sm:mb-14">
        <p className={eyebrowClass}>Checkout</p>
        <h1 className="mt-4 text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light tracking-tight text-base-content">
          Review your selections before checkout.
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed text-base-content/75">
          Confirm your products and procedures, then add anything else that fits before paying online and choosing
          your next steps.
        </p>
      </div>

      <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] xl:items-start xl:gap-10">
        <CartRecommendationsSection recommendations={recommendations} />

        <section className={cn("order-2 xl:order-1", !recommendations.length && "mx-auto w-full max-w-4xl")}>
          <p className={cn(eyebrowClass, "mb-4")}>Current cart</p>
          {cartBody}
        </section>
      </div>
    </div>
  );
}
