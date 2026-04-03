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
    <div className="mx-auto max-w-5xl">
      <div className="max-w-5xl mx-auto">
        <h1 className="lg:text-center text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light tracking-tight text-balance my-8 sm:my-16 lg:-mx-24">
          {metadata.title}
        </h1>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <DateTag date={metadata.date} />
        {metadata.tags.map((tag) => (
          <CategoryTag tag={tag} key={tag} />
        ))}
      </div>
      <BlogImage src={metadata.image} alt={metadata.imageAlt ?? ""} />
      <p className="mx-auto my-10 max-w-3xl text-center text-xl leading-8 text-base-content/75 text-balance md:text-2xl md:leading-9">
        {metadata.description}
      </p>
      <div className="rounded-2xl border border-base-300 bg-base-100 p-5 text-sm md:text-base text-base-content/80 shadow-sm">
        <p>
          Written by{" "}
          <Link href="/staff/jenny-coleman" className="link link-primary">
            {authorName}
          </Link>
          {" · "}Medically reviewed by {reviewedBy}
        </p>
        <p className="mt-1">Last reviewed: {reviewedLabel}</p>
        <p className="mt-2 text-base-content/70">
          This article is for education only and does not replace personalized medical advice.
        </p>
      </div>
    </div>
  );
}

export default ArticleHeader;
