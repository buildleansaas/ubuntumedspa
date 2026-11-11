import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ReactNode } from "react";
import type { GbpHoliday, GbpTemplate } from "config/gbp-posts";
import { gbpArtDataUri, type GbpArt } from "lib/gbp-art";
import { SOCIAL_LOGO_DATA_URI } from "lib/socialLogo";

/**
 * Google Business Profile post images (1200x900, Google's recommended 4:3).
 * Same palette, logo, phone, and default font as createOpenGraphImage.
 */
export const GBP_IMAGE_WIDTH = 1200;
export const GBP_IMAGE_HEIGHT = 900;

export type { GbpHoliday, GbpTemplate };

export type GbpPostImageOptions = {
  template: GbpTemplate;
  title: string;
  subtitle: string;
  priceLine?: string;
  holiday?: GbpHoliday;
  /** Optional override for the small line above the title. */
  kicker?: string;
  /** Spot illustration: right of the text on spotlight and question posts, above the title on holiday posts. */
  art?: GbpArt;
};

const BG = "#f3f5f6";
const INK = "#273235";
const ACCENT = "#6f89a1";
const MUTED = "#627178";
const PHONE_NUMBER = "+1 (804) 738-9483";
const SITE = "williamsburgmedspa.com";

const HOLIDAY_ACCENTS: Record<GbpHoliday, string> = {
  thanksgiving: "#b8692e",
  christmas: "#a8423f",
  newyear: "#b8913a",
  valentines: "#c0566c",
};

const DEFAULT_KICKERS: Record<GbpTemplate, string> = {
  spotlight: "Service spotlight",
  question: "Williamsburg Med Spa answers",
  trust: "Meet your nurse practitioner",
  holiday: "From all of us at Williamsburg Med Spa",
};

let jennyDataUri: string | undefined;
function getJennyDataUri() {
  if (!jennyDataUri) {
    const bytes = readFileSync(join(process.cwd(), "public", "jenny.jpg"));
    jennyDataUri = `data:image/jpeg;base64,${bytes.toString("base64")}`;
  }
  return jennyDataUri;
}

/* ---------- holiday backgrounds (plain SVG shapes, rendered as a data-URI <img>) ---------- */

/** Small deterministic PRNG so every build draws the same background. */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

type Box = { x0: number; y0: number; x1: number; y1: number };

// Keep decorations off the header wordmark, the centered text, and the footer.
const KEEP_CLEAR: Box[] = [
  { x0: 40, y0: 30, x1: 640, y1: 150 },
  { x0: 150, y0: 175, x1: 1050, y1: 740 },
  { x0: 40, y0: 760, x1: 1160, y1: 870 },
];

function isClear(x: number, y: number, r: number, extra: Box[] = []) {
  return [...KEEP_CLEAR, ...extra].every((box) => x + r < box.x0 || x - r > box.x1 || y + r < box.y0 || y - r > box.y1);
}

function scatter(seed: number, count: number, minSize: number, maxSize: number, extra: Box[] = []) {
  const random = seeded(seed);
  const points: { x: number; y: number; size: number; rotate: number; pick: number }[] = [];
  let attempts = 0;
  while (points.length < count && attempts < 4000) {
    attempts += 1;
    const size = minSize + random() * (maxSize - minSize);
    const x = random() * GBP_IMAGE_WIDTH;
    const y = random() * GBP_IMAGE_HEIGHT;
    const rotate = Math.round(random() * 360);
    const pick = random();
    if (!isClear(x, y, size * 0.55, extra)) continue;
    if (points.some((p) => Math.hypot(p.x - x, p.y - y) < (p.size + size) * 0.6)) continue;
    points.push({ x: Math.round(x), y: Math.round(y), size: Math.round(size), rotate, pick });
  }
  return points;
}

function leaf(x: number, y: number, size: number, rotate: number, color: string, opacity: number) {
  const s = size / 80;
  return `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${s.toFixed(3)})" opacity="${opacity}">
    <path d="M0 -40 C26 -22 26 18 0 40 C-26 18 -26 -22 0 -40 Z" fill="${color}"/>
    <path d="M0 -34 L0 46" stroke="${BG}" stroke-width="3" stroke-linecap="round"/>
    <path d="M0 -8 L13 -20 M0 8 L-13 -4 M0 22 L12 12" stroke="${BG}" stroke-width="2.5" stroke-linecap="round"/>
  </g>`;
}

