"use client";

import { useForm, Controller } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DEFAULT_FORM_SUBMISSION, FORM_INPUTS } from "constants/consultationForm";

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

export default function ConsultationPage() {
  const { register, handleSubmit, control } = useForm<FormState>({
    defaultValues: DEFAULT_FORM_SUBMISSION,
  });

  const onSubmit = (data: FormState) => console.log(data);

  return (
    <>
      <h1 className="text-center text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-bold tracking-tight text-white mb-4 sm:mb-8">
        Consultation Intake Form
      </h1>
      <h2 className="text-center text-white text-lg md:text-xl lg:text-2xl mx-auto leading-tight pb-4 max-w-2xl mb-4">
        Please fill out the following information and we will get back to you as soon as possible to schedule your
        consultation!
      </h2>
      <form
        className="shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-white bg-opacity-20 text-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        {FORM_INPUTS.map((input) => {
          switch (input.type) {
            case "text":
            case "email":
            case "tel":
              return (
                <div className="mb-4" key={input.id}>
                  <label className="block text-sm font-bold mb-2" htmlFor={input.id}>
                    {input.label}
                  </label>
                  <input
                    {...register(input.id)}
                    className="text-black shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    id={String(input.id)}
                    type={input.type}
                    placeholder={input.label}
                  />
                  <p className="text-gray-100 text-xs italic">{input.helperText}</p>
                </div>
              );
            case "checkbox":
              return (
                <fieldset key={String(input.id)} className="mb-4">
                  <legend className="block text-sm font-bold mb-2">{input.label}</legend>
                  {input.options?.map((option) => (
                    <div key={option} className="mb-2">
                      <Controller
                        control={control}
                        name={input.id as keyof FormState}
                        render={({ field: { onChange, value } }) => (
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              value={option}
                              checked={value.includes(option)}
                              onChange={(e) => {
                                const selected = Array.isArray(value) ? value : [];
                                if (e.target.checked && !selected.includes(option)) {
                                  onChange([...selected, option]);
                                } else if (!e.target.checked && selected.includes(option)) {
                                  onChange(selected.filter((v: string) => v !== option));
                                }
                              }}
                              className="form-checkbox text-indigo-600"
                            />
                            <span className="ml-2">{option}</span>
                          </label>
                        )}
                      />
                    </div>
                  ))}

                  <p className="text-gray-100 text-xs italic">{input.helperText}</p>
                </fieldset>
              );
            case "textarea":
              return (
                <div className="mb-4" key={String(input.id)}>
                  <label className="block text-sm font-bold mb-2" htmlFor={String(input.id)}>
                    {input.label}
                  </label>
                  <textarea
                    {...register(input.id)}
                    className="text-black shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    id={String(input.id)}
                    placeholder={input.label}
                  />
                  <p className="text-gray-100 text-xs italic">{input.helperText}</p>
                </div>
              );
            default:
              return null;
          }
        })}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
