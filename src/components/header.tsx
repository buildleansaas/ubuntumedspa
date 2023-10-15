import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex items-start justify-between w-full px-6 py-6">
      <Link href="/" passHref>
        <div className="flex items-center justify-start">
          <Image className="hidden md:block" width={50} height={50} src="/logo.png" alt="Ubuntu Med Spa logo" />
          <div className="flex flex-col items-start justify-center ml-2">
            <h1 className="text-md sm:text-lg md:text-xl text-white font-bold">Ubuntu Med Spa</h1>
            <h2 className="hidden md:block mt-0 text-sm md:text-base text-white font-light">
              Plasma Rich Platelet Health Therapy
            </h2>
          </div>
        </div>
      </Link>

      <div className="flex items-center">
        <Link href="/products" className="mx-2 text-white-600 hover:text-white">
          Products
        </Link>
        <Link href="/procedures" className="mx-2 text-white-600 hover:text-white">
          Procedures
        </Link>
        <Link href="/blog" passHref className="mx-2 text-white-600 hover:text-white">
          Blog
        </Link>
      </div>
    </div>
  );
}
