import BlogImage from "./blog-image";
import CategoryTag from "./category-tag";
import DateTag from "./date-tag";
import Link from "next/link";

export type Metadata = {
  title: string;
  description: string;
  slug: string;
  date: string;
  dateModified?: string;
  tags: string[];
  image: string;
  imageAlt?: string;
  faqs?: { question: string; answer: string }[];
  authorName?: string;
  reviewedBy?: string;
};

function ArticleHeader({ metadata }: { metadata: Metadata }) {
  const authorName = metadata.authorName ?? "Jenny Coleman";
  const reviewedBy = metadata.reviewedBy ?? "Jenny Coleman";
  const reviewedDate = metadata.dateModified ?? metadata.date;
  const reviewedDateObject = new Date(reviewedDate);
  const reviewedLabel = Number.isNaN(reviewedDateObject.getTime())
    ? reviewedDate
    : reviewedDateObject.toLocaleDateString("en-US", { dateStyle: "long" });

  return (
    <header className="mx-auto max-w-3xl">
      <p className="eyebrow">Journal</p>
      <h1 className="mt-4 text-4xl leading-[1.08] tracking-tight text-balance text-base-content sm:text-5xl md:text-6xl">
        {metadata.title}
      </h1>
      <p className="mt-6 max-w-[62ch] text-lg leading-8 text-base-content/85 md:text-xl">{metadata.description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <DateTag date={metadata.date} />
        {metadata.tags.map((tag) => (
          <CategoryTag tag={tag} key={tag} />
        ))}
      </div>
      <div className="mt-8">
        <BlogImage src={metadata.image} alt={metadata.imageAlt ?? ""} />
      </div>
      <div className="mt-8 border-y border-base-300 py-5 text-sm leading-6 text-base-content/80 md:text-base">
        <p>
          Written by{" "}
          <Link href="/staff/jenny-coleman" className="underline decoration-base-300 underline-offset-4 hover:text-primary">
            {authorName}
          </Link>
          {" · "}Medically reviewed by {reviewedBy}
        </p>
        <p className="mt-1">Last reviewed: {reviewedLabel}</p>
        <p className="mt-2 text-base-content/75">
          Use this guide to prepare for a conversation with Williamsburg Med Spa about fit, timing, and next steps.
        </p>
      </div>
    </header>
  );
}

export default ArticleHeader;
