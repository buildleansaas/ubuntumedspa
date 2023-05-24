import React from "react";

import NextLink from "next/link";

import { ProcedureCard } from "components/ProcedureCard";

const procedures = [
  {
    name: "O Shot",
    description:
      "The O Shot is a groundbreaking natural treatment designed to enhance female sexual health and wellness. It boasts a range of benefits that can help women of all ages and backgrounds improve their sexual function and enjoy their bodies to the fullest. The O-Shot can help to reverse urinary incontinence, boost libido, improve natural lubrication, and enhance overall sexual function. It can also reverse the symptoms of menopause and relieve symptoms associated with sexual dysfunction. Ultimately, the O Shot has helped many women achieve a better quality of life and experience a more fulfilling sex life.",
    image: "grapefruit.jpg",
    price: "$1,200.00",
  },
  {
    name: "P Shot",
    description:
      "The P-Shot is the latest innovation in male sexual health and wellness. This natural and non-invasive treatment is designed to rejuvenate the penis and enhance overall sexual function. The P-Shot can help to improve the frequency and quality of erections, as well as boost libido and sexual stamina. It is also an effective treatment for reversing the symptoms of Peyronie's disease. By utilizing the healing properties of Platelet-Rich Plasma (PRP) therapy, the P-Shot can help to increase blood flow, revive and enhance sensitivity, as well as improve male sexual function and overall satisfaction. If you're looking for a natural and effective way to enhance your sexual health and function, the P-Shot may be the solution you've been waiting for.",
    image: "banana.jpg",
    price: "$1,900",
  },
  {
    name: "Breast Lift",
    description:
      "The Vampire Breast Lift utilizes Platelet-Rich Plasma (PRP) therapy, derived from the patient's own blood, which is injected into the breast area. This stimulates the growth of new blood vessels and fatty tissue, leading to a fuller-looking breast. Unlike traditional breast augmentation procedures, the Vampire Breast Lift is non-invasive, has minimal downtime, and produces natural results that last for about well over 18 months, even a lifetime for some. The procedure is also less expensive than surgery, making it an affordable option. Overall, the Vampire Breast Lift is a safe and effective way to boost a woman's self-confidence by providing a natural way to enhance the appearance of their breasts.",
    image: "breast.jpg",
    price: "$1,800",
  },
  {
    name: "Hair Restoration",
    description:
      "Vampire Hair Restoration with PRP is a natural solution for thinning hair or hair loss, that can stimulate new hair growth and improve overall scalp health. A series of three sessions, spaced six weeks apart, each lasting about an hour, use Platelet-Rich Plasma (PRP) therapy to naturally stimulate hair follicles. Suitable for both men and women, this safe and effective treatment offers a quick recovery time with visible results in as little as a few months after the final session. Results include a more youthful and healthy-looking head of hair, which can boost self-esteem and confidence. Overall, the Vampire Hair Restoration is a non-invasive option that can help you regain your desired hair thickness and density.",
    image: "hair.jpg",
    price: "$2,400",
  },
  {
    name: "Vampire Facial",
    description:
      "The Vampire Facial treatment is an innovative and non-invasive procedure that uses Platelet-Rich Plasma (PRP) therapy to improve overall skin texture, enhance elasticity, and promote a youthful-looking complexion. During the treatment, a small sample of the patient's blood is taken and spun in a centrifuge to separate the PRP from the red blood cells. This PRP is topically applied after a microdermabrasion procedure which has been enhanced with PRP to stimulate collagen and elastin production. The combination of microdermabrasion and PRP helps to resurface the skin and remove dead skin cells while promoting rejuvenation and repair, leaving the skin plumper and tighter looking with improved clarity. The results of the Vampire Facial can be seen as a gradual improvement to skin texture and brightness that can last from any where from 6 months up to 2 years. Overall, the Vampire Facial is a safe and effective way to naturally revitalize the skin by tapping into the power of the patient's own blood platelets, and it's suitable for people with different skin types or conditions.",
    image: "face.jpg",
    price: "$600",
  },
  {
    name: "Vampire Face Lift",
    description:
      "The Vampire Facelift is a non-invasive cosmetic procedure that involves the use of Botox, Filler, and the Vampire Facial to resculpt the face. Botox temporarily paralyzes the muscles that cause wrinkles, reducing the appearance of fine lines and wrinkles. Filler uses hyaluronic acid to add volume and achieve a fuller, more youthful-looking appearance. The Vampire Facial stimulates collagen production and tightens the skin, which helps to fill in wrinkles and achieve smoother-looking skin. Together, these three treatments work synergistically to produce natural-looking and long-lasting results. The Vampire Facelift is an ideal solution for those who want to enhance their natural beauty and rejuvenate their skin without the pain or downtime of surgical procedures.",
    image: "facelift.jpg",
    price: "$1,500",
  },
  {
    name: "Joint Restoration",
    description:
      "The Vampire Facelift is a non-invasive cosmetic procedure that involves the use of Botox, Filler, and the Vampire Facial to resculpt the face. Botox temporarily paralyzes the muscles that cause wrinkles, reducing the appearance of fine lines and wrinkles. Filler uses hyaluronic acid to add volume and achieve a fuller, more youthful-looking appearance. The Vampire Facial stimulates collagen production and tightens the skin, which helps to fill in wrinkles and achieve smoother-looking skin. Together, these three treatments work synergistically to produce natural-looking and long-lasting results. The Vampire Facelift is an ideal solution for those who want to enhance their natural beauty and rejuvenate their skin without the pain or downtime of surgical procedures.",
    image: "wrist.jpg",
    price: "$800",
  },
];

