export type StaffRole = 'chef' | 'delivery' | 'owner'

const STORAGE_KEY = 'yum-staff-role'

export function setStaffRole(role: StaffRole) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(STORAGE_KEY, role)
}

export function getStaffRole(): StaffRole | null {
  if (typeof window === 'undefined') return null
  const value = window.sessionStorage.getItem(STORAGE_KEY)
  return value === 'chef' || value === 'delivery' || value === 'owner' ? value : null
}

export function clearStaffRole() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(STORAGE_KEY)
}
