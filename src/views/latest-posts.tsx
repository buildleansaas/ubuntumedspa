import BlogPostCard from "components/blog-post-card";
import { getPublishedBlogPosts } from "lib/blog";

export default async function LatestPosts() {
  const articles = (await getPublishedBlogPosts()).slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <div className="my-16 sm:my-24 lg:my-32">
        <h2 className="sm:text-center text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light tracking-tight text-base-content">
          Williamsburg Med Spa Blog
        </h2>
        <p className="mt-4 text-base md:text-lg lg:text-xl mb-8 max-w-4xl mx-auto text-center text-base-content/70">
          Explore the Williamsburg Med Spa Blog for insights into restorative wellness and natural healing. Our
          educational articles cover everything from PRP therapy benefits to the art of Blohmdahl ear piercing,
          supporting your path to holistic health and rejuvenation.
        </p>
      </div>
      <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
        {articles.map((article) => <BlogPostCard key={article.slug} article={article} />)}
      </div>
    </div>
  );
}
