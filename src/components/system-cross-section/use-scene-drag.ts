"use client"

import { useRef, useState, type PointerEvent } from "react"

const INITIAL_ROT_X = 56
const INITIAL_ROT_Y = -26
const ROT_X_MIN = 34
const ROT_X_MAX = 78

export function useSceneDrag() {
  const [rotX, setRotX] = useState(INITIAL_ROT_X)
  const [rotY, setRotY] = useState(INITIAL_ROT_Y)
  const [dragging, setDragging] = useState(false)
  const dragOrigin = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    dragOrigin.current = { x: event.clientX, y: event.clientY, rx: rotX, ry: rotY }
    setDragging(true)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // pointer capture isn't critical to the drag interaction
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging || !dragOrigin.current) return

    const origin = dragOrigin.current
    const nextRy = origin.ry + (event.clientX - origin.x) * 0.45
    const nextRx = Math.max(
      ROT_X_MIN,
      Math.min(ROT_X_MAX, origin.rx - (event.clientY - origin.y) * 0.3)
    )

    setRotY(nextRy)
    setRotX(nextRx)
  }

  function onPointerUp() {
    setDragging(false)
    dragOrigin.current = null
  }

  return { rotX, rotY, dragging, onPointerDown, onPointerMove, onPointerUp }
}
