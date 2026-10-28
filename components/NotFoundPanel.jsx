import Link from "next/link";
import { getDict, langOrDefault } from "@/lib/i18n";
import { withLang } from "@/lib/i18n/href";

export default function NotFoundPanel({ lang }) {
  const l = langOrDefault(lang);
  const dict = getDict(l);
  return (
    <div className="login tiles">
      <div className="panel">
        <h2>{dict["notFound.title"]}</h2>
        <p className="sub">{dict["notFound.text"]}</p>
        <div className="actions">
          <Link href={withLang(l, "/")} className="btn">
            {dict["cta.home"]}
          </Link>
          <Link href={withLang(l, "/termin")} className="btn btn-ghost">
            {dict["cta.book"]}
          </Link>
        </div>
      </div>
    </div>
  );
}
