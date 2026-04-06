"use client";

import Image from "next/image";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ReferenceProjectImage } from "@/lib/content/reference-project-images";
import { cn } from "@/lib/utils";

type ReferenceProjectsShowcaseProps = {
  desktopImages: ReadonlyArray<ReferenceProjectImage>;
  mobileImages?: ReadonlyArray<ReferenceProjectImage>;
};

type AssetFrameProps = {
  alt: string;
  fallbackCaption: string;
  priority?: boolean;
  sizes: string;
  src: string;
};

type DesktopRevealItem = {
  id: number;
  image: ReferenceProjectImage;
  imageIndex: number;
  left: number;
  top: number;
  width: number;
};

const desktopOffsetPattern = [
  { x: -8, y: -7 },
  { x: 10, y: -9 },
  { x: -12, y: 8 },
  { x: 12, y: 10 },
  { x: -6, y: 13 },
  { x: 7, y: -11 },
  { x: 0, y: 0 },
  { x: -13, y: 1 },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function AssetFrame({
  alt,
  fallbackCaption,
  priority = false,
  sizes,
  src,
}: AssetFrameProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden">
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

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01)_38%,rgba(0,0,0,0.42))]" />

      {hasError ? (
        <div className="absolute inset-0 flex items-end p-4 md:p-5">
          <div className="rounded-[1rem] border border-white/10 bg-black/35 px-4 py-3 text-sm leading-6 text-zinc-300 backdrop-blur-sm">
            {fallbackCaption}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ReferenceProjectsShowcase({
  desktopImages,
  mobileImages,
}: ReferenceProjectsShowcaseProps) {
  const [activeReveal, setActiveReveal] = useState<DesktopRevealItem | null>(
    null,
  );
  const [previousReveal, setPreviousReveal] =
    useState<DesktopRevealItem | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const fadeTimeoutRef = useRef<number | null>(null);
  const lastSpawnPointRef = useRef<{ x: number; y: number } | null>(null);
  const nextImageIndexRef = useRef(0);
  const revealIdRef = useRef(0);

  const desktopImageSet =
    desktopImages.length > 0 ? desktopImages : mobileImages ?? [];
  const mobileImageSet =
    mobileImages && mobileImages.length > 0
      ? mobileImages
      : desktopImageSet.slice(0, Math.min(8, desktopImageSet.length));
  const activeImage = activeReveal?.image ?? null;

  const spawnDistance =
    desktopImageSet.length >= 28 ? 42 : desktopImageSet.length >= 16 ? 52 : 60;
  const sizePattern =
    desktopImageSet.length >= 28
      ? [232, 244, 236, 252, 240, 248, 238, 256]
      : [260, 286, 270, 300, 278, 292, 266, 306];

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

  function revealAtPosition(
    clientX: number,
    clientY: number,
    currentTarget: HTMLDivElement,
  ) {
    if (desktopImageSet.length === 0) {
      return;
    }

    const bounds = currentTarget.getBoundingClientRect();
    const rawLeft = ((clientX - bounds.left) / bounds.width) * 100;
    const rawTop = ((clientY - bounds.top) / bounds.height) * 100;
    const revealIndex = revealIdRef.current;
    const offset =
      desktopOffsetPattern[revealIndex % desktopOffsetPattern.length];
    const width = sizePattern[revealIndex % sizePattern.length];
    const imageIndex = nextImageIndexRef.current % desktopImageSet.length;
    const image = desktopImageSet[imageIndex];

    nextImageIndexRef.current =
      (nextImageIndexRef.current + 1) % desktopImageSet.length;
    revealIdRef.current += 1;

    const nextReveal: DesktopRevealItem = {
      id: revealIndex,
      image,
      imageIndex,
      left: clamp(rawLeft + offset.x, 24, 76),
      top: clamp(rawTop + offset.y, 26, 74),
      width,
    };

    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current);
    }

    setPreviousReveal(activeReveal);
    setActiveReveal(nextReveal);

    fadeTimeoutRef.current = window.setTimeout(() => {
      setPreviousReveal((current) =>
        current?.id === nextReveal.id - 1 ? null : current,
      );
      fadeTimeoutRef.current = null;
    }, 420);
  }

  function maybeReveal(
    event: ReactPointerEvent<HTMLDivElement>,
    force = false,
  ) {
    if (desktopImageSet.length === 0) {
      return;
    }

    const point = { x: event.clientX, y: event.clientY };
    const lastPoint = lastSpawnPointRef.current;

    if (
      !force &&
      lastPoint &&
      Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) < spawnDistance
    ) {
      return;
    }

    lastSpawnPointRef.current = point;
    const currentTarget = event.currentTarget;

    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
    }

    frameIdRef.current = requestAnimationFrame(() => {
      revealAtPosition(point.x, point.y, currentTarget);
      frameIdRef.current = null;
    });
  }

  if (desktopImageSet.length === 0 && mobileImageSet.length === 0) {
    return (
      <div className="public-surface-strong overflow-hidden p-6 text-sm leading-6 text-zinc-400">
        A referenciafotók a végleges képek bekerülése után jelennek meg.
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="md:hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mobileImageSet.map((image, index) => (
            <article
              key={image.src}
              className="min-w-[86%] snap-center overflow-hidden rounded-[1.55rem] border border-white/10 bg-black/20"
            >
              <div className="relative aspect-[5/4]">
                <AssetFrame
                  alt={image.alt}
                  fallbackCaption="A referenciafotó a végleges kép bekerülése után jelenik meg."
                  priority={index === 0}
                  sizes="86vw"
                  src={image.src}
                />

                <div className="absolute inset-x-0 bottom-0 p-3.5">
                  <div className="flex items-end justify-between gap-4 rounded-[1.1rem] border border-white/10 bg-black/32 px-3.5 py-3 backdrop-blur-sm">
                    <p className="max-w-[70%] text-[0.9rem] font-medium leading-5 text-white">
                      {image.label}
                    </p>
                    <div className="text-[0.68rem] tracking-[0.18em] text-zinc-300 uppercase">
                      {String(index + 1).padStart(2, "0")} /{" "}
                      {String(mobileImageSet.length).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="hidden md:block">
        <div className="public-surface-strong overflow-hidden p-4 md:p-5 lg:p-6">
          <div
            aria-label="Referenciák és projektek"
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005)_28%,rgba(8,8,8,0.74))]"
            onPointerEnter={(event) => maybeReveal(event, true)}
            onPointerLeave={() => {
              lastSpawnPointRef.current = null;
            }}
            onPointerMove={maybeReveal}
          >
            <div className="relative aspect-[16/10]">
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 lg:p-6">
                <div className="h-px w-18 bg-gradient-to-r from-transparent via-white/18 to-transparent" />
                <div className="rounded-full border border-white/10 bg-black/26 px-3.5 py-1.5 text-[0.68rem] tracking-[0.18em] text-zinc-300 uppercase backdrop-blur-sm">
                  {String((activeReveal?.imageIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                  {String(desktopImageSet.length).padStart(2, "0")}
                </div>
              </div>

              {activeReveal === null && previousReveal === null ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                >
                  <div className="absolute left-1/2 top-1/2 h-30 w-30 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
                  <div className="absolute left-1/2 top-1/2 h-px w-22 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              ) : null}

              {[previousReveal, activeReveal]
                .filter((reveal): reveal is DesktopRevealItem => reveal !== null)
                .map((reveal) => {
                  const isActive = reveal.id === activeReveal?.id;

                  return (
                    <div
                      key={reveal.id}
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${reveal.left}%`,
                        top: `${reveal.top}%`,
                        width: `${reveal.width}px`,
                        zIndex: isActive ? 12 : 10,
                      }}
                    >
                      <div
                        className={cn(
                          "overflow-hidden rounded-[1.25rem] border border-white/10 bg-black/24 shadow-[0_28px_70px_rgba(0,0,0,0.38)] transition-all ease-out",
                          isActive
                            ? "scale-100 opacity-100 duration-500"
                            : "scale-[1.015] opacity-0 duration-700 delay-120",
                        )}
                      >
                        <div className="relative aspect-[4/3]">
                          <AssetFrame
                            alt={reveal.image.alt}
                            fallbackCaption="A referenciafotó a végleges kép bekerülése után jelenik meg."
                            priority={reveal.id < 2}
                            sizes="(min-width: 1280px) 19rem, (min-width: 768px) 17rem, 14rem"
                            src={reveal.image.src}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/18 px-5 py-4 lg:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
              <div className="max-w-2xl">
                <p className="text-[0.72rem] tracking-[0.2em] text-zinc-500 uppercase">
                  Aktuális részlet
                </p>
                <p className="mt-2 text-base font-medium text-white lg:text-[1.06rem]">
                  {activeImage?.label ?? "Referenciafotók"}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-400 lg:text-[0.95rem]">
                  {activeImage?.caption ??
                    "A referenciafotók a végleges képek bekerülése után jelennek meg."}
                </p>
              </div>

              <div className="min-w-[11.5rem] lg:pt-1">
                <div className="flex items-center justify-between text-[0.68rem] tracking-[0.18em] text-zinc-500 uppercase">
                  <span>Képsor</span>
                  <span>
                    {String((activeReveal?.imageIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                    {String(desktopImageSet.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-3 h-px overflow-hidden rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#c89758]/60 via-[#e5c98a]/80 to-[#c89758]/60 transition-[width] duration-500 ease-out"
                    style={{
                      width: `${
                        desktopImageSet.length <= 1
                          ? 100
                          : (((activeReveal?.imageIndex ?? 0) + 1) /
                              desktopImageSet.length) *
                            100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
