import { lang } from "next/root-params";
import NotFoundPanel from "@/components/NotFoundPanel";

// notFound() anywhere below /<lang>/ (unknown service, unknown path) → 404 in that language.
export default async function NotFound() {
  return <NotFoundPanel lang={await lang()} />;
}
