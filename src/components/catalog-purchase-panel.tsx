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
  return (
    <div className="max-w-3xl mx-auto my-8 rounded-2xl border border-base-300 bg-base-200 p-6 text-left">
      <p className="text-sm uppercase tracking-[0.18em] text-base-content/60 mb-2">
        {kind === "procedure" ? "Purchase Details" : "Reserve for Pickup"}
      </p>
      <h2 className="text-2xl font-semibold">{name}</h2>
      <p className="text-lg text-base-content/80 mt-2">{displayPrice}</p>
      <p className="text-sm text-base-content/70 mt-2">
        {fulfillment === "appointment"
          ? "Pay online first, then choose one appointment time after checkout."
          : "Products are paid online and held for pickup."}
      </p>
      {customerNote && <p className="text-sm text-base-content/70 mt-2">{customerNote}</p>}

      <div className="flex flex-wrap gap-3 mt-6">
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
  );
}
