/**
 * Small spot illustrations for the Google Business Profile post images, drawn as plain SVG in the site palette and
 * rendered as a data-URI <img> (the same way as the holiday backgrounds). Rules: no needles, no faces or bodies that
 * suggest a result, no before/after, and no words or prices (prices stay in the catalog-built chip).
 */
export const GBP_ARTS = [
  "studs",
  "calendar",
  "pie",
  "earring-pair",
  "vial",
  "ornament",
  "droplet",
  "hand",
  "aftercare",
  "hair",
] as const;
export type GbpArt = (typeof GBP_ARTS)[number];

const INK = "#273235";
const ACCENT = "#6f89a1";
const SOFT = "#dbe4ec";
const PINK = "#e58a9e";
const BLUSH = "#f6d6dd";
const GOLD = "#d9b86a";
const WHITE = "#ffffff";

const SIZE = 440;

const sparkle = (x: number, y: number, r: number, color = GOLD) =>
  `<path transform="translate(${x} ${y}) scale(${r / 14})" d="M0 -14 C2 -4 4 -2 14 0 C4 2 2 4 0 14 C-2 4 -4 2 -14 0 C-4 -2 -2 -4 0 -14 Z" fill="${color}"/>`;

const heart = (x: number, y: number, s: number, color = PINK) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 22 C-30 3 -30 -21 -12 -23 C-5 -24 -1 -18 0 -14 C1 -18 5 -24 12 -23 C30 -21 30 3 0 22 Z" fill="${color}"/>`;

/** The round white plate every drawing sits on, with a soft ring. */
const plate = `<circle cx="220" cy="220" r="196" fill="${WHITE}"/><circle cx="220" cy="220" r="196" fill="none" stroke="${SOFT}" stroke-width="10"/>`;

/** A stud earring seen from the front: a faceted gem in a small setting. */
const stud = (x: number, y: number, r: number, gem: string, shine = WHITE) =>
  `<g transform="translate(${x} ${y})">` +
  `<circle r="${r + 7}" fill="${GOLD}"/>` +
  `<circle r="${r}" fill="${gem}"/>` +
  `<path d="M${-r * 0.55} ${-r * 0.1} L0 ${-r * 0.62} L${r * 0.55} ${-r * 0.1} L0 ${r * 0.62} Z" fill="${shine}" opacity="0.35"/>` +
  `<circle cx="${-r * 0.35}" cy="${-r * 0.38}" r="${r * 0.18}" fill="${shine}" opacity="0.9"/>` +
  `</g>`;

