import Link from "next/link";
import { siteConfig, getService } from "@/site.config";
import Photo from "@/components/Photo";

export const metadata = { title: "Referenzen" };

export default async function ReferencesPage({ searchParams }) {
  const sp = await searchParams;
  const active = typeof sp?.leistung === "string" && getService(sp.leistung) ? sp.leistung : null;
  const projects = active ? siteConfig.projects.filter((p) => p.service === active) : siteConfig.projects;

  return (
    <>
      <section className="page-head tiles">
        <div className="wrap">
          <h1>Referenzen</h1>
          <p>Bäder, die wir in Berlin saniert haben – vom schnellen Mietbad bis zur barrierearmen Komplettsanierung.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <nav className="filter-row" aria-label="Nach Leistung filtern">
            <Link href="/referenzen" className="chip" aria-current={!active ? "true" : undefined}>
              Alle
            </Link>
            {siteConfig.services.map((s) => (
              <Link
                key={s.slug}
                href={`/referenzen?leistung=${s.slug}`}
                className="chip"
                aria-current={active === s.slug ? "true" : undefined}
              >
                {s.name}
              </Link>
            ))}
          </nav>
          {siteConfig.demo.enabled && (
            <p className="notice" style={{ marginBottom: 28 }}>
              Beispielinhalte für den Prototyp – hier erscheinen später die echten Projekte des Betriebs.
            </p>
          )}
          {projects.length === 0 ? (
            <p className="empty">Zu dieser Leistung gibt es noch keine Referenzen.</p>
          ) : (
            <div className="projects">
              {projects.map((p) => (
                <article key={p.title} className="project">
                  <Photo src={p.image} alt={p.title} />
                  <h3>{p.title}</h3>
                  <p className="project-meta">
                    {getService(p.service)?.name} · {p.district} · {p.duration} · {p.year}
                  </p>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          )}
          <div className="panel" style={{ marginTop: "calc(var(--u) * 1.5)" }}>
            <h2>So ein Bad hätten Sie auch gern?</h2>
            <p className="sub">Eine Besichtigung ist kostenlos und unverbindlich. Danach erhalten Sie einen Festpreis.</p>
            <Link href={active ? `/termin?leistung=${active}` : "/termin"} className="btn">
              Termin buchen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
