/**
 * Real clinic photos (Austin, 2026-11-05). Jenny sent only photos whose patients (or parents) already signed a photo release.
 * Facts behind the captions, from Austin:
 * - Crow's feet "after" photos were taken a few days after Xeomin. Lighting differs between before and after, so the caption says so.
 * - The baby piercing photos were taken at home, so no caption names the clinic.
 * - Dr. Runnels photo: Fairhope, Alabama, during Jenny's Cellular Medicine Association training. Her CMA certification is current
 *   and Dr. Runnels approved the photo.
 * - The underarm photos show the clinic's process (sweat test, mapping, injections). There is no before/after for sweating here.
 * Never add a photo here without the same release, and never retouch one.
 */
export type ClinicPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const photo = (name: string, alt: string, width: number, height: number): ClinicPhoto => ({
  src: `/clinic/${name}.webp`,
  alt,
  width,
  height,
});

export const RESULTS_CAPTION =
  "Same patient, photos not retouched. Lighting differs between the before and after photos. Results vary.";

export const CROWS_FEET_PAIRS = [
  {
    id: "crows-feet-right",
    before: photo("xeomin-crows-feet-right-before", "Crow's feet lines beside the right eye while smiling, before Xeomin", 900, 1200),
    after: photo("xeomin-crows-feet-right-after", "The same patient's right eye while smiling, a few days after Xeomin", 900, 1200),
  },
  {
    id: "crows-feet-left",
    before: photo("xeomin-crows-feet-left-before", "Crow's feet lines beside the left eye while smiling, before Xeomin", 900, 1200),
    after: photo("xeomin-crows-feet-left-after", "The same patient's left eye while smiling, a few days after Xeomin", 900, 1200),
  },
] as const;

export const CROWS_FEET_HEADING = "Real results: crow's feet";
export const CROWS_FEET_INTRO = "Before and a few days after Xeomin for crow's feet, from a Williamsburg Med Spa patient.";
export const BEFORE_LABEL = "Before";
export const AFTER_LABEL = "A few days after";

export const HYPERHIDROSIS_STEPS = [
  {
    title: "Sweat test",
    caption: "Iodine is painted on the underarm, then dusted with starch.",
    photo: photo("hyperhidrosis-sweat-test-iodine", "Iodine painted on an underarm for a starch-iodine sweat test", 900, 1200),
  },
  {
    title: "Mapping",
    caption: "Dark areas show where sweat comes through, and Jenny outlines the area to treat.",
    photo: photo("hyperhidrosis-sweat-test-mapped", "Starch-iodine sweat test with dark sweat areas and a drawn treatment outline", 786, 1200),
  },
  {
    title: "Treatment",
    caption: "Small Xeomin injections are placed across the mapped area.",
    photo: photo("hyperhidrosis-underarm-injections", "Gloved hands placing a small injection in the mapped underarm area", 1200, 960),
  },
] as const;

export const HYPERHIDROSIS_STEPS_HEADING = "How underarm treatment works";
export const HYPERHIDROSIS_STEPS_NOTE = "Photos from a Williamsburg Med Spa underarm treatment. Results vary.";
export const JENNY_TREATING_UNDERARM = photo(
  "hyperhidrosis-jenny-treating-underarm",
  "Jenny Brady treating a patient's underarm with Xeomin injections",
  900,
  1200
);
export const JENNY_TREATING_UNDERARM_CAPTION = "Jenny Brady treating underarm sweating.";

export const EAR_PIERCING_PHOTOS = [
  {
    photo: photo("blomdahl-jenny-triplets-first-earrings", "Jenny Brady holding triplet babies after their first ear piercing", 900, 1200),
    caption: "Jenny with triplets after their first Blomdahl ear piercing.",
  },
  {
    photo: photo("blomdahl-baby-first-earrings", "A baby resting on a parent's shoulder wearing new Blomdahl stud earrings", 684, 1200),
    caption: "First earrings: Blomdahl medical studs.",
  },
] as const;
export const EAR_PIERCING_PHOTOS_HEADING = "First earrings";

export const RUNNELS_PHOTO = photo(
  "jenny-brady-dr-charles-runnels-fairhope",
  "Jenny Brady with Dr. Charles Runnels on a balcony in Fairhope, Alabama",
  900,
  1200
);
export const RUNNELS_CAPTION =
  "Jenny with Dr. Charles Runnels, founder of the Cellular Medicine Association, in Fairhope, Alabama, during her CMA training.";

/** A patient's own blood after it is spun: the yellow plasma layer sits above the red blood cells. Cropped to the tube. */
export const PRP_TUBE_PHOTO = photo(
  "prp-spun-plasma-tube",
  "A tube of spun blood with a yellow plasma layer above the red blood cells",
  514,
  1200
);
export const PRP_TUBE_CAPTION =
  "Your own blood after it is spun: the yellow layer is the plasma used for PRP, separated from the red blood cells below.";
