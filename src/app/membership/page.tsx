import type { Metadata } from "next";
import Link from "next/link";

import MembershipAmountPicker from "./membership-amount-picker";

export const metadata: Metadata = {
  title: "Med Spa Membership in Williamsburg, VA | Treatment Credit",
  description:
    "Choose a monthly or yearly med spa credit amount for Botox, Xeomin, PRP, skin, and wellness treatments at Williamsburg Med Spa. Start at $100.",
  alternates: { canonical: "/membership" },
  openGraph: {
    title: "Med Spa Membership in Williamsburg, VA | Treatment Credit",
    description:
      "Choose a monthly or yearly amount, build treatment credit, and use your balance toward eligible Williamsburg Med Spa services.",
    url: "/membership",
  },
};

const treatments = [
  {
    title: "Botox and Xeomin",
    href: "/procedures/botox",
    body: "Plan ahead for regular injectable visits without waiting until appointment day to budget for the full amount.",
  },
  {
    title: "PRP treatments",
    href: "/procedures/microneedling-with-prp",
    body: "Build toward PRP services, including facial rejuvenation or hair-restoration conversations, when you are ready to commit to a larger treatment plan.",
  },
  {
    title: "Skin and wellness services",
    href: "/procedures",
    body: "Use your balance as a flexible treatment fund for eligible skin, wellness, and future med spa services recommended by the Williamsburg Med Spa team.",
  },
];

const steps = [
  ["Pick your monthly or yearly amount", "Start at $200/month or choose any custom amount that fits the procedures you want to keep up with."],
  [
    "Your treatment credit builds automatically",
    "Your selected amount is added to your Williamsburg Med Spa balance. Processing fees are charged separately so your full selected amount remains available as treatment credit.",
  ],
  [
    "Use your balance when you are ready",
    "Apply your balance toward eligible Botox, Xeomin, PRP, skin, wellness, or future treatments based on your consultation plan.",
  ],
  [
    "Stay consistent without the surprise bill",
    "The goal is simple: make it easier to stick with the treatment cadence you already want by budgeting for it ahead of time.",
  ],
] as const;

const faqs = [
  {
    question: "Is this a Botox membership?",
    answer:
      "It can be. Many clients may use the Spa Membership to plan ahead for Botox or Xeomin, starting around $200/month. The balance is flexible treatment credit, so it may also be used toward eligible PRP, skin, wellness, or future services.",
  },
  {
    question: "Can I choose my own amount?",
    answer: "Yes. You can choose a suggested amount, move up or down in $100 steps, or type a custom amount manually.",
  },
  {
    question: "Can I pay monthly or yearly?",
    answer: "Yes. You can choose a monthly membership or a yearly membership depending on how you prefer to budget.",
  },
  {
    question: "What do I actually receive?",
    answer:
      "You receive treatment credit in the amount you choose. For example, a $100 membership amount gives you $100 in credit toward eligible procedures based on current listed prices, subject to change. Processing fees are added separately at checkout.",
  },
  {
    question: "How does the team match my balance when I book?",
    answer:
      "Use the same name, email address, and phone number when you check out and when you book. That gives the Williamsburg Med Spa team the clearest way to match your Spa Membership balance to your appointment.",
  },
  {
    question: "Are processing fees included?",
    answer: "Processing fees are added at checkout so your selected membership amount can go into your treatment credit balance.",
  },
  {
    question: "Does membership guarantee Botox, Xeomin, or PRP treatment?",
    answer:
      "No. Your balance is treatment credit. Actual treatment recommendations depend on consultation, candidacy, timing, provider guidance, and current listed prices.",
  },
  {
    question: "Can I use my balance on PRP or skin services?",
    answer:
      "Yes, the Spa Membership is intended to be flexible for eligible Williamsburg Med Spa services, including Botox, Xeomin, PRP, skin, wellness, and future treatments.",
  },
  {
    question: "Can I buy this as a gift?",
    answer:
      "For gifts, use Williamsburg Med Spa gift cards instead of a recurring Spa Membership. Gift cards can be purchased for a chosen amount and sent digitally or printed.",
  },
];

