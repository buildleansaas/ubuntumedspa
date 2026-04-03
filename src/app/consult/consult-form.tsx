"use client";

import { useState } from "react";
import { DEFAULT_FORM_SUBMISSION, FORM_INPUTS } from "data";
import * as yup from "yup";
import { useRouter } from "next/navigation";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import { Loader } from "lucide-react";
import { cn } from "lib/utils";

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

const ConsultationForm: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_SUBMISSION);
  const wideFieldIds = ["name", "interests", "comments", "referral"] as const;

  const inputClassName =
    "mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-base text-base-content shadow-sm transition-colors placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

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
      const response = await fetch("/api/consult", {
        body: JSON.stringify(formState),
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const body = await response.json();

      if (response.status === 200) {
        setFormState(DEFAULT_FORM_SUBMISSION);
        toast({ title: "Consult request received. Redirecting to scheduling..." });
        router.push(body.scheduleUrl);
      } else {
        toast({ title: body.error || "Something went wrong. Please try again later.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: err instanceof Error ? err.message : "Please check the form and try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mx-auto max-w-3xl rounded-[1.75rem] border border-base-300 bg-base-100 px-6 py-6 shadow-sm sm:px-8 sm:py-8 md:px-10 md:py-10"
      onSubmit={onSubmit}
    >
      <div className="border-b border-base-300 pb-6">
        <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">Consultation intake</p>
        <p className="mt-3 max-w-2xl text-base text-base-content/70">
          Share the essentials below so we can prepare for your visit and reach out with next steps.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {FORM_INPUTS.map((input) => {
          const helperId = `${String(input.id)}-help`;
          const isWideField = wideFieldIds.includes(String(input.id) as (typeof wideFieldIds)[number]);

          switch (input.type) {
            case "text":
            case "email":
            case "tel":
              return (
                <div className={cn("space-y-2", isWideField && "md:col-span-2")} key={input.id}>
                  <label className="block text-sm font-semibold text-base-content" htmlFor={String(input.id)}>
                    {input.label}
                  </label>
                  <input
                    aria-describedby={input.helperText ? helperId : undefined}
                    className={inputClassName}
                    id={String(input.id)}
                    name={String(input.id)}
                    type={input.type}
                    value={String(formState[input.id] ?? "")}
                    onChange={handleChange}
                    placeholder={input.label}
                  />
                  {input.helperText ? (
                    <p className="text-xs text-base-content/60" id={helperId}>
                      {input.helperText}
                    </p>
                  ) : null}
                </div>
              );
            case "checkbox":
              return (
                <fieldset key={String(input.id)} className="space-y-3 md:col-span-2" aria-describedby={helperId}>
                  <legend className="block text-sm font-semibold text-base-content">{input.label}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {input.options?.map((option) => {
                      const checked = formState.interests.includes(option);

                      return (
                        <label
                          key={option}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-5 transition-colors",
                            checked
                              ? "border-primary bg-primary/5 text-base-content"
                              : "border-base-300 bg-base-100 text-base-content/80 hover:bg-base-200/70"
                          )}
                        >
                          <input
                            type="checkbox"
                            name="interests"
                            value={option}
                            checked={checked}
                            onChange={handleCheckboxChange}
                            className="mt-1 h-4 w-4 shrink-0 accent-primary"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                  {input.helperText ? (
                    <p className="text-xs text-base-content/60" id={helperId}>
                      {input.helperText}
                    </p>
                  ) : null}
                </fieldset>
              );
            case "textarea":
              return (
                <div className="space-y-2 md:col-span-2" key={String(input.id)}>
                  <label className="block text-sm font-semibold text-base-content" htmlFor={String(input.id)}>
                    {input.label}
                  </label>
                  <textarea
                    aria-describedby={input.helperText ? helperId : undefined}
                    className={cn(inputClassName, "min-h-36 resize-y")}
                    id={String(input.id)}
                    name={String(input.id)}
                    rows={5}
                    value={String(formState[input.id] ?? "")}
                    onChange={handleChange}
                    placeholder={input.label}
                  />
                  {input.helperText ? (
                    <p className="text-xs text-base-content/60" id={helperId}>
                      {input.helperText}
                    </p>
                  ) : null}
                </div>
              );
            default:
              return null;
          }
        })}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-base-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-base-content/60">Most consultation requests receive a response within 2 business days.</p>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" /> Sending...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ConsultationForm;
