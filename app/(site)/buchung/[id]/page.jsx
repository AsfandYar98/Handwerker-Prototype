import Link from "next/link";
import { siteConfig, getBookingType, getService } from "@/site.config";
import { getBooking } from "@/lib/store";
import { isValidBookingToken } from "@/lib/auth";
import { isPast, STATUS } from "@/lib/bookings";
import { formatDateLong } from "@/lib/time";
import CancelBooking from "@/components/CancelBooking";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ihre Buchung", robots: { index: false, follow: false } };

export default async function ManageBookingPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const token = typeof sp?.t === "string" ? sp.t : "";
  const valid = isValidBookingToken(id, token);
  const booking = valid ? await getBooking(id) : null;
  const c = siteConfig.company;

  if (!booking) {
    return (
      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="panel">
            <h2>Buchung nicht gefunden</h2>
            <p className="sub">
              Der Link ist unvollständig oder abgelaufen. Bitte nutzen Sie den Link aus Ihrer Bestätigungs-E-Mail oder rufen Sie uns an:{" "}
              <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
            </p>
            <Link href="/termin" className="btn">
              Neuen Termin buchen
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const type = getBookingType(booking.type);
  const service = getService(booking.service);
  const past = isPast(booking);
  const cancelled = booking.status === "cancelled";

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <div className="panel">
          <p style={{ marginBottom: 10 }}>
            <span className={`pill pill-${booking.status}`}>{STATUS[booking.status]}</span>
          </p>
          <h2>{type?.name || "Termin"}</h2>
          <dl className="kv">
            <dt>Buchungsnummer</dt>
            <dd>{booking.ref}</dd>
            <dt>Termin</dt>
            <dd>
              {booking.date ? `${formatDateLong(booking.date, siteConfig.locale)}, ${booking.time} Uhr` : "Siehe Calendly-Bestätigung"}
            </dd>
            <dt>Dauer</dt>
            <dd>{booking.durationMinutes} Minuten</dd>
            <dt>Leistung</dt>
            <dd>{service?.name || "Noch offen"}</dd>
            {booking.customer?.street && (
              <>
                <dt>Adresse</dt>
                <dd>
                  {booking.customer.street}, {booking.customer.zip} {booking.customer.city}
                </dd>
              </>
            )}
            {booking.meetingUrl && !cancelled && (
              <>
                <dt>Video-Link</dt>
                <dd>
                  <a href={booking.meetingUrl} target="_blank" rel="noopener">
                    {booking.meetingUrl}
                  </a>
                </dd>
              </>
            )}
          </dl>

          {booking.status === "requested" && (
            <p className="notice" style={{ marginBottom: 18 }}>
              Wir prüfen Ihren Wunschtermin und bestätigen ihn per E-Mail, meist innerhalb eines Werktags.
            </p>
          )}

          <div className="actions">
            {!cancelled && booking.meetingUrl && !past && (
              <a href={booking.meetingUrl} className="btn" target="_blank" rel="noopener">
                Zum Video-Gespräch
              </a>
            )}
            {!cancelled && (
              <a href={`/api/bookings/${booking.id}/ics?t=${token}`} className="btn btn-ghost">
                Zum Kalender hinzufügen
              </a>
            )}
          </div>

          {!cancelled && !past && booking.source === "website" && (
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>Termin passt nicht mehr?</h3>
              <p style={{ marginBottom: 14, color: "var(--muted)" }}>
                Sagen Sie ab und buchen Sie einfach einen neuen Termin. Wir bekommen automatisch Bescheid.
              </p>
              <CancelBooking id={booking.id} token={token} />
            </div>
          )}
          {!cancelled && booking.source === "calendly" && booking.calendly?.rescheduleUrl && (
            <p style={{ marginTop: 20 }}>
              <a href={booking.calendly.rescheduleUrl}>Termin verschieben</a> ·{" "}
              <a href={booking.calendly.cancelUrl}>Termin absagen</a>
            </p>
          )}
          {cancelled && (
            <p style={{ marginTop: 20 }}>
              <Link href="/termin" className="btn">
                Neuen Termin buchen
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
