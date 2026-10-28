import Link from "next/link";
import { siteConfig } from "@/site.config";
import Photo from "@/components/Photo";

export default function HomePage() {
  const c = siteConfig.company;
  const h = siteConfig.hero;
  return (
    <>
      {/* Hero: headline set on the tile grid, photo laid in as a panel */}
      <section className="hero tiles">
        <div className="hero-grid">
          <div>
            <h1 className="hero-title">{h.title}</h1>
            <p className="hero-lead">{h.lead}</p>
            <div className="hero-actions">
              <Link href="/termin" className="btn">
                Kostenlosen Termin buchen
              </Link>
              <a href={`tel:${c.phoneHref}`} className="hero-phone">
                {c.phone}
              </a>
            </div>
            <div className="hero-trust">
              {siteConfig.trustPoints.map((t) => (
                <div key={t.title}>
                  <strong>{t.title}</strong>
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel">
            <Photo src={h.image} alt={h.imageAlt} className="hero-photo" />
          </div>
        </div>
      </section>

      {/* Quick start: one tile per service, straight into the booking flow */}
      <section className="section quickstart-section" aria-labelledby="quickstart-title">
        <div className="wrap">
          <h2 id="quickstart-title">Was planen Sie?</h2>
          <ul className="quickstart plain-list">
            {siteConfig.services.map((s) => (
              <li key={s.slug}>
                <Link href={`/termin?leistung=${s.slug}`}>
                  <span>{s.name}</span>
                  <span aria-hidden="true">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="section" id="leistungen">
        <div className="wrap">
          <div className="section-head">
            <h2>Sanierung nach Maß – aus einer Hand</h2>
            <p>
              Ein erfahrenes Team übernimmt alle Arbeiten rund ums Bad. Wählen Sie, was zu Ihnen passt – oder lassen Sie sich
              beraten.
            </p>
          </div>
          <div className="services">
            {siteConfig.services.map((s) => (
              <Link key={s.slug} href={`/leistungen/${s.slug}`} className="service">
                <Photo src={s.image} alt="" />
                <div className="service-body">
                  <h3>{s.name}</h3>
                  <p>{s.short}</p>
                  <span className="more">Details und Termin</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About + advantages */}
      <section className="section about">
        <div className="wrap">
          <div className="section-head">
            <h2>Ihr Berliner Handwerks- und Sanitärbetrieb</h2>
            <p>
              Seit {c.since} sanieren wir Bäder in {c.serviceArea}. Seriös, transparent und fachgerecht – vom ersten Gespräch bis
              zur Endreinigung.
            </p>
          </div>
          <ul className="advantages plain-list">
            {siteConfig.advantages.map((a) => (
              <li key={a.title}>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process — a real sequence, so it is numbered */}
      <section className="section" id="ablauf">
        <div className="wrap">
          <div className="section-head">
            <h2>In drei Schritten zum fertigen Bad</h2>
            <p>Jedes Projekt läuft nach demselben festen Ablauf. Sie wissen immer, was als Nächstes passiert.</p>
          </div>
          <ol className="process plain-list">
            {siteConfig.process.map((p) => (
              <li key={p.title}>
                <Photo src={p.image} alt="" />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* References mosaic */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Bäder, die wir gebaut haben</h2>
            <p>Ein Auszug aus unseren Projekten in Berlin.</p>
          </div>
          <div className="mosaic">
            {siteConfig.projects.slice(0, 5).map((p) => (
              <Link key={p.title} href={`/referenzen?leistung=${p.service}`} className="mosaic-item">
                <Photo src={p.image} alt="" />
                <span className="mosaic-caption">
                  <strong>{p.title}</strong>
                  <span>
                    {p.district} · {p.duration}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 20 }}>
            <Link href="/referenzen" className="btn btn-ghost">
              Alle Referenzen ansehen
            </Link>
          </p>
        </div>
      </section>

      {/* Partners */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Markenqualität von unseren Partnern</h2>
            <p>Mit diesen Herstellern arbeiten wir zusammen. Welche zu Ihrem Bad passen, zeigen wir Ihnen in der Beratung.</p>
          </div>
          <ul className="partners plain-list">
            {siteConfig.partners.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>Häufige Fragen</h2>
          </div>
          <div className="faq">
            {siteConfig.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section tiles" id="kontakt">
        <div className="wrap contact-grid">
          <div className="panel">
            <h2>Lassen Sie uns Ihr Bad planen</h2>
            <p className="sub">
              Buchen Sie eine kostenlose Besichtigung bei Ihnen zu Hause oder eine 30-minütige Video-Beratung. Sie bekommen
              sofort eine Bestätigung per E-Mail.
            </p>
            <div className="actions">
              <Link href="/termin?art=besichtigung" className="btn">
                Besichtigung buchen
              </Link>
              <Link href="/termin?art=beratung" className="btn btn-ghost">
                Video-Beratung buchen
              </Link>
            </div>
          </div>
          <div className="contact-card">
            <h3 style={{ marginBottom: 16 }}>{c.legalName}</h3>
            <dl>
              <dt>Adresse</dt>
              <dd>
                {c.address.street}
                <br />
                {c.address.zip} {c.address.city}
              </dd>
              <dt>Telefon</dt>
              <dd>
                <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
              </dd>
              <dt>E-Mail</dt>
              <dd>
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </dd>
              <dt>Erreichbar</dt>
              <dd>{c.openingHours}</dd>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
