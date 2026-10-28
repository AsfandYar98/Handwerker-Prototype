import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig, getService } from "@/site.config";
import Photo from "@/components/Photo";

export function generateStaticParams() {
  return siteConfig.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  return s ? { title: s.name, description: s.short } : {};
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const projects = siteConfig.projects.filter((p) => p.service === s.slug);

  return (
    <>
      <section className="page-head tiles">
        <div className="wrap">
          <p className="crumbs">
            <Link href="/">Start</Link> / <Link href="/#leistungen">Leistungen</Link>
          </p>
          <h1>{s.name}</h1>
          <p>{s.short}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap service-detail">
          <div>
            <Photo src={s.image} alt={s.name} />
          </div>
          <div>
            <p style={{ fontSize: 19 }}>{s.body}</p>
            <ul className="check-list">
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <dl className="kv">
              <dt>Typische Dauer</dt>
              <dd>{s.typicalDuration}</dd>
              <dt>Preis</dt>
              <dd>Festpreis nach kostenloser Besichtigung</dd>
            </dl>
            <div className="actions">
              <Link href={`/termin?leistung=${s.slug}&art=besichtigung`} className="btn">
                Besichtigung buchen
              </Link>
              <Link href={`/termin?leistung=${s.slug}&art=beratung`} className="btn btn-ghost">
                Erst per Video beraten lassen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="section-head">
              <h2>Projekte: {s.name}</h2>
            </div>
            <div className="projects">
              {projects.map((p) => (
                <article key={p.title} className="project">
                  <Photo src={p.image} alt={p.title} />
                  <h3>{p.title}</h3>
                  <p className="project-meta">
                    {p.district} · {p.duration} · {p.year}
                  </p>
                  <p>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
