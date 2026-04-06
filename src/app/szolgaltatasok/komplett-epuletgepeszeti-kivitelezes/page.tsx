import type { Metadata } from "next"

import { BuildingServicesRequestForm } from "@/components/forms/building-services-request-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createBreadcrumbStructuredData, createServiceStructuredData } from "@/lib/seo/site"

const highlights = [
  "Komplexebb feladatokhoz",
  "Rendezettebb műszaki kép",
  "Jobban előkészített egyeztetés",
]

export const metadata: Metadata = buildPageMetadata({
  title: "Komplett épületgépészeti kivitelezés",
  description:
    "Komplexebb épületgépészeti kivitelezésekhez, felújításokhoz és fürdőszobai gépészeti projektekhez készült megkeresési oldal rendezett műszaki előkészítéssel.",
  path: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
  openGraphTitle: "Komplett épületgépészeti kivitelezés | Imperio Gépészet",
  openGraphDescription:
    "Nagyobb vagy összetettebb épületgépészeti feladatok strukturált megkeresési oldala átláthatóbb előkészítéssel.",
})

export default function BuildingServicesRequestPage() {
  return (
    <>
      <StructuredData
        data={[
          createServiceStructuredData({
            name: "Komplett épületgépészeti kivitelezés",
            description:
              "Komplexebb épületgépészeti kivitelezési, felújítási vagy fürdőszobai gépészeti feladatok strukturált megkereséssel, műszaki előkészítéssel és opcionális képfeltöltéssel.",
            path: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
          }),
          createBreadcrumbStructuredData([
            { name: "Főoldal", path: "/" },
            {
              name: "Komplett épületgépészeti kivitelezés",
              path: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
            },
          ]),
        ]}
      />
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />
        <ServicePageHero
          title="Komplett épületgépészeti kivitelezés"
          intro="Fürdőszoba kiépítéshez, komplett felújításhoz vagy nagyobb, több rendszert érintő épületgépészeti feladatokhoz itt indítható strukturált megkeresés, hogy a projekt jellege, a helyszín és a fő műszaki irány már az első kapcsolatfelvétel előtt tisztábban látszódjon."
          leadTitle="Komplexebb projektmegkeresés rendezettebb indulással"
          leadDescription="A cél, hogy a projekt kerete, a fő érintett területek és az egyeztetéshez szükséges alapadatok már az első körben összeálljanak, így fürdőszobai és nagyobb felújítási feladatoknál is gyorsabb és pontosabb lehessen a következő kapcsolatfelvétel."
          serviceType="komplett_epuletgepeszeti_kivitelezes"
          sourcePage="komplett-epuletgepeszeti-kivitelezes"
          primaryCtaLabel="Megkeresés indítása"
          highlights={highlights}
        />

        <section
          id="urlap"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-20"
        >
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="text-[2rem] font-semibold tracking-tight md:text-4xl">
              Komplex projektmegkeresés indítása
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              A folyamat néhány rövid lépésből áll, és abban segít, hogy a
              komplexebb kivitelezési, fürdőszobai vagy felújítási feladatok
              alapadatai, a fő műszaki irány és az egyeztetési körülmények már
              az első kapcsolatfelvételnél áttekinthetők legyenek.
            </p>
          </Reveal>

          <BuildingServicesRequestForm />
        </section>
      </main>
    </>
  )
}
