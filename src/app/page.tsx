import type { Metadata } from "next"

import { StructuredData } from "@/components/seo/structured-data"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { ContactCtaSection } from "@/components/sections/contact-cta-section"
import { FaqSection } from "@/components/sections/faq-section"
import { HeroSection } from "@/components/sections/hero-section"
import { HomepageSearchIntentsSection } from "@/components/sections/homepage-search-intents-section"
import { MobileStickyCtaBar } from "@/components/sections/mobile-sticky-cta-bar"
import { ReferencesSection } from "@/components/sections/references-section"
import { ResidentialCommonWorkSection } from "@/components/sections/residential-common-work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { SupportersSection } from "@/components/sections/supporters-section"
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section"
import { WorkWithUsSection } from "@/components/sections/work-with-us-section"
import { homepageMetaDescription } from "@/lib/contact"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createHomepageStructuredData } from "@/lib/seo/site"

export const metadata: Metadata = buildPageMetadata({
  title: "Épületgépészet Pécsen és környékén",
  description: homepageMetaDescription,
  path: "/",
  openGraphTitle: "Imperio Gépészet | Épületgépészet Pécsen és környékén",
  openGraphDescription:
    "Épületgépészet, víz-, gáz- és fűtésszerelés, sürgős hibák és projektjellegű megkeresések Pécsen és környékén, természetes helyi relevanciával.",
})

export default function HomePage() {
  return (
    <>
      <StructuredData data={createHomepageStructuredData()} />
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />
        <HeroSection />
        <MobileStickyCtaBar />
        <ResidentialCommonWorkSection />
        <HomepageSearchIntentsSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <WorkWithUsSection />
        <ReferencesSection />
        <FaqSection />
        <ContactCtaSection />
      </main>
      <SupportersSection />
    </>
  )
}
