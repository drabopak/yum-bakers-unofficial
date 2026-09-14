'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStaffRole, type StaffRole } from '@/lib/session'

/**
 * Guards a staff dashboard route. Returns true once the current session
 * matches the required role; otherwise redirects to /staff-login (the
 * hidden staff entry point — /login is customer-only) and returns false so
 * the caller can render nothing (or a loading state) until then.
 */
export function useRoleGuard(role: StaffRole) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (getStaffRole() !== role) {
      router.replace('/staff-login')
      return
    }
    setAuthorized(true)
  }, [role, router])

  return authorized
}
