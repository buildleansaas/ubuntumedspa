import Link from "next/link";

import { Button } from "components/ui/button";

export type ChooserTile = {
  question: string;
  treatment: string;
  href: string;
  /** Price note built from the catalog in page.tsx, e.g. "from <cash> cash". */
  price?: string;
};

// "What brings you in?" Each tile is one real link: a plain question, then the treatment name.
export default function HomeChooser({ tiles }: { tiles: ChooserTile[] }) {
  return (
    <section className="w-full border-t border-base-300 py-16 md:py-24" aria-labelledby="home-chooser-heading">
      <h2 id="home-chooser-heading" className="font-display text-3xl leading-tight tracking-tight text-base-content md:text-[2.6rem]">
        What brings you in?
      </h2>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-home-chooser>
        {tiles.map((tile) => (
          <li key={tile.href} className="flex">
            <Link
              href={tile.href}
              className="group flex w-full flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-6 transition-colors hover:border-secondary/50 hover:bg-base-200/60 md:p-7"
            >
              <span className="font-display text-xl leading-snug text-base-content md:text-[1.4rem]">{tile.question}</span>
              <span className="mt-8 flex items-baseline justify-between gap-3 text-sm">
                <span className="text-secondary">
                  {tile.treatment}
                  <span aria-hidden="true" className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
                {tile.price ? <span className="text-base-content/60">{tile.price}</span> : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/consult">Book a visit</Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
          <Link href="/procedures">All treatments</Link>
        </Button>
      </div>
    </section>
  );
}
