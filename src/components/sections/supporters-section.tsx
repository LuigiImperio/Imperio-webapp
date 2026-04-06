import Image from "next/image"

import { Reveal } from "@/components/motion/reveal"

const supporters = [
  {
    name: "OFA",
    src: "/images/sponsor/OFA.svg",
    alt: "OFA támogató logó",
    width: 220,
    height: 80,
  },
] as const

export function SupportersSection() {
  return (
    <footer className="relative border-t border-white/10 bg-zinc-950 text-white">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 md:px-10 md:py-14">
        <Reveal className="mx-auto max-w-4xl text-center" variant="soft">
          <div className="public-pill inline-flex px-4 py-1 text-sm">
            Támogatóink
          </div>
        </Reveal>

        <div className="mx-auto mt-6 max-w-4xl">
          <div
            className={`grid gap-5 ${
              supporters.length === 1
                ? "justify-items-center"
                : "sm:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            {supporters.map((supporter, index) => (
              <Reveal
                key={supporter.name}
                className={
                  supporters.length === 1 ? "w-full max-w-[22rem]" : "w-full"
                }
                delayMs={index * 70}
                variant="card"
              >
                <div className="public-surface-soft flex min-h-28 items-center justify-center p-4 sm:min-h-32 sm:p-5">
                  <div className="flex w-full items-center justify-center rounded-[1.25rem] border border-black/5 bg-white/95 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:rounded-[1.4rem] sm:px-6 sm:py-6">
                    <Image
                      alt={supporter.alt}
                      className="h-auto max-h-16 w-auto max-w-[11rem] object-contain md:max-h-18 md:max-w-[13rem]"
                      height={supporter.height}
                      sizes="(min-width: 1280px) 220px, (min-width: 768px) 220px, 176px"
                      src={supporter.src}
                      width={supporter.width}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
