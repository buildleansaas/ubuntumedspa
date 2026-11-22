/**
 * Gift card themes: one card design, re-skinned per holiday or event.
 *
 * To add next holiday's look, add one entry to GIFT_CARD_THEMES (see docs/gift-cards.md). The /gift-cards page,
 * the recipient's printable card and its PNG all read the active theme, so nothing else changes. Keep theme windows
 * from overlapping; the first match wins. Copy rules: no outcome promises, no prices typed here.
 */
export type GiftCardTheme = {
  slug: string;
  /** Internal name, e.g. "Christmas". */
  name: string;
  /** Yearly window in clinic time, "MM-DD" inclusive. The evergreen theme has none. */
  startsOn?: string;
  endsOn?: string;
  /** Small spaced caps line above the headline. */
  kicker: string;
  /** Headline before and after the italic accent word; "\n" breaks the line: "Give the gift\nof a" + "refresh". */
  headlineLead: string;
  headlineAccent: string;
  headlineTail?: string;
  /** One or two sentences under the headline. */
  intro: string;
  /** The small line on the card itself, above "Gift card". */
  cardKicker: string;
  colors: {
    /** Page background, top and bottom of the gradient. */
    backgroundTop: string;
    backgroundBottom: string;
    /** Headline and body text on the background. */
    text: string;
    mutedText: string;
    /** Accent word, kicker, frame, sparkles, buttons. */
    accent: string;
    accentText: string;
    /** The card itself. */
    cardFrom: string;
    cardTo: string;
    cardInk: string;
    cardAccent: string;
    /** Ribbon across the card; omit for a plain card. */
    ribbon?: string;
  };
};

const TIDEWATER_NIGHT = {
  backgroundTop: "#2e3e49",
  backgroundBottom: "#1c262d",
  text: "#f4f3ef",
  mutedText: "#c9d3d8",
  accent: "#d4ae55",
  accentText: "#1c262d",
  cardFrom: "#f6f1e4",
  cardTo: "#e3d3a8",
  cardInk: "#24313a",
  cardAccent: "#a8822f",
};

export const EVERGREEN_GIFT_CARD_THEME: GiftCardTheme = {
  slug: "evergreen",
  name: "Evergreen",
  kicker: "GIFT CARDS",
  headlineLead: "Give the gift\nof a",
  headlineAccent: "refresh",
  intro: "A Williamsburg Med Spa gift card works toward any treatment or product, chosen with Jenny at the visit.",
  cardKicker: "GIFT CARD",
  colors: TIDEWATER_NIGHT,
};

export const GIFT_CARD_THEMES: GiftCardTheme[] = [
  {
    slug: "christmas",
    name: "Christmas",
    startsOn: "11-15",
    endsOn: "12-31",
    kicker: "THE HOLIDAY GIFT",
    headlineLead: "Give the gift\nof a",
    headlineAccent: "refresh",
    intro:
      "Botox®, Xeomin®, PRP facials, B-12 and more: a Williamsburg Med Spa gift card works toward any treatment or product, chosen with Jenny at the visit.",
    cardKicker: "HOLIDAY GIFT CARD",
    colors: { ...TIDEWATER_NIGHT, ribbon: "#c62f3c" },
  },
];

/** "MM-DD" for a date in America/New_York. */
export const clinicMonthDay = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${month}-${day}`;
};

const inWindow = (monthDay: string, startsOn: string, endsOn: string) =>
  startsOn <= endsOn ? monthDay >= startsOn && monthDay <= endsOn : monthDay >= startsOn || monthDay <= endsOn;

/** The theme for a date (clinic time). Windows may wrap the new year, e.g. "12-26" to "01-10". */
export const activeGiftCardTheme = (date: Date = new Date()): GiftCardTheme => {
  const monthDay = clinicMonthDay(date);
  return (
    GIFT_CARD_THEMES.find(
      (theme) => theme.startsOn && theme.endsOn && inWindow(monthDay, theme.startsOn, theme.endsOn)
    ) ?? EVERGREEN_GIFT_CARD_THEME
  );
};

export const giftCardThemeBySlug = (slug: string | undefined): GiftCardTheme =>
  GIFT_CARD_THEMES.find((theme) => theme.slug === slug) ?? EVERGREEN_GIFT_CARD_THEME;
