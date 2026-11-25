import { describe, expect, it } from "vitest";

import {
  EQUIPMENT_CLASS_ORDER,
  equipment,
  groupEquipmentByClass,
  manaCrystals,
} from "@/lib/equipment";

describe("equipment data", () => {
  it("loads every item from the source page", () => {
    expect(equipment).toHaveLength(48);
  });

  it("matches the per-class counts on the source page", () => {
    const counts = equipment.reduce<Record<string, number>>(
      (acc, item) => ({
        ...acc,
        [item.equipmentClass]: (acc[item.equipmentClass] ?? 0) + 1,
      }),
      {},
    );

    expect(counts).toEqual({
      "One-Handed Sword": 3,
      Greatsword: 4,
      Fists: 3,
      Bow: 4,
      Gun: 3,
      Staff: 4,
      Grimoire: 4,
      Pickaxe: 9,
      Armor: 2,
      Cloak: 3,
      "Work Clothes": 2,
      Accessory: 7,
    });
  });

  it("uses a unique slug per item", () => {
    const slugs = new Set(equipment.map((item) => item.slug));

    expect(slugs.size).toBe(equipment.length);
  });

  it("marks the two crest-agnostic pieces as having no crest", () => {
    const withoutCrest = equipment
      .filter((item) => item.crest === null)
      .map((item) => item.name);

    expect(withoutCrest).toEqual(["Forest Mantle", "Monument of Comet"]);
  });

  it("lifts the party-unique clause out of the effect text into a flag", () => {
    const partyUnique = equipment.filter((item) => item.partyUnique);

    expect(partyUnique).toHaveLength(26);
    for (const item of equipment) {
      expect(item.effect).not.toContain("per party");
    }
  });

  it("strips the event marker from the name but keeps the flag", () => {
    const eventItems = equipment.filter((item) => item.eventOnly);

    expect(eventItems).toHaveLength(7);
    for (const item of eventItems) {
      expect(item.name).not.toContain("(Event)");
    }
  });
});

describe("groupEquipmentByClass", () => {
  it("returns groups in source-page order and drops empty ones", () => {
    const groups = groupEquipmentByClass(
      equipment.filter((item) => item.equipmentClass === "Pickaxe"),
    );

    expect(groups).toHaveLength(1);
    expect(groups[0]?.equipmentClass).toBe("Pickaxe");
    expect(groups[0]?.items).toHaveLength(9);
  });

  it("covers every class the data uses", () => {
    const used = new Set(equipment.map((item) => item.equipmentClass));

    for (const equipmentClass of used) {
      expect(EQUIPMENT_CLASS_ORDER).toContain(equipmentClass);
    }
  });
});

describe("mana crystal data", () => {
  it("loads all eleven crystals", () => {
    expect(manaCrystals).toHaveLength(11);
  });

  it("splits them across the three slots as the source page does", () => {
    const counts = manaCrystals.reduce<Record<string, number>>(
      (acc, crystal) => ({ ...acc, [crystal.slot]: (acc[crystal.slot] ?? 0) + 1 }),
      {},
    );

    expect(counts).toEqual({ Assist: 4, Front: 3, Back: 4 });
  });

  it("gives an additional Force Chain effect to exactly the crest-bound crystals", () => {
    for (const crystal of manaCrystals) {
      expect(crystal.forceChainAdditionalEffect === null).toBe(crystal.crest === null);
    }
  });

  it("keeps cost and chain length positive", () => {
    for (const crystal of manaCrystals) {
      expect(crystal.cost).toBeGreaterThan(0);
      expect(crystal.maxChain).toBeGreaterThan(1);
    }
  });
});
