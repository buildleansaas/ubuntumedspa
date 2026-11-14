import type { PeninsulaRoute } from "lib/service-satellites";
import { cn } from "lib/utils";

/**
 * A hand-drawn style map of the Virginia Peninsula with one drive highlighted, as inline SVG (no tiles, no scripts).
 * Shapes come from rough real coordinates, projected and smoothed, so the rivers, roads and towns sit in the right
 * places relative to each other. It is a schematic, not a navigation map, and says "Not to scale".
 *
 * The route wording lives in lib/service-satellites.ts (Newport News: I-64 west, then Route 199 toward Monticello
 * Avenue and New Town; Yorktown: the Colonial Parkway or I-64, then Route 199 and Monticello Avenue). The drawing adds
 * no exits, turns or times of its own. Label sizes adapt to the map's width (container queries in globals.css).
 */

type LatLon = readonly [lat: number, lon: number];
type Pt = readonly [x: number, y: number];

// Map window: lon -76.97 to -76.27, lat 37.36 to 36.95, drawn into a 600 x 440 box (true proportions at this latitude).
const W = 600;
const H = 440;
const LON_W = -76.97;
const LON_E = -76.27;
const LAT_N = 37.36;
const LAT_S = 36.95;

const project = ([lat, lon]: LatLon): Pt => [((lon - LON_W) / (LON_E - LON_W)) * W, ((LAT_N - lat) / (LAT_N - LAT_S)) * H];
const n = (value: number) => Math.round(value * 10) / 10;

