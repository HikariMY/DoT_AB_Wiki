import { describe, expect, it } from "vitest";

import { characters, getCharacter } from "@/lib/characters";
import {
  analyseTeam,
  membersOf,
  parseTeamParam,
  serialiseTeam,
} from "@/lib/team";
import type { Character } from "@/lib/schema";

function pick(...slugs: string[]): readonly Character[] {
  return slugs.map((slug) => {
    const character = getCharacter(slug);
    if (character === undefined) {
      throw new Error(`Test fixture missing character: ${slug}`);
    }
    return character;
  });
}

/** Front 4 / Back 3 / Assist 3, all Impact. */
const BALANCED_TEAM = [
  "anri",
  "chihiro",
  "eliza",
  "nina",
  "aeriel",
  "ashley",
  "christie",
  "emily",
  "pico",
  "swimsuit-hailey",
];

describe("analyseTeam", () => {
  it("reports nothing for an empty team", () => {
    const analysis = analyseTeam([]);

    expect(analysis.size).toBe(0);
    expect(analysis.notices).toEqual([]);
    expect(analysis.dominantCrest).toBeNull();
  });

  it("counts a full team by stance, crest and element", () => {
    const analysis = analyseTeam(pick(...BALANCED_TEAM));

    expect(analysis.size).toBe(10);
    expect(analysis.byStance).toEqual({ Front: 4, Back: 3, Assist: 3 });
    expect(analysis.byCrest).toEqual({ Passion: 0, Impact: 10 });
    expect(analysis.dominantCrest).toBe("Impact");
  });

  it("raises no stance warning for the recommended Front 4 / Back 3 shape", () => {
    const codes = analyseTeam(pick(...BALANCED_TEAM)).notices.map((n) => n.code);

    expect(codes).not.toContain("front-short");
    expect(codes).not.toContain("back-short");
    expect(codes).not.toContain("no-assist");
  });

  it("warns when the front line is below the recommended four", () => {
    const notice = analyseTeam(pick("anri", "aeriel", "ashley", "pico")).notices.find(
      (candidate) => candidate.code === "front-short",
    );

    expect(notice?.severity).toBe("warning");
    expect(notice?.values).toEqual({ count: 1, recommended: 4 });
  });

  it("warns when no assist unit is carried", () => {
    const codes = analyseTeam(pick("anri", "aeriel")).notices.map((n) => n.code);

    expect(codes).toContain("no-assist");
  });

  it("flags units holding the minority crest", () => {
    // Nine Impact units plus one Passion unit.
    const notice = analyseTeam(
      pick(...BALANCED_TEAM.slice(0, 9), "kureha"),
    ).notices.find((candidate) => candidate.code === "crest-minority");

    expect(notice?.severity).toBe("info");
    expect(notice?.values).toEqual({ count: 1, minority: "Passion", dominant: "Impact" });
  });

  it("reports no dominant crest for an evenly split team", () => {
    const analysis = analyseTeam(pick("anri", "kureha"));

    expect(analysis.dominantCrest).toBeNull();
    expect(analysis.notices.map((n) => n.code)).not.toContain("crest-minority");
  });

  it("errors when the party exceeds ten members", () => {
    const notice = analyseTeam(
      pick(...BALANCED_TEAM, "kureha"),
    ).notices.find((candidate) => candidate.code === "over-capacity");

    expect(notice?.severity).toBe("error");
    expect(notice?.values).toEqual({ size: 11, max: 10 });
  });

  it("puts the most severe notice first", () => {
    const severities = analyseTeam(pick(...BALANCED_TEAM, "kureha")).notices.map(
      (notice) => notice.severity,
    );

    expect(severities).toEqual([...severities].sort());
    expect(severities[0]).toBe("error");
  });
});

describe("parseTeamParam", () => {
  it("returns an empty team for a missing or blank parameter", () => {
    expect(parseTeamParam(null, characters)).toEqual([]);
    expect(parseTeamParam("   ", characters)).toEqual([]);
  });

  it("keeps known slugs in the order given", () => {
    expect(parseTeamParam("nina,anri", characters)).toEqual(["nina", "anri"]);
  });

  it("drops unknown slugs instead of failing", () => {
    expect(parseTeamParam("anri,not-a-character,nina", characters)).toEqual([
      "anri",
      "nina",
    ]);
  });

  it("drops duplicates", () => {
    expect(parseTeamParam("anri,anri,nina", characters)).toEqual(["anri", "nina"]);
  });

  it("caps the team at ten members", () => {
    const eleven = [...BALANCED_TEAM, "kureha"].join(",");

    expect(parseTeamParam(eleven, characters)).toHaveLength(10);
  });
});

describe("serialiseTeam and membersOf", () => {
  it("round-trips a team through the query string", () => {
    const slugs = ["anri", "nina", "pico"];
    const parsed = parseTeamParam(serialiseTeam(slugs), characters);

    expect(parsed).toEqual(slugs);
  });

  it("resolves slugs to characters and skips unknown ones", () => {
    const members = membersOf(["anri", "not-a-character"], characters);

    expect(members.map((member) => member.name)).toEqual(["Anri"]);
  });
});
