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
import type { StaffRole } from '@/lib/session'

export type PasskeyRow = {
  id: string
  role: StaffRole
  passkey: string
  label: string
  is_active: boolean
  created_at: string
}

export type PasskeyInput = {
  role: StaffRole
  passkey: string
  label: string
}

type PasskeyStoreValue = {
  passkeys: PasskeyRow[]
  loading: boolean
  addPasskey: (input: PasskeyInput) => Promise<{ error: string | null }>
  updatePasskey: (id: string, patch: { label?: string; passkey?: string }) => Promise<{ error: string | null }>
  revokePasskey: (id: string) => Promise<{ error: string | null }>
  deletePasskey: (id: string) => Promise<{ error: string | null }>
  validatePasskey: (role: StaffRole, passkey: string) => Promise<PasskeyRow | null>
}

const PasskeyStoreContext = createContext<PasskeyStoreValue | null>(null)

export function PasskeyStoreProvider({ children }: { children: ReactNode }) {
  const [passkeys, setPasskeys] = useState<PasskeyRow[]>([])
  const [loading, setLoading] = useState(true)

  const mergePasskey = useCallback((incoming: PasskeyRow) => {
    setPasskeys((prev) => {
      const index = prev.findIndex((p) => p.id === incoming.id)
      if (index === -1) return [incoming, ...prev]
      const next = [...prev]
      next[index] = incoming
      return next
    })
  }, [])

  const removePasskey = useCallback((id: string) => {
    setPasskeys((prev) => prev.filter((p) => p.id !== id))
  }, [])

  useEffect(() => {
    let active = true
    let channel: RealtimeChannel | null = null

    async function load() {
      const { data, error } = await supabase
        .from('staff_passkeys')
        .select('*')
        .order('created_at', { ascending: true })

      if (!active) return
      if (error) {
        console.error('[passkey-store] failed to load:', error.message)
        setLoading(false)
        return
      }
      setPasskeys((data as PasskeyRow[]) ?? [])
      setLoading(false)
    }

    load()

    channel = supabase
      .channel('staff-passkeys-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'staff_passkeys' },
        (payload) => mergePasskey(payload.new as PasskeyRow),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'staff_passkeys' },
        (payload) => mergePasskey(payload.new as PasskeyRow),
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'staff_passkeys' },
        (payload) => removePasskey((payload.old as { id: string }).id),
      )
      .subscribe()

    return () => {
      active = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [mergePasskey, removePasskey])

  const addPasskey = useCallback(
    async (input: PasskeyInput): Promise<{ error: string | null }> => {
      const { error } = await supabase.from('staff_passkeys').insert({
        role: input.role,
        passkey: input.passkey,
        label: input.label,
      })
      if (error) return { error: error.message }
      return { error: null }
    },
    [],
  )

  const updatePasskey = useCallback(
    async (id: string, patch: { label?: string; passkey?: string }): Promise<{ error: string | null }> => {
      const update: Record<string, unknown> = {}
      if (patch.label !== undefined) update.label = patch.label
      if (patch.passkey !== undefined) update.passkey = patch.passkey

      const { error } = await supabase.from('staff_passkeys').update(update).eq('id', id)
      if (error) return { error: error.message }
      return { error: null }
    },
    [],
  )

  const revokePasskey = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      const { error } = await supabase
        .from('staff_passkeys')
        .update({ is_active: false })
        .eq('id', id)
      if (error) return { error: error.message }
      return { error: null }
    },
    [],
  )

  const deletePasskey = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.from('staff_passkeys').delete().eq('id', id)
      if (error) return { error: error.message }
      return { error: null }
    },
    [],
  )

  const validatePasskey = useCallback(
    async (role: StaffRole, passkey: string): Promise<PasskeyRow | null> => {
      const { data, error } = await supabase
        .from('staff_passkeys')
        .select('*')
        .eq('role', role)
        .eq('passkey', passkey)
        .eq('is_active', true)
        .maybeSingle()

      if (error || !data) return null
      return data as PasskeyRow
    },
    [],
  )

  const value = useMemo<PasskeyStoreValue>(
    () => ({
      passkeys,
      loading,
      addPasskey,
      updatePasskey,
      revokePasskey,
      deletePasskey,
      validatePasskey,
    }),
    [passkeys, loading, addPasskey, updatePasskey, revokePasskey, deletePasskey, validatePasskey],
  )

  return <PasskeyStoreContext.Provider value={value}>{children}</PasskeyStoreContext.Provider>
}

export function usePasskeyStore() {
  const ctx = useContext(PasskeyStoreContext)
  if (!ctx) throw new Error('usePasskeyStore must be used within PasskeyStoreProvider')
  return ctx
}
