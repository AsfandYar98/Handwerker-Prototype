import Link from "next/link";
import { siteConfig } from "@/site.config";
import { getDict } from "@/lib/i18n";
import { fill } from "@/lib/i18n/format";
import { withLang } from "@/lib/i18n/href";
import { t } from "@/lib/i18n/t";

export default function BrandMark({ lang }) {
  const c = siteConfig.company;
  return (
    <Link href={withLang(lang, "/")} className="brand" aria-label={fill(getDict(lang)["brand.homeLabel"], { brand: c.brand })}>
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span>
        <strong>{c.brand}</strong>
        <small>
          {c.legalName} · {t(c.trade, lang)}
        </small>
      </span>
    </Link>
  );
}
