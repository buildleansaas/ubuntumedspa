import type { Metadata } from "next";
import Link from "next/link";

import { procedures, products } from "data";
import { getPublishedBlogPosts } from "lib/blog";
import { publishedEarPiercingIntentPages } from "lib/ear-piercing-intents";
import { getPublishedEvents } from "lib/events";
import { publishedEarPiercingAreas } from "lib/local-service-areas";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sitemap | Williamsburg Med Spa",
  description: "Human-readable index of Williamsburg Med Spa pages, including procedures, locations, articles, and policies.",
  canonical: "/html-sitemap",
});

export default async function HtmlSitemapPage() {
  const posts = await getPublishedBlogPosts();
  const events = getPublishedEvents();
  const publishedProcedures = procedures.filter((procedure) => !("published" in procedure) || procedure.published !== false);
  const publishedProducts = products;

  const groups = [
    {
      title: "Procedures",
      links: [
        { href: "/procedures", label: "All procedures" },
        ...publishedProcedures.map((procedure) => ({
          href: `/procedures/${procedure.slug}`,
          label: procedure.name,
        })),
        ...publishedEarPiercingIntentPages.map((page) => ({
          href: `/procedures/blomdahl-ear-piercing/for/${page.slug}`,
          label: page.title,
        })),
        ...publishedEarPiercingAreas.map((area) => ({
          href: `/procedures/blomdahl-ear-piercing/near/${area.slug}`,
          label: `Blomdahl ear piercing near ${area.name}`,
        })),
      ],
    },
    {
      title: "Locations",
      links: [
        { href: "/locations", label: "Areas we serve" },
        { href: "/locations/williamsburg-va", label: "Williamsburg" },
        { href: "/locations/james-city-county-va", label: "James City County" },
        { href: "/locations/yorktown-va", label: "Yorktown" },
        { href: "/locations/newport-news-va", label: "Newport News" },
      ],
    },
    {
      title: "Blog",
      links: [
        { href: "/blog", label: "All articles" },
        ...posts.map((post) => ({ href: post.href, label: post.title })),
      ],
    },
    {
      title: "Staff",
      links: [{ href: "/staff/jenny-coleman", label: "Jenny Coleman, MSN, RN, CPNP, PMHS" }],
    },
    {
      title: "Appointments and events",
      links: [
        { href: "/consult", label: "Request a consultation" },
        { href: "/events", label: "Events" },
        ...events.map((event) => ({ href: event.canonicalPath, label: event.title })),
      ],
    },
    {
      title: "Products",
      links: [
        { href: "/products", label: "All products" },
        ...publishedProducts.map((product) => ({ href: `/products/${product.slug}`, label: product.name })),
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/cookies", label: "Cookie Policy" },
        { href: "/terms", label: "Terms of Use" },
        { href: "/sitemap.xml", label: "XML sitemap" },
      ],
    },
  ];

  return (
    <article className="mx-auto max-w-3xl py-14 md:py-20">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/60">Williamsburg Med Spa</p>
      <h1 className="mt-4 text-4xl leading-[1.08] tracking-tight text-base-content md:text-6xl">Sitemap</h1>
      <p className="mt-5 max-w-[62ch] text-base leading-8 text-base-content/85 md:text-lg">
        These are the public pages on williamsburgmedspa.com. Search engines use the{" "}
        <Link className="link link-primary" href="/sitemap.xml">
          XML sitemap
        </Link>
        .
      </p>
      <div className="mt-12 space-y-12">
        {groups.map((group) => (
          <section key={group.title} aria-labelledby={`sitemap-${group.title}`}>
            <h2 id={`sitemap-${group.title}`} className="text-3xl tracking-tight text-base-content">
              {group.title}
            </h2>
            <ul className="mt-4 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link className="link link-primary" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
