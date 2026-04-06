export const publicAnalyticsEventNames = {
  pageView: "page_view",
  ctaClick: "cta_click",
  formStarted: "form_started",
  formStepCompleted: "form_step_completed",
  serviceRequestSubmitted: "service_request_submitted",
  faqItemExpanded: "faq_item_expanded",
} as const

export type PublicAnalyticsEventName =
  (typeof publicAnalyticsEventNames)[keyof typeof publicAnalyticsEventNames]

export type PublicAnalyticsEventPayload = Record<
  string,
  string | number | boolean | null | undefined
>
