type ErrorDetails = Record<string, unknown>

function toLogPayload(error: unknown) {
  if (!(error instanceof Error)) {
    return {
      message: String(error),
    }
  }

  const record = error as Error & {
    code?: string
    status?: number
    envName?: string
    envNames?: string[]
  }

  return {
    name: record.name,
    message: record.message,
    ...(record.code ? { code: record.code } : {}),
    ...(typeof record.status === "number" ? { status: record.status } : {}),
    ...(record.envName ? { envName: record.envName } : {}),
    ...(record.envNames?.length ? { envNames: record.envNames } : {}),
  }
}

export function getUserFacingErrorMessage(
  error: unknown,
  fallbackMessage: string
) {
  if (error instanceof Error) {
    const message = error.message.trim()

    if (message) {
      return message
    }
  }

  return fallbackMessage
}

export function logServerError(
  context: string,
  error: unknown,
  details: ErrorDetails = {}
) {
  console.error(context, {
    ...details,
    ...toLogPayload(error),
  })
}

export function logClientError(
  context: string,
  error: unknown,
  details: ErrorDetails = {}
) {
  if (process.env.NODE_ENV === "production") {
    return
  }

  console.error(context, {
    ...details,
    ...toLogPayload(error),
  })
}