export default function MembershipPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="w-full max-w-7xl pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:py-14">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Williamsburg Med Spa Membership</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Keep up with your treatments without the appointment-day bill shock
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-base-content/75">
            Choose a monthly or yearly amount, build treatment credit automatically, and use your balance toward Botox, Xeomin, PRP, skin, wellness, and eligible future treatments at Williamsburg Med Spa.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="#custom-amount" className="rounded-full bg-primary px-6 py-3 text-center font-semibold text-primary-content shadow-lg shadow-primary/20 hover:bg-primary/90">
              Choose my membership amount
            </Link>
          </div>
          <p className="mt-4 text-sm text-base-content/60">
            Starts at $100/month. A $100 membership amount gives you $100 in treatment credit. Processing fees are added separately.
          </p>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:max-w-3xl">
            {[
              "Your selected amount becomes treatment credit",
              "Use it toward eligible procedures",
              "Choose monthly or yearly billing",
              "Manage the subscription through secure Stripe checkout",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-base-300 bg-base-100 px-4 py-3 font-medium text-base-content/75">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#efe4dc] p-6 text-[#332821] shadow-xl shadow-base-content/5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7c5948]">Beauty Bank model</p>
          <p className="mt-4 text-2xl font-semibold leading-snug">
            Your Spa Membership works like a Beauty Bank: choose an amount, let your balance build, then use it toward eligible procedures when you are ready.
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-[#5e4c42]">
            <li>• Monthly or yearly stored-value checkout</li>
            <li>• Custom amount, with $100 step controls</li>
            <li>• Credit applies to eligible services at current listed prices, subject to change</li>
            <li>• Use the same name, email, and phone when booking so the team can match your balance</li>
          </ul>
        </div>
      </section>

      <MembershipAmountPicker />

      <section className="py-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Treatment credit</p>
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">Use your balance toward treatments you already plan to keep up with</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-base-content/70">
          Your Spa Membership is built for regular med spa care, not a one-time coupon. Use your balance toward eligible Williamsburg Med Spa treatments when you are ready and when the service is a good fit for your consultation plan.
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {treatments.map((treatment) => (
            <Link key={treatment.title} href={treatment.href} className="rounded-3xl border border-base-300 bg-base-100 p-5 transition hover:border-primary/50 hover:shadow-lg hover:shadow-base-content/5">
              <h3 className="text-xl font-semibold">{treatment.title}</h3>
              <p className="mt-3 text-sm leading-6 text-base-content/65">{treatment.body}</p>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-base-content/60">Treatment availability and candidacy are confirmed during consultation.</p>
      </section>

      <section id="how-it-works" className="rounded-[2rem] bg-base-200 p-5 sm:p-8">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How the Spa Membership works</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {steps.map(([title, body], index) => (
            <div key={title} className="rounded-3xl bg-base-100 p-5">
              <p className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">{index + 1}</p>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-base-content/65">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 py-14 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-base-300 p-6">
          <h2 className="text-3xl font-semibold tracking-tight">Is a Spa Membership right for you?</h2>
          <p className="mt-4 text-base-content/70">This is a good fit if you:</p>
          <ul className="mt-4 space-y-3 text-base-content/75">
            <li>• want regular Botox or Xeomin and prefer predictable budgeting;</li>
            <li>• are saving toward PRP, skin, wellness, or a larger future treatment;</li>
            <li>• like setting aside treatment credit automatically;</li>
            <li>• want flexibility to use your balance when your provider recommends care;</li>
            <li>• prefer a custom amount instead of a one-size-fits-all plan.</li>
          </ul>
        </div>
        <div className="rounded-[2rem] bg-[#f7efe8] p-6 text-[#342a24]">
          <h2 className="text-3xl font-semibold tracking-tight">Start with a consultation if you are unsure</h2>
          <p className="mt-4 leading-7 text-[#604f46]">
            This may not be the best fit if you only want a one-time visit, are unsure which treatment you want, or need a provider recommendation before choosing a budget. In that case, start with a consultation first.
          </p>
          <Link href="/consult" className="mt-6 inline-flex rounded-full bg-[#342a24] px-6 py-3 font-semibold text-white hover:bg-[#4a3b32]">
            Book a consultation first
          </Link>
        </div>
      </section>

      <section id="gift-cards" className="rounded-[2rem] border border-base-300 bg-base-100 p-6 sm:p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Gift cards</p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Want to give treatment credit as a gift?</h2>
        <p className="mt-4 max-w-3xl leading-7 text-base-content/70">
          Williamsburg Med Spa gift cards are a separate option for birthdays, holidays, thank-you gifts, bridal parties, self-care gifts, and special occasions. Choose an amount, pick a theme, and Williamsburg Med Spa can provide a digital or printable gift card.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          {['Birthday', 'Holiday', 'Thank you', 'Bridal or event', 'Just because', 'Custom occasion'].map((occasion) => (
            <span key={occasion} className="rounded-full bg-base-200 px-4 py-2 font-medium text-base-content/70">{occasion}</span>
          ))}
        </div>
        <Link href="/consult" className="mt-7 inline-flex rounded-full border border-base-300 px-6 py-3 font-semibold hover:bg-base-200">
          Ask about gift cards
        </Link>
      </section>

      <section id="faq" className="py-14">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Spa Membership FAQ</h2>
        <div className="mt-7 divide-y divide-base-300 rounded-[2rem] border border-base-300 bg-base-100">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-5 open:bg-base-200/50 sm:p-6">
              <summary className="cursor-pointer list-none text-lg font-semibold marker:hidden">{faq.question}</summary>
              <p className="mt-3 max-w-3xl leading-7 text-base-content/70">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
