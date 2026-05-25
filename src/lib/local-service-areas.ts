export type LocalServiceAreaStatus = "published" | "draft";

export type LocalServiceAreaFAQ = {
  question: string;
  answer: string;
};

export type LocalServiceArea = {
  name: string;
  slug: string;
  status: LocalServiceAreaStatus;
  tier: 1 | 2;
  hasLocationPage: boolean;
  serviceAreaLabel: string;
  targetQuery: string;
  metaTitle: string;
  metaDescription: string;
  countyOrContext: string;
  distanceNote: string;
  summary: string;
  earPiercingAngle: string;
  parentIntent: boolean;
  localIntro: string;
  routeNote: string;
  routeOrigin?: {
    label: string;
    zip: string;
    latitude: number;
    longitude: number;
  };
  routeSummary?: string;
  routeHighlights: string[];
  nearbyNeighborhoods: string[];
  whyMedicalSetting: string;
  parentConcern: string;
  visitLogistics: string;
  blomdahlAngle?: string;
  pediatricAngle?: string;
  providerTrustNote?: string;
  materialNote?: string;
  aftercareNote?: string;
  relatedAreaSlugs: string[];
  faqs: LocalServiceAreaFAQ[];
};

const sharedFaqs = (areaName: string): LocalServiceAreaFAQ[] => [
  {
    question: `Is Williamsburg Med Spa located in ${areaName}?`,
    answer:
      areaName === "Williamsburg"
        ? "Yes. Williamsburg Med Spa is located at 3900 Powhatan Parkway in Williamsburg, VA."
        : `No. Williamsburg Med Spa is located in Williamsburg, VA. This page is for ${areaName} families planning an appointment-based visit to the Williamsburg clinic.`,
  },
  {
    question: "Why choose medical-grade ear piercing?",
    answer:
      "Medical-grade piercing focuses on sterile disposable piercing products, hypoallergenic starter jewelry, careful placement, and clear aftercare guidance.",
  },
  {
    question: "Can children and adults both schedule ear piercing?",
    answer:
      "Yes. Williamsburg Med Spa offers Blomdahl ear piercing for children and adults, with age-aware planning and aftercare instructions.",
  },
];

