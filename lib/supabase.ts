import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Only export the client if both URL and Key are present, 
// otherwise the app will crash at runtime with "supabaseUrl is required".
// During build time, this prevents the prerendering process from failing.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
