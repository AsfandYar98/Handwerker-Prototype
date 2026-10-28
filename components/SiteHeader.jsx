import Link from "next/link";
import BrandMark from "./BrandMark";
import MobileNav from "./MobileNav";

const links = [
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/referenzen", label: "Referenzen" },
  { href: "/#ablauf", label: "Ablauf" },
  { href: "/#kontakt", label: "Kontakt" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap">
        <BrandMark />
        <nav className="nav" aria-label="Hauptnavigation">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href="/termin" className="btn btn-small">
            Termin buchen
          </Link>
        </nav>
        <MobileNav links={links} />
      </div>
    </header>
  );
}
