import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bzgeaynoewwxtaocmeyz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6Z2VheW5vZXd3eHRhb2NtZXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDgwMTAsImV4cCI6MjA2Mjg4NDAxMH0.C13QEWphQDxwtb1Gy74LnSdNLSCTZFOIsXHTzxlBgAw";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase credentials");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;