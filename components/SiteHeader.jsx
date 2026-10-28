import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { withLang } from "@/lib/i18n/href";
import BrandMark from "./BrandMark";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNav from "./MobileNav";

export default function SiteHeader({ lang }) {
  const dict = getDict(lang);
  const links = [
    { href: withLang(lang, "/#leistungen"), label: dict["nav.services"] },
    { href: withLang(lang, "/referenzen"), label: dict["nav.references"] },
    { href: withLang(lang, "/#ablauf"), label: dict["nav.process"] },
    { href: withLang(lang, "/#kontakt"), label: dict["nav.contact"] },
  ];
  const book = { href: withLang(lang, "/termin"), label: dict["cta.book"] };
  return (
    <header className="site-header">
      <div className="wrap">
        <BrandMark lang={lang} />
        <nav className="nav" aria-label={dict["nav.main"]}>
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <LanguageSwitcher lang={lang} label={dict["lang.label"]} />
          <Link href={book.href} className="btn btn-small">
            {book.label}
          </Link>
        </nav>
        <MobileNav
          lang={lang}
          links={links}
          book={book}
          labels={{ menu: dict["nav.menu"], nav: dict["nav.mobile"], lang: dict["lang.label"] }}
        />
      </div>
    </header>
  );
}
