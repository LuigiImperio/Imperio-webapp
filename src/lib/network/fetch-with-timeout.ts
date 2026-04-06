function getCombinedSignal(
  initSignal: RequestInit["signal"],
  timeoutSignal: AbortSignal
) {
  if (!initSignal) {
    return timeoutSignal
  }

  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([initSignal, timeoutSignal])
  }

  const controller = new AbortController()

  const abort = () => controller.abort()

  if (initSignal.aborted || timeoutSignal.aborted) {
    abort()
    return controller.signal
  }

  initSignal.addEventListener("abort", abort, { once: true })
  timeoutSignal.addEventListener("abort", abort, { once: true })

  return controller.signal
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 15000
) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, {
      ...init,
      signal: getCombinedSignal(init.signal, controller.signal),
    })
  } finally {
    clearTimeout(timeout)
  }
}
