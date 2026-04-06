import type { Metadata } from "next"

import { FaultReportForm } from "@/components/forms/fault-report-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createBreadcrumbStructuredData, createServiceStructuredData } from "@/lib/seo/site"

const highlights = [
  "Gyors problémajelzés",
  "Sürgősség megadása",
  "Képes pontosítás",
]

export const metadata: Metadata = buildPageMetadata({
  title: "Hibabejelentés sürgős gépészeti problémákra",
  description:
    "Gyors hibabejelentés sürgősséggel, rövid leírással és képfeltöltéssel, hogy a hiba jellege már az első kapcsolatfelvételnél tisztábban látszódjon.",
  path: "/szolgaltatasok/hibabejelentes",
  openGraphTitle: "Hibabejelentés sürgős gépészeti problémákra | Imperio Gépészet",
  openGraphDescription:
    "Sürgős vagy problémás helyzet gyors bejelentése rövid, átlátható adatrögzítéssel és képes pontosítással.",
})

export default function FaultReportPage() {
  return (
    <>
      <StructuredData
        data={[
          createServiceStructuredData({
            name: "Hibabejelentés",
            description:
              "Hibabejelentés rövid leírással, sürgősségi megadással és opcionális képfeltöltéssel.",
            path: "/szolgaltatasok/hibabejelentes",
          }),
          createBreadcrumbStructuredData([
            { name: "Főoldal", path: "/" },
            { name: "Hibabejelentés", path: "/szolgaltatasok/hibabejelentes" },
          ]),
        ]}
      />
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />
        <ServicePageHero
          title="Hibabejelentés"
          intro="Itt gyorsan és átláthatóan jelezhető sürgős vagy problémás helyzet, hogy a legfontosabb információk rövid idő alatt rögzíthetők legyenek."
          leadTitle="Hibabejelentés gyorsabb előzetes egyeztetéssel"
          leadDescription="A cél, hogy a probléma jellege, a sürgősség és a helyszíni alapadatok már az első bejelentésnél láthatóvá váljanak, így gyorsabban priorizálható legyen a következő lépés."
          serviceType="hibabejelentes"
          sourcePage="hibabejelentes"
          primaryCtaLabel="Bejelentés indítása"
          highlights={highlights}
        />

        <section
          id="urlap"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-20"
        >
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="text-[2rem] font-semibold tracking-tight md:text-4xl">
              Indítsa el a gyors hibabejelentést
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              A rövid lépések célja, hogy a hiba jellege, a sürgősség és a
              kapcsolattartási adatok gyorsan átláthatók legyenek. Opcionális
              képek is csatolhatók, ha ez segíti a pontosabb első visszajelzést.
            </p>
          </Reveal>

          <FaultReportForm />
        </section>
      </main>
    </>
  )
}
