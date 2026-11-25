"use client";

import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const LOCALE_LABEL: Record<Locale, string> = {
  th: "ไทย",
  en: "EN",
};

interface LocaleSwitcherProps {
  label: string;
}

export function LocaleSwitcher({ label }: LocaleSwitcherProps) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1" role="group" aria-label={label}>
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => router.replace(pathname, { locale })}
          aria-current={locale === activeLocale ? "true" : undefined}
          className={`rounded-md px-2 py-1 text-xs transition-colors ${
            locale === activeLocale
              ? "bg-gold-500/15 text-gold-400"
              : "text-abyss-300 hover:text-abyss-100"
          }`}
        >
          {LOCALE_LABEL[locale]}
        </button>
      ))}
    </div>
  );
}