function snowflake(x: number, y: number, size: number, rotate: number, color: string, opacity: number) {
  const r = size / 2;
  const arms = [0, 60, 120]
    .map(
      (angle) => `<g transform="rotate(${angle})">
        <line x1="0" y1="${-r}" x2="0" y2="${r}"/>
        <line x1="0" y1="${-r * 0.6}" x2="${r * 0.22}" y2="${-r * 0.8}"/>
        <line x1="0" y1="${-r * 0.6}" x2="${-r * 0.22}" y2="${-r * 0.8}"/>
        <line x1="0" y1="${r * 0.6}" x2="${r * 0.22}" y2="${r * 0.8}"/>
        <line x1="0" y1="${r * 0.6}" x2="${-r * 0.22}" y2="${r * 0.8}"/>
      </g>`
    )
    .join("");
  return `<g transform="translate(${x} ${y}) rotate(${rotate % 60})" stroke="${color}" stroke-width="${Math.max(2, size / 22).toFixed(1)}" stroke-linecap="round" opacity="${opacity}">${arms}</g>`;
}

function ornament(x: number, stringLength: number, radius: number, color: string) {
  const cy = stringLength + radius;
  return `<g>
    <line x1="${x}" y1="0" x2="${x}" y2="${stringLength - 6}" stroke="${ACCENT}" stroke-width="2" opacity="0.7"/>
    <rect x="${x - radius * 0.28}" y="${stringLength - 8}" width="${radius * 0.56}" height="${radius * 0.32}" rx="3" fill="${INK}" opacity="0.75"/>
    <circle cx="${x}" cy="${cy}" r="${radius}" fill="${color}"/>
    <path d="M${x - radius * 0.92} ${cy - radius * 0.1} Q${x} ${cy + radius * 0.25} ${x + radius * 0.92} ${cy - radius * 0.1}" stroke="${BG}" stroke-width="3" fill="none" opacity="0.8"/>
    <circle cx="${x - radius * 0.35}" cy="${cy - radius * 0.4}" r="${radius * 0.16}" fill="#ffffff" opacity="0.55"/>
  </g>`;
}

function heart(x: number, y: number, size: number, rotate: number, color: string, opacity: number) {
  const s = size / 60;
  return `<g transform="translate(${x} ${y}) rotate(${(rotate % 50) - 25}) scale(${s.toFixed(3)})" opacity="${opacity}">
    <path d="M0 26 C-34 4 -34 -24 -14 -26 C-6 -27 -1 -21 0 -16 C1 -21 6 -27 14 -26 C34 -24 34 4 0 26 Z" fill="${color}"/>
  </g>`;
}

function confetti(x: number, y: number, size: number, rotate: number, color: string, pick: number) {
  if (pick < 0.4) {
    return `<rect x="${x - size / 2}" y="${y - size / 6}" width="${size}" height="${size / 3}" rx="2" fill="${color}" transform="rotate(${rotate} ${x} ${y})"/>`;
  }
  if (pick < 0.7) {
    return `<circle cx="${x}" cy="${y}" r="${size / 4}" fill="${color}"/>`;
  }
  return `<path d="M${x - size / 2} ${y} q${size / 4} ${-size / 3} ${size / 2} 0 t${size / 2} 0" stroke="${color}" stroke-width="${Math.max(3, size / 8)}" fill="none" stroke-linecap="round" transform="rotate(${rotate} ${x} ${y})"/>`;
}

