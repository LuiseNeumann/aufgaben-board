import { useEffect, useRef, useState } from "react";
import { PRIORITY_LABEL, STATUS_LABEL } from "../constants";
import { nextStatus } from "../tasksReducer";
import type { Task } from "../types";
import { formatDate } from "../utils";
import { StatusGlyph } from "./StatusGlyph";

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onCycle,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onCycle: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const next = nextStatus(task.status);

  useEffect(() => {
    if (confirming) cancelRef.current?.focus();
  }, [confirming]);

  return (
    <li className={`tb-card tb-prio-${task.priority}${task.status === "done" ? " is-done" : ""}`}>
      <button
        type="button"
        className="tb-status"
        data-status={task.status}
        onClick={onCycle}
        aria-label={`Status: ${STATUS_LABEL[task.status]}. Wechseln zu „${STATUS_LABEL[next]}“`}
        title={`Wechseln zu „${STATUS_LABEL[next]}“`}
      >
        <StatusGlyph status={task.status} />
      </button>

      <div className="tb-body">
        <h3 className="tb-title">{task.title}</h3>
        {task.description && <p className="tb-desc">{task.description}</p>}
        <div className="tb-meta">
          <span>{STATUS_LABEL[task.status]}</span>
          <span className="tb-prio-label">
            <span className="tb-dot" aria-hidden="true" />
            Priorität {PRIORITY_LABEL[task.priority].toLowerCase()}
          </span>
          <time dateTime={task.createdAt}>{formatDate(task.createdAt)}</time>
        </div>
      </div>

      <div
        className="tb-actions"
        onKeyDown={(e) => {
          if (e.key === "Escape") setConfirming(false);
        }}
      >
        {confirming ? (
          <>
            <span className="tb-confirm-text">Aufgabe löschen?</span>
            <button ref={cancelRef} type="button" className="tb-btn tb-btn-small" onClick={() => setConfirming(false)}>
              Abbrechen
            </button>
            <button type="button" className="tb-btn tb-btn-small tb-btn-danger" onClick={onDelete}>
              Löschen
            </button>
          </>
        ) : (
          <>
            <button type="button" className="tb-text-btn" onClick={onEdit}>
              Bearbeiten
            </button>
            <button type="button" className="tb-text-btn" onClick={() => setConfirming(true)}>
              Löschen
            </button>
          </>
        )}
      </div>
    </li>
  );
}
