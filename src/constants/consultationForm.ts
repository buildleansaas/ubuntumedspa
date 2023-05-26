import { FormState, FormInput } from "app/consultation/page";
export const DEFAULT_FORM_SUBMISSION: FormState =
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

export const FORM_INPUTS: FormInput[] = [
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
      "Vampire Facial",
      "Breast Lift",
      "Joint Restoration",
      "Hair Restoration",
      "Vampire Face Lift",
      "P Shot",
      "O Shot",
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
