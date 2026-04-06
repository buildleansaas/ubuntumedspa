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

const buildBotoxPartyAddOnOptionGroups = (): EventOptionGroup[] => {
  const injectableSlugs = ["xeomin", "filler", "hyperhidrosis-treatment"];
  const regenerativeSlugs = [
    "o-shot",
    "p-shot",
    "prp-breast-lift",
    "prp-hair-restoration",
    "prp-facial",
    "prp-face-lift",
    "joint-restoration",
  ];

  const categorizedProcedureSlugs = new Set(["botox", ...injectableSlugs, ...regenerativeSlugs]);
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

const BOTOX_PARTY_EVENT: EventDefinition = {
  slug: "botox-party",
  title: "Botox Party",
  published: true,
  canonicalPath: "/events/botox-party",
  metadataTitle: "Host a Botox Party in Williamsburg, VA | Williamsburg Med Spa",
  metadataDescription:
    "Plan a Botox party with Williamsburg Med Spa. Bring 5 or more paid Botox guests and the host's Botox is free, with bonus products and procedure credits for larger groups.",
  heroImageSrc: "/events/botox-party-hero.webp",
  heroImageAlt: "A stylish group of women laughing together at an intimate outdoor botox party gathering",
  thumbnailImageSrc: "/events/botox-party-thumb.webp",
  thumbnailImageAlt: "Women socializing at a chic botox party gathering",
  listing: {
    eyebrow: "Featured Event",
    title: "Host a Botox party and make your own treatment free.",
    description:
      "Bring 5 or more paid Botox guests and the host's Botox is free. Every additional 5 paid Botox guests unlocks more free products and procedure credits.",
    highlights: ["5+ paid Botox guests", "Host Botox free", "Extra 5s add perks"],
    ctaLabel: "Plan a Botox Party",
  },
  hero: {
    eyebrow: "Williamsburg Med Spa Event",
    heading: "Bring 5 or more paid Botox guests and the host's Botox is free.",
    body:
      "The more the merrier. Every additional 5 paid Botox guests comes with more free products and procedure credits for the host.",
    highlights: ["5+ paid Botox guests", "Host Botox free", "Every extra 5 adds perks", "Quick planning call"],
    primaryCtaLabel: "Plan My Party",
    secondaryCtaLabel: "Read About Botox",
    secondaryCtaHref: "/procedures/botox",
  },
  rewards: {
    eyebrow: "Host rewards",
    heading: "More guests, more host rewards.",
    body:
      "Five paid Botox guests gets the host Botox free. Every additional five adds free products and procedure credits.",
    cards: [
      {
        eyebrow: "5 paid Botox guests",
        title: "Host Botox free",
        description: "Once your party brings in five paid Botox guests, the host's Botox treatment is on us.",
      },
      {
        eyebrow: "10 paid Botox guests",
        title: "Free Botox plus bonus perks",
        description:
          "At ten paid Botox guests, the host reward includes free Botox plus extra free products and procedure credits.",
      },
      {
        eyebrow: "15+ paid Botox guests",
        title: "Keep stacking rewards",
        description:
          "Every additional five paid Botox guests unlocks more free products and procedure credits for the host.",
      },
    ],
  },
  process: {
    eyebrow: "How it works",
    heading: "Plan it like a medical event, not a guessing game.",
    body:
      "The process is straightforward: send the details, schedule the planning call, confirm what your group wants, and host the event with the reward structure already understood.",
    steps: [
      {
        title: "Share the basics",
        description:
          "Tell us the guest count, the timing, the location idea, and whether your group wants Botox only or a few add-on conversations too.",
      },
      {
        title: "Book a planning call",
        description:
          "After the form, you'll choose a short call so we can review the party setup, guest flow, and what needs to happen before the event.",
      },
      {
        title: "Confirm the details",
        description:
          "We'll finalize the guest list target, the treatment mix, and the practical details that make the day run smoothly.",
      },
      {
        title: "Host the party",
        description:
          "Once the party is complete and the paid Botox guest count is confirmed, your host rewards follow the tier you reached.",
      },
    ],
  },
  support: {
    eyebrow: "Planning notes",
    heading: "The best parties start with a real guest list and realistic expectations.",
    body:
      "This page is built for hosts who already have interest from friends, neighbors, or contacts and want to turn that interest into a cleanly organized Botox event.",
    supportingBody:
      "If your group is also curious about other injectables, regenerative care, products, or another service on the site, include that in the form so the planning call can be specific instead of generic.",
    notes: [
      {
        title: "Built for real friend groups",
        description:
          "This works best when you already have a few friends or contacts who have been talking about Botox and want to coordinate together.",
      },
      {
        title: "Add-ons are welcome",
        description:
          "Botox is the core offer, but we can also plan around other injectables, regenerative care, ear piercing, and medical-grade products if that better fits the group.",
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
      "Botox is a prescription treatment. Final treatment plans, dosing, candidacy, and timing are confirmed individually after review.",
    submitButtonLabel: "Plan My Botox Party",
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
        label: "Expected paid Botox guests",
        type: "number",
        required: true,
        min: 5,
        defaultValue: "5",
        placeholder: "5",
        helperText: "The public host offer starts at 5 paid Botox guests.",
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
        label: "Anything else your group may want to discuss?",
        type: "checkbox",
        layout: "full",
        required: true,
        lockedOptions: ["Botox"],
        defaultValue: ["Botox"],
        optionGroups: buildBotoxPartyAddOnOptionGroups(),
        helperText:
          "Botox stays included because the host offer is based on paid Botox guests. Use the add-ons below to flag anything else your group wants to ask about.",
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
          "Paid Botox guests count toward the host reward. We confirm the qualifying guest count through the actual party bookings and treatments completed.",
      },
      {
        question: "Can guests ask about other treatments or products too?",
        answer:
          "Yes. The host promotion is Botox-led, but the planning form lets you flag other injectables, regenerative procedures, products, and other services your group wants to discuss.",
      },
      {
        question: "Where can a Botox party happen?",
        answer:
          "Use the form to tell us the location you have in mind. We'll review whether the setup, timing, and guest flow are a fit before anything is confirmed.",
      },
      {
        question: "How do the extra rewards work after the first five guests?",
        answer:
          "Every additional five paid Botox guests adds more free products and procedure credits for the host. We'll confirm the reward mix during planning.",
      },
      {
        question: "Does every guest still need individual screening?",
        answer:
          "Yes. Botox is a medical treatment, so each guest still needs an individual assessment to determine candidacy, dosing, and whether treatment is appropriate.",
      },
    ],
  },
  closing: {
    heading: "Make the guest list, then let us help shape the event.",
    subheading:
      "Five paid Botox guests gets the host free Botox. Every additional five adds more free products and procedure credits.",
    body:
      "Submit the planning form now, then pick a time to talk through the details before the party is locked in.",
    primaryCtaLabel: "Plan My Party",
    secondaryCtaLabel: "Browse Botox Details",
    secondaryCtaHref: "/procedures/botox",
  },
  schedule: {
    eyebrow: "Botox Party Scheduling",
    heading: "Choose your planning call time",
    body:
      "Your party details are recorded. Pick a time that works and we'll use the call to talk through guest count, timing, and the treatment mix you have in mind.",
    fallbackTitle: "Scheduling isn't configured yet",
    fallbackBody: "Add NEXT_PUBLIC_CAL_COM_CONSULT_LINK to enable the event planning scheduler.",
  },
  leadSubjectLabel: "BOTOX PARTY",
};

export const EVENTS: EventDefinition[] = [BOTOX_PARTY_EVENT];

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
