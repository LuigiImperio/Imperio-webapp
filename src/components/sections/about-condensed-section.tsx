"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { Reveal } from "@/components/motion/reveal"

const reviews = [
  {
    text: "Vasárnap este tört el a vezeték, egy órán belül itt voltak. Gyors, korrekt, tiszta munka.",
    name: "Péter",
    meta: "Pécs · Sürgős javítás",
  },
  {
    text: "Kazáncserénél végig elmagyarázták, mi miért kell. Reális árat kaptam, a beüzemelés is profi volt.",
    name: "Laci",
    meta: "Kozármisleny · Kazáncsere",
  },
  {
    text: "A fürdőszoba teljes gépészetét rájuk bíztuk. Pontosak voltak, és minden nap tisztán hagyták a terepet.",
    name: "Zsófia",
    meta: "Pécs · Fürdőfelújítás",
  },
  {
    text: "Új házba hőszivattyús padlófűtést terveztek és építettek. Átlátható volt minden, a határidőt is tartották.",
    name: "András",
    meta: "Pellérd · Új építés",
  },
  {
    text: "A régi radiátoros fűtést beszabályozták és felújították — melegebb a lakás, és csökkent a számla.",
    name: "Ildikó",
    meta: "Pécs · Fűtéskorszerűsítés",
  },
  {
    text: "Felújításnál a teljes víz-, gáz- és fűtésszerelés az övék volt. Megbízható csapat, a gondokra is azonnal megoldás.",
    name: "Atilla",
    meta: "Pogány · Komplett kivitelezés",
  },
]

const stats = [
  { label: "Szakterület", value: "Víz · gáz · fűtés" },
  { label: "Munkák", value: "Lakossági + projekt" },
  { label: "Terület", value: "Pécs és környéke" },
]

function useRotatingReview() {
  const [reviewIndex, setReviewIndex] = useState(0)
  const [reviewLength, setReviewLength] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    function tick() {
      setReviewLength((currentLength) => {
        const fullText = reviews[reviewIndexRef.current].text

        if (!reduceMotion && currentLength < fullText.length) {
          timeoutRef.current = setTimeout(tick, 30)
          return currentLength + 1
        }

        timeoutRef.current = setTimeout(() => {
          reviewIndexRef.current = (reviewIndexRef.current + 1) % reviews.length
          setReviewIndex(reviewIndexRef.current)
          setReviewLength(0)
          timeoutRef.current = setTimeout(tick, 420)
        }, 2800)

        return fullText.length
      })
    }

    const reviewIndexRef = { current: reviewIndex }
    tick()

    return () => clearTimeout(timeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { review: reviews[reviewIndex], reviewLength }
}

export function AboutCondensedSection() {
  const { review, reviewLength } = useRotatingReview()
  const shownText = review.text.slice(0, reviewLength)

  return (
    <section
      id="rolunk"
      className="relative border-t border-white/10 bg-gradient-to-b from-[#07090d] to-zinc-950 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <Reveal
          variant="card"
          className="grid items-center gap-7 lg:grid-cols-[minmax(0,320px)_1fr]"
        >
          <div className="relative aspect-4/5 max-w-[320px] overflow-hidden rounded-[22px] border border-white/10">
            <Image
              src="/images/about/vezeto-portrait.jpg"
              alt="Az Imperio Gépészet vezetője"
              fill
              sizes="320px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,11,0)_30%,rgba(5,7,11,0.5)_56%,rgba(5,7,11,0.93))]" />
            <div className="absolute right-3.5 bottom-3.5 left-3.5">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-xs tracking-[2px] text-[#e8d0a0]">★★★★★</span>
                <span className="text-[10px] tracking-[0.2em] text-zinc-300 uppercase">
                  Ügyfélvéleményeink
                </span>
              </div>
              <p className="min-h-[4.5em] text-[13px] leading-5 text-[#f2f2f4] [text-shadow:0_1px_7px_rgba(0,0,0,0.7)]">
                „{shownText}
                <span className="animate-imperio-blink ml-px inline-block h-[0.95em] w-0.5 -translate-y-px bg-[#e8d0a0] align-middle" />
              </p>
              <div className="mt-1.5 text-[12.5px] font-bold text-[#f0dfbe]">
                {review.name} <span className="font-normal text-[#aba6b2]">· {review.meta}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
              Rólunk
            </div>
            <h2 className="mt-4 text-white max-w-[24ch] text-[1.7rem] font-bold tracking-tight sm:text-[2.2rem] md:text-[2.6rem]">
              Helyi gépészcsapat, valódi felelősséggel
            </h2>
            <p className="mt-4 max-w-[46rem] text-base leading-6 text-zinc-300 sm:text-[1.12rem] sm:leading-7">
              Pécsen és környékén dolgozunk, a hétköznapi hibáktól a teljes gépészeti
              kivitelezésig. Tiszta kommunikáció, korrekt munka, gyors visszajelzés — ezt visszük
              minden megkereséshez.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[14px] border border-[#c89758]/16 bg-[#c89758]/6 px-4 py-3"
                >
                  <div className="text-[13px] text-zinc-400">{stat.label}</div>
                  <div className="mt-1 text-[15px] font-semibold text-[#f0dfbe]">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
