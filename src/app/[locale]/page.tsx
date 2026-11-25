import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { characters, countBy } from "@/lib/characters";
import {
  CREST_BONUS,
  MAX_CREST_STACKS,
  PARTY_SIZE,
  RECOMMENDED_BACK,
  RECOMMENDED_FRONT,
} from "@/lib/game";
import { ELEMENTS, RARITIES } from "@/lib/game";
import { ElementBadge, RarityBadge } from "@/components/badges";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const byRarity = countBy(characters, (character) => character.rarity);
  const byElement = countBy(characters, (character) => character.element);
  const withDetail = characters.filter((character) => character.detail !== null);

  return (
    <div className="flex flex-col gap-10">
      <section className="panel relative overflow-hidden p-6 sm:p-10">
        <p className="panel-heading">{t("heroEyebrow")}</p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-abyss-100 sm:text-4xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-abyss-200">
          {t("heroBody")}
        </p>
        <Link
          href="/characters"
          className="mt-6 inline-flex rounded-md border border-gold-600/60 bg-gold-500/10 px-4 py-2 text-sm font-medium text-gold-400 transition-colors hover:bg-gold-500/20"
        >
          {t("browseCharacters")}
        </Link>
      </section>

      <section>
        <h2 className="panel-heading mb-3">{t("statsTitle")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatPanel label={t("statCharacters")} value={characters.length} />
          {RARITIES.map((rarity) => (
            <StatPanel
              key={rarity}
              label={<RarityBadge rarity={rarity} />}
              value={byRarity[rarity] ?? 0}
            />
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ELEMENTS.map((element) => (
            <StatPanel
              key={element}
              label={<ElementBadge element={element} />}
              value={byElement[element] ?? 0}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-abyss-400">
          {t("statWithDetail")}: {withDetail.length} / {characters.length}
        </p>
      </section>

      <section>
        <h2 className="panel-heading mb-3">{t("systemsTitle")}</h2>
        <div className="grid gap-3 lg:grid-cols-2">
          <article className="panel p-5">
            <h3 className="font-display text-sm text-gold-400">{t("crestTitle")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-abyss-200">
              {t("crestBody", { max: MAX_CREST_STACKS })}
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <CrestPanel
                name="Passion"
                elements={t("crestPassionElements")}
                bonuses={CREST_BONUS.Passion}
                className="border-crest-passion/30 text-crest-passion"
              />
              <CrestPanel
                name="Impact"
                elements={t("crestImpactElements")}
                bonuses={CREST_BONUS.Impact}
                className="border-crest-impact/30 text-crest-impact"
              />
            </dl>
          </article>

          <article className="panel p-5">
            <h3 className="font-display text-sm text-gold-400">
              {t("forceChainTitle")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-abyss-200">
              {t("forceChainBody")}
            </p>
            <h3 className="mt-5 font-display text-sm text-gold-400">
              {t("partyTitle", { size: PARTY_SIZE })}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-abyss-200">
              {t("partyBody", {
                front: RECOMMENDED_FRONT,
                back: RECOMMENDED_BACK,
              })}
            </p>
          </article>

          <article className="panel p-5 lg:col-span-2">
            <h3 className="font-display text-sm text-gold-400">{t("elementTitle")}</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-abyss-200">
              {t("elementBody")}
            </p>
            <ul className="mt-4 flex flex-wrap gap-4 text-xs">
              <DamageSwatch className="text-dmg-normal" label={t("dmgNormal")} />
              <DamageSwatch className="text-dmg-advantage" label={t("dmgAdvantage")} />
              <DamageSwatch
                className="text-dmg-disadvantage"
                label={t("dmgDisadvantage")}
              />
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}

function StatPanel({
  label,
  value,
}: {
  label: React.ReactNode;
  value: number;
}) {
  return (
    <div className="panel flex items-center justify-between gap-2 p-3">
      <span className="text-xs text-abyss-300">{label}</span>
      <span className="font-display text-lg text-abyss-100">{value}</span>
    </div>
  );
}

function CrestPanel({
  name,
  elements,
  bonuses,
  className,
}: {
  name: string;
  elements: string;
  bonuses: readonly string[];
  className: string;
}) {
  return (
    <div className={`rounded-md border bg-abyss-850 p-3 ${className}`}>
      <dt className="font-display text-xs tracking-wide">{name}</dt>
      <dd className="mt-1 text-xs text-abyss-300">{elements}</dd>
      <dd className="mt-2 space-y-0.5 text-xs text-abyss-200">
        {bonuses.map((bonus) => (
          <p key={bonus}>{bonus}</p>
        ))}
      </dd>
    </div>
  );
}

function DamageSwatch({ className, label }: { className: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`font-display text-base ${className}`}>1234</span>
      <span className="text-abyss-300">{label}</span>
    </li>
  );
}
