import type { Metadata } from "next"
import Link from "next/link"

import { SiteNavbar } from "@/components/layout/site-navbar"
import { SupportersSection } from "@/components/sections/supporters-section"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { businessEmail, businessName, businessPhoneDisplay } from "@/lib/business"
import { imprintPath } from "@/lib/legal"
import { supportedServiceAreaLabel } from "@/lib/service-area"

export const metadata: Metadata = buildPageMetadata({
  title: "Adatkezelési tájékoztató",
  description:
    "Tájékoztató a megkeresések, hibabejelentések és opcionális képfeltöltések során megadott személyes adatok kezeléséről.",
  path: "/adatkezelesi-tajekoztato",
  openGraphTitle: "Adatkezelési tájékoztató | Imperio Gépészet",
  openGraphDescription:
    "Rövid, közérthető tájékoztató a megkeresések és hibabejelentések adatkezeléséről.",
})

const dataCategories = [
  "név és elérhetőségi adatok",
  "település, irányítószám és a megkereséshez kapcsolódó helyszíni információk",
  "a probléma vagy igény leírása",
  "az Ön által feltöltött, releváns képek",
] as const

const useCases = [
  "a megkeresés fogadása és visszajelzés küldése",
  "időpont- vagy helyszíni egyeztetés előkészítése",
  "a hiba vagy feladat előzetes felmérése",
  "a kapcsolódó belső ügyintézés és nyilvántartás",
] as const

export default function PrivacyPolicyPage() {
  return (
    <>
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-20">
          <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
            Adatkezelés
          </div>

          <div className="mt-6 public-surface-strong p-5 sm:p-6 md:p-8">
            <h1 className="text-[2rem] font-semibold tracking-tight md:text-5xl">
              Adatkezelési tájékoztató
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
              A weboldalon megadott adatokat arra használjuk, hogy a
              megkereséseket, hibabejelentéseket és az ezekhez kapcsolódó
              egyeztetéseket kezelni tudjuk. A célunk a rövid, átlátható és
              bizalmat keltő kapcsolatfelvétel.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <section className="public-surface-soft p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">Adatkezelő</h2>
              <div className="mt-4 space-y-2 text-sm leading-7 text-zinc-300">
                <p>{businessName}</p>
                <p>
                  E-mail:{" "}
                  <a
                    href={`mailto:${businessEmail}`}
                    className="text-zinc-100 underline decoration-white/20 underline-offset-4"
                  >
                    {businessEmail}
                  </a>
                </p>
                <p>Telefon: {businessPhoneDisplay}</p>
                <p>Szolgáltatási terület: {supportedServiceAreaLabel}</p>
              </div>
            </section>

            <section className="public-surface-soft p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">
                Milyen adatokat kérünk?
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-300 marker:text-zinc-500">
                {dataCategories.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="public-surface-soft p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">
                Mire használjuk az adatokat?
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-300 marker:text-zinc-500">
                {useCases.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="public-surface-soft p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">
                Képek és csatolmányok
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                A feltöltött képeket kizárólag a megkeresés megértésére és az
                előzetes felmérésre használjuk. Kérjük, csak olyan képet töltsön
                fel, amely valóban a hibához vagy a feladathoz kapcsolódik.
              </p>
            </section>

            <section className="public-surface-soft p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">
                Adattovábbítás és technikai működtetés
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Az adatokat nem értékesítjük, és nem adjuk tovább illetéktelen
                harmadik félnek. A weboldal technikai működtetésében
                infrastruktúra- és e-mail küldő szolgáltatók közreműködhetnek,
                kizárólag a megkeresés kezeléséhez szükséges mértékben.
              </p>
            </section>

            <section className="public-surface-soft p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">
                Kapcsolat és további kérdések
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Ha szeretne tájékoztatást kérni a kezelt adatairól, vagy
                adatkezeléssel kapcsolatos kérdése van, írjon a{" "}
                <a
                  href={`mailto:${businessEmail}`}
                  className="text-zinc-100 underline decoration-white/20 underline-offset-4"
                >
                  {businessEmail}
                </a>{" "}
                címre. Az oldalon használt analitikai sütik csak külön
                hozzájárulással aktiválódnak.
              </p>
            </section>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/3 p-5 text-sm leading-7 text-zinc-300 sm:p-6">
            A nyilvános működtetési adatok az{" "}
            <Link
              href={imprintPath}
              className="text-zinc-100 underline decoration-white/20 underline-offset-4"
            >
              Impresszum
            </Link>{" "}
            oldalon érhetők el.
          </div>
        </section>
      </main>

      <SupportersSection />
    </>
  )
}
