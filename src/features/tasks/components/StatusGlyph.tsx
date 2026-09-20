import type { TaskStatus } from "../types";

export function StatusGlyph({ status }: { status: TaskStatus }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill={status === "done" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" />
      {status === "in_progress" && <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />}
      {status === "done" && (
        <path
          d="M7.5 12.5l3 3 6-6.5"
          fill="none"
          stroke="var(--tb-surface)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
