"use client";

import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { CrestBadge, ElementBadge, RarityBadge } from "@/components/badges";
import { CharacterPortrait } from "@/components/character-portrait";
import { FilterGroup } from "@/components/filter-group";
import { ELEMENTS, ELEMENT_COLOR_CLASS, STANCES } from "@/lib/game";
import type { Character, Element, Stance } from "@/lib/schema";

interface TeamPickerProps {
  roster: readonly Character[];
  selected: readonly string[];
  isFull: boolean;
  onToggle: (slug: string) => void;
}

export function TeamPicker({
  roster,
  selected,
  isFull,
  onToggle,
}: TeamPickerProps) {
  const t = useTranslations("team");
  const [query, setQuery] = useState("");
  const [stance, setStance] = useState<Stance | null>(null);
  const [element, setElement] = useState<Element | null>(null);

  const fuse = useMemo(
    () => new Fuse(roster as Character[], { keys: ["name"], threshold: 0.35 }),
    [roster],
  );

  const results = useMemo(() => {
    const trimmed = query.trim();
    const searched =
      trimmed.length > 0 ? fuse.search(trimmed).map((hit) => hit.item) : [...roster];

    return searched.filter(
      (character) =>
        (stance === null || character.stance === stance) &&
        (element === null || character.element === element),
    );
  }, [element, fuse, query, roster, stance]);

  const chosen = new Set(selected);

  return (
    <div className="panel flex flex-col gap-4 p-4">
      <h2 className="panel-heading">{t("pickerTitle")}</h2>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchPlaceholder")}
        className="w-full rounded-md border border-abyss-600 bg-abyss-900 px-3 py-2 text-sm text-abyss-100 placeholder:text-abyss-400 focus:border-gold-600 focus:outline-none"
      />

      <FilterGroup
        label="Stance"
        allLabel="All"
        options={STANCES}
        value={stance}
        onChange={setStance}
      />
      <FilterGroup
        label="Element"
        allLabel="All"
        options={ELEMENTS}
        value={element}
        onChange={setElement}
        optionClassName={ELEMENT_COLOR_CLASS}
      />

      <ul className="flex max-h-150 flex-col gap-1.5 overflow-y-auto pr-1">
        {results.map((character) => {
          const isChosen = chosen.has(character.slug);
          const isDisabled = isFull && !isChosen;

          return (
            <li key={character.slug}>
              <button
                type="button"
                onClick={() => onToggle(character.slug)}
                disabled={isDisabled}
                aria-pressed={isChosen}
                aria-label={
                  isChosen
                    ? t("remove", { name: character.name })
                    : t("add", { name: character.name })
                }
                className={`flex w-full items-center gap-2.5 rounded-md border p-2 text-left transition-colors ${
                  isChosen
                    ? "border-gold-600/60 bg-gold-500/10"
                    : "border-abyss-700 bg-abyss-900 hover:border-abyss-500"
                } ${isDisabled ? "cursor-not-allowed opacity-40" : ""}`}
              >
                <CharacterPortrait
                  name={character.name}
                  element={character.element}
                  rarity={character.rarity}
                  icon={character.art.icon}
                  size="sm"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-abyss-100">
                    {character.name}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    <RarityBadge rarity={character.rarity} />
                    <ElementBadge element={character.element} />
                    <CrestBadge crest={character.crest} />
                  </span>
                </span>
                <span className="font-display text-xs text-abyss-400">
                  {character.stance}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {isFull ? <p className="text-xs text-gold-400">{t("full")}</p> : null}
    </div>
  );
}
