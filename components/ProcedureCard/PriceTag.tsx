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
    <div {...rootProps} className="flex items-center space-x-2">
      <Price textProps={priceProps} className={`${salePrice ? "line-through" : ""} text-gray-500`}>
        {formatPrice(price, { currency })}
      </Price>
      {salePrice && (
        <SalePrice {...salePriceProps} className="text-xl font-semibold text-gray-900">
          {formatPrice(salePrice, { currency })}
        </SalePrice>
      )}
    </div>
  );
};

interface PriceProps {
  children?: React.ReactNode;
  textProps?: React.HTMLAttributes<HTMLParagraphElement>;
  textDecoration?: string;
  className?: string;
}

const Price = ({ children, textProps, textDecoration = "none", className }: PriceProps) => {
  return (
    <p className={`text-lg font-medium ${textDecoration} ${className}`} {...textProps}>
      {children}
    </p>
  );
};

const SalePrice = (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props} />;
