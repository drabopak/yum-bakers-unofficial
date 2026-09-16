/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Hashed, content-addressed build assets never change once built —
        // safe (and desirable) to cache forever.
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Everything else — pages, RSC/data payloads — must always be
        // revalidated so a fresh Netlify deploy is visible immediately on
        // refresh instead of a stale CDN/browser copy sticking around.
        // The negative lookahead keeps this from also matching (and
        // overriding) the immutable rule above.
        source: '/((?!_next/static).*)',
        headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
      },
    ]
  },
}

export default nextConfig
