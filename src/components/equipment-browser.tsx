"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { EquipmentCard } from "@/components/equipment-card";
import { FilterGroup } from "@/components/filter-group";
import { ManaCrystalCard } from "@/components/mana-crystal-card";
import { CRESTS } from "@/lib/game";
import { EQUIPMENT_CLASS_ORDER, EQUIPMENT_CLASS_STANCE } from "@/lib/equipment";
import type { Crest, Equipment, EquipmentClass, ManaCrystal } from "@/lib/schema";

type Tab = "gear" | "crystals";

interface EquipmentBrowserProps {
  equipment: readonly Equipment[];
  manaCrystals: readonly ManaCrystal[];
}

export function EquipmentBrowser({
  equipment,
  manaCrystals,
}: EquipmentBrowserProps) {
  const t = useTranslations("equipment");
  const [tab, setTab] = useState<Tab>("gear");
  const [equipmentClass, setEquipmentClass] = useState<EquipmentClass | null>(null);
  const [crest, setCrest] = useState<Crest | null>(null);
  const [partyUniqueOnly, setPartyUniqueOnly] = useState(false);

  const results = useMemo(
    () =>
      equipment.filter(
        (item) =>
          (equipmentClass === null || item.equipmentClass === equipmentClass) &&
          (crest === null || item.crest === crest) &&
          (!partyUniqueOnly || item.partyUnique),
      ),
    [crest, equipment, equipmentClass, partyUniqueOnly],
  );

  const isFiltered = equipmentClass !== null || crest !== null || partyUniqueOnly;

  const groups = EQUIPMENT_CLASS_ORDER.map((group) => ({
    equipmentClass: group,
    items: results.filter((item) => item.equipmentClass === group),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-1.5" role="group">
        <TabButton
          isActive={tab === "gear"}
          onClick={() => setTab("gear")}
          label={t("tabGear")}
        />
        <TabButton
          isActive={tab === "crystals"}
          onClick={() => setTab("crystals")}
          label={t("tabCrystals")}
        />
      </div>

      {tab === "gear" ? (
        <>
          <div className="panel flex flex-col gap-4 p-4">
            <FilterGroup
              label={t("filterClass")}
              allLabel={t("all")}
              options={EQUIPMENT_CLASS_ORDER}
              value={equipmentClass}
              onChange={setEquipmentClass}
            />
            <div className="flex flex-wrap items-end gap-6">
              <FilterGroup
                label={t("filterCrest")}
                allLabel={t("all")}
                options={CRESTS}
                value={crest}
                onChange={setCrest}
              />
              <label className="flex items-center gap-2 text-xs text-abyss-300">
                <input
                  type="checkbox"
                  checked={partyUniqueOnly}
                  onChange={(event) => setPartyUniqueOnly(event.target.checked)}
                  className="size-4 accent-gold-500"
                />
                {t("onlyPartyUnique")}
              </label>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-abyss-700 pt-3">
              <p className="text-sm text-abyss-300">
                {t("resultCount", { count: results.length, total: equipment.length })}
              </p>
              {isFiltered ? (
                <button
                  type="button"
                  onClick={() => {
                    setEquipmentClass(null);
                    setCrest(null);
                    setPartyUniqueOnly(false);
                  }}
                  className="text-xs text-gold-400 underline-offset-4 hover:underline"
                >
                  {t("clearFilters")}
                </button>
              ) : null}
            </div>
          </div>

          {groups.length === 0 ? (
            <p className="panel p-8 text-center text-sm text-abyss-300">{t("empty")}</p>
          ) : (
            groups.map((group) => (
              <section key={group.equipmentClass} className="flex flex-col gap-3">
                <h2 className="panel-heading">
                  {group.equipmentClass}
                  <span className="ml-2 text-abyss-400 normal-case">
                    {" · "}
                    {t("equippedBy")}:{" "}
                    {EQUIPMENT_CLASS_STANCE[group.equipmentClass] ?? t("anyStance")}
                  </span>
                </h2>
                <div className="grid gap-3 lg:grid-cols-2">
                  {group.items.map((item) => (
                    <EquipmentCard
                      key={item.slug}
                      item={item}
                      noCrestLabel={t("noCrest")}
                      partyUniqueLabel={t("partyUnique")}
                      eventLabel={t("eventOnly")}
                    />
                  ))}
                </div>
              </section>
            ))
          )}

          <p className="text-xs leading-relaxed text-abyss-400">
            {t("partyUniqueNote")} {t("noStats")}
          </p>
        </>
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {manaCrystals.map((crystal) => (
              <ManaCrystalCard
                key={crystal.slug}
                crystal={crystal}
                labels={{
                  cost: t("crystalCost"),
                  maxChain: t("crystalMaxChain"),
                  additional: t("crystalAdditional"),
                  auto: t("crystalAuto"),
                  noCrest: t("noCrest"),
                }}
              />
            ))}
          </div>
          <p className="text-xs leading-relaxed text-abyss-400">{t("crystalNote")}</p>
        </>
      )}
    </div>
  );
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`rounded-md border px-3 py-2 text-sm transition-colors ${
        isActive
          ? "border-gold-600/60 bg-gold-500/10 text-gold-400"
          : "border-abyss-600 bg-abyss-850 text-abyss-300 hover:text-abyss-100"
      }`}
    >
      {label}
    </button>
  );
}
