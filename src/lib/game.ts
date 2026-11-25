import type {
  Affiliation,
  Crest,
  Element,
  Rarity,
  Stance,
} from "@/lib/schema";

/**
 * Element to crest mapping. Documented by the game and true for the whole
 * roster, but stored explicitly per character so a future exception does not
 * silently produce wrong data.
 */
export const CREST_BY_ELEMENT: Record<Element, Crest> = {
  Fire: "Passion",
  Water: "Passion",
  Earth: "Passion",
  Light: "Impact",
  Dark: "Impact",
  Neutral: "Impact",
};

export const ELEMENTS: readonly Element[] = [
  "Fire",
  "Water",
  "Earth",
  "Light",
  "Dark",
  "Neutral",
];

export const STANCES: readonly Stance[] = ["Front", "Back", "Assist"];

export const CRESTS: readonly Crest[] = ["Passion", "Impact"];

export const RARITIES: readonly Rarity[] = ["SSR", "SR", "R"];

export const AFFILIATIONS: readonly Affiliation[] = [
  "Perdion",
  "Eldorana",
  "Milesgard",
  "Coalition",
  "Lux Nova",
];

/** Tailwind token names, so markup never hardcodes a hex value. */
export const ELEMENT_COLOR_CLASS: Record<Element, string> = {
  Fire: "text-element-fire",
  Water: "text-element-water",
  Earth: "text-element-earth",
  Light: "text-element-light",
  Dark: "text-element-dark",
  Neutral: "text-element-neutral",
};

export const ELEMENT_BORDER_CLASS: Record<Element, string> = {
  Fire: "border-element-fire/50",
  Water: "border-element-water/50",
  Earth: "border-element-earth/50",
  Light: "border-element-light/50",
  Dark: "border-element-dark/50",
  Neutral: "border-element-neutral/50",
};

export const ELEMENT_BG_CLASS: Record<Element, string> = {
  Fire: "bg-element-fire/15",
  Water: "bg-element-water/15",
  Earth: "bg-element-earth/15",
  Light: "bg-element-light/15",
  Dark: "bg-element-dark/15",
  Neutral: "bg-element-neutral/15",
};

export const CREST_COLOR_CLASS: Record<Crest, string> = {
  Passion: "text-crest-passion",
  Impact: "text-crest-impact",
};

export const RARITY_COLOR_CLASS: Record<Rarity, string> = {
  SSR: "text-rarity-ssr",
  SR: "text-rarity-sr",
  R: "text-rarity-r",
};

export const RARITY_RING_CLASS: Record<Rarity, string> = {
  SSR: "ring-rarity-ssr/60",
  SR: "ring-rarity-sr/50",
  R: "ring-rarity-r/40",
};

/** Per held crest, in percent. Documented on Character Basic Info. */
export const CREST_BONUS: Record<Crest, readonly string[]> = {
  Passion: ["Skill Charge Efficiency +1%", "Critical Rate +1%"],
  Impact: ["Skill Charge Efficiency +1%", "Attack +1%"],
};

export const MAX_CREST_STACKS = 20;

/** Field size, and the composition GameWith recommends as a baseline. */
export const PARTY_SIZE = 10;
export const RECOMMENDED_FRONT = 4;
export const RECOMMENDED_BACK = 3;

export const WEAPON_CLASS_BY_STANCE: Record<Stance, readonly string[]> = {
  Front: ["One-Handed Sword", "Greatsword", "Fists"],
  Back: ["Bow", "Staff", "Gun", "Grimoire"],
  Assist: ["Pickaxe"],
};
