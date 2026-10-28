import RootShell from "@/components/RootShell";
import { DEFAULT_LANG } from "@/lib/i18n/config";

// With several root layouts (/[lang], /admin) and no app/layout.jsx, Next.js
// needs "/" inside a route group with its own root layout. The page only redirects.
export default function RedirectLayout({ children }) {
  return <RootShell lang={DEFAULT_LANG}>{children}</RootShell>;
}