const ART: Record<GbpArt, string> = {
  studs:
    plate +
    `<circle cx="220" cy="232" r="132" fill="${BLUSH}"/>` +
    stud(168, 222, 46, PINK) +
    stud(276, 250, 38, "#9fb7cc") +
    sparkle(112, 128, 22) +
    sparkle(330, 150, 16) +
    sparkle(320, 330, 20) +
    heart(150, 336, 0.7),

  calendar:
    plate +
    `<rect x="110" y="118" width="220" height="210" rx="26" fill="${WHITE}" stroke="${ACCENT}" stroke-width="8"/>` +
    `<path d="M110 144 a26 26 0 0 1 26 -26 h168 a26 26 0 0 1 26 26 v32 h-220 Z" fill="${ACCENT}"/>` +
    `<rect x="150" y="96" width="14" height="44" rx="7" fill="${INK}"/>` +
    `<rect x="276" y="96" width="14" height="44" rx="7" fill="${INK}"/>` +
    [0, 1, 2, 3]
      .flatMap((col) =>
        [0, 1, 2].map((row) =>
          col === 2 && row === 1
            ? ""
            : `<circle cx="${152 + col * 46}" cy="${212 + row * 40}" r="9" fill="${SOFT}"/>`
        )
      )
      .join("") +
    `<circle cx="244" cy="252" r="24" fill="${BLUSH}"/>` +
    heart(244, 254, 0.62) +
    sparkle(344, 120, 22) +
    sparkle(96, 300, 16) +
    sparkle(338, 336, 14, ACCENT),

  pie:
    plate +
    `<ellipse cx="220" cy="270" rx="134" ry="40" fill="${SOFT}"/>` +
    `<path d="M96 246 Q220 120 344 246 Z" fill="#e0a85c"/>` +
    `<path d="M96 246 Q220 206 344 246 L330 280 Q220 300 110 280 Z" fill="#c98a4b"/>` +
    `<path d="M150 214 q20 -16 40 0 M200 196 q20 -16 40 0 M250 214 q20 -16 40 0" stroke="#f3dcb4" stroke-width="7" fill="none" stroke-linecap="round"/>` +
    `<ellipse cx="220" cy="168" rx="28" ry="16" fill="${WHITE}"/>` +
    [0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${118 + i * 34}" cy="${250 - Math.round(Math.sin((i / 6) * Math.PI) * 8)}" r="13" fill="#e9b872"/>`).join("") +
    `<path transform="translate(118 132) rotate(-30)" d="M0 -26 C18 -14 18 14 0 26 C-18 14 -18 -14 0 -26 Z" fill="#d9822b"/>` +
    `<path transform="translate(330 128) rotate(28)" d="M0 -22 C15 -12 15 12 0 22 C-15 12 -15 -12 0 -22 Z" fill="${GOLD}"/>` +
    `<path transform="translate(340 326) rotate(-18)" d="M0 -18 C12 -10 12 10 0 18 C-12 10 -12 -10 0 -18 Z" fill="#b5532f"/>` +
    sparkle(98, 330, 14),

  "earring-pair":
    plate +
    `<rect x="84" y="150" width="128" height="150" rx="24" fill="${BLUSH}"/>` +
    `<rect x="228" y="150" width="128" height="150" rx="24" fill="${SOFT}"/>` +
    stud(148, 214, 34, WHITE, "#f3c8d2") +
    `<circle cx="148" cy="214" r="34" fill="none" stroke="${PINK}" stroke-width="3"/>` +
    stud(292, 214, 34, "#aeb8c0") +
    `<rect x="122" y="262" width="52" height="12" rx="6" fill="${PINK}"/>` +
    `<rect x="266" y="262" width="52" height="12" rx="6" fill="${ACCENT}"/>` +
    sparkle(220, 112, 20) +
    sparkle(98, 336, 14, ACCENT) +
    sparkle(344, 338, 16),

  vial:
    plate +
    `<rect x="176" y="96" width="88" height="34" rx="10" fill="${ACCENT}"/>` +
    `<rect x="186" y="128" width="68" height="20" fill="#c9d3db"/>` +
    `<path d="M168 162 a18 18 0 0 1 18 -18 h68 a18 18 0 0 1 18 18 v156 a26 26 0 0 1 -26 26 h-52 a26 26 0 0 1 -26 -26 Z" fill="${WHITE}" stroke="${ACCENT}" stroke-width="8"/>` +
    `<rect x="176" y="206" width="88" height="70" rx="10" fill="${SOFT}"/>` +
    heart(220, 244, 0.7) +
    `<path d="M186 300 h68" stroke="${SOFT}" stroke-width="8" stroke-linecap="round"/>` +
    sparkle(112, 150, 22) +
    sparkle(334, 196, 18) +
    sparkle(320, 326, 14, ACCENT) +
    sparkle(104, 300, 14, PINK),

  ornament:
    plate +
    `<path d="M220 70 V132" stroke="${ACCENT}" stroke-width="5"/>` +
    `<rect x="196" y="128" width="48" height="30" rx="8" fill="${GOLD}"/>` +
    `<circle cx="220" cy="246" r="100" fill="#b3263a"/>` +
    `<path d="M124 226 Q220 262 316 226 L318 250 Q220 288 122 250 Z" fill="${GOLD}"/>` +
    `<circle cx="186" cy="198" r="16" fill="${WHITE}" opacity="0.45"/>` +
    sparkle(220, 312, 12, WHITE) +
    sparkle(100, 140, 20) +
    sparkle(342, 160, 16) +
    sparkle(340, 336, 18, ACCENT),

  droplet:
    plate +
    `<circle cx="220" cy="234" r="128" fill="#f7ead2"/>` +
    `<path d="M220 92 C266 160 304 206 304 254 a84 84 0 0 1 -168 0 C136 206 174 160 220 92 Z" fill="#e9b872"/>` +
    `<path d="M178 250 a42 42 0 0 0 30 46" stroke="${WHITE}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.8"/>` +
    sparkle(108, 140, 22) +
    sparkle(338, 136, 18) +
    sparkle(344, 314, 22) +
    sparkle(98, 316, 14, ACCENT),

  hand:
    plate +
    `<g fill="#f3cfb8">` +
    `<rect x="148" y="104" width="34" height="130" rx="17"/>` +
    `<rect x="188" y="84" width="34" height="150" rx="17"/>` +
    `<rect x="228" y="92" width="34" height="142" rx="17"/>` +
    `<rect x="268" y="116" width="32" height="120" rx="16"/>` +
    `<rect x="144" y="196" width="160" height="150" rx="58"/>` +
    `<rect x="120" y="196" width="36" height="110" rx="18" transform="rotate(-32 150 300)"/>` +
    `</g>` +
    `<path d="M224 236 C238 256 248 270 248 282 a24 24 0 0 1 -48 0 C200 270 210 256 224 236 Z" fill="#9fb7cc"/>` +
    `<path d="M212 284 a12 12 0 0 0 10 12" stroke="${WHITE}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
    sparkle(340, 168, 20) +
    sparkle(98, 140, 16) +
    sparkle(344, 326, 16, ACCENT),

  aftercare:
    plate +
    `<rect x="128" y="104" width="54" height="22" rx="8" fill="${ACCENT}"/>` +
    `<path d="M134 126 h42 v22 h-42 Z" fill="#c9d3db"/>` +
    `<rect x="112" y="146" width="86" height="190" rx="26" fill="${WHITE}" stroke="${ACCENT}" stroke-width="8"/>` +
    `<rect x="122" y="200" width="66" height="70" rx="12" fill="${BLUSH}"/>` +
    heart(155, 236, 0.66) +
    `<circle cx="292" cy="250" r="96" fill="${SOFT}"/>` +
    stud(292, 250, 40, PINK) +
    sparkle(350, 132, 20) +
    sparkle(232, 112, 14, ACCENT) +
    sparkle(360, 352, 16),

  hair:
    plate +
    `<path d="M150 96 C122 160 178 210 150 272 C134 308 146 336 160 350" stroke="#8a5a3c" stroke-width="26" fill="none" stroke-linecap="round"/>` +
    `<path d="M206 88 C178 156 234 206 206 270 C190 306 202 336 216 352" stroke="#a56f49" stroke-width="26" fill="none" stroke-linecap="round"/>` +
    `<path d="M262 96 C234 160 290 210 262 272 C246 308 258 336 272 350" stroke="#c98a4b" stroke-width="26" fill="none" stroke-linecap="round"/>` +
    `<g transform="rotate(-14 220 212)">` +
    `<rect x="104" y="196" width="232" height="36" rx="14" fill="${ACCENT}"/>` +
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<rect x="${116 + i * 22}" y="226" width="10" height="30" rx="5" fill="${ACCENT}"/>`).join("") +
    `</g>` +
    sparkle(340, 300, 24) +
    sparkle(92, 150, 18) +
    sparkle(350, 126, 14, PINK) +
    sparkle(104, 330, 14, ACCENT),
};

export function gbpArtSvg(art: GbpArt) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">${ART[art]}</svg>`;
}

export function gbpArtDataUri(art: GbpArt) {
  return `data:image/svg+xml;base64,${Buffer.from(gbpArtSvg(art)).toString("base64")}`;
}
