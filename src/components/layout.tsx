import type { ReactNode } from "react";

import { cn } from "lib/utils";

// One layout system for every page (Tidewater, round 4). The site has one content width and one side gutter:
// the header, <main> and the footer all use CONTAINER, so the logo, every section heading and the footer text
// share one left edge. Sections never set their own width or side padding.
//
// Spacing scale (4px grid): inside a group 12-16px, header to content 40-48px, section padding 80-112px.

/** The one content container: about 1200px of content with a 20px (phone) / 32px (tablet up) gutter. */
export const CONTAINER = "mx-auto w-full max-w-7xl px-5 md:px-8";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn(CONTAINER, className)}>{children}</div>;
}

/** Regular and tight vertical rhythm. These are the only two section paddings. */
export const SECTION_PAD = "py-20 md:py-28";
export const SECTION_PAD_TIGHT = "py-14 md:py-20";

/**
 * A page section. Sections alternate base-100 / base-200 as full-bleed bands (globals.css, [data-section]), so no
 * section draws its own divider. The band is painted outside the box, so the content stays in the container.
 * `tone` forces a band colour where the alternation would put two of the same next to each other.
 */
export function Section({
  id,
  labelledBy,
  label,
  tight = false,
  tone,
  className,
  children,
  ...data
}: {
  id?: string;
  labelledBy?: string;
  label?: string;
  tight?: boolean;
  tone?: "plain" | "muted";
  className?: string;
  children: ReactNode;
} & { [key: `data-${string}`]: string | boolean | undefined }) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      data-section=""
      data-tone={tone}
      className={cn("w-full scroll-mt-28 text-left", tight ? SECTION_PAD_TIGHT : SECTION_PAD, className)}
      {...data}
    >
      {children}
    </section>
  );
}

/** The page title scale (hero H1). */
export const H1 = "font-display text-4xl font-light leading-tight tracking-tight text-base-content sm:text-5xl lg:text-6xl";
/** The one section heading scale. */
export const H2 = "font-display text-3xl font-light leading-tight tracking-tight text-base-content md:text-[2.75rem]";
/** Intro paragraph under a section heading. */
export const INTRO = "max-w-[62ch] text-lg leading-relaxed text-base-content/75";
/** Space between a section header and the content under it. */
export const AFTER_HEADER = "mt-10 md:mt-12";

/** Optional eyebrow (only where one existed), the H2, an optional intro. Always left-aligned. */
export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  as: Heading = "h2",
  className,
  children,
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Heading id={id} className={cn(H2, eyebrow ? "mt-3" : undefined)}>
        {title}
      </Heading>
      {intro ? <p className={cn("mt-4", INTRO)}>{intro}</p> : null}
      {children}
    </div>
  );
}

/**
 * Split: text on the left, media or a card on the right, on a 12-column grid with one fixed gap.
 * "wide" gives the media 7 of 12 columns (photos, sliders); "even" splits 6/6.
 */
export const SPLIT = "grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-16";
export const SPLIT_TEXT = { wide: "lg:col-span-5", even: "lg:col-span-6" } as const;
export const SPLIT_MEDIA = { wide: "lg:col-span-7", even: "lg:col-span-6" } as const;

export function Split({
  text,
  media,
  ratio = "wide",
  align = "center",
  className,
}: {
  text: ReactNode;
  media: ReactNode;
  ratio?: "wide" | "even";
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div className={cn(SPLIT, align === "center" ? "items-center" : "items-start", className)}>
      <div className={cn("min-w-0", SPLIT_TEXT[ratio])}>{text}</div>
      <div className={cn("min-w-0", SPLIT_MEDIA[ratio])}>{media}</div>
    </div>
  );
}

/** Card grid: 3 columns on desktop, 2 on tablet, 1 on phone, one gap. Use `CARD_GRID_2` for long-text cards. */
export const CARD_GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3";
export const CARD_GRID_2 = "grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8";
/** The card grid for n cards: 2 columns when n splits evenly into 2 but not 3 (no orphan card), else 3. */
export const cardGridFor = (n: number) => (n % 2 === 0 && n % 3 !== 0) || n === 1 ? CARD_GRID_2 : CARD_GRID;

/** The one card: 16px radius, 24px padding, hairline border, base-100 background, equal height in a grid. */
export const CARD = "flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-6";
/** A card whose media runs edge to edge at the top; put the text in CARD_BODY. */
export const CARD_FLUSH = "flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100";
export const CARD_BODY = "flex flex-1 flex-col p-6";
/** Hover for cards that are one link. */
export const CARD_LINK = "transition-colors hover:border-base-content/40 motion-reduce:transition-none";
/** Card title. */
export const CARD_TITLE = "font-display text-xl leading-snug text-base-content md:text-2xl";

/** Rows: label left, value right, hairline between rows. */
export const ROWS = "border-t border-base-300";
export const ROW = "flex flex-col gap-1 border-b border-base-300 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6";

/** A row of buttons. Every button in one row shares a height (size="lg" for section-level rows). */
export const BUTTON_ROW = "flex flex-col gap-3 sm:flex-row sm:flex-wrap";
export const BUTTON_ROW_CENTER = "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center";

/** Band CTA: a centred heading, text and buttons inside a full-bleed band. */
export function BandCta({
  id,
  labelledBy,
  eyebrow,
  headingId,
  title,
  children,
  tone,
}: {
  id?: string;
  labelledBy?: string;
  eyebrow?: ReactNode;
  headingId: string;
  title: ReactNode;
  children: ReactNode;
  tone?: "plain" | "muted";
}) {
  return (
    <Section id={id} labelledBy={labelledBy ?? headingId} tone={tone} data-band-cta="">
      <div className="mx-auto max-w-3xl text-center">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={headingId} className={cn(H2, eyebrow ? "mt-3" : undefined)}>
          {title}
        </h2>
        {children}
      </div>
    </Section>
  );
}
