import type { Metadata } from "next"

import { LeakRequestForm } from "@/components/forms/leak-request-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createBreadcrumbStructuredData, createServiceStructuredData } from "@/lib/seo/site"

const highlights = [
  "Gyors helyzetkép",
  "Tisztább indulás",
  "Képes kiegészítés",
]

export const metadata: Metadata = buildPageMetadata({
  title: "Csőtörés és szivárgás bejelentése",
  description:
    "Gyors csőtörés- és szivárgás-bejelentés célzott triage kérdésekkel, képfeltöltéssel és kapcsolatfelvételi adatokkal, elsősorban Pécsen és környékén.",
  path: "/szolgaltatasok/csotores-szivargas",
  openGraphTitle: "Csőtörés és szivárgás bejelentése | Imperio Gépészet",
  openGraphDescription:
    "Gyors, célzott megkeresési oldal csőtöréshez és szivárgáshoz rövid helyzetfelméréssel és átlátható első egyeztetéssel.",
})

export default function LeakRequestPage() {
  return (
    <>
      <StructuredData
        data={[
          createServiceStructuredData({
            name: "Csőtörés / szivárgás",
            description:
              "Csőtöréshez vagy szivárgáshoz készült célzott megkeresési oldal gyors helyzetfelméréssel és opcionális képfeltöltéssel.",
            path: "/szolgaltatasok/csotores-szivargas",
          }),
          createBreadcrumbStructuredData([
            { name: "Főoldal", path: "/" },
            { name: "Csőtörés / szivárgás", path: "/szolgaltatasok/csotores-szivargas" },
          ]),
        ]}
      />
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />
        <ServicePageHero
          title="Csőtörés / szivárgás"
          intro="Itt gyorsan jelezheti a csőtörést vagy a szivárgást."
          leadTitle="Rövid bejelentés csőtöréshez"
          leadDescription="A fő adatokból gyorsan látszik az érintett terület és a sürgősség."
          serviceType="csotores_szivargas"
          sourcePage="csotores-szivargas"
          primaryCtaLabel="Megkeresés indítása"
          highlights={highlights}
        />

        <section
          id="urlap"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-20"
        >
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="text-[2rem] font-semibold tracking-tight md:text-4xl">
              Csőtörés vagy szivárgás
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              Adja meg röviden a helyzetet és az elérhetőségét.
            </p>
          </Reveal>

          <LeakRequestForm />
        </section>
      </main>
    </>
  )
}
