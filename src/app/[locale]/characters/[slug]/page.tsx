import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  CrestBadge,
  DataStatusBadge,
  ElementBadge,
  RarityBadge,
  StanceTag,
} from "@/components/badges";
import { CharacterPortrait } from "@/components/character-portrait";
import { PassiveCard, SkillCard } from "@/components/skill-card";
import { characters, getCharacter, getRelatedVersions } from "@/lib/characters";
import { CREST_BONUS } from "@/lib/game";

type PageParams = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    characters.map((character) => ({ locale, slug: character.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const character = getCharacter(slug);

  if (character === undefined) {
    return {};
  }

  return {
    title: character.name,
    description: `${character.rarity} / ${character.element} / ${character.stance} / ${character.affiliation}`,
  };
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const character = getCharacter(slug);
  if (character === undefined) {
    notFound();
  }

  const t = await getTranslations("character");
  const tStatus = await getTranslations("dataStatus");
  const detail = character.detail;
  const related = getRelatedVersions(character);

  return (
    <article className="flex flex-col gap-6">
      <Link
        href="/characters"
        className="text-xs text-abyss-300 underline-offset-4 hover:text-gold-400 hover:underline"
      >
        {t("backToList")}
      </Link>

      <header className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <CharacterPortrait
          name={character.name}
          element={character.element}
          rarity={character.rarity}
          size="lg"
        />
        <div className="min-w-0">
          {detail?.profile.title ? (
            <p className="panel-heading">{detail.profile.title}</p>
          ) : null}
          <h1 className="font-display text-2xl text-abyss-100">{character.name}</h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <RarityBadge rarity={character.rarity} />
            <ElementBadge element={character.element} />
            <StanceTag stance={character.stance} />
            <CrestBadge crest={character.crest} />
            <DataStatusBadge
              status={character.dataStatus}
              label={tStatus(character.dataStatus)}
            />
          </div>
          <p className="mt-3 text-xs text-abyss-400">
            {t("affiliation")}: {character.affiliation}
            {character.weaponClass !== null
              ? ` · ${t("weaponClass")}: ${character.weaponClass}`
              : ""}
          </p>
        </div>
      </header>

      {detail?.description ? (
        <p className="max-w-3xl text-sm leading-relaxed text-abyss-200">
          {detail.description}
        </p>
      ) : null}

      <section className="panel p-5">
        <h2 className="panel-heading">{character.crest}</h2>
        <ul className="mt-2 space-y-0.5 text-sm text-abyss-200">
          {CREST_BONUS[character.crest].map((bonus) => (
            <li key={bonus}>{bonus}</li>
          ))}
        </ul>
      </section>

      {detail === null ? (
        <section className="panel p-6">
          <h2 className="font-display text-sm text-gold-400">{t("noDetailTitle")}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-abyss-300">
            {t("noDetailBody")}
          </p>
        </section>
      ) : (
        <>
          {detail.skills.length > 0 ? (
            <section className="flex flex-col gap-3">
              <h2 className="panel-heading">{t("skills")}</h2>
              {detail.skills.map((skill) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  chargeLabel={t("charge")}
                  forceChainLabel={t("forceChainEffect")}
                />
              ))}
            </section>
          ) : null}

          {detail.passives.length > 0 ? (
            <section className="flex flex-col gap-3">
              <h2 className="panel-heading">{t("passives")}</h2>
              {detail.passives.map((passive) => (
                <PassiveCard
                  key={passive.name}
                  passive={passive}
                  awakenedLabel={t("awakenedEffect")}
                />
              ))}
              <p className="text-xs leading-relaxed text-abyss-400">
                {t("awakeningNote")}
              </p>
            </section>
          ) : null}

          {detail.bondPassive !== null ? (
            <section className="flex flex-col gap-3">
              <h2 className="panel-heading">{t("bondPassive")}</h2>
              <PassiveCard
                passive={detail.bondPassive}
                awakenedLabel={t("awakenedEffect")}
              />
            </section>
          ) : null}

          <section className="grid gap-3 lg:grid-cols-2">
            <div className="panel p-5">
              <h2 className="panel-heading">{t("profile")}</h2>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <ProfileRow label={t("likes")} value={detail.profile.likes} />
                <ProfileRow label={t("dislikes")} value={detail.profile.dislikes} />
                <ProfileRow label={t("birthday")} value={detail.profile.birthday} />
                <ProfileRow
                  label={t("releaseDate")}
                  value={detail.profile.releaseDate}
                />
                <ProfileRow
                  label={t("howToRecruit")}
                  value={detail.profile.howToRecruit}
                />
              </dl>
            </div>
            {detail.facilitySkill !== null ? (
              <div className="panel p-5">
                <h2 className="panel-heading">{t("facilitySkill")}</h2>
                <p className="mt-3 text-sm leading-relaxed text-abyss-200">
                  {detail.facilitySkill}
                </p>
              </div>
            ) : null}
          </section>
        </>
      )}

      {related.length > 0 ? (
        <section>
          <h2 className="panel-heading mb-2">{t("otherVersions")}</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((version) => (
              <Link
                key={version.slug}
                href={`/characters/${version.slug}`}
                className="panel px-3 py-2 text-sm text-abyss-200 transition-colors hover:border-gold-600/60 hover:text-gold-400"
              >
                {version.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <footer className="text-xs text-abyss-400">
        {tStatus("lastVerified", { date: character.lastVerified })} ·{" "}
        {tStatus("source")}:{" "}
        <a
          href={detail?.source ?? character.source}
          target="_blank"
          rel="noreferrer noopener"
          className="underline-offset-4 hover:text-gold-400 hover:underline"
        >
          {detail?.source ?? character.source}
        </a>
      </footer>
    </article>
  );
}

function ProfileRow({ label, value }: { label: string; value: string | null }) {
  if (value === null) {
    return null;
  }

  return (
    <>
      <dt className="text-abyss-400">{label}</dt>
      <dd className="text-abyss-100">{value}</dd>
    </>
  );
}
