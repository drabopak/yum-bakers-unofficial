export type StaffRole = 'chef' | 'delivery' | 'owner'

export type StaffSession = {
  role: StaffRole
  label: string
}

const ROLE_KEY = 'yum-staff-role'
const LABEL_KEY = 'yum-staff-label'

export function setStaffRole(role: StaffRole, label: string) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(ROLE_KEY, role)
  window.sessionStorage.setItem(LABEL_KEY, label)
}

export function getStaffRole(): StaffRole | null {
  if (typeof window === 'undefined') return null
  const value = window.sessionStorage.getItem(ROLE_KEY)
  return value === 'chef' || value === 'delivery' || value === 'owner' ? value : null
}

export function getStaffLabel(): string | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(LABEL_KEY)
}

export function clearStaffRole() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(ROLE_KEY)
  window.sessionStorage.removeItem(LABEL_KEY)
}
