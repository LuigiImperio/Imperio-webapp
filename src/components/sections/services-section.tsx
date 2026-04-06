"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  Check,
  Flame,
  Thermometer,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events";
import type { ServiceRequestType } from "@/lib/service-requests/service-request-types";
import { supportedServiceAreaLabel } from "@/lib/service-area";
import { cn } from "@/lib/utils";

const serviceCategories = [
  {
    title: "Fűtési rendszerek karbantartása és optimalizálása",
    icon: Thermometer,
    description:
      "Rendszeres átvizsgálás, beszabályozás és teljesítményjavító finomhangolás központi fűtési rendszerekhez és kapcsolódó elemekhez.",
    bullets: [
      "Központi fűtési rendszerek karbantartása és szezon előtti szervize",
      "Radiátorok, csőhálózatok és teljesítményproblémák áttekintése",
      "Termosztátok, szelepek és szivattyúk beszabályozása",
      "Finomhangolás és energiahatékonysági optimalizálás",
    ],
    href: "/szolgaltatasok/futeskorszerusites",
    requestFlowType: "futeskorszerusites" satisfies ServiceRequestType,
    serviceCategoryKey: "futesi_rendszerek_karbantartasa_optimalizalasa",
    ctaLabel: "Megkeresés indítása",
  },
  {
    title: "Szerelési munkák és rendszerkivitelezés",
    icon: Wrench,
    description:
      "Víz-, gáz- és fűtési rendszerek szerelése, átalakítása és üzemszerű működéshez szükséges kivitelezése rendezett műszaki egyeztetéssel.",
    bullets: [
      "Vízvezeték- és gázrendszerek szerelése, javítása",
      "Központi és vegyes tüzelésű fűtési rendszerek szerelése",
      "Csőhálózatok kiépítése, átalakítása és bekötési pontok kialakítása",
      "Berendezések cseréje és új elemek szakszerű bekötése",
    ],
    href: "/szolgaltatasok/vizszereles",
    requestFlowType: "vizszereles" satisfies ServiceRequestType,
    serviceCategoryKey: "szerelesi_munkak_rendszerkivitelezes",
    ctaLabel: "Megkeresés indítása",
  },
  {
    title: "Gépészeti kivitelezés és fűtéstechnika",
    icon: Flame,
    description:
      "Fűtéstechnikai és gépészeti rendszerek telepítése, bekötése és üzembe helyezése összetettebb műszaki megoldásokhoz.",
    bullets: [
      "Hőszivattyúk és hibrid fűtési rendszerek kialakítása",
      "Központi fűtési rendszerek kivitelezése és rendszerösszekötések",
      "Fürdőszobák gépészeti kiépítése és kapcsolódó kivitelezési munkák",
      "Kazánok, köztük Baxi típusú berendezések telepítése és beüzemelése",
    ],
    href: "/szolgaltatasok/kazancsere",
    requestFlowType: "kazancsere" satisfies ServiceRequestType,
    serviceCategoryKey: "gepeszeti_kivitelezes_futestechnika",
    ctaLabel: "Megkeresés indítása",
  },
  {
    title: "Komplett épületgépészeti kivitelezés",
    icon: Building2,
    description:
      "Nagyobb léptékű gépészeti projektek felülvizsgálattal, korszerűsítési szemlélettel és mérnöki háttérrel támogatva.",
    bullets: [
      "Műszaki állapotfelmérés és rendszerek felülvizsgálata",
      "Elavult elemek cseréje, korszerűsítés és optimalizálás",
      "Energiahatékonysági és működési fejlesztések előkészítése",
      "Komplex projektek szakmai támogatása és koordinációja",
    ],
    href: "/szolgaltatasok/komplett-epuletgepeszeti-kivitelezes",
    requestFlowType:
      "komplett_epuletgepeszeti_kivitelezes" satisfies ServiceRequestType,
    serviceCategoryKey: "komplett_epuletgepeszeti_kivitelezes",
    ctaLabel: "Megkeresés indítása",
  },
] as const;

type ServiceCategory = (typeof serviceCategories)[number];

