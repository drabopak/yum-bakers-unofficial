'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { clearStaffRole, type StaffRole } from '@/lib/session'
import { ConnectionBadge } from '@/components/ui/connection-badge'
import type { ConnectionStatus } from '@/data/order-store'

export function StaffHeader({
  icon,
  title,
  subtitle,
  role,
  connectionStatus,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  role: StaffRole
  connectionStatus: ConnectionStatus
}) {
  const router = useRouter()

  const handleSignOut = () => {
    clearStaffRole()
    router.push('/staff-login')
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-red-500 text-white">
          {icon}
        </span>
        <div>
          <h1 className="font-serif text-xl font-bold text-stone-800">{title}</h1>
          <p className="text-sm text-stone-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ConnectionBadge status={connectionStatus} />
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          {role} access
        </span>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-200 px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}