function holidayShapes(holiday: GbpHoliday) {
  const accent = HOLIDAY_ACCENTS[holiday];
  switch (holiday) {
    case "thanksgiving":
      return scatter(11, 26, 46, 92)
        .map((p) => leaf(p.x, p.y, p.size, p.rotate, p.pick < 0.6 ? accent : ACCENT, p.pick < 0.6 ? 0.78 : 0.45))
        .join("");
    case "christmas": {
      // Leave the hanging ornaments in the top-right corner on their own.
      const flakes = scatter(23, 24, 30, 70, [{ x0: 710, y0: 0, x1: 1200, y1: 200 }])
        .map((p) => snowflake(p.x, p.y, p.size, p.rotate, ACCENT, 0.45 + p.pick * 0.35))
        .join("");
      const ornaments = [
        { x: 760, length: 46, radius: 30 },
        { x: 860, length: 92, radius: 38 },
        { x: 960, length: 34, radius: 26 },
        { x: 1060, length: 70, radius: 34 },
        { x: 1140, length: 120, radius: 28 },
      ]
        .map((o, index) => ornament(o.x, o.length, o.radius, index % 2 === 0 ? accent : ACCENT))
        .join("");
      return flakes + ornaments;
    }
    case "newyear":
      return scatter(37, 70, 18, 38)
        .map((p) =>
          confetti(p.x, p.y, p.size, p.rotate, p.pick < 0.5 ? accent : p.pick < 0.8 ? ACCENT : INK, (p.pick * 7) % 1)
        )
        .join("");
    case "valentines":
      return scatter(53, 30, 34, 84)
        .map((p) => heart(p.x, p.y, p.size, p.rotate, p.pick < 0.65 ? accent : ACCENT, 0.4 + p.pick * 0.45))
        .join("");
  }
}

export function holidayBackgroundDataUri(holiday: GbpHoliday) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${GBP_IMAGE_WIDTH}" height="${GBP_IMAGE_HEIGHT}" viewBox="0 0 ${GBP_IMAGE_WIDTH} ${GBP_IMAGE_HEIGHT}">${holidayShapes(holiday)}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/* ---------- shared pieces ---------- */

function titleSize(title: string, sizes: [number, number, number]) {
  if (title.length <= 22) return sizes[0];
  if (title.length <= 40) return sizes[1];
  return sizes[2];
}

function Kicker({ text, color = ACCENT, center = false }: { text: string; color?: string; center?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: center ? "center" : "flex-start",
        gap: 18,
      }}
    >
      <div style={{ width: 86, height: 3, background: color }} />
      <div style={{ fontSize: 28, color, letterSpacing: "-0.01em" }}>{text}</div>
    </div>
  );
}

function PriceChip({ text, center = false, compact = false }: { text: string; center?: boolean; compact?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: center ? "center" : "flex-start",
        background: "#ffffff",
        border: `2px solid ${ACCENT}`,
        color: INK,
        borderRadius: 999,
        padding: compact ? "14px 26px" : "16px 32px",
        fontSize: compact ? 28 : 34,
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "-0.01em",
      }}
    >
      {text}
    </div>
  );
}

function Header() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "52px 72px 0" }}>
      <img src={SOCIAL_LOGO_DATA_URI} alt="" width={53} height={75} style={{ width: 53, height: 75 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 30, color: INK, letterSpacing: "-0.02em" }}>Williamsburg Med Spa</div>
        <div style={{ fontSize: 21, color: MUTED }}>3900 Powhatan Parkway · Williamsburg, VA</div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 72px 52px",
      }}
    >
      <div style={{ fontSize: 28, color: MUTED, letterSpacing: "-0.01em" }}>{SITE}</div>
      <div
        style={{
          display: "flex",
          background: ACCENT,
          color: "#ffffff",
          borderRadius: 999,
          padding: "16px 28px",
          fontSize: 26,
          lineHeight: 1,
        }}
      >
        {PHONE_NUMBER}
      </div>
    </div>
  );
}

function Art({ art, size }: { art: GbpArt; size: number }) {
  return <img src={gbpArtDataUri(art)} alt="" width={size} height={size} style={{ width: size, height: size, flexShrink: 0 }} />;
}

/** Text column on the left, the drawing on the right; without art the text keeps the full width. */
function WithArt({ art, children }: { art?: GbpArt; children: ReactNode }) {
  if (!art) return <>{children}</>;
  return (
    <div style={{ display: "flex", alignItems: "center", flexGrow: 1, paddingRight: 64 }}>
      <div style={{ display: "flex", alignSelf: "stretch", flex: 1, minWidth: 0 }}>{children}</div>
      <Art art={art} size={360} />
    </div>
  );
}

/* ---------- templates ---------- */

function Spotlight({ title, subtitle, priceLine, kicker, art }: GbpPostImageOptions) {
  return (
    <WithArt art={art}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flexGrow: 1,
        padding: "0 72px",
        gap: 34,
      }}
    >
      <Kicker text={kicker ?? DEFAULT_KICKERS.spotlight} />
      <div
        style={{
          display: "flex",
          maxWidth: art ? 680 : 1040,
          fontSize: art ? titleSize(title, [88, 76, 64]) : titleSize(title, [104, 88, 72]),
          lineHeight: 1.03,
          letterSpacing: "-0.055em",
          color: INK,
        }}
      >
        {title}
      </div>
      <div
        style={{ display: "flex", maxWidth: art ? 660 : 940, fontSize: art ? 34 : 38, lineHeight: 1.3, color: MUTED, letterSpacing: "-0.015em" }}
      >
        {subtitle}
      </div>
      {priceLine ? <PriceChip text={priceLine} compact={Boolean(art)} /> : null}
    </div>
    </WithArt>
  );
}

