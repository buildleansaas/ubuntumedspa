export type OfficialProfile = {
  name: string;
  href: string;
};

/**
 * Canonical profiles of the clinic (Williamsburg Med Spa), not of Jenny personally.
 * They feed the footer links and the business JSON-LD `sameAs`.
 * Facebook: Austin confirmed this page on 2026-11-04; it is the page linked from the Google Business Profile.
 * Add a profile only after Austin confirms its URL. Do not guess handles.
 */
export const officialProfiles: OfficialProfile[] = [
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61590541225404" },
];
