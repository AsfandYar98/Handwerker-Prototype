import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig, getService } from "@/site.config";
import Photo from "@/components/Photo";
import { getDict } from "@/lib/i18n";
import { fill } from "@/lib/i18n/format";
import { withLang } from "@/lib/i18n/href";
import { t } from "@/lib/i18n/t";
import { languageAlternates } from "@/lib/metadata";

export function generateStaticParams() {
  return siteConfig.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const s = getService(slug);
  return s
    ? { title: t(s.name, lang), description: t(s.short, lang), alternates: languageAlternates(`/leistungen/${slug}`) }
    : {};
}

export default async function ServicePage({ params }) {
  const { lang, slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const dict = getDict(lang);
  const tx = (value) => t(value, lang);
  const name = tx(s.name);
  const projects = siteConfig.projects.filter((p) => p.service === s.slug);

  return (
    <>
      <section className="page-head tiles">
        <div className="wrap">
          <p className="crumbs">
            <Link href={withLang(lang, "/")}>{dict["nav.home"]}</Link> /{" "}
            <Link href={withLang(lang, "/#leistungen")}>{dict["nav.services"]}</Link>
          </p>
          <h1>{name}</h1>
          <p>{tx(s.short)}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap service-detail">
          <div>
            <Photo src={s.image} alt={name} />
          </div>
          <div>
            <p style={{ fontSize: 19 }}>{tx(s.body)}</p>
            <ul className="check-list">
              {s.points.map((p) => (
                <li key={tx(p)}>{tx(p)}</li>
              ))}
            </ul>
            <dl className="kv">
              <dt>{dict["service.duration"]}</dt>
              <dd>{tx(s.typicalDuration)}</dd>
              <dt>{dict["service.price"]}</dt>
              <dd>{tx(siteConfig.copy.servicePrice)}</dd>
            </dl>
            <div className="actions">
              <Link href={withLang(lang, `/termin?leistung=${s.slug}&art=besichtigung`)} className="btn">
                {dict["cta.bookVisit"]}
              </Link>
              <Link href={withLang(lang, `/termin?leistung=${s.slug}&art=beratung`)} className="btn btn-ghost">
                {dict["cta.videoFirst"]}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <h2>{fill(dict["service.projects"], { service: name })}</h2>
            </div>
            <div className="projects">
              {projects.map((p) => (
                <article key={tx(p.title)} className="project">
                  <Photo src={p.image} alt={tx(p.title)} />
                  <h3>{tx(p.title)}</h3>
                  <p className="project-meta">
                    {p.district} · {tx(p.duration)} · {p.year}
                  </p>
                  <p>{tx(p.text)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
