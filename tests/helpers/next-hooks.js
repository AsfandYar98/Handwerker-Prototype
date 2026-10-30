// Module resolve hooks so plain `node --test` can import route handlers:
// "@/…" resolves like jsconfig.json, and next/headers is replaced by a stub.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const stubs = { "next/headers": new URL("./next-headers.js", import.meta.url).href };

export async function resolve(specifier, context, nextResolve) {
  if (specifier in stubs) return { url: stubs[specifier], shortCircuit: true };
  if (specifier.startsWith("@/")) {
    const path = specifier.slice(2);
    const candidates = path.endsWith(".js") ? [path] : [`${path}.js`, `${path}/index.js`];
    const found = candidates.map((p) => new URL(p, root)).find((u) => existsSync(fileURLToPath(u)));
    return nextResolve(found ? found.href : specifier, context);
  }
  return nextResolve(specifier, context);
}
