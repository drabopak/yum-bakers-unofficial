'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChefHat, Truck, PackageCheck, Clock, Home, CheckCircle2, Bike } from 'lucide-react'
import { useOrderStore, type Order, type OrderStatus } from '@/data/order-store'
import { useAuth } from '@/context/auth-context'
import { formatRs } from '@/components/cart/cart-context'
import { ConnectionBadge } from '@/components/ui/connection-badge'

const STEPS: { status: OrderStatus; title: string; description: string; icon: typeof Clock }[] = [
  {
    status: 'Pending',
    title: 'Waiting for chef',
    description: 'Your order has been received and is in the kitchen queue.',
    icon: Clock,
  },
  {
    status: 'Preparing',
    title: 'Your food is being prepared',
    description: 'Our chefs are cooking your order fresh, right now.',
    icon: ChefHat,
  },
  {
    status: 'Ready',
    title: 'Waiting for delivery man',
    description: 'Your order is packed and ready — a rider will pick it up shortly.',
    icon: PackageCheck,
  },
  {
    status: 'Out for Delivery',
    title: 'Food being delivered',
    description: 'Your rider is on the way to you.',
    icon: Truck,
  },
  {
    status: 'Delivered',
    title: 'Rider is waiting for you / Delivered',
    description: 'Enjoy! Thanks for ordering from Yum Bakers & Sweets.',
    icon: Bike,
  },
]

const STATUS_ORDER: OrderStatus[] = STEPS.map((step) => step.status)

function OrderStatusContent() {
  const searchParams = useSearchParams()
  const { orders, connectionStatus } = useOrderStore()
  const { user } = useAuth()

  const idParam = searchParams.get('id')

  let order: Order | undefined
  if (idParam) {
    order = orders.find((o) => o.id === idParam)
  } else if (user?.phone) {
    order = [...orders]
      .filter((o) => o.customerPhone === user.phone)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
  }

  if (!order) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50 px-4 text-center">
        <div className="rounded-2xl border border-amber-100 bg-white p-8 shadow-sm">
          <PackageCheck className="mx-auto h-12 w-12 text-amber-400" />
          <h1 className="mt-4 font-serif text-xl font-bold text-stone-800">No active order</h1>
          <p className="mt-2 max-w-sm text-sm text-stone-500">
            We couldn&apos;t find an order to track. Place an order from the menu to see its live
            status here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-red-700"
          >
            <Home className="h-4 w-4" />
            Back to Menu
          </Link>
        </div>
      </main>
    )
  }

  const currentIndex = STATUS_ORDER.indexOf(order.status)

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition-colors hover:text-red-600"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <ConnectionBadge status={connectionStatus} />
        </div>

        <div className="mt-6 rounded-3xl border border-amber-100 bg-white p-6 shadow-xl shadow-amber-900/5 sm:p-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-800">
              Order {order.id}
            </span>
            <h1 className="mt-4 font-serif text-2xl font-extrabold text-stone-800 sm:text-3xl">
              {order.status === 'Delivered' ? 'Order Delivered!' : 'Tracking Your Order'}
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Placed at{' '}
              {new Date(order.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' · '}
              {formatRs(order.totalAmount)}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-0">
            {STEPS.map((step, index) => {
              const isComplete = index < currentIndex
              const isActive = index === currentIndex
              const isUpcoming = index > currentIndex
              const Icon = step.icon
              const isLast = index === STEPS.length - 1

              return (
                <div key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isComplete
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : isActive
                            ? 'animate-pulse border-red-500 bg-red-500 text-white'
                            : 'border-stone-200 bg-stone-50 text-stone-300'
                      }`}
                    >
                      {isComplete ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
                    </span>
                    {!isLast && (
                      <span
                        className={`w-0.5 flex-1 ${isComplete ? 'bg-emerald-500' : 'bg-stone-200'}`}
                        style={{ minHeight: '2.5rem' }}
                      />
                    )}
                  </div>
                  <div className={isLast ? 'pb-0' : 'pb-10'}>
                    <h3
                      className={`font-serif text-lg font-bold ${
                        isActive ? 'text-red-600' : isComplete ? 'text-emerald-600' : 'text-stone-400'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className={`mt-1 text-sm ${isUpcoming ? 'text-stone-400' : 'text-stone-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              Delivery Address
            </p>
            <p className="mt-1 text-sm text-stone-700">{order.address}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              Order Items
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm text-stone-700">
                  <span>
                    <span className="font-semibold">{item.quantity}×</span> {item.name}
                  </span>
                  <span>{formatRs(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={null}>
      <OrderStatusContent />
    </Suspense>
  )
}
