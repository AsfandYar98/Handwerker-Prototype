import Link from "next/link";
import { siteConfig } from "@/site.config";

export default function SiteFooter() {
  const c = siteConfig.company;
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <strong>{c.legalName}</strong>
          <br />
          {c.address.street}, {c.address.zip} {c.address.city}
          <br />
          Tel. <a href={`tel:${c.phoneHref}`}>{c.phone}</a> · <a href={`mailto:${c.email}`}>{c.email}</a>
        </div>
        <div>
          <strong>Erreichbarkeit</strong>
          <br />
          {c.openingHours}
          <br />
          Einsatzgebiet: {c.serviceArea}
        </div>
        <div>
          <strong>Rechtliches</strong>
          <br />
          {c.legalLinks.map((l) => (
            <span key={l.href}>
              <a href={l.href} rel="noopener">
                {l.label}
              </a>
              <br />
            </span>
          ))}
          <Link href="/admin">Login für Mitarbeiter</Link>
        </div>
      </div>
    </footer>
  );
}
