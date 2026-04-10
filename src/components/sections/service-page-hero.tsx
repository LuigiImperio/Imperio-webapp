import { TrackedLink } from "@/components/analytics/tracked-link"
import { Reveal } from "@/components/motion/reveal"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events"
import { supportedServiceAreaLabel } from "@/lib/service-area"

type ServicePageHeroProps = {
  title: string
  intro: string
  leadTitle: string
  leadDescription: string
  serviceType: string
  sourcePage: string
  primaryCtaLabel: string
  highlights: readonly string[]
}

export function ServicePageHero({
  title,
  intro,
  leadTitle,
  leadDescription,
  serviceType,
  sourcePage,
  primaryCtaLabel,
  highlights,
}: ServicePageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.06),transparent_24%)]" />
      <div className="absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_38%,rgba(0,0,0,0.28))]" />
      <div className="animate-imperio-float absolute -left-14 top-18 h-40 w-40 rounded-full bg-white/[0.04] blur-3xl" />
      <div className="animate-imperio-float absolute right-0 top-24 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl [animation-delay:900ms]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-22">
        <Reveal className="max-w-5xl" variant="hero">
          <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
            Szolgáltatásoldal
          </div>

          <h1 className="mt-5 text-[2.1rem] font-semibold tracking-tight sm:text-[2.85rem] md:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-3xl text-[0.96rem] leading-6 text-zinc-300 sm:text-base sm:leading-7 md:text-lg">
            {intro}
          </p>

          <div className="public-surface-strong mt-7 overflow-hidden p-4 sm:p-5 md:mt-10 md:p-8">
            <div className="max-w-3xl">
              <h2 className="text-[1.45rem] font-semibold tracking-tight sm:text-[1.8rem] md:text-5xl">
                {leadTitle}
              </h2>

              <p className="mt-4 max-w-3xl text-[0.96rem] leading-6 text-zinc-400 sm:text-base sm:leading-7 md:text-lg">
                {leadDescription}
              </p>
              <p className="mt-3 max-w-3xl text-[0.9rem] leading-6 text-zinc-500 md:text-sm">
                Szolgáltatási terület: {supportedServiceAreaLabel}.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <TrackedLink
                href="#urlap"
                eventName={publicAnalyticsEventNames.ctaClick}
                eventPayload={{
                  service_type: serviceType,
                  source_page: sourcePage,
                  source_section: "service_hero",
                  cta_variant: "primary",
                  cta_label: primaryCtaLabel,
                  destination_path: "#urlap",
                  entry_point: "service_page_hero_primary",
                }}
                className="public-button-primary inline-flex min-h-10 items-center justify-center rounded-2xl px-4 text-[0.92rem] font-medium transition-all duration-300 hover:-translate-y-0.5 sm:min-h-11 sm:px-5 sm:text-sm"
              >
                {primaryCtaLabel}
              </TrackedLink>
              <TrackedLink
                href="/#szolgaltatasok"
                eventName={publicAnalyticsEventNames.ctaClick}
                eventPayload={{
                      service_type: serviceType,
                      source_page: sourcePage,
                      source_section: "service_hero",
                      cta_variant: "secondary",
                      cta_label: "Összes szolgáltatás",
                      destination_path: "/#szolgaltatasok",
                      entry_point: "service_page_hero_secondary",
                    }}
                className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/15 bg-transparent px-4 text-[0.92rem] font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10 sm:min-h-11 sm:px-5 sm:text-sm"
              >
                Összes szolgáltatás
              </TrackedLink>
            </div>
            <p className="mt-4 text-[0.9rem] leading-6 text-zinc-400 md:text-sm">
              A fő gomb közvetlenül az űrlaphoz ugrik.
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-3.5 md:mt-10 md:grid-cols-3 md:gap-4">
          {highlights.map((item, index) => (
            <Reveal key={item} delayMs={120 + index * 90} variant="card">
              <Card className="public-surface-soft public-card-hover group h-full border-white/10 text-white shadow-none">
                <CardHeader className="space-y-2.5 p-4 pb-3 md:space-y-3 md:p-6 md:pb-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    0{index + 1}
                  </div>
                  <CardTitle className="text-[1.02rem] md:text-xl">{item}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                  <p className="text-[0.9rem] leading-6 text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300 md:text-sm">
                    Röviden mutatja, mire számíthat.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
