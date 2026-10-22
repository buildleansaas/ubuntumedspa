import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spa Membership Checkout Complete | Williamsburg Med Spa",
  description: "Your Williamsburg Med Spa Spa Membership checkout has been started.",
  alternates: { canonical: "/membership/success" },
};

export default function MembershipSuccessPage() {
  return (
    <div className="w-full max-w-3xl py-14">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Spa Membership</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Checkout complete</h1>
      <p className="mt-5 text-lg leading-8 text-base-content/75">
        Your Spa Membership checkout is being processed by Stripe. Williamsburg Med Spa can use the checkout details to apply your selected membership amount as treatment credit toward eligible procedures at current listed prices, subject to change.
      </p>
      <div className="mt-8 rounded-[2rem] border border-base-300 bg-base-200 p-6">
        <h2 className="text-2xl font-semibold">What happens next</h2>
        <ul className="mt-4 space-y-3 leading-7 text-base-content/75">
          <li>• Watch for your Stripe email receipt.</li>
          <li>• Keep the same name, email, and phone number when booking so the team can match your balance.</li>
          <li>• Treatment credit is applied toward eligible Williamsburg Med Spa procedures after consultation and provider recommendation.</li>
        </ul>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/consult" className="rounded-full bg-primary px-6 py-3 text-center font-semibold text-primary-content hover:bg-primary/90">
          Book a consultation
        </Link>
        <Link href="/membership" className="rounded-full border border-base-300 px-6 py-3 text-center font-semibold hover:bg-base-200">
          Back to Spa Membership
        </Link>
      </div>
    </div>
  );
}
