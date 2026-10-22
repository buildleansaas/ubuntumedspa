export type SpaMembershipPeriod = "monthly" | "yearly";

export const SPA_MEMBERSHIP_MIN_AMOUNT_DOLLARS = 100;
export const SPA_MEMBERSHIP_DEFAULT_MONTHLY_DOLLARS = 200;
export const SPA_MEMBERSHIP_DEFAULT_YEARLY_DOLLARS = 1200;
export const SPA_MEMBERSHIP_STEP_DOLLARS = 100;

export const SPA_MEMBERSHIP_PROCESSING_FEE_PERCENT = 0.029;
export const SPA_MEMBERSHIP_PROCESSING_FEE_FIXED_CENTS = 30;

export const SPA_MEMBERSHIP_METADATA_PRODUCT_LINE = "williamsburgmedspa_spa_membership";

export const membershipPeriodLabel = (period: SpaMembershipPeriod) => (period === "yearly" ? "year" : "month");

export const formatCurrency = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);

export const normalizeMembershipAmountCents = (amountDollars: unknown) => {
  const parsed = typeof amountDollars === "number" ? amountDollars : Number(amountDollars);

  if (!Number.isFinite(parsed)) return null;

  const roundedCents = Math.round(parsed * 100);
  const minimumCents = SPA_MEMBERSHIP_MIN_AMOUNT_DOLLARS * 100;

  if (roundedCents < minimumCents) return null;

  return roundedCents;
};

export const calculateProcessingFeeCents = (creditCents: number) => {
  const totalWithFees = Math.ceil(
    (creditCents + SPA_MEMBERSHIP_PROCESSING_FEE_FIXED_CENTS) / (1 - SPA_MEMBERSHIP_PROCESSING_FEE_PERCENT)
  );

  return Math.max(totalWithFees - creditCents, 0);
};

export const membershipAmountSummary = ({
  creditCents,
  period,
}: {
  creditCents: number;
  period: SpaMembershipPeriod;
}) => {
  const processingFeeCents = calculateProcessingFeeCents(creditCents);
  const totalCents = creditCents + processingFeeCents;
  const periodLabel = membershipPeriodLabel(period);

  return {
    creditCents,
    processingFeeCents,
    totalCents,
    periodLabel,
    creditLabel: `${formatCurrency(creditCents)} / ${periodLabel}`,
    processingFeeLabel: `${formatCurrency(processingFeeCents)} / ${periodLabel}`,
    totalLabel: `${formatCurrency(totalCents)} / ${periodLabel}`,
  };
};
