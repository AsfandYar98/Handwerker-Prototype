import { redirect } from "next/navigation";
import { siteConfig } from "@/site.config";
import { isAdmin } from "@/lib/admin-session";
import { adminPassword } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin"); // also while the demo dashboard is open
  return (
    <div className="login tiles">
      <div className="panel">
        <h2>{siteConfig.company.brand}</h2>
        <p className="sub">Dashboard für Termine und Anfragen</p>
        {!adminPassword() ? (
          <p className="alert">Es ist noch kein Passwort gesetzt. Legen Sie ADMIN_PASSWORD in den Umgebungsvariablen an.</p>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
