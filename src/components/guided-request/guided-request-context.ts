"use client"

import { createContext, useContext } from "react"

import type {
  FormState,
  GuidedRequestState,
  PhotoAsset,
  ScreenKey,
  SummaryLine,
  TopicKey,
} from "@/components/guided-request/guided-request-types"

export type GuidedRequestContextValue = {
  state: GuidedRequestState
  screenKey: ScreenKey
  headerLabel: string
  showProgress: boolean
  stepLabel: string
  stepCounter: string
  progressPct: string
  showFooterNav: boolean
  showNext: boolean
  backLabel: string
  nextLabel: string
  topicLabel: string
  areaNote: string
  summaryLines: SummaryLine[]
  mailHref: string
  hasPhotos: boolean
  openGeneral: () => void
  openUrgent: () => void
  openTopic: (topic: TopicKey) => void
  pickUrgent: () => void
  pickEveryday: () => void
  pickProject: () => void
  selectTopic: (topic: TopicKey) => void
  toggleSymptom: (label: string) => void
  setField: (key: keyof FormState, value: string) => void
  addPhotos: (photos: PhotoAsset[]) => void
  removePhoto: (index: number) => void
  next: () => void
  prev: () => void
  close: () => void
  submit: () => void
}

export const GuidedRequestContext = createContext<GuidedRequestContextValue | null>(null)

export function useGuidedRequest() {
  const context = useContext(GuidedRequestContext)

  if (!context) {
    throw new Error("useGuidedRequest must be used within a GuidedRequestProvider")
  }

  return context
}
