import type { Metadata } from "next"

import { HeatingModernizationForm } from "@/components/forms/heating-modernization-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createBreadcrumbStructuredData, createServiceStructuredData } from "@/lib/seo/site"

const highlights = [
  "Átláthatóbb előkészítés",
  "Pontosabb műszaki kép",
  "Gyorsabb első egyeztetés",
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
          intro="Itt indítható el egy strukturált megkeresés, amely fűtésszerelési, karbantartási, átvizsgálási vagy optimalizálási igény esetén is segít előre rögzíteni a rendszer fő jellemzőit és a legfontosabb körülményeket."
          leadTitle="Fűtési rendszerrel kapcsolatos megkeresés rendezett indulással"
          leadDescription="A cél, hogy a műszaki alaphelyzet, az igény fő iránya és a kapcsolódó körülmények már az első kapcsolatfelvétel előtt láthatóvá váljanak, így szerelési, karbantartási vagy átvizsgálási feladatnál is gyorsabb és pontosabb lehessen a következő egyeztetés."
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
              Fűtési rendszerrel kapcsolatos megkeresés
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              A folyamat röviden végigvihető, és segít, hogy a jelenlegi
              rendszer, a szerelési vagy karbantartási igény fő iránya és a
              helyszíni körülmények már az első körben tisztábban látszódjanak.
            </p>
          </Reveal>

          <HeatingModernizationForm />
        </section>
      </main>
    </>
  )
}
