import RootShell from "@/components/RootShell";
import { LANGS, isLang, langOrDefault } from "@/lib/i18n/config";
import { baseMetadata, languageAlternates, siteViewport } from "@/lib/metadata";

// Root layout of the public site: every public URL starts with /de, /en or /pl.
// Unknown languages are rejected one level down (in (site)/layout.jsx and the
// catch-all), not here: notFound() in a root layout has no not-found boundary
// above it and would render a blank page.

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { ...baseMetadata(lang), alternates: languageAlternates("/") };
}

export const viewport = siteViewport;

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  return <RootShell lang={langOrDefault(lang)}>{children}</RootShell>;
}
