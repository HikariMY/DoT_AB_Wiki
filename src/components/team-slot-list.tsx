"use client";

import { useTranslations } from "next-intl";

import { CrestBadge, ElementBadge } from "@/components/badges";
import { CharacterPortrait } from "@/components/character-portrait";
import { STANCES } from "@/lib/game";
import type { Character, Stance } from "@/lib/schema";

interface TeamSlotListProps {
  members: readonly Character[];
  onRemove: (slug: string) => void;
}

export function TeamSlotList({ members, onRemove }: TeamSlotListProps) {
  const t = useTranslations("team");

  return (
    <div className="flex flex-col gap-4">
      {STANCES.map((stance) => (
        <StanceColumn
          key={stance}
          stance={stance}
          members={members.filter((member) => member.stance === stance)}
          onRemove={onRemove}
          emptyLabel={t("emptyStance")}
          removeLabel={(name) => t("remove", { name })}
        />
      ))}
    </div>
  );
}

const STANCE_ACCENT: Record<Stance, string> = {
  Front: "border-l-amber-400/60",
  Back: "border-l-sky-400/60",
  Assist: "border-l-emerald-400/60",
};

interface StanceColumnProps {
  stance: Stance;
  members: readonly Character[];
  onRemove: (slug: string) => void;
  emptyLabel: string;
  removeLabel: (name: string) => string;
}

function StanceColumn({
  stance,
  members,
  onRemove,
  emptyLabel,
  removeLabel,
}: StanceColumnProps) {
  return (
    <section className={`border-l-2 pl-3 ${STANCE_ACCENT[stance]}`}>
      <h3 className="panel-heading mb-2">
        {stance}
        <span className="ml-2 text-abyss-400">{members.length}</span>
      </h3>
      {members.length === 0 ? (
        <p className="text-xs text-abyss-500">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {members.map((member) => (
            <li
              key={member.slug}
              className="panel flex items-center gap-3 p-2"
            >
              <CharacterPortrait
                name={member.name}
                element={member.element}
                rarity={member.rarity}
                icon={member.art.icon}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-abyss-100">{member.name}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <ElementBadge element={member.element} />
                  <CrestBadge crest={member.crest} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(member.slug)}
                aria-label={removeLabel(member.name)}
                className="rounded-md border border-abyss-600 px-2 py-1 text-xs text-abyss-300 transition-colors hover:border-red-500/50 hover:text-red-300"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
