"use client"

import Image from "next/image"
import { useState } from "react"

import { Reveal } from "@/components/motion/reveal"
import { galleryImages } from "@/components/reference-gallery/gallery-images-data"
import { ReferenceLightbox } from "@/components/reference-gallery/reference-lightbox"

export function ReferenceGallerySection() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const activeImage = galleryImages.find((image) => image.src === lightboxSrc) ?? null

  return (
    <section
      id="referenciak"
      className="relative border-t border-white/10 bg-gradient-to-b from-zinc-950 to-[#07090d] scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <Reveal className="max-w-[42.5rem]" variant="soft">
          <div className="public-pill inline-flex px-3.5 py-1 text-xs sm:px-4 sm:text-sm">
            Referenciák
          </div>
          <h2 className="mt-5 text-white text-[1.8rem] font-bold tracking-tight sm:text-[2.4rem] md:text-[2.7rem]">
            Néhány elvégzett munkánk
          </h2>
          <p className="mt-4 text-[1rem] leading-6 text-zinc-400 sm:text-[1.12rem] sm:leading-7">
            Valós helyszínek Pécsen és környékén. Kattintson a nagyobb nézethez.
          </p>
        </Reveal>

        <Reveal
          className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3"
          variant="card"
          delayMs={80}
        >
          {galleryImages.map((image) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setLightboxSrc(image.src)}
              className="group relative aspect-4/3 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d12] p-0 transition-colors hover:border-white/25"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
            </button>
          ))}
        </Reveal>
      </div>

      {activeImage ? (
        <ReferenceLightbox
          src={activeImage.src}
          alt={activeImage.alt}
          onClose={() => setLightboxSrc(null)}
        />
      ) : null}
    </section>
  )
}
