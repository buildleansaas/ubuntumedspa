import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center text-white mt-16">
      <div className="p-4 text-center">
        © 2023 Copyright
        <Link className="text-white" href="/">
          Ubuntu Med Spa
        </Link>
      </div>
    </footer>
  );
}
