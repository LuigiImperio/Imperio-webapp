import type { Metadata } from "next"

import { BuildingServicesRequestForm } from "@/components/forms/building-services-request-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageDetailsSection } from "@/components/sections/service-page-details-section"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { servicePageContents } from "@/lib/content/service-pages"
import { buildPageMetadata } from "@/lib/seo/metadata"
import {
  createBreadcrumbStructuredData,
  createFaqStructuredData,
  createServiceStructuredData,
} from "@/lib/seo/site"

const pageContent = servicePageContents.komplettEpuletgepeszetiKivitelezes

export const metadata: Metadata = buildPageMetadata(pageContent.metadata)

export default function BuildingServicesRequestPage() {
  return (
    <>
      <StructuredData
        data={[
          createServiceStructuredData({
            name: pageContent.structuredData.name,
            description: pageContent.structuredData.description,
            path: pageContent.path,
          }),
          createFaqStructuredData(pageContent.details.faqs),
          createBreadcrumbStructuredData([
            { name: "Főoldal", path: "/" },
            {
              name: pageContent.hero.title,
              path: pageContent.path,
            },
          ]),
        ]}
      />
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />
        <ServicePageHero
          title={pageContent.hero.title}
          intro={pageContent.hero.intro}
          leadTitle={pageContent.hero.leadTitle}
          leadDescription={pageContent.hero.leadDescription}
          serviceType={pageContent.serviceType}
          sourcePage={pageContent.sourcePage}
          primaryCtaLabel={pageContent.hero.primaryCtaLabel}
          highlights={pageContent.hero.highlights}
        />
        <ServicePageDetailsSection
          eyebrow={pageContent.details.eyebrow}
          title={pageContent.details.title}
          intro={pageContent.details.intro}
          clusters={pageContent.details.clusters}
          localNoteTitle={pageContent.details.localNoteTitle}
          localNote={pageContent.details.localNote}
          relatedLinks={pageContent.details.relatedLinks}
          faqs={pageContent.details.faqs}
          sourcePage={pageContent.sourcePage}
          serviceType={pageContent.serviceType}
        />

        <section
          id="urlap"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-20"
        >
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="text-[2rem] font-semibold tracking-tight md:text-4xl">
              {pageContent.formSection.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              {pageContent.formSection.intro}
            </p>
          </Reveal>

          <BuildingServicesRequestForm />
        </section>
      </main>
    </>
  )
}
