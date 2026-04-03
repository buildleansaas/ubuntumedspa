import Image from "next/image";
import Link from "next/link";

import CategoryTag from "components/category-tag";
import DateTag from "components/date-tag";
import type { PostMetadata } from "lib/blog";
import { humanizeMedicalCopy } from "lib/humanize";

interface BlogPostCardProps {
  article: PostMetadata;
}

export default function BlogPostCard({ article }: BlogPostCardProps) {
  return (
    <article className="group relative isolate flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-sm sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
        <Image
          src={article.image}
          alt={article.imageAlt ?? article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 256px"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      </div>

      <div className="min-w-0 flex-1 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <DateTag date={article.date} />
          {article.tags.map((tag) => (
            <CategoryTag key={tag} tag={tag} />
          ))}
        </div>

        <div className="mt-4 max-w-2xl">
          <h2 className="text-lg/snug sm:text-xl/snug md:text-2xl/snug font-semibold tracking-tight text-base-content text-balance">
            <Link
              href={`/blog/${article.slug}`}
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
