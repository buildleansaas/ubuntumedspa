import BlogImage from "./blog-image";
import CategoryTag from "./category-tag";
import DateTag from "./date-tag";

export type Metadata = {
  title: string;
  description: string;
  slug: string;
  date: string;
  dateModified: string;
  tags: string[];
  image: string;
  imageAlt: string;
  faqs: { question: string; answer: string }[];
};

function ArticleHeader({ metadata }: { metadata: Metadata }) {
  console.log(metadata);
  return (
    <div className="mx-auto max-w-5xl">
      <div className="max-w-5xl mx-auto">
        <h1 className="lg:text-center text-white text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-bold tracking-tight my-8 sm:my-16 lg:-mx-24">
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
      <h2 className="text-white text-4xl font-bold tracking-tight my-12 leading-10 text-center">
        {metadata.description}
      </h2>
    </div>
  );
}

export default ArticleHeader;
