"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

import { Button } from "components/ui/button";
import { useToast } from "components/ui/use-toast";
import {
  buildEventDefaultFormState,
  buildEventSubmissionSchema,
  coerceEventSubmission,
  type EventDefinition,
  type EventFieldDefinition,
  type EventFormState,
} from "lib/events";
import { cn } from "lib/utils";

const WIDE_FIELD_TYPES = new Set(["textarea", "checkbox"]);

const inputClassName =
  "mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-base text-base-content shadow-sm transition-colors placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

const getFieldValue = (state: EventFormState, field: EventFieldDefinition) => {
  const value = state[field.id];

  if (field.type === "checkbox") {
    return Array.isArray(value) ? value : [];
  }

  return typeof value === "string" ? value : "";
};

export default function EventForm({ event }: { event: EventDefinition }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<EventFormState>(() => buildEventDefaultFormState(event));

  const handleInputChange = (input: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = input.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (input: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = input.target;
    setFormState((current) => {
      const existingValues: string[] = Array.isArray(current[name]) ? [...current[name]] : [];

      return {
        ...current,
        [name]: checked ? [...existingValues, value] : existingValues.filter((item) => item !== value),
      };
    });
  };

  const handleSubmit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    setLoading(true);

    const payload = coerceEventSubmission(event, formState);

    try {
      await buildEventSubmissionSchema(event).validate(payload, { abortEarly: false });
      const response = await fetch(`/api/events/${event.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();

      if (!response.ok) {
        toast({ title: body.error || "Something went wrong. Please try again later.", variant: "destructive" });
        return;
      }

      setFormState(buildEventDefaultFormState(event));
      toast({ title: event.form.successMessage });
      router.push(body.scheduleUrl);
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Please check the form and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mx-auto max-w-3xl rounded-[1.75rem] border border-base-300 bg-base-100 px-6 py-6 shadow-sm sm:px-8 sm:py-8 md:px-10 md:py-10"
      onSubmit={handleSubmit}
    >
      <div className="border-b border-base-300 pb-6">
        <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">{event.title} planning form</p>
        <p className="mt-3 max-w-2xl text-base text-base-content/70">
          Share the details below so we can prepare for the planning call.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {event.form.fields.map((field) => {
          const helperId = `${field.id}-help`;
          const isWideField = field.layout === "full" || WIDE_FIELD_TYPES.has(field.type);

          if (field.type === "checkbox") {
            const selectedValues = getFieldValue(formState, field);
            const checkedValues = Array.isArray(selectedValues) ? selectedValues : [];

            return (
              <fieldset key={field.id} className="space-y-3 md:col-span-2" aria-describedby={field.helperText ? helperId : undefined}>
                <legend className="block text-sm font-semibold text-base-content">{field.label}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field.options?.map((option) => {
                    const checked = checkedValues.includes(option);

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
                          name={field.id}
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
                {field.helperText ? (
                  <p className="text-xs text-base-content/60" id={helperId}>
                    {field.helperText}
                  </p>
                ) : null}
              </fieldset>
            );
          }

          if (field.type === "textarea") {
            return (
              <div className="space-y-2 md:col-span-2" key={field.id}>
                <label className="block text-sm font-semibold text-base-content" htmlFor={field.id}>
                  {field.label}
                </label>
                <textarea
                  aria-describedby={field.helperText ? helperId : undefined}
                  className={cn(inputClassName, "min-h-36 resize-y")}
                  id={field.id}
                  name={field.id}
                  rows={5}
                  value={getFieldValue(formState, field)}
                  onChange={handleInputChange}
                  placeholder={field.placeholder || field.label}
                />
                {field.helperText ? (
                  <p className="text-xs text-base-content/60" id={helperId}>
                    {field.helperText}
                  </p>
                ) : null}
              </div>
            );
          }

          return (
            <div className={cn("space-y-2", isWideField && "md:col-span-2")} key={field.id}>
              <label className="block text-sm font-semibold text-base-content" htmlFor={field.id}>
                {field.label}
              </label>
              <input
                aria-describedby={field.helperText ? helperId : undefined}
                className={inputClassName}
                id={field.id}
                name={field.id}
                type={field.type}
                min={field.type === "number" ? field.min : undefined}
                value={getFieldValue(formState, field)}
                onChange={handleInputChange}
                placeholder={field.placeholder || field.label}
              />
              {field.helperText ? (
                <p className="text-xs text-base-content/60" id={helperId}>
                  {field.helperText}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-base-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-base-content/60">
          After you submit, we&apos;ll send you straight into scheduling for a quick planning call.
        </p>
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader className="mr-2 size-4 animate-spin" /> Sending...
            </>
          ) : (
            event.form.submitButtonLabel
          )}
        </Button>
      </div>
    </form>
  );
}
