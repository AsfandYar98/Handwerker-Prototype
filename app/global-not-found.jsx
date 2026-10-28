import RootShell from "@/components/RootShell";
import NotFoundPanel from "@/components/NotFoundPanel";
import { siteConfig } from "@/site.config";
import { DEFAULT_LANG, getDict } from "@/lib/i18n";

// 404 for URLs outside every root layout, including unknown languages (/fr/…).
// The language is unknown here, so it is German.
export const metadata = { title: `${getDict(DEFAULT_LANG)["meta.notFound"]} – ${siteConfig.company.brand}` };

export default function GlobalNotFound() {
  return (
    <RootShell lang={DEFAULT_LANG}>
      <NotFoundPanel lang={DEFAULT_LANG} />
    </RootShell>
  );
}
