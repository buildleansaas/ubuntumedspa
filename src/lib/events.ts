import { procedures, products } from "data";

export type EventFieldType = "text" | "email" | "tel" | "number" | "textarea" | "checkbox";
export type EventFieldLayout = "half" | "full";
export type EventFieldValue = string | number | string[];
export type EventFormStateValue = string | string[];
export type EventFormState = Record<string, EventFormStateValue>;
export type EventOptionGroup = {
  label: string;
  options: string[];
};

export type EventFieldDefinition = {
  id: string;
  label: string;
  type: EventFieldType;
  layout?: EventFieldLayout;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  options?: string[];
  optionGroups?: EventOptionGroup[];
  lockedOptions?: string[];
  min?: number;
  defaultValue?: string | string[];
};

export type EventInfoCard = {
  eyebrow?: string;
  title: string;
  description: string;
};

export type EventStep = {
  title: string;
  description: string;
};

export type EventFaq = {
  question: string;
  answer: string;
};

export type EventDefinition = {
  slug: string;
  title: string;
  published: boolean;
  canonicalPath: string;
  metadataTitle: string;
  metadataDescription: string;
  heroImageSrc: string;
  heroImageAlt: string;
  thumbnailImageSrc?: string;
  thumbnailImageAlt?: string;
  listing: {
    eyebrow: string;
    title: string;
    description: string;
    highlights: string[];
    ctaLabel: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
    highlights: string[];
    primaryCtaLabel: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };
  rewards: {
    eyebrow: string;
    heading: string;
    body: string;
    cards: EventInfoCard[];
  };
  process: {
    eyebrow: string;
    heading: string;
    body: string;
    steps: EventStep[];
  };
  support: {
    eyebrow: string;
    heading: string;
    body: string;
    supportingBody?: string;
    notes: EventInfoCard[];
  };
  form: {
    eyebrow: string;
    heading: string;
    body: string;
    disclaimer?: string;
    submitButtonLabel: string;
    successMessage: string;
    fields: EventFieldDefinition[];
  };
  faq: {
    heading: string;
    items: EventFaq[];
  };
  closing: {
    heading: string;
    subheading: string;
    body: string;
    primaryCtaLabel: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };
  schedule: {
    eyebrow: string;
    heading: string;
    body: string;
    fallbackTitle: string;
    fallbackBody: string;
  };
  leadSubjectLabel: string;
};

const CORE_EVENT_FIELD_IDS = ["name", "email", "phone"] as const;

export const isCoreEventFieldId = (id: string) => CORE_EVENT_FIELD_IDS.includes(id as (typeof CORE_EVENT_FIELD_IDS)[number]);

const isPublishedEntry = (entry: Record<string, unknown>) => !("published" in entry) || entry.published !== false;

const getProcedureNamesBySlug = (slugs: string[]) => {
  const publishedProcedureMap = new Map(
    procedures.filter(isPublishedEntry).map((procedure) => [procedure.slug, procedure.name] as const)
  );

  return slugs.flatMap((slug) => {
    const name = publishedProcedureMap.get(slug);
    return name ? [name] : [];
  });
};

const buildWrinkleRelaxerPartyAddOnOptionGroups = (): EventOptionGroup[] => {
  const injectableSlugs = ["hyperhidrosis-treatment"];
  const regenerativeSlugs = [
    "oh-shot",
    "pe-shot",
    "prp-breast-lift",
    "prp-hair-restoration",
    "prp-facial",
    "prp-face-lift",
    "joint-restoration",
  ];

  const categorizedProcedureSlugs = new Set(["botox", "xeomin", ...injectableSlugs, ...regenerativeSlugs]);
  const otherServiceOptions = procedures
    .filter((procedure) => isPublishedEntry(procedure) && !categorizedProcedureSlugs.has(procedure.slug))
    .map((procedure) => procedure.name);

  return [
    {
      label: "Other injectables",
      options: getProcedureNamesBySlug(injectableSlugs),
    },
    {
      label: "PRP and regenerative care",
      options: getProcedureNamesBySlug(regenerativeSlugs),
    },
    {
      label: "Other services",
      options: otherServiceOptions,
    },
    {
      label: "Products",
      options: products.filter(isPublishedEntry).map((product) => product.name),
    },
  ].filter((group) => group.options.length > 0);
};

