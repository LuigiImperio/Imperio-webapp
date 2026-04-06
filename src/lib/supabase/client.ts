import { createClient, type SupabaseClient } from "@supabase/supabase-js"

import { getRequiredPublicEnv } from "@/lib/config/public-env"
import type { Database } from "@/lib/supabase/database.types"

let browserClient: SupabaseClient<Database> | null = null

function getSupabaseEnvironment() {
  const supabaseUrl = getRequiredPublicEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    "Böngészős Supabase kliens"
  )
  const supabaseAnonKey = getRequiredPublicEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "Böngészős Supabase kliens"
  )

  return {
    supabaseUrl,
    supabaseAnonKey,
  }
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseEnvironment()

    browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  }

  return browserClient
}
