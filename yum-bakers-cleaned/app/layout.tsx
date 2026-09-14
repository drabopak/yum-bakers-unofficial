import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Poppins } from 'next/font/google'
import { AuthProvider } from '@/context/auth-context'
import { OrderStoreProvider } from '@/data/order-store'
import { CartProvider } from '@/components/cart/cart-context'
import { CartDrawer } from '@/components/cart/cart-drawer'
import './globals.css'

// Force every route to render dynamically on each request instead of being
// statically optimized/cached at build time. Combined with the Cache-Control
// headers in next.config.mjs and netlify.toml, this ensures a fresh deploy is
// visible immediately instead of a stale CDN/browser copy sticking around.
export const dynamic = 'force-dynamic'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-playfair',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Yum Bakers & Sweets — Celebrate Your Happy Moments',
  description:
    'Yum Bakers & Sweets — customized cakes, mithai, crispy fried chicken and fresh dairy across 7 branches. Since 1998, Pure for Sure.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FFFDF9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light ${playfair.variable} ${poppins.variable}`}>
      <body className="antialiased bg-background">
        {/*
          These providers — and the CartDrawer — now live at the root, not
          on the home page. That's what lets a customer's cart and login
          session survive navigating to /login and back: previously they
          were mounted inside app/page.tsx and were destroyed on every route
          change, which broke the "resume checkout after login" flow.
        */}
        <AuthProvider>
          <OrderStoreProvider>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
          </OrderStoreProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
