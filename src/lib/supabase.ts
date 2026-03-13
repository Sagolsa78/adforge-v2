import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PROJECT_URL } from "@/config";

const SUPABASE_URL = SUPABASE_PROJECT_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || SUPABASE_URL.includes("cjkovzjojvcjborahmgr")) {
  console.warn("Supabase: Using fallback URL or missing configuration:", SUPABASE_URL);
}

if (!SUPABASE_ANON_KEY) {
  console.error("Supabase: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing! Auth will fail.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
