'use client'

import { useState } from 'react'
import { Trash2, X, AlertCircle, Loader2, Clock, ChefHat, Truck } from 'lucide-react'
import { useOrderStore, type Order } from '@/data/order-store'
import { StatusBadge } from '@/components/ui/status-badge'
import { OrderItemsList } from '@/components/ui/order-items-list'
import { formatRs } from '@/components/cart/cart-context'
import { formatOrderTime } from '@/lib/order-status'

export function OrderAuditTab() {
  const { orders, deleteOrder, clearDeliveredOrders } = useOrderStore()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmClear2, setConfirmClear2] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const auditOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length

  const handleDelete = (id: string) => {
    deleteOrder(id)
    setConfirmDelete(null)
  }

  const handleClearDelivered = () => {
    clearDeliveredOrders()
    setConfirmClear(false)
    setConfirmClear2(false)
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-stone-800">
          Order Audit Log ({auditOrders.length})
        </h2>
        {deliveredCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500">{deliveredCount} delivered</span>
            {confirmClear ? (
              confirmClear2 ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-red-700">Are you absolutely sure?</span>
                  <button
                    type="button"
                    onClick={handleClearDelivered}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Yes, Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmClear(false)
                      setConfirmClear2(false)
                    }}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-amber-700">This will permanently delete {deliveredCount} delivered orders.</span>
                  <button
                    type="button"
                    onClick={() => setConfirmClear2(true)}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
                  >
                    Continue
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                </div>
              )
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear Delivered
              </button>
            )}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-amber-100 bg-amber-50/70 text-xs font-semibold uppercase tracking-wide text-amber-800">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Prepared By</th>
                <th className="px-5 py-3">Delivered By</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100">
              {auditOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-stone-500">
                    No orders placed yet. New orders will appear here live.
                  </td>
                </tr>
              ) : (
                auditOrders.map((order: Order) => (
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
                    <td className="px-5 py-4 text-sm text-stone-600">
                      {order.preparedBy ? (
                        <div className="flex items-start gap-1.5">
                          <ChefHat className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                          <div>
                            <p className="font-medium text-stone-700">{order.preparedBy}</p>
                            {order.preparedAt && (
                              <p className="text-xs text-stone-400">
                                {formatOrderTime(order.preparedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-stone-600">
                      {order.deliveredBy ? (
                        <div className="flex items-start gap-1.5">
                          <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" />
                          <div>
                            <p className="font-medium text-stone-700">{order.deliveredBy}</p>
                            {order.deliveredAt && (
                              <p className="text-xs text-stone-400">
                                {formatOrderTime(order.deliveredAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {confirmDelete === order.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(order.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(null)}
                            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(order.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
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
  )
}
