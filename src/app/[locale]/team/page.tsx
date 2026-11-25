import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TeamBuilder } from "@/components/team-builder";
import { characters } from "@/lib/characters";
import { PARTY_SIZE, RECOMMENDED_BACK, RECOMMENDED_FRONT } from "@/lib/game";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });

  return { title: t("title") };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl text-abyss-100">{t("title")}</h1>
        <p className="mt-1 text-sm text-abyss-300">
          {t("subtitle", {
            size: PARTY_SIZE,
            front: RECOMMENDED_FRONT,
            back: RECOMMENDED_BACK,
          })}
        </p>
      </header>
      {/* The shared team is read from the query string on the client. */}
      <Suspense fallback={null}>
        <TeamBuilder roster={characters} />
      </Suspense>
    </div>
  );
}
