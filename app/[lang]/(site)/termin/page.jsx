import { siteConfig, getBookingType, getService } from "@/site.config";
import BookingWizard from "@/components/BookingWizard";
import { getDict } from "@/lib/i18n";
import { t } from "@/lib/i18n/t";
import { languageAlternates } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDict(lang)["meta.booking"], alternates: languageAlternates("/termin") };
}

export default async function BookingPage({ params, searchParams }) {
  const [{ lang }, sp] = await Promise.all([params, searchParams]);
  const service = typeof sp?.leistung === "string" && getService(sp.leistung) ? sp.leistung : "";
  const type = typeof sp?.art === "string" && getBookingType(sp.art) ? sp.art : "";
  const head = siteConfig.copy.bookingPage;

  return (
    <>
      <section className="page-head tiles">
        <div className="wrap">
          <h1>{t(head.title, lang)}</h1>
          <p>{t(head.intro, lang)}</p>
        </div>
      </section>
      <BookingWizard lang={lang} dict={getDict(lang)} initialService={service} initialType={service || type ? type : ""} />
    </>
  );
}
