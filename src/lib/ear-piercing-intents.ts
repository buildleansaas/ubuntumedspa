import { publishedEarPiercingAreas } from "lib/local-service-areas";

export type EarPiercingIntentStatus = "published" | "draft";

export type EarPiercingIntentPage = {
  slug: string;
  status: EarPiercingIntentStatus;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  audience: string;
  whyJenny: string;
  whyBlomdahl: string;
  beforeVisit: string[];
  faqs: { question: string; answer: string }[];
  relatedAreaSlugs: string[];
  showPricing?: boolean;
  sections?: EarPiercingIntentSection[];
};

export type EarPiercingIntentSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: { title: string; description: string }[];
};

export const earPiercingIntentPages: EarPiercingIntentPage[] = [
  {
    slug: "children",
    status: "published",
    title: "Infant & Kids Ear Piercing",
    metaTitle: "Infant & Baby Ear Piercing in Williamsburg, VA | Pediatric NP",
    metaDescription:
      "Gentle Blomdahl ear piercing for infants, babies, and kids in Williamsburg, VA with pediatric nurse practitioner Jenny Coleman. Sterile, hypoallergenic, $45 per ear.",
    h1: "Infant, Baby & Kids Ear Piercing in Williamsburg, VA",
    audience:
      "For parents planning a baby's or child's first earrings who want a calm, private appointment with a pediatric nurse practitioner instead of a busy retail counter.",
    whyJenny:
      "Jenny Coleman, MSN, RN, CPNP, PMHS is a pediatric nurse practitioner. She is used to working with infants, young children, and nervous parents, explains each step in simple language, and makes sure aftercare is clear before your family leaves.",
    whyBlomdahl:
      "Blomdahl's medical ear piercing system uses sterile, single-use piercing cassettes and hypoallergenic starter earrings in Medical Plastic or Medical Grade Titanium, which helps families worried about nickel or sensitive skin.",
    beforeVisit: [
      "For babies, check in with your pediatrician first, especially if your baby is under 12 months.",
      "Pick a time when your baby or child is fed, rested, and not rushing to sports, swimming, or a big event afterward.",
      "Bring any allergy or skin sensitivity history, especially past reactions to jewelry.",
      "Decide whether you'd like both ears done in one visit or one ear at a time. Jenny can talk through both.",
      "Plan time for placement discussion, the piercing itself, and aftercare teaching.",
    ],
    showPricing: true,
    sections: [
      {
        heading: "What age can babies get their ears pierced?",
        paragraphs: [
          "Jenny generally pierces babies at 6 months or older, with your pediatrician's guidance. She reviews health history at the visit and will not pierce if she has any safety concerns.",
          "For older children, readiness depends on the child, parent preference, and whether they can sit for a brief appointment and leave new earrings alone while they heal. Some families pierce early, others wait until their child can be part of the decision.",
        ],
      },
      {
        heading: "What happens at the appointment",
        steps: [
          {
            title: "Consultation",
            description: "Jenny reviews health history, skin sensitivity, timing, and placement (usually the lobe), and answers parent questions before anything happens.",
          },
          {
            title: "Preparation",
            description: "The ears are cleaned, placement is marked and checked with you, and your child is settled comfortably.",
          },
          {
            title: "Piercing",
            description: "A quick, controlled piercing with a sterile single-use Blomdahl cassette. Both ears can usually be done in one visit.",
          },
          {
            title: "Aftercare teaching",
            description: "You leave with written aftercare and know what to watch for, when earrings can be changed, and how to reach Jenny with questions.",
          },
        ],
      },
      {
        heading: "Why parents choose a pediatric nurse practitioner",
        bullets: [
          "A calm, appointment-based visit with no mall noise, lines, or pressure.",
          "Sterile single-use cassettes instead of shared piercing guns or tools.",
          "Hypoallergenic Blomdahl starter earrings chosen for sensitive baby skin.",
          "Aftercare written for babies and toddlers, including drool, curious hands, and naps.",
          "A provider who will slow down for a nervous child or parent.",
        ],
      },
      {
        heading: "Aftercare for babies and young kids",
        bullets: [
          "Clean the piercings as Jenny shows you at the visit, typically twice a day.",
          "Keep little hands off the earrings and avoid twisting them.",
          "Keep hair, lotions, and shampoo away from the new piercings while they heal.",
          "Leave the starter earrings in until Jenny says they can be changed.",
          "Call right away if you notice spreading redness, swelling, drainage, or fever.",
        ],
      },
    ],
    faqs: [
      {
        question: "How young can a baby get their ears pierced?",
        answer:
          "Jenny generally pierces babies at 6 months or older, with pediatrician guidance. She reviews health history at the visit and will not pierce if she has any safety concerns.",
      },
      {
        question: "Does ear piercing hurt for babies?",
        answer:
          "No piercing is completely painless, but the Blomdahl piercing is very quick. Many babies cry briefly from surprise and settle quickly with a parent. A calm setting and a prepared parent help a lot.",
      },
      {
        question: "Can both ears be pierced at the same visit?",
        answer: "Yes, for most babies and children. Jenny can talk through doing both ears together or one at a time.",
      },
      {
        question: "How much does infant or kids ear piercing cost?",
        answer:
          "$45 for one ear or $80 for both ears in one visit. That includes the appointment, sterile Blomdahl cassette, hypoallergenic starter earrings, and aftercare support.",
      },
      {
        question: "What if my child has sensitive skin or a nickel allergy?",
        answer:
          "Blomdahl Medical Plastic contains no metal, and Medical Grade Titanium is also an option. Jenny reviews skin and allergy history at the visit.",
      },
      {
        question: "Why choose a pediatric nurse practitioner over a mall kiosk?",
        answer:
          "You get a private, unhurried appointment with a medical provider who works with children every day, sterile single-use equipment, hypoallergenic starter earrings, and clear aftercare before you leave.",
      },
    ],
    relatedAreaSlugs: ["williamsburg-va", "yorktown-va", "newport-news-va"],
  },
  {
    slug: "sensitive-ears",
    status: "published",
    title: "Ear Piercing for Sensitive Ears",
    metaTitle: "Hypoallergenic Ear Piercing in Williamsburg, VA | Blomdahl",
    metaDescription:
      "Hypoallergenic Blomdahl ear piercing in Williamsburg, VA with Medical Plastic and Medical Grade Titanium starter jewelry.",
    h1: "Hypoallergenic Ear Piercing for Sensitive Ears",
    audience:
      "For children, teens, and adults with sensitive ears, nickel concerns, or a history of irritation from jewelry.",
    whyJenny:
      "Jenny reviews sensitivity history and helps patients choose a starter jewelry path that fits the Blomdahl system and the patient's needs.",
    whyBlomdahl:
      "Blomdahl offers Medical Plastic and Medical Grade Titanium starter earrings. Blomdahl describes Medical Plastic as 0% nickel.",
    beforeVisit: [
      "Write down past jewelry reactions, including redness, itching, swelling, or irritation.",
      "Avoid bringing outside jewelry for initial piercing because starter jewelry follows the Blomdahl system.",
      "Ask when it is appropriate to change earrings after healing.",
    ],
    faqs: [
      {
        question: "What does hypoallergenic ear piercing mean?",
        answer:
          "It means the starter jewelry is selected to reduce common sensitivity concerns. Blomdahl offers Medical Plastic and Medical Grade Titanium options.",
      },
      {
        question: "Is Blomdahl Medical Plastic nickel-free?",
        answer:
          "Blomdahl describes its Medical Plastic as 0% nickel. Patients with known allergies should still discuss their history before piercing.",
      },
      {
        question: "Can adults with sensitive ears schedule this?",
        answer:
          "Yes. Blomdahl ear piercing is available for children and adults who want a careful, appointment-based visit.",
      },
    ],
    relatedAreaSlugs: ["williamsburg-va", "yorktown-va", "newport-news-va"],
  },
  {
    slug: "re-piercing",
    status: "published",
    title: "Ear Re-Piercing",
    metaTitle: "Ear Re-Piercing in Williamsburg, VA | Blomdahl",
    metaDescription:
      "Thoughtful ear re-piercing in Williamsburg, VA with Blomdahl medical ear piercing and placement review.",
    h1: "Ear Re-Piercing in Williamsburg, VA",
    audience:
      "For teens and adults with closed or partially closed holes who want placement reviewed before piercing again.",
    whyJenny:
      "Jenny can review placement, prior irritation, scar or keloid history, and whether the area should be pierced again or evaluated further.",
    whyBlomdahl:
      "The Blomdahl system supports a sterile, appointment-based re-piercing visit with hypoallergenic starter jewelry options.",
    beforeVisit: [
      "Do not force jewelry through a closed or irritated hole.",
      "Share any scar, keloid, infection, or jewelry reaction history.",
      "Expect placement review before a new piercing decision is made.",
    ],
    faqs: [
      {
        question: "Can a closed ear piercing be re-pierced?",
        answer:
          "Often it can, but the area should be reviewed first, especially if there is scar tissue, irritation, or a history of keloids.",
      },
      {
        question: "Will the new piercing use the exact same spot?",
        answer:
          "Not always. Placement depends on the existing tissue, prior hole location, and what looks safe and balanced at the appointment.",
      },
      {
        question: "Should I try to reopen the hole myself?",
        answer:
          "No. Forcing jewelry through can irritate or injure the tissue. Schedule a visit for review instead.",
      },
    ],
    relatedAreaSlugs: ["williamsburg-va", "yorktown-va", "newport-news-va"],
  },
];

export const publishedEarPiercingIntentPages = earPiercingIntentPages.filter((page) => page.status === "published");

export const getPublishedEarPiercingIntentPage = (slug: string) =>
  publishedEarPiercingIntentPages.find((page) => page.slug === slug);

export const getRelatedAreasForIntent = (page: EarPiercingIntentPage) =>
  page.relatedAreaSlugs
    .map((slug) => publishedEarPiercingAreas.find((area) => area.slug === slug))
    .filter((area): area is (typeof publishedEarPiercingAreas)[number] => Boolean(area));
