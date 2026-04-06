import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Bath,
  Building2,
  CircleHelp,
  Droplets,
  Flame,
  Leaf,
  ShieldCheck,
  Thermometer,
  Wrench,
} from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Reveal } from "@/components/motion/reveal"
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events"
import { cn } from "@/lib/utils"

type ResidentialWork = {
  title: string
  description: string
  icon: LucideIcon
  href: string
  ctaLabel: string
  serviceType: string
  badge?: string
  tone?: "default" | "priority" | "assistant"
  gridClassName?: string
  supportingText?: string
}

const residentialWorks: ResidentialWork[] = [
  {
    title: "Csőtörés / szivárgás",
    description:
      "Beázás, csőrepedés, rejtett vagy látható szivárgások gyors feltárása és mielőbbi elhárítása.",
    icon: Droplets,
    href: "/szolgaltatasok/csotores-szivargas",
    ctaLabel: "Gyors megkeresés indítása",
    serviceType: "csotores_szivargas",
    badge: "Gyors indulás",
    tone: "priority",
    gridClassName: "xl:col-span-3",
  },
  {
    title: "Kazánjavítás / kazáncsere",
    description:
      "Hibás kazán javítása, készülékcsere, beüzemelés és működésre kész átadás rendezett egyeztetéssel.",
    icon: Flame,
    href: "/szolgaltatasok/kazancsere",
    ctaLabel: "Kazános indulás megnyitása",
    serviceType: "kazancsere",
    badge: "Gyakori indulás",
    tone: "priority",
    gridClassName: "xl:col-span-3",
  },
  {
    title: "Vízszerelés",
    description:
      "Csapok, WC-k, mosdók, vezetékek és egyéb vízszerelési elemek javítása, cseréje és szerelése.",
    icon: Wrench,
    href: "/szolgaltatasok/vizszereles",
    ctaLabel: "Vízszerelési megkeresés indítása",
    serviceType: "vizszereles",
    gridClassName: "xl:col-span-2",
  },
  {
    title: "Fűtésszerelés",
    description:
      "Radiátorok, központi fűtés és egyéb fűtési rendszerhibák javítása, szerelése és helyreállítása.",
    icon: Thermometer,
    href: "/szolgaltatasok/futeskorszerusites",
    ctaLabel: "Fűtési megkeresés indítása",
    serviceType: "futeskorszerusites",
    gridClassName: "xl:col-span-2",
  },
  {
    title: "Gázszerelés",
    description:
      "Gázvezetékek, gázkészülékek szerelése, cseréje és kapcsolódó munkák szakszerű elvégzése.",
    icon: Flame,
    href: "/szolgaltatasok/vizszereles",
    ctaLabel: "Víz- és gázszerelési megkeresés",
    serviceType: "vizszereles",
    gridClassName: "xl:col-span-2",
  },
  {
    title: "Fürdőszoba kiépítés",
    description:
      "Komplett gépészeti kialakítás új vagy felújított fürdőszobákhoz, átgondolt kivitelezéssel.",
    icon: Bath,
    href: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
    ctaLabel: "Fürdőszobás projekt indítása",
    serviceType: "komplett_epuletgepeszeti_kivitelezes",
    gridClassName: "xl:col-span-2",
  },
  {
    title: "Hőszivattyú telepítés",
    description:
      "Korszerű hőszivattyús rendszerek telepítése, beépítése és üzembiztos üzembe helyezése.",
    icon: Leaf,
    href: "/szolgaltatasok/hoszivattyu-telepites",
    ctaLabel: "Hőszivattyús megkeresés indítása",
    serviceType: "hoszivattyu_telepites",
    gridClassName: "xl:col-span-2",
  },
  {
    title: "Komplett kivitelezés / felújítás",
    description:
      "Teljes épületgépészeti rendszer korszerűsítése, összehangolt kivitelezése és felújítási támogatása.",
    icon: Building2,
    href: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
    ctaLabel: "Komplex projektmegkeresés indítása",
    serviceType: "komplett_epuletgepeszeti_kivitelezes",
    gridClassName: "xl:col-span-2",
  },
  {
    title: "Karbantartás / átvizsgálás",
    description:
      "Rendszerek ellenőrzése, megelőző karbantartása és működésük finomhangolása a stabilabb üzemért.",
    icon: ShieldCheck,
    href: "/szolgaltatasok/futeskorszerusites",
    ctaLabel: "Karbantartási megkeresés indítása",
    serviceType: "futeskorszerusites",
    gridClassName: "xl:col-span-2",
  },
  {
    title: "Nem tudom, mire van szükségem",
    description:
      "Ha nem egyértelmű, melyik szolgáltatással érdemes indulni, írja le röviden a helyzetet, és segítünk kijelölni a legjobb következő lépést.",
    icon: CircleHelp,
    href: "#kapcsolat",
    ctaLabel: "Segítség a megfelelő induláshoz",
    serviceType: "nem_tudom_mire_van_szuksegem",
    badge: "Segítő belépési pont",
    tone: "assistant",
    gridClassName: "md:col-span-2 lg:col-span-3 xl:col-span-4",
    supportingText:
      "Rövid leírás alapján segítünk kijelölni a legjobb szolgáltatási irányt.",
  },
]

