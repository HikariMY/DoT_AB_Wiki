import { z } from "zod";

/**
 * Field names mirror the in-game terminology documented by the community
 * wikis, so a contributor can copy a value across without translating it.
 */
export const elementSchema = z.enum([
  "Fire",
  "Water",
  "Earth",
  "Light",
  "Dark",
  "Neutral",
]);

export const stanceSchema = z.enum(["Front", "Back", "Assist"]);

export const crestSchema = z.enum(["Passion", "Impact"]);

export const raritySchema = z.enum(["SSR", "SR", "R"]);

export const affiliationSchema = z.enum([
  "Perdion",
  "Eldorana",
  "Milesgard",
  "Coalition",
  "Lux Nova",
]);

export const weaponClassSchema = z.enum([
  "One-Handed Sword",
  "Greatsword",
  "Fists",
  "Bow",
  "Gun",
  "Staff",
  "Grimoire",
  "Pickaxe",
]);

export const equipmentClassSchema = z.enum([
  ...weaponClassSchema.options,
  "Armor",
  "Cloak",
  "Work Clothes",
  "Accessory",
]);

/**
 * How complete a record is. Pages surface this so a reader never mistakes a
 * roster stub for verified detail.
 */
export const dataStatusSchema = z.enum(["stub", "partial", "complete"]);

export const skillSchema = z.object({
  name: z.string().min(1),
  charge: z.number().int().positive().nullable(),
  effect: z.string().min(1),
  forceChainEffect: z.string().min(1).nullable().default(null),
});

export const passiveSchema = z.object({
  name: z.string().min(1),
  effect: z.string().min(1),
  awakenedEffect: z.string().min(1).nullable().default(null),
});

export const characterProfileSchema = z.object({
  title: z.string().min(1).nullable().default(null),
  likes: z.string().nullable().default(null),
  dislikes: z.string().nullable().default(null),
  birthday: z.string().nullable().default(null),
  releaseDate: z.string().nullable().default(null),
  howToRecruit: z.string().nullable().default(null),
});

/** Roster-level record: the one row every character is guaranteed to have. */
export const rosterEntrySchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase kebab-case"),
  name: z.string().min(1),
  /** Shared by a base unit and its alt versions. */
  characterId: z.string().regex(/^[a-z0-9-]+$/),
  rarity: raritySchema,
  element: elementSchema,
  stance: stanceSchema,
  crest: crestSchema,
  affiliation: affiliationSchema,
  weaponClass: weaponClassSchema.nullable().default(null),
  dataStatus: dataStatusSchema.default("stub"),
  source: z.string().min(1),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/** Detail record, stored per character and merged onto the roster entry. */
export const characterDetailSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  profile: characterProfileSchema,
  description: z.string().nullable().default(null),
  skills: z.array(skillSchema).default([]),
  passives: z.array(passiveSchema).default([]),
  bondPassive: passiveSchema.nullable().default(null),
  /** Non-combat tavern/brothel facility skill. Text only, no imagery. */
  facilitySkill: z.string().nullable().default(null),
  source: z.string().min(1),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const equipmentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  equipmentClass: equipmentClassSchema,
  crest: crestSchema.nullable().default(null),
  effect: z.string().min(1),
  /** "Effect activates only for 1 per party" clause on the source page. */
  partyUnique: z.boolean().default(false),
  eventOnly: z.boolean().default(false),
  source: z.string().min(1),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const manaCrystalSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  slot: stanceSchema,
  crest: crestSchema.nullable().default(null),
  cost: z.number().int().positive(),
  maxChain: z.number().int().positive(),
  forceChain: z.string().min(1),
  forceChainAdditionalEffect: z.string().min(1).nullable().default(null),
  autoCondition: z.string().min(1),
  source: z.string().min(1),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Element = z.infer<typeof elementSchema>;
export type Stance = z.infer<typeof stanceSchema>;
export type Crest = z.infer<typeof crestSchema>;
export type Rarity = z.infer<typeof raritySchema>;
export type Affiliation = z.infer<typeof affiliationSchema>;
export type WeaponClass = z.infer<typeof weaponClassSchema>;
export type EquipmentClass = z.infer<typeof equipmentClassSchema>;
export type DataStatus = z.infer<typeof dataStatusSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type Passive = z.infer<typeof passiveSchema>;
export type RosterEntry = z.infer<typeof rosterEntrySchema>;
export type CharacterDetail = z.infer<typeof characterDetailSchema>;
export type Equipment = z.infer<typeof equipmentSchema>;
export type ManaCrystal = z.infer<typeof manaCrystalSchema>;

export type Character = RosterEntry & {
  detail: CharacterDetail | null;
};
