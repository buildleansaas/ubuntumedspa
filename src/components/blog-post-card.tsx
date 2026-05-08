import Image from "next/image";
import Link from "next/link";

import CategoryTag from "components/category-tag";
import DateTag from "components/date-tag";
import type { PostMetadata } from "lib/blog";
import { humanizeMedicalCopy } from "lib/humanize";

interface BlogPostCardProps {
  article: PostMetadata;
  priority?: boolean;
  variant?: "list" | "grid" | "featured";
}

export default function BlogPostCard({ article, priority = false, variant = "grid" }: BlogPostCardProps) {
  if (variant === "list") {
    return (
      <article className="group grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-base-300 pb-6 last:border-b-0 last:pb-0">
        <Link
          href={article.href}
          className="relative aspect-square overflow-hidden rounded-lg border border-base-300 bg-base-200"
          aria-label={article.title}
        >
          <Image
            src={article.image}
            alt={article.imageAlt ?? article.title}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
          />
        </Link>

        <div className="min-w-0">
          <DateTag date={article.date} className="px-2.5 py-0.5 text-[11px]" />
          <h2 className="mt-2 text-base/snug font-semibold tracking-tight text-base-content text-balance">
            <Link
              href={article.href}
              className="rounded-md transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-4 focus-visible:ring-offset-base-100"
            >
              {article.title}
            </Link>
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-base-content/70">
            {humanizeMedicalCopy(article.description)}
          </p>
        </div>
      </article>
    );
  }

  const imageClassName =
    variant === "featured"
      ? "relative block aspect-[16/10] overflow-hidden rounded-lg border border-base-300 bg-base-200 shadow-sm md:aspect-auto"
      : "relative block aspect-[16/10] overflow-hidden rounded-lg border border-base-300 bg-base-200 shadow-sm";
  const articleClassName =
    variant === "featured"
      ? "group relative isolate md:grid md:grid-cols-[1.05fr_0.95fr] md:items-stretch md:gap-8"
      : "group relative isolate flex h-full flex-col";
  const titleClassName =
    variant === "featured"
      ? "text-2xl/snug sm:text-3xl/snug font-semibold tracking-tight text-base-content text-balance"
      : "text-lg/snug font-semibold tracking-tight text-base-content text-balance";

  return (
    <article className={articleClassName}>
      <Link href={article.href} className={imageClassName} aria-label={article.title}>
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          priority={priority}
          sizes={
            variant === "featured"
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          }
          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      </Link>

      <div className={variant === "featured" ? "min-w-0 py-6 md:py-8" : "min-w-0 flex-1 pt-5"}>
        <div className="flex flex-wrap items-center gap-2">
          <DateTag date={article.date} />
          {article.tags.slice(0, variant === "featured" ? 3 : 2).map((tag) => (
            <CategoryTag key={tag} tag={tag} />
          ))}
        </div>

        <div className="mt-4">
          <h2 className={titleClassName}>
            <Link
              href={article.href}
              className="rounded-md transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-4 focus-visible:ring-offset-base-100"
            >
              {article.title}
            </Link>
          </h2>
          <p className="mt-3 text-sm leading-7 text-base-content/70">
            {humanizeMedicalCopy(article.description)}
          </p>
        </div>
      </div>
    </article>
  );
}
