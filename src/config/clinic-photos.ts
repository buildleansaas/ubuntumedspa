/**
 * Real clinic photos (Austin, 2026-11-05). Jenny sent only photos whose patients (or parents) already signed a photo release.
 * Facts behind the captions, from Austin:
 * - Crow's feet "after" photos were taken a few days after Xeomin. Lighting differs between before and after, so the caption says so.
 * - The baby piercing photos were taken at home, so no caption names the clinic.
 * - Dr. Charles Runels (spelling per cellularmedicineassociation.org) photo: Fairhope, Alabama, during Jenny's Cellular Medicine Association training. Her CMA certification is current
 *   and Dr. Runels approved the photo.
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
  "Same patient, photos not retouched. Lighting, expression, and camera distance differ between the before and after photos. Results vary.";

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
    photo: photo("blomdahl-baby-first-earrings", "A baby resting on an adult's shoulder wearing new Blomdahl stud earrings", 899, 1200),
    caption: "First earrings: Blomdahl medical studs.",
  },
  {
    photo: photo("blomdahl-child-flower-stud", "A young girl with a purple hair bow wearing a new Blomdahl flower stud earring", 770, 1200),
    caption: "A new Blomdahl stud after a child's ear piercing.",
  },
  {
    photo: photo("blomdahl-pearl-stud", "A close-up of an ear wearing a Blomdahl pearl stud earring", 800, 800),
    caption: "A Blomdahl pearl stud after ear piercing.",
  },
] as const;
export const EAR_PIERCING_PHOTOS_HEADING = "First earrings";

export const RUNELS_PHOTO = photo(
  "jenny-brady-dr-charles-runels-fairhope",
  "Jenny Brady with Dr. Charles Runels on a balcony in Fairhope, Alabama",
  900,
  1200
);
export const RUNELS_CAPTION =
  "Jenny with Dr. Charles Runels in Fairhope, Alabama, during her Cellular Medicine Association training.";

/** A patient's own blood after it is spun: the yellow plasma layer sits above the red blood cells. Cropped to the tube. */
export const PRP_TUBE_PHOTO = photo(
  "prp-spun-plasma-tube",
  "A tube of spun blood with a yellow plasma layer above the red blood cells",
  514,
  1200
);
export const PRP_TUBE_CAPTION =
  "Your own blood after it is spun: the yellow layer is the plasma used for PRP, separated from the red blood cells below.";

/** Jenny with the orthopedic surgeon who trained her in orthopedic uses of PRP (Austin, 2026-11-05). */
export const PICCIRILLO_PHOTO = photo(
  "jenny-brady-dr-jeff-piccirillo",
  "Jenny Brady with Dr. Jeff Piccirillo, an orthopedic surgeon",
  900,
  1200
);
export const PICCIRILLO_CAPTION = "Jenny with Dr. Jeff Piccirillo, an orthopedic surgeon who trained her in orthopedic uses of PRP.";

export const CARPAL_TUNNEL_PHOTO = photo(
  "joint-jenny-injecting-carpal-tunnel",
  "Jenny Brady in gloves giving an injection at a patient's wrist",
  837,
  1200
);
export const CARPAL_TUNNEL_CAPTION = "Jenny injecting a wrist for carpal tunnel.";

export const SUPPLIES_PHOTO = photo(
  "prp-supplies-laid-out",
  "Syringes, PRP collection tubes, gauze and a tourniquet laid out on a tray",
  1200,
  524
);
export const SUPPLIES_CAPTION = "Treatment supplies laid out and ready.";

/** Jenny's treatment room (Austin: her home office). Captions name no address. */
export const TREATMENT_ROOM_PHOTOS = [
  photo("treatment-room-chair-window", "A treatment chair with a red towel beside a bright window, with orchids in the foreground", 900, 1200),
  photo("treatment-room-chair-centrifuge", "A treatment chair with a red towel next to a desk holding a PRP centrifuge", 684, 1200),
] as const;
export const TREATMENT_ROOM_HEADING = "Jenny's treatment room";
