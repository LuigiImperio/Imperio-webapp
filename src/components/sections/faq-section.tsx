"use client"

import { useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events"
import { faqItems } from "@/lib/content/faqs"
import { trackPublicEvent } from "@/lib/analytics/tracker"

export function FaqSection() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  return (
    <section
      id="gyik"
      className="relative border-t border-white/10 bg-zinc-900/35 scroll-mt-24"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <Reveal className="mb-8 md:mb-10" variant="soft">
          <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
            Gyakori kérdések
          </div>
          <h2 className="mt-5 text-white text-[1.9rem] font-semibold tracking-tight sm:text-[2.2rem] md:text-4xl">
            Amit gyakran kérdeznek
          </h2>
        </Reveal>

        <div className="grid gap-2.5">
          {faqItems.map((faq, index) => {
            const isOpen = openQuestion === faq.question

            return (
              <Reveal key={faq.question} delayMs={index * 60} variant="card">
                <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => {
                      const willOpen = !isOpen
                      setOpenQuestion(willOpen ? faq.question : null)

                      if (willOpen) {
                        trackPublicEvent(publicAnalyticsEventNames.faqItemExpanded, {
                          source_page: "homepage",
                          source_section: "faq",
                          faq_question: faq.question,
                        })
                      }
                    }}
                  >
                    <span className="text-[15.5px] font-semibold text-white">{faq.question}</span>
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-[#c89758]/25 bg-[#c89758]/10 text-[18px] leading-none text-[#f0dfbe]">
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${index}`}
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "[grid-template-rows:1fr] opacity-100" : "[grid-template-rows:0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[14.5px] leading-6 text-zinc-400">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
