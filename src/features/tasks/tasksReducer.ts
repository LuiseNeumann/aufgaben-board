import { STATUS_ORDER } from "./constants";
import type { Task, TaskDraft, TaskStatus } from "./types";

export type Action =
  | { type: "add"; task: Task }
  | { type: "update"; id: string; draft: TaskDraft }
  | { type: "delete"; id: string }
  | { type: "cycleStatus"; id: string };

export const nextStatus = (s: TaskStatus): TaskStatus =>
  STATUS_ORDER[(STATUS_ORDER.indexOf(s) + 1) % STATUS_ORDER.length];

export function tasksReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case "add":
      return [action.task, ...state];
    case "update":
      return state.map((t) => (t.id === action.id ? { ...t, ...action.draft } : t));
    case "delete":
      return state.filter((t) => t.id !== action.id);
    case "cycleStatus":
      return state.map((t) => (t.id === action.id ? { ...t, status: nextStatus(t.status) } : t));
  }
}
