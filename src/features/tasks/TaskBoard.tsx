import { useId, useMemo, useReducer, useState } from "react";
import "./TaskBoard.css";
import { ChipGroup } from "./components/ChipGroup";
import { TaskCard } from "./components/TaskCard";
import { TaskDialog } from "./components/TaskDialog";
import { PRIORITY_LABEL, PRIORITY_ORDER, STATUS_LABEL, STATUS_ORDER } from "./constants";
import tasksData from "./data/tasks.json";
import { tasksReducer } from "./tasksReducer";
import type { Task, TaskDraft, TaskPriority, TaskStatus } from "./types";
import { useDebouncedValue } from "./useDebouncedValue";
import { fold, newId, tally, toggled } from "./utils";

/** Startdaten aus der lokalen JSON-Quelle (wird beim Build ins Bundle übernommen). */
const INITIAL_TASKS = tasksData as Task[];

export default function TaskBoard({ initialTasks = INITIAL_TASKS }: { initialTasks?: Task[] }) {
  const headingId = useId();
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReadonlySet<TaskStatus>>(new Set());
  const [priorityFilter, setPriorityFilter] = useState<ReadonlySet<TaskPriority>>(new Set());
  const [editing, setEditing] = useState<Task | "new" | null>(null);

  const debouncedQuery = useDebouncedValue(query, 200);

  const statusCounts = useMemo(() => tally(tasks, (t) => t.status, STATUS_ORDER), [tasks]);
  const priorityCounts = useMemo(() => tally(tasks, (t) => t.priority, PRIORITY_ORDER), [tasks]);

  const visible = useMemo(() => {
    const terms = fold(debouncedQuery).split(/\s+/).filter(Boolean);
    return tasks
      .filter((t) => statusFilter.size === 0 || statusFilter.has(t.status))
      .filter((t) => priorityFilter.size === 0 || priorityFilter.has(t.priority))
      .filter((t) => {
        if (terms.length === 0) return true;
        const haystack = fold(`${t.title} ${t.description}`);
        return terms.every((term) => haystack.includes(term));
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // neueste zuerst
  }, [tasks, debouncedQuery, statusFilter, priorityFilter]);

  const hasActiveFilters = query.trim() !== "" || statusFilter.size > 0 || priorityFilter.size > 0;

  const resetFilters = () => {
    setQuery("");
    setStatusFilter(new Set());
    setPriorityFilter(new Set());
  };

  const handleSubmit = (draft: TaskDraft) => {
    if (editing === "new") {
      dispatch({ type: "add", task: { id: newId(), createdAt: new Date().toISOString(), ...draft } });
    } else if (editing) {
      dispatch({ type: "update", id: editing.id, draft });
    }
    setEditing(null);
  };

  return (
    <section className="tb-root" aria-labelledby={headingId}>
      <header className="tb-header">
        <h2 id={headingId} className="tb-heading">Aufgaben</h2>
        <button type="button" className="tb-btn tb-btn-primary" onClick={() => setEditing("new")}>
          Neue Aufgabe
        </button>
      </header>

      <div className="tb-toolbar">
        <input
          type="search"
          className="tb-input tb-search"
          placeholder="Titel und Beschreibung durchsuchen"
          aria-label="Aufgaben durchsuchen"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="tb-groups">
          <ChipGroup
            label="Status"
            options={STATUS_ORDER}
            names={STATUS_LABEL}
            counts={statusCounts}
            selected={statusFilter}
            onToggle={(v) => setStatusFilter((s) => toggled(s, v))}
          />
          <ChipGroup
            label="Priorität"
            options={PRIORITY_ORDER}
            names={PRIORITY_LABEL}
            counts={priorityCounts}
            selected={priorityFilter}
            onToggle={(v) => setPriorityFilter((s) => toggled(s, v))}
          />
        </div>
      </div>

      <div className="tb-summary">
        <p className="tb-count" aria-live="polite">
          {visible.length} von {tasks.length} {tasks.length === 1 ? "Aufgabe" : "Aufgaben"}
        </p>
        {hasActiveFilters && (
          <button type="button" className="tb-text-btn" onClick={resetFilters}>
            Suche und Filter zurücksetzen
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="tb-empty">
          <p>Noch keine Aufgaben vorhanden.</p>
          <button type="button" className="tb-btn tb-btn-primary" onClick={() => setEditing("new")}>
            Erste Aufgabe anlegen
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="tb-empty">
          <p>Keine Aufgabe passt zu Suche und Filtern.</p>
          <button type="button" className="tb-btn" onClick={resetFilters}>
            Suche und Filter zurücksetzen
          </button>
        </div>
      ) : (
        <ul className="tb-grid">
          {visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => setEditing(task)}
              onDelete={() => dispatch({ type: "delete", id: task.id })}
              onCycle={() => dispatch({ type: "cycleStatus", id: task.id })}
            />
          ))}
        </ul>
      )}

      {editing !== null && (
        <TaskDialog
          key={editing === "new" ? "new" : editing.id}
          task={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}
