"use client"

import { motion, useReducedMotion } from "motion/react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Button } from "@/components/ui/button"
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events"

const panelSteps = [
  {
    title: "A feladathoz illő belépési pont",
    description:
      "A megkeresés már az elején jobban igazítható ahhoz, hogy víz-, gáz- vagy fűtéstechnikai feladatról van szó.",
  },
  {
    title: "Jobban értelmezhető helyzetkép",
    description:
      "A strukturált adatbekérés segít tisztábban látni a műszaki kiindulópontot, a helyszínt és a sürgősséget.",
  },
  {
    title: "Hatékonyabb következő egyeztetés",
    description:
      "Gyorsabban eldönthető, hogy pontosításra, helyszíni felmérésre vagy közvetlen hibakezelésre van szükség.",
  },
] as const

const trustHighlights = [
  "Strukturált adatbekérés",
  "Szakmailag tisztább első kapcsolatfelvétel",
  "Átláthatóbb kiindulópont a következő lépéshez",
]

const goldGlowSoft = "rgba(200, 151, 88, 0.26)"
const goldGlowDeep = "rgba(121, 83, 38, 0.22)"

type HeroMotionProps = {
  children: React.ReactNode
  className?: string
  delay: number
}

function HeroMotion({ children, className, delay }: HeroMotionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.62,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }
      }
    >
      {children}
    </motion.div>
  )
}

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_34%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.48),transparent_52%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_24%,rgba(0,0,0,0.38))]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />

      <motion.div
        aria-hidden="true"
        className="absolute -left-20 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${goldGlowSoft}, transparent 68%)`,
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, 20, 0],
                y: [0, -14, 0],
                opacity: [0.16, 0.24, 0.16],
              }
        }
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-0 top-20 h-80 w-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${goldGlowDeep}, transparent 70%)`,
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, -18, 0],
                y: [0, 16, 0],
                opacity: [0.1, 0.18, 0.1],
              }
        }
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {[
          "left-[10%] top-[18%]",
          "left-[18%] top-[64%]",
          "left-[42%] top-[14%]",
          "left-[56%] top-[72%]",
          "left-[76%] top-[22%]",
          "left-[84%] top-[58%]",
        ].map((position, index) => (
          <div
            key={position}
            className={`absolute h-1 w-1 rounded-full bg-white/${index % 2 === 0 ? "[0.18]" : "[0.12]"} ${position}`}
          />
        ))}
      </div>

      <div className="absolute left-1/2 top-0 h-px w-[min(76rem,92vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/14 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-18 lg:min-h-[78vh] lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,460px)] lg:items-center lg:gap-12 lg:py-20">
        <div className="max-w-4xl">
          <HeroMotion delay={0}>
            <div className="public-pill-accent inline-flex max-w-full px-3.5 py-1.5 text-[0.72rem] sm:px-4 sm:text-sm">
              Strukturált első kapcsolatfelvétel
            </div>
          </HeroMotion>

          <HeroMotion delay={0.08} className="mt-6">
            <h1 className="max-w-4xl text-[2.1rem] font-semibold leading-[1.03] tracking-tight text-white sm:text-[2.85rem] md:text-6xl">
              <span
                className="block"
              >
                Épületgépészeti megoldások
              </span>
              <span className="mt-2 block bg-gradient-to-r from-[#f2e2bc] via-[#cd9d60] to-[#8f6534] bg-clip-text text-transparent">
                víz-, gáz- és
              </span>
              <span className="mt-2 block">fűtéstechnikai területen</span>
            </h1>
          </HeroMotion>

          <HeroMotion delay={0.16} className="mt-6">
            <p className="max-w-2xl text-[0.95rem] leading-6 text-zinc-300 sm:text-base sm:leading-7 md:text-lg">
              A strukturált adatbekérés abban segít, hogy a megkeresés már az
              első lépésnél szakmailag tisztább, jobban értelmezhető és
              hatékonyabban előkészített legyen.
            </p>
          </HeroMotion>

          <HeroMotion delay={0.2} className="mt-5">
            <div className="flex items-start gap-3 sm:items-center">
              <span className="mt-3 h-px w-8 shrink-0 bg-gradient-to-r from-[#d0a261] to-transparent sm:mt-0 sm:w-10" />
              <p className="text-[0.92rem] leading-6 text-[#e5d2ad] md:text-base">
                Lakossági igényektől az összetettebb műszaki feladatokig.
              </p>
            </div>
          </HeroMotion>

          <HeroMotion delay={0.24} className="mt-8">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Button
                  asChild
                  size="lg"
                  className="public-button-primary min-h-10 w-full rounded-xl px-4 text-[0.92rem] transition-all duration-300 hover:-translate-y-0.5 sm:min-h-11 sm:w-auto sm:px-5 sm:text-sm"
                >
                  <TrackedLink
                    href="#szolgaltatasok"
                    eventName={publicAnalyticsEventNames.ctaClick}
                    eventPayload={{
                      source_page: "homepage",
                      source_section: "hero",
                      cta_variant: "primary",
                      cta_label: "Megkeresés indítása",
                      destination_path: "/#szolgaltatasok",
                      entry_point: "homepage_hero_primary",
                    }}
                  >
                    Megkeresés indítása
                  </TrackedLink>
                </Button>
              </motion.div>

              <motion.div
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-h-10 w-full rounded-xl border-[#c89758]/18 bg-[#c89758]/[0.08] px-4 text-[0.92rem] text-[#f2e2bc] shadow-none transition-colors hover:border-[#c89758]/32 hover:bg-[#c89758]/[0.14] hover:text-[#f7ebcf] sm:min-h-11 sm:w-auto sm:px-5 sm:text-sm"
                >
                  <TrackedLink
                    href="#lakossagi-gyakori-munkak"
                    eventName={publicAnalyticsEventNames.ctaClick}
                    eventPayload={{
                      source_page: "homepage",
                      source_section: "hero",
                      cta_variant: "secondary",
                      cta_label: "Lakossági gyakori munkák",
                      destination_path: "/#lakossagi-gyakori-munkak",
                      entry_point: "homepage_hero_residential_common_work",
                    }}
                  >
                    Lakossági gyakori munkák
                  </TrackedLink>
                </Button>
              </motion.div>

              <motion.div
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-h-10 w-full rounded-xl border-white/14 bg-white/[0.02] px-4 text-[0.92rem] text-white shadow-none transition-colors hover:border-[#c89758]/30 hover:bg-[#c89758]/10 hover:text-white sm:min-h-11 sm:w-auto sm:px-5 sm:text-sm"
                >
                  <TrackedLink
                    href="/szolgaltatasok/hibabejelentes"
                    eventName={publicAnalyticsEventNames.ctaClick}
                    eventPayload={{
                      source_page: "homepage",
                      source_section: "hero",
                      service_type: "hibabejelentes",
                      cta_variant: "secondary",
                      cta_label: "Gyors hibabejelentés indítása",
                      destination_path: "/szolgaltatasok/hibabejelentes",
                      entry_point: "homepage_hero_fault_report",
                    }}
                  >
                    Gyors hibabejelentés indítása
                  </TrackedLink>
                </Button>
              </motion.div>
            </div>
          </HeroMotion>

          <HeroMotion delay={0.32} className="mt-7">
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {trustHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-[#c89758]/15 bg-[#c89758]/[0.08] px-3 py-1.5 text-[0.78rem] text-zinc-100 sm:px-3.5 sm:py-2 sm:text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </HeroMotion>
        </div>

        <HeroMotion delay={0.4}>
          <div className="relative overflow-hidden rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-4 shadow-[0_20px_52px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:p-5 md:rounded-[1.9rem] md:p-7">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent md:inset-x-8" />
            <div className="public-pill-accent inline-flex px-3 py-1 text-xs font-medium tracking-[0.16em] uppercase">
              Átlátható indulás
            </div>

            <h2 className="mt-4 max-w-sm text-[1.42rem] font-semibold tracking-tight text-white sm:text-2xl md:text-[2rem]">
              Kevesebb bizonytalanság már az első megkeresésnél
            </h2>

            <p className="mt-3.5 max-w-md text-[0.92rem] leading-6 text-zinc-400 sm:text-sm">
              A strukturált adatbekérés segít elkülöníteni, hogy milyen
              jellegű feladatról van szó, mennyire sürgős a helyzet, és milyen
              adatok kellenek a következő érdemi visszajelzéshez.
            </p>

            <div className="mt-5 divide-y divide-white/10 rounded-[1.25rem] border border-white/10 bg-black/20 sm:mt-7 sm:rounded-[1.5rem]">
              {panelSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex gap-3 px-3.5 py-3 md:gap-4 md:px-5 md:py-4"
                >
                  <div className="flex h-[2.125rem] w-[2.125rem] shrink-0 items-center justify-center rounded-full border border-[#c89758]/18 bg-[#c89758]/10 text-[0.82rem] font-medium text-[#f1dfbc] md:h-10 md:w-10 md:text-sm">
                    0{index + 1}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[0.92rem] font-medium leading-6 text-zinc-100 md:text-sm">
                      {step.title}
                    </p>
                    <p className="text-[0.9rem] leading-6 text-zinc-400 md:text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </HeroMotion>
      </div>
    </section>
  )
}
