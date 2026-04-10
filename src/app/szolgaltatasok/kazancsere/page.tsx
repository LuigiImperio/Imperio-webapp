import type { Metadata } from "next"

import { BoilerReplacementForm } from "@/components/forms/boiler-replacement-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createBreadcrumbStructuredData, createServiceStructuredData } from "@/lib/seo/site"

const highlights = [
  "Gyors indulás",
  "Kevesebb kör",
  "Képes kiegészítés",
]

export const metadata: Metadata = buildPageMetadata({
  title: "Kazánjavítás és kazáncsere megkeresése",
  description:
    "Kazánjavításhoz vagy kazáncseréhez készült megkeresési oldal átlátható adatbekéréssel, képfeltöltéssel és gyorsabb első egyeztetéssel.",
  path: "/szolgaltatasok/kazancsere",
  openGraphTitle: "Kazánjavítás és kazáncsere megkeresése | Imperio Gépészet",
  openGraphDescription:
    "Kazánjavítás vagy kazáncsere strukturált megkereséssel, gyorsabb előszűréssel és pontosabb előzetes egyeztetéssel.",
})

export default function BoilerReplacementPage() {
  return (
    <>
      <StructuredData
        data={[
          createServiceStructuredData({
            name: "Kazánjavítás / kazáncsere",
            description:
              "Kazánjavítás vagy kazáncsere strukturált megkereséssel, átlátható adatbekéréssel és opcionális képfeltöltéssel.",
            path: "/szolgaltatasok/kazancsere",
          }),
          createBreadcrumbStructuredData([
            { name: "Főoldal", path: "/" },
            { name: "Kazánjavítás / kazáncsere", path: "/szolgaltatasok/kazancsere" },
          ]),
        ]}
      />
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />
        <ServicePageHero
          title="Kazánjavítás / kazáncsere"
          intro="Itt indítható el a kazánjavítással vagy kazáncserével kapcsolatos megkeresés."
          leadTitle="Kazános megkeresés röviden"
          leadDescription="Néhány alapadat már elég az induláshoz. A többit később is megadhatja."
          serviceType="kazancsere"
          sourcePage="kazancsere"
          primaryCtaLabel="Megkeresés indítása"
          highlights={highlights}
        />

        <section
          id="urlap"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-20"
        >
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="text-[2rem] font-semibold tracking-tight md:text-4xl">
              Kazános megkeresés
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              Néhány adat megadása után elküldheti a megkeresést. Ami most nem
              biztos, később is pontosítható.
            </p>
          </Reveal>

          <BoilerReplacementForm />
        </section>
      </main>
    </>
  )
}
