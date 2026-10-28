import Link from "next/link";

export default function NotFound() {
  return (
    <div className="login tiles">
      <div className="panel">
        <h2>Seite nicht gefunden</h2>
        <p className="sub">Diese Adresse gibt es nicht (mehr).</p>
        <div className="actions">
          <Link href="/" className="btn">
            Zur Startseite
          </Link>
          <Link href="/termin" className="btn btn-ghost">
            Termin buchen
          </Link>
        </div>
      </div>
    </div>
  );
}
