"use client"

import { useEffect, useMemo, useReducer, useRef, type ReactNode } from "react"

import { GuidedRequestModal } from "@/components/guided-request/guided-request-modal"
import { GuidedRequestContext } from "@/components/guided-request/guided-request-context"
import {
  everydayTopics,
  scopePresetByTopic,
  stepLabelMap,
  topicMeta,
} from "@/components/guided-request/guided-request-data"
import {
  getAreaNote,
  getCurrentScreenKey,
  getHeaderLabel,
  getMailHref,
  getSummaryLines,
} from "@/components/guided-request/guided-request-logic"
import type {
  Branch,
  FormState,
  GuidedRequestAction,
  GuidedRequestState,
  PhotoAsset,
  StepKey,
  TopicKey,
} from "@/components/guided-request/guided-request-types"
import { publicAnalyticsEventNames } from "@/lib/analytics/public-events"
import { trackPublicEvent } from "@/lib/analytics/tracker"

const emptyForm: FormState = {
  freeText: "",
  propertyType: "",
  postalCode: "",
  city: "",
  name: "",
  phone: "",
  email: "",
  contactTime: "",
  note: "",
  scope: "",
}

function resetWizard(extra: Partial<GuidedRequestState> = {}): GuidedRequestState {
  return {
    formOpen: false,
    branch: null,
    steps: [],
    step: 0,
    viaBranch: false,
    topic: null,
    symptoms: [],
    submitted: false,
    contactError: "",
    form: { ...emptyForm },
    photos: [],
    ...extra,
  }
}

function reducer(state: GuidedRequestState, action: GuidedRequestAction): GuidedRequestState {
  switch (action.type) {
    case "OPEN_GENERAL":
      return resetWizard({ formOpen: true, branch: null, steps: [], viaBranch: false })

    case "OPEN_URGENT":
      return resetWizard({
        formOpen: true,
        branch: "surgos",
        steps: ["urgent", "summary"],
        viaBranch: false,
      })

    case "OPEN_TOPIC": {
      const { topic } = action
      const everyday = everydayTopics.includes(topic)
      const branch: Branch = everyday ? "hetkoznapi" : "projekt"
      const steps: StepKey[] = everyday
        ? ["symptoms", "location", "contact", "extra", "summary"]
        : ["scope", "location", "contact", "extra", "summary"]
      const preset = scopePresetByTopic[topic]
      const form = preset ? { ...emptyForm, scope: preset } : { ...emptyForm }

      return resetWizard({ formOpen: true, branch, steps, viaBranch: false, topic, form })
    }

    case "PICK_URGENT":
      return resetWizard({
        formOpen: true,
        branch: "surgos",
        steps: ["urgent", "summary"],
        viaBranch: true,
      })

    case "PICK_EVERYDAY":
      return resetWizard({
        formOpen: true,
        branch: "hetkoznapi",
        steps: ["topic", "symptoms", "location", "contact", "extra", "summary"],
        viaBranch: true,
      })

    case "PICK_PROJECT":
      return resetWizard({
        formOpen: true,
        branch: "projekt",
        steps: ["scope", "location", "contact", "extra", "summary"],
        viaBranch: true,
      })

    case "SELECT_TOPIC":
      return { ...state, topic: action.topic, symptoms: [], step: state.step + 1 }

    case "TOGGLE_SYMPTOM": {
      const has = state.symptoms.includes(action.label)
      return {
        ...state,
        symptoms: has
          ? state.symptoms.filter((label) => label !== action.label)
          : [...state.symptoms, action.label],
      }
    }

    case "SET_FIELD":
      return {
        ...state,
        form: { ...state.form, [action.key]: action.value },
        contactError: "",
      }

    case "ADD_PHOTOS":
      return { ...state, photos: [...state.photos, ...action.photos] }

    case "REMOVE_PHOTO":
      return { ...state, photos: state.photos.filter((_, index) => index !== action.index) }

    case "NEXT": {
      const key = getCurrentScreenKey(state)

      if (key === "contact") {
        const { name, phone } = state.form
        if (!name.trim() || phone.replace(/\D/g, "").length < 6) {
          return {
            ...state,
            contactError: "Kérjük, adja meg a nevét és egy elérhető telefonszámot.",
          }
        }
      }

      return {
        ...state,
        step: Math.min(state.step + 1, Math.max(state.steps.length - 1, 0)),
        contactError: "",
      }
    }

    case "PREV": {
      if (state.step === 0) {
        if (state.viaBranch) {
          return { ...state, branch: null, step: 0 }
        }
        return { ...state, formOpen: false }
      }
      return { ...state, step: Math.max(state.step - 1, 0) }
    }

    case "SUBMIT":
      return { ...state, submitted: true }

    case "CLOSE":
      return { ...state, formOpen: false }

    default:
      return state
  }
}

