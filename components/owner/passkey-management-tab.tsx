'use client'

import { useState } from 'react'
import { Plus, Trash2, Power, X, AlertCircle, Loader2, KeyRound } from 'lucide-react'
import { usePasskeyStore, type PasskeyRow } from '@/data/passkey-store'
import type { StaffRole } from '@/lib/session'

const ROLE_OPTIONS: { id: StaffRole; label: string }[] = [
  { id: 'chef', label: 'Chef' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'owner', label: 'Owner' },
]

const ROLE_ICONS: Record<StaffRole, string> = {
  chef: '👨‍🍳',
  delivery: '🚚',
  owner: '🛡️',
}

const inputClass =
  'w-full rounded-xl border border-amber-200 bg-amber-50/40 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-200'

export function PasskeyManagementTab() {
  const { passkeys, addPasskey, revokePasskey, deletePasskey } = usePasskeyStore()
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const role = form.get('role') as StaffRole
    const passkey = (form.get('passkey') as string).trim()
    const label = (form.get('label') as string).trim()

    if (!passkey || !label) {
      setError('Passkey and label are required')
      return
    }
    if (passkey.length < 4) {
      setError('Passkey must be at least 4 characters')
      return
    }

    setSaving(true)
    setError(null)
    const { error: err } = await addPasskey({ role, passkey, label })
    setSaving(false)
    if (err) {
      setError(err)
      return
    }
    setShowForm(false)
  }

  const handleRevoke = async (id: string) => {
    setSaving(true)
    const { error: err } = await revokePasskey(id)
    setSaving(false)
    if (err) setError(err)
  }

  const handleDelete = async (id: string) => {
    setSaving(true)
    const { error: err } = await deletePasskey(id)
    setSaving(false)
    if (err) {
      setError(err)
      return
    }
    setConfirmDelete(null)
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
          Staff Passkeys ({passkeys.length})
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-amber-700"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Passkey'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5"
        >
          <h3 className="mb-4 font-serif text-base font-bold text-stone-800">New Passkey</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-stone-700">Role</span>
              <select name="role" required className={inputClass} defaultValue="chef">
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-stone-700">Passkey</span>
              <input name="passkey" required className={inputClass} placeholder="e.g. CHEF-5678" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-stone-700">Label</span>
              <input name="label" required className={inputClass} placeholder="e.g. Chef - Morning Shift" />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            Create Passkey
          </button>
        </form>
      )}

      <div className="space-y-3">
        {ROLE_OPTIONS.map(({ id: roleId, label: roleLabel }) => {
          const rolePasskeys = passkeys.filter((p) => p.role === roleId)
          return (
            <div key={roleId} className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-serif text-base font-bold text-stone-800">
                <span>{ROLE_ICONS[roleId]}</span>
                {roleLabel} Passkeys
                <span className="text-sm font-normal text-stone-500">({rolePasskeys.length})</span>
              </h3>
              {rolePasskeys.length === 0 ? (
                <p className="mt-3 text-sm text-stone-500">No passkeys for this role.</p>
              ) : (
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {rolePasskeys.map((pk: PasskeyRow) => (
                    <div
                      key={pk.id}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                        pk.is_active
                          ? 'border-amber-100 bg-amber-50/50'
                          : 'border-stone-200 bg-stone-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-stone-700">{pk.label}</p>
                        <code className="text-xs font-bold tracking-wide text-red-600">
                          {pk.passkey}
                        </code>
                        {!pk.is_active && (
                          <span className="ml-2 text-xs font-semibold text-stone-400">Revoked</span>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {confirmDelete === pk.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDelete(pk.id)}
                              disabled={saving}
                              className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                              {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Confirm'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(null)}
                              className="rounded-lg border border-stone-300 px-2.5 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {pk.is_active && (
                              <button
                                type="button"
                                onClick={() => handleRevoke(pk.id)}
                                disabled={saving}
                                title="Revoke (deactivate)"
                                className="rounded-lg border border-amber-200 px-2 py-1.5 text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                              >
                                <Power className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setConfirmDelete(pk.id)}
                              title="Delete permanently"
                              className="rounded-lg border border-red-200 px-2 py-1.5 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
