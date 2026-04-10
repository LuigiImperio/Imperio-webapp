import { Mail, PhoneCall } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events";
import {
  homepageContactIntro,
  homepageContactTitle,
  publicContactChannels,
  publicContactProcessSteps,
  publicDirectContactIntro,
} from "@/lib/contact";

const channelIcons = {
  phone: PhoneCall,
  email: Mail,
} as const;

const processVisualNodes = [
  { cx: 28, cy: 72, accent: false },
  { cx: 108, cy: 72, accent: false },
  { cx: 108, cy: 40, accent: true },
  { cx: 188, cy: 40, accent: false },
  { cx: 220, cy: 72, accent: false },
  { cx: 296, cy: 96, accent: true },
  { cx: 332, cy: 72, accent: false },
] as const;

function ContactProcessVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative h-24 overflow-hidden rounded-[1.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:h-28 md:h-36"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_30%,rgba(255,255,255,0.045),transparent_34%),radial-gradient(circle_at_74%_74%,rgba(200,151,88,0.09),transparent_26%)]" />

      <svg
        viewBox="0 0 360 120"
        className="relative h-full w-full"
        focusable="false"
      >
        <defs>
          <filter
            id="contact-process-visual-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M28 72 H332"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.5"
          />
          <path
            d="M108 72 V40 H188 V72"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.5"
          />
          <path
            d="M220 72 V96 H296 V72"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1.5"
          />
          <path
            d="M108 40 H188"
            stroke="rgba(228,199,143,0.14)"
            strokeWidth="1.5"
          />
          <path
            d="M220 96 H296"
            stroke="rgba(228,199,143,0.14)"
            strokeWidth="1.5"
          />
        </g>

        <g opacity="0.9">
          <circle
            cx="108"
            cy="40"
            r="15"
            fill="rgba(228,199,143,0.08)"
            filter="url(#contact-process-visual-glow)"
          />
          <circle
            cx="296"
            cy="96"
            r="15"
            fill="rgba(228,199,143,0.08)"
            filter="url(#contact-process-visual-glow)"
          />
        </g>

        <g>
          {processVisualNodes.map((node) => (
            <g key={`${node.cx}-${node.cy}`}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r="6.25"
                fill="rgba(24,24,27,0.94)"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.2"
              />
              <circle
                cx={node.cx}
                cy={node.cy}
                r="2.2"
                fill={
                  node.accent
                    ? "rgba(228,199,143,0.85)"
                    : "rgba(255,255,255,0.52)"
                }
              />
            </g>
          ))}
        </g>

        <g className="contact-process-visual__pulse-static">
          <circle cx="150" cy="40" r="3.1" fill="rgba(228,199,143,0.8)" />
          <circle cx="252" cy="96" r="3.1" fill="rgba(228,199,143,0.8)" />
          <circle cx="314" cy="72" r="3.1" fill="rgba(228,199,143,0.8)" />
        </g>

        <g className="contact-process-visual__pulse">
          <circle
            r="3.2"
            fill="rgba(228,199,143,0.92)"
            stroke="rgba(244,232,201,0.4)"
            strokeWidth="0.9"
          >
            <animate
              attributeName="opacity"
              dur="9.2s"
              repeatCount="indefinite"
              values="0;0.95;0.95;0"
              keyTimes="0;0.14;0.84;1"
            />
            <animateMotion
              dur="9.2s"
              repeatCount="indefinite"
              path="M28 72 H108 V40 H188 V72 H232"
            />
          </circle>

          <circle
            r="3"
            fill="rgba(228,199,143,0.88)"
            stroke="rgba(244,232,201,0.32)"
            strokeWidth="0.8"
          >
            <animate
              attributeName="opacity"
              dur="10.4s"
              begin="-3.4s"
              repeatCount="indefinite"
              values="0;0.9;0.9;0"
              keyTimes="0;0.18;0.82;1"
            />
            <animateMotion
              dur="10.4s"
              begin="-3.4s"
              repeatCount="indefinite"
              path="M132 72 H220 V96 H296 V72 H332"
            />
          </circle>

          <circle
            r="2.8"
            fill="rgba(228,199,143,0.82)"
            stroke="rgba(244,232,201,0.28)"
            strokeWidth="0.8"
          >
            <animate
              attributeName="opacity"
              dur="8.6s"
              begin="-5.8s"
              repeatCount="indefinite"
              values="0;0.8;0.8;0"
              keyTimes="0;0.16;0.8;1"
            />
            <animateMotion
              dur="8.6s"
              begin="-5.8s"
              repeatCount="indefinite"
              path="M52 72 H332"
            />
          </circle>
        </g>
      </svg>

      <style>{`
        .contact-process-visual__pulse-static {
          opacity: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-process-visual__pulse {
            display: none;
          }

          .contact-process-visual__pulse-static {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function ContactCtaSection() {
  return (
    <section
      id="kapcsolat"
      aria-labelledby="contact-cta-title"
      className="relative border-t border-white/10 bg-zinc-950 scroll-mt-24"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <Reveal
          className="public-surface-strong overflow-hidden p-5 md:p-10"
          variant="hero"
        >
          <div className="flex flex-col gap-8">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.04fr)_minmax(300px,0.96fr)] xl:items-start">
              <div className="max-w-3xl xl:max-w-none">
                <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
                  Kapcsolat és szolgáltatási terület
                </div>

                <h2
                  id="contact-cta-title"
                  className="mt-5 max-w-3xl text-[1.9rem] font-semibold tracking-tight sm:text-[2.25rem] md:text-5xl"
                >
                  {homepageContactTitle}
                </h2>

                <p className="mt-4 max-w-2xl text-[0.96rem] leading-6 text-zinc-300 sm:text-base sm:leading-7 md:text-lg">
                  {homepageContactIntro}
                </p>

                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <Button
                    asChild
                    size="lg"
                    className="public-button-primary min-h-10 w-full rounded-2xl px-4 text-[0.92rem] transition-all duration-300 hover:-translate-y-0.5 sm:min-h-11 sm:w-auto sm:px-5 sm:text-sm"
                  >
                    <TrackedLink
                      href="#szolgaltatasok"
                      eventName={publicAnalyticsEventNames.ctaClick}
                      eventPayload={{
                        source_page: "homepage",
                        source_section: "closing_contact_cta",
                        cta_variant: "primary",
                        cta_label: "Megkeresés indítása",
                        destination_path: "/#szolgaltatasok",
                        entry_point: "homepage_contact_cta_start_request",
                      }}
                    >
                      Megkeresés indítása
                    </TrackedLink>
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
                        entry_point:
                          "homepage_contact_cta_residential_common_work",
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
                    <TrackedLink
                      href="/szolgaltatasok/hibabejelentes"
                      eventName={publicAnalyticsEventNames.ctaClick}
                      eventPayload={{
                        source_page: "homepage",
                        source_section: "closing_contact_cta",
                        service_type: "hibabejelentes",
                        cta_variant: "secondary",
                        cta_label: "Gyors hibabejelentés indítása",
                        destination_path: "/szolgaltatasok/hibabejelentes",
                        entry_point: "homepage_contact_cta_fault_report",
                      }}
                    >
                      Gyors hibabejelentés indítása
                    </TrackedLink>
                  </Button>
                </div>
              </div>

              <div className="xl:justify-self-end xl:self-stretch">
                <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:rounded-[1.6rem] md:p-5">
                  <ContactProcessVisual />

                  <ol className="mt-4 space-y-3">
                    {publicContactProcessSteps.map((step) => (
                      <li
                        key={step}
                        className="flex items-start gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-3.5 py-3.5 md:rounded-[1.15rem] md:px-4 md:py-4"
                      >
                        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-white/85 ring-4 ring-white/[0.04]" />
                        <span className="text-sm leading-6 text-zinc-200 md:text-[0.95rem]">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-3xl rounded-[1.45rem] border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] md:rounded-[1.7rem] md:p-5">
              <p className="text-[0.7rem] font-medium tracking-[0.24em] text-zinc-500 uppercase">
                Közvetlen elérhetőség
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 md:text-[0.95rem]">
                {publicDirectContactIntro}
              </p>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {publicContactChannels.map((channel) => {
                  const Icon = channelIcons[channel.key];

                  return (
                    <div
                      key={channel.key}
                      className="group rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-3.5 py-3.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] md:rounded-[1.3rem] md:px-4 md:py-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 rounded-full border border-white/10 bg-white/[0.04] p-2 text-zinc-200">
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-[0.7rem] font-medium tracking-[0.2em] text-zinc-500 uppercase">
                            {channel.label}
                          </dt>
                          <dd className="mt-2">
                            <a
                              href={channel.href}
                              className={`block rounded-lg text-[1.05rem] font-medium text-white transition-colors duration-300 group-hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
                                channel.key === "email" ? "break-all" : ""
                              }`}
                            >
                              <span className="block">{channel.value}</span>
                              <span className="mt-2 block text-sm leading-6 text-zinc-400">
                                {channel.description}
                              </span>
                            </a>
                          </dd>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
