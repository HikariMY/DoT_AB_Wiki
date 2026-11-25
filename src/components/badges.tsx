import {
  CREST_COLOR_CLASS,
  ELEMENT_BG_CLASS,
  ELEMENT_BORDER_CLASS,
  ELEMENT_COLOR_CLASS,
  RARITY_COLOR_CLASS,
} from "@/lib/game";
import type { Crest, DataStatus, Element, Rarity, Stance } from "@/lib/schema";

const BADGE_BASE =
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap";

interface ElementBadgeProps {
  element: Element;
}

export function ElementBadge({ element }: ElementBadgeProps) {
  return (
    <span
      className={`${BADGE_BASE} ${ELEMENT_BORDER_CLASS[element]} ${ELEMENT_BG_CLASS[element]} ${ELEMENT_COLOR_CLASS[element]}`}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-current"
      />
      {element}
    </span>
  );
}

const STANCE_CLASS: Record<Stance, string> = {
  Front: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  Back: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  Assist: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
};

interface StanceTagProps {
  stance: Stance;
}

export function StanceTag({ stance }: StanceTagProps) {
  return <span className={`${BADGE_BASE} ${STANCE_CLASS[stance]}`}>{stance}</span>;
}

interface CrestBadgeProps {
  crest: Crest;
}

export function CrestBadge({ crest }: CrestBadgeProps) {
  return (
    <span
      className={`${BADGE_BASE} border-abyss-600 bg-abyss-850 ${CREST_COLOR_CLASS[crest]}`}
    >
      {crest}
    </span>
  );
}

interface RarityBadgeProps {
  rarity: Rarity;
}

export function RarityBadge({ rarity }: RarityBadgeProps) {
  return (
    <span
      className={`${BADGE_BASE} border-current/40 bg-abyss-850 font-display tracking-wider ${RARITY_COLOR_CLASS[rarity]}`}
    >
      {rarity}
    </span>
  );
}

const DATA_STATUS_CLASS: Record<DataStatus, string> = {
  stub: "border-abyss-500 bg-abyss-800 text-abyss-300",
  partial: "border-gold-600/50 bg-gold-500/10 text-gold-400",
  complete: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
};

interface DataStatusBadgeProps {
  status: DataStatus;
  label: string;
}

export function DataStatusBadge({ status, label }: DataStatusBadgeProps) {
  return <span className={`${BADGE_BASE} ${DATA_STATUS_CLASS[status]}`}>{label}</span>;
}
