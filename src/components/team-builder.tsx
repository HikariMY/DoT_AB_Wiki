"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { TeamAnalysisPanel } from "@/components/team-analysis";
import { TeamPicker } from "@/components/team-picker";
import { TeamPresets } from "@/components/team-presets";
import { TeamSlotList } from "@/components/team-slot-list";
import { PARTY_SIZE } from "@/lib/game";
import {
  TEAM_QUERY_KEY,
  analyseTeam,
  membersOf,
  parseTeamParam,
  serialiseTeam,
} from "@/lib/team";
import type { Character, RecommendedTeam } from "@/lib/schema";

interface TeamBuilderProps {
  roster: readonly Character[];
  presets: readonly RecommendedTeam[];
}

export function TeamBuilder({ roster, presets }: TeamBuilderProps) {
  const t = useTranslations("team");
  const searchParams = useSearchParams();
  const [team, setTeam] = useState<readonly string[]>(() =>
    parseTeamParam(searchParams.get(TEAM_QUERY_KEY), roster),
  );
  const [justCopied, setJustCopied] = useState(false);

  const members = useMemo(() => membersOf(team, roster), [roster, team]);
  const analysis = useMemo(() => analyseTeam(members), [members]);
  const isFull = team.length >= PARTY_SIZE;

  /**
   * The team lives in the URL so it can be shared, but history is replaced
   * rather than pushed: every pick should not become a back-button step.
   */
  const commit = useCallback((next: readonly string[]) => {
    setTeam(next);
    setJustCopied(false);

    const url = new URL(window.location.href);
    if (next.length === 0) {
      url.searchParams.delete(TEAM_QUERY_KEY);
    } else {
      url.searchParams.set(TEAM_QUERY_KEY, serialiseTeam(next));
    }
    window.history.replaceState(null, "", url);
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      if (team.includes(slug)) {
        commit(team.filter((member) => member !== slug));
        return;
      }

      if (team.length >= PARTY_SIZE) {
        return;
      }

      commit([...team, slug]);
    },
    [commit, team],
  );

  const share = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setJustCopied(true);
    } catch {
      // Clipboard access can be refused; the URL is visible in the address
      // bar either way, so there is nothing to recover from.
      setJustCopied(false);
    }
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-[22rem_1fr] lg:items-start">
      <div className="flex flex-col gap-5">
        <TeamPicker
          roster={roster}
          selected={team}
          isFull={isFull}
          onToggle={toggle}
        />
        <TeamPresets
          presets={presets}
          roster={roster}
          activeSlugs={team}
          onLoad={commit}
        />
      </div>

      <div className="flex flex-col gap-5">
        <div className="panel flex flex-col gap-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="panel-heading">
              {t("teamTitle")}
              <span className="ml-2 text-abyss-300 normal-case">
                {t("slotsUsed", { count: team.length, max: PARTY_SIZE })}
              </span>
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={share}
                disabled={team.length === 0}
                className="rounded-md border border-gold-600/50 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-400 transition-colors hover:bg-gold-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {justCopied ? t("shared") : t("share")}
              </button>
              <button
                type="button"
                onClick={() => commit([])}
                disabled={team.length === 0}
                className="rounded-md border border-abyss-600 px-3 py-1.5 text-xs text-abyss-300 transition-colors hover:text-abyss-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t("clear")}
              </button>
            </div>
          </div>

          {members.length === 0 ? (
            <p className="text-sm text-abyss-400">{t("emptyTeam")}</p>
          ) : (
            <TeamSlotList members={members} onRemove={toggle} />
          )}

          <p className="text-xs text-abyss-500">{t("shareHint")}</p>
        </div>

        {members.length > 0 ? <TeamAnalysisPanel analysis={analysis} /> : null}
      </div>
    </div>
  );
}
