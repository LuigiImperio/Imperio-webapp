import Link from "next/link";
import { Mail, PhoneCall } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events";
import {
  businessEmail,
  businessPhone,
  businessPhoneDisplay,
} from "@/lib/business";

const benefits = [
  "Strukturált adatbekérés",
  "Jobban előkészített visszajelzés",
  "Átlátható következő lépés",
];

export function ContactCtaSection() {
  return (
    <section
      id="kapcsolat"
      className="relative border-t border-white/10 bg-zinc-950 scroll-mt-24"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <Reveal
          className="public-surface-strong overflow-hidden p-5 md:p-10"
          variant="hero"
        >
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)] lg:items-end">
            <div className="max-w-3xl">
              <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
                Záró belépési pont
              </div>

              <h2 className="mt-5 max-w-3xl text-[1.9rem] font-semibold tracking-tight sm:text-[2.25rem] md:text-5xl">
                Válassza ki a megfelelő szolgáltatást, és indítsa el a
                megkeresést
              </h2>

              <p className="mt-4 max-w-2xl text-[0.96rem] leading-6 text-zinc-300 sm:text-base sm:leading-7 md:text-lg">
                Ha már körvonalazódott a feladat, a szolgáltatásoldalakon rögtön
                elindítható a megfelelő folyamat. Sürgős helyzetben a
                hibabejelentés a leggyorsabb belépési pont.
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="public-button-primary min-h-10 w-full rounded-2xl px-4 text-[0.92rem] transition-all duration-300 hover:-translate-y-0.5 sm:min-h-11 sm:w-auto sm:px-5 sm:text-sm"
                >
                  <a href="#szolgaltatasok">Megkeresés indítása</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-h-10 w-full rounded-2xl border-[#c89758]/18 bg-[#c89758]/[0.08] px-4 text-[0.92rem] text-[#f2e2bc] shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c89758]/32 hover:bg-[#c89758]/[0.14] hover:text-[#f7ebcf] sm:min-h-11 sm:w-auto sm:px-5 sm:text-sm"
                >
                  <TrackedLink
                    href="#lakossagi-gyakori-munkak"
                    eventName={publicAnalyticsEventNames.ctaClick}
                    eventPayload={{
                      source_page: "homepage",
                      source_section: "closing_contact_cta",
                      cta_variant: "secondary",
                      cta_label: "Lakossági gyakori munkák",
                      destination_path: "/#lakossagi-gyakori-munkak",
                      entry_point: "homepage_contact_cta_residential_common_work",
                    }}
                  >
                    Lakossági gyakori munkák
                  </TrackedLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-h-10 w-full rounded-2xl border-white/20 bg-transparent px-4 text-[0.92rem] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white sm:min-h-11 sm:w-auto sm:px-5 sm:text-sm"
                >
                  <Link href="/szolgaltatasok/hibabejelentes">
                    Gyors hibabejelentés indítása
                  </Link>
                </Button>
              </div>

              <p className="mt-4 max-w-2xl text-[0.9rem] leading-6 text-zinc-400 md:text-sm">
                A szolgáltatásoldalakon rövid bevezető után azonnal indulhat a
                megfelelő űrlap, opcionális képfeltöltéssel és tisztább
                előkészítéssel.
              </p>

              <div className="mt-6 max-w-2xl rounded-[1.35rem] border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:mt-8 md:rounded-[1.75rem] md:p-6">
                <p className="text-[0.7rem] font-medium tracking-[0.24em] text-zinc-500 uppercase">
                  Közvetlen elérhetőség
                </p>

                <p className="mt-3 text-sm leading-6 text-zinc-300 md:text-[0.95rem]">
                  A legpontosabb induláshoz továbbra is érdemes a strukturált
                  megkeresési folyamatot használni. Ha azonban inkább
                  közvetlenül keresne bennünket, az alábbi elérhetőségeken is
                  rendelkezésre állunk.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <a
                    href={`tel:${businessPhone}`}
                    className="group rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-3.5 py-3.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 md:rounded-[1.35rem] md:px-4 md:py-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-200">
                        <PhoneCall className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.7rem] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                          Telefon
                        </p>
                        <span className="mt-2 block text-base font-medium text-white transition-colors duration-300 group-hover:text-zinc-100">
                          {businessPhoneDisplay}
                        </span>
                      </div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${businessEmail}`}
                    className="group rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-3.5 py-3.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 md:rounded-[1.35rem] md:px-4 md:py-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-200">
                        <Mail className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.7rem] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                          E-mail
                        </p>
                        <span className="mt-2 block break-all text-base font-medium text-white transition-colors duration-300 group-hover:text-zinc-100">
                          {businessEmail}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 md:gap-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-[1.35rem] border border-white/10 bg-black/20 px-4 py-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:rounded-[1.5rem]"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/80" />
                    <span className="text-sm text-zinc-200">{benefit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
