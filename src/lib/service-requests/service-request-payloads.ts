import { getServiceAreaAssessment } from "@/lib/service-area"
import type { ServiceRequestType } from "@/lib/service-requests/service-request-types"
import type { Database } from "@/lib/supabase/database.types"

export type BoilerReplacementInquiryData = {
  property: {
    propertyType: string
    area: string
    postalCode: string
    city: string
  }
  currentSystem: {
    currentBoilerType: string
    boilerWorkingStatus: string
    replacementReason: string
  }
  contact: {
    name: string
    phone: string
    email: string
    preferredContactTime: string
    notes: string
  }
  scheduling: {
    siteVisitNeed: string
    appointmentWindow: string
    schedulingNote: string
  }
}

export type HeatingModernizationInquiryData = {
  property: {
    propertyType: string
    area: string
    postalCode: string
    city: string
    currentHeatingSystem: string
  }
  modernization: {
    modernizationGoal: string
    heatSourceStatus: string
    requestDescription: string
  }
  contact: {
    name: string
    phone: string
    email: string
    preferredContactTime: string
    notes: string
  }
  scheduling: {
    siteVisitNeed: string
    appointmentWindow: string
    schedulingNote: string
  }
}

export type FaultReportInquiryData = {
  fault: {
    faultType: string
    urgency: string
    description: string
  }
  contact: {
    postalCode: string
    city: string
    name: string
    phone: string
    email: string
    preferredContactTime: string
    notes: string
  }
  scheduling: {
    siteVisitNeed: string
    appointmentWindow: string
    schedulingNote: string
  }
}

export type LeakRequestInquiryData = {
  issue: {
    leakActive: string
    waterShutOff: string
    affectedArea: string
    leakVisibility: string
    damageLevel: string
    description: string
  }
  location: {
    postalCode: string
    city: string
  }
  contact: {
    name: string
    phone: string
    email: string
    preferredContactTime: string
    notes: string
  }
  scheduling: {
    siteVisitNeed: string
    appointmentWindow: string
    schedulingNote: string
  }
}

export type PlumbingRequestInquiryData = {
  plumbing: {
    workType: string
    urgency: string
    description: string
  }
  location: {
    postalCode: string
    city: string
  }
  contact: {
    name: string
    phone: string
    email: string
    preferredContactTime: string
    notes: string
  }
  scheduling: {
    siteVisitNeed: string
    appointmentWindow: string
    schedulingNote: string
  }
}

export type HeatPumpInstallationInquiryData = {
  property: {
    projectMode: string
    propertyType: string
    area: string
    postalCode: string
    city: string
  }
  system: {
    heatEmitterType: string
    currentHeatSource: string
    hotWaterNeed: string
    electricalSetup: string
    projectStage: string
    requestDescription: string
  }
  contact: {
    name: string
    phone: string
    email: string
    preferredContactTime: string
    notes: string
  }
  scheduling: {
    siteVisitNeed: string
    appointmentWindow: string
    schedulingNote: string
  }
}

export type BuildingServicesInquiryData = {
  project: {
    projectType: string
    propertyType: string
    area: string
    postalCode: string
    city: string
  }
  scope: {
    projectStage: string
    scopeFocus: string
    requestDescription: string
  }
  contact: {
    name: string
    phone: string
    email: string
    preferredContactTime: string
    notes: string
  }
  scheduling: {
    siteVisitNeed: string
    appointmentWindow: string
    schedulingNote: string
  }
}

export type ServiceRequestInsert =
  Database["public"]["Tables"]["service_requests"]["Insert"] & {
    service_type: ServiceRequestType
  }

export function buildBoilerReplacementInsert(
  requestId: string,
  formData: BoilerReplacementInquiryData
): ServiceRequestInsert {
  const message = formData.contact.notes.trim()
  const schedulingNote = formData.scheduling.schedulingNote.trim()
  const serviceArea = getServiceAreaAssessment(formData.property.city)

  return {
    id: requestId,
    service_type: "kazancsere",
    status: "uj",
    full_name: formData.contact.name.trim(),
    phone: formData.contact.phone.trim(),
    email: formData.contact.email.trim(),
    city: formData.property.city.trim(),
    property_type: formData.property.propertyType.trim(),
    property_area: formData.property.area.trim(),
    current_boiler_type: formData.currentSystem.currentBoilerType.trim(),
    boiler_status: formData.currentSystem.boilerWorkingStatus.trim(),
    replacement_reason: formData.currentSystem.replacementReason.trim(),
    message: message || null,
    form_data_json: {
      serviceType: "kazancsere",
      property: formData.property,
      currentSystem: formData.currentSystem,
      contact: {
        ...formData.contact,
        notes: message,
      },
      scheduling: {
        ...formData.scheduling,
        schedulingNote,
      },
      serviceArea: {
        assessedCity: serviceArea.assessedCity,
        isWithinSupportedArea: serviceArea.isWithinSupportedArea,
        matchedSupportedCity: serviceArea.matchedSupportedCity,
      },
    },
  }
}

