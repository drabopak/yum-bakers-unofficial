'use client'

import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { branchNames } from '@/data/yum-data'
import { playSuccess } from '@/lib/sounds'

const eventTypes = [
  'Birthday',
  'Valima / Wedding',
  'Corporate / Office Order',
  'Party Box',
  'General Query',
]

export function ContactSection() {
  const [showToast, setShowToast] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    playSuccess()
    setShowToast(true)
    e.currentTarget.reset()
    setTimeout(() => setShowToast(false), 4000)
  }

  return (
    <section id="inquiry" className="scroll-mt-20 px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-border bg-card soft-shadow-lg">
        <div className="bg-gold/12 px-6 py-8 text-center sm:px-10">
          <h2 className="text-balance font-serif text-3xl font-extrabold text-mahogany sm:text-4xl">
            Planning something? Tell us.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-mahogany-soft">
            Birthday, Valima, office order, or custom catering? Send a note and your nearest branch
            will call you back.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 sm:p-10">
          <Field label="Full Name">
            <input type="text" name="fullName" placeholder="Your name" className={inputClass} />
          </Field>

          <Field label="Email Address" required>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </Field>

          <Field label="Phone Number">
            <input type="tel" name="phone" placeholder="03xx-xxxxxxx" className={inputClass} />
          </Field>

          <Field label="Event Type / Occasion">
            <select name="eventType" defaultValue="" className={inputClass}>
              <option value="" disabled>
                Select occasion
              </option>
              {eventTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Preferred Branch" className="sm:col-span-2">
            <select name="branch" defaultValue="" className={inputClass}>
              <option value="" disabled>
                Choose your nearest branch
              </option>
              {branchNames.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Message / Special Instructions" className="sm:col-span-2">
            <textarea
              name="message"
              rows={4}
              placeholder="Describe your cake design, catering quantity, or custom order requirements..."
              className={`${inputClass} resize-none`}
            />
          </Field>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-tangerine px-8 py-4 text-sm font-semibold text-cream shadow-[0_14px_30px_rgba(228,87,46,0.3)] transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              <Send className="h-4 w-4" />
              Send a Message
            </button>
          </div>
        </form>
      </div>

      {showToast && (
        <div className="toast-in fixed bottom-6 left-1/2 z-[60] max-w-[90vw] rounded-2xl bg-mahogany px-6 py-4 text-center text-sm font-medium text-cream shadow-2xl">
          Thank you! Your nearest YUM branch will call you back shortly.
        </div>
      )}
    </section>
  )
}

const inputClass =
  'w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm text-mahogany placeholder:text-mahogany-soft/60 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30'

function Field({
  label,
  required,
  className = '',
  children,
}: {
  label: string
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-semibold text-mahogany">
        {label}
        {required && <span className="text-tangerine"> *</span>}
      </span>
      {children}
    </label>
  )
}
