'use client'

import { Sparkles, ChevronDown } from 'lucide-react'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* warm gradient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 55% at 82% 18%, rgba(224,159,62,0.20), transparent 60%), radial-gradient(50% 50% at 10% 90%, rgba(228,87,46,0.12), transparent 55%)',
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 lg:gap-6">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft/50 px-4 py-1.5 text-sm font-semibold text-mahogany">
            <Sparkles className="h-4 w-4 text-gold" />
            Since 1998 — Pure for Sure
          </span>

          <h1 className="mt-6 text-balance font-serif text-4xl font-extrabold leading-[1.05] text-mahogany sm:text-5xl lg:text-6xl">
            Celebrate Your Happy Moments With{' '}
            <span className="text-tangerine">YUM!</span>
          </h1>

          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-mahogany-soft sm:text-lg">
            What we bake, fry and serve fresh. Four counters, one bakery. Pick a category to see
            what&apos;s on today.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full bg-tangerine px-7 py-3.5 text-sm font-semibold text-cream shadow-[0_14px_30px_rgba(228,87,46,0.35)] transition-transform hover:-translate-y-0.5 hover:scale-[1.03]"
            >
              Explore the Menu
              <ChevronDown className="h-4 w-4" />
            </a>
            <a
              href="#inquiry"
              className="inline-flex items-center rounded-full border-2 border-gold bg-transparent px-7 py-3.5 text-sm font-semibold text-mahogany transition-colors hover:bg-gold/15"
            >
              Plan an Event
            </a>
          </div>

          <div className="mt-10 flex items-center gap-8">
            <Stat value="7" label="Branches" />
            <span className="h-10 w-px bg-border" />
            <Stat value="25+" label="Years fresh" />
            <span className="h-10 w-px bg-border" />
            <Stat value="4" label="Counters" />
          </div>
        </div>

        {/* Floating 3D image cluster */}
        <div className="relative h-[360px] sm:h-[440px] md:h-[520px]">
          <FloatImage
            src="/images/celebration-cake.png"
            alt="Custom celebration cake"
            className="left-2 top-2 h-56 w-56 blob-1 float-a sm:h-64 sm:w-64"
          />
          <FloatImage
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
            alt="Wood-fired pizza"
            className="right-0 top-16 h-48 w-48 blob-2 float-b sm:h-56 sm:w-56"
          />
          <FloatImage
            src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
            alt="Gulab jamun mithai"
            className="bottom-2 left-16 h-44 w-44 blob-3 float-b sm:h-52 sm:w-52"
          />
          <FloatImage
            src="https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=600&q=80"
            alt="Crispy fried chicken combo"
            className="bottom-8 right-6 h-40 w-40 blob-1 float-a sm:h-48 sm:w-48"
          />
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-2xl font-bold text-gold">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-mahogany-soft">{label}</div>
    </div>
  )
}

function FloatImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className: string
}) {
  return (
    <div className={`absolute overflow-hidden bg-card soft-shadow-lg ring-4 ring-cream ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        loading="eager"
        className="h-full w-full object-cover"
      />
    </div>
  )
}
