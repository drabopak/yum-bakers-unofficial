'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase-client'

export type MenuCategory = 'cakes' | 'mithai' | 'chicken' | 'dairy'

export type MenuRow = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  is_available: boolean
  created_at: string
}

export type MenuInput = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  is_available?: boolean
}

type MenuStoreValue = {
  items: MenuRow[]
  loading: boolean
  addItem: (input: MenuInput) => Promise<{ error: string | null }>
  updateItem: (id: string, patch: Partial<MenuInput>) => Promise<{ error: string | null }>
  deleteItem: (id: string) => Promise<{ error: string | null }>
  toggleAvailable: (id: string, available: boolean) => Promise<{ error: string | null }>
}

const MenuStoreContext = createContext<MenuStoreValue | null>(null)

export function MenuStoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuRow[]>([])
  const [loading, setLoading] = useState(true)

  const mergeItem = useCallback((incoming: MenuRow) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === incoming.id)
      if (index === -1) return [incoming, ...prev]
      const next = [...prev]
      next[index] = incoming
      return next
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  useEffect(() => {
    let active = true
    let channel: RealtimeChannel | null = null

    async function load() {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: true })

      if (!active) return
      if (error) {
        console.error('[menu-store] failed to load:', error.message)
        setLoading(false)
        return
      }
      setItems((data as MenuRow[]) ?? [])
      setLoading(false)
    }

    load()

    channel = supabase
      .channel('menu-items-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'menu_items' },
        (payload) => mergeItem(payload.new as MenuRow),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'menu_items' },
        (payload) => mergeItem(payload.new as MenuRow),
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'menu_items' },
        (payload) => removeItem((payload.old as { id: string }).id),
      )
      .subscribe()

    return () => {
      active = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [mergeItem, removeItem])

  const addItem = useCallback(
    async (input: MenuInput): Promise<{ error: string | null }> => {
      const { error } = await supabase.from('menu_items').insert({
        id: input.id,
        name: input.name,
        description: input.description,
        price: input.price,
        category: input.category,
        image: input.image,
        is_available: input.is_available ?? true,
      })
      if (error) return { error: error.message }
      return { error: null }
    },
    [],
  )

  const updateItem = useCallback(
    async (id: string, patch: Partial<MenuInput>): Promise<{ error: string | null }> => {
      const update: Record<string, unknown> = {}
      if (patch.name !== undefined) update.name = patch.name
      if (patch.description !== undefined) update.description = patch.description
      if (patch.price !== undefined) update.price = patch.price
      if (patch.category !== undefined) update.category = patch.category
      if (patch.image !== undefined) update.image = patch.image
      if (patch.is_available !== undefined) update.is_available = patch.is_available

      const { error } = await supabase.from('menu_items').update(update).eq('id', id)
      if (error) return { error: error.message }
      return { error: null }
    },
    [],
  )

  const deleteItem = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.from('menu_items').delete().eq('id', id)
      if (error) return { error: error.message }
      return { error: null }
    },
    [],
  )

  const toggleAvailable = useCallback(
    async (id: string, available: boolean): Promise<{ error: string | null }> => {
      const { error } = await supabase
        .from('menu_items')
        .update({ is_available: available })
        .eq('id', id)
      if (error) return { error: error.message }
      return { error: null }
    },
    [],
  )

  const value = useMemo<MenuStoreValue>(
    () => ({ items, loading, addItem, updateItem, deleteItem, toggleAvailable }),
    [items, loading, addItem, updateItem, deleteItem, toggleAvailable],
  )

  return <MenuStoreContext.Provider value={value}>{children}</MenuStoreContext.Provider>
}

export function useMenuStore() {
  const ctx = useContext(MenuStoreContext)
  if (!ctx) throw new Error('useMenuStore must be used within MenuStoreProvider')
  return ctx
}
