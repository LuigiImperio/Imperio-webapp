export const adminAccessCookieName = "imperio_admin_access"
export const adminAccessCookiePath = "/admin"
export const adminAccessCookieMaxAgeSeconds = 60 * 60 * 8
const adminAccessCookieValuePrefix = "sha256:"

export async function createAdminAccessCookieValue(token: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token)
  )
  const hash = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("")

  return `${adminAccessCookieValuePrefix}${hash}`
}

export function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/")
}
