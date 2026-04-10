import Link from "next/link"
import Image from "next/image"

import { Reveal } from "@/components/motion/reveal"
import { businessEmail, businessName, businessPhone, businessPhoneDisplay } from "@/lib/business"
import { imprintPath, privacyPolicyPath } from "@/lib/legal"

const supporters = [
  {
    name: "OFA",
    src: "/images/sponsor/OFA.svg",
    alt: "OFA támogató logó",
    width: 220,
    height: 80,
  },
] as const

const legalLinks = [
  {
    href: privacyPolicyPath,
    label: "Adatkezelési tájékoztató",
  },
  {
    href: imprintPath,
    label: "Impresszum",
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

        <Reveal className="mx-auto mt-8 max-w-4xl" delayMs={120} variant="soft">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-5 sm:py-6">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {businessName} |{" "}
              <a
                href={`tel:${businessPhone}`}
                className="transition-colors hover:text-zinc-200"
              >
                {businessPhoneDisplay}
              </a>{" "}
              |{" "}
              <a
                href={`mailto:${businessEmail}`}
                className="break-all transition-colors hover:text-zinc-200"
              >
                {businessEmail}
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
