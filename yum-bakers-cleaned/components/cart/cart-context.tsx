'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ShoppingBag } from 'lucide-react'
import type { MenuItem } from '@/data/yum-data'

export type CartLine = MenuItem & { qty: number }

type CartContextValue = {
  lines: CartLine[]
  count: number
  total: number
  bump: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  add: (item: MenuItem) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  remove: (id: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [bump, setBump] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const add = (item: MenuItem) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === item.id)
      if (found) {
        return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { ...item, qty: 1 }]
    })
    setBump((b) => b + 1)
    setToast(`${item.name} added to cart`)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const increment = (id: string) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)))

  const decrement = (id: string) =>
    setLines((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    )

  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id))

  const { count, total } = useMemo(() => {
    return lines.reduce(
      (acc, l) => {
        acc.count += l.qty
        acc.total += l.qty * l.price
        return acc
      },
      { count: 0, total: 0 },
    )
  }, [lines])

  const value: CartContextValue = {
    lines,
    count,
    total,
    bump,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    add,
    increment,
    decrement,
    remove,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div
          key={toast + bump}
          role="status"
          aria-live="polite"
          className="toast-in fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-mahogany px-5 py-3 text-sm font-semibold text-cream soft-shadow-lg"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tangerine">
            <ShoppingBag className="h-4 w-4" strokeWidth={2.5} />
          </span>
          {toast}
        </div>
      )}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function formatRs(n: number) {
  return `Rs. ${n.toLocaleString('en-PK')}`
}