function ServiceCardIcon({
  Icon,
  shouldReduceMotion,
  delayMs,
}: {
  Icon: LucideIcon;
  shouldReduceMotion: boolean;
  delayMs: number;
}) {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center md:h-11 md:w-11">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl border border-[#c89758]/14"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.18, 0.34, 0.18],
                scale: [0.985, 1.025, 0.985],
              }
        }
        transition={{
          duration: 6.8,
          delay: delayMs / 1000,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-[2px] rounded-[0.8rem] bg-[radial-gradient(circle_at_35%_35%,rgba(232,208,160,0.16),rgba(200,151,88,0.04),transparent_72%)]"
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.28, 0.46, 0.28],
              }
        }
        transition={{
          duration: 5.6,
          delay: delayMs / 1000,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-[-3px] hidden rounded-[1rem] md:block"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(228,199,143,0) 0deg, rgba(228,199,143,0.34) 56deg, rgba(228,199,143,0) 104deg, rgba(228,199,143,0) 360deg)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 1px), black calc(100% - 1px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 1px), black calc(100% - 1px))",
        }}
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{
          duration: 16,
          delay: delayMs / 1000,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-100 md:h-11 md:w-11">
        <Icon
          className="h-[1.125rem] w-[1.125rem] md:h-5 md:w-5"
          strokeWidth={1.9}
        />
      </div>
    </div>
  );
}

