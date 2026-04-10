export const supportedServiceAreaCities = [
  "Pécs",
  "Kozármisleny",
  "Pellérd",
  "Pogány",
  "Keszü",
  "Gyód",
  "Orfű",
  "Abaliget",
  "Hosszúhetény",
  "Komló",
  "Siklós",
  "Szentlőrinc",
  "Budapest",
] as const

export const primaryServiceAreaCities = [
  "Pécs",
  "Kozármisleny",
  "Pellérd",
  "Pogány",
  "Keszü",
  "Gyód",
  "Orfű",
  "Abaliget",
  "Hosszúhetény",
  "Komló",
  "Siklós",
  "Szentlőrinc",
] as const

export const supportedServiceAreaLabel =
  "Pécs és környéke, valamint több közeli baranyai település"

export const supportedServiceAreaShortLabel =
  "Pécs és környéke"

export type ServiceAreaAssessment = {
  assessedCity: string
  normalizedCity: string
  isWithinSupportedArea: boolean
  matchedSupportedCity: string | null
}

function normalizeCity(city: string) {
  return city
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
}

export function getServiceAreaAssessment(city: string): ServiceAreaAssessment {
  const assessedCity = city.trim()
  const normalizedCity = normalizeCity(assessedCity)

  if (!normalizedCity) {
    return {
      assessedCity,
      normalizedCity,
      isWithinSupportedArea: false,
      matchedSupportedCity: null,
    }
  }

  const matchedSupportedCity =
    supportedServiceAreaCities.find(
      (supportedCity) => normalizeCity(supportedCity) === normalizedCity
    ) ?? null

  return {
    assessedCity,
    normalizedCity,
    isWithinSupportedArea: Boolean(matchedSupportedCity),
    matchedSupportedCity,
  }
}

export function getServiceAreaUserMessage(assessment: ServiceAreaAssessment) {
  if (assessment.matchedSupportedCity === "Budapest") {
    return "Budapesti helyszín is vállalható, elsősorban nagyobb projektek esetén. A pontos lehetőségeket és az esetleges kiszállási feltételeket egyeztetés után jelezzük."
  }

  if (assessment.isWithinSupportedArea) {
    return "A megadott település az elsődleges, Pécs környéki szolgáltatási területhez tartozik, így a megkeresés helyben gyorsabban előkészíthető."
  }

  return "A megadott település Pécs és környéke, illetve az elsődleges baranyai szolgáltatási területen kívül esik, de ettől függetlenül rögzítjük a megkeresést. Távolabbi munka esetén az ajánlatban kiszállási költség is megjelenhet, a pontos lehetőségekről visszajelzünk."
}

export function getServiceAreaStatusLabel(
  assessment:
    | Pick<ServiceAreaAssessment, "isWithinSupportedArea" | "matchedSupportedCity">
    | null
) {
  if (!assessment) {
    return "Nem meghatározott"
  }

  if (assessment.isWithinSupportedArea) {
    if (assessment.matchedSupportedCity === "Budapest") {
      return "Budapest (nagyobb projektek esetén)"
    }

    return assessment.matchedSupportedCity
      ? `Elsődleges területen belül (${assessment.matchedSupportedCity})`
      : "Elsődleges területen belül"
  }

  return "Elsődleges területen kívül"
}
