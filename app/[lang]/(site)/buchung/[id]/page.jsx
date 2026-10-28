import Link from "next/link";
import { siteConfig, getBookingType, getService } from "@/site.config";
import { getBooking } from "@/lib/store";
import { isValidBookingToken } from "@/lib/auth";
import { isPast } from "@/lib/bookings";
import { getDict } from "@/lib/i18n";
import { formatDateTime, formatDuration } from "@/lib/i18n/format";
import { withLang } from "@/lib/i18n/href";
import { t } from "@/lib/i18n/t";
import { languageAlternates } from "@/lib/metadata";
import CancelBooking from "@/components/CancelBooking";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  return {
    title: getDict(lang)["meta.manage"],
    robots: { index: false, follow: false },
    alternates: languageAlternates(`/buchung/${id}`),
  };
}

export default async function ManageBookingPage({ params, searchParams }) {
  const [{ lang, id }, sp] = await Promise.all([params, searchParams]);
  const dict = getDict(lang);
  const token = typeof sp?.t === "string" ? sp.t : "";
  const valid = isValidBookingToken(id, token);
  const booking = valid ? await getBooking(id) : null;
  const c = siteConfig.company;
  const bookNew = withLang(lang, "/termin");

  if (!booking) {
    return (
      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="panel">
            <h2>{dict["manage.notFoundTitle"]}</h2>
            <p className="sub">
              {dict["manage.notFoundText"]} <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
            </p>
            <Link href={bookNew} className="btn">
              {dict["cta.bookNew"]}
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
            <span className={`pill pill-${booking.status}`}>{dict[`status.${booking.status}`]}</span>
          </p>
          <h2>{type ? t(type.name, lang) : dict["booking.fallbackType"]}</h2>
          <dl className="kv">
            <dt>{dict["booking.ref"]}</dt>
            <dd>{booking.ref}</dd>
            <dt>{dict["booking.when"]}</dt>
            <dd>{booking.date ? formatDateTime(dict, lang, booking.date, booking.time) : dict["booking.seeCalendly"]}</dd>
            <dt>{dict["booking.duration"]}</dt>
            <dd>{formatDuration(booking.durationMinutes, lang)}</dd>
            <dt>{dict["booking.service"]}</dt>
            <dd>{service ? t(service.name, lang) : dict["booking.serviceOpen"]}</dd>
            {booking.customer?.street && (
              <>
                <dt>{dict["booking.address"]}</dt>
                <dd>
                  {booking.customer.street}, {booking.customer.zip} {booking.customer.city}
                </dd>
              </>
            )}
            {booking.meetingUrl && !cancelled && (
              <>
                <dt>{dict["booking.videoLink"]}</dt>
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
              {dict["manage.pending"]}
            </p>
          )}

          <div className="actions">
            {!cancelled && booking.meetingUrl && !past && (
              <a href={booking.meetingUrl} className="btn" target="_blank" rel="noopener">
                {dict["booking.joinCall"]}
              </a>
            )}
            {!cancelled && (
              <a href={`/api/bookings/${booking.id}/ics?t=${token}`} className="btn btn-ghost">
                {dict["booking.addToCalendar"]}
              </a>
            )}
          </div>

          {!cancelled && !past && booking.source === "website" && (
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--line)" }}>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{dict["manage.changeTitle"]}</h3>
              <p style={{ marginBottom: 14, color: "var(--muted)" }}>{dict["manage.changeText"]}</p>
              <CancelBooking
                id={booking.id}
                token={token}
                lang={lang}
                labels={{
                  button: dict["cancel.button"],
                  confirm: dict["cancel.confirm"],
                  yes: dict["cancel.yes"],
                  keep: dict["cancel.keep"],
                  busy: dict["cancel.busy"],
                  failed: dict["cancel.failed"],
                }}
              />
            </div>
          )}
          {!cancelled && booking.source === "calendly" && booking.calendly?.rescheduleUrl && (
            <p style={{ marginTop: 20 }}>
              <a href={booking.calendly.rescheduleUrl}>{dict["manage.reschedule"]}</a> ·{" "}
              <a href={booking.calendly.cancelUrl}>{dict["cancel.button"]}</a>
            </p>
          )}
          {cancelled && (
            <p style={{ marginTop: 20 }}>
              <Link href={bookNew} className="btn">
                {dict["cta.bookNew"]}
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
