import { normalizeIntimacyProcedureNames } from "./intimacy-aliases";

/**
 * The clinic's only wrinkle relaxer is Xeomin. It does not offer Botox® brand, so the consult checkbox is
 * "Xeomin (Botox alternative)" and the pre-2026-11 label maps to it. The /procedures/botox page is the Botox-alternative page.
 */
export const XEOMIN_INTEREST = "Xeomin (Botox alternative)";

/** Interest names the consult form used before 2026-11, still sent by cached pages; mapped to today's labels. */
const LEGACY_INTEREST_ALIASES: Record<string, string> = {
  Botox: XEOMIN_INTEREST,
  Xeomin: XEOMIN_INTEREST,
};

export const PROCEDURE_INTERESTS: Record<string, string[]> = {
  botox: [XEOMIN_INTEREST],
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
  "o-shot": ["OH-Shot"],
  "oh-shot": ["OH-Shot"],
  "p-shot": ["Pe-Shot"],
  "pe-shot": ["Pe-Shot"],
  "b12-injections": ["Vitamin B-12 Injections"],
  b12: ["Vitamin B-12 Injections"],
};

export const getProcedureInterests = (procedure?: string | null) =>
  procedure ? PROCEDURE_INTERESTS[procedure.trim()] : undefined;

/** Normalizes submitted consult interests: legacy intimacy names plus the pre-2026-11 wrinkle-relaxer labels. */
export const normalizeConsultInterests = (names: string[]) =>
  Array.from(new Set(normalizeIntimacyProcedureNames(names).map((name) => LEGACY_INTEREST_ALIASES[name] ?? name)));
