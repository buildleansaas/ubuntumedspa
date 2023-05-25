"use client";

import React, { useState, ChangeEvent } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      // the rest of the code...
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        {FORM_INPUTS.map((input) => {
          switch (input.type) {
            case "text":
            case "email":
            case "tel":
              return (
                <div className="mb-4" key={input.id}>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={input.id}>
                    {input.label}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={input.id}
                    type={input.type}
                    placeholder={input.label}
                    value={form[input.id as keyof FormState]}
                    onChange={handleChange}
                  />
                  <p className="text-gray-600 text-xs italic">{input.helperText}</p>
                </div>
              );
            case "checkbox":
              return (
                <fieldset key={input.id} className="mb-4">
                  <legend className="block text-gray-700 text-sm font-bold mb-2">{input.label}</legend>
                  {input.options.map((option) => (
                    <div key={option} className="mb-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="interests"
                          value={option}
                          checked={form.interests.includes(option)}
                          onChange={handleChange}
                          className="form-checkbox text-indigo-600"
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    </div>
                  ))}
                  <p className="text-gray-600 text-xs italic">{input.helperText}</p>
                </fieldset>
              );
            case "textarea":
              return (
                <div className="mb-4" key={input.id}>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={input.id}>
                    {input.label}
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={input.id}
                    placeholder={input.label}
                    value={form[input.id as keyof FormState]}
                    onChange={handleChange}
                  />
                  <p className="text-gray-600 text-xs italic">{input.helperText}</p>
                </div>
              );
            default:
              return null;
          }
        })}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
        <ToastContainer />
      </form>
    </>
  );
}
