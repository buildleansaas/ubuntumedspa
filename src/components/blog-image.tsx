import Image from "next/image";

function BlogImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-sm sm:aspect-[2/1] sm:h-auto">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 960px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
    </div>
  );
}

export default BlogImage;
