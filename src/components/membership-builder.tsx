"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  ADD_ONS,
  CONCERNS,
  MEMBERSHIP_NOTES,
  membershipTotals,
  type AddOnSlug,
  type MembershipSelection,
  type XeominFrequency,
  type XeominLevel,
} from "config/membership";
import { cardPriceLabel, formatUsdShort } from "lib/price";

// Answers live in component state only: never in the URL, storage, analytics, or a request.
type Step = 1 | 2 | 3;

const StepDots = ({ step }: { step: Step }) => (
  <ol className="flex items-center gap-2 text-xs text-base-content/60" aria-label="Progress">
    {(["What you'd like help with", "How often", "Your plan"] as const).map((label, index) => (
      <li key={label} className="flex items-center gap-2">
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-semibold ${
            index + 1 <= step ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/60"
          }`}
          aria-current={index + 1 === step ? "step" : undefined}
        >
          {index + 1}
        </span>
        <span className="hidden sm:inline">{label}</span>
        {index < 2 && <span className="mx-1 h-px w-6 bg-base-300" aria-hidden="true" />}
      </li>
    ))}
  </ol>
);

const Toggle = ({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={onChange}
    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
      on ? "bg-primary" : "bg-base-300"
    }`}
  >
    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-6" : "translate-x-1"}`} />
  </button>
);

export default function MembershipBuilder() {
  const [step, setStep] = useState<Step>(1);
  const topRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  // Each new step starts at the top of the builder, not wherever the last step was scrolled.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [selection, setSelection] = useState<MembershipSelection>({ xeomin: "none", frequency: 3, addOns: [] });
  const totals = useMemo(() => membershipTotals(selection), [selection]);

  const toggleConcern = (id: string) =>
    setConcerns((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const applyConcerns = () => {
    const picked = CONCERNS.filter((concern) => concerns.includes(concern.id));
    const xeomin: XeominLevel = picked.some((concern) => concern.turnsOn.xeomin === "plus")
      ? "plus"
      : picked.some((concern) => concern.turnsOn.xeomin === "standard")
        ? "standard"
        : "none";
    const addOns = picked.flatMap((concern) => (concern.turnsOn.addOn ? [concern.turnsOn.addOn] : []));
    setSelection((current) => ({ ...current, xeomin, addOns }));
    setStep(xeomin === "none" ? 3 : 2);
  };

  const setXeomin = (xeomin: XeominLevel) => setSelection((current) => ({ ...current, xeomin }));
  const setFrequency = (frequency: XeominFrequency) => setSelection((current) => ({ ...current, frequency }));
  const toggleAddOn = (slug: AddOnSlug) =>
    setSelection((current) => ({
      ...current,
      addOns: current.addOns.includes(slug) ? current.addOns.filter((item) => item !== slug) : [...current.addOns, slug],
    }));

  const summary = (
    <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm" data-membership-summary>
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/60">Your year with Jenny</p>
      {totals.lines.length === 0 ? (
        <p className="mt-4 text-base text-base-content/70">Turn on a package to see your yearly price.</p>
      ) : (
        <>
          <ul className="mt-4 space-y-3">
            {totals.lines.map((line) => (
              <li key={line.key} className="flex items-start justify-between gap-4 text-sm">
                <span>
                  <span className="font-medium text-base-content">{line.label}</span>
                  <span className="block text-base-content/60">{line.includes}</span>
                </span>
                <span className="text-base-content/70">{formatUsdShort(line.regularCents)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-1 border-t border-base-300 pt-4 text-sm">
            <div className="flex justify-between text-base-content/70">
              <span>Regular price</span>
              <s>{formatUsdShort(totals.regularCents)}</s>
            </div>
            <div className="flex justify-between font-medium text-primary">
              <span>You save {Math.round(totals.rate * 100)}%</span>
              <span>−{formatUsdShort(totals.savedCents)}</span>
            </div>
          </div>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-base-content" data-membership-price>
            {formatUsdShort(totals.memberCents)} <span className="text-base font-normal text-base-content/60">cash / year</span>
          </p>
          <p className="text-sm text-base-content/60">{cardPriceLabel(totals.memberCents)} by card or online</p>
          <button
            type="button"
            disabled
            className="mt-5 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-content opacity-60"
            title="Checkout is the next step of the build"
          >
            Start my year (checkout coming next)
          </button>
          <p className="mt-3 text-xs text-base-content/60">
            {totals.lines.length === 1 ? "Add one more package to save 10%." : "Best savings: 10% off with two or more packages."}
          </p>
        </>
      )}
    </div>
  );

  return (
    <div ref={topRef} className="scroll-mt-28 pb-28 lg:pb-0">
      <StepDots step={step} />

      {step === 1 && (
        <section className="mt-8" aria-labelledby="step-concerns">
          <h2 id="step-concerns" className="font-display text-3xl font-medium tracking-tight text-base-content md:text-4xl">
            What would you like help with this year?
          </h2>
          <p className="mt-3 text-base text-base-content/75">Choose everything that applies. Your answers stay on this page.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {CONCERNS.map((concern) => {
              const on = concerns.includes(concern.id);
              return (
                <button
                  key={concern.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleConcern(concern.id)}
                  className={`rounded-2xl border p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    on ? "border-primary bg-primary/5" : "border-base-300 bg-base-100 hover:border-primary/50"
                  }`}
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-base font-medium text-base-content">{concern.label}</span>
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                        on ? "border-primary bg-primary text-primary-content" : "border-base-300"
                      }`}
                      aria-hidden="true"
                    >
                      {on ? "✓" : ""}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-base-content/60">{concern.detail}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={applyConcerns}
              disabled={concerns.length === 0}
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-content disabled:opacity-50"
            >
              See my plan
            </button>
            <button type="button" onClick={() => setStep(3)} className="text-sm text-base-content/70 underline underline-offset-4">
              Skip and build it myself
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="mt-8" aria-labelledby="step-frequency">
          <h2 id="step-frequency" className="font-display text-3xl font-medium tracking-tight text-base-content md:text-4xl">
            How often do you want lines softened?
          </h2>
          <p className="mt-3 text-base text-base-content/75">Xeomin usually lasts about 3 to 4 months. Results vary.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {([
              [1, "Once a year", "A refresh before a big event"],
              [2, "Twice a year", "Spring and fall"],
              [3, "Three times a year", "About every 4 months, the usual rhythm"],
            ] as const).map(([frequency, label, detail]) => (
              <button
                key={frequency}
                type="button"
                aria-pressed={selection.frequency === frequency}
                onClick={() => setFrequency(frequency)}
                className={`rounded-2xl border p-5 text-left transition-colors ${
                  selection.frequency === frequency ? "border-primary bg-primary/5" : "border-base-300 bg-base-100 hover:border-primary/50"
                }`}
              >
                <span className="block text-base font-medium text-base-content">{label}</span>
                <span className="mt-1 block text-sm text-base-content/60">{detail}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 flex gap-4">
            <button type="button" onClick={() => setStep(3)} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-content">
              See my plan
            </button>
            <button type="button" onClick={() => setStep(1)} className="text-sm text-base-content/70 underline underline-offset-4">
              Back
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]" aria-labelledby="step-plan">
          <div>
            <h2 id="step-plan" className="font-display text-3xl font-medium tracking-tight text-base-content md:text-4xl">
              Your plan for the year
            </h2>
            <p className="mt-3 text-base text-base-content/75">Turn packages on or off. Prices update as you go.</p>

            <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-base-content">Xeomin</p>
                  <p className="text-sm text-base-content/60">Our wrinkle relaxer, a Botox® alternative</p>
                </div>
                <Toggle on={selection.xeomin !== "none"} onChange={() => setXeomin(selection.xeomin === "none" ? "standard" : "none")} label="Xeomin" />
              </div>
              {selection.xeomin !== "none" && (
                <div className="mt-4 space-y-3">
                  <div className="inline-flex rounded-full border border-base-300 p-1 text-sm">
                    {(["standard", "plus"] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        aria-pressed={selection.xeomin === level}
                        onClick={() => setXeomin(level)}
                        className={`rounded-full px-4 py-1.5 ${selection.xeomin === level ? "bg-primary text-primary-content" : "text-base-content/70"}`}
                      >
                        {level === "standard" ? "Standard" : "Plus (double)"}
                      </button>
                    ))}
                  </div>
                  <div className="inline-flex rounded-full border border-base-300 p-1 text-sm sm:ml-3">
                    {([1, 2, 3] as const).map((frequency) => (
                      <button
                        key={frequency}
                        type="button"
                        aria-pressed={selection.frequency === frequency}
                        onClick={() => setFrequency(frequency)}
                        className={`rounded-full px-4 py-1.5 ${selection.frequency === frequency ? "bg-primary text-primary-content" : "text-base-content/70"}`}
                      >
                        {frequency}× a year
                      </button>
                    ))}
                  </div>
                  {selection.xeomin === "plus" && (
                    <p className="text-sm text-base-content/60">For several areas, or extra help with summer sweating.</p>
                  )}
                </div>
              )}
            </div>

            <ul className="mt-4 space-y-4">
              {ADD_ONS.map((addOn) => (
                <li key={addOn.slug} className="flex items-start justify-between gap-4 rounded-2xl border border-base-300 bg-base-100 p-5">
                  <div>
                    <p className="font-medium text-base-content">{addOn.name}</p>
                    <p className="text-sm text-base-content/60">
                      {addOn.includes} · {formatUsdShort(addOn.cashCents)} value
                    </p>
                  </div>
                  <Toggle on={selection.addOns.includes(addOn.slug)} onChange={() => toggleAddOn(addOn.slug)} label={addOn.name} />
                </li>
              ))}
            </ul>

            <ul className="mt-6 space-y-1 text-sm text-base-content/60">
              {MEMBERSHIP_NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <button type="button" onClick={() => setStep(1)} className="mt-6 text-sm text-base-content/70 underline underline-offset-4">
              Start over
            </button>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28">{summary}</div>
          </div>
          <div className="lg:hidden">{summary}</div>
        </section>
      )}

      {step === 3 && totals.lines.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-base-300 bg-base-100/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-base-content">{formatUsdShort(totals.memberCents)} / year</p>
              <p className="text-xs text-base-content/60">You save {Math.round(totals.rate * 100)}%</p>
            </div>
            <a href="#step-plan" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-content">
              Review plan
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
