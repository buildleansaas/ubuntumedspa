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
};

export const earPiercingIntentPages: EarPiercingIntentPage[] = [
  {
    slug: "children",
    status: "published",
    title: "Children's Ear Piercing",
    metaTitle: "Children's Ear Piercing in Williamsburg, VA | Blomdahl",
    metaDescription:
      "Pediatric-aware Blomdahl ear piercing for children in Williamsburg, VA with Jenny Coleman, MSN, RN, CPNP, PMHS.",
    h1: "Children's Ear Piercing in Williamsburg, VA",
    audience:
      "For parents planning a child's first earrings and looking for a calm, medically aware appointment instead of a rushed retail setting.",
    whyJenny:
      "Jenny Coleman, MSN, RN, CPNP, PMHS brings pediatric nursing experience to the visit, so parent questions, child comfort, and aftercare are part of the appointment.",
    whyBlomdahl:
      "Blomdahl's medical ear piercing system uses sterile disposable piercing cassettes and hypoallergenic starter jewelry, including Medical Plastic and Medical Grade Titanium options.",
    beforeVisit: [
      "Choose a time when your child is rested and not rushing to sports, swimming, or a large event afterward.",
      "Bring allergy or sensitivity history, especially if your child has reacted to jewelry before.",
      "Plan time for placement discussion, piercing, and aftercare instructions.",
    ],
    faqs: [
      {
        question: "Why choose a pediatric-aware provider for children's ear piercing?",
        answer:
          "A pediatric-aware provider can slow the appointment down, explain each step in age-appropriate language, and help parents understand aftercare before leaving.",
      },
      {
        question: "Does Jenny use only Blomdahl jewelry for starter earrings?",
        answer:
          "Yes. Initial piercings use Blomdahl starter jewelry so the visit follows the Blomdahl system and aftercare expectations.",
      },
      {
        question: "Can parents ask questions before the piercing happens?",
        answer:
          "Yes. The appointment includes time for placement, jewelry, comfort, and aftercare questions before piercing.",
      },
    ],
    relatedAreaSlugs: ["williamsburg-va", "james-city-county-va", "yorktown-va", "newport-news-va"],
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
    relatedAreaSlugs: ["williamsburg-va", "norge-va", "toano-va", "lightfoot-va"],
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
    relatedAreaSlugs: ["williamsburg-va", "new-town-va", "kingsmill-va", "fords-colony-va"],
  },
  {
    slug: "babies",
    status: "draft",
    title: "Baby Ear Piercing",
    metaTitle: "Baby Ear Piercing in Williamsburg, VA | Blomdahl",
    metaDescription: "Pediatric-aware baby ear piercing in Williamsburg, VA.",
    h1: "Baby Ear Piercing in Williamsburg, VA",
    audience: "Draft until Jenny confirms minimum age and consent policy.",
    whyJenny: "Draft until confirmed.",
    whyBlomdahl: "Draft until confirmed.",
    beforeVisit: ["Draft until confirmed."],
    faqs: [],
    relatedAreaSlugs: ["williamsburg-va"],
  },
];

export const publishedEarPiercingIntentPages = earPiercingIntentPages.filter((page) => page.status === "published");

export const getPublishedEarPiercingIntentPage = (slug: string) =>
  publishedEarPiercingIntentPages.find((page) => page.slug === slug);

export const getRelatedAreasForIntent = (page: EarPiercingIntentPage) =>
  page.relatedAreaSlugs
    .map((slug) => publishedEarPiercingAreas.find((area) => area.slug === slug))
    .filter((area): area is (typeof publishedEarPiercingAreas)[number] => Boolean(area));
