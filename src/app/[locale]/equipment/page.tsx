import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EquipmentBrowser } from "@/components/equipment-browser";
import { equipment, manaCrystals } from "@/lib/equipment";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "equipment" });

  return { title: t("title") };
}

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("equipment");

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl text-abyss-100">{t("title")}</h1>
        <p className="mt-1 text-sm text-abyss-300">
          {t("subtitle", {
            gear: equipment.length,
            crystals: manaCrystals.length,
          })}
        </p>
      </header>
      <EquipmentBrowser equipment={equipment} manaCrystals={manaCrystals} />
    </div>
  );
}
