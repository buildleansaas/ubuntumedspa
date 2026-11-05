// PRP Breast Lift unsupported-claim detectors, shared by scripts/verify-seo.mjs and the unit tests.
// Moved verbatim from verify-seo.mjs so the tests can scan page copy without a running server.

const splitClinicalClauseBoundaries = (value) =>
  String(value)
    .split(/(?<=[.!?])\s+|\n+|;|,\s*(?:and|or)\s+|\b(?:but|however|yet|although|while|nevertheless)\b/gi)
    .map((segment) => segment.trim())
    .filter(Boolean);
const isEvidenceLimitClause = (segment) =>
  /\b(?:unknown|uncertain|open question|not (?:been )?(?:established|demonstrated|proven|known)|does not (?:establish|promise)|do not (?:establish|promise)|cannot establish|evidence is insufficient|insufficient evidence|no\b.{0,100}\b(?:promised|guaranteed|established)|if (?:one|any) occurs?)\b/i.test(
    segment
  );

const isProtocolQuestionClause = (segment) =>
  /\b(?:ask|confirm)\b.{0,100}\b(?:if|whether)\b/i.test(segment) ||
  /^(?:can|does|do|is|are|how|what|whether)\b[^.!]*\?$/i.test(segment.trim());

export const splitClinicalClauses = (value) =>
  splitClinicalClauseBoundaries(value).flatMap((segment) => {
    if (!isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment) || /\bwhether\b/i.test(segment)) {
      return [segment];
    }
    const conjunction = segment.match(
      /\s+and\s+(?=(?:a\b|an\b|the\b|this\b|that\b|these\b|those\b|we\b|our\b|you\b|they\b|clinicians?\b|providers?\b|patients?\b|healthy\b|adults?\b|people\b|services?\b|treatments?\b|procedures?\b|visits?\b|consultations?\b|materials?\b|preparations?\b|products?\b|chest\b|lift\b|results?\b|effects?\b|benefits?\b|bruising\b|swelling\b|warmth\b|keep\b|leave\b|avoid\b|return\b))/i
    );
    if (!conjunction || conjunction.index === undefined) return [segment];
    const left = segment.slice(0, conjunction.index).trim();
    const right = segment.slice(conjunction.index + conjunction[0].length).trim();
    return isEvidenceLimitClause(left) && right ? [left, right] : [segment];
  });

