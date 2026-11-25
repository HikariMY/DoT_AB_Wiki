import {
  CRESTS,
  ELEMENTS,
  PARTY_SIZE,
  RECOMMENDED_BACK,
  RECOMMENDED_FRONT,
  STANCES,
} from "@/lib/game";
import type {
  Affiliation,
  Character,
  Crest,
  Element,
  Stance,
} from "@/lib/schema";

export const TEAM_QUERY_KEY = "team";

/** Every issue the analyser can report, ordered by how much it costs a team. */
export type TeamNoticeCode =
  | "over-capacity"
  | "front-short"
  | "back-short"
  | "no-assist"
  | "crest-minority";

export type TeamNoticeSeverity = "error" | "warning" | "info";

export interface TeamNotice {
  code: TeamNoticeCode;
  severity: TeamNoticeSeverity;
  /** Values interpolated into the translated message. */
  values: Record<string, number | string>;
}

export interface TeamAnalysis {
  size: number;
  byStance: Record<Stance, number>;
  byCrest: Record<Crest, number>;
  byElement: Record<Element, number>;
  byAffiliation: Partial<Record<Affiliation, number>>;
  /** The crest most of the team holds, or null when the team is split evenly. */
  dominantCrest: Crest | null;
  notices: readonly TeamNotice[];
}

const SEVERITY_ORDER: Record<TeamNoticeSeverity, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

function emptyCount<K extends string>(keys: readonly K[]): Record<K, number> {
  return keys.reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {} as Record<K, number>,
  );
}

function tally<K extends string>(
  keys: readonly K[],
  members: readonly Character[],
  pick: (member: Character) => K,
): Record<K, number> {
  return members.reduce(
    (acc, member) => {
      const key = pick(member);
      return { ...acc, [key]: acc[key] + 1 };
    },
    emptyCount(keys),
  );
}

function dominantCrest(byCrest: Record<Crest, number>): Crest | null {
  if (byCrest.Passion === byCrest.Impact) {
    return null;
  }

  return byCrest.Passion > byCrest.Impact ? "Passion" : "Impact";
}

function buildNotices(
  members: readonly Character[],
  byStance: Record<Stance, number>,
  byCrest: Record<Crest, number>,
): readonly TeamNotice[] {
  const notices: TeamNotice[] = [];

  if (members.length > PARTY_SIZE) {
    notices.push({
      code: "over-capacity",
      severity: "error",
      values: { size: members.length, max: PARTY_SIZE },
    });
  }

  if (byStance.Front < RECOMMENDED_FRONT) {
    notices.push({
      code: "front-short",
      severity: "warning",
      values: { count: byStance.Front, recommended: RECOMMENDED_FRONT },
    });
  }

  if (byStance.Back < RECOMMENDED_BACK) {
    notices.push({
      code: "back-short",
      severity: "warning",
      values: { count: byStance.Back, recommended: RECOMMENDED_BACK },
    });
  }

  if (byStance.Assist === 0) {
    notices.push({ code: "no-assist", severity: "warning", values: {} });
  }

  const dominant = dominantCrest(byCrest);
  if (dominant !== null) {
    const minority = dominant === "Passion" ? "Impact" : "Passion";
    const minorityCount = byCrest[minority];

    if (minorityCount > 0) {
      notices.push({
        code: "crest-minority",
        severity: "info",
        values: { count: minorityCount, minority, dominant },
      });
    }
  }

  return notices.sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
}

export function analyseTeam(members: readonly Character[]): TeamAnalysis {
  const byStance = tally(STANCES, members, (member) => member.stance);
  const byCrest = tally(CRESTS, members, (member) => member.crest);
  const byElement = tally(ELEMENTS, members, (member) => member.element);

  const byAffiliation = members.reduce<Partial<Record<Affiliation, number>>>(
    (acc, member) => ({
      ...acc,
      [member.affiliation]: (acc[member.affiliation] ?? 0) + 1,
    }),
    {},
  );

  return {
    size: members.length,
    byStance,
    byCrest,
    byElement,
    byAffiliation,
    dominantCrest: dominantCrest(byCrest),
    notices: members.length === 0 ? [] : buildNotices(members, byStance, byCrest),
  };
}

/**
 * Reads a shared team out of a query string. Unknown slugs are dropped rather
 * than failing, so an old link still opens with whatever is still valid.
 */
export function parseTeamParam(
  value: string | null,
  roster: readonly Character[],
): readonly string[] {
  if (value === null || value.trim() === "") {
    return [];
  }

  const known = new Set(roster.map((character) => character.slug));
  const seen = new Set<string>();

  return value
    .split(",")
    .map((slug) => slug.trim())
    .filter((slug) => {
      if (!known.has(slug) || seen.has(slug)) {
        return false;
      }
      seen.add(slug);
      return true;
    })
    .slice(0, PARTY_SIZE);
}

export function serialiseTeam(slugs: readonly string[]): string {
  return slugs.join(",");
}

export function membersOf(
  slugs: readonly string[],
  roster: readonly Character[],
): readonly Character[] {
  return slugs
    .map((slug) => roster.find((character) => character.slug === slug))
    .filter((character): character is Character => character !== undefined);
}
