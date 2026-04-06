import type { Metadata } from "next"

import { StructuredData } from "@/components/seo/structured-data"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { ContactCtaSection } from "@/components/sections/contact-cta-section"
import { FaqSection } from "@/components/sections/faq-section"
import { HeroSection } from "@/components/sections/hero-section"
import { ReferencesSection } from "@/components/sections/references-section"
import { ResidentialCommonWorkSection } from "@/components/sections/residential-common-work-section"
import { ServicesSection } from "@/components/sections/services-section"
import { SupportersSection } from "@/components/sections/supporters-section"
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section"
import { WorkWithUsSection } from "@/components/sections/work-with-us-section"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createHomepageStructuredData } from "@/lib/seo/site"

export const metadata: Metadata = buildPageMetadata({
  title: "Épületgépészet Pécsen és környékén",
  description:
    "Víz-, gáz- és fűtéstechnikai megkeresések, hibabejelentés, kazános feladatok és hőszivattyús előkészítés Pécsen, agglomerációjában, valamint nagyobb budapesti projekteknél.",
  path: "/",
  openGraphTitle: "Imperio Gépészet | Épületgépészet Pécsen és környékén",
  openGraphDescription:
    "Épületgépészeti megoldások víz-, gáz- és fűtéstechnikai területen, strukturált megkereséssel és helyi fókuszú szolgáltatási lefedettséggel.",
})

export default function HomePage() {
  return (
    <>
      <StructuredData data={createHomepageStructuredData()} />
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />
        <HeroSection />
        <ResidentialCommonWorkSection />
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
