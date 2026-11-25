import recommendedTeamData from "@/data/recommended-teams.json";
import { characters } from "@/lib/characters";
import { recommendedTeamSchema, type RecommendedTeam } from "@/lib/schema";

function parseRecommendedTeams(): readonly RecommendedTeam[] {
  const teams = recommendedTeamSchema.array().parse(recommendedTeamData);
  const known = new Set(characters.map((character) => character.slug));

  for (const team of teams) {
    const unknown = team.members.filter((slug) => !known.has(slug));
    if (unknown.length > 0) {
      throw new Error(
        `Recommended team ${team.slug} references unknown characters: ${unknown.join(", ")}`,
      );
    }

    if (new Set(team.members).size !== team.members.length) {
      throw new Error(`Recommended team ${team.slug} lists a character twice`);
    }
  }

  return teams;
}

/**
 * Parties published elsewhere, stored as rosters only. The label and any
 * explanation are written here and the source is credited in the UI.
 */
export const recommendedTeams: readonly RecommendedTeam[] = parseRecommendedTeams();
