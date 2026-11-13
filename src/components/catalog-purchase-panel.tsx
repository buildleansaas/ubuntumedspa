"use client";

import CatalogAddToCartControl from "components/catalog-add-to-cart-control";
import OpenCartButton from "components/open-cart-button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { CASH_CARD_NOTE, formatUsdShort } from "lib/price";
import { cn } from "lib/utils";

type Props = {
  slug: string;
  kind: "product" | "procedure";
  name: string;
  displayPrice: string;
  pricingMode: "fixed" | "quantity" | "increment_credit";
  unitAmountCents: number;
  quantityLabel: string;
  minQuantity: number;
  maxQuantity: number;
  fulfillment: "pickup" | "appointment";
  purchaseLabel?: string;
  customerNote?: string;
  /** The surrounding section already states the price and how credit works (Xeomin concern pages): show them once. */
  hidePrice?: boolean;
  className?: string;
};

type PriceParts = { cash: string; cashSuffix: string; card: string };

/**
 * Splits the catalog display price ("$45 per ear or $80 for both ears cash · $46.66 or $82.70 card/online")
 * into the cash part (shown large) and the card/online part (shown smaller). The rendered text keeps the
 * exact catalog wording and order, so no price is ever typed here.
 */
const splitDisplayPrice = (displayPrice: string, pricingMode: Props["pricingMode"], cashAmountCents?: number, cardAmountCents?: number): PriceParts => {
  // Credit-block items read "$250 credit blocks · $250 cash · $257.78 card/online": show the block price once.
  if (pricingMode === "increment_credit" && cashAmountCents !== undefined && cardAmountCents !== undefined) {
    return {
      cash: formatUsdShort(cashAmountCents),
      cashSuffix: "cash per credit block",
      card: `${formatUsdShort(cardAmountCents)} card/online`,
    };
  }
  const parts = displayPrice.split(" · ");
  const card = parts.length > 1 ? parts[parts.length - 1] : "";
  const cashPart = parts.length > 1 ? parts.slice(0, -1).join(" · ") : displayPrice;
  const cashMatch = cashPart.match(/^(.*?)( cash)$/);
  return cashMatch ? { cash: cashMatch[1], cashSuffix: "cash", card } : { cash: cashPart, cashSuffix: "", card };
};

export default function CatalogPurchasePanel({
  slug,
  kind,
  name,
  displayPrice,
  pricingMode,
  unitAmountCents,
  quantityLabel,
  minQuantity,
  maxQuantity,
  fulfillment,
  purchaseLabel,
  customerNote,
  hidePrice = false,
  className,
}: Props) {
  const isAppointment = fulfillment === "appointment";
  const catalogItem = getCatalogConfigBySlug(slug);
  const price = splitDisplayPrice(displayPrice, pricingMode, catalogItem?.cashAmountCents, catalogItem?.unitAmountCents);
  // Credit-block notes repeat the price already shown above; keep only how the credit works.
  const explainer =
    pricingMode === "increment_credit" && catalogItem
      ? `Each block adds ${formatUsdShort(catalogItem.cashAmountCents)} of treatment credit, and any unused value remains as account credit.`
      : customerNote;
  const longCash = price.cash.length > 14;

  return (
    <div
      data-booking-card
      className={cn(
        "w-full rounded-2xl border border-base-300 bg-base-100 p-6 text-left shadow-[0_1px_2px_rgba(36,49,58,0.04),0_12px_32px_-16px_rgba(36,49,58,0.18)] sm:p-8",
        className
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-2xl font-light tracking-tight text-base-content">{name}</h2>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-base-content/60">
          {purchaseLabel || (kind === "procedure" ? "Reserve appointment" : "Reserve for pickup")}
        </p>
      </div>

      {!hidePrice && (
      <p className="mt-5 border-b border-base-300 pb-5">
        <span className="block text-balance">
          <span
            className={cn(
              "font-display font-light tracking-tight text-base-content tabular-nums",
              longCash ? "text-2xl leading-snug md:text-[1.7rem]" : "text-5xl leading-none"
            )}
          >
            {price.cash}
          </span>
          {price.cashSuffix && <span className="ml-2 text-base text-base-content/75">{price.cashSuffix}</span>}
        </span>
        {price.card && (
          <>
            <span className="sr-only"> · </span>
            <span className="mt-2 block text-sm text-base-content/65">{price.card}</span>
          </>
        )}
      </p>
      )}

      <div className="mt-5 space-y-2 text-sm leading-relaxed text-base-content/75">
        <p>
          {isAppointment
            ? "Pay online first, then text or call Jenny to book your appointment."
            : "Products are paid online and held for pickup."}
        </p>
        {explainer && !hidePrice && <p>{explainer}</p>}
      </div>

      <CatalogAddToCartControl
        slug={slug}
        kind={kind}
        pricingMode={pricingMode}
        unitAmountCents={unitAmountCents}
        quantityLabel={quantityLabel}
        minQuantity={minQuantity}
        maxQuantity={maxQuantity}
        showSubtotal
        className="mt-6"
      />
      <OpenCartButton variant="outline" size="lg" className="mt-3 w-full">
        View Cart
      </OpenCartButton>

      <p className="mt-5 text-xs leading-5 text-base-content/60">{CASH_CARD_NOTE}</p>
    </div>
  );
}