export const localServiceAreas: LocalServiceArea[] = [
  {
    name: "Williamsburg",
    slug: "williamsburg-va",
    status: "published",
    tier: 1,
    hasLocationPage: true,
    serviceAreaLabel: "Williamsburg, VA",
    targetQuery: "ear piercing williamsburg va",
    metaTitle: "Medical Ear Piercing in Williamsburg, VA | Blomdahl",
    metaDescription:
      "Sterile, hypoallergenic Blomdahl ear piercing in Williamsburg, VA for children and adults at Williamsburg Med Spa.",
    countyOrContext: "Primary clinic",
    distanceNote: "at our Williamsburg clinic",
    summary: "Our main clinic with full PRP, filler, ear piercing, and aesthetic services.",
    earPiercingAngle: "the most direct option for medical-grade ear piercing in Williamsburg",
    parentIntent: true,
    localIntro:
      "Williamsburg families can schedule Blomdahl ear piercing at our clinic on Powhatan Parkway, close to New Town and William & Mary.",
    routeNote:
      "The clinic has on-site parking and is easy to reach from New Town, William & Mary, Monticello Avenue, and nearby Williamsburg neighborhoods.",
    routeOrigin: {
      label: "central Williamsburg ZIP 23185",
      zip: "23185",
      latitude: 37.27,
      longitude: -76.7,
    },
    routeSummary:
      "Most Williamsburg appointments are a short local drive to Powhatan Parkway with on-site parking at the clinic.",
    routeHighlights: [
      "From central Williamsburg, plan around Richmond Road, Monticello Avenue, or local New Town routes depending on your starting point.",
      "Powhatan Parkway is the final local approach for the clinic address.",
      "Leave a few extra minutes for family ear-piercing visits so placement and aftercare are not rushed.",
    ],
    nearbyNeighborhoods: ["New Town", "William & Mary", "Monticello Avenue", "Powhatan Parkway"],
    whyMedicalSetting:
      "The visit is planned around sterile technique, careful placement, hypoallergenic starter jewelry, and clear aftercare instead of a rushed retail counter experience.",
    parentConcern:
      "Parents often want a calm first-piercing visit where they can ask about jewelry material, placement, and what to watch for during healing.",
    visitLogistics:
      "Plan enough time for placement discussion, piercing, aftercare review, and any questions before leaving the clinic.",
    relatedAreaSlugs: ["new-town-va", "james-city-county-va", "kingsmill-va", "fords-colony-va"],
    faqs: sharedFaqs("Williamsburg"),
  },
  {
    name: "James City County",
    slug: "james-city-county-va",
    status: "published",
    tier: 1,
    hasLocationPage: true,
    serviceAreaLabel: "James City County, VA",
    targetQuery: "medical ear piercing james city county",
    metaTitle: "Children's Ear Piercing Near James City County | Blomdahl",
    metaDescription:
      "Appointment-based Blomdahl ear piercing near James City County, VA with sterile equipment and hypoallergenic jewelry.",
    countyOrContext: "James City County",
    distanceNote: "a short drive to Powhatan Parkway",
    summary: "Serving neighborhoods across James City County.",
    earPiercingAngle: "a nearby clinical setting for children's first ear piercings and sensitive-skin piercing visits",
    parentIntent: true,
    localIntro:
      "Williamsburg Med Spa is a nearby clinical option for families across James City County who want medical-grade ear piercing.",
    routeNote:
      "Families from Toano, Norge, Lightfoot, New Town, and Ford's Colony can plan one appointment at the Williamsburg clinic.",
    routeOrigin: {
      label: "James City County ZIP 23188",
      zip: "23188",
      latitude: 37.35,
      longitude: -76.77,
    },
    routeSummary:
      "Many James City County families use local roads toward Williamsburg and Powhatan Parkway rather than making a separate retail stop.",
    routeHighlights: [
      "Upper James City County patients often come through Richmond Road or nearby neighborhood connectors.",
      "New Town, Lightfoot, Norge, Toano, and Ford's Colony are practical same-appointment service areas.",
      "For children, choose a time of day when the drive will not make the visit feel rushed.",
    ],
    nearbyNeighborhoods: ["Toano", "Norge", "Lightfoot", "New Town", "Ford's Colony"],
    whyMedicalSetting:
      "A medical setting gives families time to discuss sterile equipment, starter jewelry, placement, and aftercare before the piercing happens.",
    parentConcern:
      "Many James City County parents compare jewelry materials and aftercare support before choosing where to schedule a first piercing.",
    visitLogistics:
      "The clinic visit is appointment-based, so families can plan around school, errands, and a calm aftercare review.",
    relatedAreaSlugs: ["williamsburg-va", "toano-va", "norge-va", "lightfoot-va"],
    faqs: sharedFaqs("James City County"),
  },
  {
    name: "Yorktown",
    slug: "yorktown-va",
    status: "published",
    tier: 1,
    hasLocationPage: true,
    serviceAreaLabel: "Yorktown, VA",
    targetQuery: "children's ear piercing near yorktown va",
    metaTitle: "Children's Medical Ear Piercing Near Yorktown | Blomdahl",
    metaDescription:
      "Medical-grade Blomdahl ear piercing near Yorktown, VA for children and adults at Williamsburg Med Spa.",
    countyOrContext: "York County",
    distanceNote: "convenient for families coming from Yorktown",
    summary: "Convenient for patients traveling over the river from Yorktown.",
    earPiercingAngle: "a professional alternative to mall piercing for Yorktown families",
    parentIntent: true,
    localIntro:
      "Yorktown families can plan an appointment-based visit to Williamsburg Med Spa for children's first earrings or adult ear piercing.",
    routeNote:
      "The visit is a planned trip to the Williamsburg clinic, which helps avoid walk-in timing and gives space for aftercare questions.",
    routeOrigin: {
      label: "Yorktown ZIP 23691",
      zip: "23691",
      latitude: 37.26,
      longitude: -76.55,
    },
    routeSummary:
      "Yorktown families typically plan this as a Williamsburg appointment with enough time for placement, piercing, and aftercare.",
    routeHighlights: [
      "From Yorktown, most routes head northwest toward Williamsburg before connecting into the Powhatan Parkway area.",
      "Families coming from Tabb or Grafton should allow extra buffer during school and commuter traffic.",
      "The appointment-based visit is designed to avoid the uncertainty of walk-in retail piercing.",
    ],
    nearbyNeighborhoods: ["Yorktown", "Tabb", "Grafton", "Lower Peninsula"],
    whyMedicalSetting:
      "The appointment centers on sterile equipment, hypoallergenic jewelry, and careful placement in a quieter clinical environment.",
    parentConcern:
      "Yorktown parents often ask about first earrings, sensitive ears, and how to handle cleaning after the visit.",
    visitLogistics:
      "Schedule at a time when your child is rested, bring any questions, and leave time for aftercare instructions before driving home.",
    relatedAreaSlugs: ["williamsburg-va", "newport-news-va", "james-city-county-va"],
    faqs: sharedFaqs("Yorktown"),
  },
  {
    name: "Newport News",
    slug: "newport-news-va",
    status: "published",
    tier: 1,
    hasLocationPage: true,
    serviceAreaLabel: "Newport News, VA",
    targetQuery: "medical ear piercing near newport news",
    metaTitle: "Children's Ear Piercing Near Newport News, VA | Blomdahl",
    metaDescription:
      "Sterile, hypoallergenic Blomdahl ear piercing near Newport News, VA for children and adults at Williamsburg Med Spa.",
    countyOrContext: "Peninsula",
    distanceNote: "accessible from Newport News via I-64 and local routes",
    summary: "A nearby option for Newport News residents seeking regenerative PRP and aesthetic care.",
    earPiercingAngle: "a medical-grade ear piercing option for Newport News parents and adults",
    parentIntent: true,
    localIntro:
      "Newport News families who want a medical-grade alternative to retail piercing can schedule with Williamsburg Med Spa.",
    routeNote:
      "The appointment is a planned Williamsburg clinic visit rather than a walk-in retail stop, with time reserved for placement and aftercare.",
    routeOrigin: {
      label: "Newport News ZIP 23603",
      zip: "23603",
      latitude: 37.19,
      longitude: -76.56,
    },
    routeSummary:
      "Newport News patients usually plan the visit around I-64 or nearby Peninsula routes into Williamsburg.",
    routeHighlights: [
      "From northern Newport News, I-64 is often the simplest route toward Williamsburg before local roads to Powhatan Parkway.",
      "Oyster Point, Denbigh, Kiln Creek, and City Center patients should account for bridge and commuter timing.",
      "Build in time for the aftercare conversation before heading back to Newport News.",
    ],
    nearbyNeighborhoods: ["Oyster Point", "Denbigh", "Kiln Creek", "City Center"],
    whyMedicalSetting:
      "A clinical visit can be a better fit for people comparing hypoallergenic starter jewelry, sensitive skin concerns, and aftercare support.",
    parentConcern:
      "Newport News parents often want to avoid nickel-sensitive starter jewelry and rushed placement decisions.",
    visitLogistics:
      "Plan the appointment around traffic and give yourself time for the aftercare conversation before heading back to Newport News.",
    relatedAreaSlugs: ["yorktown-va", "williamsburg-va", "james-city-county-va"],
    faqs: sharedFaqs("Newport News"),
  },
  {
    name: "Toano",
    slug: "toano-va",
    status: "published",
    tier: 1,
    hasLocationPage: true,
    serviceAreaLabel: "Toano, VA",
    targetQuery: "ear piercing near toano va",
    metaTitle: "Medical Ear Piercing Near Toano, VA | Blomdahl",
    metaDescription:
      "Blomdahl medical ear piercing near Toano, VA with sterile equipment and hypoallergenic starter jewelry.",
    countyOrContext: "Upper James City County",
    distanceNote: "easy access from upper James City County",
    summary: "Short drive from upper James City County and Toano.",
    earPiercingAngle: "a calm clinic visit for Toano families planning first earrings",
    parentIntent: true,
    localIntro:
      "Toano families can reach Williamsburg Med Spa for a calm appointment focused on sterile ear piercing and aftercare.",
    routeNote:
      "The clinic is accessible from upper James City County and Richmond Road, with on-site parking near the entrance.",
    routeOrigin: {
      label: "Toano ZIP 23168",
      zip: "23168",
      latitude: 37.37,
      longitude: -76.8,
    },
    routeSummary:
      "Toano families generally approach Williamsburg through upper James City County and Richmond Road-area routes.",
    routeHighlights: [
      "Richmond Road is a practical corridor from Toano toward the Williamsburg clinic area.",
      "Patients near Stonehouse should allow a little extra time for local turns before reaching Powhatan Parkway.",
      "Avoid scheduling immediately before swimming, sports, or a long active afternoon after piercing.",
    ],
    nearbyNeighborhoods: ["Toano", "Stonehouse", "Upper James City County", "Richmond Road"],
    whyMedicalSetting:
      "The appointment gives parents and adults time to review jewelry material, placement, and cleaning instructions.",
    parentConcern:
      "Families planning first earrings often want the visit to feel calm, organized, and clearly explained.",
    visitLogistics:
      "Book ahead, arrive with enough time for placement discussion, and avoid rushing into sports or swimming immediately afterward.",
    relatedAreaSlugs: ["norge-va", "lightfoot-va", "james-city-county-va"],
    faqs: sharedFaqs("Toano"),
  },
  {
    name: "Norge",
    slug: "norge-va",
    status: "published",
    tier: 1,
    hasLocationPage: true,
    serviceAreaLabel: "Norge, VA",
    targetQuery: "ear piercing near norge va",
    metaTitle: "Medical Ear Piercing Near Norge, VA | Blomdahl",
    metaDescription:
      "Medical-grade Blomdahl ear piercing near Norge, VA with hypoallergenic jewelry for children and adults.",
    countyOrContext: "Upper James City County",
    distanceNote: "easy access along Richmond Road",
    summary: "Easy access along Richmond Road from Norge.",
    earPiercingAngle: "a sterile, hypoallergenic piercing visit close to Norge",
    parentIntent: true,
    localIntro:
      "Norge families can schedule a sterile, appointment-based ear piercing visit at the Williamsburg clinic.",
    routeNote:
      "The clinic is easy to reach from Norge and Richmond Road, making it practical for upper James City County families.",
    routeOrigin: {
      label: "Toano/Norge ZIP 23168",
      zip: "23168",
      latitude: 37.37,
      longitude: -76.8,
    },
    routeSummary:
      "Norge patients usually come down Richmond Road or nearby upper James City County routes toward Williamsburg.",
    routeHighlights: [
      "Richmond Road keeps the route familiar for Norge and Croaker families.",
      "Lightfoot and New Town errands can be combined with the appointment if timing stays calm.",
      "Bring any allergy or sensitivity history so starter jewelry can be discussed before piercing.",
    ],
    nearbyNeighborhoods: ["Norge", "Croaker", "Lightfoot", "Richmond Road"],
    whyMedicalSetting:
      "A medical-grade system is useful for people who care about starter jewelry materials and a clear healing plan.",
    parentConcern:
      "Sensitive skin and nickel concerns are common reasons Norge families ask about Blomdahl piercing.",
    visitLogistics:
      "Bring any allergy or sensitivity history you want Jenny to consider before choosing starter jewelry.",
    relatedAreaSlugs: ["toano-va", "lightfoot-va", "james-city-county-va"],
    faqs: sharedFaqs("Norge"),
  },
  {
    name: "Lightfoot",
    slug: "lightfoot-va",
    status: "published",
    tier: 1,
    hasLocationPage: true,
    serviceAreaLabel: "Lightfoot, VA",
    targetQuery: "ear piercing near lightfoot va",
    metaTitle: "Medical Ear Piercing Near Lightfoot, VA | Blomdahl",
    metaDescription:
      "Sterile Blomdahl ear piercing near Lightfoot, VA in a calm appointment-based medical setting.",
    countyOrContext: "Greater Williamsburg",
    distanceNote: "near Lightfoot shopping and residential areas",
    summary: "Serving Lightfoot shopping and residential areas.",
    earPiercingAngle: "a nearby medical ear piercing option for Lightfoot families",
    parentIntent: true,
    localIntro:
      "Lightfoot families can choose Williamsburg Med Spa for a nearby ear piercing visit with careful aftercare guidance.",
    routeNote:
      "The appointment can be planned around Lightfoot or New Town errands while still keeping the piercing visit private and unrushed.",
    routeOrigin: {
      label: "Williamsburg ZIP 23188 near Lightfoot",
      zip: "23188",
      latitude: 37.35,
      longitude: -76.77,
    },
    routeSummary:
      "Lightfoot families are close enough to schedule a dedicated piercing appointment without turning it into a full-day trip.",
    routeHighlights: [
      "Lightfoot and Richmond Road patients can usually reach the clinic through familiar Williamsburg-area roads.",
      "New Town can be a useful landmark for planning the final part of the drive.",
      "For younger children, schedule the piercing before errands rather than after a long day.",
    ],
    nearbyNeighborhoods: ["Lightfoot", "New Town", "Norge", "Richmond Road"],
    whyMedicalSetting:
      "A clinical appointment gives families more privacy than a public retail counter and keeps the focus on clean technique.",
    parentConcern:
      "Parents often want time to talk through placement, starter jewelry, and how to care for ears after the appointment.",
    visitLogistics:
      "Schedule a dedicated appointment instead of trying to squeeze piercing into a busy errand window.",
    relatedAreaSlugs: ["norge-va", "new-town-va", "williamsburg-va"],
    faqs: sharedFaqs("Lightfoot"),
  },
  {
    name: "New Town",
    slug: "new-town-va",
    status: "published",
    tier: 1,
    hasLocationPage: true,
    serviceAreaLabel: "New Town, Williamsburg, VA",
    targetQuery: "ear piercing near new town williamsburg",
    metaTitle: "Medical Ear Piercing Near New Town Williamsburg | Blomdahl",
    metaDescription:
      "Medical-grade Blomdahl ear piercing near New Town Williamsburg with sterile equipment and hypoallergenic jewelry.",
    countyOrContext: "Williamsburg",
    distanceNote: "minutes from New Town",
    summary: "A few minutes from New Town's shops and restaurants.",
    earPiercingAngle: "a convenient ear piercing appointment near New Town errands",
    parentIntent: true,
    localIntro:
      "Williamsburg Med Spa is minutes from New Town, making it convenient for families planning ear piercing around local errands.",
    routeNote:
      "The clinic is close enough to New Town for a practical appointment, while still offering a private clinical setting.",
    routeOrigin: {
      label: "central Williamsburg ZIP 23185 near New Town",
      zip: "23185",
      latitude: 37.27,
      longitude: -76.7,
    },
    routeSummary:
      "New Town patients are minutes from the clinic and can plan the visit around local errands without using a public retail counter.",
    routeHighlights: [
      "Monticello Avenue and nearby New Town streets are useful landmarks for the short local drive.",
      "Powhatan Parkway is the final approach for the clinic address.",
      "Keep the appointment window calm for children or sensitive-skin questions.",
    ],
    nearbyNeighborhoods: ["New Town", "Monticello Avenue", "William & Mary", "Lightfoot"],
    whyMedicalSetting:
      "The visit is quick but not rushed, with time for placement, sterile technique, and aftercare instructions.",
    parentConcern:
      "Families often want convenience without giving up privacy, material quality, or a calm appointment flow.",
    visitLogistics:
      "Plan the visit before errands rather than after a long day if the appointment is for a younger child.",
    relatedAreaSlugs: ["williamsburg-va", "lightfoot-va", "james-city-county-va"],
    faqs: sharedFaqs("New Town"),
  },
  {
    name: "Kingsmill",
    slug: "kingsmill-va",
    status: "published",
    tier: 1,
    hasLocationPage: true,
    serviceAreaLabel: "Kingsmill, VA",
    targetQuery: "ear piercing near kingsmill va",
    metaTitle: "Medical Ear Piercing Near Kingsmill, VA | Blomdahl",
    metaDescription:
      "Appointment-based Blomdahl ear piercing near Kingsmill, VA for children and adults at Williamsburg Med Spa.",
    countyOrContext: "Williamsburg resort area",
    distanceNote: "close to the Kingsmill community",
    summary: "Close to Kingsmill's riverfront community.",
    earPiercingAngle: "a private, professional piercing appointment near Kingsmill",
    parentIntent: true,
    localIntro:
      "Kingsmill families can schedule a nearby Williamsburg clinic visit for medical-grade Blomdahl ear piercing.",
    routeNote:
      "The clinic is close to the Kingsmill community and offers on-site parking for appointment-based visits.",
    routeOrigin: {
      label: "central Williamsburg ZIP 23185 near Kingsmill",
      zip: "23185",
      latitude: 37.27,
      longitude: -76.7,
    },
    routeSummary:
      "Kingsmill families can plan a nearby Williamsburg visit with a private clinical setting and on-site parking.",
    routeHighlights: [
      "Kingsmill and Quarterpath patients typically use local Williamsburg routes toward Powhatan Parkway.",
      "Leave time to review starter jewelry, placement, and aftercare before heading back.",
      "Avoid scheduling directly before swimming or a high-activity plan.",
    ],
    nearbyNeighborhoods: ["Kingsmill", "Quarterpath", "Grove", "Williamsburg"],
    whyMedicalSetting:
      "A quieter clinical setting can be a better fit for families who want a private first-piercing experience.",
    parentConcern:
      "Parents often want careful placement, hypoallergenic starter jewelry, and clear expectations before leaving the clinic.",
    visitLogistics:
      "Choose a calm appointment window and avoid scheduling immediately before swimming or high-activity plans.",
    relatedAreaSlugs: ["williamsburg-va", "fords-colony-va", "james-city-county-va"],
    faqs: sharedFaqs("Kingsmill"),
  },
  {
    name: "Ford's Colony",
    slug: "fords-colony-va",
    status: "published",
    tier: 1,
    hasLocationPage: true,
    serviceAreaLabel: "Ford's Colony, VA",
    targetQuery: "ear piercing near ford's colony va",
    metaTitle: "Medical Ear Piercing Near Ford's Colony, VA | Blomdahl",
    metaDescription:
      "Sterile, hypoallergenic Blomdahl ear piercing near Ford's Colony, VA at Williamsburg Med Spa.",
    countyOrContext: "Williamsburg residential community",
    distanceNote: "near Ford's Colony and nearby neighborhoods",
    summary: "Nearby care for residents of Ford's Colony.",
    earPiercingAngle: "a nearby clinical ear piercing option for Ford's Colony families",
    parentIntent: true,
    localIntro:
      "Ford's Colony families can plan a nearby Williamsburg appointment for sterile Blomdahl ear piercing.",
    routeNote:
      "The clinic is close to Ford's Colony and nearby residential communities, with on-site parking available.",
    routeOrigin: {
      label: "Williamsburg ZIP 23188 near Ford's Colony",
      zip: "23188",
      latitude: 37.35,
      longitude: -76.77,
    },
    routeSummary:
      "Ford's Colony families can make this a nearby appointment rather than a walk-in retail visit.",
    routeHighlights: [
      "Longhill Road, New Town, and nearby residential connectors are useful reference points for the drive.",
      "Powhatan Parkway is the clinic's local address corridor.",
      "Book ahead and allow time for a full first-piercing conversation if the appointment is for a child.",
    ],
    nearbyNeighborhoods: ["Ford's Colony", "Longhill Road", "New Town", "Williamsburg"],
    whyMedicalSetting:
      "The appointment gives families time for placement questions, clean technique, and aftercare instructions.",
    parentConcern:
      "Families often want a nearby option that feels more controlled and private than a walk-in retail setting.",
    visitLogistics:
      "Book ahead and allow enough time for the full visit, especially when the appointment is for a child's first earrings.",
    relatedAreaSlugs: ["williamsburg-va", "kingsmill-va", "james-city-county-va"],
    faqs: sharedFaqs("Ford's Colony"),
  },
  {
    name: "Gloucester",
    slug: "gloucester-va",
    status: "draft",
    tier: 2,
    hasLocationPage: false,
    serviceAreaLabel: "Gloucester, VA",
    targetQuery: "medical ear piercing near gloucester va",
    metaTitle: "Medical Ear Piercing Near Gloucester, VA | Blomdahl",
    metaDescription: "Medical-grade Blomdahl ear piercing near Gloucester, VA.",
    countyOrContext: "Middle Peninsula",
    distanceNote: "within a practical drive from Gloucester",
    summary: "Medical ear piercing and aesthetic care for Gloucester families willing to visit Williamsburg.",
    earPiercingAngle: "a medical-grade option when Gloucester families want sterile, hypoallergenic piercing",
    parentIntent: true,
    localIntro: "Draft page for future Gloucester demand.",
    routeNote: "Draft page.",
    routeHighlights: [],
    nearbyNeighborhoods: ["Gloucester"],
    whyMedicalSetting: "Draft page.",
    parentConcern: "Draft page.",
    visitLogistics: "Draft page.",
    relatedAreaSlugs: ["williamsburg-va", "yorktown-va"],
    faqs: sharedFaqs("Gloucester"),
  },
  {
    name: "West Point",
    slug: "west-point-va",
    status: "draft",
    tier: 2,
    hasLocationPage: false,
    serviceAreaLabel: "West Point, VA",
    targetQuery: "ear piercing near west point va",
    metaTitle: "Ear Piercing Near West Point, VA | Blomdahl",
    metaDescription: "Medical-grade Blomdahl ear piercing near West Point, VA.",
    countyOrContext: "King William County area",
    distanceNote: "within the broader Williamsburg service radius",
    summary: "A Williamsburg clinic option for West Point families seeking medical ear piercing.",
    earPiercingAngle: "a planned clinic visit for sterile ear piercing outside a retail setting",
    parentIntent: true,
    localIntro: "Draft page for future West Point demand.",
    routeNote: "Draft page.",
    routeHighlights: [],
    nearbyNeighborhoods: ["West Point"],
    whyMedicalSetting: "Draft page.",
    parentConcern: "Draft page.",
    visitLogistics: "Draft page.",
    relatedAreaSlugs: ["toano-va", "williamsburg-va"],
    faqs: sharedFaqs("West Point"),
  },
  {
    name: "Poquoson",
    slug: "poquoson-va",
    status: "draft",
    tier: 2,
    hasLocationPage: false,
    serviceAreaLabel: "Poquoson, VA",
    targetQuery: "medical ear piercing near poquoson va",
    metaTitle: "Medical Ear Piercing Near Poquoson, VA | Blomdahl",
    metaDescription: "Medical-grade Blomdahl ear piercing near Poquoson, VA.",
    countyOrContext: "Lower Peninsula",
    distanceNote: "reachable from Poquoson for appointment-based care",
    summary: "Appointment-based ear piercing and aesthetic care for Poquoson families.",
    earPiercingAngle: "a medical setting for parents who want a more controlled piercing experience",
    parentIntent: true,
    localIntro: "Draft page for future Poquoson demand.",
    routeNote: "Draft page.",
    routeHighlights: [],
    nearbyNeighborhoods: ["Poquoson"],
    whyMedicalSetting: "Draft page.",
    parentConcern: "Draft page.",
    visitLogistics: "Draft page.",
    relatedAreaSlugs: ["yorktown-va", "newport-news-va"],
    faqs: sharedFaqs("Poquoson"),
  },
];

export const publishedEarPiercingAreas = localServiceAreas.filter((area) => area.status === "published");

export const locationIndexAreas = localServiceAreas.filter((area) => area.hasLocationPage);

export const getLocalServiceAreaBySlug = (slug: string) => localServiceAreas.find((area) => area.slug === slug);

export const getPublishedEarPiercingAreaBySlug = (slug: string) =>
  publishedEarPiercingAreas.find((area) => area.slug === slug);

export const getRelatedEarPiercingAreas = (area: LocalServiceArea) =>
  area.relatedAreaSlugs
    .map((slug) => publishedEarPiercingAreas.find((item) => item.slug === slug))
    .filter((item): item is LocalServiceArea => Boolean(item));