export const unsupportedPrpBreastClaimClasses = [
  {
    name: "blood-source or blood-component assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) {
            return false;
          }
          return (
            /\b(?:blood|bloodstream|venous|venipuncture|phlebotomy|centrifug(?:e|ed|es|ation)|specimen|plasma|platelets?|platelet[- ]rich plasma|autologous)\b/i.test(segment) ||
            /\b(?:sample|material|preparation)\b.{0,80}\b(?:spun|concentrated|processed|prepared|collected)\b|\b(?:spun|concentrated|processed|prepared|collected)\b.{0,80}\b(?:sample|material|preparation)\b/i.test(segment) ||
            /\b(?:cells?|growth factors?)\b.{0,80}\b(?:obtained|collected|isolated|patient sample)\b|\b(?:vial|sample)\b.{0,50}\b(?:arm|patient)\b/i.test(segment) ||
            /\b(?:material|preparation|concentrate|product)\b.{0,80}\b(?:comes? from|originates? (?:in|from)|derived from|supplied by|provided by|obtained from|taken from|collected from)\b.{0,60}\b(?:the patient|patient|person receiving|recipient|individual receiving|you|your body|bloodstream)\b/i.test(segment) ||
            /\b(?:vial|sample|specimen)\b.{0,50}\bfrom\b.{0,40}\b(?:the patient|patient|person|you|your body)\b.{0,80}\b(?:suppl(?:y|ies|ied)|provid(?:e|es|ed)|forms?|becomes?)\b.{0,50}\b(?:preparation|material|product|service)\b/i.test(segment)
          );
        });
      },
    },
    fixtures: [
      "This treatment uses components drawn from your blood.",
      "The preparation is derived from the patient's own blood components.",
      "The plasma comes from your own blood.",
      "Your blood is processed into the treatment.",
      "Autologous plasma is collected from a small blood sample.",
      "Platelet-rich plasma is prepared after a blood draw.",
      "We collect a sample of the patient's blood for the procedure.",
      "A small amount of blood is collected from the patient before treatment.",
      "The clinician draws a small blood sample at the start of the visit.",
      "Blood is drawn from your arm before the service begins.",
      "The treatment starts by collecting blood from your arm.",
      "Platelets are separated from blood collected at the visit.",
      "Patient-sourced blood components form the preparation.",
      "PRP consists of components taken from the patient bloodstream.",
      "Patient blood supplies the components used in PRP.",
      "PRP is produced from a venous sample taken at the appointment.",
      "A centrifuge concentrates the collected specimen into PRP.",
      "The visit begins with venipuncture so the material can be prepared.",
      "The sample is spun down and concentrated before treatment.",
      "The material is processed into a concentrated preparation before use.",
      "The visit starts with phlebotomy before the material is prepared.",
      "The visit uses cells obtained from the patient.",
      "The service uses material collected from you.",
      "The service begins by collecting a vial from your arm.",
      "The treatment uses growth factors isolated from a patient sample.",
      "The preparation comes from material supplied by the patient.",
      "The service uses a concentrate obtained from the person receiving it.",
      "The blood source is not established, and a vial from the patient supplies the preparation.",
      "The blood source is not established and a vial from the patient supplies the preparation.",
      "The source is uncertain and our service uses your blood.",
      "The material originates in the person receiving the service.",
    ],
    allowedFixtures: [
      "Ask the clinic to explain the current preparation before you decide.",
      "Ask the clinic to explain whether any blood collection is part of its current protocol.",
      "Ask whether PRP comes from your blood.",
      "Does the clinic collect blood for this service?",
      "Ask the clinic if blood collection is part of its current protocol.",
    ],
  },
  {
    name: "delivery-method presupposition",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (
            isEvidenceLimitClause(segment) ||
            isProtocolQuestionClause(segment) ||
            (/\bwhether\b/i.test(segment) &&
              /\b(?:used|part of|delivered|administered|injected|performed|whether and how|how)\b/i.test(segment))
          ) {
            return false;
          }
          return /\b(?:inject(?:s|ed|ing|ion|ions|able)?|needles?|cannulas?|syringes?|needle[- ]based|microneedl(?:e|es|ed|ing)|administer(?:s|ed|ing)?|deliver(?:s|ed|ing)?|carr(?:y|ies|ied|ying)|reach(?:es|ed|ing)?|appl(?:y|ies|ied|ying)|introduc(?:e|es|ed|ing)|insert(?:s|ed|ing)?|plac(?:e|es|ed|ing)|deposit(?:s|ed|ing)?|venipuncture)\b/i.test(
            segment
          );
        });
      },
    },
    fixtures: [
      "Ask the clinic to confirm the injection method used for this service.",
      "The treatment is delivered via injection.",
      "This procedure involves injections.",
      "Confirm the needle-based technique used for this service.",
      "The preparation is placed into breast tissue with a fine needle.",
      "Review whether an injectable plan may fit.",
      "The treatment is injected directly into breast tissue.",
      "This service is administered with a series of small needles.",
      "PRP is administered with needles.",
      "The clinician injects the preparation into breast tissue.",
      "Fine needles deliver the preparation to the breast area.",
      "Needles are used to administer this service.",
      "PRP goes into the breast with a fine needle.",
      "The clinician introduces PRP into breast tissue.",
      "A fine needle places PRP in the treatment area.",
      "The clinician applies PRP to the breast with microneedling.",
      "The page does not establish whether needles are used, but PRP is injected into tissue.",
      "PRP is placed beneath the skin of the breast.",
      "The clinician deposits the preparation into breast tissue.",
      "The page does not establish the method, although PRP is injected into tissue.",
      "It is unknown whether needles are used; the preparation is administered into breast tissue.",
      "Guided placement delivers the preparation to the target tissue.",
      "A cannula carries the preparation beneath breast tissue.",
      "The method is unknown and our clinician injects the preparation into the breast.",
      "The product reaches the breast through a cannula.",
    ],
    allowedFixtures: [
      "Ask the clinic whether and how this service is delivered.",
      "The page does not establish whether needles or injections are used.",
      "It is unknown whether injections are part of this service.",
      "Whether a needle is used remains an open question.",
      "Is the preparation injected or applied topically?",
      "How, if at all, is this service administered?",
    ],
  },
  {
    name: "favorable cosmetic-outcome implication",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment)) return false;
          const normalized = segment.replace(/\b(?:prp|surgical|traditional)?[- ]*breast[- ]lift\b/gi, " ");
          const hasOutcomeLanguage =
            /\b(?:natural[- ]looking|subtle|modest|realistic|visible|noticeable|gentle|youthful|younger|rejuvenat(?:e|es|ed|ing|ion)|lifted|fuller|firmer|perkier|toned|improv(?:e|es|ed|ement|ements)|enhanc(?:e|es|ed|ement|ements)|lifts?|lifting|firms?|firmed|tightens?|tightened|refreshes?|refreshed)\b/i.test(
              normalized
            );
          const hasCosmeticContext =
            /\b(?:breasts?|chest|appearance|contour|skin|firmness|fullness|shape|tone|texture|results?|outcomes?|changes?|improvements?|lift|lifting effect)\b/i.test(
              normalized
            );
          return hasOutcomeLanguage && hasCosmeticContext;
        });
      },
    },
    fixtures: [
      "Our PRP care is tailored for natural-looking outcomes.",
      "Ask whether a modest cosmetic improvement is achievable.",
      "A visible lift may occur.",
      "The treatment can improve breast appearance.",
      "The service can create fuller-looking breasts.",
      "Expect firmer, perkier breasts.",
      "A lifted appearance is possible.",
      "A subtle lift may occur.",
      "The procedure may make the breasts look more youthful.",
      "The procedure can create a more youthful appearance.",
      "Patients may notice a gentle lifting effect.",
      "This can leave the breasts looking younger.",
      "A youthful appearance is possible.",
      "The treatment enhances breast contour.",
      "PRP improves breast firmness.",
      "Patients get a more lifted contour.",
      "PRP may help the chest look more toned.",
      "No result is guaranteed, but the procedure can improve breast contour.",
      "Patients may see a refreshed breast contour.",
      "The chest may gain a rejuvenated contour.",
      "No cosmetic outcome is established and the chest gains a rejuvenated contour.",
    ],
    allowedFixtures: [
      "Any cosmetic change, if one occurs, is uncertain.",
      "Published evidence does not establish a cosmetic benefit.",
      "A natural-looking result is not established.",
      "No subtle lift or youthful appearance is promised.",
      "A subtle lift has not been demonstrated.",
      "Evidence is insufficient to conclude that the breasts become firmer.",
    ],
  },
  {
    name: "provider protocol or sequence assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment) || /\bask\b/i.test(segment)) return false;
          return (
            /\b(?:appointment|visit|service|procedure)\b.{0,80}\b(?:begins?|starts?|ends?|consists?|follow-up review|preparation)\b/i.test(segment) ||
            /\b(?:begins?|starts?|ends?|consists?)\b.{0,80}\b(?:appointment|visit|service|procedure)\b/i.test(segment) ||
            /\b(?:first|initially)\b.{0,80}\b(?:then|next)\b.{0,80}\b(?:finally|follow-up|recheck)\b/i.test(segment) ||
            /\bwe\b.{0,100}\b(?:cleanse|prepare|review|assess)\b.{0,100}\b(?:perform|provide|complete|treat)\b/i.test(segment) ||
            /\b(?:consultation|review|reviews|assessment|preparation|cleansing|treatment|service|procedure)\b.{0,100}\b(?:is |are )?(?:followed by|before|after|then|next)\b.{0,100}\b(?:preparation|cleansing|treatment|service|procedure|follow-up|review|recheck)\b/i.test(segment) ||
            /\b(?:provider|clinician|we)\b.{0,100}\b(?:cleanse|cleanses|prepare|prepares|review|reviews|assess|assesses|perform|performs)\b.{0,100}\b(?:before|after|then|next|followed by)\b.{0,100}\b(?:preparation|treatment|service|procedure|follow-up|review|recheck)\b/i.test(segment)
          );
        });
      },
    },
    fixtures: [
      "The appointment begins with preparation and ends with a follow-up review.",
      "The visit starts with a review and includes treatment preparation.",
      "This service consists of preparation, treatment, and follow-up.",
      "First we prepare the area, then treat it, and finally recheck the result.",
      "We cleanse the area, perform the service, and check the site afterward.",
      "This page does not establish the sequence, and the visit starts with preparation and ends with follow-up.",
      "The sequence is not established and the visit starts with preparation and ends with follow-up.",
      "Consultation is followed by preparation and treatment.",
      "No sequence is documented and our provider reviews the area before treatment.",
    ],
    allowedFixtures: [
      "This page does not include the clinic's current visit sequence.",
      "Ask the clinic what happens during the service.",
      "Does the visit include a follow-up review?",
    ],
  },
  {
    name: "candidacy or eligibility assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) return false;
          if (/\b(?:cannot|can't|does not|doesn't)\b.{0,60}\b(?:right for|eligible|candidate|suitable|appropriate)\b/i.test(segment)) return false;
          return /\b(?:ideal candidate|good candidate|eligible|suitable|best[- ]suited|well[- ]suited|works? best for|recommended for|intended for|appropriate for|right for|fits? your goals?|healthy adults?)\b/i.test(segment);
        });
      },
    },
    fixtures: [
      "This service is appropriate for healthy adults who want a nonsurgical option.",
      "You are eligible if you are in good health.",
      "Jenny confirms whether the treatment fits your goals.",
      "This service is best suited to adults with mild appearance concerns.",
      "The treatment is intended for adults with minor cosmetic concerns.",
      "This page cannot decide whether the service is right for you, and healthy adults are eligible.",
      "Candidacy is not established and healthy adults are eligible.",
      "Candidacy is not established and people with mild laxity are suitable.",
    ],
    allowedFixtures: [
      "This page cannot decide whether the service is right for you.",
      "Ask whether you are eligible before purchasing.",
      "No candidacy criteria are documented here.",
    ],
  },
  {
    name: "downtime or recovery assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) return false;
          return /\b(?:no downtime|little downtime|minimal downtime|return|resume)\b.{0,80}\b(?:normal activit|work|same day|next day)\b|\brecovery\b.{0,50}\b(?:takes?|lasts?|days?|hours?|quick|short)\b|\bback\b.{0,40}\b(?:at (?:(?:your|their|his|her|the|a) )?desk|to work|to normal activit)\b.{0,40}\b(?:within|in|by)\b.{0,20}\b(?:hours?|days?|same day|next day)\b|\b(?:head|go|return)\b.{0,50}\b(?:straight )?back\b.{0,30}\b(?:to )?(?:the )?(?:office|work|normal activit|desk)\b|\b(?:go|head|return)\b.{0,40}\bback to\b.{0,20}\b(?:the )?(?:desk|office|work)\b/i.test(segment);
        });
      },
    },
    fixtures: [
      "Most patients return to normal activity the same day.",
      "There is little downtime and you can resume work the next day.",
      "Recovery takes about two days.",
      "Most patients are back at their desk within hours.",
      "Patients can head straight back to the office after the visit.",
      "Recovery timing is uncertain, and patients return to normal activity the same day.",
      "Recovery timing is uncertain and patients return to normal activity the same day.",
      "Recovery is not documented and you can go back to your desk immediately.",
    ],
    allowedFixtures: [
      "This page does not document downtime or recovery.",
      "Ask the clinic whether you can return to work the same day.",
    ],
  },
  {
    name: "aftercare instruction assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) return false;
          return /\b(?:avoid|refrain from|do not|don't)\b.{0,80}\b(?:exercise|activity|sun|heat|water|alcohol|medication|hours?|days?)\b|\baftercare\b.{0,60}\b(?:requires?|includes?|involves?|instructions? are)\b|\bkeep\b.{0,50}\b(?:area|site|skin)\b.{0,50}\b(?:clean|dry)\b|\b(?:leave|keep)\b.{0,50}\b(?:dressing|bandage|covering)\b.{0,50}\b(?:in place|on|until|overnight|morning|hours?)\b|\b(?:ice|apply|use)\b.{0,50}\b(?:area|site|skin)\b|\bsleep\b.{0,30}\bupright\b/i.test(segment);
        });
      },
    },
    fixtures: [
      "Avoid strenuous exercise for 24 hours after the visit.",
      "Aftercare requires keeping the area dry for one day.",
      "Keep the treated area clean overnight.",
      "Leave the dressing in place until morning.",
      "Aftercare is not established, and keep the treated area clean overnight.",
      "Aftercare is not established and keep the treated area clean overnight.",
      "Aftercare is not established and leave the bandage on overnight.",
    ],
    allowedFixtures: [
      "This page does not document aftercare instructions.",
      "Ask whether you should avoid exercise after the visit.",
    ],
  },
  {
    name: "risk or side-effect assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) return false;
          return /\b(?:soreness|tenderness|swelling|bruising|irritation|redness|warmth|discoloration|infection|bleeding|pain|treatment[- ]site reaction|adverse (?:reaction|event|effect))\b/i.test(segment);
        });
      },
    },
    fixtures: [
      "Temporary swelling and bruising can occur.",
      "Common side effects include soreness, redness, and irritation.",
      "A temporary treatment-site reaction is possible.",
      "Warmth and discoloration may develop at the treatment site.",
      "It is unknown whether swelling occurs, and bruising is common.",
      "Side effects are uncertain and bruising is common.",
      "The risk profile is not established and warmth is expected.",
    ],
    allowedFixtures: [
      "This page does not establish whether swelling or bruising can occur.",
      "Ask whether pain or redness can occur.",
    ],
  },
  {
    name: "result duration or guarantee assertion",
    expression: {
      test(value) {
        return splitClinicalClauses(value).some((segment) => {
          if (isEvidenceLimitClause(segment) || isProtocolQuestionClause(segment)) return false;
          return /\b(?:results?|effects?|improvements?|changes?|benefits?|lift)\b.{0,80}\b(?:holds?|lasts?|lasting|remains?|persists?|continues?|sustained|months?|years?|through the year|permanent|guaranteed|expected)\b|\bguarantee(?:d|s)?\b.{0,50}\b(?:result|outcome|change)\b/i.test(segment);
        });
      },
    },
    fixtures: [
      "Results typically last 12 months.",
      "A visible change is expected within six weeks.",
      "The clinic guarantees a cosmetic result.",
      "Benefits may remain through the year.",
      "The lift holds for roughly a year.",
      "The duration is uncertain, and results last for twelve months.",
      "The duration is uncertain and results last for twelve months.",
      "No duration is established and the change persists through next year.",
    ],
    allowedFixtures: [
      "This page does not promise a result, timeline, or duration.",
      "Ask whether the clinic guarantees any result.",
    ],
  },
  {
    name: "operator or internal-source language",
    expression: {
      test(value) {
        return /\b(?:verified project sources?|project sources?|owner page|protected query|query owner|release train|fact[- ]gated)\b/i.test(
          value
        );
      },
    },
    fixtures: [
      "The current sequence is not documented in verified project sources.",
      "This is the owner page for PRP Breast Lift.",
      "The protected query remains on this page.",
      "This page is fact-gated until protocol notes arrive.",
    ],
    allowedFixtures: [
      "This page does not include the clinic's current visit sequence.",
      "Ask the clinic what happens during the service.",
    ],
  },
];
