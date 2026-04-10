"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events";
import { trackPublicEvent } from "@/lib/analytics/tracker";
import { businessPhone } from "@/lib/business";

const responseSteps = [
  {
    title: "Kiválasztja a megfelelő utat",
  },
  {
    title: "Megad néhány fontos adatot",
  },
  {
    title: "Visszajelzünk",
  },
] as const;

const socialProofItems = [
  {
    highlight: "5+",
    text: "év szakmai tapasztalat",
    fullText: "5+ év szakmai tapasztalat",
  },
  {
    highlight: "2000+",
    text: "elvégzett munka",
    fullText: "2000+ elvégzett munka",
  },
  {
    highlight: "Pécs",
    text: "és környéke",
    fullText: "Pécs és környéke",
  },
] as const;

const feedbackItems = [
  {
    quote:
      "Nagyon elégedett voltam a szolgáltatással, gyorsak és precízek voltak a munkájuk során.",
    author: "László, Pécs",
  },
  {
    quote:
      "Kiváló munka, mindent időben végeztek el, és a kommunikáció is nagyszerű volt.",
    author: "László, Kozármisleny",
  },
  {
    quote:
      "Minden problémámra megoldást találtak, és az áraik is igazán barátságosak.",
    author: "Gábor, Pellérd",
  },
  {
    quote:
      "Professzionális hozzáállás és szakszerű munka, ajánlom mindenkinek!",
    author: "Péter, Pécs",
  },
  {
    quote: "Segítőkész és megbízható szakember, bátran ajánlom.",
    author: "Beni, Pécs",
  },
  {
    quote: "Korrekt ár, tiszta munkavégzés, jó kommunikáció.",
    author: "Zsanett, Pécs",
  },
  {
    quote: "Pontos érkezés, gyors és szakszerű munkavégzés.",
    author: "Áron, Görcsöny",
  },
  {
    quote: "A megbeszéltek szerint dolgozott, minden rendben ment.",
    author: "Lívia, Pécsudvard",
  },
].map((item) => {
  const displayQuote = `“${item.quote}”`;

  return {
    ...item,
    displayQuote,
    displayCharacters: Array.from(displayQuote),
  };
});

const goldGlowSoft = "rgba(200, 151, 88, 0.26)";
const goldGlowDeep = "rgba(121, 83, 38, 0.22)";
const feedbackTypingMsPerCharacter = 42;
const feedbackTypingMinDurationMs = 1200;
const feedbackTypingMaxDurationMs = 2400;
const feedbackTypingResetDelayMs = 140;
const feedbackHoldDurationMs = 1500;

type HeroMotionProps = {
  children: ReactNode;
  className?: string;
  delay: number;
};

function HeroMotion({ children, className, delay }: HeroMotionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.62,
              delay,
              ease: [0.22, 1, 0.36, 1],
            }
      }
    >
      {children}
    </motion.div>
  );
}

type TypingFeedbackProps = {
  shouldReduceMotion: boolean | null;
};

