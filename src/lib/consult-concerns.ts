import { normalizeConsultInterests } from "./consult-procedure-interests";

/**
 * "What would you like help with?" on the consult form (Austin and Jenny, 2026-11-13; Jenny approved this list).
 * Plain, non-diagnostic wording. Each concern maps to the consult interest options it most likely leads to, so a visitor
 * who doesn't know treatment names still reaches the right conversation. "Not sure yet" maps to nothing.
 * These answers are health information: they go to the clinic's inbox and consult record only, never to analytics.
 */
export const CONSULT_CONCERNS = [
  { label: "Lines when I frown, raise my brows or smile", interests: ["Xeomin (Botox alternative)"] },
  { label: "Heavy sweating (underarms, palms, feet)", interests: ["Hyperhidrosis Treatment"] },
  { label: "Thinning hair", interests: ["Hair Restoration"] },
  { label: "Tired or uneven skin", interests: ["PRP Facial", "Microneedling with PRP"] },
  { label: "Intimate dryness or discomfort", interests: ["OH-Shot"] },
  { label: "Bladder leaks when I laugh or exercise", interests: ["OH-Shot"] },
  { label: "Erection or sensitivity concerns", interests: ["Pe-Shot"] },
  { label: "Joint pain", interests: ["Joint Restoration"] },
  { label: "Vitamin B-12 shots", interests: ["Vitamin B-12 Injections"] },
  { label: "My child's first earrings / ear piercing", interests: ["Blomdahl Ear Piercing"] },
  { label: "Not sure yet", interests: [] },
] as const;

export const CONSULT_CONCERN_LABELS: string[] = CONSULT_CONCERNS.map((concern) => concern.label);

const INTERESTS_BY_CONCERN = new Map<string, readonly string[]>(
  CONSULT_CONCERNS.map((concern) => [concern.label, concern.interests])
);

/** Keeps only known concern labels, once each, in the form's order. Unknown values are dropped, never stored. */
export const normalizeConsultConcerns = (names: string[] = []) =>
  CONSULT_CONCERN_LABELS.filter((label) => names.includes(label));

export const NO_SELECTION_ERROR = "Choose at least one thing you would like help with.";

/**
 * Final selections for a consult request: the known concerns, plus the treatments the visitor picked and the treatments
 * their concerns map to. At least one concern or treatment is required.
 */
export const resolveConsultSelections = ({ concerns = [], interests = [] }: { concerns?: string[]; interests?: string[] }) => {
  const normalizedConcerns = normalizeConsultConcerns(concerns);
  const fromConcerns = normalizedConcerns.flatMap((label) => INTERESTS_BY_CONCERN.get(label) ?? []);
  const normalizedInterests = normalizeConsultInterests([...interests, ...fromConcerns]);

  if (!normalizedConcerns.length && !normalizedInterests.length) return { error: NO_SELECTION_ERROR } as const;
  return { concerns: normalizedConcerns, interests: normalizedInterests } as const;
};
