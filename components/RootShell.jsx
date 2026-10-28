import { Archivo } from "next/font/google";
import { siteConfig } from "@/site.config";
import "@/app/globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const theme = siteConfig.theme;
const themeVars = {
  "--tile": theme.tile,
  "--grout": theme.grout,
  "--ink": theme.ink,
  "--primary": theme.primary,
  "--primary-soft": theme.primarySoft,
  "--accent": theme.accent,
};

// <html>/<body> shared by the root layouts (public /[lang], /admin, "/") and
// the global 404, so each sets the right `lang` and the same font and theme.
export default function RootShell({ lang, children }) {
  return (
    // data-scroll-behavior: globals.css sets smooth scrolling; this lets Next.js
    // switch it off during route changes so navigation doesn't animate-scroll.
    <html lang={lang} className={archivo.variable} style={themeVars} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