function ResidentialWorkCard({
  work,
  delayMs,
}: {
  work: ResidentialWork
  delayMs: number
}) {
  const Icon = work.icon
  const isPriority = work.tone === "priority"
  const isAssistant = work.tone === "assistant"

  return (
    <Reveal
      className={cn("h-full", work.gridClassName)}
      delayMs={delayMs}
      variant="card"
    >
      <article
        className={cn(
          "group relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.45rem] border p-3.5 text-white shadow-[0_16px_38px_rgba(0,0,0,0.16)] transition-all duration-300 sm:min-h-[13.5rem] sm:p-4 md:min-h-[15rem] md:rounded-[1.7rem] md:p-5",
          "hover:-translate-y-1 hover:bg-white/[0.06]",
          isPriority &&
            "border-[#c89758]/18 bg-[radial-gradient(circle_at_top_right,rgba(200,151,88,0.12),transparent_46%),linear-gradient(180deg,rgba(255,255,255,0.062),rgba(255,255,255,0.02))] hover:border-[#d7b27e]/26",
          isAssistant &&
            "border-[#c89758]/16 bg-[radial-gradient(circle_at_top_left,rgba(200,151,88,0.14),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.068),rgba(255,255,255,0.024))] hover:border-[#d7b27e]/24",
          !isPriority &&
            !isAssistant &&
            "border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.052),rgba(255,255,255,0.02))] hover:border-white/16"
        )}
      >
        <div
          className={cn(
            "absolute inset-x-4 top-0 h-px bg-gradient-to-r md:inset-x-5",
            isPriority &&
              "from-[#e4c78f]/0 via-[#e4c78f]/48 to-[#e4c78f]/0",
            isAssistant &&
              "from-[#e4c78f]/0 via-[#e4c78f]/42 to-[#e4c78f]/0",
            !isPriority &&
              !isAssistant &&
              "from-white/0 via-white/16 to-white/0"
          )}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start justify-between gap-4">
            {work.badge ? (
              <div
                className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-[0.58rem] font-medium tracking-[0.18em] uppercase sm:text-[0.62rem]",
                  isPriority || isAssistant
                    ? "public-pill-accent"
                    : "public-pill"
                )}
              >
                {work.badge}
              </div>
            ) : (
              <div className="h-5" aria-hidden="true" />
            )}
          </div>
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.9rem] border text-zinc-100 sm:h-10 sm:w-10 sm:rounded-[1rem]",
              isPriority || isAssistant
                ? "border-[#c89758]/20 bg-[radial-gradient(circle_at_35%_35%,rgba(232,208,160,0.16),rgba(200,151,88,0.06),transparent_74%)] text-[#f0dfbe]"
                : "border-white/10 bg-white/[0.04]"
            )}
          >
            <Icon className="h-4 w-4 sm:h-[17px] sm:w-[17px]" strokeWidth={1.9} />
          </div>
        </div>

        <div className="mt-3.5 flex flex-1 flex-col">
          <div className="space-y-2.5">
            <h3
              className={cn(
                "max-w-[22ch] text-[1.02rem] leading-snug font-semibold tracking-tight text-white sm:text-[1.08rem] md:text-[1.28rem]",
                isPriority && "max-w-[19ch] md:text-[1.34rem]",
                isAssistant && "max-w-[19ch] md:text-[1.42rem]"
              )}
            >
              {work.title}
            </h3>
            <p
              className={cn(
                "max-w-[34ch] text-[0.85rem] leading-6 text-zinc-300 sm:text-[0.9rem]",
                isAssistant && "max-w-[42ch] text-zinc-200"
              )}
            >
              {work.description}
            </p>
            {work.supportingText ? (
              <p className="max-w-[38ch] text-[0.78rem] leading-5 text-zinc-400 sm:text-[0.82rem] sm:leading-6">
                {work.supportingText}
              </p>
            ) : null}
          </div>

          <div className="mt-auto pt-4">
            <TrackedLink
              href={work.href}
              eventName={publicAnalyticsEventNames.ctaClick}
              eventPayload={{
                source_page: "homepage",
                source_section: "residential_common_work",
                service_type: work.serviceType,
                cta_variant: isAssistant ? "supportive" : "secondary",
                cta_label: work.ctaLabel,
                destination_path: work.href,
                entry_point: "homepage_residential_common_work_card",
              }}
              className={cn(
                "inline-flex min-h-8 items-center gap-2 text-[0.88rem] font-medium text-zinc-100 transition-colors duration-300 hover:text-[#f0dfbe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c89758]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 md:min-h-10 md:text-sm",
                isAssistant && "text-[#f0dfbe]"
              )}
            >
              <span>{work.ctaLabel}</span>
              <ArrowRight className="h-4 w-4 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5" />
            </TrackedLink>
          </div>
        </div>
      </article>
    </Reveal>
  )
}

