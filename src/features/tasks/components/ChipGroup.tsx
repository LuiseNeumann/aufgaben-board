/** Filter-Chips mit Mehrfachauswahl (keine Auswahl = alles anzeigen). */
export function ChipGroup<T extends string>({
  label,
  options,
  names,
  counts,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly T[];
  names: Record<T, string>;
  counts: Record<T, number>;
  selected: ReadonlySet<T>;
  onToggle: (value: T) => void;
}) {
  return (
    <div className="tb-group" role="group" aria-label={label}>
      <span className="tb-group-label" aria-hidden="true">{label}</span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="tb-chip"
          aria-pressed={selected.has(option)}
          onClick={() => onToggle(option)}
        >
          {names[option]} <span className="tb-chip-count">{counts[option]}</span>
        </button>
      ))}
    </div>
  );
}
