import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getDict, isLang } from "@/lib/i18n";

export default async function SiteLayout({ children, params }) {
  const { lang } = await params;
  // /fr, /xx/termin … → the not-found page (app/[lang]/not-found.jsx catches it).
  if (!isLang(lang)) notFound();
  const dict = getDict(lang);
  return (
    <>
      <a href="#inhalt" className="visually-hidden">
        {dict["a11y.skipToContent"]}
      </a>
      <SiteHeader lang={lang} />
      <main id="inhalt">{children}</main>
      <SiteFooter lang={lang} />
    </>
  );
}
