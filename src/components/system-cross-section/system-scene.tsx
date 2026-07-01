"use client"

import { Move3d } from "lucide-react"
import type { CSSProperties } from "react"

import type { PartKey } from "@/components/system-cross-section/system-parts-data"
import { useSceneDrag } from "@/components/system-cross-section/use-scene-drag"

type SystemSceneProps = {
  selectedPart: PartKey
}

function layerStyle(z: number, background: string, selected: boolean): CSSProperties {
  return {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 280,
    height: 176,
    marginLeft: -140,
    marginTop: -88,
    borderRadius: 12,
    background,
    transform: `translateZ(${selected ? 150 : z}px)`,
    border: selected ? "2px solid #f2e2bc" : "1px solid rgba(0,0,0,0.35)",
    boxShadow: selected
      ? "0 0 0 4px rgba(200,151,88,0.25), 0 22px 40px rgba(0,0,0,0.5)"
      : "0 14px 26px rgba(0,0,0,0.45)",
    backfaceVisibility: "hidden",
  }
}

export function SystemScene({ selectedPart }: SystemSceneProps) {
  const { rotX, rotY, dragging, onPointerDown, onPointerMove, onPointerUp } = useSceneDrag()

  const csoSelected = selectedPart === "cso"
  const esztrichSelected = selectedPart === "esztrich"

  const layerEsztrich: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 280,
    height: 176,
    marginLeft: -140,
    marginTop: -88,
    borderRadius: 12,
    background: "linear-gradient(160deg,#8a8d94,#6f727a)",
    transform: `translateZ(${esztrichSelected || csoSelected ? 150 : 46}px)`,
    border: esztrichSelected
      ? "2px solid #f2e2bc"
      : csoSelected
        ? "2px solid #ff6a4d"
        : "1px solid rgba(0,0,0,0.35)",
    boxShadow: esztrichSelected
      ? "0 0 0 4px rgba(200,151,88,0.25), 0 22px 40px rgba(0,0,0,0.5)"
      : csoSelected
        ? "0 0 0 4px rgba(255,106,77,0.3), 0 22px 40px rgba(0,0,0,0.5)"
        : "0 14px 26px rgba(0,0,0,0.45)",
    backfaceVisibility: "hidden",
    transition: "border .25s ease, box-shadow .25s ease",
  }

  const pipeOverlayStyle: CSSProperties = {
    position: "absolute",
    inset: "30px 18px 16px",
    borderRadius: 8,
    background: csoSelected
      ? "repeating-linear-gradient(90deg, transparent 0 15px, #ff6a4d 15px 26px)"
      : "repeating-linear-gradient(90deg, transparent 0 20px, #d4543e 20px 26px)",
    opacity: csoSelected ? 1 : esztrichSelected ? 0.16 : 0.55,
    filter: csoSelected ? "drop-shadow(0 0 7px rgba(255,106,77,0.95))" : "none",
    transition: "opacity .25s ease, filter .25s ease, background .25s ease",
  }

  const hpSelected = selectedPart === "hoszivattyu"
  const hpStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 74,
    height: 98,
    marginLeft: -37,
    marginTop: -49,
    transform: `translateX(182px) translateY(-12px) translateZ(${hpSelected ? 98 : 82}px)`,
    borderRadius: 10,
    background: "linear-gradient(160deg,#3a7da0,#274f68)",
    border: hpSelected ? "2px solid #f2e2bc" : "1px solid rgba(0,0,0,0.4)",
    boxShadow: hpSelected
      ? "0 0 0 4px rgba(200,151,88,0.25), 0 22px 40px rgba(0,0,0,0.5)"
      : "0 16px 30px rgba(0,0,0,0.5)",
    backfaceVisibility: "hidden",
  }

  const osztoSelected = selectedPart === "oszto"
  const osztoStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 46,
    height: 58,
    marginLeft: -23,
    marginTop: -29,
    transform: `translateX(-148px) translateY(-28px) translateZ(${osztoSelected ? 94 : 80}px)`,
    borderRadius: 8,
    background: "linear-gradient(160deg,#c4c8d0,#969ca6)",
    border: osztoSelected ? "2px solid #f2e2bc" : "1px solid rgba(0,0,0,0.4)",
    boxShadow: osztoSelected
      ? "0 0 0 4px rgba(200,151,88,0.25), 0 18px 34px rgba(0,0,0,0.5)"
      : "0 14px 26px rgba(0,0,0,0.5)",
    backfaceVisibility: "hidden",
  }

  const pipeLinkStyle: CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 118,
    height: 9,
    marginTop: -4,
    borderRadius: 999,
    transform: "translateX(108px) translateY(22px) translateZ(72px)",
    background: "linear-gradient(90deg,#d4543e,#a3382a)",
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(200,151,88,0.08),transparent_60%),#080a0f]"
      style={{ perspective: 1100, touchAction: "none", cursor: dragging ? "grabbing" : "grab" }}
    >
      <div className="pointer-events-none absolute top-3.5 left-4 inline-flex items-center gap-1.5 text-xs text-zinc-500">
        <Move3d className="size-[15px]" />
        Húzza a forgatáshoz
      </div>

      <div
        style={{
          position: "relative",
          width: 280,
          height: 176,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateZ(${rotY}deg)`,
        }}
      >
        <div style={layerStyle(0, "linear-gradient(160deg,#5b5e66,#3f424a)", false)} />

        <div
          style={layerStyle(
            22,
            "repeating-linear-gradient(135deg,#efe7d0,#efe7d0 11px,#e0d2ad 11px,#e0d2ad 22px)",
            selectedPart === "szigeteles"
          )}
        >
          <span className="absolute top-2 left-2.5 text-[10px] font-bold text-[rgba(40,28,18,0.7)]">
            5 · HŐSZIGETELÉS
          </span>
        </div>

        <div style={layerEsztrich}>
          <span className="absolute top-2 left-2.5 text-[10px] font-bold text-[rgba(255,255,255,0.6)]">
            4 · ESZTRICH
          </span>
          <div style={pipeOverlayStyle} />
          <span className="absolute right-3 bottom-2 inline-flex size-[22px] items-center justify-center rounded-full bg-[#d4543e] text-xs font-bold text-white">
            3
          </span>
        </div>

        <div
          style={layerStyle(
            72,
            "repeating-linear-gradient(90deg,#9a6b46,#9a6b46 26px,#8c6140 26px,#8c6140 28px)",
            selectedPart === "padlo"
          )}
        >
          <span className="absolute top-2 left-2.5 text-[10px] font-bold text-[rgba(255,255,255,0.85)]">
            6 · PADLÓBURKOLAT
          </span>
        </div>

        <div style={hpStyle}>
          <div className="absolute inset-2.5 rounded-lg bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.18)_0_3px,transparent_3px_8px)]" />
          <span className="absolute top-1.5 left-2 inline-flex size-[22px] items-center justify-center rounded-full bg-gradient-to-br from-[#f2e2bc] to-[#c89758] text-xs font-bold text-[#181109]">
            1
          </span>
          <span className="absolute right-0 bottom-[7px] left-0 text-center text-[9.5px] font-bold tracking-[0.04em] text-[#e9f3fb]">
            HŐSZIVATTYÚ
          </span>
        </div>

        <div style={pipeLinkStyle} />

        <div style={osztoStyle}>
          <div className="absolute inset-[7px] rounded-md bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.25)_0_2px,transparent_2px_7px)]" />
          <span className="absolute top-1 left-[5px] inline-flex size-[19px] items-center justify-center rounded-full bg-gradient-to-br from-[#f2e2bc] to-[#c89758] text-[11px] font-bold text-[#181109]">
            2
          </span>
        </div>
      </div>
    </div>
  )
}
