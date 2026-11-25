import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tSite = useTranslations("site");

  return (
    <header className="sticky top-0 z-20 border-b border-abyss-700 bg-abyss-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-sm tracking-widest text-gold-500 group-hover:text-gold-400">
            DOT ABYSS
          </span>
          <span className="hidden text-xs text-abyss-400 sm:inline">
            {tSite("tagline")}
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <HeaderLink href="/">{t("home")}</HeaderLink>
          <HeaderLink href="/characters">{t("characters")}</HeaderLink>
          <HeaderLink href="/team">{t("team")}</HeaderLink>
          <HeaderLink href="/equipment">{t("equipment")}</HeaderLink>
        </nav>
        <LocaleSwitcher label={t("language")} />
      </div>
    </header>
  );
}

interface HeaderLinkProps {
  href: "/" | "/characters" | "/team" | "/equipment";
  children: React.ReactNode;
}

function HeaderLink({ href, children }: HeaderLinkProps) {
  return (
    <Link
      href={href}
      className="rounded-md px-2 py-1 text-abyss-200 transition-colors hover:bg-abyss-800 hover:text-gold-400"
    >
      {children}
    </Link>
  );
}
