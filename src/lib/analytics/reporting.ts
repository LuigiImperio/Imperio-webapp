import {
  publicAnalyticsEventNames,
  type PublicAnalyticsEventName,
  type PublicAnalyticsEventPayload,
} from "@/lib/analytics/public-events"

const servicePageContexts = {
  "/szolgaltatasok/csotores-szivargas": {
    pageName: "csotores-szivargas",
    pageType: "service_page",
    serviceType: "csotores_szivargas",
  },
  "/szolgaltatasok/hoszivattyu-telepites": {
    pageName: "hoszivattyu-telepites",
    pageType: "service_page",
    serviceType: "hoszivattyu_telepites",
  },
  "/szolgaltatasok/kazancsere": {
    pageName: "kazancsere",
    pageType: "service_page",
    serviceType: "kazancsere",
  },
  "/szolgaltatasok/futeskorszerusites": {
    pageName: "futeskorszerusites",
    pageType: "service_page",
    serviceType: "futeskorszerusites",
  },
  "/szolgaltatasok/hibabejelentes": {
    pageName: "hibabejelentes",
    pageType: "service_page",
    serviceType: "hibabejelentes",
  },
  "/szolgaltatasok/vizszereles": {
    pageName: "vizszereles",
    pageType: "service_page",
    serviceType: "vizszereles",
  },
} as const

type KnownPathname = keyof typeof servicePageContexts

type NormalizedAnalyticsPayload = Record<
  string,
  string | number | boolean | null
>

function isKnownPathname(pathname: string): pathname is KnownPathname {
  return pathname in servicePageContexts
}

function getStringValue(
  value: string | number | boolean | null | undefined
): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

function getNumberValue(
  value: string | number | boolean | null | undefined
): number | undefined {
  return typeof value === "number" ? value : undefined
}

function getBooleanValue(
  value: string | number | boolean | null | undefined
): boolean | undefined {
  return typeof value === "boolean" ? value : undefined
}

function withDefinedValues(
  payload: Record<string, string | number | boolean | null | undefined>
): NormalizedAnalyticsPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  ) as NormalizedAnalyticsPayload
}

function derivePageContext(payload: PublicAnalyticsEventPayload) {
  const pagePath = getStringValue(payload.page_path)?.split("?")[0]
  const sourcePage = getStringValue(payload.source_page)
  const explicitServiceType = getStringValue(payload.service_type)

  if (pagePath === "/") {
    return {
      pageName: "homepage",
      pageType: "homepage",
      serviceType: explicitServiceType,
    } as const
  }

  if (pagePath && isKnownPathname(pagePath)) {
    return servicePageContexts[pagePath]
  }

  if (sourcePage === "homepage") {
    return {
      pageName: "homepage",
      pageType: "homepage",
      serviceType: explicitServiceType,
    } as const
  }

  if (
    sourcePage &&
    explicitServiceType &&
    Object.values(servicePageContexts).some(
      (context) =>
        context.pageName === sourcePage && context.serviceType === explicitServiceType
    )
  ) {
    return {
      pageName: sourcePage,
      pageType: "service_page",
      serviceType: explicitServiceType,
    } as const
  }

  return {
    pageName: sourcePage ?? "other_public_page",
    pageType: "other_public_page",
    serviceType: explicitServiceType,
  } as const
}

function getEntryPoint(payload: PublicAnalyticsEventPayload) {
  const entryPoint = getStringValue(payload.entry_point)

  if (entryPoint) {
    return entryPoint
  }

  const sourcePage = getStringValue(payload.source_page)
  const sourceSection = getStringValue(payload.source_section)
  const ctaVariant = getStringValue(payload.cta_variant)

  return [sourcePage, sourceSection, ctaVariant].filter(Boolean).join(":")
}

function getNormalizedSourcePage(
  payload: PublicAnalyticsEventPayload,
  pageName: string
) {
  return getStringValue(payload.source_page) ?? pageName
}

export function buildPublicAnalyticsPayload(
  eventName: PublicAnalyticsEventName,
  payload: PublicAnalyticsEventPayload
) {
  const pageContext = derivePageContext(payload)
  const sourcePage = getNormalizedSourcePage(payload, pageContext.pageName)
  const sourceSection = getStringValue(payload.source_section)

  const basePayload = withDefinedValues({
    ...payload,
    platform_area: "public",
    event_version: 2,
    page_name: pageContext.pageName,
    page_type: pageContext.pageType,
    service_type: pageContext.serviceType,
    source_page: sourcePage,
    source_section: sourceSection,
  })

  if (eventName === publicAnalyticsEventNames.pageView) {
    return withDefinedValues({
      ...basePayload,
      milestone_name:
        pageContext.pageType === "service_page"
          ? "service_page_entry"
          : "page_view",
      funnel_stage:
        pageContext.pageType === "service_page"
          ? "service_page_entry"
          : "page_view",
    })
  }

  if (eventName === publicAnalyticsEventNames.ctaClick) {
    return withDefinedValues({
      ...basePayload,
      funnel_name: "service_request",
      funnel_stage: "cta_entry",
      milestone_name: "cta_entry_click",
      cta_variant: getStringValue(payload.cta_variant),
      cta_label: getStringValue(payload.cta_label),
      destination_path: getStringValue(payload.destination_path),
      entry_point: getEntryPoint(payload),
    })
  }

  if (eventName === publicAnalyticsEventNames.formStarted) {
    return withDefinedValues({
      ...basePayload,
      funnel_name: "service_request",
      funnel_stage: "form_start",
      milestone_name: "form_start",
      step_index: getNumberValue(payload.step_index),
      step_name: getStringValue(payload.step_name),
      total_steps: getNumberValue(payload.total_steps),
      interacted_field: getStringValue(payload.interacted_field),
      form_name: getStringValue(payload.form_name),
    })
  }

  if (eventName === publicAnalyticsEventNames.formStepCompleted) {
    return withDefinedValues({
      ...basePayload,
      funnel_name: "service_request",
      funnel_stage: "form_progress",
      milestone_name: "form_step_completed",
      step_index: getNumberValue(payload.step_index),
      step_name: getStringValue(payload.step_name),
      next_step_index: getNumberValue(payload.next_step_index),
      next_step_name: getStringValue(payload.next_step_name),
      total_steps: getNumberValue(payload.total_steps),
      form_name: getStringValue(payload.form_name),
    })
  }

  if (eventName === publicAnalyticsEventNames.serviceRequestSubmitted) {
    return withDefinedValues({
      ...basePayload,
      funnel_name: "service_request",
      funnel_stage: "submission_success",
      milestone_name: "service_request_submitted",
      step_index: getNumberValue(payload.step_index),
      step_name: getStringValue(payload.step_name),
      total_steps: getNumberValue(payload.total_steps),
      has_images: getBooleanValue(payload.has_images),
      form_name: getStringValue(payload.form_name),
    })
  }

  if (eventName === publicAnalyticsEventNames.faqItemExpanded) {
    return withDefinedValues({
      ...basePayload,
      funnel_stage: "faq_engagement",
      milestone_name: "faq_item_expanded",
      faq_question: getStringValue(payload.faq_question),
    })
  }

  return basePayload
}
