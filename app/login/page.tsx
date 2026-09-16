'use client'

import { Suspense, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, ArrowRight, Lock, Phone, User } from 'lucide-react'
import { useAuth } from '@/context/auth-context'

const inputClass =
  'w-full rounded-xl border border-amber-200 bg-amber-50/40 py-3 pl-10 pr-4 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-200'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  // Where to send the customer after signing in. Set by the cart drawer
  // when an unauthenticated checkout attempt redirects here.
  const cameFromCheckout = searchParams.has('redirect')
  const redirectTarget = searchParams.get('redirect') || '/'

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('atleast 6 digits')
      return
    }
    setError(null)
    login({ phone, name: name.trim() || phone })
    router.push(redirectTarget)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-xl shadow-amber-900/5">
        <div className="border-b border-amber-100 bg-gradient-to-r from-amber-500 to-red-500 px-6 py-8 text-center text-white">
          <h1 className="font-serif text-2xl font-bold">Yum Bakers &amp; Sweets</h1>
          <p className="mt-1 text-sm text-amber-50">Sign in to your account</p>
        </div>

        <div className="p-6 sm:p-8">
          {cameFromCheckout && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Log in to finish placing your order.
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-stone-700">Full Name</span>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-stone-700">Phone Number</span>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03xx-xxxxxxx"
                  className={inputClass}
                />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-stone-700">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className={inputClass}
                />
              </div>
            </label>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-transform hover:-translate-y-0.5 hover:bg-red-700"
            >
              Login / Register
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-xs text-stone-500">
              New here? Signing in creates your account automatically.
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