function ServiceCategoryCard({
  service,
  delayMs,
  shouldReduceMotion,
}: {
  service: ServiceCategory;
  delayMs: number;
  shouldReduceMotion: boolean;
}) {
  const Icon = service.icon as LucideIcon;

  return (
    <Reveal delayMs={delayMs} variant="card">
      <motion.div
        initial={false}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        className="h-full"
      >
        <Card
          className={cn(
            "group flex h-full flex-col border border-white/10 bg-white/[0.04] text-white shadow-none transition-all duration-300",
            "hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]",
          )}
        >
          <CardHeader className="space-y-3.5 p-4 pb-3 sm:p-5 md:space-y-4 md:pb-4">
            <ServiceCardIcon
              Icon={Icon}
              shouldReduceMotion={shouldReduceMotion}
              delayMs={delayMs}
            />

            <div className="space-y-2.5">
              <CardTitle className="max-w-[22ch] text-[1.18rem] leading-[1.18] tracking-tight text-white sm:text-[1.28rem] md:max-w-[20ch] md:text-[1.85rem]">
                {service.title}
              </CardTitle>
              <CardDescription className="max-w-[48ch] text-[0.92rem] leading-6 text-zinc-400 md:text-sm">
                {service.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col p-4 pt-0 sm:p-5 sm:pt-0">
            <ul className="space-y-2">
              {service.bullets.map((bullet, index) => (
                <li
                  key={bullet}
                  className={cn(
                    "items-start gap-3 text-[0.9rem] leading-6 text-zinc-300 md:text-[0.95rem]",
                    index === service.bullets.length - 1
                      ? "hidden md:flex"
                      : "flex",
                  )}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-100">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-5">
              <Button
                asChild
                variant="secondary"
                className="h-10 w-full justify-between rounded-xl border border-white/10 bg-white/[0.05] px-3.5 text-[0.92rem] text-white shadow-none transition-all duration-300 hover:border-white/20 hover:bg-white/[0.1] hover:text-white md:h-11 md:px-4 md:text-sm"
              >
                <TrackedLink
                  href={service.href}
                  eventName={publicAnalyticsEventNames.ctaClick}
                  eventPayload={{
                    source_page: "homepage",
                    source_section: "services_categories",
                    service_type: service.requestFlowType,
                    service_category: service.serviceCategoryKey,
                    cta_variant: "secondary",
                    cta_label: service.ctaLabel,
                    destination_path: service.href,
                    entry_point: "homepage_service_category_card",
                  }}
                >
                  <span>{service.ctaLabel}</span>
                  <ArrowRight className="h-4 w-4 opacity-75 transition-transform duration-300 group-hover:translate-x-0.5" />
                </TrackedLink>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Reveal>
  );
}

export function ServicesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="szolgaltatasok"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-24"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />

      <Reveal className="mb-8 max-w-4xl md:mb-12" variant="hero">
        <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
          Fő szolgáltatási területek
        </div>

        <h2 className="mt-5 text-[1.9rem] font-semibold tracking-tight sm:text-[2.25rem] md:text-5xl">
          Válassza ki, melyik szolgáltatási terület áll legközelebb az
          igényéhez.
        </h2>

        <p className="mt-4 max-w-3xl text-[0.96rem] leading-6 text-zinc-300 sm:text-base sm:leading-7 md:text-lg">
          Az alábbi kategóriák az összetettebb gépészeti, szerelési és
          kivitelezési feladatokhoz adnak gyors szakmai eligazodást. Tipikus
          lakossági munkákhoz a külön lakossági áttekintés ad gyorsabb
          kiindulópontot.
        </p>

        <p className="mt-3 max-w-3xl text-[0.9rem] leading-6 text-zinc-500 md:text-sm">
          Sürgős hibánál a gyorsszerviz útvonal a legjobb indulás, tipikus
          lakossági feladatoknál pedig a lakossági áttekintés. Kiemelt terület:{" "}
          {supportedServiceAreaLabel}.
        </p>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          <Button
            asChild
            variant="secondary"
            className="group h-10 w-full justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-[0.9rem] text-white shadow-none transition-all duration-300 hover:border-white/16 hover:bg-white/[0.08] hover:text-white sm:w-auto md:h-11 md:px-4 md:text-sm"
          >
            <TrackedLink
              href="#lakossagi-gyakori-munkak"
              eventName={publicAnalyticsEventNames.ctaClick}
              eventPayload={{
                source_page: "homepage",
                source_section: "services_categories_intro",
                cta_variant: "secondary",
                cta_label: "Lakossági gyakori munkák",
                destination_path: "/#lakossagi-gyakori-munkak",
                entry_point: "homepage_services_intro_residential_common_work",
              }}
            >
              <span>Lakossági gyakori munkák</span>
              <ArrowRight className="h-4 w-4 opacity-75 transition-transform duration-300 group-hover:translate-x-0.5" />
            </TrackedLink>
          </Button>

          <Button
            asChild
            variant="secondary"
            className="group h-10 w-full justify-between rounded-xl border border-[#c89758]/16 bg-[#c89758]/[0.08] px-3.5 text-[0.9rem] text-[#f2e2bc] shadow-none transition-all duration-300 hover:border-[#c89758]/28 hover:bg-[#c89758]/[0.14] hover:text-[#f7ebcf] sm:w-auto md:h-11 md:px-4 md:text-sm"
          >
            <TrackedLink
              href="/szolgaltatasok/hibabejelentes"
              eventName={publicAnalyticsEventNames.ctaClick}
              eventPayload={{
                source_page: "homepage",
                source_section: "services_categories_intro",
                service_type: "hibabejelentes",
                cta_variant: "secondary",
                cta_label: "Gyors hibabejelentés",
                destination_path: "/szolgaltatasok/hibabejelentes",
                entry_point: "homepage_services_intro_fault_report",
              }}
            >
              <span>Gyors hibabejelentés</span>
              <ArrowRight className="h-4 w-4 opacity-75 transition-transform duration-300 group-hover:translate-x-0.5" />
            </TrackedLink>
          </Button>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {serviceCategories.map((service, index) => (
          <ServiceCategoryCard
            key={service.title}
            service={service}
            delayMs={index * 90}
            shouldReduceMotion={Boolean(shouldReduceMotion)}
          />
        ))}
      </div>

      <Reveal
        className="public-surface mt-7 overflow-hidden p-4 sm:p-5 md:mt-8 md:p-8"
        variant="soft"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="public-pill-accent inline-flex items-center gap-2 px-3 py-1 text-xs font-medium tracking-[0.16em] uppercase">
              <TriangleAlert className="size-3.5" />
              Sürgős esetek
            </div>

            <h3 className="mt-4 text-[1.15rem] font-semibold tracking-tight text-white sm:text-xl md:text-3xl">
              Hibaelhárítás és gyorsszerviz
            </h3>

            <p className="mt-3 text-[0.92rem] leading-6 text-zinc-300 md:text-base md:leading-7">
              Azonnali beavatkozást igénylő hibáknál ne a fenti kategóriákkal
              kezdjen, hanem közvetlenül a gyors hibabejelentést használja. Ez a
              leggyorsabb belépési pont sürgős meghibásodások, leállások vagy
              azonnali figyelmet igénylő problémák esetén.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="public-button-primary min-h-10 w-full rounded-2xl px-4 text-[0.92rem] sm:min-h-11 sm:w-auto sm:px-5 sm:text-sm"
          >
            <TrackedLink
              href="/szolgaltatasok/hibabejelentes"
              eventName={publicAnalyticsEventNames.ctaClick}
              eventPayload={{
                source_page: "homepage",
                source_section: "services_quick_fault",
                service_type: "hibabejelentes",
                cta_variant: "primary",
                cta_label: "Gyors hibabejelentés indítása",
                destination_path: "/szolgaltatasok/hibabejelentes",
                entry_point: "homepage_services_quick_fault",
              }}
            >
              Gyors hibabejelentés indítása
            </TrackedLink>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
