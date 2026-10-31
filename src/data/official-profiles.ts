export type OfficialProfile = {
  name: string;
  href: string;
};

/**
 * Canonical social profiles Austin confirms the clinic will maintain.
 * Leave this empty until those URLs are known. Do not guess handles.
 */
export const officialProfiles: OfficialProfile[] = [];
