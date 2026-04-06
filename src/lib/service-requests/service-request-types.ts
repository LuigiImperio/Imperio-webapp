export const serviceRequestTypes = [
  "kazancsere",
  "futeskorszerusites",
  "hibabejelentes",
  "vizszereles",
  "komplett_epuletgepeszeti_kivitelezes",
  "csotores_szivargas",
  "hoszivattyu_telepites",
] as const

export type ServiceRequestType = (typeof serviceRequestTypes)[number]

const serviceRequestTypeLabels: Record<ServiceRequestType, string> = {
  kazancsere: "Kazánjavítás / kazáncsere",
  futeskorszerusites: "Fűtési rendszerek megkeresése",
  hibabejelentes: "Hibabejelentés",
  vizszereles: "Víz- és gázszerelés",
  komplett_epuletgepeszeti_kivitelezes:
    "Komplett épületgépészeti kivitelezés",
  csotores_szivargas: "Csőtörés / szivárgás",
  hoszivattyu_telepites: "Hőszivattyú telepítés",
}

export function isServiceRequestType(
  value: unknown
): value is ServiceRequestType {
  return (
    typeof value === "string" &&
    serviceRequestTypes.includes(value as ServiceRequestType)
  )
}

export function getServiceRequestTypeLabel(serviceType: string) {
  return serviceRequestTypeLabels[serviceType as ServiceRequestType] ?? serviceType
}
