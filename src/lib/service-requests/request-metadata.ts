import "server-only"

type StoredServiceAreaInfo = {
  assessedCity: string
  isWithinSupportedArea: boolean
  matchedSupportedCity: string | null
}

type StoredSchedulingInfo = {
  siteVisitNeed: string
  appointmentWindow: string
  schedulingNote: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

export function getPreferredContactTime(formDataJson: unknown) {
  if (!isRecord(formDataJson)) {
    return null
  }

  const contact = formDataJson.contact

  if (!isRecord(contact)) {
    return null
  }

  const preferredContactTime = contact.preferredContactTime

  return typeof preferredContactTime === "string" && preferredContactTime.trim()
    ? preferredContactTime.trim()
    : null
}

export function getStoredPostalCode(formDataJson: unknown) {
  if (!isRecord(formDataJson)) {
    return null
  }

  const property = formDataJson.property

  if (isRecord(property) && typeof property.postalCode === "string") {
    const postalCode = property.postalCode.trim()

    if (postalCode) {
      return postalCode
    }
  }

  const project = formDataJson.project

  if (isRecord(project) && typeof project.postalCode === "string") {
    const postalCode = project.postalCode.trim()

    if (postalCode) {
      return postalCode
    }
  }

  const location = formDataJson.location

  if (isRecord(location) && typeof location.postalCode === "string") {
    const postalCode = location.postalCode.trim()

    if (postalCode) {
      return postalCode
    }
  }

  const contact = formDataJson.contact

  if (isRecord(contact) && typeof contact.postalCode === "string") {
    const postalCode = contact.postalCode.trim()

    if (postalCode) {
      return postalCode
    }
  }

  return null
}

export function getStoredServiceAreaInfo(
  formDataJson: unknown
): StoredServiceAreaInfo | null {
  if (!isRecord(formDataJson)) {
    return null
  }

  const serviceArea = formDataJson.serviceArea

  if (!isRecord(serviceArea)) {
    return null
  }

  const assessedCity = serviceArea.assessedCity
  const isWithinSupportedArea = serviceArea.isWithinSupportedArea
  const matchedSupportedCity = serviceArea.matchedSupportedCity

  if (
    typeof assessedCity !== "string" ||
    typeof isWithinSupportedArea !== "boolean"
  ) {
    return null
  }

  return {
    assessedCity,
    isWithinSupportedArea,
    matchedSupportedCity:
      typeof matchedSupportedCity === "string" ? matchedSupportedCity : null,
  }
}

export function getStoredSchedulingInfo(
  formDataJson: unknown
): StoredSchedulingInfo | null {
  if (!isRecord(formDataJson)) {
    return null
  }

  const scheduling = formDataJson.scheduling

  if (!isRecord(scheduling)) {
    return null
  }

  const siteVisitNeed = scheduling.siteVisitNeed
  const appointmentWindow = scheduling.appointmentWindow
  const schedulingNote = scheduling.schedulingNote

  if (
    typeof siteVisitNeed !== "string" ||
    !siteVisitNeed.trim() ||
    typeof appointmentWindow !== "string" ||
    !appointmentWindow.trim()
  ) {
    return null
  }

  return {
    siteVisitNeed: siteVisitNeed.trim(),
    appointmentWindow: appointmentWindow.trim(),
    schedulingNote:
      typeof schedulingNote === "string" && schedulingNote.trim()
        ? schedulingNote.trim()
        : null,
  }
}
