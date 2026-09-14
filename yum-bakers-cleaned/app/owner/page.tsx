'use client'

import { DollarSign, Activity, PackageCheck, KeyRound, ChefHat, Truck, ShieldCheck } from 'lucide-react'
import { useOrderStore } from '@/data/order-store'
import { useRoleGuard } from '@/hooks/use-role-guard'
import { StaffHeader } from '@/components/layout/staff-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { OrderItemsList } from '@/components/ui/order-items-list'
import { MetricCard } from '@/components/ui/metric-card'
import { CheckingAccess } from '@/components/ui/checking-access'
import { formatRs } from '@/components/cart/cart-context'

const STAFF_KEYS = [
  { role: 'Chef', key: 'CHEF-1234', icon: ChefHat },
  { role: 'Delivery', key: 'DEL-1234', icon: Truck },
  { role: 'Owner', key: 'OWNER-1234', icon: ShieldCheck },
]

export default function OwnerDashboardPage() {
  const authorized = useRoleGuard('owner')
  const { orders, connectionStatus } = useOrderStore()

  if (!authorized) return <CheckingAccess />

  const deliveredOrders = orders.filter((order) => order.status === 'Delivered')
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const activeOrders = orders.filter((order) => order.status !== 'Delivered').length
  const completedDeliveries = deliveredOrders.length

  const auditOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/40 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <StaffHeader
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Owner Command Center"
          subtitle="A live view of revenue, active orders and staff access."
          role="owner"
          connectionStatus={connectionStatus}
        />

        {/* Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Total Revenue Collected"
            value={formatRs(totalRevenue)}
            accent="emerald"
          />
          <MetricCard
            icon={<Activity className="h-5 w-5" />}
            label="Active Kitchen / Delivery Orders"
            value={String(activeOrders)}
            accent="amber"
          />
          <MetricCard
            icon={<PackageCheck className="h-5 w-5" />}
            label="Completed Deliveries"
            value={String(completedDeliveries)}
            accent="red"
          />
        </div>

        {/* Staff key management */}
        <div className="mt-6 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-amber-600" />
            <h2 className="font-serif text-lg font-bold text-stone-800">Staff Key Management</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {STAFF_KEYS.map(({ role, key, icon: Icon }) => (
              <div
                key={role}
                className="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-amber-700" />
                  <span className="text-sm font-semibold text-stone-700">{role}</span>
                </div>
                <code className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold tracking-wide text-red-600 shadow-sm">
                  {key}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Order audit log */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
          <div className="border-b border-amber-100 px-5 py-4">
            <h2 className="font-serif text-lg font-bold text-stone-800">Order Audit Log</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-amber-100 bg-amber-50/70 text-xs font-semibold uppercase tracking-wide text-amber-800">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Customer Phone</th>
                  <th className="px-5 py-3">Total Price</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {auditOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-stone-500">
                      No orders placed yet. New orders will appear here live.
                    </td>
                  </tr>
                ) : (
                  auditOrders.map((order) => (
                    <tr key={order.id} className="align-top transition-colors hover:bg-amber-50/50">
                      <td className="px-5 py-4 font-semibold text-stone-800">{order.id}</td>
                      <td className="px-5 py-4">
                        <OrderItemsList items={order.items} />
                      </td>
                      <td className="px-5 py-4 text-sm text-stone-600">{order.customerPhone}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-stone-800">
                        {formatRs(order.totalAmount)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
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
