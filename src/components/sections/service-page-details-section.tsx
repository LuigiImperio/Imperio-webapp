import { ArrowRight, MapPin, MessagesSquare, Wrench } from "lucide-react"

import { TrackedLink } from "@/components/analytics/tracked-link"
import { Reveal } from "@/components/motion/reveal"
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events"
import type {
  ServicePageCluster,
  ServicePageFaq,
  ServicePageRelatedLink,
} from "@/lib/content/service-pages"
import type { ServiceRequestType } from "@/lib/service-requests/service-request-types"

type ServicePageDetailsSectionProps = {
  eyebrow: string
  title: string
  intro: string
  clusters: readonly ServicePageCluster[]
  localNoteTitle: string
  localNote: string
  relatedLinks: readonly ServicePageRelatedLink[]
  faqs: readonly ServicePageFaq[]
  sourcePage: string
  serviceType: ServiceRequestType
}

export function ServicePageDetailsSection({
  eyebrow,
  title,
  intro,
  clusters,
  localNoteTitle,
  localNote,
  relatedLinks,
  faqs,
  sourcePage,
  serviceType,
}: ServicePageDetailsSectionProps) {
  return (
    <section className="relative border-t border-white/10 bg-zinc-950/70">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-18">
        <Reveal className="max-w-4xl" variant="soft">
          <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
            {eyebrow}
          </div>
          <h2 className="mt-5 text-[1.9rem] font-semibold tracking-tight sm:text-[2.25rem] md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-[0.96rem] leading-6 text-zinc-300 sm:text-base sm:leading-7">
            {intro}
          </p>
        </Reveal>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {clusters.map((cluster, index) => (
            <Reveal key={cluster.title} delayMs={index * 80} variant="card">
              <article className="public-surface-soft h-full p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-200">
                    <Wrench className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-[1.02rem] font-semibold tracking-tight text-white md:text-[1.14rem]">
                      {cluster.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {cluster.description}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {cluster.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e4c78f]" />
                      <span className="text-sm leading-6 text-zinc-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)]">
          <Reveal variant="soft">
            <article className="public-surface-soft h-full p-4 md:p-5">
              <div className="flex items-start gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-200">
                  <ArrowRight className="size-4" />
                </span>
                <div>
                  <p className="text-[0.72rem] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                    Kapcsolódó irányok
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    Belső linkek a következő lépéshez
                  </h3>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {relatedLinks.map((link, index) => (
                  <TrackedLink
                    key={link.href}
                    href={link.href}
                    eventName={publicAnalyticsEventNames.ctaClick}
                    eventPayload={{
                      source_page: sourcePage,
                      source_section: "service_page_related_links",
                      service_type: serviceType,
                      cta_variant: "secondary",
                      cta_label: link.label,
                      destination_path: link.href,
                      entry_point: `service_page_related_link_${index + 1}`,
                    }}
                    className="group rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-all duration-300 hover:border-white/18 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{link.label}</p>
                        <p className="mt-1.5 text-sm leading-6 text-zinc-400">
                          {link.description}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 size-4 shrink-0 text-zinc-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-zinc-300" />
                    </div>
                  </TrackedLink>
                ))}
              </div>
            </article>
          </Reveal>

          <Reveal delayMs={80} variant="soft">
            <article className="public-surface-soft h-full p-4 md:p-5">
              <div className="flex items-start gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-200">
                  <MapPin className="size-4" />
                </span>
                <div>
                  <p className="text-[0.72rem] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                    Helyi relevancia
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    {localNoteTitle}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-300">{localNote}</p>
            </article>
          </Reveal>
        </div>

        <div className="mt-6">
          <Reveal variant="soft">
            <div className="mb-4 flex items-start gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-200">
                <MessagesSquare className="size-4" />
              </span>
              <div>
                <p className="text-[0.72rem] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                  Kérdés és válasz
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-[1.2rem]">
                  Rövid válaszok a leggyakoribb megkeresésekre
                </h3>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 lg:grid-cols-3">
            {faqs.map((faq, index) => (
              <Reveal key={faq.question} delayMs={120 + index * 70} variant="card">
                <article className="public-surface-soft h-full p-4 md:p-5">
                  <h4 className="text-[1rem] font-semibold tracking-tight text-white">
                    {faq.question}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {faq.answer}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
