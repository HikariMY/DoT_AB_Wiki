import { Link } from "@/i18n/navigation";
import { CharacterPortrait } from "@/components/character-portrait";
import { CrestBadge, ElementBadge, RarityBadge, StanceTag } from "@/components/badges";
import type { Character } from "@/lib/schema";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link
      href={`/characters/${character.slug}`}
      className="panel group flex flex-col gap-3 p-3 transition-colors hover:border-gold-600/60 hover:bg-abyss-700/60 focus-visible:border-gold-500 focus-visible:outline-none"
    >
      <div className="flex items-center gap-3">
        <CharacterPortrait
          name={character.name}
          element={character.element}
          rarity={character.rarity}
        />
        <div className="min-w-0">
          <p className="truncate font-medium text-abyss-100 group-hover:text-gold-400">
            {character.name}
          </p>
          <p className="truncate text-xs text-abyss-300">{character.affiliation}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <RarityBadge rarity={character.rarity} />
        <ElementBadge element={character.element} />
        <StanceTag stance={character.stance} />
        <CrestBadge crest={character.crest} />
      </div>
    </Link>
  );
}
