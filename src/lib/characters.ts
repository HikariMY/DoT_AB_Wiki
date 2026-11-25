import rosterData from "@/data/roster.json";
import imageManifestData from "@/data/image-manifest.json";
import anriDetail from "@/data/details/anri.json";
import {
  characterDetailSchema,
  imageManifestSchema,
  rosterEntrySchema,
  type Character,
  type CharacterArt,
  type CharacterDetail,
  type RosterEntry,
} from "@/lib/schema";
import { CREST_BY_ELEMENT, WEAPON_CLASS_BY_STANCE } from "@/lib/game";

/**
 * Details are imported explicitly rather than globbed so that a malformed or
 * orphaned file fails the build instead of disappearing silently.
 */
const DETAIL_SOURCES: readonly unknown[] = [anriDetail];

function parseRoster(): readonly RosterEntry[] {
  const roster = rosterEntrySchema.array().parse(rosterData);

  const slugs = new Set<string>();
  for (const entry of roster) {
    if (slugs.has(entry.slug)) {
      throw new Error(`Duplicate character slug in roster: ${entry.slug}`);
    }
    slugs.add(entry.slug);

    const expectedCrest = CREST_BY_ELEMENT[entry.element];
    if (entry.crest !== expectedCrest) {
      throw new Error(
        `${entry.name}: element ${entry.element} implies crest ${expectedCrest}, got ${entry.crest}`,
      );
    }

    const allowedWeapons = WEAPON_CLASS_BY_STANCE[entry.stance];
    if (entry.weaponClass !== null && !allowedWeapons.includes(entry.weaponClass)) {
      throw new Error(
        `${entry.name}: stance ${entry.stance} cannot equip ${entry.weaponClass}`,
      );
    }
  }

  return roster;
}

function parseDetails(
  roster: readonly RosterEntry[],
): ReadonlyMap<string, CharacterDetail> {
  const slugs = new Set(roster.map((entry) => entry.slug));
  const details = new Map<string, CharacterDetail>();

  for (const source of DETAIL_SOURCES) {
    const detail = characterDetailSchema.parse(source);
    if (!slugs.has(detail.slug)) {
      throw new Error(`Detail file has no roster entry: ${detail.slug}`);
    }
    details.set(detail.slug, detail);
  }

  return details;
}

const roster = parseRoster();
const details = parseDetails(roster);
const images = imageManifestSchema.parse(imageManifestData);

function artFor(slug: string): CharacterArt {
  return {
    icon: images.icons[slug] ?? null,
    portrait: images.portraits[slug] ?? null,
  };
}

export const characters: readonly Character[] = roster.map((entry) => ({
  ...entry,
  detail: details.get(entry.slug) ?? null,
  art: artFor(entry.slug),
}));

export function getCharacter(slug: string): Character | undefined {
  return characters.find((character) => character.slug === slug);
}

/** Alt versions of the same unit, excluding the one asked about. */
export function getRelatedVersions(character: Character): readonly Character[] {
  return characters.filter(
    (other) =>
      other.characterId === character.characterId &&
      other.slug !== character.slug,
  );
}

export function countBy<K extends string>(
  items: readonly Character[],
  key: (character: Character) => K,
): Record<K, number> {
  return items.reduce(
    (acc, item) => {
      const group = key(item);
      return { ...acc, [group]: (acc[group] ?? 0) + 1 };
    },
    {} as Record<K, number>,
  );
}