export function ResidentialCommonWorkSection() {
  return (
    <section
      id="lakossagi-gyakori-munkak"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-24"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />

      <Reveal className="mb-7 md:mb-12" variant="hero">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] xl:items-end">
          <div className="max-w-4xl">
            <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
              Lakossági indulási pontok
            </div>

            <h2 className="mt-5 text-[1.9rem] font-semibold tracking-tight text-white sm:text-[2.25rem] md:text-5xl">
              Lakossági gyakori munkák
            </h2>

            <p className="mt-4 max-w-3xl text-[0.96rem] leading-6 text-zinc-300 sm:text-base sm:leading-7 md:text-lg">
              Ha a feladatot inkább hétköznapi helyzetként fogalmazná meg, az
              alábbi indulási pontok segítenek gyorsabban megtalálni a megfelelő
              irányt. A leggyakoribb otthoni gépészeti munkákat rendeztük rövid,
              könnyebben áttekinthető belépési pontokba.
            </p>
          </div>

          <div className="max-w-xl border-t border-[#c89758]/16 pt-4 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-6 xl:pb-1">
            <p className="text-[0.92rem] leading-6 text-zinc-400 md:text-base md:leading-7">
              A fenti fő szolgáltatási területek szakmai logikája változatlanul
              megmarad, ez a blokk pedig abban segít, hogy lakossági nézőpontból
              is gyorsan kijelölhető legyen a legjobb következő lépés.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12">
        {residentialWorks.map((work, index) => (
          <ResidentialWorkCard
            key={work.title}
            work={work}
            delayMs={index * 70}
          />
        ))}
      </div>
    </section>
  )
}
