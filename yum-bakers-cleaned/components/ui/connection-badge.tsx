import { Loader2, WifiOff } from 'lucide-react'
import type { ConnectionStatus } from '@/data/order-store'

export function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        Live
      </span>
    )
  }

  if (status === 'connecting') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        <Loader2 className="h-3 w-3 animate-spin" />
        Connecting
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-600">
      <WifiOff className="h-3 w-3" />
      Offline (local only)
    </span>
  )
}
