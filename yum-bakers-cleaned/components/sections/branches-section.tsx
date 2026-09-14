'use client'

import { MapPin, Phone } from 'lucide-react'
import { branches } from '@/data/yum-data'

export function BranchesSection() {
  return (
    <section id="branches" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 md:py-24">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          Find Us
        </span>
        <h2 className="mt-3 text-balance font-serif text-3xl font-extrabold text-mahogany sm:text-4xl">
          Seven branches, one promise
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-mahogany-soft">
          Tap any branch to call and place your order directly.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <div
            key={branch.name}
            className="flex flex-col rounded-3xl border border-border bg-card p-6 soft-shadow transition-transform hover:-translate-y-1"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-mahogany">{branch.name}</h3>
                <p className="mt-0.5 text-sm text-mahogany-soft">{branch.address}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {branch.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-full bg-mahogany px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-tangerine"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
