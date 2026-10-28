import Link from "next/link";
import { siteConfig } from "@/site.config";

export default function BrandMark() {
  const c = siteConfig.company;
  return (
    <Link href="/" className="brand" aria-label={`${c.brand} – Startseite`}>
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </span>
      <span>
        <strong>{c.brand}</strong>
        <small>
          {c.legalName} · {c.trade}
        </small>
      </span>
    </Link>
  );
}
