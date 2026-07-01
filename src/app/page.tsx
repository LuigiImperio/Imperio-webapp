import type { Metadata } from "next"

import { StructuredData } from "@/components/seo/structured-data"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { AboutCondensedSection } from "@/components/sections/about-condensed-section"
import { ContactFooterSection } from "@/components/sections/contact-footer-section"
import { FaqSection } from "@/components/sections/faq-section"
import { HeroSection } from "@/components/sections/hero-section"
import { MobileStickyCtaBar } from "@/components/sections/mobile-sticky-cta-bar"
import { ServicesSection } from "@/components/sections/services-section"
import { SupportersSection } from "@/components/sections/supporters-section"
import { UrgentCalloutSection } from "@/components/sections/urgent-callout-section"
import { ReferenceGallerySection } from "@/components/reference-gallery/reference-gallery-section"
import { ServiceAreaMapSection } from "@/components/service-area-map/service-area-map-section"
import { SystemCrossSectionSection } from "@/components/system-cross-section/system-cross-section-section"
import { homepageMetaDescription } from "@/lib/contact"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createHomepageStructuredData } from "@/lib/seo/site"

export const metadata: Metadata = buildPageMetadata({
  title: "Imperio Gépészet | Épületgépészet Pécsen és környékén",
  description: homepageMetaDescription,
  path: "/",
  keywords: [
    "lakossági épületgépészet",
    "családi ház gépészet",
    "gépészeti kivitelezés Pécs",
    "csőtörés Pécs",
    "kazánjavítás Pécs",
  ],
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
        <UrgentCalloutSection />
        <ServicesSection />
        <SystemCrossSectionSection />
        <AboutCondensedSection />
        <ServiceAreaMapSection />
        <ReferenceGallerySection />
        <FaqSection />
        <ContactFooterSection />
        <MobileStickyCtaBar />
      </main>
      <SupportersSection />
    </>
  )
}
