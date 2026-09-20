import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { PRIORITY_LABEL, PRIORITY_ORDER, STATUS_LABEL, STATUS_ORDER } from "../constants";
import type { Task, TaskDraft, TaskPriority, TaskStatus } from "../types";
import { validate, type FormErrors } from "../validation";

/** Formular-Dialog zum Anlegen und Bearbeiten (natives <dialog>). */
export function TaskDialog({
  task,
  onClose,
  onSubmit,
}: {
  task: Task | null;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const uid = useId();

  const [values, setValues] = useState<TaskDraft>({
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? "open",
    priority: task?.priority ?? "medium",
  });
  const [touched, setTouched] = useState<ReadonlySet<keyof FormErrors>>(new Set());

  const errors = validate(values);
  const showError = (field: keyof FormErrors) => touched.has(field) && errors[field];

  // Dialog modal öffnen und Fokus danach zum Auslöser zurückgeben
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();
    return () => trigger?.focus?.();
  }, []);

  const set = <K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (errors.title || errors.description) {
      setTouched(new Set(["title", "description"]));
      (errors.title ? titleRef : descRef).current?.focus();
      return;
    }
    onSubmit({ ...values, title: values.title.trim(), description: values.description.trim() });
  };

  return (
    <dialog
      ref={dialogRef}
      className="tb-dialog"
      aria-labelledby={`${uid}-heading`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) dialogRef.current?.close(); // Klick auf den Hintergrund
      }}
    >
      <form className="tb-dialog-inner" onSubmit={handleSubmit} noValidate>
        <h3 id={`${uid}-heading`} className="tb-dialog-heading">
          {task ? "Aufgabe bearbeiten" : "Neue Aufgabe"}
        </h3>

        <div className="tb-field">
          <label htmlFor={`${uid}-title`}>Titel</label>
          <input
            ref={titleRef}
            id={`${uid}-title`}
            className="tb-input"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            onBlur={() => setTouched((t) => new Set(t).add("title"))}
            aria-invalid={Boolean(showError("title"))}
            aria-describedby={showError("title") ? `${uid}-title-err` : undefined}
            autoComplete="off"
          />
          {showError("title") && (
            <p id={`${uid}-title-err`} className="tb-error">{errors.title}</p>
          )}
        </div>

        <div className="tb-field">
          <label htmlFor={`${uid}-desc`}>Beschreibung</label>
          <textarea
            ref={descRef}
            id={`${uid}-desc`}
            className="tb-input"
            rows={4}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            onBlur={() => setTouched((t) => new Set(t).add("description"))}
            aria-invalid={Boolean(showError("description"))}
            aria-describedby={`${uid}-desc-hint${showError("description") ? ` ${uid}-desc-err` : ""}`}
          />
          <p id={`${uid}-desc-hint`} className="tb-hint">{values.description.trim().length} / 300 Zeichen</p>
          {showError("description") && (
            <p id={`${uid}-desc-err`} className="tb-error">{errors.description}</p>
          )}
        </div>

        <div className="tb-field-row">
          <div className="tb-field">
            <label htmlFor={`${uid}-status`}>Status</label>
            <select
              id={`${uid}-status`}
              className="tb-input"
              value={values.status}
              onChange={(e) => set("status", e.target.value as TaskStatus)}
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
          </div>
          <div className="tb-field">
            <label htmlFor={`${uid}-priority`}>Priorität</label>
            <select
              id={`${uid}-priority`}
              className="tb-input"
              value={values.priority}
              onChange={(e) => set("priority", e.target.value as TaskPriority)}
            >
              {PRIORITY_ORDER.map((p) => (
                <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="tb-dialog-actions">
          <button type="button" className="tb-btn" onClick={() => dialogRef.current?.close()}>
            Abbrechen
          </button>
          <button type="submit" className="tb-btn tb-btn-primary">
            {task ? "Änderungen speichern" : "Aufgabe anlegen"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
