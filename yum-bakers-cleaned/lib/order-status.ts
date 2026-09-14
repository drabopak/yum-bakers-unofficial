import type { OrderStatus } from '@/data/order-store'

export const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Preparing: 'bg-orange-100 text-orange-800 border-orange-200',
  Ready: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Out for Delivery': 'bg-blue-100 text-blue-800 border-blue-200',
  Delivered: 'bg-stone-100 text-stone-600 border-stone-200',
}

export function formatOrderTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