export function buildHeatingModernizationInsert(
  requestId: string,
  formData: HeatingModernizationInquiryData
): ServiceRequestInsert {
  const message = formData.contact.notes.trim()
  const requestDescription = formData.modernization.requestDescription.trim()
  const schedulingNote = formData.scheduling.schedulingNote.trim()
  const serviceArea = getServiceAreaAssessment(formData.property.city)

  return {
    id: requestId,
    service_type: "futeskorszerusites",
    status: "uj",
    full_name: formData.contact.name.trim(),
    phone: formData.contact.phone.trim(),
    email: formData.contact.email.trim(),
    city: formData.property.city.trim(),
    property_type: formData.property.propertyType.trim(),
    property_area: formData.property.area.trim(),
    current_boiler_type: formData.property.currentHeatingSystem.trim(),
    boiler_status: formData.modernization.heatSourceStatus.trim(),
    replacement_reason: formData.modernization.modernizationGoal.trim(),
    message: message || null,
    form_data_json: {
      serviceType: "futeskorszerusites",
      property: formData.property,
      modernization: {
        ...formData.modernization,
        requestDescription,
      },
      contact: {
        ...formData.contact,
        notes: message,
      },
      scheduling: {
        ...formData.scheduling,
        schedulingNote,
      },
      serviceArea: {
        assessedCity: serviceArea.assessedCity,
        isWithinSupportedArea: serviceArea.isWithinSupportedArea,
        matchedSupportedCity: serviceArea.matchedSupportedCity,
      },
    },
  }
}

export function buildFaultReportInsert(
  requestId: string,
  formData: FaultReportInquiryData
): ServiceRequestInsert {
  const message = formData.contact.notes.trim()
  const description = formData.fault.description.trim()
  const schedulingNote = formData.scheduling.schedulingNote.trim()
  const serviceArea = getServiceAreaAssessment(formData.contact.city)

  return {
    id: requestId,
    service_type: "hibabejelentes",
    status: "uj",
    full_name: formData.contact.name.trim(),
    phone: formData.contact.phone.trim(),
    email: formData.contact.email.trim(),
    city: formData.contact.city.trim(),
    property_type: "Hibabejelentés",
    property_area: "Nem releváns",
    current_boiler_type: formData.fault.faultType.trim(),
    boiler_status: formData.fault.urgency.trim(),
    replacement_reason: description,
    message: message || null,
    form_data_json: {
      serviceType: "hibabejelentes",
      fault: {
        ...formData.fault,
        description,
      },
      contact: {
        ...formData.contact,
        notes: message,
      },
      scheduling: {
        ...formData.scheduling,
        schedulingNote,
      },
      serviceArea: {
        assessedCity: serviceArea.assessedCity,
        isWithinSupportedArea: serviceArea.isWithinSupportedArea,
        matchedSupportedCity: serviceArea.matchedSupportedCity,
      },
    },
  }
}

export function buildLeakRequestInsert(
  requestId: string,
  formData: LeakRequestInquiryData
): ServiceRequestInsert {
  const message = formData.contact.notes.trim()
  const description = formData.issue.description.trim()
  const schedulingNote = formData.scheduling.schedulingNote.trim()
  const serviceArea = getServiceAreaAssessment(formData.location.city)

  return {
    id: requestId,
    service_type: "csotores_szivargas",
    status: "uj",
    full_name: formData.contact.name.trim(),
    phone: formData.contact.phone.trim(),
    email: formData.contact.email.trim(),
    city: formData.location.city.trim(),
    property_type: "Csőtörés / szivárgás",
    property_area: "Nem releváns",
    current_boiler_type: formData.issue.affectedArea.trim(),
    boiler_status: formData.issue.leakActive.trim(),
    replacement_reason: formData.issue.damageLevel.trim(),
    message: message || null,
    form_data_json: {
      serviceType: "csotores_szivargas",
      issue: {
        ...formData.issue,
        description,
      },
      location: formData.location,
      contact: {
        ...formData.contact,
        notes: message,
      },
      scheduling: {
        ...formData.scheduling,
        schedulingNote,
      },
      serviceArea: {
        assessedCity: serviceArea.assessedCity,
        isWithinSupportedArea: serviceArea.isWithinSupportedArea,
        matchedSupportedCity: serviceArea.matchedSupportedCity,
      },
    },
  }
}

