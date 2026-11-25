import { describe, expect, it } from "vitest";

import {
  characterDetailSchema,
  equipmentSchema,
  rosterEntrySchema,
  skillSchema,
} from "@/lib/schema";

/** Only the fields every roster entry must carry. */
const requiredEntry = {
  slug: "anri",
  name: "Anri",
  characterId: "anri",
  rarity: "SSR",
  element: "Dark",
  stance: "Front",
  crest: "Impact",
  affiliation: "Perdion",
  source: "https://example.test/Anri",
  lastVerified: "2026-11-25",
};

const validEntry = {
  ...requiredEntry,
  weaponClass: "Fists",
  dataStatus: "partial",
};

describe("rosterEntrySchema", () => {
  it("accepts a well-formed roster entry", () => {
    const parsed = rosterEntrySchema.parse(validEntry);

    expect(parsed.name).toBe("Anri");
    expect(parsed.weaponClass).toBe("Fists");
  });

  it("defaults dataStatus to stub and weaponClass to null", () => {
    const parsed = rosterEntrySchema.parse(requiredEntry);

    expect(parsed.dataStatus).toBe("stub");
    expect(parsed.weaponClass).toBeNull();
  });

  it("rejects a slug that is not kebab-case", () => {
    expect(() => rosterEntrySchema.parse({ ...validEntry, slug: "Swimsuit Nina" })).toThrow();
  });

  it("rejects an element outside the game list", () => {
    expect(() => rosterEntrySchema.parse({ ...validEntry, element: "Anemo" })).toThrow();
  });

  it("rejects a lastVerified date that is not ISO", () => {
    expect(() => rosterEntrySchema.parse({ ...validEntry, lastVerified: "25/11/2026" })).toThrow();
  });
});

describe("skillSchema", () => {
  it("defaults forceChainEffect to null", () => {
    const parsed = skillSchema.parse({
      name: "Blood Chain",
      charge: 50,
      effect: "Deals damage to all enemies in the front area.",
    });

    expect(parsed.forceChainEffect).toBeNull();
  });

  it("rejects a non-positive charge", () => {
    expect(() =>
      skillSchema.parse({ name: "X", charge: 0, effect: "effect" }),
    ).toThrow();
  });
});

describe("characterDetailSchema", () => {
  it("defaults collections to empty", () => {
    const parsed = characterDetailSchema.parse({
      slug: "verisa",
      profile: {},
      source: "https://example.test/Verisa",
      lastVerified: "2026-11-25",
    });

    expect(parsed.skills).toEqual([]);
    expect(parsed.passives).toEqual([]);
    expect(parsed.bondPassive).toBeNull();
    expect(parsed.profile.birthday).toBeNull();
  });
});

describe("equipmentSchema", () => {
  it("allows a crest-agnostic piece", () => {
    const parsed = equipmentSchema.parse({
      slug: "forest-mantle",
      name: "Forest Mantle",
      equipmentClass: "Cloak",
      crest: null,
      effect: "On Force Chain, own Attack up for 15 seconds.",
      source: "https://example.test/Weapons",
      lastVerified: "2026-11-25",
    });

    expect(parsed.crest).toBeNull();
    expect(parsed.partyUnique).toBe(false);
    expect(parsed.eventOnly).toBe(false);
  });
});
