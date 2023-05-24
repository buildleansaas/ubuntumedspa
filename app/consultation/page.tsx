"use client";

import React, { useState, ChangeEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import { LeadsTable } from "lib/airtable";

interface FormState {
  email: string;
  name: string;
  phone: string;
  comments: string;
  interests: string[];
  referral: string;
}

const DEFAULT_FORM_SUBMISSION: FormState =
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

const FORM_INPUTS = [
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

export default async function BookConsultation() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM_SUBMISSION);

  const handleChange = ({ target: { name, value } }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prevFormState) => ({
      ...prevFormState,
      [name]: name === "interests" ? getUpdatedInterests(value) : value,
    }));
  };

  const getUpdatedInterests = (interestName: string) => {
    if (form.interests.includes(interestName)) {
      return form.interests.filter((interest) => interest !== interestName);
    }
    return [...form.interests, interestName];
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // const res = await LeadsTable.create({
      //   email: form.email,
      //   name: form.name,
      //   phone: form.phone,
      //   comments: form.comments,
      //   interests: form.interests,
      //   referral: form.referral,
      // });
      // if (res.id) {
      //   toast.success(
      //     "We're Excited To Have You!\nCheck your email to select a date, and we'll be in touch to schedule your consultation."
      //   );
      // }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed w-full top-0 z-50 flex items-center justify-center">
      <div className="w-full py-6 sm:max-w-md px-8 bg-white shadow-xl rounded-lg z-50 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-center text-2xl font-semibold text-gray-700 md:text-3xl">
            Book Your Med Spa Consultation
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          {FORM_INPUTS.map(({ id, label, type, helperText, options }) => (
            <div key={id} className="mb-4">
              <p className="mb-2 font-semibold text-gray-700">{label}</p>
              {type === "textarea" ? (
                <textarea
                  className="block w-full px-4 py-3 text-gray-700 bg-gray-200 border-2 border-gray-300 rounded-md focus:border-gray-500 focus:bg-white focus:outline-none"
                  name={id}
                  value={form[id]}
                  onChange={handleChange}
                  required
                />
              ) : type === "checkbox" ? (
                <div className="flex flex-col">
                  {options.map((option) => (
                    <label key={option} className="inline-flex items-center mb-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-green-600"
                        name="interests"
                        value={option}
                        checked={form.interests.includes(option)}
                        onChange={handleChange}
                      />
                      <span className="ml-2">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={type}
                  name={id}
                  value={form[id]}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 text-gray-700 bg-gray-200 border-2 border-gray-300 rounded-md focus:border-gray-500 focus:bg-white focus:outline-none"
                  required
                />
              )}
              {helperText && <p className="mt-1 text-sm text-gray-600">{helperText}</p>}
            </div>
          ))}
          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-block w-full px-4 py-2 my-2 text-base font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Schedule Consultation
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