export function GuidedRequestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => resetWizard())

  useEffect(() => {
    if (!state.formOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [state.formOpen])

  useEffect(() => {
    if (!state.formOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dispatch({ type: "CLOSE" })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [state.formOpen])

  const wasOpenRef = useRef(false)
  useEffect(() => {
    if (state.formOpen && !wasOpenRef.current) {
      trackPublicEvent(publicAnalyticsEventNames.formStarted, {
        source_page: "homepage",
        source_section: "guided_request",
        branch: state.branch ?? "unset",
      })
    }
    wasOpenRef.current = state.formOpen
  }, [state.formOpen, state.branch])

  const screenKey = useMemo(() => getCurrentScreenKey(state), [state])
  const headerLabel = useMemo(() => getHeaderLabel(state), [state])
  const areaNote = useMemo(
    () => (screenKey === "location" ? getAreaNote(state.form.city) : ""),
    [screenKey, state.form.city]
  )
  const summaryLines = useMemo(() => getSummaryLines(state), [state])
  const mailHref = useMemo(() => getMailHref(state), [state])

  const showProgress = state.branch !== null && !state.submitted && screenKey !== "urgent"
  const total = state.steps.length
  const stepNum = state.step + 1
  const progressPct = showProgress ? `${Math.round((stepNum / Math.max(total, 1)) * 100)}%` : "0%"
  const showFooterNav = state.formOpen && !state.submitted && screenKey !== "branch"
  const showNext = screenKey !== "summary"
  const isFirst = state.step === 0
  const backLabel = isFirst && !state.viaBranch ? "Mégse" : "Vissza"
  const nextLabel = screenKey === "urgent" || screenKey === "extra" ? "Összegzéshez" : "Tovább"
  const topicLabel = state.topic ? topicMeta[state.topic].label : ""

  function next() {
    const fromStep = screenKey
    dispatch({ type: "NEXT" })
    trackPublicEvent(publicAnalyticsEventNames.formStepCompleted, {
      source_page: "homepage",
      source_section: "guided_request",
      branch: state.branch ?? "unset",
      from_step: fromStep,
    })
  }

  function submit() {
    trackPublicEvent(publicAnalyticsEventNames.serviceRequestSubmitted, {
      source_page: "homepage",
      source_section: "guided_request",
      branch: state.branch ?? "unset",
      submit_method: "mailto",
    })
    setTimeout(() => dispatch({ type: "SUBMIT" }), 60)
  }

  const value = {
    state,
    screenKey,
    headerLabel,
    showProgress,
    stepLabel: stepLabelMap[state.steps[state.step]] ?? "",
    stepCounter: showProgress ? `${stepNum} / ${total}` : "",
    progressPct,
    showFooterNav,
    showNext,
    backLabel,
    nextLabel,
    topicLabel,
    areaNote,
    summaryLines,
    mailHref,
    hasPhotos: state.photos.length > 0,
    openGeneral: () => dispatch({ type: "OPEN_GENERAL" }),
    openUrgent: () => dispatch({ type: "OPEN_URGENT" }),
    openTopic: (topic: TopicKey) => dispatch({ type: "OPEN_TOPIC", topic }),
    pickUrgent: () => dispatch({ type: "PICK_URGENT" }),
    pickEveryday: () => dispatch({ type: "PICK_EVERYDAY" }),
    pickProject: () => dispatch({ type: "PICK_PROJECT" }),
    selectTopic: (topic: TopicKey) => dispatch({ type: "SELECT_TOPIC", topic }),
    toggleSymptom: (label: string) => dispatch({ type: "TOGGLE_SYMPTOM", label }),
    setField: (key: keyof FormState, value: string) => dispatch({ type: "SET_FIELD", key, value }),
    addPhotos: (photos: PhotoAsset[]) => dispatch({ type: "ADD_PHOTOS", photos }),
    removePhoto: (index: number) => dispatch({ type: "REMOVE_PHOTO", index }),
    next,
    prev: () => dispatch({ type: "PREV" }),
    close: () => dispatch({ type: "CLOSE" }),
    submit,
  }

  return (
    <GuidedRequestContext.Provider value={value}>
      {children}
      {state.formOpen && <GuidedRequestModal />}
    </GuidedRequestContext.Provider>
  )
}
