"use client";

import { useTranslations } from "next-intl";

import { CrestBadge, ElementBadge, StanceTag } from "@/components/badges";
import { CRESTS, ELEMENTS, STANCES } from "@/lib/game";
import type { TeamAnalysis, TeamNotice } from "@/lib/team";

const NOTICE_MESSAGE_KEY = {
  "over-capacity": "noticeOverCapacity",
  "front-short": "noticeFrontShort",
  "back-short": "noticeBackShort",
  "no-assist": "noticeNoAssist",
  "crest-minority": "noticeCrestMinority",
} as const;

const NOTICE_CLASS = {
  error: "border-red-500/40 bg-red-500/10 text-red-200",
  warning: "border-gold-600/40 bg-gold-500/10 text-gold-300",
  info: "border-abyss-500 bg-abyss-850 text-abyss-200",
} as const;

interface TeamAnalysisPanelProps {
  analysis: TeamAnalysis;
}

export function TeamAnalysisPanel({ analysis }: TeamAnalysisPanelProps) {
  const t = useTranslations("team");

  return (
    <section className="panel flex flex-col gap-5 p-4">
      <h2 className="panel-heading">{t("analysisTitle")}</h2>

      <CountRow title={t("stanceTitle")}>
        {STANCES.map((stance) => (
          <Count
            key={stance}
            label={<StanceTag stance={stance} />}
            value={analysis.byStance[stance]}
          />
        ))}
      </CountRow>

      <CountRow title={t("crestTitle")}>
        {CRESTS.map((crest) => (
          <Count
            key={crest}
            label={<CrestBadge crest={crest} />}
            value={analysis.byCrest[crest]}
          />
        ))}
      </CountRow>

      <p className="text-xs text-abyss-300">
        {analysis.dominantCrest === null
          ? t("noDominantCrest")
          : t("dominantCrest", { crest: analysis.dominantCrest })}
      </p>

      <CountRow title={t("elementTitle")}>
        {ELEMENTS.filter((element) => analysis.byElement[element] > 0).map(
          (element) => (
            <Count
              key={element}
              label={<ElementBadge element={element} />}
              value={analysis.byElement[element]}
            />
          ),
        )}
      </CountRow>

      {Object.keys(analysis.byAffiliation).length > 0 ? (
        <CountRow title={t("affiliationTitle")}>
          {Object.entries(analysis.byAffiliation).map(([affiliation, count]) => (
            <Count
              key={affiliation}
              label={<span className="text-xs text-abyss-300">{affiliation}</span>}
              value={count}
            />
          ))}
        </CountRow>
      ) : null}

      {analysis.notices.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {analysis.notices.map((notice) => (
            <NoticeRow key={notice.code} notice={notice} />
          ))}
        </ul>
      ) : null}

      <div className="border-t border-abyss-700 pt-3">
        <h3 className="panel-heading">{t("limitsTitle")}</h3>
        <p className="mt-1 text-xs leading-relaxed text-abyss-400">{t("limitsBody")}</p>
      </div>
    </section>
  );
}

function NoticeRow({ notice }: { notice: TeamNotice }) {
  const t = useTranslations("team");

  return (
    <li
      className={`rounded-md border px-3 py-2 text-xs leading-relaxed ${NOTICE_CLASS[notice.severity]}`}
    >
      {t(NOTICE_MESSAGE_KEY[notice.code], notice.values)}
    </li>
  );
}

function CountRow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="panel-heading mb-1.5">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Count({ label, value }: { label: React.ReactNode; value: number }) {
  return (
    <span className="flex items-center gap-1.5 rounded-md border border-abyss-600 bg-abyss-900 px-2 py-1">
      {label}
      <span className="font-display text-sm text-abyss-100">{value}</span>
    </span>
  );
}
