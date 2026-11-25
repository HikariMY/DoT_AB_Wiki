"use client";

interface FilterGroupProps<T extends string> {
  label: string;
  allLabel: string;
  options: readonly T[];
  value: T | null;
  onChange: (value: T | null) => void;
  optionClassName?: Record<T, string>;
}

export function FilterGroup<T extends string>({
  label,
  allLabel,
  options,
  value,
  onChange,
  optionClassName,
}: FilterGroupProps<T>) {
  return (
    <fieldset className="min-w-0">
      <legend className="panel-heading mb-1.5">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        <FilterChip
          isActive={value === null}
          onClick={() => onChange(null)}
          label={allLabel}
        />
        {options.map((option) => (
          <FilterChip
            key={option}
            isActive={value === option}
            onClick={() => onChange(value === option ? null : option)}
            label={option}
            activeClassName={optionClassName?.[option]}
          />
        ))}
      </div>
    </fieldset>
  );
}

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  activeClassName?: string;
}

function FilterChip({ label, isActive, onClick, activeClassName }: FilterChipProps) {
  const active = activeClassName ?? "text-gold-400";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`rounded-md border px-2 py-1 text-xs transition-colors ${
        isActive
          ? `border-gold-600/60 bg-gold-500/10 ${active}`
          : "border-abyss-600 bg-abyss-850 text-abyss-300 hover:border-abyss-500 hover:text-abyss-100"
      }`}
    >
      {label}
    </button>
  );
}
