import type { Metadata } from "next"
import Link from "next/link"

import { SiteNavbar } from "@/components/layout/site-navbar"
import { SupportersSection } from "@/components/sections/supporters-section"
import {
  businessAlternateName,
  businessEmail,
  businessName,
  businessPhoneDisplay,
} from "@/lib/business"
import { privacyPolicyPath } from "@/lib/legal"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { supportedServiceAreaLabel } from "@/lib/service-area"

export const metadata: Metadata = buildPageMetadata({
  title: "Impresszum",
  description:
    "Nyilvános kapcsolati és működtetési adatok az Imperio Gépészet weboldalához.",
  path: "/impresszum",
  openGraphTitle: "Impresszum | Imperio Gépészet",
  openGraphDescription:
    "Nyilvános kapcsolati és működtetési adatok az Imperio Gépészet weboldalához.",
})

export default function ImprintPage() {
  return (
    <>
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteNavbar />

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-20">
          <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
            Nyilvános működtetési adatok
          </div>

          <div className="mt-6 public-surface-strong p-5 sm:p-6 md:p-8">
            <h1 className="text-[2rem] font-semibold tracking-tight md:text-5xl">
              Impresszum
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
              A jelen oldalon a weboldalhoz kapcsolódó nyilvános kapcsolati és
              működtetési adatok találhatók. A cél az egyértelmű, könnyen
              elérhető tájékozódás.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <section className="public-surface-soft p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">
                Szolgáltató megnevezése
              </h2>
              <div className="mt-4 space-y-2 text-sm leading-7 text-zinc-300">
                <p>{businessName}</p>
                <p>Alternatív megnevezés: {businessAlternateName}</p>
              </div>
            </section>

            <section className="public-surface-soft p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">Kapcsolat</h2>
              <div className="mt-4 space-y-2 text-sm leading-7 text-zinc-300">
                <p>Telefon: {businessPhoneDisplay}</p>
                <p>
                  E-mail:{" "}
                  <a
                    href={`mailto:${businessEmail}`}
                    className="text-zinc-100 underline decoration-white/20 underline-offset-4"
                  >
                    {businessEmail}
                  </a>
                </p>
                <p>Weboldal: www.imperiogepeszet.hu</p>
              </div>
            </section>

            <section className="public-surface-soft p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">
                A weboldal rendeltetése
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                A weboldal lakossági megkeresések, hibabejelentések és
                épületgépészeti egyeztetések indítására szolgál, különösen víz-,
                gáz- és fűtéstechnikai témákban.
              </p>
            </section>

            <section className="public-surface-soft p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">
                Szolgáltatási fókusz
              </h2>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Elsődleges szolgáltatási terület: {supportedServiceAreaLabel}.
              </p>
            </section>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-zinc-300 sm:p-6">
            Az adatkezeléssel kapcsolatos részletes tájékoztató az{" "}
            <Link
              href={privacyPolicyPath}
              className="text-zinc-100 underline decoration-white/20 underline-offset-4"
            >
              Adatkezelési tájékoztató
            </Link>{" "}
            oldalon érhető el.
          </div>
        </section>
      </main>

      <SupportersSection />
    </>
  )
}
