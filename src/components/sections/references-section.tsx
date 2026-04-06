import { Reveal } from "@/components/motion/reveal";
import { ReferenceProjectsShowcase } from "@/components/sections/reference-projects-showcase";
import {
  aboutWorkImages,
  featuredReferenceProjectImages,
} from "@/lib/content/reference-project-images";

export function ReferencesSection() {
  return (
    <section
      id="referenciak"
      className="relative overflow-hidden border-t border-white/10 bg-zinc-950 scroll-mt-24"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:inset-x-10" />
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_14%_10%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_84%_0%,rgba(200,151,88,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <Reveal className="mb-6 md:mb-8" variant="soft">
          <div className="max-w-2xl">
            <h2 className="text-[1.9rem] font-semibold tracking-tight text-white sm:text-[2.2rem] md:text-4xl">
              Referenciák és projektek
            </h2>
            <p className="mt-3 text-[0.96rem] leading-6 text-zinc-300 sm:text-base sm:leading-7">
              Valós kivitelezésekből és munkafolyamatokból válogatva.
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={90} variant="soft">
          <ReferenceProjectsShowcase
            desktopImages={aboutWorkImages}
            mobileImages={featuredReferenceProjectImages}
          />
        </Reveal>
      </div>
    </section>
  );
}
