import "server-only"

import { createClient } from "@supabase/supabase-js"

import {
  ConfigurationError,
  getOptionalServerEnv,
  getRequiredServerEnv,
} from "@/lib/config/server-env"
import type { Database } from "@/lib/supabase/database.types"

const requiredSupabaseServerEnvNames = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const

export function getSupabaseServerConfigurationState() {
  const missingEnvNames = requiredSupabaseServerEnvNames.filter(
    (envName) => !getOptionalServerEnv(envName)
  )

  return {
    isConfigured: missingEnvNames.length === 0,
    missingEnvNames,
  }
}

export function assertSupabaseServerConfiguration(context: string) {
  const { isConfigured, missingEnvNames } = getSupabaseServerConfigurationState()

  if (!isConfigured) {
    throw new ConfigurationError(
      `${context}: hiányzó Supabase szerveroldali konfiguráció (${missingEnvNames.join(", ")}).`,
      [...missingEnvNames]
    )
  }
}

function getSupabaseServerEnvironment() {
  assertSupabaseServerConfiguration("Szerveroldali Supabase kliens")

  const supabaseUrl = getRequiredServerEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    "Szerveroldali Supabase kliens"
  )
  const supabaseServiceRoleKey = getRequiredServerEnv(
    "SUPABASE_SERVICE_ROLE_KEY",
    "Szerveroldali Supabase kliens"
  )

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
  }
}

export function getSupabaseServerClient() {
  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseServerEnvironment()

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
