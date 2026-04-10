import type { Metadata } from "next"

import { HeatingModernizationForm } from "@/components/forms/heating-modernization-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createBreadcrumbStructuredData, createServiceStructuredData } from "@/lib/seo/site"

const highlights = [
  "Gyors indulás",
  "Tisztább helyzetkép",
  "Kevesebb kör",
]

export const metadata: Metadata = buildPageMetadata({
  title: "Fűtési rendszerek megkeresése",
  description:
    "Fűtésszerelési, karbantartási, átvizsgálási és optimalizálási megkeresés strukturált adatbekéréssel, elsősorban Pécs és agglomerációja területén.",
  path: "/szolgaltatasok/futeskorszerusites",
  openGraphTitle: "Fűtési rendszerek megkeresése | Imperio Gépészet",
  openGraphDescription:
    "Fűtési rendszerekhez kapcsolódó szerelési, karbantartási vagy optimalizálási megkeresés rendezett első adatbekéréssel.",
})

export default function HeatingModernizationPage() {
  return (
    <>
      <StructuredData
        data={[
          createServiceStructuredData({
            name: "Fűtési rendszerek",
            description:
              "Fűtési rendszerekhez kapcsolódó karbantartási, optimalizálási vagy szerelési megkeresés strukturált adatbekéréssel és átláthatóbb egyeztetéssel.",
            path: "/szolgaltatasok/futeskorszerusites",
          }),
          createBreadcrumbStructuredData([
            { name: "Főoldal", path: "/" },
            { name: "Fűtési rendszerek", path: "/szolgaltatasok/futeskorszerusites" },
          ]),
        ]}
      />
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />
        <ServicePageHero
          title="Fűtési rendszerek"
          intro="Itt indítható el a fűtési munkával kapcsolatos megkeresés."
          leadTitle="Fűtési megkeresés röviden"
          leadDescription="A fő adatokból gyorsan látszik, miről van szó. A hiányzó részleteket később is megadhatja."
          serviceType="futeskorszerusites"
          sourcePage="futeskorszerusites"
          primaryCtaLabel="Megkeresés indítása"
          highlights={highlights}
        />

        <section
          id="urlap"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-20"
        >
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="text-[2rem] font-semibold tracking-tight md:text-4xl">
              Fűtési megkeresés
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              Néhány adat megadása után elküldheti a megkeresést.
            </p>
          </Reveal>

          <HeatingModernizationForm />
        </section>
      </main>
    </>
  )
}
