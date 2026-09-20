import type { Task } from "./types";

export const newId = () =>
  globalThis.crypto?.randomUUID?.() ?? `t_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** Groß-/Kleinschreibung und Akzente ignorieren ("prasentation" findet "Präsentation"). */
export const fold = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const DATE_FMT = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
export const formatDate = (iso: string) => DATE_FMT.format(new Date(iso));

/** Gibt ein neues Set zurück, in dem `value` an- bzw. abgewählt ist. */
export function toggled<T>(set: ReadonlySet<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

/** Zählt Tasks pro Schlüssel (z. B. pro Status) – für die Zahlen an den Filter-Chips. */
export function tally<K extends string>(
  tasks: Task[],
  pick: (t: Task) => K,
  keys: readonly K[],
): Record<K, number> {
  const out = Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
  for (const t of tasks) out[pick(t)] += 1;
  return out;
}
