import type { Metadata } from "next"

import { BuildingServicesRequestForm } from "@/components/forms/building-services-request-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createBreadcrumbStructuredData, createServiceStructuredData } from "@/lib/seo/site"

const highlights = [
  "Nagyobb munkákhoz",
  "Fő műszaki irány",
  "Képes kiegészítés",
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
          intro="Itt indítható el a nagyobb vagy összetettebb épületgépészeti megkeresés."
          leadTitle="Komplex megkeresés röviden"
          leadDescription="A projekt fő adataiból gyorsan látszik, miről van szó."
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
              Épületgépészeti megkeresés
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              Adja meg a fő adatokat, és már küldhető is a megkeresés.
            </p>
          </Reveal>

          <BuildingServicesRequestForm />
        </section>
      </main>
    </>
  )
}
