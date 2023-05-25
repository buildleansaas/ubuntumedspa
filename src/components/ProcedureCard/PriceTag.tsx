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
    <div {...rootProps} className="flex items-center space-x-1">
      <Price
        textProps={priceProps}
        isOnSale={!!salePrice}
        className={`font-medium ${salePrice ? "text-gray-400 line-through" : "text-gray-700"}`}
      >
        {formatPrice(price, { currency })}
      </Price>
      {salePrice && (
        <SalePrice {...salePriceProps} className="text-gray-800 font-semibold">
          {formatPrice(salePrice, { currency })}
        </SalePrice>
      )}
    </div>
  );
};

interface PriceProps {
  children?: React.ReactNode;
  isOnSale?: boolean;
  textProps?: React.HTMLAttributes<HTMLParagraphElement>;
  className?: string;
}

const Price = ({ children, textProps, className }: PriceProps) => {
  return (
    <p className={`text-lg ${className}`} {...textProps}>
      {children}
    </p>
  );
};

const SalePrice = (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props} />;
