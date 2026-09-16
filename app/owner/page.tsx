'use client'

import { useState } from 'react'
import { ShieldCheck, LayoutGrid, UtensilsCrossed, BarChart3, KeyRound, ClipboardList } from 'lucide-react'
import { useOrderStore } from '@/data/order-store'
import { useRoleGuard } from '@/hooks/use-role-guard'
import { StaffHeader } from '@/components/layout/staff-header'
import { MetricCard } from '@/components/ui/metric-card'
import { CheckingAccess } from '@/components/ui/checking-access'
import { formatRs } from '@/components/cart/cart-context'
import { MenuManagementTab } from '@/components/owner/menu-management-tab'
import { SalesAnalyticsTab } from '@/components/owner/sales-analytics-tab'
import { PasskeyManagementTab } from '@/components/owner/passkey-management-tab'
import { OrderAuditTab } from '@/components/owner/order-audit-tab'

type TabId = 'overview' | 'menu' | 'analytics' | 'passkeys' | 'audit'

const TABS: { id: TabId; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'menu', label: 'Menu Management', icon: UtensilsCrossed },
  { id: 'analytics', label: 'Sales & Best-Sellers', icon: BarChart3 },
  { id: 'passkeys', label: 'Passkeys', icon: KeyRound },
  { id: 'audit', label: 'Order Audit', icon: ClipboardList },
]

export default function OwnerDashboardPage() {
  const authorized = useRoleGuard('owner')
  const { orders, connectionStatus } = useOrderStore()
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  if (!authorized) return <CheckingAccess />

  const deliveredOrders = orders.filter((order) => order.status === 'Delivered')
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const activeOrders = orders.filter((order) => order.status !== 'Delivered').length
  const completedDeliveries = deliveredOrders.length

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/40 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <StaffHeader
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Owner Command Center"
          subtitle="Manage menu, sales, staff access, and order history."
          role="owner"
          connectionStatus={connectionStatus}
        />

        {/* Tab navigation */}
        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'border border-amber-200 bg-white text-stone-600 hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          })}
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MetricCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Total Revenue Collected"
                  value={formatRs(totalRevenue)}
                  accent="emerald"
                />
                <MetricCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Active Kitchen / Delivery Orders"
                  value={String(activeOrders)}
                  accent="amber"
                />
                <MetricCard
                  icon={<ShieldCheck className="h-5 w-5" />}
                  label="Completed Deliveries"
                  value={String(completedDeliveries)}
                  accent="red"
                />
              </div>

              <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-stone-600">
                  Use the tabs above to manage your menu, view sales analytics, control staff passkeys,
                  and review the full order audit log with attribution tracking.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'menu' && <MenuManagementTab />}
          {activeTab === 'analytics' && <SalesAnalyticsTab />}
          {activeTab === 'passkeys' && <PasskeyManagementTab />}
          {activeTab === 'audit' && <OrderAuditTab />}
        </div>
      </div>
    </main>
  )
}
