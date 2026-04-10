import { ArrowRight, MapPin, MessagesSquare, TriangleAlert } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Reveal } from "@/components/motion/reveal"
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events"

const intentClusters = [
  {
    title: "Sürgős hibák és hibaelhárítás",
    description:
      "Azokhoz a helyzetekhez, amikor a probléma nem várhat, vagy a hiba jellege még bizonytalan.",
    links: [
      {
        label: "Csőtörés vagy vízszivárgás",
        href: "/szolgaltatasok/csotores-szivargas",
      },
      {
        label: "Sürgős hibabejelentés",
        href: "/szolgaltatasok/hibabejelentes",
      },
      {
        label: "Kazán nem indul vagy leállt",
        href: "/szolgaltatasok/kazancsere",
      },
    ],
  },
  {
    title: "Otthoni víz- és gázproblémák",
    description:
      "Praktikus, hétköznapi megkeresésekhez, amikor a feladatot inkább panasz vagy háztartási helyzet alapján fogalmazná meg.",
    links: [
      {
        label: "Csöpögő csap vagy csapcsere",
        href: "/szolgaltatasok/vizszereles",
      },
      {
        label: "Lefolyóprobléma vagy szanitercsere",
        href: "/szolgaltatasok/vizszereles",
      },
      {
        label: "Gázvezeték vagy gázkészülék szerelés",
        href: "/szolgaltatasok/vizszereles",
      },
    ],
  },
  {
    title: "Fűtési és komfortproblémák",
    description:
      "Radiátoros, padlófűtéses és általános fűtési rendszerhez kapcsolódó panaszokhoz és korszerűsítési igényekhez.",
    links: [
      {
        label: "Nem meleg a radiátor",
        href: "/szolgaltatasok/futeskorszerusites",
      },
      {
        label: "Padlófűtés nem fűt rendesen",
        href: "/szolgaltatasok/futeskorszerusites",
      },
      {
        label: "Fűtéskorszerűsítés és beszabályozás",
        href: "/szolgaltatasok/futeskorszerusites",
      },
    ],
  },
  {
    title: "Projekt, felújítás és komplett gépészet",
    description:
      "Nagyobb léptékű épületgépészeti munkákhoz, új rendszerkiépítéshez, családi ház gépészethez vagy hőszivattyús projekthez.",
    links: [
      {
        label: "Családi ház gépészet és felújítás",
        href: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
      },
      {
        label: "Hőszivattyú telepítés",
        href: "/szolgaltatasok/hoszivattyu-telepites",
      },
      {
        label: "Fürdőszobai gépészeti munka",
        href: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
      },
    ],
  },
] as const

const localSignals = [
  "Pécs",
  "Kozármisleny",
  "Pellérd",
  "Keszü",
  "Gyód",
  "Orfű",
  "Komló",
  "Baranya megye egyeztetett helyszínei",
] as const

export function HomepageSearchIntentsSection() {
  return (
    <section className="relative border-t border-white/10 bg-zinc-900/40">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <Reveal className="max-w-4xl" variant="hero">
          <div className="public-pill inline-flex items-center gap-2 px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
            <MessagesSquare className="size-3.5" />
            Gyakori helyzetek és keresési témák
          </div>
          <h2 className="mt-5 text-[1.9rem] font-semibold tracking-tight sm:text-[2.25rem] md:text-5xl">
            Nem csak szolgáltatásnévvel lehet elindulni
          </h2>
          <p className="mt-4 max-w-3xl text-[0.96rem] leading-6 text-zinc-300 sm:text-base sm:leading-7 md:text-lg">
            A megkeresések sokszor úgy indulnak, hogy csöpög a csap, nem meleg a
            radiátor, nincs meleg víz vagy nagyobb felújításhoz kell gépész
            partner. Az alábbi blokkok ezeket a gyakori keresési irányokat
            rendezik áttekinthető belépési pontokká.
          </p>
        </Reveal>

        <div className="mt-7 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {intentClusters.map((cluster, clusterIndex) => (
            <Reveal
              key={cluster.title}
              delayMs={clusterIndex * 70}
              variant="card"
            >
              <article className="public-surface-soft h-full p-4 md:p-5">
                <h3 className="text-[1.05rem] font-semibold tracking-tight text-white md:text-[1.15rem]">
                  {cluster.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {cluster.description}
                </p>

                <div className="mt-4 space-y-2.5">
                  {cluster.links.map((link, linkIndex) => (
                    <TrackedLink
                      key={link.label}
                      href={link.href}
                      eventName={publicAnalyticsEventNames.ctaClick}
                      eventPayload={{
                        source_page: "homepage",
                        source_section: "search_intents",
                        cta_variant: "secondary",
                        cta_label: link.label,
                        destination_path: link.href,
                        entry_point: `homepage_search_intent_${clusterIndex + 1}_${linkIndex + 1}`,
                      }}
                      className="group flex items-start justify-between gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm leading-6 text-zinc-200 transition-all duration-300 hover:border-white/16 hover:bg-white/[0.05] hover:text-white"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-zinc-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-zinc-300" />
                    </TrackedLink>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.12fr)_minmax(280px,0.88fr)]">
          <Reveal variant="soft">
            <div className="public-surface-soft h-full p-4 md:p-5">
              <div className="flex items-start gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-200">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-[0.72rem] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                    Helyi fókusz
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    Pécs és környéke, természetes helyi relevanciával
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-300">
                A fő piac Pécs és a környező települések. A helyi keresési
                szándékot ezért nem csak a városnév, hanem a közeli, reálisan
                kiszolgálható helyszínek és a baranyai környezet is támogatja.
              </p>

              <ul className="mt-4 flex flex-wrap gap-2.5">
                {localSignals.map((signal) => (
                  <li
                    key={signal}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.8rem] text-zinc-200"
                  >
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delayMs={80} variant="soft">
            <div className="public-surface-soft h-full p-4 md:p-5">
              <div className="flex items-start gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-200">
                  <TriangleAlert className="size-4" />
                </span>
                <div>
                  <p className="text-[0.72rem] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                    Ha nem egyértelmű
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    Segítünk kijelölni a megfelelő indulási irányt
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-300">
                Ha a megkeresés inkább tünetből indul, és nem biztos, hogy
                melyik szolgáltatással érdemes kezdeni, a kapcsolatfelvételi
                blokkban röviden áttekinthető a következő lépés és a helyi
                szolgáltatási logika is.
              </p>

              <TrackedLink
                href="/#kapcsolat"
                eventName={publicAnalyticsEventNames.ctaClick}
                eventPayload={{
                  source_page: "homepage",
                  source_section: "search_intents",
                  cta_variant: "supportive",
                  cta_label: "Kapcsolatfelvételi blokk megnyitása",
                  destination_path: "/#kapcsolat",
                  entry_point: "homepage_search_intents_contact",
                }}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#f0dfbe] transition-colors duration-300 hover:text-[#f6e9cd]"
              >
                <span>Kapcsolatfelvételi blokk megnyitása</span>
                <ArrowRight className="size-4" />
              </TrackedLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
