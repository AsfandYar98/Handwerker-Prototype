import Link from "next/link";
import { siteConfig, getService } from "@/site.config";
import Photo from "@/components/Photo";
import { getDict } from "@/lib/i18n";
import { withLang } from "@/lib/i18n/href";
import { t } from "@/lib/i18n/t";
import { languageAlternates } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: getDict(lang)["meta.references"], alternates: languageAlternates("/referenzen") };
}

export default async function ReferencesPage({ params, searchParams }) {
  const [{ lang }, sp] = await Promise.all([params, searchParams]);
  const dict = getDict(lang);
  const tx = (value) => t(value, lang);
  const active = typeof sp?.leistung === "string" && getService(sp.leistung) ? sp.leistung : null;
  const projects = active ? siteConfig.projects.filter((p) => p.service === active) : siteConfig.projects;
  const { referencesPage: head, referencesCta: cta } = siteConfig.copy;

  return (
    <>
      <section className="page-head tiles">
        <div className="wrap">
          <h1>{tx(head.title)}</h1>
          <p>{tx(head.intro)}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <nav className="filter-row" aria-label={dict["refs.filter"]}>
            <Link href={withLang(lang, "/referenzen")} className="chip" aria-current={!active ? "true" : undefined}>
              {dict["refs.all"]}
            </Link>
            {siteConfig.services.map((s) => (
              <Link
                key={s.slug}
                href={withLang(lang, `/referenzen?leistung=${s.slug}`)}
                className="chip"
                aria-current={active === s.slug ? "true" : undefined}
              >
                {tx(s.name)}
              </Link>
            ))}
          </nav>
          {siteConfig.demo.enabled && (
            <p className="notice" style={{ marginBottom: 28 }}>
              {dict["refs.demoNotice"]}
            </p>
          )}
          {projects.length === 0 ? (
            <p className="empty">{dict["refs.empty"]}</p>
          ) : (
            <div className="projects">
              {projects.map((p) => (
                <article key={tx(p.title)} className="project">
                  <Photo src={p.image} alt={tx(p.title)} />
                  <h3>{tx(p.title)}</h3>
                  <p className="project-meta">
                    {tx(getService(p.service)?.name)} · {p.district} · {tx(p.duration)} · {p.year}
                  </p>
                  <p>{tx(p.text)}</p>
                </article>
              ))}
            </div>
          )}
          <div className="panel" style={{ marginTop: "calc(var(--u) * 1.5)" }}>
            <h2>{tx(cta.title)}</h2>
            <p className="sub">{tx(cta.intro)}</p>
            <Link href={withLang(lang, active ? `/termin?leistung=${active}` : "/termin")} className="btn">
              {dict["cta.book"]}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
