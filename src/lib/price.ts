const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatUsd = (amountCents: number) => usdFormatter.format(amountCents / 100);
