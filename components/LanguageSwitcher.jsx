"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGS, LANG_COOKIE, LANG_NAMES } from "@/lib/i18n/config";
import { switchLang } from "@/lib/i18n/href";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** DE | EN | PL — the same page in another language; the choice is remembered for "/". */
export default function LanguageSwitcher({ lang, label, onNavigate }) {
  const pathname = usePathname() || `/${lang}`;

  function choose(next) {
    document.cookie = `${LANG_COOKIE}=${next}; max-age=${ONE_YEAR}; path=/; samesite=lax`;
    onNavigate?.();
  }

  return (
    <div className="lang-switch" role="group" aria-label={label}>
      {LANGS.map((l) => (
        <Link
          key={l}
          href={switchLang(pathname, l)}
          hrefLang={l}
          lang={l}
          title={LANG_NAMES[l]}
          aria-current={l === lang ? "true" : undefined}
          prefetch={false}
          onClick={() => choose(l)}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
