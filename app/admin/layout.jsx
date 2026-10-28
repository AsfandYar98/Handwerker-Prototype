import RootShell from "@/components/RootShell";
import { baseMetadata, siteViewport } from "@/lib/metadata";

// Root layout of the admin area, which stays German only.
export const metadata = baseMetadata("de");
export const viewport = siteViewport;

export default function AdminLayout({ children }) {
  return <RootShell lang="de">{children}</RootShell>;
}
