import { describe, expect, it } from "vitest";

import { characters } from "@/lib/characters";
import { recommendedTeams } from "@/lib/recommended-teams";
import { analyseTeam, membersOf } from "@/lib/team";
import { PARTY_SIZE } from "@/lib/game";

describe("recommended teams", () => {
  it("records the five published rosters", () => {
    expect(recommendedTeams).toHaveLength(5);
  });

  it("fills every slot of a full party", () => {
    for (const team of recommendedTeams) {
      expect(team.members).toHaveLength(PARTY_SIZE);
    }
  });

  it("resolves every member against the roster", () => {
    for (const team of recommendedTeams) {
      expect(membersOf(team.members, characters)).toHaveLength(team.members.length);
    }
  });

  it("credits a source for every team", () => {
    for (const team of recommendedTeams) {
      expect(team.credit).not.toBe("");
      expect(team.source).toMatch(/^https:\/\//);
    }
  });

  it("carries three assist units in every team, as the source rosters do", () => {
    for (const team of recommendedTeams) {
      const analysis = analyseTeam(membersOf(team.members, characters));

      expect(analysis.byStance.Assist).toBe(3);
    }
  });

  it("never reports over-capacity for a published roster", () => {
    for (const team of recommendedTeams) {
      const analysis = analyseTeam(membersOf(team.members, characters));
      const codes = analysis.notices.map((notice) => notice.code);

      expect(codes).not.toContain("over-capacity");
      expect(codes).not.toContain("no-assist");
    }
  });

  it("finds a healer in every published roster", () => {
    for (const team of recommendedTeams) {
      const analysis = analyseTeam(membersOf(team.members, characters));
      const codes = analysis.notices.map((notice) => notice.code);

      expect(codes).toContain("healer-element");
      expect(codes).not.toContain("no-healer");
    }
  });
});
