import { TrackedLink } from "@/components/analytics/tracked-link";
import { Reveal } from "@/components/motion/reveal";
import { AboutVisualShowcase } from "@/components/sections/about-visual-showcase";
import { Button } from "@/components/ui/button";
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events";
import { aboutWorkImages } from "@/lib/content/reference-project-images";

const trustPillars = [
  "Több mint 5 év terepi rutin",
  "Egyéni működés, személyes felelősséggel",
  "Mérnöki és szakmai partnerháttér",
] as const;

const supportBlocks = [
  {
    title: "Gyakorlati szemlélet",
    description:
      "A döntések abból indulnak, hogyan lesz egy rendszer szerelhető, működőképes és hosszú távon is vállalható.",
  },
  {
    title: "Mérnöki háttérrel megtámogatva",
    description:
      "Az egyéni működést mérnökökkel és megbízható szakmai partnerekkel összehangolt háttér egészíti ki.",
  },
  {
    title: "Lakossági és összetettebb rutin",
    description:
      "A rutin a lakossági munkáktól a komplexebb kivitelezési helyzetekig terjed.",
  },
  {
    title: "Átlátható kommunikáció",
    description:
      "Tiszta kiindulópont, egyenes kommunikáció és megoldásközpontú következő lépés.",
  },
] as const;

const biographyLead =
  "Az épületgépészet számomra a gyakorlati tudás, a műszaki gondolkodás és a valódi problémamegoldás találkozása. Több mint 5 éve dolgozom benne, ezért a feladatokat terepi tapasztalatból közelítem meg.";

const biographySections = [
  {
    eyebrow: "Kiindulópont",
    title: "A gyakorlatból építkező szemlélet",
    paragraphs: [
      "Mindig a gyakorlat állt hozzám közel: ahol nem elméleti válaszok, hanem működő megoldások kellenek.",
      "Az érettségi után tudatosan ebbe az irányba indultam tovább, és hamar a valós munkakörnyezetben is tapasztalatot szereztem.",
    ],
  },
  {
    eyebrow: "Tapasztalat",
    title: "Széles körű projektrutin, valós helyzetekben",
    paragraphs: [
      "Az elmúlt években lakossági, vállalati és összetettebb kivitelezési helyzetekben is dolgoztam.",
      "Ez megerősített abban, hogy a minőségi munka alapja a pontos helyzetfelmérés, a műszaki megalapozottság és a korrekt kommunikáció.",
    ],
  },
  {
    eyebrow: "Működés",
    title: "Személyes felelősség, szélesebb szakmai háttérrel",
    paragraphs: [
      "A vállalkozás egyéni működésre épül, de a szakmai háttér ennél szélesebb.",
      "Mérnökökkel, szakági partnerekkel és megbízható kapcsolati hálóval dolgozunk együtt, így rendszerben gondolkodó támogatást is tudunk adni.",
    ],
  },
] as const;

const closingPrinciples = [
  "A cél minden munkánál az, hogy az ügyfél világos, szakmailag vállalható megoldást kapjon.",
  "A bizalom alapja nálunk a hozzáértés, a korrektség és a legésszerűbb megoldás keresése.",
] as const;

const portraits = {
  primary: {
    src: "/images/about/vezeto-portrait.jpg",
    alt: "A vállalkozás vezetőjének portréja",
  },
} as const;

