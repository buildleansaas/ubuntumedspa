import * as yup from "yup";

import type { EventDefinition, EventFieldValue, EventFormState } from "lib/events";

const mergeCheckboxValues = (selectedValues: string[], lockedValues: string[] = []) => {
  const seen = new Set<string>();
  const mergedValues: string[] = [];

  [...lockedValues, ...selectedValues].forEach((value) => {
    const normalizedValue = value.trim();
    if (!normalizedValue || seen.has(normalizedValue)) return;
    seen.add(normalizedValue);
    mergedValues.push(normalizedValue);
  });

  return mergedValues;
};

export const buildEventDefaultFormState = (event: EventDefinition): EventFormState =>
  Object.fromEntries(
    event.form.fields.map((field) => {
      if (field.type === "checkbox") {
        const defaultValues = Array.isArray(field.defaultValue) ? field.defaultValue : [];
        return [field.id, mergeCheckboxValues(defaultValues, field.lockedOptions)];
      }

      return [field.id, typeof field.defaultValue === "string" ? field.defaultValue : ""];
    })
  );

export const coerceEventSubmission = (
  event: EventDefinition,
  raw: Record<string, unknown>
): Record<string, EventFieldValue> =>
  Object.fromEntries(
    event.form.fields.map((field) => {
      const rawValue = raw[field.id];

      if (field.type === "checkbox") {
        const normalizedValues = Array.isArray(rawValue)
          ? rawValue.map((value) => String(value).trim()).filter(Boolean)
          : [];

        return [field.id, mergeCheckboxValues(normalizedValues, field.lockedOptions)];
      }

      if (field.type === "number") {
        if (typeof rawValue === "number") return [field.id, rawValue];
        if (typeof rawValue === "string" && rawValue.trim()) return [field.id, Number(rawValue)];
        return [field.id, Number.NaN];
      }

      return [field.id, typeof rawValue === "string" ? rawValue.trim() : ""];
    })
  );

export const buildEventSubmissionSchema = (event: EventDefinition) =>
  yup.object(
    Object.fromEntries(
      event.form.fields.map((field) => {
        if (field.type === "checkbox") {
          let schema = yup.array().of(yup.string().required());

          if (field.required) {
            schema = schema.min(1, `${field.label} is required.`).required(`${field.label} is required.`);
          }

          return [field.id, schema];
        }

        if (field.type === "number") {
          let schema = yup.number().typeError(`${field.label} is required.`).integer();

          if (typeof field.min === "number") {
            schema = schema.min(field.min, `${field.label} must be at least ${field.min}.`);
          }

          if (field.required) {
            schema = schema.required(`${field.label} is required.`);
          }

          return [field.id, schema];
        }

        let schema = yup.string();

        if (field.type === "email") {
          schema = schema.email("Please enter a valid email.");
        }

        if (field.required) {
          schema = schema.required(`${field.label} is required.`);
        }

        return [field.id, schema];
      })
    )
  );
