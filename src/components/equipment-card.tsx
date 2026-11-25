import { CrestBadge } from "@/components/badges";
import type { Equipment } from "@/lib/schema";

interface EquipmentCardProps {
  item: Equipment;
  noCrestLabel: string;
  partyUniqueLabel: string;
  eventLabel: string;
}

export function EquipmentCard({
  item,
  noCrestLabel,
  partyUniqueLabel,
  eventLabel,
}: EquipmentCardProps) {
  return (
    <article className="panel flex flex-col gap-2 p-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-sm tracking-wide text-abyss-100">
          {item.name}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {item.crest !== null ? (
            <CrestBadge crest={item.crest} />
          ) : (
            <span className="inline-flex items-center rounded-md border border-abyss-600 bg-abyss-850 px-2 py-0.5 text-xs text-abyss-400">
              {noCrestLabel}
            </span>
          )}
          {item.eventOnly ? (
            <span className="inline-flex items-center rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
              {eventLabel}
            </span>
          ) : null}
          {item.partyUnique ? (
            <span className="inline-flex items-center rounded-md border border-gold-600/40 bg-gold-500/10 px-2 py-0.5 text-xs text-gold-400">
              {partyUniqueLabel}
            </span>
          ) : null}
        </div>
      </header>
      <p className="text-sm leading-relaxed text-abyss-200">{item.effect}</p>
    </article>
  );
}
