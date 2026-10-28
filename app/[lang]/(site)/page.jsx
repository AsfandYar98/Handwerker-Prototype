import Link from "next/link";
import { siteConfig } from "@/site.config";
import Photo from "@/components/Photo";
import { getDict } from "@/lib/i18n";
import { fill } from "@/lib/i18n/format";
import { withLang } from "@/lib/i18n/href";
import { t } from "@/lib/i18n/t";

export default async function HomePage({ params }) {
  const { lang } = await params;
  const dict = getDict(lang);
  const c = siteConfig.company;
  const h = siteConfig.hero;
  const copy = siteConfig.copy;
  const tx = (value) => t(value, lang);
  return (
    <>
      {/* Hero: headline set on the tile grid, photo laid in as a panel */}
      <section className="hero tiles">
        <div className="hero-grid">
          <div>
            <h1 className="hero-title">{tx(h.title)}</h1>
            <p className="hero-lead">{tx(h.lead)}</p>
            <div className="hero-actions">
              <Link href={withLang(lang, "/termin")} className="btn">
                {dict["cta.bookFree"]}
              </Link>
              <a href={`tel:${c.phoneHref}`} className="hero-phone">
                {c.phone}
              </a>
            </div>
            <div className="hero-trust">
              {siteConfig.trustPoints.map((p) => (
                <div key={tx(p.title)}>
                  <strong>{tx(p.title)}</strong>
                  <span>{tx(p.text)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel">
            <Photo src={h.image} alt={tx(h.imageAlt)} className="hero-photo" />
          </div>
        </div>
      </section>

      {/* Quick start: one tile per service, straight into the booking flow */}
      <section className="section quickstart-section" aria-labelledby="quickstart-title">
        <div className="wrap">
          <h2 id="quickstart-title">{tx(copy.quickstart.title)}</h2>
          <ul className="quickstart plain-list">
            {siteConfig.services.map((s) => (
              <li key={s.slug}>
                <Link href={withLang(lang, `/termin?leistung=${s.slug}`)}>
                  <span>{tx(s.name)}</span>
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
            <h2>{tx(copy.services.title)}</h2>
            <p>{tx(copy.services.intro)}</p>
          </div>
          <div className="services">
            {siteConfig.services.map((s) => (
              <Link key={s.slug} href={withLang(lang, `/leistungen/${s.slug}`)} className="service">
                <Photo src={s.image} alt="" />
                <div className="service-body">
                  <h3>{tx(s.name)}</h3>
                  <p>{tx(s.short)}</p>
                  <span className="more">{dict["home.serviceMore"]}</span>
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
            <h2>{tx(copy.about.title)}</h2>
            <p>{fill(tx(copy.about.intro), { since: c.since })}</p>
          </div>
          <ul className="advantages plain-list">
            {siteConfig.advantages.map((a) => (
              <li key={tx(a.title)}>
                <h3>{tx(a.title)}</h3>
                <p>{tx(a.text)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process — a real sequence, so it is numbered */}
      <section className="section" id="ablauf">
        <div className="wrap">
          <div className="section-head">
            <h2>{tx(copy.process.title)}</h2>
            <p>{tx(copy.process.intro)}</p>
          </div>
          <ol className="process plain-list">
            {siteConfig.process.map((p) => (
              <li key={tx(p.title)}>
                <Photo src={p.image} alt="" />
                <h3>{tx(p.title)}</h3>
                <p>{tx(p.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* References mosaic */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>{tx(copy.references.title)}</h2>
            <p>{tx(copy.references.intro)}</p>
          </div>
          <div className="mosaic">
            {siteConfig.projects.slice(0, 5).map((p) => (
              <Link key={tx(p.title)} href={withLang(lang, `/referenzen?leistung=${p.service}`)} className="mosaic-item">
                <Photo src={p.image} alt="" />
                <span className="mosaic-caption">
                  <strong>{tx(p.title)}</strong>
                  <span>
                    {p.district} · {tx(p.duration)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 20 }}>
            <Link href={withLang(lang, "/referenzen")} className="btn btn-ghost">
              {dict["home.allReferences"]}
            </Link>
          </p>
        </div>
      </section>

      {/* Partners */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <h2>{tx(copy.partners.title)}</h2>
            <p>{tx(copy.partners.intro)}</p>
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
            <h2>{tx(copy.faq.title)}</h2>
          </div>
          <div className="faq">
            {siteConfig.faq.map((f) => (
              <details key={tx(f.q)}>
                <summary>{tx(f.q)}</summary>
                <p>{tx(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section tiles" id="kontakt">
        <div className="wrap contact-grid">
          <div className="panel">
            <h2>{tx(copy.contact.title)}</h2>
            <p className="sub">{tx(copy.contact.intro)}</p>
            <div className="actions">
              <Link href={withLang(lang, "/termin?art=besichtigung")} className="btn">
                {dict["cta.bookVisit"]}
              </Link>
              <Link href={withLang(lang, "/termin?art=beratung")} className="btn btn-ghost">
                {dict["cta.bookVideo"]}
              </Link>
            </div>
          </div>
          <div className="contact-card">
            <h3 style={{ marginBottom: 16 }}>{c.legalName}</h3>
            <dl>
              <dt>{dict["contact.address"]}</dt>
              <dd>
                {c.address.street}
                <br />
                {c.address.zip} {c.address.city}
              </dd>
              <dt>{dict["contact.phone"]}</dt>
              <dd>
                <a href={`tel:${c.phoneHref}`}>{c.phone}</a>
              </dd>
              <dt>{dict["contact.email"]}</dt>
              <dd>
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </dd>
              <dt>{dict["contact.hours"]}</dt>
              <dd>{tx(c.openingHours)}</dd>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
