import Image from "next/image"

import { businessEmail, businessPhone, businessPhoneDisplay } from "@/lib/business"

export function ContactFooterSection() {
  return (
    <footer
      id="kapcsolat"
      className="relative border-t border-white/10 bg-[#07090d] scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:px-10 md:py-14">
        <div className="grid gap-7 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/brand/logo1.0.svg"
                alt="Imperio Gépészet logó"
                width={42}
                height={42}
                className="object-contain"
              />
              <span className="font-bold tracking-[0.02em] text-white">IMPERIO GÉPÉSZET KFT.</span>
            </div>
            <p className="mt-3.5 max-w-[26rem] text-sm leading-6 text-zinc-400">
              Épületgépészet, víz-, gáz- és fűtésszerelés Pécsen és környékén — lakossági
              hibáktól a teljes kivitelezésig.
            </p>
            <dl className="mt-4 grid gap-2">
              <div className="flex gap-2.5 text-[13.5px] leading-5">
                <dt className="w-16 shrink-0 text-zinc-500">Cím</dt>
                <dd className="m-0 text-zinc-300">7831 Pellérd, Szőlőhegy dűlő 001437</dd>
              </div>
              <div className="flex gap-2.5 text-[13.5px] leading-5">
                <dt className="w-16 shrink-0 text-zinc-500">Adószám</dt>
                <dd className="m-0 text-zinc-300">33058029-2-02</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${businessPhone}`}
                className="public-button-primary inline-flex h-[46px] items-center gap-2.5 rounded-[13px] px-4 text-[14.5px] font-semibold"
              >
                {businessPhoneDisplay}
              </a>
              <a
                href={`mailto:${businessEmail}`}
                className="inline-flex h-[46px] items-center gap-2.5 rounded-[13px] border border-white/12 bg-white/[0.04] px-4 text-[14.5px] font-semibold text-white"
              >
                {businessEmail}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/7 pt-5">
          <p className="m-0 max-w-[64ch] text-[12.5px] text-zinc-500">
            Szolgáltatási terület: Pécs · Kozármisleny · Pellérd · Pogány · Keszü · Gyód · Orfű ·
            Abaliget · Hosszúhetény · Komló · Siklós · Szentlőrinc
          </p>
          <p className="m-0 text-[12.5px] text-zinc-600">© 2026 Imperio Gépészet Kft.</p>
        </div>
      </div>
    </footer>
  )
}
