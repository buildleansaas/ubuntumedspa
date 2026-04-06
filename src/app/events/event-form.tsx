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
} from "lib/event-form";
import type { EventDefinition, EventFieldDefinition, EventFormState, EventOptionGroup } from "lib/events";
import { cn } from "lib/utils";

const WIDE_FIELD_TYPES = new Set(["textarea", "checkbox"]);

const inputClassName =
  "mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-base text-base-content transition-colors placeholder:text-base-content/35 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

const getOptionGroups = (field: EventFieldDefinition): EventOptionGroup[] => {
  if (field.optionGroups?.length) return field.optionGroups;
  if (field.options?.length) return [{ label: "Options", options: field.options }];
  return [];
};

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
    <form className="mx-auto max-w-4xl" onSubmit={handleSubmit}>
      <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
        {event.form.fields.map((field) => {
          const helperId = `${field.id}-help`;
          const isWideField = field.layout === "full" || WIDE_FIELD_TYPES.has(field.type);

          if (field.type === "checkbox") {
            const selectedValues = getFieldValue(formState, field);
            const checkedValues = Array.isArray(selectedValues) ? selectedValues : [];
            const lockedOptions = field.lockedOptions || [];
            const optionGroups = getOptionGroups(field);

            return (
              <fieldset
                key={field.id}
                className="space-y-6 border-t border-base-300/80 pt-8 md:col-span-2"
                aria-describedby={field.helperText ? helperId : undefined}
              >
                <legend className="block text-sm font-semibold text-base-content">{field.label}</legend>
                <div className="space-y-2">
                  {field.helperText ? (
                    <p className="max-w-3xl text-sm leading-6 text-base-content/65" id={helperId}>
                      {field.helperText}
                    </p>
                  ) : null}
                </div>

                {lockedOptions.length ? (
                  <div className="rounded-[1.6rem] border border-primary/15 bg-primary/5 p-5 sm:p-6">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-primary/80">Core offer</p>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-medium text-base-content">{lockedOptions.join(", ")}</p>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/70">
                          The host reward is tied to paid Botox guests, so Botox stays built into the event.
                        </p>
                      </div>
                      <span className="inline-flex w-fit rounded-full border border-primary/20 bg-base-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                        Included
                      </span>
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-4 lg:grid-cols-2">
                  {optionGroups.map((group) => (
                    <div
                      key={group.label}
                      className="rounded-[1.5rem] border border-base-300/70 bg-base-200/35 p-4 sm:p-5"
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-base-content/55">{group.label}</p>
                      <div className="mt-4 grid gap-3">
                        {group.options.map((option) => {
                          const checked = checkedValues.includes(option);

                          return (
                            <label
                              key={option}
                              className={cn(
                                "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-5 transition-colors",
                                checked
                                  ? "border-primary bg-base-100 text-base-content"
                                  : "border-base-300 bg-base-100/90 text-base-content/80 hover:border-base-content/15 hover:bg-base-100"
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
                    </div>
                  ))}
                </div>
              </fieldset>
            );
          }

          if (field.type === "textarea") {
            return (
              <div className="space-y-2 border-t border-base-300/80 pt-8 md:col-span-2" key={field.id}>
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

      <div className="mt-8 flex flex-col gap-4 border-t border-base-300/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
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
