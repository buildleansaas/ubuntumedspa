export const DEFAULT_FORM_SUBMISSION =
  process.env.NODE_ENV === "production"
    ? {
        email: "",
        name: "",
        phone: "",
        comments: "",
        interests: [],
        referral: "",
      }
    : {
        email: "au.witherow@gmail.com",
        name: "Austin Witherow",
        phone: "8042442395",
        comments: "I need help I have a tiny penis.",
        interests: ["P Shot"],
        referral: "Jenny Coleman",
      };

export const FORM_INPUTS = [
  {
    id: "name",
    label: "Preferred Name",
    type: "text",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    helperText: "We'll never share your email.",
  },
  {
    id: "phone",
    label: "Phone",
    type: "tel",
    helperText: "We'll also never share your phone.",
  },
  {
    id: "interests",
    label: "Interests",
    type: "checkbox",
    options: [
      "O Shot",
      "P Shot",
      "Breast Lift",
      "Hair Restoration",
      "Vampire Facial",
      "Vampire Face Lift",
      "Joint Restoration",
      "Xeomin",
      "Filler",
      "Hyperhidrosis Treatment",
    ],
    helperText: "If you want specific consultation on certain procedures, please let us know which!",
  },
  {
    id: "comments",
    label: "How May I Help You?",
    type: "textarea",
    helperText:
      "This is a confidential intake form, please take your time to describe what you are seeking help with to prepare for our consultation.",
  },
  {
    id: "referral",
    label: "Who Referred You?",
    type: "text",
    helperText: "Send your friends and get free med spa services!",
  },
];

