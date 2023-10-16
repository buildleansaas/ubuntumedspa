import Image from "next/image";

function BlogImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full sm:aspect-[2/1] bg-gray-50 border-2 border-purple-500 h-64 rounded-md">
      <Image src={src} alt={alt} fill className="object-cover rounded-tr-md rounded-tl-md" />
      <div className="absolute inset-0 shadow-inner bg-gradient-to-br from-white/20" />
    </div>
  );
}

export default BlogImage;