function TypingFeedback({ shouldReduceMotion }: TypingFeedbackProps) {
  const [activeFeedbackIndex, setActiveFeedbackIndex] = useState(0);
  const [visibleCharacterCount, setVisibleCharacterCount] = useState(0);
  const activeFeedback = feedbackItems[activeFeedbackIndex];
  const displayedCharacterCount = shouldReduceMotion
    ? activeFeedback.displayCharacters.length
    : visibleCharacterCount;
  const isFeedbackFullyVisible =
    shouldReduceMotion ||
    displayedCharacterCount >= activeFeedback.displayCharacters.length;

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const totalCharacters = activeFeedback.displayCharacters.length;
    const typingDuration = Math.min(
      feedbackTypingMaxDurationMs,
      Math.max(
        feedbackTypingMinDurationMs,
        totalCharacters * feedbackTypingMsPerCharacter,
      ),
    );

    let typingStartTime: number | null = null;
    let animationFrameId = 0;
    let startTypingTimeoutId = 0;
    let holdTimeoutId = 0;
    let lastVisibleCharacterCount = 0;

    const animateTyping = (timestamp: number) => {
      if (typingStartTime === null) {
        typingStartTime = timestamp;
      }

      const progress = Math.min(
        1,
        (timestamp - typingStartTime) / typingDuration,
      );
      const nextVisibleCharacterCount = Math.min(
        totalCharacters,
        Math.floor(progress * totalCharacters),
      );

      if (nextVisibleCharacterCount !== lastVisibleCharacterCount) {
        lastVisibleCharacterCount = nextVisibleCharacterCount;
        setVisibleCharacterCount(nextVisibleCharacterCount);
      }

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animateTyping);
        return;
      }

      setVisibleCharacterCount(totalCharacters);
      holdTimeoutId = window.setTimeout(() => {
        setVisibleCharacterCount(0);
        setActiveFeedbackIndex(
          (currentIndex) => (currentIndex + 1) % feedbackItems.length,
        );
      }, feedbackHoldDurationMs);
    };

    startTypingTimeoutId = window.setTimeout(() => {
      animationFrameId = window.requestAnimationFrame(animateTyping);
    }, feedbackTypingResetDelayMs);

    return () => {
      window.clearTimeout(startTypingTimeoutId);
      window.clearTimeout(holdTimeoutId);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [
    activeFeedback.displayCharacters.length,
    activeFeedbackIndex,
    shouldReduceMotion,
  ]);

  return (
    <div className="mt-5 rounded-[1.25rem] border border-[rgba(232,208,160,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:mt-6 sm:rounded-[1.5rem] md:p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.68rem] font-medium tracking-[0.24em] text-[#e5d2ad] uppercase">
          Ügyfél-visszajelzés
        </p>
        <span className="tabular-nums text-[0.72rem] tracking-[0.18em] text-zinc-500 uppercase">
          {String(activeFeedbackIndex + 1).padStart(2, "0")} /{" "}
          {String(feedbackItems.length).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-4 min-h-[10rem] sm:min-h-[8.75rem]">
        <div className="sr-only">
          <p>{activeFeedback.displayQuote}</p>
          <p>{activeFeedback.author}</p>
        </div>

        <p
          aria-hidden="true"
          className="whitespace-pre-wrap break-words text-[0.96rem] leading-7 text-zinc-100 sm:text-[1rem]"
        >
          {activeFeedback.displayCharacters.map((character, characterIndex) => (
            <span
              key={`${activeFeedbackIndex}-${characterIndex}`}
              className={
                characterIndex < displayedCharacterCount
                  ? "text-zinc-100"
                  : "text-transparent"
              }
            >
              {character}
            </span>
          ))}
        </p>

        <motion.p
          initial={false}
          animate={
            isFeedbackFullyVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 0.26,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pt-3 text-[0.88rem] font-medium text-[#f2e2bc] sm:text-sm"
        >
          {activeFeedback.author}
        </motion.p>
      </div>
    </div>
  );
}

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  function handleCallClick({
    ctaLabel,
    ctaVariant,
    entryPoint,
  }: {
    ctaLabel: string;
    ctaVariant: string;
    entryPoint: string;
  }) {
    trackPublicEvent(publicAnalyticsEventNames.ctaClick, {
      source_page: "homepage",
      source_section: "hero",
      cta_variant: ctaVariant,
      cta_label: ctaLabel,
      destination_path: `tel:${businessPhone}`,
      entry_point: entryPoint,
    });
  }

  return (
    <section className="relative isolate overflow-x-hidden border-b border-white/10 bg-[#05070b]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_34%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.48),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_24%,rgba(0,0,0,0.38))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:120px_120px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />

      <motion.div
        aria-hidden="true"
        className="absolute -left-20 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${goldGlowSoft}, transparent 68%)`,
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, 20, 0],
                y: [0, -14, 0],
                opacity: [0.16, 0.24, 0.16],
              }
        }
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-0 top-20 h-80 w-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${goldGlowDeep}, transparent 70%)`,
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, -18, 0],
                y: [0, 16, 0],
                opacity: [0.1, 0.18, 0.1],
              }
        }
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          "left-[10%] top-[18%]",
          "left-[18%] top-[64%]",
          "left-[42%] top-[14%]",
          "left-[56%] top-[72%]",
          "left-[76%] top-[22%]",
          "left-[84%] top-[58%]",
        ].map((position, index) => (
          <div
            key={position}
            className={`absolute h-1 w-1 rounded-full bg-white/${index % 2 === 0 ? "[0.18]" : "[0.12]"} ${position}`}
          />
        ))}
      </div>

      <div className="absolute left-1/2 top-0 h-px w-[min(76rem,92vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/14 to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-18 lg:min-h-[78vh] lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,420px)] lg:items-center lg:gap-12 lg:py-20">
        <div className="relative z-10 max-w-4xl">
          <HeroMotion delay={0}>
            <div className="public-pill-accent inline-flex max-w-full px-3.5 py-1.5 text-[0.72rem] sm:px-4 sm:text-sm">
              Lakossági és gépészeti munkák
            </div>
          </HeroMotion>

          <HeroMotion delay={0.08} className="mt-6">
            <h1 className="max-w-4xl pb-2 text-[2.1rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[2.85rem] md:text-6xl md:leading-[1.05]">
              <span className="block">Víz, gáz és fűtés</span>
              <span className="mt-3 block pb-[0.08em] bg-gradient-to-r from-[#f2e2bc] via-[#cd9d60] to-[#8f6534] bg-clip-text text-transparent">
                Pécsen és környékén
              </span>
            </h1>
          </HeroMotion>

          <HeroMotion delay={0.16} className="mt-6">
            <p className="max-w-2xl text-[0.95rem] leading-6 text-zinc-300 sm:text-base sm:leading-7 md:text-lg">
              Gyors hibabejelentés, lakossági munkák és gépészeti megkeresések
              egy helyen.
            </p>
          </HeroMotion>

          <HeroMotion delay={0.2} className="mt-5">
            <div className="flex items-start gap-3 sm:items-center">
              <span className="mt-3 h-px w-8 shrink-0 bg-gradient-to-r from-[#d0a261] to-transparent sm:mt-0 sm:w-10" />
              <p className="text-[0.92rem] leading-6 text-[#e5d2ad] md:text-base">
                Munkanapokon rövid időn belül visszajelzünk, a sürgős hibákat
                kiemelten kezeljük.
              </p>
            </div>
          </HeroMotion>

          <HeroMotion delay={0.24} className="mt-8">
            <div className="grid max-w-2xl gap-2.5 sm:grid-cols-2">
              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Button
                  asChild
                  size="lg"
                  className="public-button-primary min-h-10 w-full rounded-xl px-4 text-[0.92rem] transition-all duration-300 hover:-translate-y-0.5 sm:min-h-11 sm:px-5 sm:text-sm"
                >
                  <TrackedLink
                    href="/szolgaltatasok/hibabejelentes"
                    eventName={publicAnalyticsEventNames.ctaClick}
                    eventPayload={{
                      source_page: "homepage",
                      source_section: "hero",
                      service_type: "hibabejelentes",
                      cta_variant: "primary",
                      cta_label: "Hibabejelentés indítása",
                      destination_path: "/szolgaltatasok/hibabejelentes",
                      entry_point: "homepage_hero_fault_report",
                    }}
                  >
                    Hibabejelentés indítása
                  </TrackedLink>
                </Button>
              </motion.div>

              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="min-h-10 w-full rounded-xl border-[#c89758]/18 bg-[#c89758]/[0.08] px-4 text-[0.92rem] text-[#f2e2bc] shadow-none transition-colors hover:border-[#c89758]/32 hover:bg-[#c89758]/[0.14] hover:text-[#f7ebcf] sm:min-h-11 sm:px-5 sm:text-sm"
                >
                  <TrackedLink
                    href="#lakossagi-gyakori-munkak"
                    eventName={publicAnalyticsEventNames.ctaClick}
                    eventPayload={{
                      source_page: "homepage",
                      source_section: "hero",
                      cta_variant: "secondary",
                      cta_label: "Lakossági gyakori munkák",
                      destination_path: "/#lakossagi-gyakori-munkak",
                      entry_point:
                        "homepage_hero_residential_common_work_button",
                    }}
                  >
                    Lakossági gyakori munkák
                  </TrackedLink>
                </Button>
              </motion.div>

              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="min-h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[0.92rem] text-white shadow-none transition-colors hover:border-white/16 hover:bg-white/[0.08] hover:text-white sm:min-h-11 sm:text-sm"
                >
                  <TrackedLink
                    href="#szolgaltatasok"
                    eventName={publicAnalyticsEventNames.ctaClick}
                    eventPayload={{
                      source_page: "homepage",
                      source_section: "hero",
                      cta_variant: "supporting",
                      cta_label: "Gépészeti munkák",
                      destination_path: "/#szolgaltatasok",
                      entry_point: "homepage_hero_service_categories_button",
                    }}
                  >
                    Gépészeti munkák
                  </TrackedLink>
                </Button>
              </motion.div>

              <motion.div
                whileHover={
                  shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="min-h-10 w-full rounded-xl border border-white/10 bg-transparent px-4 text-[0.92rem] text-zinc-300 shadow-none transition-colors hover:border-white/16 hover:bg-white/[0.05] hover:text-white sm:min-h-11 sm:text-sm"
                >
                  <a
                    href={`tel:${businessPhone}`}
                    onClick={() =>
                      handleCallClick({
                        ctaLabel: "Hívás most",
                        ctaVariant: "secondary",
                        entryPoint: "homepage_hero_call",
                      })
                    }
                  >
                    Hívás most
                  </a>
                </Button>
              </motion.div>
            </div>
          </HeroMotion>

          <HeroMotion delay={0.3} className="mt-6">
            <ul className="flex flex-wrap gap-2.5 sm:gap-3">
              {socialProofItems.map((item) => (
                <li
                  key={item.fullText}
                  aria-label={item.fullText}
                  className="flex items-center gap-2 rounded-full border border-[#c89758]/15 bg-[#c89758]/[0.08] px-3 py-1.5 text-[0.78rem] text-zinc-100 sm:px-3.5 sm:py-2 sm:text-sm"
                >
                  <span className="font-semibold text-[#f2e2bc]">
                    {item.highlight}
                  </span>
                  <span className="text-zinc-100">{item.text}</span>
                </li>
              ))}
            </ul>
          </HeroMotion>
        </div>

        <HeroMotion delay={0.4}>
          <div className="relative z-10 overflow-hidden rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-4 shadow-[0_20px_52px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:p-5 md:rounded-[1.9rem] md:p-7">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent md:inset-x-8" />
            <div className="public-pill inline-flex px-3 py-1 text-xs font-medium tracking-[0.16em] uppercase">
              Strukturált megkeresés
            </div>

            <h2 className="mt-4 max-w-xs text-[1.32rem] font-semibold tracking-tight text-white sm:text-[1.55rem] md:text-[1.7rem]">
              Tisztább indulás, pontosabb visszajelzés
            </h2>

            <p className="mt-3.5 max-w-md text-[0.92rem] leading-6 text-zinc-400 sm:text-sm">
              A megfelelő megkeresési út segít, hogy az első visszajelzés is
              pontosabb legyen.
            </p>

            <div className="mt-5 divide-y divide-white/10 rounded-[1.25rem] border border-white/10 bg-black/20 sm:mt-6 sm:rounded-[1.5rem]">
              {responseSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-center gap-3 px-3.5 py-3 md:gap-4 md:px-5 md:py-4"
                >
                  <div className="flex h-[2.125rem] w-[2.125rem] shrink-0 items-center justify-center rounded-full border border-[#c89758]/18 bg-[#c89758]/10 text-[0.82rem] font-medium text-[#f1dfbc] md:h-10 md:w-10 md:text-sm">
                    0{index + 1}
                  </div>
                  <p className="text-[0.92rem] font-medium leading-6 text-zinc-100 md:text-sm">
                    {step.title}
                  </p>
                </div>
              ))}
            </div>

            <TypingFeedback shouldReduceMotion={shouldReduceMotion} />
          </div>
        </HeroMotion>
      </div>
    </section>
  );
}
