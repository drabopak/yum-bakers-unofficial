'use client'

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { categories, type MenuItem } from '@/data/yum-data'
import { useCart, formatRs } from '@/components/cart/cart-context'
import { playAdd, playTick } from '@/lib/sounds'

export function MenuSection() {
  const [active, setActive] = useState(categories[0].id)
  const activeCategory = categories.find((c) => c.id === active) ?? categories[0]

  return (
    <section id="menu" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6 md:py-24">
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          Our Counters
        </span>
        <h2 className="mt-3 text-balance font-serif text-3xl font-extrabold text-mahogany sm:text-4xl">
          Fresh from the four counters
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-mahogany-soft">
          Pick a category to see what&apos;s on today.
        </p>
      </div>

      {/* Category tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {categories.map((cat) => {
          const isActive = cat.id === active
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActive(cat.id)
                playTick()
              }}
              aria-pressed={isActive}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-tangerine text-cream shadow-[0_12px_24px_rgba(228,87,46,0.3)]'
                  : 'border border-border bg-card text-mahogany hover:border-gold hover:text-tangerine'
              }`}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      <p className="mt-6 text-center font-serif text-lg italic text-mahogany-soft">
        {activeCategory.tagline}
      </p>

      {/* Grid */}
      <div
        key={activeCategory.id}
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {activeCategory.items.map((item, i) => (
          <MenuCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    add(item)
    playAdd()
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article
      className="tilt-card fade-up group flex flex-col overflow-hidden rounded-3xl border border-border bg-card soft-shadow"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative h-52 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute right-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-sm font-bold text-tangerine shadow-sm">
          {formatRs(item.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-bold text-mahogany">{item.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-mahogany-soft">{item.description}</p>

        <button
          type="button"
          onClick={handleAdd}
          aria-live="polite"
          className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
            added
              ? 'bg-tangerine text-cream'
              : 'bg-gold text-mahogany hover:bg-tangerine hover:text-cream'
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={2.5} />
              Added!
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  )
}
