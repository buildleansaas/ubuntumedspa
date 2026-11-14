import { XEOMIN_PRICES } from "lib/xeomin-concerns";
import { cn } from "lib/utils";

import { CONCERN_ART_MARKUP } from "components/concern-art-markup";

/**
 * Fashion-sketch drawings for the "Xeomin by concern" cards: brush-stroke lines on a soft colour shape, each card a close crop
 * of its own area (both brows, a profile, one eye, the lips) with the treatment area marked in boxwood over a soft glow. They
 * show where an area is, never a result: no before/after, no smoothed version. Decorative (the card title already names the
 * area), so aria-hidden, inline SVG, no scripts. The markup is generated: see concern-art-markup.ts.
 */

export const CONCERN_AREAS = [
  "frown-lines",
  "forehead-lines",
  "crows-feet",
  "lip-flip",
] as const;
export type ConcernArea = (typeof CONCERN_AREAS)[number];
export const isConcernArea = (slug: string): slug is ConcernArea =>
  (CONCERN_AREAS as readonly string[]).includes(slug);

/** The small label above each card title: where on the face the area is. */
export const CONCERN_AREA_LABEL: Record<ConcernArea, string> = {
  "frown-lines": "Between the brows",
  "forehead-lines": "Across the forehead",
  "crows-feet": "Outer eyes",
  "lip-flip": "Upper lip",
};

const INK = "#24313A";
const BOXWOOD = "#6F8470";
const MIST = "#E8EBE8";

/** The art panel: 4:3 from small tablets up; a shorter 16:9 crop on phones so four stacked cards don't run long. */
const PANEL = "block aspect-[16/9] w-full bg-[#E8EBE8] sm:aspect-[4/3]";

export function ConcernFaceArt({
  area,
  className,
}: {
  area: ConcernArea;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={cn(PANEL, className)}
      data-concern-art={area}
      // Static, generated markup from this repo (no user input).
      dangerouslySetInnerHTML={{ __html: CONCERN_ART_MARKUP[area] }}
    />
  );
}

/** Three stacked credit blocks; the top one carries the cash block price from the catalog. */
export function CreditBlocksArt({ className }: { className?: string }) {
  const tile = (y: number) =>
    `M58 ${y + 8} a8 8 0 0 1 8 -8 h68 a8 8 0 0 1 8 8 v14 a8 8 0 0 1 -8 8 h-68 a8 8 0 0 1 -8 -8 Z`;
  return (
    <svg
      viewBox="0 0 200 150"
      aria-hidden="true"
      focusable="false"
      className={cn(PANEL, className)}
      data-credit-blocks-art=""
    >
      <rect width="200" height="150" fill={MIST} />
      <ellipse cx="100" cy="118" rx="52" ry="6" fill={INK} fillOpacity="0.06" />
      <g strokeLinejoin="round" strokeWidth="1.5">
        <path
          d={tile(84)}
          fill="#F4F3EF"
          stroke={INK}
          strokeOpacity="0.4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={tile(62)}
          fill="#F4F3EF"
          stroke={INK}
          strokeOpacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={tile(40)}
          fill="#F4F3EF"
          stroke={BOXWOOD}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <text
        x="100"
        y="56"
        textAnchor="middle"
        dominantBaseline="central"
        fill={INK}
        fontSize="15"
        fontFamily="inherit"
      >
        {XEOMIN_PRICES.blockCash}
      </text>
    </svg>
  );
}
