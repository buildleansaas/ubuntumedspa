import type { Metadata } from "next";

import { GBP_POSTS, type GbpCta } from "config/gbp-posts";

import { CopyButton } from "./copy-button";

// Internal preview of the weekly Google Business Profile posts. Not linked from the site,
// disallowed in robots.txt, left out of the sitemap, and noindex.
export const metadata: Metadata = {
  title: "Google post preview | Williamsburg Med Spa",
  robots: { index: false, follow: false },
  alternates: { canonical: "/gbp" },
};

const CTA_LABELS: Record<GbpCta, string> = {
  BOOK: "Book",
  LEARN_MORE: "Learn more",
  CALL: "Call now",
  ORDER: "Order online",
};

const formatDate = (isoDate: string) =>
  new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export default function GbpPreviewPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-light">Weekly Google posts</h1>
      <p className="mt-2 text-base-content/70">
        {GBP_POSTS.length} posts, one per Monday. Each card has the image, the caption to paste, the button and its link.
      </p>

      <ol className="mt-10 space-y-14">
        {GBP_POSTS.map((post) => (
          <li key={post.slug} id={post.slug} className="border-t border-base-300 pt-8">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm text-base-content/70">
              <span className="font-medium text-base-content">{formatDate(post.publishOn)}</span>
              <span>Type: {post.type}</span>
              <span>Template: {post.template}{post.holiday ? ` (${post.holiday})` : ""}</span>
              <span>{post.body.trim().split(/\s+/).length} words · {post.body.length} characters</span>
            </div>
            <h2 className="mt-2 text-2xl font-light">{post.title}</h2>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <a href={`/gbp/${post.slug}/image`} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/gbp/${post.slug}/image`}
                  alt={`Google post image: ${post.title}`}
                  width={1200}
                  height={900}
                  className="h-auto w-full border border-base-300"
                />
              </a>

              <div className="flex flex-col gap-3">
                <textarea
                  readOnly
                  value={post.body}
                  rows={14}
                  className="textarea textarea-bordered w-full text-sm leading-relaxed"
                  aria-label={`Caption for ${post.title}`}
                />
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <CopyButton text={post.body} />
                  <span>
                    Button: <strong>{CTA_LABELS[post.cta]}</strong> ({post.cta})
                  </span>
                </div>
                <a href={post.url} className="break-all text-sm underline" target="_blank" rel="noreferrer">
                  {post.url}
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
