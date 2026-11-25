"use client";

import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { CharacterCard } from "@/components/character-card";
import { FilterGroup } from "@/components/filter-group";
import {
  CrestBadge,
  DataStatusBadge,
  ElementBadge,
  RarityBadge,
  StanceTag,
} from "@/components/badges";
import {
  AFFILIATIONS,
  CRESTS,
  ELEMENTS,
  ELEMENT_COLOR_CLASS,
  RARITIES,
  RARITY_COLOR_CLASS,
  STANCES,
} from "@/lib/game";
import type {
  Affiliation,
  Character,
  Crest,
  Element,
  Rarity,
  Stance,
} from "@/lib/schema";

interface Filters {
  element: Element | null;
  stance: Stance | null;
  crest: Crest | null;
  rarity: Rarity | null;
  affiliation: Affiliation | null;
}

const EMPTY_FILTERS: Filters = {
  element: null,
  stance: null,
  crest: null,
  rarity: null,
  affiliation: null,
};

type ViewMode = "grid" | "table";

interface CharacterBrowserProps {
  characters: readonly Character[];
}

export function CharacterBrowser({ characters }: CharacterBrowserProps) {
  const t = useTranslations("characters");
  const tStatus = useTranslations("dataStatus");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("grid");

  const fuse = useMemo(
    () =>
      new Fuse(characters as Character[], {
        keys: ["name", "affiliation"],
        threshold: 0.35,
      }),
    [characters],
  );

  const results = useMemo(() => {
    const trimmed = query.trim();
    const searched =
      trimmed.length > 0
        ? fuse.search(trimmed).map((hit) => hit.item)
        : [...characters];

    return searched.filter(
      (character) =>
        (filters.element === null || character.element === filters.element) &&
        (filters.stance === null || character.stance === filters.stance) &&
        (filters.crest === null || character.crest === filters.crest) &&
        (filters.rarity === null || character.rarity === filters.rarity) &&
        (filters.affiliation === null ||
          character.affiliation === filters.affiliation),
    );
  }, [characters, filters, fuse, query]);

  const isFiltered =
    query.trim().length > 0 ||
    Object.values(filters).some((value) => value !== null);

  return (
    <div className="flex flex-col gap-6">
      <div className="panel flex flex-col gap-5 p-4">
        <div className="flex flex-wrap items-end gap-4">
          <label className="min-w-56 flex-1">
            <span className="panel-heading mb-1.5 block">{t("searchLabel")}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-md border border-abyss-600 bg-abyss-900 px-3 py-2 text-sm text-abyss-100 placeholder:text-abyss-400 focus:border-gold-600 focus:outline-none"
            />
          </label>
          <div className="flex gap-1.5" role="group">
            <ViewButton
              isActive={view === "grid"}
              onClick={() => setView("grid")}
              label={t("viewGrid")}
            />
            <ViewButton
              isActive={view === "table"}
              onClick={() => setView("table")}
              label={t("viewTable")}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FilterGroup
            label={t("filterElement")}
            allLabel={t("all")}
            options={ELEMENTS}
            value={filters.element}
            onChange={(element) => setFilters({ ...filters, element })}
            optionClassName={ELEMENT_COLOR_CLASS}
          />
          <FilterGroup
            label={t("filterStance")}
            allLabel={t("all")}
            options={STANCES}
            value={filters.stance}
            onChange={(stance) => setFilters({ ...filters, stance })}
          />
          <FilterGroup
            label={t("filterRarity")}
            allLabel={t("all")}
            options={RARITIES}
            value={filters.rarity}
            onChange={(rarity) => setFilters({ ...filters, rarity })}
            optionClassName={RARITY_COLOR_CLASS}
          />
          <FilterGroup
            label={t("filterCrest")}
            allLabel={t("all")}
            options={CRESTS}
            value={filters.crest}
            onChange={(crest) => setFilters({ ...filters, crest })}
          />
          <div className="sm:col-span-2">
            <FilterGroup
              label={t("filterAffiliation")}
              allLabel={t("all")}
              options={AFFILIATIONS}
              value={filters.affiliation}
              onChange={(affiliation) => setFilters({ ...filters, affiliation })}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-abyss-700 pt-3">
          <p className="text-sm text-abyss-300">
            {t("resultCount", { count: results.length, total: characters.length })}
          </p>
          {isFiltered ? (
            <button
              type="button"
              onClick={() => {
                setFilters(EMPTY_FILTERS);
                setQuery("");
              }}
              className="text-xs text-gold-400 underline-offset-4 hover:underline"
            >
              {t("clearFilters")}
            </button>
          ) : null}
        </div>
      </div>

      {results.length === 0 ? (
        <p className="panel p-8 text-center text-sm text-abyss-300">{t("empty")}</p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((character) => (
            <CharacterCard key={character.slug} character={character} />
          ))}
        </div>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-abyss-600 text-left">
                <Th>{t("columnName")}</Th>
                <Th>{t("columnRarity")}</Th>
                <Th>{t("columnElement")}</Th>
                <Th>{t("columnStance")}</Th>
                <Th>{t("columnCrest")}</Th>
                <Th>{t("columnAffiliation")}</Th>
                <Th>{t("columnData")}</Th>
              </tr>
            </thead>
            <tbody>
              {results.map((character) => (
                <tr
                  key={character.slug}
                  className="border-b border-abyss-700/60 last:border-0 hover:bg-abyss-700/40"
                >
                  <td className="px-3 py-2">
                    <Link
                      href={`/characters/${character.slug}`}
                      className="font-medium text-abyss-100 underline-offset-4 hover:text-gold-400 hover:underline"
                    >
                      {character.name}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <RarityBadge rarity={character.rarity} />
                  </td>
                  <td className="px-3 py-2">
                    <ElementBadge element={character.element} />
                  </td>
                  <td className="px-3 py-2">
                    <StanceTag stance={character.stance} />
                  </td>
                  <td className="px-3 py-2">
                    <CrestBadge crest={character.crest} />
                  </td>
                  <td className="px-3 py-2 text-abyss-300">{character.affiliation}</td>
                  <td className="px-3 py-2">
                    <DataStatusBadge
                      status={character.dataStatus}
                      label={tStatus(character.dataStatus)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="panel-heading px-3 py-2">{children}</th>;
}

interface ViewButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function ViewButton({ label, isActive, onClick }: ViewButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`rounded-md border px-3 py-2 text-xs transition-colors ${
        isActive
          ? "border-gold-600/60 bg-gold-500/10 text-gold-400"
          : "border-abyss-600 bg-abyss-850 text-abyss-300 hover:text-abyss-100"
      }`}
    >
      {label}
    </button>
  );
}
