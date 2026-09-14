export function SiteFooter() {
  return (
    <footer className="bg-mahogany text-cream">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-2xl font-bold text-mahogany font-serif">
            Y
          </span>
          <h3 className="font-serif text-2xl font-bold">Yum Bakers &amp; Sweets</h3>
          <p className="max-w-md text-sm leading-relaxed text-cream/70">
            Baking happy moments since 1998. Customized cakes, mithai, crispy fried chicken and
            fresh dairy — Pure for Sure.
          </p>
          <nav className="mt-2 flex flex-wrap justify-center gap-6 text-sm font-medium">
            <a href="#menu" className="text-cream/80 transition-colors hover:text-gold">
              Menu
            </a>
            <a href="#inquiry" className="text-cream/80 transition-colors hover:text-gold">
              Event Planning
            </a>
            <a href="#branches" className="text-cream/80 transition-colors hover:text-gold">
              Branches
            </a>
          </nav>
        </div>
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-cream/15 pt-6 text-center text-xs text-cream/60">
          <span>© {new Date().getFullYear()} Yum Bakers &amp; Sweets. All rights reserved.</span>
          <a href="/staff-login" className="text-cream/25 transition-colors hover:text-cream/50">
            Staff Portal
          </a>
        </div>
      </div>
    </footer>
  )
}
