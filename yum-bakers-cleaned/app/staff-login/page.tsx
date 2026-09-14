'use client'

import { useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ChefHat, Truck, ShieldCheck, AlertCircle, ArrowRight, Lock } from 'lucide-react'
import { setStaffRole } from '@/lib/session'

type StaffRoleId = 'chef' | 'delivery' | 'owner'

const ROLE_TABS: { id: StaffRoleId; label: string; icon: typeof ChefHat }[] = [
  { id: 'chef', label: 'Chef', icon: ChefHat },
  { id: 'delivery', label: 'Delivery', icon: Truck },
  { id: 'owner', label: 'Owner', icon: ShieldCheck },
]

const STAFF_USERNAMES: Record<StaffRoleId, string> = {
  chef: 'chef',
  delivery: 'delivery',
  owner: 'owner',
}

const STAFF_PASSKEYS: Record<StaffRoleId, string> = {
  chef: 'CHEF-1234',
  delivery: 'DEL-1234',
  owner: 'OWNER-1234',
}

const STAFF_ROUTES: Record<StaffRoleId, string> = {
  chef: '/chef',
  delivery: '/delivery',
  owner: '/owner',
}

const inputClass =
  'w-full rounded-xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-stone-300">{label}</span>
      {children}
    </label>
  )
}

export default function StaffLoginPage() {
  const router = useRouter()
  const [activeRole, setActiveRole] = useState<StaffRoleId>('chef')
  const [username, setUsername] = useState('')
  const [passkey, setPasskey] = useState('')
  const [error, setError] = useState<string | null>(null)

  const switchRole = (role: StaffRoleId) => {
    setActiveRole(role)
    setError(null)
    setUsername('')
    setPasskey('')
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (username.trim() !== STAFF_USERNAMES[activeRole] || passkey.trim() !== STAFF_PASSKEYS[activeRole]) {
      setError('invalid key')
      return
    }
    setError(null)
    setStaffRole(activeRole)
    router.push(STAFF_ROUTES[activeRole])
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-stone-800 bg-stone-950 shadow-2xl">
        <div className="border-b border-stone-800 bg-gradient-to-r from-amber-600 to-red-600 px-6 py-6 text-center text-white">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="font-serif text-xl font-bold">Staff Access Portal</h1>
          <p className="mt-1 text-xs text-amber-50/90">Authorized personnel only</p>
        </div>

        <div className="grid grid-cols-3 gap-1 border-b border-stone-800 bg-stone-900/60 p-2">
          {ROLE_TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeRole === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => switchRole(id)}
                aria-pressed={isActive}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors ${
                  isActive ? 'bg-red-600 text-white shadow-sm' : 'text-stone-400 hover:bg-stone-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            )
          })}
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm font-medium text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Username">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={STAFF_USERNAMES[activeRole]}
                className={inputClass}
              />
            </Field>
            <Field label="Passkey">
              <input
                type="password"
                required
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="XXXX-1234"
                className={inputClass}
              />
            </Field>
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-transform hover:-translate-y-0.5"
            >
              Enter {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
