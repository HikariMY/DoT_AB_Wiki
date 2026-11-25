import { describe, expect, it } from "vitest";

import { characters, countBy, getCharacter, getRelatedVersions } from "@/lib/characters";
import { CREST_BY_ELEMENT } from "@/lib/game";

describe("roster data", () => {
  it("loads the full roster", () => {
    expect(characters).toHaveLength(86);
  });

  it("has the documented rarity distribution", () => {
    const byRarity = countBy(characters, (character) => character.rarity);

    expect(byRarity).toEqual({ SSR: 53, SR: 17, R: 16 });
  });

  it("uses a unique slug per character", () => {
    const slugs = new Set(characters.map((character) => character.slug));

    expect(slugs.size).toBe(characters.length);
  });

  it("keeps crest consistent with element for every character", () => {
    const mismatched = characters.filter(
      (character) => character.crest !== CREST_BY_ELEMENT[character.element],
    );

    expect(mismatched).toEqual([]);
  });
});

describe("getCharacter", () => {
  it("finds a character by slug", () => {
    expect(getCharacter("anri")?.name).toBe("Anri");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCharacter("not-a-character")).toBeUndefined();
  });
});

describe("character detail merge", () => {
  it("attaches detail to the character that has a detail file", () => {
    const anri = getCharacter("anri");

    expect(anri?.detail?.skills).toHaveLength(1);
    expect(anri?.detail?.passives).toHaveLength(3);
    expect(anri?.detail?.skills[0]?.forceChainEffect).toContain("200%");
  });

  it("leaves detail null for a roster-only character", () => {
    expect(getCharacter("betty")?.detail).toBeNull();
  });
});

describe("getRelatedVersions", () => {
  it("links an alt version to its base unit", () => {
    const swimsuitNina = getCharacter("swimsuit-nina");
    const related = getRelatedVersions(swimsuitNina!);

    expect(related.map((character) => character.slug)).toEqual(["nina"]);
  });

  it("returns nothing for a character with no alt version", () => {
    expect(getRelatedVersions(getCharacter("anri")!)).toEqual([]);
  });

  it("records differing attributes between a base unit and its alt", () => {
    expect(getCharacter("nina")?.element).toBe("Light");
    expect(getCharacter("swimsuit-nina")?.element).toBe("Neutral");
  });
});

describe("artwork resolution", () => {
  it("gives every character an art slot", () => {
    const missingArt = characters.filter((character) => character.art === undefined);

    expect(missingArt).toEqual([]);
  });

  it("resolves to null when no file exists for the slug", () => {
    const anri = getCharacter("anri");

    // Artwork is dropped into public/characters by hand; until then the UI
    // falls back to a monogram tile.
    expect(anri?.art.icon === null || anri?.art.icon?.startsWith("/characters/")).toBe(
      true,
    );
    expect(
      anri?.art.portrait === null || anri?.art.portrait?.startsWith("/characters/"),
    ).toBe(true);
  });
});

describe("gear and stat data", () => {
  it("records a weapon class for every character except the disputed one", () => {
    const missing = characters
      .filter((character) => character.weaponClass === null)
      .map((character) => character.slug);

    expect(missing).toEqual(["kururu"]);
  });

  it("explains why the disputed character has no weapon class", () => {
    expect(getCharacter("kururu")?.dataConflict).toContain("Front-only weapon");
  });

  it("keeps every weapon class within what the stance can equip", () => {
    const allowed: Record<string, readonly string[]> = {
      Front: ["One-Handed Sword", "Greatsword", "Fists"],
      Back: ["Bow", "Staff", "Gun", "Grimoire"],
      Assist: ["Pickaxe"],
    };

    const mismatched = characters.filter(
      (character) =>
        character.weaponClass !== null &&
        !allowed[character.stance]?.includes(character.weaponClass),
    );

    expect(mismatched).toEqual([]);
  });

  it("records base stats and armor type for the whole roster", () => {
    expect(characters.filter((c) => c.baseStats === null)).toEqual([]);
    expect(characters.filter((c) => c.armorType === null)).toEqual([]);
  });

  it("keeps stats positive and credits where they came from", () => {
    for (const character of characters) {
      expect(character.baseStats?.hp).toBeGreaterThan(0);
      expect(character.baseStats?.attack).toBeGreaterThan(0);
      expect(character.baseStats?.defense).toBeGreaterThan(0);
      expect(character.statsSource).toContain("wikiru");
    }
  });
});