export function WhyChooseUsSection() {
  return (
    <section
      id="rolunk"
      className="relative overflow-hidden border-t border-white/10 bg-zinc-900/50 scroll-mt-24"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      <div className="absolute inset-x-0 top-0 h-128 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.07),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_44%)]" />
      <div className="absolute right-0 top-28 h-64 w-64 rounded-full bg-white/4 blur-3xl" />
      <div className="absolute left-6 top-18 h-44 w-44 rounded-full bg-white/3 blur-3xl md:left-18" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-24">
        <Reveal variant="hero">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] xl:items-end">
            <div className="min-w-0 max-w-4xl">
              <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
                Rólunk
              </div>

              <h2 className="mt-5 max-w-5xl text-[1.75rem] font-semibold tracking-tight text-white sm:text-[2.25rem] md:text-5xl">
                Személyes jelenlét, gyakorlati tapasztalat és erős szakmai
                háttér
              </h2>

              <p className="mt-4 max-w-2xl text-[0.96rem] leading-7 text-zinc-100 sm:text-[1.08rem] sm:leading-8 md:text-[1.55rem]">
                {biographyLead}
              </p>

              <p className="mt-3 max-w-3xl text-[0.9rem] leading-6 text-zinc-400 sm:mt-4 sm:text-base sm:leading-7">
                Az egyéni működés közvetlen felelősséget ad, a mérnöki és
                szakmai partnerháttér pedig az egyszerűbb és az összetettebb
                feladatoknál is biztosabb alapot jelent.
              </p>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-1 xl:pl-6">
              {trustPillars.map((item, index) => (
                <Reveal key={item} delayMs={index * 70} variant="card">
                  <div className="public-surface-soft h-full px-3.5 py-3.5 text-[0.82rem] leading-5 text-zinc-200 md:px-4 md:py-4 md:text-sm md:leading-6">
                    {item}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-7 grid gap-5 lg:gap-7 xl:grid-cols-[minmax(0,1.03fr)_minmax(380px,500px)] xl:items-start">
          <div className="order-2 min-w-0 space-y-5 md:space-y-7 xl:order-1">
            <Reveal delayMs={80}>
              <div className="max-w-3xl">
                <p className="text-xs font-medium tracking-[0.22em] text-zinc-500 uppercase">
                  Szakmai történet
                </p>
                <p className="mt-2.5 max-w-2xl text-[0.94rem] leading-7 text-zinc-200 sm:mt-3 sm:text-[1.02rem] sm:leading-8">
                  A személyes jelenlét mögött valódi terepi tapasztalat,
                  műszaki gondolkodás és rendezett szakmai háttér áll.
                </p>
              </div>
            </Reveal>

            <div className="space-y-6 md:space-y-7">
              {biographySections.map((block, index) => (
                <Reveal
                  key={block.title}
                  delayMs={120 + index * 80}
                  variant="soft"
                >
                  <div className="border-t border-white/10 pt-4 md:pt-6">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-start">
                      <div className="min-w-0">
                        <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">
                          {block.eyebrow}
                        </p>
                        <h3 className="mt-2.5 max-w-sm text-[1.04rem] font-semibold tracking-tight text-white md:mt-3 md:text-[1.55rem]">
                          {block.title}
                        </h3>
                      </div>
                      <div className="min-w-0 space-y-3">
                        {block.paragraphs.map((paragraph, paragraphIndex) => (
                          <p
                            key={paragraph}
                            className={
                              paragraphIndex === 0
                                ? "max-w-2xl text-sm leading-6 text-zinc-200"
                                : "max-w-2xl text-sm leading-6 text-zinc-400"
                            }
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div>
              <Reveal delayMs={280}>
                <div className="mb-5 max-w-2xl">
                  <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">
                    Ami a mindennapi munkában különbséget jelent
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
                {supportBlocks.map((block, index) => (
                  <Reveal
                    key={block.title}
                    delayMs={320 + index * 80}
                  variant="card"
                >
                  <div className="public-surface-soft h-full p-3.5 md:p-5">
                    <h3 className="text-[1rem] font-medium text-white md:text-[1.06rem]">
                      {block.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {block.description}
                    </p>
                  </div>
                </Reveal>
                ))}
              </div>
            </div>

            <Reveal delayMs={420}>
              <div className="border-t border-white/10 pt-4 md:pt-6">
                <div className="grid gap-5 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:items-start">
                  <div className="min-w-0">
                    <p className="text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase">
                      Alapelv
                    </p>
                    <h3 className="mt-2.5 max-w-sm text-[1.2rem] font-semibold tracking-tight text-white md:mt-3 md:text-2xl">
                      Világos megoldás, nem bizonytalanság
                    </h3>
                  </div>
                  <div className="min-w-0 space-y-3">
                    {closingPrinciples.map((paragraph, index) => (
                      <p
                        key={paragraph}
                        className={
                          index === 0
                            ? "text-sm leading-6 text-zinc-200"
                            : "text-sm leading-6 text-zinc-300"
                        }
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delayMs={500}>
              <div className="public-surface overflow-hidden p-4 md:p-6">
                <p className="text-sm font-medium tracking-[0.2em] text-zinc-500 uppercase">
                  Következő lépés
                </p>
                <p className="mt-2.5 max-w-2xl text-[0.92rem] leading-6 text-zinc-300 sm:mt-3 sm:text-base sm:leading-7">
                  Ha a feladat már körvonalazódott, a megfelelő szolgáltatás
                  kiválasztása után rögtön elindítható a megkeresés.
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                        source_section: "about",
                        cta_variant: "primary",
                        cta_label: "Megkeresés indítása",
                        destination_path: "/#szolgaltatasok",
                        entry_point: "homepage_about_primary",
                      }}
                    >
                      Megkeresés indítása
                    </TrackedLink>
                  </Button>

                  <p className="max-w-md text-sm leading-6 text-zinc-400">
                    A szolgáltatásoldalakon rövid bevezető után közvetlenül a
                    megfelelő megkeresési folyamathoz lehet továbblépni.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal
            delayMs={180}
            className="order-1 min-w-0 xl:order-2 xl:sticky xl:top-28 xl:ml-auto xl:w-full xl:max-w-[31rem]"
          >
            <AboutVisualShowcase
              portraits={portraits}
              workImages={aboutWorkImages}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
