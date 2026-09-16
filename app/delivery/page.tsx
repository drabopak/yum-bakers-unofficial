'use client'

import { Truck, Banknote } from 'lucide-react'
import { useOrderStore, type Order } from '@/data/order-store'
import { useRoleGuard } from '@/hooks/use-role-guard'
import { getStaffLabel } from '@/lib/session'
import { StaffHeader } from '@/components/layout/staff-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { OrderItemsList } from '@/components/ui/order-items-list'
import { CheckingAccess } from '@/components/ui/checking-access'
import { formatRs } from '@/components/cart/cart-context'
import { formatOrderTime } from '@/lib/order-status'

const DELIVERY_STATUSES: Order['status'][] = ['Ready', 'Out for Delivery']

export default function DeliveryDashboardPage() {
  const authorized = useRoleGuard('delivery')
  const { orders, updateOrderStatus, connectionStatus } = useOrderStore()

  if (!authorized) return <CheckingAccess />

  const staffLabel = getStaffLabel() ?? 'Delivery'
  const deliveryOrders = orders
    .filter((order) => DELIVERY_STATUSES.includes(order.status))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/40 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <StaffHeader
          icon={<Truck className="h-6 w-6" />}
          title="Delivery Dashboard"
          subtitle="Pick up ready orders and confirm deliveries."
          role="delivery"
          connectionStatus={connectionStatus}
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-amber-100 bg-amber-50/70 text-xs font-semibold uppercase tracking-wide text-amber-800">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Delivered By</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {deliveryOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-stone-500">
                      No orders ready for delivery right now.
                    </td>
                  </tr>
                ) : (
                  deliveryOrders.map((order) => (
                    <tr key={order.id} className="align-top transition-colors hover:bg-amber-50/50">
                      <td className="px-5 py-4 font-semibold text-stone-800">{order.id}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-stone-700">{order.customerPhone}</p>
                        <p className="text-xs text-stone-500">{order.address}</p>
                      </td>
                      <td className="px-5 py-4">
                        <OrderItemsList items={order.items} />
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-stone-800">
                        {formatRs(order.totalAmount)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-sm text-stone-600">
                        {order.deliveredBy ? (
                          <div>
                            <p className="font-medium text-stone-700">{order.deliveredBy}</p>
                            {order.deliveredAt && (
                              <p className="text-xs text-stone-400">
                                {formatOrderTime(order.deliveredAt)}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {order.status === 'Ready' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-amber-700"
                          >
                            <Truck className="h-4 w-4" />
                            Order Taken / Pick Up
                          </button>
                        )}
                        {order.status === 'Out for Delivery' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'Delivered', staffLabel)}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-emerald-700"
                          >
                            <Banknote className="h-4 w-4" />
                            Delivered / Confirm Cash
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
