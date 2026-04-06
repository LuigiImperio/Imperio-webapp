"use client";

import { useId, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChevronUp,
  FileText,
} from "lucide-react";

import { JobApplicationForm } from "@/components/forms/job-application-form";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WorkWithUsSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formPanelId = useId();

  return (
    <section
      id="dolgozz-velunk"
      className="relative overflow-hidden border-t border-white/10 bg-zinc-950 scroll-mt-24"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(200,151,88,0.08)] blur-3xl" />
      <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-24">
        <Reveal className="mx-auto max-w-4xl" variant="hero">
          <div className="public-surface-strong overflow-hidden">
            <div className="relative px-4 pt-6 sm:px-6 md:px-10 md:pt-10">
              <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_58%)]" />

              <div className="relative mx-auto max-w-3xl text-center">
                <div className="public-pill inline-flex items-center gap-2 px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
                  <BriefcaseBusiness className="size-4 text-zinc-200" />
                  Dolgozz velünk
                </div>

                <h2 className="mt-5 text-[1.9rem] font-semibold tracking-tight text-white sm:text-[2.25rem] md:text-5xl">
                  Jelentkezz hozzánk, egy lehetséges jövőbeni együttműködésért!
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-[0.96rem] leading-6 text-zinc-200 sm:text-base sm:leading-7 md:text-[1.125rem] md:leading-8">
                  Előfordulhat, hogy éppen nincs nyitott pozíció. Ettől
                  függetlenül most is elküldheti jelentkezését, és ha később
                  megfelelő lehetőség nyílik, az anyag újra előkerülhet.
                </p>
              </div>
            </div>

            <div className="relative mt-5 border-t border-white/10 bg-[linear-gradient(180deg,rgba(10,10,12,0.16),rgba(0,0,0,0.24))] px-4 py-4 sm:px-6 md:mt-8 md:px-10 md:py-7">
              <div className="mx-auto flex max-w-3xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.72rem] font-medium tracking-[0.2em] text-zinc-300 uppercase">
                    <FileText className="size-3.5" />
                    Jelentkezési csatorna
                  </div>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    Egy rövid jelentkezéssel most is jelezheti érdeklődését, az
                    anyag pedig későbbi egyeztetésnél is rendelkezésre állhat.
                  </p>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <Button
                    type="button"
                    size="lg"
                    aria-controls={formPanelId}
                    aria-expanded={isFormOpen}
                    onClick={() => setIsFormOpen(true)}
                    className="public-button-primary min-h-10 w-full rounded-2xl px-4 text-[0.92rem] sm:min-h-11 sm:w-auto sm:px-5 sm:text-sm"
                  >
                    <span>Jelentkezési lehetőség megnyitása</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div
          id={formPanelId}
          className={cn(
            "mx-auto grid max-w-4xl overflow-hidden transition-[grid-template-rows,opacity,transform,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isFormOpen
              ? "mt-4 [grid-template-rows:1fr] opacity-100 md:mt-6"
              : "mt-2 [grid-template-rows:0fr] opacity-0 pointer-events-none -translate-y-2",
          )}
        >
          <div className="overflow-hidden">
            <div className="public-surface-soft space-y-4 p-3.5 md:space-y-5 md:p-5">
              <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[0.72rem] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                    Jelentkezési űrlap
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    Az alábbi űrlap néhány alapadat és az önéletrajz rendezett
                    beküldésére szolgál. Ha később megfelelő szakmai lehetőség
                    nyílik, ebből az anyagból lehet továbbindulni.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:w-auto"
                  >
                    <ChevronUp className="size-4" />
                    Jelentkezési lehetőség bezárása
                  </button>
                </div>
              </div>

              <Reveal delayMs={80} variant="soft">
                <JobApplicationForm />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
