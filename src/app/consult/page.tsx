"use client";

import { useState } from "react";
import { DEFAULT_FORM_SUBMISSION, FORM_INPUTS } from "data";
import * as yup from "yup";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import { Loader } from "lucide-react";

export interface FormState {
  email: string;
  name: string;
  phone: string;
  comments: string;
  interests: string[];
  referral: string;
}

export interface FormInput {
  id: keyof FormState;
  label: string;
  type: string;
  helperText?: string;
  options?: string[];
}

const ConsultationPage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_SUBMISSION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (e.target.checked) {
      setFormState({
        ...formState,
        interests: [...formState.interests, value],
      });
    } else {
      setFormState({
        ...formState,
        interests: formState.interests.filter((interest) => interest !== value),
      });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      phone: yup.string().required(),
      interests: yup.array().of(yup.string()).required(),
      referral: yup.string().required(),
      comments: yup.string().required(),
    });

    try {
      await schema.validate(formState);
      const response = await fetch("/api/consult", { body: JSON.stringify(formState), method: "POST" });

      if (response.status === 200) {
        setFormState(DEFAULT_FORM_SUBMISSION);
        toast({ title: "Form submission successful!" });
      } else toast({ title: "Something went wrong. Please try again later.", variant: "destructive" });
    } catch (err) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-center text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-bold tracking-tight text-primary-content mb-4 sm:mb-8">
        Consultation Intake Form{" "}
      </h2>
      <h2 className="text-center text-primary-content text-lg md:text-xl lg:text-2xl mx-auto leading-tight pb-4 max-w-2xl mb-4">
        Please fill out the following information and we will get back to you as soon as possible to schedule your
        consultation!
      </h2>
      <form
        className="shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 bg-white bg-opacity-20 text-primary-content"
        onSubmit={onSubmit}
      >
        {FORM_INPUTS.map((input) => {
          switch (input.type) {
            case "text":
            case "email":
            case "tel":
              return (
                <div className="mb-4" key={input.id}>
                  <label className="block text-sm font-semibold mb-1" htmlFor={String(input.id)}>
                    {input.label}
                  </label>
                  <input
                    className="text-black shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    id={String(input.id)}
                    type={input.type}
                    value={formState[input.id]}
                    onChange={handleChange}
                    placeholder={input.label}
                  />
                  <p className="text-base-content/70 text-xs italic">{input.helperText}</p>
                </div>
              );
            case "checkbox":
              return (
                <fieldset key={String(input.id)} className="mb-4">
                  <legend className="block text-sm font-bold mb-2">{input.label}</legend>
                  {input.options?.map((option) => (
                    <div key={option} className="mb-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          checked={formState.interests.includes(option)}
                          onChange={handleCheckboxChange}
                          className="form-checkbox text-indigo-600"
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    </div>
                  ))}
                  <p className="text-base-content/70 text-xs italic">{input.helperText}</p>
                </fieldset>
              );
            case "textarea":
              return (
                <div className="mb-4" key={String(input.id)}>
                  <label className="block text-sm font-bold mb-2" htmlFor={String(input.id)}>
                    {input.label}
                  </label>
                  <textarea
                    className="text-black shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    id={String(input.id)}
                    value={formState[input.id]}
                    onChange={handleChange}
                    placeholder={input.label}
                  />
                  <p className="text-base-content/70 text-xs italic">{input.helperText}</p>
                </div>
              );
            default:
              return null;
          }
        })}
        <div className="flex items-center justify-between">
          <Button className="bg-primary hover:bg-primary-focus" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader className="animate-spin" /> Sending...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ConsultationPage;