/** A smooth curve through the points (Catmull-Rom as cubic Béziers). */
const smooth = (coords: readonly LatLon[], closed = false) => {
  const pts = coords.map(project);
  const at = (i: number) => (closed ? pts[(i + pts.length) % pts.length] : pts[Math.max(0, Math.min(pts.length - 1, i))]);
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  const segments = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < segments; i += 1) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`;
  }
  return closed ? `${d} Z` : d;
};

// Shorelines (approximate).
const PENINSULA: LatLon[] = [
  [37.45, -77.0],
  [37.43, -76.75],
  [37.37, -76.705],
  [37.335, -76.67],
  [37.305, -76.645],
  [37.29, -76.615],
  [37.275, -76.585],
  [37.258, -76.555],
  [37.245, -76.527],
  [37.236, -76.506],
  [37.226, -76.48],
  [37.214, -76.445],
  [37.198, -76.412],
  [37.175, -76.386],
  [37.15, -76.36],
  [37.128, -76.336],
  [37.105, -76.312],
  [37.075, -76.297],
  [37.045, -76.288],
  [37.018, -76.291],
  [37.0, -76.302],
  [37.004, -76.326],
  [37.008, -76.352],
  [36.996, -76.38],
  [36.982, -76.408],
  [36.968, -76.436],
  [36.986, -76.454],
  [37.012, -76.468],
  [37.04, -76.49],
  [37.07, -76.52],
  [37.1, -76.55],
  [37.13, -76.585],
  [37.16, -76.61],
  [37.19, -76.63],
  [37.212, -76.655],
  [37.222, -76.69],
  [37.218, -76.73],
  [37.208, -76.775],
  [37.222, -76.82],
  [37.238, -76.87],
  [37.25, -77.0],
];

const SOUTH_SHORE: LatLon[] = [
  [37.185, -77.0],
  [37.183, -76.86],
  [37.184, -76.8],
  [37.173, -76.745],
  [37.15, -76.695],
  [37.12, -76.665],
  [37.08, -76.642],
  [37.04, -76.622],
  [37.0, -76.585],
  [36.97, -76.545],
  [36.948, -76.5],
  [36.932, -76.45],
  [36.9, -76.4],
  [36.85, -76.4],
  [36.85, -77.0],
];

const GLOUCESTER: LatLon[] = [
  [37.48, -76.74],
  [37.42, -76.69],
  [37.385, -76.645],
  [37.35, -76.61],
  [37.32, -76.575],
  [37.29, -76.54],
  [37.264, -76.512],
  [37.25, -76.496],
  [37.255, -76.47],
  [37.25, -76.43],
  [37.256, -76.39],
  [37.272, -76.36],
  [37.3, -76.335],
  [37.335, -76.31],
  [37.4, -76.29],
  [37.48, -76.26],
];

// Roads (approximate). Shared junction points are written once so the highlight lines up with the roads.
const EXIT_234: LatLon = [37.335, -76.74];
const EXIT_242: LatLon = [37.258, -76.643];
const EXIT_250: LatLon = [37.165, -76.545];
const I64_NN: LatLon = [37.085, -76.48];
const NEW_TOWN: LatLon = [37.268, -76.745];
const TOWN: LatLon = [37.271, -76.703];
const CLINIC: LatLon = [37.273, -76.7636];
const YORKTOWN: LatLon = [37.236, -76.509];
const NEWPORT_NEWS: LatLon = [37.07, -76.495];
const HAMPTON: LatLon = [37.03, -76.345];

const I64_WEST: LatLon[] = [[37.4, -76.86], [37.37, -76.81], [37.35, -76.767], EXIT_234, [37.305, -76.7], [37.28, -76.665], EXIT_242];
const I64_MID: LatLon[] = [EXIT_242, [37.238, -76.613], [37.205, -76.576], EXIT_250, [37.122, -76.512], I64_NN];
const I64_EAST: LatLon[] = [I64_NN, [37.062, -76.432], [37.042, -76.386], [37.03, -76.352], [37.018, -76.326], [37.004, -76.31]];
const HRBT: LatLon[] = [[37.004, -76.31], [36.978, -76.302], [36.94, -76.298]];
const I64: LatLon[] = [...I64_WEST, ...I64_MID.slice(1), ...I64_EAST.slice(1)];

const RT199_WEST: LatLon[] = [EXIT_234, [37.31, -76.752], [37.29, -76.753], NEW_TOWN];
const RT199_SOUTH: LatLon[] = [NEW_TOWN, [37.252, -76.734], [37.239, -76.713], [37.235, -76.69], [37.241, -76.668], [37.25, -76.652], EXIT_242];
const RT199: LatLon[] = [...RT199_WEST, ...RT199_SOUTH.slice(1)];

const MONTICELLO: LatLon[] = [TOWN, [37.27, -76.725], NEW_TOWN, [37.2705, -76.755], CLINIC];
const PARKWAY_YORK: LatLon[] = [
  TOWN,
  [37.281, -76.688],
  [37.29, -76.668],
  [37.291, -76.645],
  [37.279, -76.618],
  [37.265, -76.59],
  [37.252, -76.562],
  [37.242, -76.535],
  YORKTOWN,
];
const PARKWAY_JAMES: LatLon[] = [TOWN, [37.258, -76.706], [37.24, -76.72], [37.227, -76.737], [37.219, -76.76], [37.214, -76.785]];
const YORKTOWN_LINK: LatLon[] = [YORKTOWN, [37.215, -76.528], [37.19, -76.54], EXIT_250];
const NEWPORT_NEWS_LINK: LatLon[] = [NEWPORT_NEWS, I64_NN];

const rev = (points: LatLon[]) => [...points].reverse();

const ROUTES: Record<
  PeninsulaRoute,
  { from: string; main: LatLon[]; alternative?: LatLon[]; markers: { at: LatLon; label: string }[]; desc: string }
> = {
  "newport-news": {
    from: "Newport News",
    main: [NEWPORT_NEWS, ...rev(I64_MID), ...rev(RT199_SOUTH).slice(1), ...MONTICELLO.slice(3)],
    markers: [
      { at: [37.205, -76.576], label: "1" },
      { at: [37.237, -76.705], label: "2" },
      { at: [37.2705, -76.755], label: "3" },
    ],
    desc: "A schematic map of the Virginia Peninsula, not to scale, with the James River to the south and the York River to the north. The highlighted route starts in Newport News and follows I-64 west toward Williamsburg, then Route 199 toward Monticello Avenue and New Town, and ends at the Williamsburg Med Spa pin on Powhatan Parkway. Yorktown and Hampton are marked for reference.",
  },
  yorktown: {
    from: "Yorktown",
    // The highlight follows the stated steps exactly: toward Williamsburg, then Route 199 and Monticello Avenue. The
    // Colonial Parkway is the other way the copy names; it's drawn as the soft alternative (no Parkway-to-199 ramp is
    // drawn, since the copy names none).
    main: [...YORKTOWN_LINK, ...rev(I64_MID).slice(3), ...rev(RT199_SOUTH).slice(1), ...MONTICELLO.slice(3)],
    alternative: [...rev(PARKWAY_YORK)],
    markers: [
      { at: [37.19, -76.54], label: "1" },
      { at: [37.237, -76.705], label: "2" },
      { at: [37.2705, -76.755], label: "3" },
    ],
    desc: "A schematic map of the Virginia Peninsula, not to scale, with the York River to the north and the James River to the south. The highlighted route starts in Yorktown and heads toward Williamsburg, then connects through Route 199 and Monticello Avenue to the Williamsburg Med Spa pin on Powhatan Parkway. A soft line shows the other way toward Williamsburg, the Colonial Parkway along the York River. Newport News and Hampton are marked for reference.",
  },
};

const INK = "#24313A";
const RIVER = "#4F6F86";
const WATER = "#dbe4ec";
const LINEN = "#F4F3EF";
const MIST = "#E8EBE8";
const BOXWOOD = "#6F8470";

const p = (point: LatLon) => project(point).map(n) as unknown as Pt;

/** A soft wave mark for open water. */
const wave = ([x, y]: Pt) => `M${x - 9} ${y} q4.5 -4 9 0 t9 0 M${x - 4} ${y + 6} q4.5 -4 9 0 t9 0`;
const WAVES: Pt[] = [
  [563, 112],
  [574, 268],
  [518, 412],
  [323, 392],
  [225, 262],
];

type MapLabel = { at: Pt; text: string; anchor?: "start" | "middle" | "end"; className?: string };

export default function PeninsulaRouteMap({
  route,
  size = "card",
  className,
}: {
  route: PeninsulaRoute;
  /** "card" sits on top of a route card; "large" is the single map on an area page. */
  size?: "card" | "large";
  className?: string;
}) {
  const config = ROUTES[route];
  const id = `peninsula-map-${route}-${size}`;
  const [cx, cy] = p(CLINIC);
  const towns: { key: PeninsulaRoute | "hampton"; at: LatLon; label: MapLabel }[] = [
    { key: "yorktown", at: YORKTOWN, label: { at: [p(YORKTOWN)[0] + 12, p(YORKTOWN)[1] - 9], text: "Yorktown" } },
    {
      key: "newport-news",
      at: NEWPORT_NEWS,
      label: { at: [p(NEWPORT_NEWS)[0] - 12, p(NEWPORT_NEWS)[1] + 6], text: "Newport News", anchor: "end" },
    },
    { key: "hampton", at: HAMPTON, label: { at: [p(HAMPTON)[0] - 10, p(HAMPTON)[1] + 22], text: "Hampton", anchor: "end" } },
  ];

  return (
    <div className={cn("route-map", className)} data-route-map={route}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Map of the drive from ${config.from} to Williamsburg Med Spa`}
        aria-describedby={`${id}-desc`}
        className="block h-auto w-full"
        fontFamily="inherit"
      >
        {/* Named by aria-label, not <title>: scripts/verify-seo.mjs counts every <title> in the page as a document title. */}
        <desc id={`${id}-desc`}>{config.desc}</desc>

        {/* Water, then a soft shallows band around every shore, then the land. */}
        <rect width={W} height={H} fill={WATER} />
        <g fill="none" stroke={RIVER} strokeOpacity="0.22" strokeWidth="1.2" strokeLinecap="round">
          {WAVES.map((point) => (
            <path key={point.join()} d={wave(point)} />
          ))}
        </g>
        <g fill="none" stroke="#c9d6e0" strokeWidth="9" strokeLinejoin="round">
          <path d={smooth(SOUTH_SHORE, true)} />
          <path d={smooth(GLOUCESTER, true)} />
          <path d={smooth(PENINSULA, true)} />
        </g>
        <g stroke={RIVER} strokeOpacity="0.45" strokeWidth="1.1" strokeLinejoin="round">
          <path d={smooth(SOUTH_SHORE, true)} fill={MIST} />
          <path d={smooth(GLOUCESTER, true)} fill={MIST} />
          <path d={smooth(PENINSULA, true)} fill={LINEN} />
        </g>

        {/* Water names. */}
        <g fill={RIVER} fontStyle="italic" className="rm-water">
          <text transform={`translate(283 34) rotate(31)`} textAnchor="middle" className="rm-small">
            York River
          </text>
          <text transform={`translate(263 214) rotate(50)`} textAnchor="middle" className="rm-small">
            James River
          </text>
          <text x="444" y="424" textAnchor="middle" className="rm-small rm-wide-only">
            Hampton Roads
          </text>
          <text x="588" y="178" textAnchor="end" className="rm-small rm-wide-only">
            <tspan x="588">Chesapeake</tspan>
            <tspan x="588" dy="1.15em">
              Bay
            </tspan>
          </text>
        </g>

        {/* The other option (Yorktown: I-64) as a soft band under the roads. */}
        {config.alternative && (
          <path d={smooth(config.alternative)} fill="none" stroke={BOXWOOD} strokeOpacity="0.32" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Roads: local links, the parkway, Route 199, Monticello Avenue, then I-64 on top. */}
        <g fill="none" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
          <path d={smooth(YORKTOWN_LINK)} strokeOpacity="0.28" strokeWidth="1.3" />
          <path d={smooth(NEWPORT_NEWS_LINK)} strokeOpacity="0.28" strokeWidth="1.3" />
          <path d={smooth(PARKWAY_JAMES)} strokeOpacity="0.35" strokeWidth="1.6" />
          <path d={smooth(PARKWAY_YORK)} strokeOpacity="0.6" strokeWidth="2" />
          <path d={smooth(MONTICELLO)} strokeOpacity="0.5" strokeWidth="1.5" />
          <path d={smooth(RT199)} strokeOpacity="0.7" strokeWidth="2.2" />
          <path d={smooth(HRBT)} strokeOpacity="0.55" strokeWidth="2.4" strokeDasharray="2 5" />
          <path d={smooth(I64)} strokeWidth="4.6" stroke={LINEN} />
          <path d={smooth(I64)} strokeWidth="3.2" />
        </g>

        {/* The highlighted drive: a linen casing, the boxwood line, and the optional dashed alternative. */}
        {config.alternative && (
          <path
            d={smooth(YORKTOWN_LINK)}
            fill="none"
            stroke={BOXWOOD}
            strokeWidth="3"
            strokeDasharray="1 6"
            strokeLinecap="round"
          />
        )}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={smooth(config.main)} stroke={LINEN} strokeWidth="10" />
          <path d={smooth(config.main)} stroke={BOXWOOD} strokeWidth="5.5" pathLength={1} className="rm-route-line" />
        </g>

        {/* Road names: an I-64 badge, a Route 199 badge and the parkway's name. */}
        <g transform={`translate(${p([37.322, -76.722]).join(" ")})`}>
          <g className="rm-grow">
          <rect x="-15" y="-10" width="30" height="20" rx="6" fill={INK} />
          <text y="0.36em" textAnchor="middle" fill={LINEN} fontWeight="700" className="rm-badge-text">
            64
          </text>
          </g>
        </g>
        <g transform={`translate(${p([37.246, -76.66]).join(" ")})`}>
          <g className="rm-grow">
          <rect x="-16" y="-10" width="32" height="20" rx="10" fill={LINEN} stroke={INK} strokeWidth="1.4" />
          <text y="0.36em" textAnchor="middle" fill={INK} fontWeight="700" className="rm-badge-text">
            199
          </text>
          </g>
        </g>
        <text
          transform={`translate(${p([37.25, -76.566]).join(" ")}) rotate(28)`}
          textAnchor="middle"
          fill={INK}
          fillOpacity="0.75"
          fontStyle="italic"
          className="rm-small rm-halo rm-wide-only"
          dy="1.4em"
        >
          Colonial Pkwy
        </text>

        {/* Step markers that match the numbered steps beside the map. */}
        {config.markers.map(({ at, label }) => (
          <g key={label} transform={`translate(${p(at).join(" ")})`}>
            <g className="rm-grow">
              <circle r="9" fill={BOXWOOD} stroke={LINEN} strokeWidth="2" />
              <text y="0.35em" textAnchor="middle" fill={LINEN} fontWeight="700" className="rm-marker-text">
                {label}
              </text>
            </g>
          </g>
        ))}

        {/* Towns. The start of this drive is filled and bold. */}
        {towns.map(({ key, at, label }) => {
          const [x, y] = p(at);
          const isStart = key === route;
          return (
            <g key={key}>
              <circle cx={x} cy={y} r={isStart ? 7 : 4.5} fill={isStart ? BOXWOOD : LINEN} stroke={isStart ? LINEN : INK} strokeWidth={isStart ? 2.5 : 1.6} />
              {isStart && <circle cx={x} cy={y} r="11" fill="none" stroke={BOXWOOD} strokeWidth="1.4" strokeOpacity="0.6" />}
              <text
                x={label.at[0]}
                y={label.at[1]}
                textAnchor={label.anchor ?? "start"}
                fill={INK}
                fontWeight={isStart ? 700 : 500}
                className="rm-label rm-halo"
              >
                {label.text}
              </text>
            </g>
          );
        })}

        {/* The clinic pin. */}
        <g transform={`translate(${cx} ${cy})`}>
          <ellipse cx="0" cy="1" rx="6" ry="2.2" fill={INK} fillOpacity="0.18" />
          <g className="rm-grow-pin">
            <path d="M0 0 C-2.5 -6.5 -10 -11 -10 -19.5 A10 10 0 1 1 10 -19.5 C10 -11 2.5 -6.5 0 0 Z" fill={INK} stroke={LINEN} strokeWidth="1.5" />
            <circle cx="0" cy="-19.5" r="4" fill={LINEN} />
          </g>
        </g>
        <text x={cx - 18} y={cy - 46} textAnchor="end" fill={INK} fontWeight="700" className="rm-label rm-halo">
          <tspan x={cx - 18}>Williamsburg</tspan>
          <tspan x={cx - 18} dy="1.1em">
            Med Spa
          </tspan>
        </text>

        {/* Compass and the scale note. */}
        <g transform="translate(34 360)" fill="none" stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
          <path d="M0 -16 L6 6 L0 2 L-6 6 Z" fill={INK} />
          <text y="-22" textAnchor="middle" fill={INK} stroke="none" fontWeight="700" className="rm-small">
            N
          </text>
        </g>
        <text x="20" y="420" fill={INK} fillOpacity="0.7" className="rm-small">
          Not to scale
        </text>

        <rect x="6" y="6" width={W - 12} height={H - 12} rx="10" fill="none" stroke={INK} strokeOpacity="0.14" />
      </svg>
    </div>
  );
}
