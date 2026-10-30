import { redirect } from "next/navigation";
import { siteConfig } from "@/site.config";
import { isAdmin } from "@/lib/admin-session";
import { storageMode } from "@/lib/store";
import { mailConfigured, companyRecipients } from "@/lib/mail";
import { calendlyTokenConfigured, calendlyWebhookConfigured } from "@/lib/calendly";
import { isOpenDemoAdmin } from "@/lib/auth";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const setup = {
    storage: storageMode,
    mail: mailConfigured,
    notifyTo: companyRecipients(),
    calendlyUrl: siteConfig.calendly.url,
    calendlyToken: calendlyTokenConfigured,
    calendlyWebhook: calendlyWebhookConfigured,
    demo: siteConfig.demo.enabled,
  };

  return <AdminDashboard setup={setup} openDemo={isOpenDemoAdmin()} />;
}
