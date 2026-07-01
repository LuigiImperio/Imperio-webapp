"use client"

import { towns } from "@/components/service-area-map/towns-data"
import { cn } from "@/lib/utils"

type ServiceAreaMapCanvasProps = {
  selectedTown: string
  onSelect: (name: string) => void
}

const ORIGIN = { x: 50, y: 56 }

export function ServiceAreaMapCanvas({ selectedTown, onSelect }: ServiceAreaMapCanvasProps) {
  return (
    <div className="relative min-h-[460px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_45%,rgba(200,151,88,0.08),transparent_60%),linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:46px_46px] [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_80%)]"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {towns.map((town) => (
          <line
            key={town.name}
            x1={ORIGIN.x}
            y1={ORIGIN.y}
            x2={town.x}
            y2={town.y}
            stroke="rgba(200,151,88,0.2)"
            strokeWidth={0.4}
          />
        ))}
      </svg>

      {towns.map((town) => {
        const selected = selectedTown === town.name
        const dotSize = town.big ? 16 : 11

        return (
          <button
            key={town.name}
            type="button"
            onClick={() => onSelect(town.name)}
            aria-label={town.name}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 border-none bg-transparent p-1"
            style={{
              left: `${town.x}%`,
              top: `${town.y}%`,
              zIndex: selected ? 3 : town.big ? 2 : 1,
            }}
          >
            <span className="relative flex items-center justify-center">
              {selected ? (
                <span className="animate-imperio-pingdot absolute size-4 rounded-full border-2 border-[#e8d0a0]" />
              ) : null}
              <span
                className="relative rounded-full"
                style={{
                  width: dotSize,
                  height: dotSize,
                  background:
                    selected || town.big
                      ? "linear-gradient(135deg,#f2e2bc,#c89758)"
                      : "rgba(255,255,255,0.5)",
                  border: selected
                    ? "2px solid #f2e2bc"
                    : town.big
                      ? "2px solid rgba(242,226,188,0.6)"
                      : "1px solid rgba(255,255,255,0.3)",
                  boxShadow:
                    selected || town.big
                      ? "0 0 0 6px rgba(200,151,88,0.18), 0 0 18px rgba(200,151,88,0.5)"
                      : "none",
                }}
              />
            </span>
            <span
              className={cn(
                "whitespace-nowrap tracking-[0.01em] [text-shadow:0_1px_6px_rgba(0,0,0,0.7)]",
                town.big ? "text-[13px]" : "text-[11.5px]",
                selected || town.big ? "font-semibold" : "font-medium",
                selected ? "text-[#f5e8ca]" : town.big ? "text-[#f0dfbe]" : "text-[#c9c9cf]"
              )}
            >
              {town.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
