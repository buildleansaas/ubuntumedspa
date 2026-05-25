"use client";

import CatalogAddToCartControl from "components/catalog-add-to-cart-control";
import OpenCartButton from "components/open-cart-button";

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
  customerNote?: string;
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
  customerNote,
}: Props) {
  const isAppointment = fulfillment === "appointment";

  return (
    <div className="mx-auto mt-8 max-w-4xl border-y border-base-300 py-6 text-left">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {kind === "procedure" ? "Reserve appointment" : "Reserve for pickup"}
          </p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h2 className="text-2xl font-light tracking-tight text-base-content">{name}</h2>
            <p className="text-xl font-semibold text-base-content">{displayPrice}</p>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-base-content/70">
            {isAppointment
              ? "Pay online first, then choose one appointment time after checkout."
              : "Products are paid online and held for pickup."}
          </p>
          {customerNote && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-base-content/70">{customerNote}</p>}
        </div>

        <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <CatalogAddToCartControl
              slug={slug}
              kind={kind}
              pricingMode={pricingMode}
              unitAmountCents={unitAmountCents}
              quantityLabel={quantityLabel}
              minQuantity={minQuantity}
              maxQuantity={maxQuantity}
              showSubtotal
            />
            <OpenCartButton variant="secondary">View Cart</OpenCartButton>
          </div>
        </div>
      </div>
    </div>
  );
}
