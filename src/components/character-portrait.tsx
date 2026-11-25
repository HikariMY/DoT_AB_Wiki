import Image from "next/image";

import { ELEMENT_COLOR_CLASS, RARITY_RING_CLASS } from "@/lib/game";
import type { Element, Rarity } from "@/lib/schema";

/**
 * Square character icon. Falls back to a themed monogram tile until artwork
 * exists at public/characters/icons/<slug>.webp.
 */
interface CharacterPortraitProps {
  name: string;
  element: Element;
  rarity: Rarity;
  icon?: string | null;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS = {
  sm: "size-10 text-base",
  md: "size-16 text-2xl",
  lg: "size-28 text-5xl",
} as const;

const SIZE_PX = {
  sm: 40,
  md: 64,
  lg: 112,
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
  icon = null,
  size = "md",
}: CharacterPortraitProps) {
  const frame = `${SIZE_CLASS[size]} ${RARITY_RING_CLASS[rarity]} grid shrink-0 place-items-center overflow-hidden rounded-lg bg-abyss-850 ring-1 ring-inset`;

  if (icon !== null) {
    return (
      <span className={frame}>
        <Image
          src={icon}
          alt={name}
          width={SIZE_PX[size]}
          height={SIZE_PX[size]}
          className="size-full object-cover"
        />
      </span>
    );
  }

  return (
    <span aria-hidden className={`${frame} ${ELEMENT_COLOR_CLASS[element]} font-display`}>
      {monogram(name)}
    </span>
  );
}

/**
 * Tall key art for a character page. Renders nothing when no artwork exists,
 * so the page stays tidy while the gallery is still being filled.
 */
interface CharacterKeyArtProps {
  name: string;
  rarity: Rarity;
  portrait: string | null;
}

export function CharacterKeyArt({ name, rarity, portrait }: CharacterKeyArtProps) {
  if (portrait === null) {
    return null;
  }

  return (
    <figure
      className={`${RARITY_RING_CLASS[rarity]} relative aspect-3/4 w-full overflow-hidden rounded-panel bg-abyss-850 ring-1 ring-inset`}
    >
      <Image
        src={portrait}
        alt={name}
        fill
        sizes="(min-width: 1024px) 24rem, 100vw"
        className="object-cover"
        priority
      />
    </figure>
  );
}
