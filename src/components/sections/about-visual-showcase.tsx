"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type AboutPortrait = {
  src: string;
  alt: string;
};

type AboutPortraitSet = {
  primary: AboutPortrait;
};

type AboutWorkImage = {
  src: string;
  alt: string;
  label: string;
  caption: string;
};

type AboutVisualShowcaseProps = {
  portraits: AboutPortraitSet;
  workImages: ReadonlyArray<AboutWorkImage>;
};

type AssetFrameProps = {
  alt: string;
  className?: string;
  fallbackCaption: string;
  priority?: boolean;
  sizes: string;
  src: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function AssetFrame({
  alt,
  className,
  fallbackCaption,
  priority = false,
  sizes,
  src,
}: AssetFrameProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {!hasError ? (
        <Image
          fill
          alt={alt}
          className="object-cover"
          onError={() => setHasError(true)}
          priority={priority}
          sizes={sizes}
          src={src}
        />
      ) : null}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_38%,rgba(0,0,0,0.42))]" />

      {hasError ? (
        <div className="absolute inset-0 flex items-end p-4 md:p-5">
          <div className="rounded-[1.1rem] border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-zinc-300 backdrop-blur-sm">
            {fallbackCaption}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PortraitCard({ portraits }: { portraits: AboutPortraitSet }) {
  return (
    <div className="public-surface overflow-hidden">
      <div className="relative aspect-4/5">
        <AssetFrame
          alt={portraits.primary.alt}
          fallbackCaption="A portré a végleges kép bekerülése után jelenik meg."
          priority
          sizes="(min-width: 1280px) 18rem, (min-width: 768px) 15rem, 100vw"
          src={portraits.primary.src}
        />
      </div>

      <div className="space-y-2.5 p-3.5 sm:space-y-3 sm:p-5">
        <div>
          <p className="text-[0.72rem] font-medium tracking-[0.18em] text-zinc-500 uppercase">
            A vállalkozás vezetője
          </p>
          <p className="mt-2 text-[0.84rem] leading-6 text-zinc-300 sm:mt-2.5 sm:text-sm">
            Közvetlen szakmai jelenléttel, hosszú távon is vállalható
            megoldásokkal.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["5+ év tapasztalat", "Egyéni működés", "Mérnöki háttér"].map(
            (item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[0.68rem] text-zinc-300 sm:px-3 sm:text-[0.74rem]"
              >
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export function AboutVisualShowcase({
  portraits,
  workImages,
}: AboutVisualShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [pointerRatio, setPointerRatio] = useState(0.18);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const currentRatioRef = useRef(0.18);
  const targetRatioRef = useRef(0.18);
  const activeIndexRef = useRef(0);

  const images = workImages.length > 0 ? workImages : [];
  const mobileImages = images.slice(0, Math.min(images.length, 6));
  const activeImage = images[activeIndex] ?? null;
  const resolvedMobileActiveIndex =
    mobileImages.length === 0
      ? 0
      : clamp(mobileActiveIndex, 0, mobileImages.length - 1);
  const mobileActiveImage = mobileImages[resolvedMobileActiveIndex] ?? null;
  const visibleImageIndices = Array.from(
    new Set(
      [previousIndex, activeIndex].filter(
        (value): value is number => value !== null && value >= 0,
      ),
    ),
  );

  const showcaseMarkers =
    images.length > 0
      ? [0, 5, 10, images.length - 1]
          .map((index) => clamp(index, 0, images.length - 1))
          .filter(
            (index, markerIndex, values) =>
              values.indexOf(index) === markerIndex,
          )
          .map((index) => ({
            index,
            label: images[index]?.label ?? `Referencia ${index + 1}`,
          }))
      : [];

  useEffect(() => {
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }

      if (fadeTimeoutRef.current !== null) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  function commitActiveIndex(nextIndex: number) {
    const currentIndex = activeIndexRef.current;

    if (nextIndex === currentIndex) {
      return;
    }

    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current);
    }

    setPreviousIndex(currentIndex);
    setActiveIndex(nextIndex);
    activeIndexRef.current = nextIndex;

    fadeTimeoutRef.current = window.setTimeout(() => {
      setPreviousIndex(null);
      fadeTimeoutRef.current = null;
    }, 620);
  }

  function commitRatio(nextRatio: number) {
    if (images.length === 0) {
      currentRatioRef.current = 0;
      targetRatioRef.current = 0;
      setPointerRatio(0);
      setActiveIndex(0);
      activeIndexRef.current = 0;
      setPreviousIndex(null);
      return;
    }

    const safeRatio = clamp(nextRatio, 0, 0.9999);
    currentRatioRef.current = safeRatio;
    setPointerRatio(safeRatio);
    commitActiveIndex(
      Math.min(images.length - 1, Math.floor(safeRatio * images.length)),
    );
  }

  function animateToTarget() {
    if (frameIdRef.current !== null) {
      return;
    }

    const step = () => {
      const target = targetRatioRef.current;
      const current = currentRatioRef.current;
      const next = current + (target - current) * 0.14;

      if (Math.abs(target - next) < 0.002) {
        commitRatio(target);
        frameIdRef.current = null;
        return;
      }

      commitRatio(next);
      frameIdRef.current = requestAnimationFrame(step);
    };

    frameIdRef.current = requestAnimationFrame(step);
  }

  function updateByRatio(ratio: number) {
    if (images.length <= 1) {
      commitRatio(0);
      return;
    }

    targetRatioRef.current = clamp(ratio, 0, 0.9999);
    animateToTarget();
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (images.length <= 1) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    updateByRatio(ratio);
  }

  function handleSelect(index: number) {
    if (images.length === 0) {
      return;
    }

    const nextIndex = clamp(index, 0, images.length - 1);
    const nextRatio =
      images.length === 1 ? 0 : (nextIndex + 0.5) / images.length;

    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }

    targetRatioRef.current = nextRatio;
    commitRatio(nextRatio);
  }

  function handleMobileSelect(index: number) {
    if (mobileImages.length === 0) {
      return;
    }

    setMobileActiveIndex(clamp(index, 0, mobileImages.length - 1));
  }

  function handleMobileStep(direction: -1 | 1) {
    if (mobileImages.length === 0) {
      return;
    }

    setMobileActiveIndex(
      clamp(resolvedMobileActiveIndex + direction, 0, mobileImages.length - 1),
    );
  }

  return (
    <div className="relative">
      <div className="space-y-4 md:hidden">
        <div className="mx-auto max-w-[21rem]">
          <PortraitCard portraits={portraits} />
        </div>

        <div className="public-surface overflow-hidden p-3.5 sm:p-4">
          <p className="text-[0.72rem] font-medium tracking-[0.22em] text-zinc-500 uppercase">
            Referenciafotók
          </p>
          <h3 className="mt-2 text-[1rem] font-semibold tracking-tight text-white sm:text-lg">
            Valós munkaképek
          </h3>
          <p className="mt-2 max-w-[30ch] text-[0.84rem] leading-6 text-zinc-400 sm:text-sm">
            Válogatott helyszíni részletek, könnyebben áttekinthető
            mobilnézetben.
          </p>

          {mobileActiveImage ? (
            <>
              <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/20">
                <div className="relative aspect-5/4">
                  <AssetFrame
                    alt={mobileActiveImage.alt}
                    fallbackCaption="A referenciafotó a végleges kép bekerülése után jelenik meg."
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    src={mobileActiveImage.src}
                  />
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[0.92rem] font-medium text-white">
                    {mobileActiveImage.label}
                  </p>
                  <span className="text-[0.68rem] tracking-[0.18em] text-zinc-500 uppercase">
                    {resolvedMobileActiveIndex + 1} / {mobileImages.length}
                  </span>
                </div>
                <p className="text-[0.82rem] leading-5 text-zinc-400 sm:text-[0.88rem]">
                  {mobileActiveImage.caption}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMobileStep(-1)}
                  disabled={resolvedMobileActiveIndex === 0}
                  aria-label="Előző referencia"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-200 transition-colors hover:border-white/18 hover:bg-white/[0.08] hover:text-white disabled:opacity-45"
                >
                  <ChevronLeft className="size-4" />
                </button>

                <div className="flex min-w-0 flex-1 flex-wrap justify-center gap-2">
                  {mobileImages.map((image, index) => (
                    <button
                      key={image.src}
                      type="button"
                      onClick={() => handleMobileSelect(index)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[0.7rem] tracking-[0.14em] transition-colors uppercase",
                        index === resolvedMobileActiveIndex
                          ? "border-[#c89758]/26 bg-[#c89758]/[0.12] text-[#f3e3bf]"
                          : "border-white/10 bg-transparent text-zinc-500",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleMobileStep(1)}
                  disabled={
                    resolvedMobileActiveIndex === mobileImages.length - 1
                  }
                  aria-label="Következő referencia"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-200 transition-colors hover:border-white/18 hover:bg-white/[0.08] hover:text-white disabled:opacity-45"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-zinc-400">
              A referenciafotók a végleges képek bekerülése után jelennek meg.
            </div>
          )}
        </div>
      </div>

      <div className="hidden space-y-5 md:block">
        <div className="mx-auto w-full max-w-[18rem] xl:mx-0">
          <PortraitCard portraits={portraits} />
        </div>

        <div className="public-surface overflow-hidden p-5 lg:p-6">
          <p className="text-xs font-medium tracking-[0.24em] text-zinc-500 uppercase">
            Referenciafotók
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-white lg:text-[1.55rem]">
            Valós munkaképek
          </h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
            A referenciaanyag nyugodtan, egymás után követhető a fontosabb
            helyszíni részletekkel.
          </p>

          <div
            aria-label="Referenciafotók előnézete"
            className="relative mt-5 overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/25"
            onPointerMove={handlePointerMove}
          >
            <div className="relative aspect-[10/11]">
              {visibleImageIndices.map((index) => {
                const image = images[index];
                const isActive = index === activeIndex;

                if (!image) {
                  return null;
                }

                return (
                  <div
                    key={image.src}
                    className={cn(
                      "absolute inset-0 transition-all duration-700 ease-out",
                      isActive
                        ? "scale-100 opacity-100"
                        : "scale-[1.02] opacity-0",
                    )}
                  >
                    <AssetFrame
                      alt={image.alt}
                      fallbackCaption="A referenciafotó a végleges kép bekerülése után jelenik meg."
                      priority={index === 0}
                      sizes="(min-width: 1280px) 31rem, (min-width: 768px) 42vw, 100vw"
                      src={image.src}
                    />
                  </div>
                );
              })}

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),transparent_28%,rgba(0,0,0,0.48))]" />
            </div>
          </div>

          <div className="mt-4">
            <div className="relative h-9 rounded-full border border-white/10 bg-black/20 px-2">
              <div className="absolute inset-y-1.5 left-2 right-2 flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.src}
                    className={cn(
                      "relative flex-1 rounded-full transition-colors duration-300",
                      index === activeIndex
                        ? "bg-white/16"
                        : "bg-white/5 hover:bg-white/5",
                    )}
                    onClick={() => handleSelect(index)}
                    onFocus={() => handleSelect(index)}
                    type="button"
                  >
                    <span className="sr-only">{image.label}</span>
                  </button>
                ))}
              </div>
              <div
                className="pointer-events-none absolute top-1.5 h-6 w-7 rounded-full bg-white/10 blur-lg transition-all duration-300"
                style={{
                  left: `calc(${pointerRatio * 100}% - 1rem)`,
                }}
              />
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
              <div>
                <p className="text-sm font-medium text-white">
                  {activeImage?.label ?? "Referenciafotók"}
                </p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-400">
                  {activeImage?.caption ??
                    "A referenciafotók itt jelennek meg, amint a végleges képek bekerülnek."}
                </p>
              </div>
              <div className="text-[0.72rem] tracking-[0.18em] text-zinc-500 uppercase lg:text-xs">
                {images.length} kép
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {showcaseMarkers.map((marker) => (
                <button
                  key={`${marker.index}-${marker.label}`}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[0.78rem] transition-all duration-300",
                    marker.index === activeIndex
                      ? "border-[#c89758]/28 bg-[#c89758]/[0.12] text-[#f3e3bf]"
                      : "border-white/10 bg-transparent text-zinc-500 hover:border-white/15 hover:text-zinc-200",
                  )}
                  onClick={() => handleSelect(marker.index)}
                  onFocus={() => handleSelect(marker.index)}
                  type="button"
                >
                  {marker.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
