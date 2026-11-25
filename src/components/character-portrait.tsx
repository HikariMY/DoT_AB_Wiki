import { ELEMENT_COLOR_CLASS, RARITY_RING_CLASS } from "@/lib/game";
import type { Element, Rarity } from "@/lib/schema";

/**
 * Character art is copyrighted by the game developer and is not hosted here,
 * so the portrait slot renders a themed monogram tile instead.
 */
interface CharacterPortraitProps {
  name: string;
  element: Element;
  rarity: Rarity;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS = {
  sm: "size-10 text-base",
  md: "size-16 text-2xl",
  lg: "size-28 text-5xl",
} as const;

function monogram(name: string): string {
  const parts = name.split(" ");
  const last = parts[parts.length - 1] ?? name;
  return last.slice(0, 1).toUpperCase();
}

export function CharacterPortrait({
  name,
  element,
  rarity,
  size = "md",
}: CharacterPortraitProps) {
  return (
    <span
      aria-hidden
      className={`${SIZE_CLASS[size]} ${RARITY_RING_CLASS[rarity]} ${ELEMENT_COLOR_CLASS[element]} grid shrink-0 place-items-center rounded-lg bg-abyss-850 font-display ring-1 ring-inset`}
    >
      {monogram(name)}
    </span>
  );
}
