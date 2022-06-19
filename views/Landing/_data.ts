export const products = [
  {
    name: "O Shot",
    price: 1200,
    currency: "USD",
    imageUrl: "/grapefruit.jpg",
    description:
      "Reverses Urinary Incontenence, Increases Sensitivity, Enhances Orgasms, Reverses Menopausal Symptoms for Women and improves overall Sexual Health and Function",
    tags: [
      {
        name: "Female",
        color: "pink",
      },
    ],
  },
  {
    name: "P Shot",
    price: 1900,
    currency: "USD",
    imageUrl: "/banana.jpg",
    description: "Improves Erectile Dysfunction, Increases Sexual Function",
  },

  {
    name: "Breast Lift",
    price: 1800,
    currency: "USD",
    imageUrl: "/breast.jpg",
    description:
      "Enhances and Plumps Cleavage Resulting in up to a Cup Size Increase",
  },
  {
    name: "Hair Restoration",
    description:
      "3 sessions, 6 weeks apart that Permanently Stimulates New Hair Growth",
    price: 2400,
    currency: "USD",
    imageUrl: "/hair.jpg",
  },
  {
    name: "Vampire Facial",
    description:
      "Microderm-abrasian enhanced with PRP to Naturally Plump and Tighten Skin",
    price: 600,
    currency: "USD",
    imageUrl: "/facial.jpg",
  },
  {
    name: "Vampire Face Lift",
    description: "Uses Botox, Filler and Vampire Facial to Resculpt your Face",
    price: 1500,
    currency: "USD",
    imageUrl: "/facelift.jpg",
  },
  {
    name: "Joint Restoration",
    description:
      "Relieve Pain and Improve Function of Knees, Ankles, Shoulders, and Elbows.",
    price: 800,
    currency: "USD",
    imageUrl: "/wrist.jpg",
  },
];

export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;

export type Product = ElementType<typeof products>;
