export type Branch = "surgos" | "hetkoznapi" | "projekt" | null

export type TopicKey =
  | "viz"
  | "gaz"
  | "futes"
  | "kazan"
  | "hoszivattyu"
  | "furdo"
  | "komplett"

export type StepKey =
  | "urgent"
  | "topic"
  | "symptoms"
  | "scope"
  | "location"
  | "contact"
  | "extra"
  | "summary"

export type ScreenKey = "branch" | StepKey | "success"

export type FormState = {
  freeText: string
  propertyType: string
  postalCode: string
  city: string
  name: string
  phone: string
  email: string
  contactTime: string
  note: string
  scope: string
}

export type PhotoAsset = { name: string; url: string }

export type GuidedRequestState = {
  formOpen: boolean
  branch: Branch
  steps: StepKey[]
  step: number
  viaBranch: boolean
  topic: TopicKey | null
  symptoms: string[]
  submitted: boolean
  contactError: string
  form: FormState
  photos: PhotoAsset[]
}

export type SummaryLine = { label: string; value: string }

export type GuidedRequestAction =
  | { type: "OPEN_GENERAL" }
  | { type: "OPEN_URGENT" }
  | { type: "OPEN_TOPIC"; topic: TopicKey }
  | { type: "PICK_URGENT" }
  | { type: "PICK_EVERYDAY" }
  | { type: "PICK_PROJECT" }
  | { type: "SELECT_TOPIC"; topic: TopicKey }
  | { type: "TOGGLE_SYMPTOM"; label: string }
  | { type: "SET_FIELD"; key: keyof FormState; value: string }
  | { type: "ADD_PHOTOS"; photos: PhotoAsset[] }
  | { type: "REMOVE_PHOTO"; index: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SUBMIT" }
  | { type: "CLOSE" }