export function buildPlumbingRequestInsert(
  requestId: string,
  formData: PlumbingRequestInquiryData
): ServiceRequestInsert {
  const message = formData.contact.notes.trim()
  const description = formData.plumbing.description.trim()
  const schedulingNote = formData.scheduling.schedulingNote.trim()
  const serviceArea = getServiceAreaAssessment(formData.location.city)

  return {
    id: requestId,
    service_type: "vizszereles",
    status: "uj",
    full_name: formData.contact.name.trim(),
    phone: formData.contact.phone.trim(),
    email: formData.contact.email.trim(),
    city: formData.location.city.trim(),
    property_type: "Vízszerelés",
    property_area: "Nem releváns",
    current_boiler_type: formData.plumbing.workType.trim(),
    boiler_status: formData.plumbing.urgency.trim(),
    replacement_reason: description,
    message: message || null,
    form_data_json: {
      serviceType: "vizszereles",
      plumbing: {
        ...formData.plumbing,
        description,
      },
      location: formData.location,
      contact: {
        ...formData.contact,
        notes: message,
      },
      scheduling: {
        ...formData.scheduling,
        schedulingNote,
      },
      serviceArea: {
        assessedCity: serviceArea.assessedCity,
        isWithinSupportedArea: serviceArea.isWithinSupportedArea,
        matchedSupportedCity: serviceArea.matchedSupportedCity,
      },
    },
  }
}

export function buildHeatPumpInstallationInsert(
  requestId: string,
  formData: HeatPumpInstallationInquiryData
): ServiceRequestInsert {
  const message = formData.contact.notes.trim()
  const requestDescription = formData.system.requestDescription.trim()
  const schedulingNote = formData.scheduling.schedulingNote.trim()
  const serviceArea = getServiceAreaAssessment(formData.property.city)

  return {
    id: requestId,
    service_type: "hoszivattyu_telepites",
    status: "uj",
    full_name: formData.contact.name.trim(),
    phone: formData.contact.phone.trim(),
    email: formData.contact.email.trim(),
    city: formData.property.city.trim(),
    property_type: formData.property.propertyType.trim(),
    property_area: formData.property.area.trim(),
    current_boiler_type: formData.system.heatEmitterType.trim(),
    boiler_status: formData.property.projectMode.trim(),
    replacement_reason: formData.system.projectStage.trim(),
    message: message || null,
    form_data_json: {
      serviceType: "hoszivattyu_telepites",
      property: formData.property,
      system: {
        ...formData.system,
        requestDescription,
      },
      contact: {
        ...formData.contact,
        notes: message,
      },
      scheduling: {
        ...formData.scheduling,
        schedulingNote,
      },
      serviceArea: {
        assessedCity: serviceArea.assessedCity,
        isWithinSupportedArea: serviceArea.isWithinSupportedArea,
        matchedSupportedCity: serviceArea.matchedSupportedCity,
      },
    },
  }
}

export function buildBuildingServicesInsert(
  requestId: string,
  formData: BuildingServicesInquiryData
): ServiceRequestInsert {
  const message = formData.contact.notes.trim()
  const requestDescription = formData.scope.requestDescription.trim()
  const schedulingNote = formData.scheduling.schedulingNote.trim()
  const serviceArea = getServiceAreaAssessment(formData.project.city)

  return {
    id: requestId,
    service_type: "komplett_epuletgepeszeti_kivitelezes",
    status: "uj",
    full_name: formData.contact.name.trim(),
    phone: formData.contact.phone.trim(),
    email: formData.contact.email.trim(),
    city: formData.project.city.trim(),
    property_type: formData.project.propertyType.trim(),
    property_area: formData.project.area.trim(),
    current_boiler_type: formData.project.projectType.trim(),
    boiler_status: formData.scope.projectStage.trim(),
    replacement_reason: formData.scope.scopeFocus.trim(),
    message: message || null,
    form_data_json: {
      serviceType: "komplett_epuletgepeszeti_kivitelezes",
      project: formData.project,
      scope: {
        ...formData.scope,
        requestDescription,
      },
      contact: {
        ...formData.contact,
        notes: message,
      },
      scheduling: {
        ...formData.scheduling,
        schedulingNote,
      },
      serviceArea: {
        assessedCity: serviceArea.assessedCity,
        isWithinSupportedArea: serviceArea.isWithinSupportedArea,
        matchedSupportedCity: serviceArea.matchedSupportedCity,
      },
    },
  }
}
