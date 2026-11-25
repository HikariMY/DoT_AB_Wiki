import type { BaseStats } from "@/lib/schema";

interface StatTableProps {
  stats: BaseStats;
  labels: { hp: string; attack: string; defense: string };
}

export function StatTable({ stats, labels }: StatTableProps) {
  const rows = [
    { label: labels.hp, value: stats.hp, accent: "text-emerald-300" },
    { label: labels.attack, value: stats.attack, accent: "text-element-fire" },
    { label: labels.defense, value: stats.defense, accent: "text-element-water" },
  ];

  const max = Math.max(...rows.map((row) => row.value));

  return (
    <dl className="flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.label} className={`flex items-center gap-3 ${row.accent}`}>
          <dt className="w-24 shrink-0 text-xs text-abyss-400">{row.label}</dt>
          <dd className="flex flex-1 items-center gap-3">
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-abyss-800">
              <span
                className="block h-full rounded-full bg-current opacity-70"
                style={{ width: `${Math.round((row.value / max) * 100)}%` }}
              />
            </span>
            <span className="w-14 text-right font-display text-sm">
              {row.value}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
