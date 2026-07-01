"use client"

import { ImagePlus, X } from "lucide-react"
import type { ChangeEvent } from "react"

import { useGuidedRequest } from "@/components/guided-request/guided-request-context"
import { LabeledTextarea } from "@/components/guided-request/shared/labeled-textarea"

const MAX_PHOTOS = 6

export function ExtraScreen() {
  const { state, hasPhotos, addPhotos, removePhoto, setField } = useGuidedRequest()

  function handlePhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/")
    )
    const next = files
      .slice(0, MAX_PHOTOS - state.photos.length)
      .map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))

    if (next.length) addPhotos(next)
    event.target.value = ""
  }

  return (
    <div>
      <h2 className="text-white text-[1.4rem] font-bold tracking-tight sm:text-[1.95rem]">
        Fotó és megjegyzés
      </h2>
      <p className="mt-3 text-[15px] leading-6 text-zinc-400">
        Egy-két kép sokat segít, de nem kötelező. Ezt a lépést át is ugorhatja.
      </p>

      <label className="mt-6 flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/18 bg-white/[0.025] p-5 text-center transition-colors hover:border-[#c89758]/40 hover:bg-[#c89758]/5">
        <span className="flex size-[42px] items-center justify-center rounded-xl border border-[#c89758]/20 bg-[#c89758]/8 text-[#f0dfbe]">
          <ImagePlus className="size-5" />
        </span>
        <span className="text-[14.5px] font-semibold text-zinc-200">Fotó hozzáadása</span>
        <span className="text-[12.5px] text-zinc-500">
          Koppintson a feltöltéshez (akár több kép)
        </span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
      </label>

      {hasPhotos ? (
        <>
          <div className="mt-3.5 grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2.5">
            {state.photos.map((photo, index) => (
              <div
                key={`${photo.name}-${index}`}
                className="relative aspect-square overflow-hidden rounded-[13px] border border-white/12"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="block h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  aria-label="Kép eltávolítása"
                  className="absolute top-1.5 right-1.5 inline-flex size-[26px] items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2.5 text-xs text-zinc-500">
            A fotókat az e-mailben felsoroljuk; küldéskor csatolhatja őket, vagy a
            visszahíváskor egyeztetjük.
          </p>
        </>
      ) : null}

      <div className="mt-5">
        <LabeledTextarea
          label="Megjegyzés"
          optional
          placeholder="Bármi, amit fontosnak tart"
          value={state.form.note}
          onChange={(e) => setField("note", e.target.value)}
        />
      </div>
    </div>
  )
}
