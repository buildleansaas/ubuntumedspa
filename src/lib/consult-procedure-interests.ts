export const PROCEDURE_INTERESTS: Record<string, string[]> = {
  botox: ["Botox"],
  xeomin: ["Xeomin"],
  filler: ["Filler"],
  "dermal-fillers": ["Filler"],
  "lip-filler": ["Filler"],
  hyperhidrosis: ["Hyperhidrosis Treatment"],
  "hyperhidrosis-treatment": ["Hyperhidrosis Treatment"],
  "blomdahl-ear-piercing": ["Blomdahl Ear Piercing"],
  "ear-piercing": ["Blomdahl Ear Piercing"],
  "prp-facial": ["PRP Facial"],
  "prp-face-lift": ["PRP Face Lift"],
  "prp-facelift": ["PRP Face Lift"],
  "prp-breast-lift": ["PRP Breast Lift"],
  "hair-restoration": ["Hair Restoration"],
  "microneedling-with-prp": ["Microneedling with PRP"],
  "o-shot": ["O-Shot"],
  "p-shot": ["P-Shot"],
};

export const getProcedureInterests = (procedure?: string | null) =>
  procedure ? PROCEDURE_INTERESTS[procedure.trim()] : undefined;