function Question({ title, subtitle, kicker, art }: GbpPostImageOptions) {
  return (
    <WithArt art={art}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flexGrow: 1,
        padding: "0 72px",
        gap: 26,
      }}
    >
      <Kicker text={kicker ?? DEFAULT_KICKERS.question} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 22 }}>
        <div style={{ display: "flex", fontSize: 200, lineHeight: 0.9, color: ACCENT, marginTop: -6 }}>“</div>
        <div
          style={{
            display: "flex",
            maxWidth: art ? 600 : 900,
            fontSize: art ? titleSize(title, [76, 64, 54]) : titleSize(title, [88, 76, 64]),
            lineHeight: 1.08,
            letterSpacing: "-0.05em",
            color: INK,
          }}
        >
          {`${title}”`}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          maxWidth: art ? 680 : 940,
          paddingLeft: 96,
          fontSize: art ? 32 : 36,
          lineHeight: 1.3,
          color: MUTED,
          letterSpacing: "-0.015em",
        }}
      >
        {subtitle}
      </div>
    </div>
    </WithArt>
  );
}

function Trust({ title, subtitle, kicker }: GbpPostImageOptions) {
  return (
    <div style={{ display: "flex", alignItems: "center", flexGrow: 1, padding: "0 72px", gap: 60 }}>
      <img
        src={getJennyDataUri()}
        alt=""
        width={420}
        height={560}
        style={{ width: 420, height: 560, objectFit: "cover", borderRadius: 28 }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 30, flex: 1 }}>
        <Kicker text={kicker ?? DEFAULT_KICKERS.trust} />
        <div
          style={{
            display: "flex",
            fontSize: titleSize(title, [72, 62, 52]),
            lineHeight: 1.05,
            letterSpacing: "-0.05em",
            color: INK,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 32, lineHeight: 1.32, color: MUTED, letterSpacing: "-0.015em" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

function Holiday({ title, subtitle, priceLine, holiday = "christmas", kicker, art }: GbpPostImageOptions) {
  const accent = HOLIDAY_ACCENTS[holiday];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        padding: "0 190px",
        gap: art ? 22 : 30,
        textAlign: "center",
      }}
    >
      {art ? <Art art={art} size={170} /> : null}
      <Kicker text={kicker ?? DEFAULT_KICKERS.holiday} color={accent} center />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: art ? titleSize(title, [88, 74, 60]) : titleSize(title, [100, 84, 68]),
          lineHeight: 1.04,
          letterSpacing: "-0.055em",
          color: INK,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: 36,
          lineHeight: 1.3,
          color: MUTED,
          letterSpacing: "-0.015em",
        }}
      >
        {subtitle}
      </div>
      {priceLine ? <PriceChip text={priceLine} center /> : null}
    </div>
  );
}

export function createGbpPostImage(options: GbpPostImageOptions) {
  const { template } = options;
  const body =
    template === "spotlight" ? (
      <Spotlight {...options} />
    ) : template === "question" ? (
      <Question {...options} />
    ) : template === "trust" ? (
      <Trust {...options} />
    ) : (
      <Holiday {...options} />
    );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BG,
          color: INK,
          fontFamily: "Arial, Helvetica, sans-serif",
          position: "relative",
        }}
      >
        {template === "holiday" ? (
          <img
            src={holidayBackgroundDataUri(options.holiday ?? "christmas")}
            alt=""
            width={GBP_IMAGE_WIDTH}
            height={GBP_IMAGE_HEIGHT}
            style={{ position: "absolute", top: 0, left: 0, width: GBP_IMAGE_WIDTH, height: GBP_IMAGE_HEIGHT }}
          />
        ) : null}
        <Header />
        {body}
        <Footer />
      </div>
    ),
    {
      width: GBP_IMAGE_WIDTH,
      height: GBP_IMAGE_HEIGHT,
    }
  );
}
