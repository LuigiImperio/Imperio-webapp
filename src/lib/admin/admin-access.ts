import "server-only"

import { getAdminAccessState } from "@/lib/config/server-env"

export function normalizeSearchParam(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export function resolveAdminAccess(providedToken: string | string[] | undefined) {
  return getAdminAccessState(normalizeSearchParam(providedToken))
}
