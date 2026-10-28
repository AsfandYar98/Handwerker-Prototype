import Link from "next/link";
import { siteConfig } from "@/site.config";
import { getDict } from "@/lib/i18n";
import { fill } from "@/lib/i18n/format";
import { t } from "@/lib/i18n/t";

export default function SiteFooter({ lang }) {
  const c = siteConfig.company;
  const dict = getDict(lang);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <strong>{c.legalName}</strong>
          <br />
          {c.address.street}, {c.address.zip} {c.address.city}
          <br />
          {dict["footer.phone"]} <a href={`tel:${c.phoneHref}`}>{c.phone}</a> · <a href={`mailto:${c.email}`}>{c.email}</a>
        </div>
        <div>
          <strong>{dict["footer.availability"]}</strong>
          <br />
          {t(c.openingHours, lang)}
          <br />
          {fill(dict["footer.serviceArea"], { area: t(c.serviceArea, lang) })}
        </div>
        <div>
          <strong>{dict["footer.legal"]}</strong>
          <br />
          {c.legalLinks.map((l) => (
            <span key={l.href}>
              <a href={l.href} rel="noopener">
                {t(l.label, lang)}
              </a>
              <br />
            </span>
          ))}
          <Link href="/admin">{dict["footer.staffLogin"]}</Link>
        </div>
        {siteConfig.demo.enabled && <p className="footer-demo">{dict["footer.demo"]}</p>}
      </div>
    </footer>
  );
}
