'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase-client'
const isSupabaseConfigured = true

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered'

export type OrderItem = {
  id: string
  name: string
  quantity: number
  price: number
}

export type Order = {
  id: string
  customerPhone: string
  address: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  createdAt: string
  preparedBy: string | null
  preparedAt: string | null
  deliveredBy: string | null
  deliveredAt: string | null
}

export type NewOrderInput = {
  customerPhone: string
  address: string
  items: OrderItem[]
}

type OrderRow = {
  id: string
  customer_phone: string
  address: string
  items: OrderItem[]
  total_amount: number
  status: OrderStatus
  created_at: string
  prepared_by: string | null
  prepared_at: string | null
  delivered_by: string | null
  delivered_at: string | null
}

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customerPhone: row.customer_phone,
    address: row.address,
    items: row.items,
    totalAmount: row.total_amount,
    status: row.status,
    createdAt: row.created_at,
    preparedBy: row.prepared_by ?? null,
    preparedAt: row.prepared_at ?? null,
    deliveredBy: row.delivered_by ?? null,
    deliveredAt: row.delivered_at ?? null,
  }
}

function calcTotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function generateOrderId() {
  return `YUM-${Date.now().toString().slice(-6)}`
}

export type ConnectionStatus = 'connecting' | 'live' | 'offline'

type OrderStoreValue = {
  orders: Order[]
  addOrder: (input: NewOrderInput) => Order
  updateOrderStatus: (id: string, status: OrderStatus, staffLabel?: string) => void
  deleteOrder: (id: string) => void
  clearDeliveredOrders: () => void
  getOrder: (id: string) => Order | undefined
  connectionStatus: ConnectionStatus
}

const OrderStoreContext = createContext<OrderStoreValue | null>(null)

export function OrderStoreProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    isSupabaseConfigured ? 'connecting' : 'offline',
  )

  const ordersRef = useRef<Order[]>([])
  ordersRef.current = orders

  const mergeOrder = useCallback((incoming: Order) => {
    setOrders((prev) => {
      const index = prev.findIndex((order) => order.id === incoming.id)
      if (index === -1) {
        return [incoming, ...prev]
      }
      const next = [...prev]
      next[index] = incoming
      return next
    })
  }, [])

  const removeOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id))
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setConnectionStatus('offline')
      return
    }

    let active = true
    let channel: RealtimeChannel | null = null

    async function loadInitialOrders() {
      const { data, error } = await supabase!
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (!active) return

      if (error) {
        console.error('[order-store] failed to load orders from Supabase:', error.message)
        return
      }

      setOrders((data as OrderRow[]).map(rowToOrder))
    }

    loadInitialOrders()

    channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          mergeOrder(rowToOrder(payload.new as OrderRow))
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          mergeOrder(rowToOrder(payload.new as OrderRow))
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'orders' },
        (payload) => {
          removeOrder((payload.old as { id: string }).id)
        },
      )
      .subscribe((status) => {
        if (!active) return
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('live')
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          setConnectionStatus('offline')
        }
      })

    return () => {
      active = false
      if (channel) supabase!.removeChannel(channel)
    }
  }, [mergeOrder, removeOrder])

  const addOrder = useCallback(
    (input: NewOrderInput): Order => {
      const order: Order = {
        id: generateOrderId(),
        customerPhone: input.customerPhone,
        address: input.address,
        items: input.items,
        totalAmount: calcTotal(input.items),
        status: 'Pending',
        createdAt: new Date().toISOString(),
        preparedBy: null,
        preparedAt: null,
        deliveredBy: null,
        deliveredAt: null,
      }

      mergeOrder(order)

      if (isSupabaseConfigured && supabase) {
        supabase
          .from('orders')
          .insert({
            id: order.id,
            customer_phone: order.customerPhone,
            address: order.address,
            items: order.items,
            total_amount: order.totalAmount,
            status: order.status,
            created_at: order.createdAt,
          })
          .then(({ error }) => {
            if (error) console.error('[order-store] failed to insert order:', error.message)
          })
      }

      return order
    },
    [mergeOrder],
  )

  const updateOrderStatus = useCallback(
    (id: string, status: OrderStatus, staffLabel?: string) => {
      const existing = ordersRef.current.find((order) => order.id === id)
      if (existing) {
        const now = new Date().toISOString()
        const patch: Partial<Order> = { status }

        if (status === 'Preparing' && staffLabel) {
          patch.preparedBy = staffLabel
          patch.preparedAt = now
        }
        if (status === 'Delivered' && staffLabel) {
          patch.deliveredBy = staffLabel
          patch.deliveredAt = now
        }

        mergeOrder({ ...existing, ...patch })
      }

      if (isSupabaseConfigured && supabase) {
        const update: Record<string, unknown> = { status }
        if (status === 'Preparing' && staffLabel) {
          update.prepared_by = staffLabel
          update.prepared_at = new Date().toISOString()
        }
        if (status === 'Delivered' && staffLabel) {
          update.delivered_by = staffLabel
          update.delivered_at = new Date().toISOString()
        }

        supabase
          .from('orders')
          .update(update)
          .eq('id', id)
          .then(({ error }) => {
            if (error) console.error('[order-store] failed to update order status:', error.message)
          })
      }
    },
    [mergeOrder],
  )

  const deleteOrder = useCallback(
    (id: string) => {
      removeOrder(id)

      if (isSupabaseConfigured && supabase) {
        supabase
          .from('orders')
          .delete()
          .eq('id', id)
          .then(({ error }) => {
            if (error) console.error('[order-store] failed to delete order:', error.message)
          })
      }
    },
    [removeOrder],
  )

  const clearDeliveredOrders = useCallback(() => {
    const delivered = ordersRef.current.filter((order) => order.status === 'Delivered')
    setOrders((prev) => prev.filter((order) => order.status !== 'Delivered'))

    if (isSupabaseConfigured && supabase) {
      delivered.forEach((order) => {
        supabase
          .from('orders')
          .delete()
          .eq('id', order.id)
          .then(({ error }) => {
            if (error) console.error('[order-store] failed to delete order:', error.message)
          })
      })
    }
  }, [])

  const getOrder = useCallback((id: string) => orders.find((order) => order.id === id), [orders])

  const value = useMemo<OrderStoreValue>(
    () => ({
      orders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      clearDeliveredOrders,
      getOrder,
      connectionStatus,
    }),
    [orders, addOrder, updateOrderStatus, deleteOrder, clearDeliveredOrders, getOrder, connectionStatus],
  )

  return <OrderStoreContext.Provider value={value}>{children}</OrderStoreContext.Provider>
}

export function useOrderStore() {
  const ctx = useContext(OrderStoreContext)
  if (!ctx) throw new Error('useOrderStore must be used within OrderStoreProvider')
  return ctx
}
