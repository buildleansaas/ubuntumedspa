import type { SVGProps } from "react";

import { XEOMIN_PRICES } from "lib/xeomin-concerns";
import { cn } from "lib/utils";

/**
 * Line drawings for the "Xeomin by concern" cards: one calm face, drawn once, with the card's treatment area picked out in
 * boxwood. They show where an area is, never a result: no before/after, no smoothed version. Decorative (the card title
 * already names the area), so aria-hidden, inline SVG, no scripts. Tidewater palette, the same as the route maps.
 *
 * Proportions (drawn in a 200 x 150 box, then scaled to 90% so the hair has headroom): head top 12, hairline 30, brows 63, eyes 72 (the head's vertical middle), nose base 96
 * (halfway from brows to chin), mouth 108 (a third of the way from nose to chin), chin 131.
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

const INK = "#24313A";
const BOXWOOD = "#6F8470";
const MIST = "#E8EBE8";

/** The art panel: mist background, 4:3, lines that stay 1.5-2px whatever the card width. */
const PANEL = "block aspect-[4/3] w-full bg-[#E8EBE8]";

// The face, in drawing order. Every path is an open stroke with round caps.
const HAIR = [
  // Outer silhouette: crown, then hair falling past the jaw to the shoulders, a little fuller on the right.
  "M58 128 C51 120 48 100 49 80 C50 60 54 40 66 26 C76 16 88 12 100 12 C124 12 142 26 148 50 C153 72 152 102 146 124 C145 127 143 129 141 130",
  // A side part, and the hairline sweeping across the forehead into both temples.
  "M88 14 C76 22 66 36 63 54",
  "M88 14 C104 21 122 26 131 36 C135 41 137 48 137 56",
];
const FACE =
  "M63 54 C60 66 60 80 63 93 C67 111 82 129 100 131 C118 129 133 111 137 93 C140 80 140 66 137 56";
const NECK = [
  "M89 126 C89 136 88 147 85.5 158",
  "M111 126 C111 136 112 147 114.5 158",
];
const BROWS = ["M71 64 C76 60 84 59 92 62", "M108 62 C116 59 124 60 129 64"];
// Eyes rest closed: one lid curve each, with a short lash at the outer corner.
const EYES = ["M73 73 C77 77 85 77 89 73", "M111 73 C115 77 123 77 127 73"];
const LASHES = ["M73 73 L70.5 72", "M127 73 L129.5 72"];
const NOSE = [
  "M96 71 C97.5 79 97.5 87 94.5 92.5",
  "M93 96 C95.5 97.6 98 97.2 100 97.7 C102 97.2 104.5 97.6 107 96",
];
const UPPER_LIP =
  "M87 108.5 C91 106.5 95 104.5 98 105 Q100 105.8 102 105 C105 104.5 109 106.5 113 108.5";
const MOUTH = "M87 108.5 C94 110 106 110 113 108.5";
const LOWER_LIP = "M93 113 C97 115 103 115 107 113";

/** Where each area sits: the glow centre and size, and the boxwood marks drawn on top. */
const AREAS: Record<
  ConcernArea,
  { glow: { cx: number; cy: number; rx: number; ry: number }; marks: string[] }
> = {
  "frown-lines": {
    glow: { cx: 100, cy: 63, rx: 12, ry: 10 },
    marks: [
      "M97.5 58.5 C97 61 97 63.5 97.8 66.5",
      "M102.5 58.5 C103 61 103 63.5 102.2 66.5",
    ],
  },
  "forehead-lines": {
    glow: { cx: 100, cy: 47, rx: 30, ry: 13 },
    marks: [
      "M82 41 C92 38.5 108 38.5 118 41",
      "M78 47.5 C90 45 110 45 122 47.5",
      "M84 54 C93 52 107 52 116 54",
    ],
  },
  "crows-feet": {
    glow: { cx: 131, cy: 73, rx: 8, ry: 9 },
    marks: [
      "M130 69.5 C131.8 68.3 133.2 67.6 134.6 67.2",
      "M130.5 73 C132.2 73 133.6 73.1 135 73.4",
      "M130 76.5 C131.8 77.7 133.2 78.4 134.6 78.8",
    ],
  },
  "lip-flip": {
    glow: { cx: 100, cy: 107, rx: 18, ry: 8 },
    marks: [UPPER_LIP],
  },
};

const lines = (paths: string[], props: SVGProps<SVGPathElement>) =>
  paths.map((d) => (
    <path key={d} d={d} vectorEffect="non-scaling-stroke" {...props} />
  ));

export function ConcernFaceArt({
  area,
  className,
}: {
  area: ConcernArea;
  className?: string;
}) {
  const { glow, marks } = AREAS[area];
  const glowId = `concern-glow-${area}`;
  return (
    <svg
      viewBox="0 0 200 150"
      aria-hidden="true"
      focusable="false"
      className={cn(PANEL, className)}
      data-concern-art={area}
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0" stopColor={BOXWOOD} stopOpacity="0.34" />
          <stop offset="0.6" stopColor={BOXWOOD} stopOpacity="0.14" />
          <stop offset="1" stopColor={BOXWOOD} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="150" fill={MIST} />
      {/* Drawn at 200 x 150, then set a little smaller so the hair has headroom and the neck runs off the bottom. */}
      <g transform="translate(10 9) scale(0.9)">
        <ellipse
          cx={glow.cx}
          cy={glow.cy}
          rx={glow.rx * 1.6}
          ry={glow.ry * 1.6}
          fill={`url(#${glowId})`}
        />
        <g
          fill="none"
          stroke={INK}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        >
          <g strokeOpacity="0.4">{lines([...HAIR, ...NECK], {})}</g>
          <g strokeOpacity="0.55">
            {lines(
              [FACE, ...BROWS, ...EYES, ...LASHES, ...NOSE, MOUTH, LOWER_LIP],
              {},
            )}
            {area === "lip-flip" ? null : lines([UPPER_LIP], {})}
          </g>
        </g>
        <g
          fill="none"
          stroke={BOXWOOD}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          {lines(marks, {})}
        </g>
      </g>
    </svg>
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
