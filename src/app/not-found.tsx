import Link from "next/link";

import { Button } from "components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-20 md:py-28">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl leading-[1.1] tracking-tight text-base-content md:text-6xl">This page is not available</h1>
      <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-base-content/85">
        The address may have changed. Return home, review treatments, or request a consultation.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="w-full sm:w-auto">
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <Link href="/procedures">View treatments</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <Link href="/consult">Request a consultation</Link>
        </Button>
      </div>
    </div>
  );
}
