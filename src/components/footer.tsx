import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center text-base-content mt-16">
      <div className="p-4 text-center">
        © 2025 Copyright
        <Link className="text-base-content" href="/">
          Williamsburg Med Spa
        </Link>
      </div>
    </footer>
  );
}
