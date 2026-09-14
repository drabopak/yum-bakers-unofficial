import type { ReactNode } from 'react'

type MetricAccent = 'amber' | 'red' | 'emerald'

const ACCENT_GRADIENTS: Record<MetricAccent, string> = {
  amber: 'from-amber-500 to-orange-500',
  red: 'from-red-500 to-orange-500',
  emerald: 'from-emerald-500 to-teal-500',
}

export function MetricCard({
  icon,
  label,
  value,
  accent = 'amber',
}: {
  icon: ReactNode
  label: string
  value: string
  accent?: MetricAccent
}) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
      <span
        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white ${ACCENT_GRADIENTS[accent]}`}
      >
        {icon}
      </span>
      <p className="mt-4 text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-1 font-serif text-2xl font-bold text-stone-800">{value}</p>
    </div>
  )
}