export const procedures = [
  {
    name: "O Shot",
    slug: "o-shot",
    description:
      "The O Shot is a groundbreaking natural treatment designed to enhance female sexual health and wellness. It boasts a range of benefits that can help women of all ages and backgrounds improve their sexual function and enjoy their bodies to the fullest. The O-Shot can help to reverse urinary incontinence, boost libido, improve natural lubrication, and enhance overall sexual function. It can also reverse the symptoms of menopause and relieve symptoms associated with sexual dysfunction. Ultimately, the O Shot has helped many women achieve a better quality of life and experience a more fulfilling sex life.",
    headline: "Revitalize Your Feminine Intimacy: Natural, Effective, Life-Changing!",
    subline:
      "The O Shot utilizes Platelet-Rich Plasma (PRP) therapy derived from your own blood, working naturally to enhance female sexual health. With this, you can expect improved sexual function, relief from urinary incontinence and menopause symptoms, and an overall more fulfilling sex life.",
    image: "/product/grapefruit.jpg",
    price: "$1,200.00",
    // programmatic SEO copy
    blogHeadline:
      "Struggling with female sexual health issues? Dive into our O Shot articles and discover groundbreaking insights and solutions. From understanding the O Shot process to exploring real-life success stories, our blog offers answers and guidance you might be seeking.",

    benefitsHeadline:
      "Experience renewed confidence with enhanced female sexual health. From reversing urinary incontinence to boosting libido, the O Shot paves the way for a revitalized intimate connection. Rediscover pleasure and reclaim your body's vitality.",
    benefits: [
      {
        emoji: "💪",
        benefit: "Enhanced Sexual Health",
        description:
          "The O Shot improves overall female sexual health by enhancing libido, lubrication, and sexual function.",
      },
      {
        emoji: "🌊",
        benefit: "Relief from Urinary Incontinence",
        description: "Many women have found relief from the distressing issue of urinary incontinence with the O Shot.",
      },
      {
        emoji: "🌡",
        benefit: "Alleviation of Menopause Symptoms",
        description:
          "The O Shot helps to reverse some symptoms of menopause, providing women with a more comfortable and balanced life.",
      },
      {
        emoji: "❤️",
        benefit: "Boosted Intimacy",
        description: "The O Shot brings about enhanced sensitivity, leading to a more fulfilling intimate life.",
      },
    ],
    faqHeadline:
      "Experience a breakthrough in female sexual health with the O Shot. Designed to invigorate your intimate experiences, it's natural and revolutionary.",
    faqs: [
      {
        question: "What is the primary purpose of the O Shot?",
        answer:
          "The O Shot is designed to enhance female sexual health and wellness, improving aspects like libido, natural lubrication, and overall sexual function. It also helps in reversing urinary incontinence and symptoms of menopause.",
      },
      {
        question: "Is the O Shot procedure painful?",
        answer:
          "While individual experiences may vary, most patients report minimal discomfort. A topical numbing cream is often applied before the procedure to minimize any potential pain.",
      },
      {
        question: "How soon can I experience results?",
        answer:
          "Many women report feeling some effects immediately after the procedure, while for others, it may take a few weeks to notice significant changes.",
      },
      {
        question: "Are there any side effects?",
        answer:
          "The O Shot is a natural procedure, using your own blood's platelet-rich plasma (PRP). Thus, the risk of allergic reactions or side effects is minimal. However, as with any injection, there may be temporary redness, swelling, or bruising.",
      },
      {
        question: "How long does the effect of the O Shot last?",
        answer:
          "While individual experiences vary, many women enjoy the benefits of the O Shot for a year or longer. Periodic touch-up treatments can help maintain results.",
      },
    ],
  },
  {
    name: "P Shot",
    slug: "p-shot",
    description:
      "The P-Shot is the latest innovation in male sexual health and wellness. This natural and non-invasive treatment is designed to rejuvenate the penis and enhance overall sexual function. The P-Shot can help to improve the frequency and quality of erections, as well as boost libido and sexual stamina. It is also an effective treatment for reversing the symptoms of Peyronie's disease. By utilizing the healing properties of Platelet-Rich Plasma (PRP) therapy, the P-Shot can help to increase blood flow, revive and enhance sensitivity, as well as improve male sexual function and overall satisfaction. If you're looking for a natural and effective way to enhance your sexual health and function, the P-Shot may be the solution you've been waiting for.",
    headline: "Rediscover Male Virility: Boost Your Performance and Confidence!",
    subline:
      "The P Shot is a natural and non-invasive treatment using PRP therapy to rejuvenate the penis and enhance sexual function. It aids in improving erection quality, boosting libido and reversing symptoms of Peyronie's disease, leading to enhanced overall sexual satisfaction.",
    image: "/product/banana.jpg",
    price: "$1,900",
    // programmatic SEO copy
    blogHeadline:
      "Enhance your male virility and confidence with insights from our P Shot blog. Uncover the science behind its effectiveness, success stories, and how it's transforming male sexual health.",
    benefitsHeadline:
      "Unlock the next level of male sexual prowess. With the P-Shot, not only can you witness improved erection quality, but also a rejuvenated libido. Dive into a world where confidence, stamina, and satisfaction intertwine.",
    benefits: [
      {
        emoji: "⚡",
        benefit: "Improved Erection Quality",
        description:
          "Men experience enhanced frequency and quality of erections after undergoing the P-Shot treatment.",
      },
      {
        emoji: "💖",
        benefit: "Boosted Libido",
        description: "The P-Shot can reignite sexual drive, enhancing overall stamina and intimate experiences.",
      },
      {
        emoji: "🔄",
        benefit: "Reversal of Peyronie's Symptoms",
        description:
          "P-Shot is effective in alleviating symptoms of Peyronie's disease, leading to more satisfactory intimate encounters.",
      },
      {
        emoji: "🔥",
        benefit: "Enhanced Sensitivity",
        description:
          "By increasing blood flow, the P-Shot revives and enhances penile sensitivity, enriching intimate experiences.",
      },
    ],
    faqHeadline:
      "Redefine male virility with the P-Shot. A natural and non-invasive way to boost your sexual performance and confidence.",
    faqs: [
      {
        question: "What benefits can I expect from the P Shot?",
        answer:
          "The P-Shot aims to improve the quality and frequency of erections, enhance libido, sexual stamina, and address symptoms of Peyronie's disease.",
      },
      {
        question: "Is the procedure painful?",
        answer:
          "A numbing cream or local anesthesia is applied to minimize discomfort. Most men report feeling only a slight pressure or tingling sensation during the procedure.",
      },
      {
        question: "How long does it take to see results?",
        answer:
          "Some men report immediate improvements, while for others, it may take a few weeks to notice significant changes in sexual performance.",
      },
      {
        question: "What is the recovery time?",
        answer:
          "The P-Shot is a non-invasive procedure with minimal downtime. Most men return to their regular activities, including sexual activity, within 24-48 hours.",
      },
      {
        question: "Are there any potential side effects?",
        answer:
          "Since the P-Shot uses your own PRP, adverse reactions are rare. However, temporary redness, swelling, or bruising at the injection site is possible.",
      },
    ],
  },
  {
    name: "Breast Lift",
    slug: "breast-lift",
    description:
      "The Vampire Breast Lift utilizes Platelet-Rich Plasma (PRP) therapy, derived from the patient's own blood, which is injected into the breast area. This stimulates the growth of new blood vessels and fatty tissue, leading to a fuller-looking breast. Unlike traditional breast augmentation procedures, the Vampire Breast Lift is non-invasive, has minimal downtime, and produces natural results that last for about well over 18 months, even a lifetime for some. The procedure is also less expensive than surgery, making it an affordable option. Overall, the Vampire Breast Lift is a safe and effective way to boost a woman's self-confidence by providing a natural way to enhance the appearance of their breasts.",
    headline: "Embrace Your Curves: Natural, Non-Invasive Enhancement!",
    subline:
      "The Vampire Breast Lift leverages the healing properties of PRP, stimulating the growth of new blood vessels and fatty tissue in the breast area. The result is fuller-looking breasts through a non-invasive process with minimal downtime and long-lasting results.",
    image: "/product/breast.jpg",
    price: "$1,800",
    // programmatic SEO copy
    blogHeadline:
      "Dreaming of fuller, natural-looking breasts without invasive surgeries? Our Vampire Breast Lift blog section unveils the power of PRP therapy in breast enhancement. Join us in exploring its benefits and real-world outcomes.",
    benefitsHeadline:
      "Celebrate your body with naturally fuller and radiant breasts. The Vampire Breast Lift offers a non-surgical path to accentuate your curves, boosting self-confidence. Relish in the allure of lasting results and minimal downtime.",
    benefits: [
      {
        emoji: "🌸",
        benefit: "Natural Enhancement",
        description: "The Vampire Breast Lift offers a natural and non-invasive way to achieve fuller-looking breasts.",
      },
      {
        emoji: "⏳",
        benefit: "Minimal Downtime",
        description:
          "Unlike traditional surgeries, this procedure requires very little recovery time, letting you get back to your routine swiftly.",
      },
      {
        emoji: "💰",
        benefit: "Cost-effective",
        description: "Compared to surgical alternatives, the Vampire Breast Lift is a more affordable option for many.",
      },
      {
        emoji: "⏲️",
        benefit: "Long-lasting Results",
        description:
          "The effects of the Vampire Breast Lift can last well over 18 months and, in some cases, even a lifetime.",
      },
    ],
    faqHeadline:
      "Discover a natural approach to enhancing your curves with the Vampire Breast Lift. Achieve fuller and revitalized breasts without surgery.",
    faqs: [
      {
        question: "How does the Vampire Breast Lift differ from traditional breast augmentation?",
        answer:
          "Unlike surgical breast augmentation, the Vampire Breast Lift uses PRP therapy derived from the patient's blood to stimulate the growth of new blood vessels and fatty tissue, resulting in natural-looking fuller breasts.",
      },
      {
        question: "Is there any downtime associated with the procedure?",
        answer:
          "The Vampire Breast Lift is minimally invasive with little to no downtime. Most patients can return to their regular activities shortly after the procedure.",
      },
      {
        question: "How long do the results last?",
        answer:
          "The results from a Vampire Breast Lift can last for over 18 months, and in some cases, even longer. However, individual experiences may vary.",
      },
      {
        question: "Are there any side effects?",
        answer:
          "Possible side effects include temporary redness, swelling, and bruising at the injection site. However, since PRP is derived from the patient's blood, the risk of allergic reactions or serious side effects is minimal.",
      },
      {
        question: "Is the Vampire Breast Lift suitable for everyone?",
        answer:
          "While the procedure is safe for most individuals, a consultation with a qualified practitioner is essential to determine if you're a good candidate for the treatment.",
      },
    ],
  },
  {
    name: "Hair Restoration",
    slug: "hair-restoration",
    description:
      "Vampire Hair Restoration with PRP is a natural solution for thinning hair or hair loss, that can stimulate new hair growth and improve overall scalp health. A series of three sessions, spaced six weeks apart, each lasting about an hour, use Platelet-Rich Plasma (PRP) therapy to naturally stimulate hair follicles. Suitable for both men and women, this safe and effective treatment offers a quick recovery time with visible results in as little as a few months after the final session. Results include a more youthful and healthy-looking head of hair, which can boost self-esteem and confidence. Overall, the Vampire Hair Restoration is a non-invasive option that can help you regain your desired hair thickness and density.",
    headline: "Regain Your Crowning Glory: Safe, Natural, Noticeable Results!",
    subline:
      "Vampire Hair Restoration employs PRP therapy to naturally stimulate hair follicles, offering a solution for thinning hair or hair loss. After a few sessions, you can expect to see new hair growth and improved scalp health leading to a more youthful and thick head of hair.",
    image: "/product/hair.jpg",
    price: "$2,400",
    // programmatic SEO copy
    blogHeadline:
      "Hair thinning or loss affecting your confidence? Dive deep into our Hair Restoration articles to explore the wonders of PRP therapy in stimulating hair growth. Find testimonials, expert advice, and more.",
    benefitsHeadline:
      "Turn back the clock and let your hair be the statement of youth. Vampire Hair Restoration, with its power of PRP, can transform thinning strands into a lush mane. Feel confident, look vibrant, and let every strand speak volumes.",
    benefits: [
      {
        emoji: "💇‍♂️",
        benefit: "Promotes Hair Growth",
        description: "Vampire Hair Restoration naturally stimulates hair follicles, promoting the growth of new hair.",
      },
      {
        emoji: "🌿",
        benefit: "Natural Solution",
        description:
          "The treatment uses PRP derived from your own blood, making it a holistic approach to hair restoration.",
      },
      {
        emoji: "🕐",
        benefit: "Quick Recovery",
        description: "There's minimal downtime, allowing you to return to your daily activities almost immediately.",
      },
      {
        emoji: "🤴",
        benefit: "Boosted Confidence",
        description:
          "Achieving a fuller head of hair can lead to enhanced self-esteem and confidence in personal and professional arenas.",
      },
    ],
    faqHeadline:
      "Experience a renewed sense of confidence with advanced Hair Restoration techniques. Harnessing the power of PRP, it's a natural approach to combat thinning and balding.",
    faqs: [
      {
        question: "How does PRP Hair Restoration work?",
        answer:
          "PRP Hair Restoration involves drawing a small amount of the patient's blood, processing it to concentrate the platelet-rich plasma, and then injecting it into the scalp. The growth factors in PRP stimulate hair follicles, promoting thicker and healthier hair growth.",
      },
      {
        question: "How many sessions are needed?",
        answer:
          "The number of sessions varies based on individual needs. Typically, patients might require multiple sessions spaced a month apart, followed by maintenance treatments once or twice a year.",
      },
      {
        question: "Is the procedure painful?",
        answer:
          "A local anesthetic is applied to numb the scalp, minimizing discomfort. Most patients feel a mild pressure or tingling sensation during the procedure.",
      },
      {
        question: "When can I expect to see results?",
        answer:
          "Visible results, such as reduced hair shedding and thicker hair growth, typically become noticeable 3-6 months after starting treatments.",
      },
      {
        question: "Is PRP Hair Restoration suitable for everyone?",
        answer:
          "While PRP is beneficial for many individuals with hair thinning, it's crucial to consult with a specialist to determine if the procedure is right for you.",
      },
    ],
  },
  {
    name: "Vampire Facial",
    slug: "vampire-facial",
    description:
      "The Vampire Facial treatment is an innovative and non-invasive procedure that uses Platelet-Rich Plasma (PRP) therapy to improve overall skin texture, enhance elasticity, and promote a youthful-looking complexion. During the treatment, a small sample of the patient's blood is taken and spun in a centrifuge to separate the PRP from the red blood cells. This PRP is topically applied after a microdermabrasion procedure which has been enhanced with PRP to stimulate collagen and elastin production. The combination of microdermabrasion and PRP helps to resurface the skin and remove dead skin cells while promoting rejuvenation and repair, leaving the skin plumper and tighter looking with improved clarity. The results of the Vampire Facial can be seen as a gradual improvement to skin texture and brightness that can last from any where from 6 months up to 2 years. Overall, the Vampire Facial is a safe and effective way to naturally revitalize the skin by tapping into the power of the patient's own blood platelets, and it's suitable for people with different skin types or conditions.",
    headline: "Radiate Youthful Confidence: Boost Your Skin's Natural Healing Power!",
    subline:
      "The Vampire Facial combines microdermabrasion with topical application of PRP, promoting collagen and elastin production to improve your skin. This treatment can leave your skin looking plumper, tighter, and with improved clarity that lasts up to 2 years.",
    image: "/product/facial.jpg",
    price: "$600",
    // programmatic SEO copy
    blogHeadline:
      "Yearn for a youthful skin glow without harsh treatments? Explore our Vampire Facial articles and get acquainted with this innovative skin revitalizing method. Learn from expert insights and successful transformations.",
    benefitsHeadline:
      "Gift your skin a touch of nature's best rejuvenation technique. The Vampire Facial infuses life back into your complexion, reducing signs of aging and revitalizing skin texture. Glow with health, and let your skin showcase its renewed vibrancy.",
    benefits: [
      {
        emoji: "🌟",
        benefit: "Revitalized Skin Tone",
        description:
          "The Vampire Facial significantly improves the skin's texture and tone, leading to a more youthful and vibrant appearance.",
      },
      {
        emoji: "🔍",
        benefit: "Minimized Pores & Scars",
        description: "Helps in reducing the size of large pores and the appearance of scars, promoting smoother skin.",
      },
      {
        emoji: "🔄",
        benefit: "Collagen Stimulation",
        description: "By promoting collagen production, the procedure restores skin elasticity and firmness.",
      },
      {
        emoji: "🌿",
        benefit: "Natural Ingredients",
        description:
          "Utilizing PRP derived from your own blood, the Vampire Facial offers a holistic, natural approach to skin rejuvenation.",
      },
    ],
    faqHeadline:
      "Revitalize your skin with the Vampire Facial. Using your body's natural healing factors, this procedure offers rejuvenation like no other.",
    faqs: [
      {
        question: "How does the Vampire Facial work?",
        answer:
          "The Vampire Facial involves micro-needling the skin followed by the application of PRP. The PRP enhances the healing process, leading to reduced fine lines, improved texture, and a youthful glow.",
      },
      {
        question: "Is the procedure painful?",
        answer:
          "A numbing cream is applied before the procedure to ensure comfort. Patients might feel a tingling or slight pricking sensation from the micro-needling.",
      },
      {
        question: "How long is the recovery time?",
        answer:
          "Most patients experience mild redness and swelling for 1-3 days post-procedure. It's essential to avoid direct sunlight and wear sunscreen during the healing process.",
      },
      {
        question: "How often should I get a Vampire Facial?",
        answer:
          "For optimal results, it's recommended to undergo 2-3 treatments spaced about a month apart. After that, maintenance treatments can be done annually or as recommended by your practitioner.",
      },
      {
        question: "What sets the Vampire Facial apart from other facials?",
        answer:
          "The Vampire Facial harnesses the natural healing factors in your PRP, making it a holistic approach to skin rejuvenation that provides longer-lasting results than traditional facials.",
      },
    ],
  },
  {
    name: "Vampire Face Lift",
    slug: "vampire-face-lift",
    description:
      "The Vampire Facelift is a non-invasive cosmetic procedure that involves the use of Botox, Filler, and the Vampire Facial to resculpt the face. Botox temporarily paralyzes the muscles that cause wrinkles, reducing the appearance of fine lines and wrinkles. Filler uses hyaluronic acid to add volume and achieve a fuller, more youthful-looking appearance. The Vampire Facial stimulates collagen production and tightens the skin, which helps to fill in wrinkles and achieve smoother-looking skin. Together, these three treatments work synergistically to produce natural-looking and long-lasting results. The Vampire Facelift is an ideal solution for those who want to enhance their natural beauty and rejuvenate their skin without the pain or downtime of surgical procedures.",
    headline: "Redefine Your Beauty: Non-Invasive, Long-Lasting Rejuvenation!",
    subline:
      "The Vampire Facelift combines the use of Botox, Filler, and the Vampire Facial to rejuvenate and resculpt the face. This non-invasive procedure stimulates collagen production, fills in wrinkles, and provides a smoother, more youthful-looking skin with long-lasting results.",
    image: "/product/facelift.png",
    price: "$1,500",
    // programmatic SEO copy
    blogHeadline:
      "Seeking a holistic approach to facial rejuvenation? Our Vampire Facelift blog offers a treasure trove of information on how Botox, Filler, and the Vampire Facial work synergistically. Discover expert opinions and success tales.",
    benefitsHeadline:
      "Redefine age on your own terms with the synergy of Botox, Filler, and the Vampire Facial. Witness a transformation that smoothens, tightens, and revitalizes, revealing a face that's as youthful in appearance as it is in spirit.",
    benefits: [
      {
        emoji: "🏆",
        benefit: "Youthful Contouring",
        description:
          "The Vampire Face Lift redefines facial contours, providing a more youthful profile and appearance.",
      },
      {
        emoji: "🌟",
        benefit: "Skin Rejuvenation",
        description: "This procedure revitalizes the skin, diminishing wrinkles, and fine lines.",
      },
      {
        emoji: "💉",
        benefit: "Minimally Invasive",
        description: "Unlike surgical facelifts, the Vampire Face Lift is less invasive with quicker recovery time.",
      },
      {
        emoji: "⌛",
        benefit: "Long-lasting Effects",
        description:
          "The results can last for over a year, reducing the frequency of treatments compared to other cosmetic procedures.",
      },
    ],
    faqHeadline:
      "Redefine and rejuvenate with the Vampire Face Lift. This procedure offers natural-looking results without the need for surgery.",
    faqs: [
      {
        question: "How is the Vampire Face Lift different from a traditional face lift?",
        answer:
          "Unlike surgical face lifts that remove excess skin, the Vampire Face Lift uses injections of PRP and hyaluronic acid fillers to restore volume, improve skin texture, and stimulate collagen production.",
      },
      {
        question: "Is the procedure painful?",
        answer:
          "Local anesthesia or numbing cream is applied to ensure patient comfort. Most patients report only a mild sensation during the injections.",
      },
      {
        question: "How long does the procedure take?",
        answer: "The Vampire Face Lift usually takes about an hour, including preparation and the treatment itself.",
      },
      {
        question: "How long do the results last?",
        answer:
          "Results can last for 12-18 months, varying from person to person. Touch-up treatments can help maintain the effects.",
      },
      {
        question: "Are there any side effects?",
        answer:
          "Common side effects are mild and can include temporary redness, swelling, or bruising at the injection sites. Serious side effects are rare.",
      },
    ],
  },
  {
    name: "Joint Restoration",
    slug: "joint-restoration",
    description:
      "Joint Restoration using PRP therapy is a non-surgical solution for various joint issues, providing a potential alternative to joint replacement surgery. PRP's healing properties naturally stimulate tissue regeneration and reduce inflammation, rejuvenating your joints and leading to reduced discomfort and improved mobility. This innovative treatment can help to alleviate the symptoms of conditions such as osteoarthritis, rotator cuff tears, ACL injuries, and tennis elbow, among others. With a series of treatments, you may experience less pain, increased functionality, and possibly avoid the need for surgical intervention.",
    headline: "Reclaim Your Mobility: Non-Surgical, Effective Relief!",
    subline:
      "Joint Restoration uses PRP therapy, which naturally stimulates tissue regeneration, offering a non-surgical solution for joint issues. The process rejuvenates your joints, leading to reduced discomfort and improved mobility.",
    image: "/product/wrist.jpg",
    price: "$800",
    // programmatic SEO copy
    blogHeadline:
      "Facing joint issues and considering surgery? Explore non-surgical solutions in our Joint Restoration blog. Learn how PRP therapy aids tissue regeneration, helping many avoid invasive procedures.",
    benefitsHeadline:
      "Say goodbye to joint discomfort and embrace a life of mobility. Joint Restoration using PRP offers a promising horizon for those seeking non-surgical relief. Walk, run, and dance through life with newfound ease and flexibility.",
    benefits: [
      {
        emoji: "🏃‍♂️",
        benefit: "Restored Mobility",
        description:
          "Joint Restoration can lead to increased mobility and flexibility, improving overall physical function.",
      },
      {
        emoji: "🔥",
        benefit: "Pain Reduction",
        description: "Many patients report significant reductions in joint pain and discomfort post-procedure.",
      },
      {
        emoji: "💪",
        benefit: "Natural Healing Boost",
        description:
          "The treatment harnesses the body's own healing mechanisms, making the recovery process more organic.",
      },
      {
        emoji: "🔄",
        benefit: "Joint Tissue Regeneration",
        description: "Promotes the regeneration of joint tissues, aiding in the long-term health of the joint.",
      },
    ],
    faqHeadline:
      "Empower your mobility with Joint Restoration. Utilizing PRP and other advanced techniques, this approach targets joint pain and degradation at its source.",
    faqs: [
      {
        question: "How does PRP aid in Joint Restoration?",
        answer:
          "PRP contains growth factors that can reduce inflammation, promote healing, and possibly slow the degeneration of joint tissues. When injected into the affected joint, PRP can stimulate a healing response.",
      },
      {
        question: "Is the procedure painful?",
        answer:
          "The injection site is numbed to minimize discomfort. Patients might feel a pressure or slight pinch during the injection, but the procedure is relatively quick.",
      },
      {
        question: "How many treatments will I need?",
        answer:
          "The number of treatments varies based on individual needs and the severity of the joint issue. Some patients benefit from a single treatment, while others might require a series of injections over several months.",
      },
      {
        question: "What is the recovery time?",
        answer:
          "Most patients can resume their regular activities within a day. It's advised to avoid strenuous activities for a few days post-procedure.",
      },
      {
        question: "Are there any side effects?",
        answer:
          "Possible side effects include temporary pain, swelling, or stiffness at the injection site. These symptoms typically resolve within a few days.",
      },
    ],
  },
  {
    name: "Xeomin",
    slug: "xeomin",
    description:
      "Xeomin is a unique non-surgical procedure targeting a variety of facial areas, including bunny lines, forehead, 'lip flip', crow's feet, gummy smile, and also treating hyperhidrosis. By temporarily inhibiting muscle contractions, Xeomin can smooth out wrinkles, creating a more youthful and rejuvenated appearance. Its precision and effectiveness have made it a popular choice for those seeking to enhance their natural beauty without invasive surgery.",
    headline: "Express Your Natural Beauty: Targeted, Non-Invasive, Refreshing!",
    subline:
      "Xeomin focuses on specific facial areas, smoothing out wrinkles and addressing hyperhidrosis. It's a non-surgical solution to enhance your beauty and rejuvenate your appearance.",
    image: "/product/xeomin.png",
    price: "$12 per unit",
    // programmatic SEO copy
    blogHeadline:
      "Want a refreshed, wrinkle-free face without invasive treatments? Dive into our Xeomin blog posts. Learn about its precision, benefits, and how it's the secret to many's youthful appearance.",
    benefitsHeadline:
      "Enhance your beauty by targeting the details. With Xeomin, witness a smoother, wrinkle-free face that's radiant and youthful. Embrace a transformation that's both subtle and impactful, amplifying your natural beauty.",
    benefits: [
      {
        emoji: "🌟",
        benefit: "Wrinkle Reduction",
        description:
          "Xeomin effectively reduces the appearance of fine lines and wrinkles, especially in the forehead region.",
      },
      {
        emoji: "🛡",
        benefit: "Prevents New Wrinkle Formation",
        description:
          "Regular Xeomin treatments can prevent the formation of new wrinkles by limiting muscle contractions.",
      },
      {
        emoji: "⏳",
        benefit: "Quick Procedure",
        description: "Xeomin treatments are quick, often completed in less than 20 minutes.",
      },
      {
        emoji: "💉",
        benefit: "No Downtime",
        description:
          "Post-treatment, patients can immediately return to their daily activities with no necessary recovery period.",
      },
    ],
    faqHeadline:
      "Experience a smoother, more youthful complexion with Xeomin. This innovative treatment targets the underlying causes of fine lines and wrinkles.",
    faqs: [
      {
        question: "How does Xeomin differ from Botox?",
        answer:
          "Both Xeomin and Botox are types of botulinum toxin used to relax muscles and reduce wrinkles. The primary difference is that Xeomin is a 'naked' injectable, meaning it doesn't contain any additives, which might reduce the risk of developing resistance.",
      },
      {
        question: "How long does the procedure take?",
        answer: "The Xeomin injection procedure is quick, typically taking about 10-20 minutes.",
      },
      {
        question: "When will I see results?",
        answer:
          "Most patients notice improvements within 3-7 days post-injection, with full results visible after two weeks.",
      },
      {
        question: "How long do the effects of Xeomin last?",
        answer:
          "The results can last between 3 to 6 months, depending on individual factors. Periodic touch-up treatments are required to maintain results.",
      },
      {
        question: "Are there any side effects?",
        answer:
          "Common side effects are mild and include temporary redness, swelling, or bruising at the injection site. It's essential to consult with your practitioner regarding any potential risks.",
      },
    ],
  },
  {
    name: "Filler",
    slug: "filler",
    description:
      "Filler treatment is a non-invasive procedure designed to add volume and smoothness to specific areas of the face, including eyebrow lift, nasolabial folds, cheeks, and marionette lines. By using hyaluronic acid, a naturally occurring substance in the body, fillers plump up and hydrate the skin, effectively reducing wrinkles and adding definition to the face. It's an excellent option for those looking to achieve a more youthful look without undergoing surgical procedures.",
    headline: "Accentuate Your Features: Smooth, Plump, Youthful!",
    subline:
      "Filler treatment adds volume to specific areas of the face, effectively reducing wrinkles and enhancing facial definition. It's a non-invasive way to achieve a smoother, plumper, and more youthful appearance.",
    image: "/product/filler.png",
    price: "$600 per syringe",
    // programmatic SEO copy
    blogHeadline:
      "Aiming for a plumper face with smooth features? Our Filler blog section offers insights into the magic of hyaluronic acid. Read about its applications, outcomes, and why many choose it over surgery.",
    benefitsHeadline:
      "Discover a face that's radiant, youthful, and defined. Filler treatments offer a journey towards smoother skin and emphasized features, all while staying true to your authentic self. Let your face tell a story of grace and ageless charm.",
    benefits: [
      {
        emoji: "🌟",
        benefit: "Volume Restoration",
        description:
          "Fillers restore lost volume in areas like cheeks, lips, and under-eye, resulting in a plumper and youthful appearance.",
      },
      {
        emoji: "🌈",
        benefit: "Contour Enhancement",
        description: "Fillers can be used to sculpt and enhance facial contours, providing more definition and shape.",
      },
      {
        emoji: "⌛",
        benefit: "Immediate Results",
        description: "Most filler treatments offer instantaneous results, allowing patients to see changes right away.",
      },
      {
        emoji: "🕐",
        benefit: "Long-lasting Outcome",
        description: "Depending on the type of filler used, results can last anywhere from 6 months to 2 years.",
      },
    ],
    faqHeadline:
      "Elevate your aesthetic with dermal fillers. Designed to restore volume and contour, these treatments offer immediate and stunning results.",
    faqs: [
      {
        question: "What areas can be treated with dermal fillers?",
        answer:
          "Dermal fillers can be used to plump lips, enhance cheek contours, reduce the appearance of fine lines and wrinkles, improve the jawline, and correct under-eye hollows.",
      },
      {
        question: "How long do the results last?",
        answer:
          "The longevity of filler results varies based on the type of filler used and individual factors. Generally, results can last from 6 months to over a year.",
      },
      {
        question: "Are fillers safe?",
        answer:
          "When administered by a trained professional, dermal fillers are generally safe. However, as with any procedure, there are potential risks, so it's essential to discuss with your practitioner.",
      },
      {
        question: "Is the procedure painful?",
        answer:
          "Most dermal fillers contain a numbing agent, and an external numbing cream can also be applied. Most patients report only a mild pinch or discomfort during the injection.",
      },
      {
        question: "Can filler be reversed?",
        answer:
          "Yes, certain types of fillers, like those based on hyaluronic acid, can be dissolved with an enzyme called hyaluronidase if desired or necessary.",
      },
    ],
  },
  {
    name: "Hyperhidrosis Treatment",
    slug: "Hyperhidrosis-treatment",
    description:
      "Our Hyperhidrosis treatment utilizes Xeomin injections to effectively address excessive sweating, a condition also known as Hyperhidrosis. By blocking the nerve signals to sweat glands, Xeomin can significantly reduce sweat production, providing relief for those affected by this condition. This non-invasive treatment is a practical alternative to surgery, offering a high success rate and minimal side effects.",
    headline: "Experience Refreshing Relief: Non-Invasive, Effective, Liberating!",
    subline:
      "Our Hyperhidrosis treatment with Xeomin injections effectively reduces sweat production, offering a non-invasive solution to those affected by excessive sweating.",
    image: "/product/armpit.jpg",
    price: "$1,000+",
    // programmatic SEO copy
    blogHeadline:
      "Bothered by excessive sweating? Explore our Hyperhidrosis Treatment articles. Understand how Xeomin injections provide relief, offering testimonials and expert solutions for this condition.",
    benefitsHeadline:
      "Break free from the chains of excessive sweating. With our Hyperhidrosis treatment, step into a world where comfort meets confidence. Say goodbye to discomfort and embrace every moment with self-assuredness.",
    benefits: [
      {
        emoji: "🌬",
        benefit: "Excessive Sweat Reduction",
        description:
          "Hyperhidrosis Treatment effectively reduces excessive sweating in targeted areas, allowing for more comfort.",
      },
      {
        emoji: "💼",
        benefit: "Boosted Confidence",
        description: "By managing sweating, individuals can feel more confident in social and professional settings.",
      },
      {
        emoji: "⏳",
        benefit: "Quick Treatment",
        description: "Most Hyperhidrosis treatments are fast, with sessions often completed in less than an hour.",
      },
      {
        emoji: "🔒",
        benefit: "Long-term Results",
        description:
          "Results from hyperhidrosis treatments can last up to 7-8 months, reducing the need for frequent sessions.",
      },
    ],
    faqHeadline:
      "Regain confidence and comfort with Hyperhidrosis Treatment. Tailored solutions target excessive sweating and provide lasting relief.",
    faqs: [
      {
        question: "What causes hyperhidrosis?",
        answer:
          "Hyperhidrosis, or excessive sweating, can be caused by a variety of factors including genetics, hormonal changes, medications, or certain medical conditions.",
      },
      {
        question: "How does the treatment work?",
        answer:
          "There are multiple treatments for hyperhidrosis, including topical solutions, oral medications, Botox injections, and more advanced procedures like miraDry or sympathectomy. The best treatment depends on the individual and the severity of their condition.",
      },
      {
        question: "Is the treatment permanent?",
        answer:
          "The longevity of results depends on the treatment type. While methods like Botox offer temporary relief, procedures like miraDry can provide more lasting results.",
      },
      {
        question: "Are there any side effects?",
        answer:
          "Side effects vary based on the chosen treatment. For instance, Botox might lead to temporary injection site reactions, while more invasive procedures carry their own set of risks.",
      },
      {
        question: "How soon can I see results?",
        answer:
          "Results can be immediate or develop over a few days or weeks, depending on the chosen treatment method.",
      },
    ],
  },
];
