import type { Metadata } from "next";
import Link from "next/link";

import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use | Williamsburg Med Spa",
  description:
    "Terms for using williamsburgmedspa.com, requesting a consultation, and paying for a visit at Williamsburg Med Spa in Williamsburg, VA.",
  canonical: "/terms",
});

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl py-14 md:py-20">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/60">Williamsburg Med Spa</p>
      <h1 className="mt-4 text-4xl leading-[1.08] tracking-tight text-base-content md:text-6xl">Terms of Use</h1>
      <p className="mt-4 text-sm text-base-content/60">Last updated October 31, 2026</p>

      <div className="mt-8 space-y-6 text-base leading-8 text-base-content/85">
        <p>
          Williamsburg Med Spa, at 3900 Powhatan Parkway, Williamsburg, VA 23188, operates williamsburgmedspa.com. These
          terms cover use of the website, consultation requests, and payments started on the site. Questions can go to{" "}
          <a className="link link-primary" href="mailto:williamsburgmedspa@gmail.com">
            williamsburgmedspa@gmail.com
          </a>{" "}
          or (804) 738-9483.
        </p>

        <h2 className="pt-4 text-3xl tracking-tight text-base-content">The site is not a diagnosis</h2>
        <p>
          Articles and service pages explain what the clinic offers and what to ask before a visit. They are not a
          diagnosis, a personal treatment plan, or a promise of a result. Care is decided at a consultation. Jenny
          Coleman, MSN, RN, CPNP, PMHS, can decline or delay a service when it is not a fit.
        </p>

        <h2 className="pt-4 text-3xl tracking-tight text-base-content">Appointments</h2>
        <p>
          Sending a consultation form, or paying online, does not by itself mean a treatment is appropriate or that a
          time is confirmed. The clinic follows up to schedule. To change or cancel a request, call the clinic or email
          the address above. This page does not add a cancellation fee. Any timing the clinic uses is confirmed when you
          book.
        </p>

        <h2 className="pt-4 text-3xl tracking-tight text-base-content">Online payment</h2>
        <p>
          Some visits can be paid through Stripe. The price and what that payment covers are the ones shown on the
          service page and at checkout. Card details are handled by Stripe, as described in the{" "}
          <Link className="link link-primary" href="/privacy">
            Privacy Policy
          </Link>
          . Paying online does not remove the need for a consultation when the service page says one comes first. Contact
          the clinic before you pay if you need the current service details.
        </p>

        <h2 className="pt-4 text-3xl tracking-tight text-base-content">Information you send</h2>
        <p>
          Forms ask for contact details and the reason for the visit. Send accurate information. How the clinic handles
          that information is in the Privacy Policy and the{" "}
          <Link className="link link-primary" href="/cookies">
            Cookie Policy
          </Link>
          .
        </p>

        <h2 className="pt-4 text-3xl tracking-tight text-base-content">Service names</h2>
        <p>
          OH-Shot and Pe-Shot are the names used for those PRP services at this clinic. Other pages describe Botox,
          Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, and Blomdahl ear piercing. A page describes only
          the service it is about.
        </p>

        <h2 className="pt-4 text-3xl tracking-tight text-base-content">Using the website</h2>
        <p>
          Do not misuse the site, attempt to break the checkout, or copy the clinic&apos;s photos for your own advertising.
          The site can be unavailable during updates. These terms do not promise that every page will be free of errors.
        </p>

        <h2 className="pt-4 text-3xl tracking-tight text-base-content">Contact</h2>
        <p>
          Williamsburg Med Spa
          <br />
          3900 Powhatan Parkway, Williamsburg, VA 23188
          <br />
          (804) 738-9483
          <br />
          <a className="link link-primary" href="mailto:williamsburgmedspa@gmail.com">
            williamsburgmedspa@gmail.com
          </a>
        </p>
      </div>
    </article>
  );
}