export default function Page() {
  const header = "text-2xl md:text-3xl lg:text-4xl font-bold leading-1.2 tracking-tight";
  const subHeader = "text-2xl lg:text-3xl";

  const sectionHeader = "text-2xl md:text-3xl font-bold leading-1.2 tracking-tight";
  const sectionSubHeader = "text-lg lg:text-xl";

  const innerPaddingTop = "px-16 sm:px-160 md:px-260 lg:px-320";

  const ButtonContainer = "lg:flex-row lg:justify-center xl:flex-col xl:items-center";

  const buttonClass = "text-sm lg:text-base lg:mr-4 xl:mb-4";

  return (
    <div className="max-w-xl md:max-w-7xl mx-auto px-6 md:px-8 z-10">
      <div className={`text-center ${innerPaddingTop}`} id="procedures">
        <h2 className={`${header} font-bold mx-auto leading-1.2 tracking-tight pb-4`}>Rejuvinate Your Life</h2>
        <p className={`${subHeader} mb-8 max-w-2xl mx-auto`}>
          Experience the amazing effects of <strong>Vampire Procedures</strong> using <strong>Your Own Blood</strong> to
          enjoy <strong>Natural Healing</strong>, for <strong>Joints</strong>, <strong>Aesthetics</strong>,{" "}
          <strong>Sexual Health</strong> and overall <strong>Wellness</strong>.
        </p>
        <div className="mb-32">
          <div className={`${ButtonContainer}`}>
            <NextLink className={`bg-blue text-white py-2 px-6 ${buttonClass}`} href="/consultation">
              Book a Consultation
            </NextLink>
          </div>
        </div>
      </div>

      <div className="text-center" id="about">
        <h1 className={`${sectionHeader} font-bold mx-auto leading-1.2 tracking-tight pb-4`}>
          Certified Procedures and Services
        </h1>
        <p className={`${sectionSubHeader} mb-8 max-w-5xl mx-auto`}>
          Platelet Rich Plasma Injections, which are based on a synthesis of your own blood, provokes radical healing by
          the release of your own stem cells applicable to most of the human body. This medical technology has been
          available to professional athletes for years to treat sport injuries, and now is available for wellness,
          restoration and aesthetic procedures that you won&rsquo;t even realize are done with complimentary Lidocane
          pre treatment.
        </p>
      </div>

      <div className="-mx-4 lg:-mx-8 xl:-mx-4 my-8 lg:my-12 xl:my-16">
        <div className="flex flex-wrap -m-4 lg:-m-8 xl:-m-4">
          {procedures.map((procedure, i) => (
            <ProcedureCard key={i} product={procedure} />
          ))}
        </div>
      </div>
    </div>
  );
}
