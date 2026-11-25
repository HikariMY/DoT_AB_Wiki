import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { CharacterBrowser } from "@/components/character-browser";
import { characters } from "@/lib/characters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "characters" });

  return { title: t("title") };
}

export default async function CharactersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("characters");

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl text-abyss-100">{t("title")}</h1>
        <p className="mt-1 text-sm text-abyss-300">
          {t("subtitle", { total: characters.length })}
        </p>
      </header>
      <CharacterBrowser characters={characters} />
    </div>
  );
}
