"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileNav({ lang, links, book, labels }) {
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
      <summary>{labels.menu}</summary>
      <nav className="mobile-menu" aria-label={labels.nav}>
        <LanguageSwitcher lang={lang} label={labels.lang} onNavigate={close} />
        {links.map((l) => (
          <Link key={l.href} href={l.href} onClick={close}>
            {l.label}
          </Link>
        ))}
        <Link href={book.href} className="btn" onClick={close}>
          {book.label}
        </Link>
      </nav>
    </details>
  );
}
