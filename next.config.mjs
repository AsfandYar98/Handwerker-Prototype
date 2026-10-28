/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  experimental: {
    // app/global-not-found.jsx: the 404 for unmatched URLs, needed because there
    // is no single root layout (public site under /[lang], admin separate).
    globalNotFound: true,
  },
  // Public URLs gained a language prefix; keep links from older emails working.
  async redirects() {
    return ["/termin", "/referenzen", "/leistungen/:slug", "/buchung/:id"].map((source) => ({
      source,
      destination: `/de${source}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