// URL slug "botox-party" is kept for existing links; the event is a Xeomin wrinkle relaxer party (no Botox brand here).
const WRINKLE_RELAXER_PARTY_EVENT: EventDefinition = {
  slug: "botox-party",
  title: "Wrinkle Relaxer Party",
  published: true,
  canonicalPath: "/events/botox-party",
  metadataTitle: "Plan a Private Friend Party | Williamsburg Med Spa",
  metadataDescription:
    "Host a wrinkle relaxer party in Williamsburg, VA. We use Xeomin®, a Botox® alternative. Bring paid Xeomin guests and introduce friends to PRP, skin, and product options.",
  heroImageSrc: "/events/botox-party-hero.webp",
  heroImageAlt: "A stylish group of women laughing together at an intimate outdoor wrinkle relaxer party",
  thumbnailImageSrc: "/events/botox-party-thumb.webp",
  thumbnailImageAlt: "Women socializing at a chic wrinkle relaxer party",
  listing: {
    eyebrow: "Featured Event",
    title: "Host a Xeomin wrinkle relaxer party that introduces friends to Williamsburg Med Spa.",
    description:
      "Bring together friends who are already curious about wrinkle relaxers. We use Xeomin®, a Botox® alternative. The event starts with a Xeomin plan and gives guests an easy way to ask about PRP, skin, wellness, and product options without turning the party into a generic sales pitch.",
    highlights: ["Xeomin-led event", "Private group planning", "PRP questions welcome"],
    ctaLabel: "Plan a Wrinkle Relaxer Party",
  },
  hero: {
    eyebrow: "Williamsburg Med Spa Event",
    heading: "Turn real friend-group interest into a private Xeomin event.",
    body:
      "Xeomin, our wrinkle relaxer and a Botox® alternative, is the door-opener. The party format helps curious friends meet Jenny, ask practical questions, and learn which next step may fit them, from injectables to PRP, skin, wellness, or products.",
    highlights: ["Xeomin-led party", "Private planning call", "PRP and skin questions welcome", "Individual screening still required"],
    primaryCtaLabel: "Plan My Party",
    secondaryCtaLabel: "Read About Xeomin",
    secondaryCtaHref: "/procedures/xeomin",
  },
  rewards: {
    eyebrow: "Why host",
    heading: "A social first step into Jenny's services.",
    body:
      "The point is not to make the party feel like a clinic waiting room. It is to give the host a clear reason to invite friends, make a wrinkle relaxer feel approachable, and open the door to thoughtful conversations about other treatment paths.",
    cards: [
      {
        eyebrow: "For curious friends",
        title: "Wrinkle relaxers are the easy first question",
        description: "Most guests already know the idea of a wrinkle relaxer, often by the Botox® name. Xeomin is the one we use, and it is a natural starting point for a group event.",
      },
      {
        eyebrow: "For the host",
        title: "Give friends a reason to come together",
        description:
          "The host helps gather people who trust each other, then Williamsburg Med Spa helps shape the planning call, guest flow, and next steps.",
      },
      {
        eyebrow: "For future care",
        title: "Introduce PRP, skin, wellness, and products naturally",
        description:
          "Guests who start with wrinkle-relaxer questions can also ask about PRP, skin quality, wellness goals, and medical-grade product options without pressure.",
      },
    ],
  },
  process: {
    eyebrow: "How it works",
    heading: "Plan the party around Xeomin, then leave room for the bigger conversation.",
    body:
      "The process is straightforward: send the basics, schedule the planning call, confirm the Xeomin-led guest flow, and flag which other services your group may want to ask about.",
    steps: [
      {
        title: "Share the guest list idea",
        description:
          "Tell us how many people are interested, whether they are coming for Xeomin first, and what questions they keep bringing up.",
      },
      {
        title: "Book a planning call",
        description:
          "After the form, choose a short call so we can review the setup, timing, location idea, and what needs to happen before the event.",
      },
      {
        title: "Shape the treatment conversation",
        description:
          "Xeomin remains the anchor, but Jenny can prepare to answer questions about PRP, skin, wellness, products, or other services that fit the group.",
      },
      {
        title: "Host the event",
        description:
          "Guests still receive individual screening and candidacy review. The party format creates access and comfort, not one-size-fits-all treatment.",
      },
    ],
  },
  support: {
    eyebrow: "Planning notes",
    heading: "Use Xeomin as the reason to gather, not the limit of the conversation.",
    body:
      "This page is built for hosts who already have friends, neighbors, coworkers, or clients asking about wrinkle relaxers and want to make the first step feel social, organized, and credible.",
    supportingBody:
      "If your group is also curious about PRP, skin quality, wellness, products, or another service on the site, include that in the form so Jenny can prepare for the planning call.",
    notes: [
      {
        title: "Built for real friend groups",
        description:
          "This works best when you already have a few friends or contacts who have been talking about wrinkle relaxers and want to coordinate together.",
      },
      {
        title: "Add-on conversations are welcome",
        description:
          "Xeomin is the core offer, but the party can also tee up PRP, skin, wellness, product, and follow-up consultation questions for interested guests.",
      },
      {
        title: "Medical screening still matters",
        description:
          "Every guest still needs individual screening and candidacy review. The party format makes planning easier, not less clinical.",
      },
    ],
  },
  form: {
    eyebrow: "Plan your party",
    heading: "Start with one intake form, then choose your planning call.",
    body:
      "Share the group size, the date range, the location idea, and anything else the group may want to ask about. Once the form is in, you'll be redirected to schedule a quick planning conversation.",
    disclaimer:
      "Xeomin is a prescription treatment. Williamsburg Med Spa does not offer Botox® brand. Final treatment plans, dosing, candidacy, and timing are confirmed individually after review.",
    submitButtonLabel: "Plan My Party",
    successMessage: "Party request received. Redirecting to scheduling...",
    fields: [
      {
        id: "name",
        label: "Host name",
        type: "text",
        required: true,
        placeholder: "Your name",
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "you@example.com",
      },
      {
        id: "phone",
        label: "Phone",
        type: "tel",
        required: true,
        placeholder: "Best number for planning",
      },
      {
        id: "expectedGuestCount",
        label: "Expected paid Xeomin guests",
        type: "number",
        required: true,
        min: 5,
        defaultValue: "5",
        placeholder: "5",
        helperText: "The public host offer starts at 5 paid Xeomin guests.",
      },
      {
        id: "preferredDates",
        label: "Preferred dates or planning window",
        type: "text",
        layout: "full",
        required: true,
        placeholder: "Example: Thursday evenings in June",
      },
      {
        id: "venueLocation",
        label: "Venue or location idea",
        type: "text",
        layout: "full",
        required: true,
        placeholder: "Tell us where you want to host or the area you have in mind",
        helperText: "Share the location you have in mind and we'll confirm what is clinically and logistically workable.",
      },
      {
        id: "desiredTreatments",
        label: "Other services your group may ask about",
        type: "checkbox",
        layout: "full",
        required: false,
        lockedOptions: ["Xeomin"],
        defaultValue: ["Xeomin"],
        optionGroups: buildWrinkleRelaxerPartyAddOnOptionGroups(),
        helperText:
          "Xeomin stays included because the party is Xeomin-led. Check anything else guests may want Jenny to be ready to discuss, including PRP or skin questions.",
      },
      {
        id: "comments",
        label: "Anything else we should know?",
        type: "textarea",
        layout: "full",
        placeholder: "Share guest questions, first-timer concerns, or anything you want us to prepare for.",
      },
    ],
  },
  faq: {
    heading: "Questions hosts usually ask first",
    items: [
      {
        question: "What counts toward the 5-person minimum?",
        answer:
          "Paid Xeomin guests count toward the host reward. We confirm the qualifying guest count through the actual party bookings and treatments completed.",
      },
      {
        question: "Can guests ask about PRP, skin, or wellness services too?",
        answer:
          "Yes. Xeomin is the anchor for the party, but the planning form lets you flag PRP, skin, wellness, product, and follow-up consultation questions Jenny should be ready to discuss.",
      },
      {
        question: "Where can a wrinkle relaxer party happen?",
        answer:
          "Use the form to tell us the location you have in mind. We'll review whether the setup, timing, and guest flow are a fit before anything is confirmed.",
      },
      {
        question: "How do the extra rewards work after the first five guests?",
        answer:
          "Every additional five paid Xeomin guests adds more free products and procedure credits for the host. We'll confirm the reward mix during planning.",
      },
      {
        question: "Does every guest still need individual screening?",
        answer:
          "Yes. Xeomin is a medical treatment, so each guest still needs an individual assessment to determine candidacy, dosing, and whether treatment is appropriate.",
      },
    ],
  },
  closing: {
    heading: "Make the guest list, then let us help shape the event.",
    subheading:
      "Five paid Xeomin guests earns the host Xeomin credit for their own treatment. Every additional five adds more free products and procedure credits.",
    body:
      "Submit the planning form now, then pick a time to talk through the details before the party is locked in.",
    primaryCtaLabel: "Plan My Party",
    secondaryCtaLabel: "Browse Xeomin Details",
    secondaryCtaHref: "/procedures/xeomin",
  },
  schedule: {
    eyebrow: "Party Scheduling",
    heading: "Choose your planning call time",
    body:
      "Your party details are recorded. Pick a time that works and we'll use the call to talk through guest count, timing, and the treatment mix you have in mind.",
    fallbackTitle: "Scheduling isn't configured yet",
    fallbackBody: "Add NEXT_PUBLIC_CAL_COM_CONSULT_LINK to enable the event planning scheduler.",
  },
  leadSubjectLabel: "WRINKLE RELAXER PARTY",
};

export const EVENTS: EventDefinition[] = [WRINKLE_RELAXER_PARTY_EVENT];

export const getPublishedEvents = () => EVENTS.filter((event) => event.published);

export const getEventBySlug = (slug: string) => EVENTS.find((event) => event.slug === slug);

export const serializeEventFieldValue = (value: EventFieldValue) =>
  Array.isArray(value) ? value.join(", ") : String(value);

export const buildEventNotificationLines = (
  event: EventDefinition,
  values: Record<string, EventFieldValue>
) =>
  event.form.fields.map((field) => `${field.label}: ${serializeEventFieldValue(values[field.id])}`);

export const buildEventMetadataPayload = (responses: Record<string, EventFieldValue>) =>
  Object.fromEntries(
    Object.entries(responses).map(([key, value]) => [key, serializeEventFieldValue(value)])
  );
