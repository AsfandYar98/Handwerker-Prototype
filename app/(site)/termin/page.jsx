import { getBookingType, getService } from "@/site.config";
import BookingWizard from "@/components/BookingWizard";

export const metadata = { title: "Termin buchen" };

export default async function BookingPage({ searchParams }) {
  const sp = await searchParams;
  const service = typeof sp?.leistung === "string" && getService(sp.leistung) ? sp.leistung : "";
  const type = typeof sp?.art === "string" && getBookingType(sp.art) ? sp.art : "";

  return (
    <>
      <section className="page-head tiles">
        <div className="wrap">
          <h1>Termin buchen</h1>
          <p>Kostenlose Besichtigung bei Ihnen zu Hause oder Video-Beratung – in wenigen Schritten, mit sofortiger Bestätigung.</p>
        </div>
      </section>
      <BookingWizard initialService={service} initialType={service || type ? type : ""} />
    </>
  );
}
