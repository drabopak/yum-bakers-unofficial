'use client'

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { useMenuStore, type MenuRow } from '@/data/menu-store'
import { useCart, formatRs } from '@/components/cart/cart-context'
import { playAdd, playTick } from '@/lib/sounds'

const CATEGORY_META: Record<string, { label: string; tagline: string }> = {
  cakes: { label: 'Customized Cakes', tagline: 'Baked fresh for every happy moment' },
  mithai: { label: 'Mithai & Sweets', tagline: 'Traditional desi mithai, made pure' },
  chicken: { label: 'Crispy Fried Chicken', tagline: 'Hot, crunchy and freshly fried' },
  dairy: { label: 'Fresh Dairy & Honey', tagline: 'Pure refreshments from our farm counter' },
}

const CATEGORY_ORDER = ['cakes', 'mithai', 'chicken', 'dairy']

export function MenuSection() {
  const { items, loading } = useMenuStore()
  const [active, setActive] = useState('cakes')

  const availableItems = items.filter((item) => item.is_available)
  const categoriesWithData = CATEGORY_ORDER.filter((cat) =>
    availableItems.some((item) => item.category === cat),
  )
  const activeCategory = categoriesWithData.includes(active) ? active : categoriesWithData[0] ?? 'cakes'
  const activeItems = availableItems.filter((item) => item.category === activeCategory)
  const meta = CATEGORY_META[activeCategory] ?? { label: activeCategory, tagline: '' }

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
        {CATEGORY_ORDER.map((catId) => {
          const isActive = catId === activeCategory
          return (
            <button
              key={catId}
              type="button"
              onClick={() => {
                setActive(catId)
                playTick()
              }}
              aria-pressed={isActive}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-tangerine text-cream shadow-[0_12px_24px_rgba(228,87,46,0.3)]'
                  : 'border border-border bg-card text-mahogany hover:border-gold hover:text-tangerine'
              }`}
            >
              {CATEGORY_META[catId]?.label ?? catId}
            </button>
          )
        })}
      </div>

      <p className="mt-6 text-center font-serif text-lg italic text-mahogany-soft">
        {meta.tagline}
      </p>

      {/* Grid */}
      <div
        key={activeCategory}
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {loading ? (
          <div className="col-span-full py-16 text-center text-sm text-mahogany-soft">
            Loading menu...
          </div>
        ) : activeItems.length === 0 ? (
          <div className="col-span-full py-16 text-center text-sm text-mahogany-soft">
            No items available in this category right now.
          </div>
        ) : (
          activeItems.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} />
          ))
        )}
      </div>
    </section>
  )
}

function MenuCard({ item, index }: { item: MenuRow; index: number }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    add({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
    })
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
