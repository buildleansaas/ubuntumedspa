"use client";

import { useMemo, useState } from "react";

import {
  SPA_MEMBERSHIP_DEFAULT_MONTHLY_DOLLARS,
  SPA_MEMBERSHIP_DEFAULT_YEARLY_DOLLARS,
  SPA_MEMBERSHIP_MIN_AMOUNT_DOLLARS,
  SPA_MEMBERSHIP_STEP_DOLLARS,
  SpaMembershipPeriod,
  membershipAmountSummary,
} from "lib/spa-membership";

const quickAmounts = {
  monthly: [
    { amount: 200, label: "Botox or Xeomin maintenance starter" },
    { amount: 300, label: "Injectables + skin planning" },
    { amount: 500, label: "PRP, skin, or larger treatment savings" },
  ],
  yearly: [
    { amount: 1200, label: "Light annual treatment budget" },
    { amount: 2400, label: "Regular injectables planning" },
    { amount: 3600, label: "Advanced treatment savings" },
  ],
} as const;

const clampAmount = (value: number) => Math.max(SPA_MEMBERSHIP_MIN_AMOUNT_DOLLARS, Math.round(value));

export default function MembershipAmountPicker() {
  const [period, setPeriod] = useState<SpaMembershipPeriod>("monthly");
  const [amount, setAmount] = useState(SPA_MEMBERSHIP_DEFAULT_MONTHLY_DOLLARS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(
    () => membershipAmountSummary({ creditCents: amount * 100, period }),
    [amount, period]
  );

  const setBillingPeriod = (nextPeriod: SpaMembershipPeriod) => {
    setPeriod(nextPeriod);
    setAmount(nextPeriod === "yearly" ? SPA_MEMBERSHIP_DEFAULT_YEARLY_DOLLARS : SPA_MEMBERSHIP_DEFAULT_MONTHLY_DOLLARS);
    setError(null);
  };

  const startCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/spa-membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountDollars: amount, period }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Checkout is not available yet.");
      }

      window.location.href = payload.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Checkout is not available yet.");
      setIsLoading(false);
    }
  };

  const yearlyProjection = period === "monthly" ? amount * 12 : amount;
  const monthlyEquivalent = period === "yearly" ? Math.round(amount / 12) : amount;

  return (
    <section id="custom-amount" className="w-full rounded-[2rem] border border-base-300 bg-base-100 p-5 shadow-xl shadow-base-content/5 sm:p-7 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Custom amount builder</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Choose the amount you want to set aside</h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-base-content/70">
            Start with a suggested amount or type your own. Your selected amount becomes treatment credit toward eligible procedures based on current listed prices, subject to change.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/60">
            Use the same name, email, and phone at checkout and booking so Williamsburg Med Spa can match your balance to your visit.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-base-300 bg-base-200 p-1">
            {(["monthly", "yearly"] as SpaMembershipPeriod[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setBillingPeriod(option)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  period === option ? "bg-primary text-primary-content shadow" : "text-base-content/70 hover:text-base-content"
                }`}
              >
                {option === "monthly" ? "Monthly" : "Yearly"}
              </button>
            ))}
          </div>

          <div className="mt-7 rounded-3xl bg-base-200 p-5 sm:p-6">
            <label htmlFor="membership-amount" className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">
              Custom amount
            </label>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setAmount((current) => clampAmount(current - SPA_MEMBERSHIP_STEP_DOLLARS))}
                className="rounded-full border border-base-300 bg-base-100 px-5 py-3 font-semibold hover:bg-base-300"
              >
                - $100
              </button>
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-base-content/50">$</span>
                <input
                  id="membership-amount"
                  inputMode="numeric"
                  min={SPA_MEMBERSHIP_MIN_AMOUNT_DOLLARS}
                  value={amount}
                  onChange={(event) => {
                    const next = Number(event.target.value.replace(/[^0-9]/g, ""));
                    setAmount(Number.isFinite(next) && next > 0 ? next : SPA_MEMBERSHIP_MIN_AMOUNT_DOLLARS);
                  }}
                  className="w-full rounded-2xl border border-base-300 bg-base-100 py-4 pl-10 pr-4 text-center text-4xl font-semibold tracking-tight focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <button
                type="button"
                onClick={() => setAmount((current) => clampAmount(current + SPA_MEMBERSHIP_STEP_DOLLARS))}
                className="rounded-full border border-base-300 bg-base-100 px-5 py-3 font-semibold hover:bg-base-300"
              >
                + $100
              </button>
            </div>
            <p className="mt-3 text-sm text-base-content/60">Use the buttons to move in $100 steps, or type any amount manually.</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {quickAmounts[period].map((option) => (
              <button
                key={option.amount}
                type="button"
                onClick={() => setAmount(option.amount)}
                className={`rounded-2xl border p-4 text-left transition ${
                  amount === option.amount ? "border-primary bg-primary/10" : "border-base-300 bg-base-100 hover:border-primary/50"
                }`}
              >
                <span className="block text-lg font-semibold">${option.amount.toLocaleString()}{period === "monthly" ? "/mo" : "/year"}</span>
                <span className="mt-1 block text-sm text-base-content/65">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-[1.75rem] bg-[#f7efe8] p-5 text-[#342a24] shadow-inner sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7d5d4d]">Checkout summary</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">Treatment credit</p>
                <p className="text-sm text-[#6e5b51]">Credited to your Spa Membership balance.</p>
              </div>
              <p className="font-semibold">{summary.creditLabel}</p>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-[#d9c7ba] pt-4">
              <div>
                <p className="font-semibold">Estimated processing</p>
                <p className="text-sm text-[#6e5b51]">Added so the selected amount remains credit.</p>
              </div>
              <p className="font-semibold">{summary.processingFeeLabel}</p>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-[#d9c7ba] pt-4 text-xl">
              <p className="font-semibold">Estimated checkout total</p>
              <p className="font-bold">{summary.totalLabel}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white/65 p-4 text-sm leading-6 text-[#5f4d44]">
            {period === "monthly" ? (
              <p>${amount.toLocaleString()}/month builds ${yearlyProjection.toLocaleString()} in treatment credit over 12 months before processing fees.</p>
            ) : (
              <p>${amount.toLocaleString()}/year is about ${monthlyEquivalent.toLocaleString()}/month in planned treatment credit before processing fees.</p>
            )}
          </div>

          {error && <p className="mt-4 rounded-2xl bg-error/10 p-3 text-sm font-medium text-error">{error}</p>}

          <button
            type="button"
            onClick={startCheckout}
            disabled={isLoading}
            className="mt-5 w-full rounded-full bg-primary px-5 py-4 text-base font-semibold text-primary-content shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Opening checkout..." : "Continue to secure checkout"}
          </button>
          <p className="mt-3 text-xs leading-5 text-[#6e5b51]">
            Terms: your selected amount becomes treatment credit toward eligible Williamsburg Med Spa procedures at current listed prices, subject to change. Treatment candidacy and recommendations are confirmed during consultation.
          </p>
          <p className="mt-2 text-xs leading-5 text-[#6e5b51]">
            Use the same name, email, and phone when booking so the team can match your Spa Membership balance.
          </p>
        </aside>
      </div>
    </section>
  );
}
