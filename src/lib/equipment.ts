import equipmentData from "@/data/equipment.json";
import manaCrystalData from "@/data/mana-crystals.json";
import {
  equipmentSchema,
  manaCrystalSchema,
  type Equipment,
  type EquipmentClass,
  type ManaCrystal,
} from "@/lib/schema";

function assertUniqueSlugs(items: readonly { slug: string }[], label: string): void {
  const slugs = new Set<string>();

  for (const item of items) {
    if (slugs.has(item.slug)) {
      throw new Error(`Duplicate ${label} slug: ${item.slug}`);
    }
    slugs.add(item.slug);
  }
}

function parseEquipment(): readonly Equipment[] {
  const parsed = equipmentSchema.array().parse(equipmentData);
  assertUniqueSlugs(parsed, "equipment");

  return parsed;
}

function parseManaCrystals(): readonly ManaCrystal[] {
  const parsed = manaCrystalSchema.array().parse(manaCrystalData);
  assertUniqueSlugs(parsed, "mana crystal");

  return parsed;
}

export const equipment: readonly Equipment[] = parseEquipment();
export const manaCrystals: readonly ManaCrystal[] = parseManaCrystals();

/**
 * Display order follows the source page: the eight weapon classes a character
 * can equip, then the gear slots.
 */
export const EQUIPMENT_CLASS_ORDER: readonly EquipmentClass[] = [
  "One-Handed Sword",
  "Greatsword",
  "Fists",
  "Bow",
  "Gun",
  "Staff",
  "Grimoire",
  "Pickaxe",
  "Armor",
  "Cloak",
  "Work Clothes",
  "Accessory",
];

/** Which stance can equip a class. Gear slots are open to everyone. */
export const EQUIPMENT_CLASS_STANCE: Partial<Record<EquipmentClass, string>> = {
  "One-Handed Sword": "Front",
  Greatsword: "Front",
  Fists: "Front",
  Bow: "Back",
  Gun: "Back",
  Staff: "Back",
  Grimoire: "Back",
  Pickaxe: "Assist",
};

export function groupEquipmentByClass(
  items: readonly Equipment[],
): readonly { equipmentClass: EquipmentClass; items: readonly Equipment[] }[] {
  return EQUIPMENT_CLASS_ORDER.map((equipmentClass) => ({
    equipmentClass,
    items: items.filter((item) => item.equipmentClass === equipmentClass),
  })).filter((group) => group.items.length > 0);
}
