import type { TaskDraft } from "./types";

export type FormErrors = { title?: string; description?: string };

export function validate(values: TaskDraft): FormErrors {
  const errors: FormErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = "Bitte einen Titel eingeben.";
  else if (title.length < 3) errors.title = "Der Titel braucht mindestens 3 Zeichen.";
  else if (title.length > 80) errors.title = "Der Titel darf höchstens 80 Zeichen lang sein.";
  if (values.description.trim().length > 300) {
    errors.description = "Die Beschreibung darf höchstens 300 Zeichen lang sein.";
  }
  return errors;
}
