"use client";

import { useTranslations } from "next-intl";

import { STANCES } from "@/lib/game";
import type { Character, RecommendedTeam } from "@/lib/schema";

interface TeamPresetsProps {
  presets: readonly RecommendedTeam[];
  roster: readonly Character[];
  activeSlugs: readonly string[];
  onLoad: (members: readonly string[]) => void;
}

export function TeamPresets({
  presets,
  roster,
  activeSlugs,
  onLoad,
}: TeamPresetsProps) {
  const t = useTranslations("team");
  const active = activeSlugs.join(",");
  const credits = [...new Set(presets.map((preset) => preset.credit))].join(", ");

  return (
    <section className="panel flex flex-col gap-3 p-4">
      <h2 className="panel-heading">{t("presetTitle")}</h2>

      <ul className="flex flex-col gap-2">
        {presets.map((preset) => {
          const members = preset.members
            .map((slug) => roster.find((character) => character.slug === slug))
            .filter((character): character is Character => character !== undefined);

          const split = STANCES.map(
            (stance) =>
              `${stance[0]}${members.filter((m) => m.stance === stance).length}`,
          ).join(" / ");

          return (
            <li
              key={preset.slug}
              className="rounded-md border border-abyss-700 bg-abyss-900 p-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm text-abyss-100">
                  {t(`presets.${preset.slug}`)}
                </h3>
                <span className="font-display text-xs text-abyss-400">{split}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-abyss-300">
                {members.map((member) => member.name).join(" · ")}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-abyss-200">
                {t(`presetNotes.${preset.slug}`)}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onLoad(preset.members)}
                  disabled={active === preset.members.join(",")}
                  className="rounded-md border border-gold-600/50 bg-gold-500/10 px-3 py-1 text-xs text-gold-400 transition-colors hover:bg-gold-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("presetLoad")}
                </button>
                <a
                  href={preset.source}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-abyss-400 underline-offset-4 hover:text-gold-400 hover:underline"
                >
                  {t("presetCredit", { credit: preset.credit })}
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-xs leading-relaxed text-abyss-500">
        {t("presetNote", { credit: credits })}
      </p>
    </section>
  );
}
