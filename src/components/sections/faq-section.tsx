"use client"

import { useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events"
import { faqItems } from "@/lib/content/faqs"
import { trackPublicEvent } from "@/lib/analytics/tracker"

export function FaqSection() {
  const defaultOpenQuestion = "Hogyan működik a strukturált megkeresés?"
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    defaultOpenQuestion
  )

  return (
    <section
      id="gyik"
      className="relative border-t border-white/10 bg-zinc-900/35 scroll-mt-24"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <Reveal className="mb-8 max-w-3xl md:mb-10" variant="soft">
          <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
            Gyakori kérdések
          </div>
          <h2 className="mt-5 text-[1.9rem] font-semibold tracking-tight sm:text-[2.2rem] md:text-4xl">
            Rövid válaszok a legfontosabb tudnivalókra
          </h2>
          <p className="mt-3.5 max-w-2xl text-[0.96rem] leading-6 text-zinc-400 sm:text-base sm:leading-7">
            Itt röviden összefoglaltuk azokat a tudnivalókat, amelyek segítenek
            tisztábban látni a megkeresés menetét és a következő lépéseket,
            akár szolgáltatásból, akár konkrét problémából indulna ki.
          </p>
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-2">
          {faqItems.map((faq, index) => (
            <Reveal key={faq.question} delayMs={index * 70} variant="card">
              <article
                className={[
                  "public-surface-soft group relative p-3.5 transition-all duration-300 hover:border-white/15 md:p-5",
                  openQuestion === faq.question
                    ? "border-[#c89758]/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[inset_0_1px_0_rgba(255,247,230,0.04),0_18px_48px_rgba(0,0,0,0.22)]"
                    : "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.022))]",
                ].join(" ")}
              >
                <div
                  className={[
                    "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition-opacity duration-300",
                    openQuestion === faq.question
                      ? "via-[#e4c78f]/55 opacity-100"
                      : "via-white/0 opacity-0",
                  ].join(" ")}
                />
                <button
                  type="button"
                  aria-expanded={openQuestion === faq.question}
                  aria-controls={`faq-panel-${index}`}
                  className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl pr-1 text-left text-[0.94rem] font-medium leading-6 text-white outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#c89758]/22 focus-visible:ring-offset-0 md:text-base md:leading-7"
                  onClick={() => {
                    const willOpen = openQuestion !== faq.question

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
                  <span>{faq.question}</span>
                  <span
                    className={[
                      "mt-0.5 inline-flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full border text-sm transition-all duration-300 md:mt-1 md:h-7 md:w-7",
                      openQuestion === faq.question
                        ? "rotate-45 border-[#d5b174]/30 bg-[#c89758]/12 text-[#eddcb9]"
                        : "border-white/10 bg-black/20 text-zinc-300 group-hover:border-white/20",
                    ].join(" ")}
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-panel-${index}`}
                  className={[
                    "grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    openQuestion === faq.question
                      ? "mt-4 [grid-template-rows:1fr] opacity-100"
                      : "[grid-template-rows:0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[60ch] text-sm leading-6 text-zinc-400 md:leading-7">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
