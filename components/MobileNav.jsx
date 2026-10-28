"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav({ links }) {
  const ref = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  const close = () => {
    if (ref.current) ref.current.open = false;
  };

  return (
    <details className="mobile-nav" ref={ref}>
      <summary>Menü</summary>
      <nav className="mobile-menu" aria-label="Hauptnavigation mobil">
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>
            {l.label}
          </Link>
        ))}
        <Link href="/termin" className="btn" onClick={close}>
          Termin buchen
        </Link>
      </nav>
    </details>
  );
}
