'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { X, Minus, Plus, Trash2, ShoppingBag, Lock } from 'lucide-react'
import { useCart, formatRs } from './cart-context'
import { useOrderStore } from '@/data/order-store'
import { useAuth } from '@/context/auth-context'
import { playInc, playDec, playRemove } from '@/lib/sounds'

const RESUME_CHECKOUT_KEY = 'yum-resume-checkout'

export function CartDrawer() {
  const { lines, isOpen, openCart, closeCart, increment, decrement, remove, total, count } = useCart()
  const { addOrder } = useOrderStore()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // If the customer was redirected to /login mid-checkout, reopen the cart
  // automatically once they're back and authenticated, so they can finish
  // placing the order without having to find the cart button again.
  useEffect(() => {
    if (pathname === '/login') return
    if (!isAuthenticated) return
    const shouldResume = window.sessionStorage.getItem(RESUME_CHECKOUT_KEY)
    if (shouldResume) {
      window.sessionStorage.removeItem(RESUME_CHECKOUT_KEY)
      openCart()
    }
  }, [pathname, isAuthenticated, openCart])

  const handleOrder = () => {
    if (lines.length === 0) return

    if (!isAuthenticated) {
      // Cart state lives in the shared CartProvider mounted at the root
      // layout, so it survives this navigation intact. Remember that a
      // checkout was in progress, then send them to log in.
      window.sessionStorage.setItem(RESUME_CHECKOUT_KEY, '1')
      closeCart()
      router.push(`/login?redirect=${encodeURIComponent(pathname || '/')}`)
      return
    }

    const order = addOrder({
      customerPhone: user?.phone ?? 'Unknown customer',
      address: 'To be confirmed at pickup',
      items: lines.map((line) => ({
        id: line.id,
        name: line.name,
        quantity: line.qty,
        price: line.price,
      })),
    })
    lines.forEach((line) => remove(line.id))
    closeCart()
    router.push(`/order-status?id=${encodeURIComponent(order.id)}`)
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-mahogany/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-mahogany">
            <ShoppingBag className="h-5 w-5 text-gold" />
            Your Order {count > 0 && <span className="text-mahogany-soft">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-2 text-mahogany transition-colors hover:bg-gold/15"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-mahogany-soft">
              <ShoppingBag className="h-12 w-12 text-gold-soft" />
              <p className="mt-4 font-serif text-lg text-mahogany">Your cart is empty</p>
              <p className="mt-1 text-sm">Add something sweet from the menu.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-3 soft-shadow"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={line.image || '/placeholder.svg'}
                    alt={line.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-snug text-mahogany">
                        {line.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          remove(line.id)
                          playRemove()
                        }}
                        aria-label={`Remove ${line.name}`}
                        className="text-mahogany-soft transition-colors hover:text-tangerine"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-tangerine">
                      {formatRs(line.price)}
                    </span>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          decrement(line.id)
                          playDec()
                        }}
                        aria-label="Decrease quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-mahogany transition-colors hover:border-gold hover:bg-gold/10"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-mahogany">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          increment(line.id)
                          playInc()
                        }}
                        aria-label="Increase quantity"
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-mahogany transition-colors hover:border-gold hover:bg-gold/10"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-serif text-lg text-mahogany">Total</span>
            <span className="font-serif text-2xl font-bold text-gold">{formatRs(total)}</span>
          </div>

          {!isAuthenticated && lines.length > 0 && (
            <p className="mb-3 flex items-center gap-2 rounded-xl border border-gold/40 bg-gold-soft/30 px-3 py-2 text-xs font-medium text-mahogany-soft">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              You&apos;ll be asked to log in to confirm this order.
            </p>
          )}

          <button
            type="button"
            onClick={handleOrder}
            disabled={lines.length === 0}
            className="w-full rounded-full bg-tangerine px-6 py-3.5 text-sm font-semibold text-cream transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAuthenticated ? 'Proceed to Order' : 'Login to Place Order'}
          </button>
        </div>
      </aside>
    </>
  )
}
