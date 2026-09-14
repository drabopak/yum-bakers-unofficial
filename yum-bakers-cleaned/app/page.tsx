import { Navbar } from '@/components/layout/navbar'
import { Hero } from '@/components/sections/hero'
import { MenuSection } from '@/components/sections/menu-section'
import { ContactSection } from '@/components/sections/contact-section'
import { BranchesSection } from '@/components/sections/branches-section'
import { SiteFooter } from '@/components/layout/site-footer'

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MenuSection />
        <ContactSection />
        <BranchesSection />
      </main>
      <SiteFooter />
    </>
  )
}
