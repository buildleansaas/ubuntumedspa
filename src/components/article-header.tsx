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
  const authorName = metadata.authorName ?? "Jenny Brady";
  const reviewedBy = metadata.reviewedBy ?? "Jenny Brady";
  const reviewedDate = metadata.dateModified ?? metadata.date;
  const reviewedDateObject = new Date(reviewedDate);
  const reviewedLabel = Number.isNaN(reviewedDateObject.getTime())
    ? reviewedDate
    : reviewedDateObject.toLocaleDateString("en-US", { dateStyle: "long" });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="max-w-5xl mx-auto">
        <h1 className="lg:text-center text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-bold tracking-tight my-8 sm:my-16 lg:-mx-24">
          {metadata.title}
        </h1>
      </div>
      <div className="flex flex-wrap items-center mb-4">
        <DateTag date={metadata.date} />
        {metadata.tags.map((tag) => (
          <CategoryTag tag={tag} key={tag} />
        ))}
      </div>
      <BlogImage src={metadata.image} alt={metadata.imageAlt ?? ""} />
      <h2 className="text-base-content text-4xl font-bold tracking-tight my-12 leading-10 text-center">
        {metadata.description}
      </h2>
      <div className="rounded-xl border border-base-300 bg-base-200 p-5 text-sm md:text-base text-base-content/80">
        <p>
          Written by{" "}
          <Link href="/staff/jenny-brady" className="link link-primary">
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
