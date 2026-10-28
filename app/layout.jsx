import { Archivo } from "next/font/google";
import { siteConfig } from "@/site.config";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata = {
  title: { default: siteConfig.seo.title, template: `%s – ${siteConfig.company.brand}` },
  description: siteConfig.seo.description,
  robots: siteConfig.demo.enabled ? { index: false, follow: false } : undefined,
  icons: siteConfig.company.logoUrl ? { icon: siteConfig.company.logoUrl } : undefined,
};

export const viewport = {
  themeColor: siteConfig.theme.primary,
};

export default function RootLayout({ children }) {
  const t = siteConfig.theme;
  const themeVars = {
    "--tile": t.tile,
    "--grout": t.grout,
    "--ink": t.ink,
    "--primary": t.primary,
    "--primary-soft": t.primarySoft,
    "--accent": t.accent,
  };
  return (
    <html lang={siteConfig.locale.slice(0, 2)} className={archivo.variable} style={themeVars}>
      <body>
        {siteConfig.demo.enabled && (
          <div className="demo-banner" role="note">
            {siteConfig.demo.bannerText}
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
