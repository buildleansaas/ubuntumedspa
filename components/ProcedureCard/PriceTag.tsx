import * as React from "react";

export function formatPrice(value: number, opts: { locale?: string; currency?: string } = {}) {
  const { locale = "en-US", currency = "USD" } = opts;
  const formatter = new Intl.NumberFormat(locale, {
    currency,
    style: "currency",
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}

interface PriceTagProps {
  currency: string;
  price: number;
  salePrice?: number;
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
  priceProps?: React.HTMLAttributes<HTMLParagraphElement>;
  salePriceProps?: React.HTMLAttributes<HTMLParagraphElement>;
}

export const PriceTag = ({ price, currency, salePrice, rootProps, priceProps, salePriceProps }: PriceTagProps) => {
  return (
    <div {...rootProps}>
      <Price
        textProps={priceProps}
        color={salePrice ? "#6B7280" : "#4A5568"}
        textDecoration={salePrice ? "line-through" : "none"}
      >
        {formatPrice(price, { currency })}
      </Price>
      {salePrice && (
        <SalePrice {...salePriceProps} fontWeight="semibold" color="#1F2937">
          {formatPrice(salePrice, { currency })}
        </SalePrice>
      )}
    </div>
  );
};

interface PriceProps {
  children?: React.ReactNode;
  textProps?: React.HTMLAttributes<HTMLParagraphElement>;
  color?: string;
  textDecoration?: string;
}

const Price = ({ children, textProps, color = "#4A5568", textDecoration = "none" }: PriceProps) => {
  return (
    <p style={{ fontWeight: "medium", color, textDecoration }} {...textProps}>
      {children}
    </p>
  );
};

const SalePrice = (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props} />;
