import { useTranslations } from "next-intl";

const SOURCES: readonly { label: string; href: string }[] = [
  { label: "Dot Abyss Wiki (Miraheze)", href: "https://dotabyss.miraheze.org/" },
  { label: "GameWith", href: "https://gamewith.jp/dotabyss/" },
  { label: "wikiru", href: "https://dotabyss.wikiru.jp/" },
];

export function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-16 border-t border-abyss-700 bg-abyss-950/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs leading-relaxed text-abyss-400">
        <p>{t("disclaimer")}</p>
        <p>{t("contentLicense")}</p>
        <p>{t("codeLicense")}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="panel-heading">{t("sources")}</span>
          {SOURCES.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-abyss-300 underline-offset-4 hover:text-gold-400 hover:underline"
            >
              {source.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
