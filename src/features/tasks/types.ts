export type TaskStatus = "open" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string; // ISO 8601
}

/** Die vom Formular editierbaren Felder. */
export type TaskDraft = Pick<Task, "title" | "description" | "status" | "priority">;
