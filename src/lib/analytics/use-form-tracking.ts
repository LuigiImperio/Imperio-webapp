"use client"

import { useRef } from "react"

import {
  publicAnalyticsEventNames,
  type PublicAnalyticsEventPayload,
} from "@/lib/analytics/public-events"
import { trackPublicEvent } from "@/lib/analytics/tracker"

export function useFormTracking({
  serviceType,
  sourcePage,
  totalSteps,
}: {
  serviceType: string
  sourcePage: string
  totalSteps: number
}) {
  const hasTrackedFormStartRef = useRef(false)

  function trackFormStarted(extraPayload: PublicAnalyticsEventPayload = {}) {
    if (hasTrackedFormStartRef.current) {
      return
    }

    hasTrackedFormStartRef.current = true

    trackPublicEvent(publicAnalyticsEventNames.formStarted, {
      service_type: serviceType,
      source_page: sourcePage,
      source_section: "form",
      form_name: serviceType,
      total_steps: totalSteps,
      ...extraPayload,
    })
  }

  function trackStepCompleted({
    currentStep,
    nextStep,
    currentStepName,
    nextStepName,
  }: {
    currentStep: number
    nextStep: number
    currentStepName?: string
    nextStepName?: string
  }) {
    trackPublicEvent(publicAnalyticsEventNames.formStepCompleted, {
      service_type: serviceType,
      source_page: sourcePage,
      source_section: "form",
      form_name: serviceType,
      step_index: currentStep,
      step_name: currentStepName,
      next_step_index: nextStep,
      next_step_name: nextStepName,
      total_steps: totalSteps,
    })
  }

  function trackSubmitSuccess(extraPayload: PublicAnalyticsEventPayload = {}) {
    trackPublicEvent(publicAnalyticsEventNames.serviceRequestSubmitted, {
      service_type: serviceType,
      source_page: sourcePage,
      source_section: "form",
      form_name: serviceType,
      step_index: totalSteps,
      total_steps: totalSteps,
      ...extraPayload,
    })
  }

  return {
    trackFormStarted,
    trackStepCompleted,
    trackSubmitSuccess,
  }
}
