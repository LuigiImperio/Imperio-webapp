import type { Metadata } from "next"

import { HeatPumpInstallationForm } from "@/components/forms/heat-pump-installation-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createBreadcrumbStructuredData, createServiceStructuredData } from "@/lib/seo/site"

const highlights = [
  "Műszaki előminősítés",
  "Rendezettebb első egyeztetés",
  "Jobban előkészített indulás",
]

export const metadata: Metadata = buildPageMetadata({
  title: "Hőszivattyú telepítési megkeresés",
  description:
    "Hőszivattyús projektek előkészítéséhez készült megkeresési oldal ingatlan-, rendszer- és műszaki alapadatokkal, valamint opcionális képfeltöltéssel.",
  path: "/szolgaltatasok/hoszivattyu-telepites",
  openGraphTitle: "Hőszivattyú telepítési megkeresés | Imperio Gépészet",
  openGraphDescription:
    "Hőszivattyús előminősítő megkeresés ingatlan-, rendszer- és kapcsolati adatokkal a pontosabb első szakmai egyeztetéshez.",
})

export default function HeatPumpInstallationPage() {
  return (
    <>
      <StructuredData
        data={[
          createServiceStructuredData({
            name: "Hőszivattyú telepítés",
            description:
              "Hőszivattyús projektekhez készült strukturált megkeresési oldal ingatlan- és rendszeralapadatokkal, előzetes műszaki kérdésekkel és opcionális képfeltöltéssel.",
            path: "/szolgaltatasok/hoszivattyu-telepites",
          }),
          createBreadcrumbStructuredData([
            { name: "Főoldal", path: "/" },
            { name: "Hőszivattyú telepítés", path: "/szolgaltatasok/hoszivattyu-telepites" },
          ]),
        ]}
      />
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />
        <ServicePageHero
          title="Hőszivattyú telepítés"
          intro="Itt indítható el egy strukturált előminősítő megkeresés, amely segít előre rögzíteni a helyszín, a jelenlegi rendszer és a projekt indulási helyzetének legfontosabb adatait."
          leadTitle="Hőszivattyús megkeresés átláthatóbb műszaki előkészítéssel"
          leadDescription="A cél, hogy a hőleadó oldal, a jelenlegi hőtermelő, az elektromos háttér és a projekt szakasza már az első kapcsolatfelvétel előtt tisztábban látszódjon, így a következő egyeztetés célzottabb lehessen."
          serviceType="hoszivattyu_telepites"
          sourcePage="hoszivattyu-telepites"
          primaryCtaLabel="Megkeresés indítása"
          highlights={highlights}
        />

        <section
          id="urlap"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-20"
        >
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="text-[2rem] font-semibold tracking-tight md:text-4xl">
              Hőszivattyús megkeresés indítása
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              A folyamat néhány rövid lépésből áll, és segít, hogy a projekt
              alaphelyzete, a fő műszaki szempontok és az egyeztetéshez
              szükséges körülmények már az első körben tisztábban látszódjanak.
            </p>
          </Reveal>

          <HeatPumpInstallationForm />
        </section>
      </main>
    </>
  )
}
