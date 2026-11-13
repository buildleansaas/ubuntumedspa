import Link from "next/link";

import { AFTER_HEADER, BUTTON_ROW, CARD, CARD_GRID, CARD_LINK, CARD_TITLE, Section, SectionHeader } from "components/layout";
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
    <Section labelledBy="home-chooser-heading">
      <SectionHeader id="home-chooser-heading" title="What brings you in?" />
      <ul className={`${AFTER_HEADER} ${CARD_GRID}`} data-home-chooser>
        {tiles.map((tile) => (
          <li key={tile.href}>
            <Link href={tile.href} className={`group ${CARD} ${CARD_LINK} justify-between`}>
              <span className={CARD_TITLE}>{tile.question}</span>
              <span className="mt-8 flex items-baseline justify-between gap-3 text-sm">
                <span className="text-secondary">
                  {tile.treatment}
                  <span aria-hidden="true" className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
                {tile.price ? <span className="text-base-content/60">{tile.price}</span> : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className={`${AFTER_HEADER} ${BUTTON_ROW}`}>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/consult">Book a visit</Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
          <Link href="/procedures">All treatments</Link>
        </Button>
      </div>
    </Section>
  );
}
