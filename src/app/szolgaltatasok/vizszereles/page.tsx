import type { Metadata } from "next"

import { PlumbingRequestForm } from "@/components/forms/plumbing-request-form"
import { SiteNavbar } from "@/components/layout/site-navbar"
import { Reveal } from "@/components/motion/reveal"
import { ServicePageHero } from "@/components/sections/service-page-hero"
import { StructuredData } from "@/components/seo/structured-data"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { createBreadcrumbStructuredData, createServiceStructuredData } from "@/lib/seo/site"

const highlights = [
  "Gyorsabb előzetes kép",
  "Jobb helyszíni egyeztetés",
  "Egyszerűbb indulás",
]

export const metadata: Metadata = buildPageMetadata({
  title: "Víz- és gázszerelési megkeresés",
  description:
    "Víz- és gázszerelési megkeresés munkatípussal, sürgősséggel, egyeztetési adatokkal és opcionális képfeltöltéssel, tipikus lakossági feladatokhoz is.",
  path: "/szolgaltatasok/vizszereles",
  openGraphTitle: "Víz- és gázszerelési megkeresés | Imperio Gépészet",
  openGraphDescription:
    "Általános víz- és gázszerelési munkákhoz készült szolgáltatásoldal strukturált adatbekéréssel és gyorsabb előkészítéssel.",
})

export default function PlumbingRequestPage() {
  return (
    <>
      <StructuredData
        data={[
          createServiceStructuredData({
            name: "Víz- és gázszerelés",
            description:
              "Általános víz- és gázszerelési megkeresés sürgősséggel, egyeztetési adatokkal és opcionális képfeltöltéssel.",
            path: "/szolgaltatasok/vizszereles",
          }),
          createBreadcrumbStructuredData([
            { name: "Főoldal", path: "/" },
            { name: "Víz- és gázszerelés", path: "/szolgaltatasok/vizszereles" },
          ]),
        ]}
      />
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />
        <ServicePageHero
          title="Víz- és gázszerelés"
          intro="Vízszerelési és gázszerelési munkákhoz itt indítható strukturált megkeresés, hogy a feladat jellege, a sürgősség és a helyszíni alapadatok már az első kapcsolatfelvétel előtt átláthatók legyenek."
          leadTitle="Víz- és gázszerelési megkeresés rendezettebb indulással"
          leadDescription="A cél, hogy a munka típusa, a sürgősség és az egyeztetéshez fontos körülmények már az elején láthatók legyenek, így tipikus lakossági szerelési feladatoknál is gyorsabb és pontosabb lehessen a következő visszajelzés."
          serviceType="vizszereles"
          sourcePage="vizszereles"
          primaryCtaLabel="Megkeresés indítása"
          highlights={highlights}
        />

        <section
          id="urlap"
          className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-20"
        >
          <Reveal className="mb-10 max-w-3xl">
            <h2 className="text-[2rem] font-semibold tracking-tight md:text-4xl">
              Víz- vagy gázszerelési megkeresés indítása
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              A folyamat néhány rövid lépésből áll, és segít, hogy víz- vagy
              gázszerelési feladatnál a munka jellege, a sürgősség és az
              egyeztetéshez szükséges alapadatok már az első megkeresésnél
              láthatók legyenek.
            </p>
          </Reveal>

          <PlumbingRequestForm />
        </section>
      </main>
    </>
  )
}
