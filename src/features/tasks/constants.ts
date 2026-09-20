import type { TaskPriority, TaskStatus } from "./types";

export const STATUS_ORDER: readonly TaskStatus[] = ["open", "in_progress", "done"];
export const PRIORITY_ORDER: readonly TaskPriority[] = ["low", "medium", "high"];

export const STATUS_LABEL: Record<TaskStatus, string> = {
  open: "Offen",
  in_progress: "In Arbeit",
  done: "Erledigt",
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
};
