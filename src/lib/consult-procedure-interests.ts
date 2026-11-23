import { normalizeIntimacyProcedureNames } from "./intimacy-aliases";

/**
 * The clinic offers two wrinkle relaxers, Botox® and Xeomin®, as separate consult checkboxes. From 2026-11-04 to
 * 2026-11-20 the form had one "Xeomin (Botox alternative)" checkbox; cached pages may still send it, so it maps to Xeomin.
 */
export const BOTOX_INTEREST = "Botox";
export const XEOMIN_INTEREST = "Xeomin";

/** Interest names older versions of the consult form used, still sent by cached pages; mapped to today's labels. */
const LEGACY_INTEREST_ALIASES: Record<string, string> = {
  "Xeomin (Botox alternative)": XEOMIN_INTEREST,
  "Breast Lift": "PRP Breast Lift",
};

/** The consult form's treatment checkboxes. The API keeps only these (after mapping legacy names). */
export const CONSULT_INTEREST_OPTIONS = [
  "Feminine Intimacy Protocol",
  "Male Intimacy Protocol",
  "PRP Breast Lift",
  "Hair Restoration",
  "PRP Facial",
  "Microneedling with PRP",
  "PRP Face Lift",
  "Joint Restoration",
  BOTOX_INTEREST,
  XEOMIN_INTEREST,
  "Hyperhidrosis Treatment",
  "Blomdahl Ear Piercing",
  "Vitamin B-12 Injections",
];

export const PROCEDURE_INTERESTS: Record<string, string[]> = {
  botox: [BOTOX_INTEREST],
  xeomin: [XEOMIN_INTEREST],
  hyperhidrosis: ["Hyperhidrosis Treatment"],
  "hyperhidrosis-treatment": ["Hyperhidrosis Treatment"],
  "blomdahl-ear-piercing": ["Blomdahl Ear Piercing"],
  "ear-piercing": ["Blomdahl Ear Piercing"],
  "prp-facial": ["PRP Facial"],
  "prp-face-lift": ["PRP Face Lift"],
  "prp-facelift": ["PRP Face Lift"],
  "prp-breast-lift": ["PRP Breast Lift"],
  "hair-restoration": ["Hair Restoration"],
  "prp-hair-restoration": ["Hair Restoration"],
  "microneedling-with-prp": ["Microneedling with PRP"],
  "o-shot": ["Feminine Intimacy Protocol"],
  "oh-shot": ["Feminine Intimacy Protocol"],
  "p-shot": ["Male Intimacy Protocol"],
  "pe-shot": ["Male Intimacy Protocol"],
  "b12-injections": ["Vitamin B-12 Injections"],
  b12: ["Vitamin B-12 Injections"],
};

export const getProcedureInterests = (procedure?: string | null) =>
  procedure ? PROCEDURE_INTERESTS[procedure.trim()] : undefined;

/** Normalizes submitted consult interests: legacy intimacy names plus the 2026-11-04 to 2026-11-20 wrinkle-relaxer label. */
export const normalizeConsultInterests = (names: string[]) =>
  Array.from(new Set(normalizeIntimacyProcedureNames(names).map((name) => LEGACY_INTEREST_ALIASES[name] ?? name)));

/** normalizeConsultInterests, then only the form's real treatment options (unknown strings are dropped, never stored). */
export const allowedConsultInterests = (names: string[]) =>
  normalizeConsultInterests(names).filter((name) => CONSULT_INTEREST_OPTIONS.includes(name));
