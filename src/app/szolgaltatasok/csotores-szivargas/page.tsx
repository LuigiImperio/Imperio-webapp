import type { Metadata } from "next"

import { LeakRequestForm } from "@/components/forms/leak-request-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createBreadcrumbStructuredData, createServiceStructuredData } from "@/lib/seo/site"

const highlights = [
  "Gyorsabb helyzetkép",
  "Célzottabb triage",
  "Nyugodt, rendezett indulás",
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
          intro="Itt indítható el egy gyors, célzott megkeresési folyamat olyan helyzetekhez, ahol beázás, csőrepedés vagy látható, illetve rejtett szivárgás miatt fontos a mielőbbi első visszajelzés."
          leadTitle="Gyorsabb helyzetfelmérés rendezett első egyeztetéssel"
          leadDescription="A cél, hogy a szivárgás állapota, az érintett terület és a helyszíni alapadatok már az első kapcsolatfelvétel előtt átláthatók legyenek, így a következő lépés célzottabban készülhessen elő."
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
              Csőtörés vagy szivárgás bejelentése
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              A folyamat röviden végigvihető, és abban segít, hogy a helyzet
              sürgőssége, az érintett terület és az egyeztetéshez szükséges
              alapadatok gyorsan áttekinthetők legyenek.
            </p>
          </Reveal>

          <LeakRequestForm />
        </section>
      </main>
    </>
  )
}
