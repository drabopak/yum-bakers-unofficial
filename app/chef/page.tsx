'use client'

import { ChefHat, Flame, CheckCircle2 } from 'lucide-react'
import { useOrderStore, type Order } from '@/data/order-store'
import { useRoleGuard } from '@/hooks/use-role-guard'
import { StaffHeader } from '@/components/layout/staff-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { OrderItemsList } from '@/components/ui/order-items-list'
import { CheckingAccess } from '@/components/ui/checking-access'
import { formatOrderTime } from '@/lib/order-status'

const KITCHEN_STATUSES: Order['status'][] = ['Pending', 'Preparing', 'Ready']

export default function ChefDashboardPage() {
  const authorized = useRoleGuard('chef')
  const { orders, updateOrderStatus, connectionStatus } = useOrderStore()

  if (!authorized) return <CheckingAccess />

  const kitchenOrders = orders
    .filter((order) => KITCHEN_STATUSES.includes(order.status))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/40 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <StaffHeader
          icon={<ChefHat className="h-6 w-6" />}
          title="Chef Dashboard"
          subtitle="Track and update every order moving through the kitchen."
          role="chef"
          connectionStatus={connectionStatus}
        />

        <div className="mt-8 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-amber-100 bg-amber-50/70 text-xs font-semibold uppercase tracking-wide text-amber-800">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {kitchenOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-stone-500">
                      No active kitchen orders right now.
                    </td>
                  </tr>
                ) : (
                  kitchenOrders.map((order) => (
                    <tr key={order.id} className="align-top transition-colors hover:bg-amber-50/50">
                      <td className="px-5 py-4 font-semibold text-stone-800">{order.id}</td>
                      <td className="px-5 py-4">
                        <OrderItemsList items={order.items} />
                      </td>
                      <td className="px-5 py-4 text-sm text-stone-600">
                        {formatOrderTime(order.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        {order.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'Preparing')}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-amber-700"
                          >
                            <Flame className="h-4 w-4" />
                            Start Cooking
                          </button>
                        )}
                        {order.status === 'Preparing' && (
                          <button
                            type="button"
                            onClick={() => updateOrderStatus(order.id, 'Ready')}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Cooked / Mark Ready
                          </button>
                        )}
                        {order.status === 'Ready' && (
                          <span className="text-sm font-medium text-emerald-700">
                            Waiting for pickup
                          </span>
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
